import { system, world } from "@minecraft/server";

const PREFIX = "[Portal4D]";
const CUSTOM_DIMENSION_ID = "portal4d:espaco_4d";
const CENTER = { x: 0, y: 80, z: 0 };
const ARRIVAL = { x: 0, y: 80, z: -16 };
const PORTAL_TRIGGER_BLOCK = "minecraft:sea_lantern";
const PORTAL_WALK_CHECK_INTERVAL_TICKS = 10;
const TELEPORT_COOLDOWN_TICKS = 80;
const INTERACTION_COOLDOWN_TICKS = 14;
const RECOVERY_SCRIPT_EVENT_ID = "portal4d:recuperar";
const NEARBY_PORTAL_SCRIPT_EVENT_ID = "portal4d:montar_proximo";
const COORDINATE_PORTAL_SCRIPT_EVENT_ID = "portal4d:montar_coordenada";
const ERA_BLOCKS = new Map([
  ["minecraft:copper_block", { id: "origem", title: "ERA 1 — ORIGEM", color: "§6" }],
  ["minecraft:gold_block", { id: "agora", title: "ERA 2 — AGORA", color: "§e" }],
  ["minecraft:diamond_block", { id: "amanha", title: "ERA 3 — AMANHÃ", color: "§b" }],
]);
const ERA_CONTROLS = {
  origem: { x: -7, y: 80, z: -1 },
  agora: { x: 0, y: 80, z: 3 },
  amanha: { x: 7, y: 80, z: -1 },
};
const ERA_TAGS = {
  origem: "portal4d_era_origem",
  agora: "portal4d_era_agora",
  amanha: "portal4d_era_amanha",
};

let customDimensionRegistered = false;
let customDimensionError = "startup ainda não executado";
let worldBuilt = false;
let currentEra = "agora";
const playerOrigins = new Map();
const cooldowns = new Map();

function log(message) {
  console.warn(`${PREFIX} ${message}`);
}

function keyFor(player) {
  return player.id ?? player.name;
}

function getDimensionSafe(id, shouldLog = true) {
  try {
    return world.getDimension(id);
  } catch (error) {
    if (shouldLog) log(`Dimensão indisponível '${id}': ${error}`);
    return undefined;
  }
}

function blockId(dimension, location) {
  try {
    return dimension.getBlock(location)?.typeId;
  } catch {
    return undefined;
  }
}

function setBlock(dimension, location, id) {
  try {
    dimension.getBlock(location)?.setType(id);
  } catch (error) {
    log(`Falha ao colocar ${id} em ${location.x} ${location.y} ${location.z}: ${error}`);
  }
}

function line(dimension, start, end, id) {
  const steps = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y), Math.abs(end.z - start.z));
  for (let i = 0; i <= steps; i += 1) {
    const t = steps === 0 ? 0 : i / steps;
    setBlock(dimension, {
      x: Math.round(start.x + (end.x - start.x) * t),
      y: Math.round(start.y + (end.y - start.y) * t),
      z: Math.round(start.z + (end.z - start.z) * t),
    }, id);
  }
}

function cuboid(dimension, a, b, id) {
  for (let x = a.x; x <= b.x; x += 1) {
    for (let y = a.y; y <= b.y; y += 1) {
      for (let z = a.z; z <= b.z; z += 1) setBlock(dimension, { x, y, z }, id);
    }
  }
}

function runCommandSafe(dimension, command, context) {
  try {
    const runner = dimension.runCommandAsync ?? dimension.runCommand;
    const result = runner?.call(dimension, command);
    result?.catch?.((error) => log(`Falha no comando ${context}: ${error}`));
  } catch (error) {
    log(`Falha ao iniciar ${context}: ${error}`);
  }
}

function clearPreviousWorld(dimension) {
  // Quatro volumes abaixo do limite do /fill removem integralmente as arenas antigas.
  for (const [x1, x2] of [[-30, -1], [0, 30]]) {
    for (const [z1, z2] of [[-30, -1], [0, 30]]) {
      runCommandSafe(dimension, `fill ${x1} 76 ${z1} ${x2} 104 ${z2} air`, "apagamento da experiência anterior");
    }
  }
}

function buildChronosDeck(dimension) {
  // Uma nave circular substitui totalmente laboratório, tesseracto, fatias e salas antigas.
  for (let x = -20; x <= 20; x += 1) {
    for (let z = -20; z <= 20; z += 1) {
      const distance = Math.sqrt(x * x + z * z);
      if (distance > 20) continue;
      const rim = distance >= 18.7;
      const cross = Math.abs(x) <= 1 || Math.abs(z) <= 1;
      setBlock(dimension, { x, y: 79, z }, rim ? "minecraft:sea_lantern" : cross ? "minecraft:polished_diorite" : "minecraft:deepslate_tiles");
      if (rim) {
        setBlock(dimension, { x, y: 80, z }, "minecraft:tinted_glass");
        setBlock(dimension, { x, y: 81, z }, "minecraft:purple_stained_glass");
      }
    }
  }

  // Portal de chegada e corredor de orientação.
  for (const x of [-3, 3]) line(dimension, { x, y: 80, z: -17 }, { x, y: 86, z: -17 }, "minecraft:crying_obsidian");
  line(dimension, { x: -3, y: 86, z: -17 }, { x: 3, y: 86, z: -17 }, "minecraft:crying_obsidian");
  for (let z = -16; z <= -5; z += 1) line(dimension, { x: -2, y: 79, z }, { x: 2, y: 79, z }, z % 2 === 0 ? "minecraft:sea_lantern" : "minecraft:polished_blackstone_bricks");

  // Relógio monumental central, visto de qualquer ponto da nave.
  cuboid(dimension, { x: -4, y: 79, z: -4 }, { x: 4, y: 79, z: 4 }, "minecraft:quartz_block");
  for (let y = 80; y <= 91; y += 1) setBlock(dimension, { x: 0, y, z: 0 }, y % 3 === 0 ? "minecraft:sea_lantern" : "minecraft:amethyst_block");
  for (const direction of [[8, 0], [-8, 0], [0, 8], [0, -8]]) {
    line(dimension, { x: 0, y: 86, z: 0 }, { x: direction[0], y: 86, z: direction[1] }, "minecraft:purple_stained_glass");
  }

  // Três consoles claros: passado, presente e futuro.
  for (const [era, control] of Object.entries(ERA_CONTROLS)) {
    const material = era === "origem" ? "minecraft:copper_block" : era === "agora" ? "minecraft:gold_block" : "minecraft:diamond_block";
    cuboid(dimension, { x: control.x - 2, y: 79, z: control.z - 2 }, { x: control.x + 2, y: 79, z: control.z + 2 }, material);
    setBlock(dimension, control, material);
    setBlock(dimension, { x: control.x, y: control.y + 1, z: control.z }, "minecraft:sea_lantern");
  }

  setBlock(dimension, { x: 0, y: 80, z: -12 }, "minecraft:lectern");
  setBlock(dimension, { x: 0, y: 80, z: -18 }, "minecraft:lodestone");
  renderEra(dimension, "agora");
  worldBuilt = true;
  log("Nave Cronos construída do zero; arena anterior apagada no envelope X/Z=-30..30, Y=76..104.");
}

function renderEra(dimension, era) {
  currentEra = era;
  // O mesmo setor muda com o tempo: isso torna a quarta dimensão uma sequência de estados, não um diagrama abstrato.
  cuboid(dimension, { x: -15, y: 80, z: 7 }, { x: 15, y: 90, z: 17 }, "minecraft:air");
  const floor = era === "origem" ? "minecraft:moss_block" : era === "agora" ? "minecraft:smooth_stone" : "minecraft:white_concrete";
  cuboid(dimension, { x: -15, y: 79, z: 7 }, { x: 15, y: 79, z: 17 }, floor);

  if (era === "origem") {
    for (const x of [-12, -6, 0, 6, 12]) {
      line(dimension, { x, y: 80, z: 12 }, { x, y: 84, z: 12 }, "minecraft:oak_log");
      cuboid(dimension, { x: x - 2, y: 84, z: 10 }, { x: x + 2, y: 87, z: 14 }, "minecraft:oak_leaves");
    }
    line(dimension, { x: -15, y: 79, z: 9 }, { x: 15, y: 79, z: 9 }, "minecraft:water");
  } else if (era === "agora") {
    for (const x of [-12, -6, 0, 6, 12]) {
      cuboid(dimension, { x: x - 2, y: 80, z: 10 }, { x: x + 2, y: 83 + Math.abs(x % 5), z: 14 }, "minecraft:stone_bricks");
      setBlock(dimension, { x, y: 84 + Math.abs(x % 5), z: 12 }, "minecraft:sea_lantern");
    }
    line(dimension, { x: -15, y: 79, z: 9 }, { x: 15, y: 79, z: 9 }, "minecraft:yellow_concrete");
  } else {
    for (const x of [-12, -6, 0, 6, 12]) {
      line(dimension, { x, y: 82, z: 12 }, { x, y: 88, z: 12 }, "minecraft:end_rod");
      cuboid(dimension, { x: x - 2, y: 88, z: 10 }, { x: x + 2, y: 89, z: 14 }, "minecraft:light_blue_stained_glass");
    }
    line(dimension, { x: -15, y: 80, z: 9 }, { x: 15, y: 80, z: 9 }, "minecraft:cyan_stained_glass");
  }
  setBlock(dimension, { x: 0, y: 80, z: 16 }, "minecraft:beacon");
}

function ensureWorld(force = false) {
  if (!customDimensionRegistered) return undefined;
  const dimension = getDimensionSafe(CUSTOM_DIMENSION_ID, false);
  if (!dimension) return undefined;
  if (force || !worldBuilt || blockId(dimension, { x: 0, y: 79, z: 0 }) !== "minecraft:quartz_block") {
    clearPreviousWorld(dimension);
    system.runTimeout(() => buildChronosDeck(dimension), 8);
  }
  return dimension;
}

function onCooldown(player, scope, ticks) {
  const key = `${keyFor(player)}:${scope}`;
  const available = cooldowns.get(key) ?? 0;
  if (system.currentTick < available) return true;
  cooldowns.set(key, system.currentTick + ticks);
  return false;
}

function distanceSquared(a, b) {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
}

function hasAllEraTags(player) {
  return Object.values(ERA_TAGS).every((tag) => player.hasTag(tag));
}

function activateEra(player, block, era) {
  if (onCooldown(player, "era", INTERACTION_COOLDOWN_TICKS)) return;
  renderEra(block.dimension, era.id);
  player.addTag(ERA_TAGS[era.id]);
  const visited = Object.values(ERA_TAGS).filter((tag) => player.hasTag(tag)).length;
  player.onScreenDisplay?.setTitle(era.title, { subtitle: `O mesmo lugar em outro momento — ${visited}/3 eras visitadas` });
  player.sendMessage(`${PREFIX} ${era.color}${era.title}:§r você mudou o TEMPO do mesmo lugar. Posição igual, estado diferente.`);
  if (hasAllEraTags(player)) {
    setBlock(block.dimension, { x: 0, y: 81, z: 16 }, "minecraft:sea_lantern");
    player.onScreenDisplay?.setTitle("LINHA DO TEMPO COMPLETA", { subtitle: "Você usou o tempo como quarta coordenada." });
    player.sendMessage(`${PREFIX} Missão concluída: X, Y e Z dizem ONDE; o momento diz QUANDO. O Mundo 4D desta nave é a história de um mesmo espaço.`);
    log(`Linha do tempo concluída por ${player.name}.`);
  }
  log(`Era ${era.id} ativada por ${player.name}; visitadas=${visited}/3.`);
}

function saveOrigin(player) {
  playerOrigins.set(keyFor(player), { dimensionId: player.dimension.id, location: { ...player.location } });
}

function teleport(player, dimension, location, message) {
  if (!dimension) {
    player.sendMessage(`${PREFIX} A dimensão 4D não está disponível: ${customDimensionError}.`);
    return;
  }
  try {
    player.teleport({ x: location.x + 0.5, y: location.y, z: location.z + 0.5 }, { dimension, rotation: { x: 0, y: 180 } });
    player.sendMessage(`${PREFIX} ${message}`);
  } catch (error) {
    log(`Falha no teleporte de ${player.name}: ${error}`);
  }
}

function enterWorld(player, location, mode) {
  if (onCooldown(player, "teleport", TELEPORT_COOLDOWN_TICKS)) return;
  saveOrigin(player);
  const dimension = ensureWorld();
  system.runTimeout(() => {
    teleport(player, dimension, ARRIVAL, "Bem-vindo à NAVE CRONOS. Sua missão é visitar ORIGEM, AGORA e AMANHÃ.");
    system.runTimeout(() => player.sendMessage(`${PREFIX} Toque nos três consoles: COBRE, OURO e DIAMANTE. Observe o mesmo cenário mudar sem você trocar de lugar.`), 40);
  }, worldBuilt ? 1 : 12);
  log(`Entrada de ${player.name} por ${mode} em ${location.x} ${location.y} ${location.z}.`);
}

function returnToOrigin(player) {
  if (onCooldown(player, "teleport", TELEPORT_COOLDOWN_TICKS)) return;
  const origin = playerOrigins.get(keyFor(player));
  if (!origin) {
    player.sendMessage(`${PREFIX} Origem não encontrada nesta sessão.`);
    return;
  }
  teleport(player, getDimensionSafe(origin.dimensionId), origin.location, "Retorno concluído. Você visitou o mesmo lugar em três tempos.");
}

function isPortalFrameCenter(dimension, center) {
  const { x, y, z } = center;
  return blockId(dimension, center) === PORTAL_TRIGGER_BLOCK
    && blockId(dimension, { x: x - 3, y: y + 1, z }) === "minecraft:crying_obsidian"
    && blockId(dimension, { x: x + 3, y: y + 1, z }) === "minecraft:crying_obsidian"
    && blockId(dimension, { x, y: y + 5, z }) === "minecraft:crying_obsidian";
}

function portalCenterNearPlayer(player) {
  const p = player.location;
  for (let y = Math.floor(p.y) - 2; y <= Math.floor(p.y); y += 1) {
    for (let x = Math.floor(p.x) - 3; x <= Math.floor(p.x) + 3; x += 1) {
      for (let z = Math.floor(p.z) - 2; z <= Math.floor(p.z) + 2; z += 1) {
        const center = { x, y, z };
        if (isPortalFrameCenter(player.dimension, center)
          && Math.abs(p.x - (x + 0.5)) <= 3.25
          && p.y >= y + 0.8 && p.y <= y + 5.2
          && Math.abs(p.z - (z + 0.5)) <= 2.25) return center;
      }
    }
  }
  return undefined;
}

function isDrySupportedPortalSite(dimension, center) {
  const support = [[0, 0], [-5, -4], [5, -4], [-5, 4], [5, 4], [0, -4], [0, 4], [-5, 0], [5, 0]];
  for (const [dx, dz] of support) {
    const id = blockId(dimension, { x: center.x + dx, y: center.y - 1, z: center.z + dz });
    if (!id || id === "minecraft:air" || id === "minecraft:water" || id === "minecraft:lava") return false;
  }
  for (const h of [0, 3, 6]) {
    for (const [dx, dz] of [[0, 0], [-5, -7], [5, -7], [-5, 4], [5, 4]]) {
      if (blockId(dimension, { x: center.x + dx, y: center.y + h, z: center.z + dz }) !== "minecraft:air") return false;
    }
  }
  return true;
}

function findNearbyPortalSite(dimension, origin, requestedRadius) {
  const radius = Math.max(8, Math.min(32, Number.parseInt(requestedRadius, 10) || 16));
  const candidates = [];
  for (let dx = -radius; dx <= radius; dx += 2) for (let dz = -radius; dz <= radius; dz += 2) candidates.push({ x: origin.x + dx, y: origin.y, z: origin.z + dz });
  candidates.sort((a, b) => distanceSquared(a, origin) - distanceSquared(b, origin));
  return candidates.find((candidate) => isDrySupportedPortalSite(dimension, candidate));
}

function buildPortalAt(dimension, center, player) {
  runCommandSafe(dimension, `execute positioned ${center.x} ${center.y} ${center.z} run function portal_4d/construir_portal`, "construção interna do portal");
  player?.sendMessage(`${PREFIX} Portal solicitado no centro ${center.x} ${center.y} ${center.z}; valide visualmente o envelope.`);
  log(`Portal solicitado no centro ${center.x} ${center.y} ${center.z}.`);
}

function mountPortalNearPlayer(player, message) {
  if (!player || player.dimension.id !== "minecraft:overworld") return;
  const center = findNearbyPortalSite(player.dimension, { x: Math.floor(player.location.x), y: Math.floor(player.location.y), z: Math.floor(player.location.z) }, message);
  if (center) buildPortalAt(player.dimension, center, player);
  else player.sendMessage(`${PREFIX} Nenhum local seguro encontrado; nada foi construído.`);
}

function mountPortalFromCoordinates(message) {
  const parts = `${message ?? ""}`.trim().split(/\s+/).map(Number);
  const [x, y, z, rawRadius = 16] = parts;
  if (parts.length < 3 || ![x, y, z, rawRadius].every(Number.isInteger) || y < -64 || y > 320 || rawRadius < 8 || rawRadius > 32) {
    log(`Parâmetros recusados para montar_coordenada: '${message}'.`);
    return;
  }
  const dimension = getDimensionSafe("minecraft:overworld");
  runCommandSafe(dimension, `tickingarea add circle ${x} ${y} ${z} 3 p4d_portal_busca true`, "carregamento temporário");
  system.runTimeout(() => {
    const center = findNearbyPortalSite(dimension, { x, y, z }, rawRadius);
    if (center) buildPortalAt(dimension, center);
    else log(`Nenhum local seguro encontrado; origem=${x} ${y} ${z}; raio=${rawRadius}.`);
    runCommandSafe(dimension, "tickingarea remove p4d_portal_busca", "limpeza da busca");
  }, 20);
}

function handleInteraction(event) {
  const { player, block } = event;
  if (!player || !block) return;
  if (block.dimension.id === CUSTOM_DIMENSION_ID) {
    const era = ERA_BLOCKS.get(block.typeId);
    if (era && distanceSquared(block.location, ERA_CONTROLS[era.id]) <= 2) {
      activateEra(player, block, era);
      return;
    }
    if (block.typeId === "minecraft:lectern" && distanceSquared(block.location, { x: 0, y: 80, z: -12 }) <= 4) {
      player.sendMessage(`${PREFIX} X/Y/Z dizem onde. Nesta nave, o quarto valor é o TEMPO. Visite cobre, ouro e diamante para comparar o mesmo setor.`);
      return;
    }
    if (block.typeId === "minecraft:lodestone" && distanceSquared(block.location, { x: 0, y: 80, z: -18 }) <= 4) {
      returnToOrigin(player);
      return;
    }
  }
  if (block.typeId === PORTAL_TRIGGER_BLOCK && isPortalFrameCenter(block.dimension, block.location)) enterWorld(player, block.location, "interação");
}

const startup = system.beforeEvents?.startup;
if (startup?.subscribe) {
  startup.subscribe((event) => {
    try {
      event.dimensionRegistry.registerCustomDimension(CUSTOM_DIMENSION_ID);
      customDimensionRegistered = true;
      customDimensionError = "nenhum";
      log(`Dimensão customizada registrada: ${CUSTOM_DIMENSION_ID}.`);
    } catch (error) {
      customDimensionError = `${error}`;
      log(`Falha ao registrar dimensão customizada: ${error}`);
    }
  });
}

world.afterEvents?.playerInteractWithBlock?.subscribe(handleInteraction);
system.afterEvents?.scriptEventReceive?.subscribe((event) => {
  if (event.id === RECOVERY_SCRIPT_EVENT_ID && event.sourceEntity) {
    const dimension = ensureWorld();
    system.runTimeout(() => teleport(event.sourceEntity, dimension, ARRIVAL, "Recuperação concluída na Nave Cronos."), 12);
  } else if (event.id === NEARBY_PORTAL_SCRIPT_EVENT_ID) {
    mountPortalNearPlayer(event.sourceEntity, event.message);
  } else if (event.id === COORDINATE_PORTAL_SCRIPT_EVENT_ID) {
    mountPortalFromCoordinates(event.message);
  }
});

system.run(() => {
  log("Sprint 14 carregada: Nave Cronos recriada do zero com três eras temporais.");
  ensureWorld(true);
});

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    if (player.dimension.id === CUSTOM_DIMENSION_ID) {
      const visited = Object.values(ERA_TAGS).filter((tag) => player.hasTag(tag)).length;
      player.onScreenDisplay?.setActionBar(`§dNAVE CRONOS §7| Era atual: §f${currentEra.toUpperCase()} §7| Visitadas: §f${visited}/3`);
      if (player.location.y < 72) teleport(player, getDimensionSafe(CUSTOM_DIMENSION_ID), ARRIVAL, "Resgate automático concluído.");
      continue;
    }
    const center = portalCenterNearPlayer(player);
    if (center) enterWorld(player, center, "travessia");
  }
}, PORTAL_WALK_CHECK_INTERVAL_TICKS);
