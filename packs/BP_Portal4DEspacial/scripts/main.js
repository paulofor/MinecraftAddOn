import { system, world } from "@minecraft/server";

const PREFIX = "[Portal4D]";
const CUSTOM_DIMENSION_ID = "portal4d:espaco_4d";
const BLACK_HOLE_CENTER = { x: 0, y: 90, z: 0 };
const ARRIVAL = { x: 0, y: 82, z: -54 };
const PORTAL_TRIGGER_BLOCK = "minecraft:sea_lantern";
const PORTAL_WALK_CHECK_INTERVAL_TICKS = 10;
const TELEPORT_COOLDOWN_TICKS = 80;
const INTERACTION_COOLDOWN_TICKS = 14;
const RECOVERY_SCRIPT_EVENT_ID = "portal4d:recuperar";
const NEARBY_PORTAL_SCRIPT_EVENT_ID = "portal4d:montar_proximo";
const COORDINATE_PORTAL_SCRIPT_EVENT_ID = "portal4d:montar_coordenada";
const WORLD_ENVELOPE = { minX: -64, maxX: 64, minY: 60, maxY: 124, minZ: -64, maxZ: 64 };
const BUILD_TICKING_AREA = "p4d_planeta_build";
const FRAGMENTS = {
  natureza: { center: { x: -38, y: 83, z: -6 }, anchor: { x: -38, y: 84, z: -6 }, title: "FRAGMENTO DA NATUREZA", color: "§a" },
  ruinas: { center: { x: 25, y: 87, z: -32 }, anchor: { x: 25, y: 88, z: -32 }, title: "FRAGMENTO DAS RUÍNAS", color: "§6" },
  maquina: { center: { x: 32, y: 80, z: 28 }, anchor: { x: 32, y: 81, z: 28 }, title: "FRAGMENTO DA MÁQUINA", color: "§b" },
};
const FRAGMENT_TAGS = {
  natureza: "portal4d_fragmento_natureza",
  ruinas: "portal4d_fragmento_ruinas",
  maquina: "portal4d_fragmento_maquina",
};

let customDimensionRegistered = false;
let customDimensionError = "startup ainda não executado";
let worldBuilt = false;
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
    const runner = dimension.runCommand ?? dimension.runCommandAsync;
    const result = runner?.call(dimension, command);
    result?.catch?.((error) => log(`Falha no comando ${context}: ${error}`));
  } catch (error) {
    log(`Falha ao iniciar ${context}: ${error}`);
  }
}

function clearPreviousWorld(dimension) {
  // Fatias abaixo do limite do /fill limpam somente o envelope absoluto documentado.
  for (const [x1, x2] of [[-64, -1], [0, 64]]) {
    for (const [z1, z2] of [[-64, -1], [0, 64]]) {
      for (let y = 60; y <= 124; y += 7) {
        runCommandSafe(dimension, `fill ${x1} ${y} ${z1} ${x2} ${Math.min(y + 6, 124)} ${z2} air`, "apagamento seguro da experiência anterior");
      }
    }
  }
}

function buildSphere(dimension, center, radius, shellBlock, glowBlock) {
  for (let x = -radius; x <= radius; x += 1) {
    for (let y = -radius; y <= radius; y += 1) {
      for (let z = -radius; z <= radius; z += 1) {
        const distance = Math.sqrt(x * x + y * y + z * z);
        if (distance > radius || distance < radius - 2) continue;
        const block = (x * 11 + y * 7 + z * 5) % 17 === 0 ? glowBlock : shellBlock;
        setBlock(dimension, { x: center.x + x, y: center.y + y, z: center.z + z }, block);
      }
    }
  }
}

function buildAccretionDisk(dimension) {
  for (let x = -29; x <= 29; x += 1) {
    for (let z = -29; z <= 29; z += 1) {
      const distance = Math.sqrt(x * x + z * z);
      if (distance < 15 || distance > 28) continue;
      const y = BLACK_HOLE_CENTER.y + Math.round((x + z) / 24);
      const block = distance > 24 ? "minecraft:orange_stained_glass" : distance > 19 ? "minecraft:magenta_stained_glass" : "minecraft:purple_stained_glass";
      setBlock(dimension, { x, y, z }, block);
      if ((x * 3 + z * 5) % 19 === 0) setBlock(dimension, { x, y: y + 1, z }, "minecraft:sea_lantern");
    }
  }
}

function buildFloatingFragment(dimension, fragment, radius, surface, underside) {
  const { center } = fragment;
  for (let dx = -radius; dx <= radius; dx += 1) {
    for (let dz = -radius; dz <= radius; dz += 1) {
      const normalized = (dx * dx) / (radius * radius) + (dz * dz) / ((radius - 2) * (radius - 2));
      if (normalized > 1) continue;
      const topY = center.y + ((dx * 7 + dz * 11) % 5 === 0 ? 1 : 0);
      setBlock(dimension, { x: center.x + dx, y: topY, z: center.z + dz }, surface);
      const depth = Math.max(2, Math.round((1 - normalized) * 8));
      for (let depthOffset = 1; depthOffset <= depth; depthOffset += 1) {
        setBlock(dimension, { x: center.x + dx, y: topY - depthOffset, z: center.z + dz }, depthOffset === depth ? "minecraft:dripstone_block" : underside);
      }
    }
  }
  cuboid(dimension, { x: fragment.anchor.x - 2, y: fragment.anchor.y - 1, z: fragment.anchor.z - 2 }, { x: fragment.anchor.x + 2, y: fragment.anchor.y - 1, z: fragment.anchor.z + 2 }, "minecraft:crying_obsidian");
  setBlock(dimension, fragment.anchor, "minecraft:lodestone");
  setBlock(dimension, { ...fragment.anchor, y: fragment.anchor.y + 1 }, "minecraft:sea_lantern");
}

function buildBridge(dimension, start, end, block) {
  for (const offset of [-1, 0, 1]) {
    line(dimension, { x: start.x + offset, y: start.y, z: start.z }, { x: end.x + offset, y: end.y, z: end.z }, block);
  }
  line(dimension, { x: start.x - 2, y: start.y + 1, z: start.z }, { x: end.x - 2, y: end.y + 1, z: end.z }, "minecraft:purple_stained_glass");
  line(dimension, { x: start.x + 2, y: start.y + 1, z: start.z }, { x: end.x + 2, y: end.y + 1, z: end.z }, "minecraft:purple_stained_glass");
}

function decorateNatureFragment(dimension) {
  const { center } = FRAGMENTS.natureza;
  for (const [dx, dz, height] of [[-7, -3, 7], [5, -5, 6], [-2, 7, 8], [7, 4, 5]]) {
    line(dimension, { x: center.x + dx, y: center.y + 1, z: center.z + dz }, { x: center.x + dx, y: center.y + height, z: center.z + dz }, "minecraft:oak_log");
    cuboid(dimension, { x: center.x + dx - 2, y: center.y + height, z: center.z + dz - 2 }, { x: center.x + dx + 2, y: center.y + height + 3, z: center.z + dz + 2 }, "minecraft:azalea_leaves");
  }
  line(dimension, { x: center.x - 10, y: center.y + 1, z: center.z + 2 }, { x: center.x + 10, y: center.y + 1, z: center.z + 2 }, "minecraft:water");
}

function decorateRuinsFragment(dimension) {
  const { center } = FRAGMENTS.ruinas;
  for (const x of [center.x - 8, center.x, center.x + 8]) {
    line(dimension, { x, y: center.y + 1, z: center.z + 4 }, { x, y: center.y + 12, z: center.z + 4 }, "minecraft:chiseled_stone_bricks");
    setBlock(dimension, { x, y: center.y + 13, z: center.z + 4 }, "minecraft:sea_lantern");
  }
  line(dimension, { x: center.x - 8, y: center.y + 11, z: center.z + 4 }, { x: center.x + 8, y: center.y + 11, z: center.z + 4 }, "minecraft:cracked_stone_bricks");
  buildSphere(dimension, { x: center.x, y: center.y + 8, z: center.z - 4 }, 4, "minecraft:weathered_copper", "minecraft:ochre_froglight");
}

function decorateMachineFragment(dimension) {
  const { center } = FRAGMENTS.maquina;
  for (const [dx, dz, height] of [[-8, -6, 9], [8, -5, 13], [-7, 7, 15], [7, 7, 11]]) {
    cuboid(dimension, { x: center.x + dx - 2, y: center.y + 1, z: center.z + dz - 2 }, { x: center.x + dx + 2, y: center.y + height, z: center.z + dz + 2 }, "minecraft:deepslate_bricks");
    setBlock(dimension, { x: center.x + dx, y: center.y + height + 1, z: center.z + dz }, "minecraft:beacon");
  }
  for (const height of [5, 9, 13]) buildSphere(dimension, { x: center.x, y: center.y + height, z: center.z }, 3, "minecraft:light_blue_stained_glass", "minecraft:sea_lantern");
}

function buildArrivalObservatory(dimension) {
  const floorY = ARRIVAL.y - 1;
  for (let x = -10; x <= 10; x += 1) {
    for (let z = -61; z <= -45; z += 1) {
      const distance = Math.sqrt(x * x + (z + 53) ** 2);
      if (distance <= 10) setBlock(dimension, { x, y: floorY, z }, distance > 8.5 ? "minecraft:sea_lantern" : "minecraft:polished_blackstone_bricks");
    }
  }
  for (const x of [-4, 4]) line(dimension, { x, y: ARRIVAL.y, z: -58 }, { x, y: ARRIVAL.y + 8, z: -58 }, "minecraft:crying_obsidian");
  line(dimension, { x: -4, y: ARRIVAL.y + 8, z: -58 }, { x: 4, y: ARRIVAL.y + 8, z: -58 }, "minecraft:crying_obsidian");
  setBlock(dimension, { x: 0, y: ARRIVAL.y, z: -57 }, "minecraft:lodestone");
  setBlock(dimension, { x: 0, y: ARRIVAL.y, z: -49 }, "minecraft:lectern");
}

function buildShatteredPlanet(dimension) {
  buildSphere(dimension, BLACK_HOLE_CENTER, 12, "minecraft:black_concrete", "minecraft:crying_obsidian");
  buildAccretionDisk(dimension);
  buildArrivalObservatory(dimension);
  buildFloatingFragment(dimension, FRAGMENTS.natureza, 13, "minecraft:moss_block", "minecraft:stone");
  buildFloatingFragment(dimension, FRAGMENTS.ruinas, 14, "minecraft:stone_bricks", "minecraft:deepslate");
  buildFloatingFragment(dimension, FRAGMENTS.maquina, 14, "minecraft:oxidized_copper", "minecraft:blackstone");
  decorateNatureFragment(dimension);
  decorateRuinsFragment(dimension);
  decorateMachineFragment(dimension);
  buildBridge(dimension, { x: 0, y: 81, z: -45 }, { x: -30, y: 84, z: -12 }, "minecraft:lime_stained_glass");
  buildBridge(dimension, { x: 6, y: 81, z: -45 }, { x: 18, y: 88, z: -38 }, "minecraft:orange_stained_glass");
  buildBridge(dimension, { x: 8, y: 81, z: -48 }, { x: 27, y: 81, z: 18 }, "minecraft:cyan_stained_glass");
  worldBuilt = true;
  log("Planeta Partido construído: buraco negro central, três fragmentos e observatório de chegada.");
}

function isInsideWorldEnvelope(location) {
  return location.x >= WORLD_ENVELOPE.minX && location.x <= WORLD_ENVELOPE.maxX
    && location.y >= WORLD_ENVELOPE.minY && location.y <= WORLD_ENVELOPE.maxY
    && location.z >= WORLD_ENVELOPE.minZ && location.z <= WORLD_ENVELOPE.maxZ;
}

function precheckShatteredPlanet(dimension) {
  if (dimension?.id !== CUSTOM_DIMENSION_ID) {
    log(`Precheck bloqueou construção fora da dimensão exclusiva: ${dimension?.id ?? "indisponível"}.`);
    return false;
  }
  const requiredPoints = [BLACK_HOLE_CENTER, ARRIVAL, ...Object.values(FRAGMENTS).flatMap((fragment) => [fragment.center, fragment.anchor])];
  if (!requiredPoints.every(isInsideWorldEnvelope)) {
    log("Precheck bloqueou construção: marco, chegada ou fragmento fora do envelope X/Z=-64..64, Y=60..124.");
    return false;
  }
  return true;
}

function ensureWorld(force = false) {
  if (!customDimensionRegistered) return undefined;
  const dimension = getDimensionSafe(CUSTOM_DIMENSION_ID, false);
  if (!dimension) return undefined;
  if (force || !worldBuilt || blockId(dimension, { x: 0, y: 90, z: 12 }) !== "minecraft:black_concrete") {
    if (!precheckShatteredPlanet(dimension)) return undefined;
    runCommandSafe(dimension, `tickingarea add circle 0 90 0 4 ${BUILD_TICKING_AREA} true`, "carregamento temporário do Planeta Partido");
    clearPreviousWorld(dimension);
    system.runTimeout(() => {
      buildShatteredPlanet(dimension);
      runCommandSafe(dimension, `tickingarea remove ${BUILD_TICKING_AREA}`, "limpeza da área temporária do Planeta Partido");
    }, 12);
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

function hasAllFragmentTags(player) {
  return Object.values(FRAGMENT_TAGS).every((tag) => player.hasTag(tag));
}

function energizeBlackHole(dimension) {
  buildSphere(dimension, BLACK_HOLE_CENTER, 13, "minecraft:purple_stained_glass", "minecraft:sea_lantern");
  line(dimension, { x: 0, y: BLACK_HOLE_CENTER.y + 13, z: 0 }, { x: 0, y: 124, z: 0 }, "minecraft:sea_lantern");
  for (const y of [74, 78, 102, 106]) buildSphere(dimension, { x: 0, y, z: 0 }, 3, "minecraft:magenta_stained_glass", "minecraft:ochre_froglight");
}

function activateFragment(player, block, fragmentId) {
  if (onCooldown(player, "fragmento", INTERACTION_COOLDOWN_TICKS)) return;
  const fragment = FRAGMENTS[fragmentId];
  player.addTag(FRAGMENT_TAGS[fragmentId]);
  const visited = Object.values(FRAGMENT_TAGS).filter((tag) => player.hasTag(tag)).length;
  line(block.dimension, { ...fragment.anchor, y: fragment.anchor.y + 2 }, BLACK_HOLE_CENTER, "minecraft:sea_lantern");
  player.onScreenDisplay?.setTitle(fragment.title, { subtitle: `Energia enviada ao núcleo — ${visited}/3 fragmentos` });
  player.sendMessage(`${PREFIX} ${fragment.color}${fragment.title} REATIVADO.§r O feixe aponta diretamente para o buraco negro.`);
  if (hasAllFragmentTags(player)) {
    energizeBlackHole(block.dimension);
    player.onScreenDisplay?.setTitle("PLANETA REATIVADO", { subtitle: "Os três fragmentos reacenderam o núcleo." });
    player.sendMessage(`${PREFIX} Missão concluída: os três fragmentos alimentam o núcleo. Volte ao observatório e contemple o novo feixe orbital.`);
    log(`Planeta Partido concluído por ${player.name}.`);
  }
  log(`Fragmento ${fragmentId} reativado por ${player.name}; progresso=${visited}/3.`);
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
  for (const tag of Object.values(FRAGMENT_TAGS)) player.removeTag(tag);
  const dimension = ensureWorld();
  system.runTimeout(() => {
    teleport(player, dimension, ARRIVAL, "O PLANETA FOI PARTIDO. Atravesse os três fragmentos e reacenda o buraco negro.");
    system.runTimeout(() => player.sendMessage(`${PREFIX} Siga as três pontes coloridas. Em cada ilha, toque a PEDRA-ÍMÃ sob a luz. O núcleo negro está sempre no centro.`), 40);
  }, worldBuilt ? 1 : 18);
  log(`Entrada de ${player.name} por ${mode} em ${location.x} ${location.y} ${location.z}.`);
}

function returnToOrigin(player) {
  if (onCooldown(player, "teleport", TELEPORT_COOLDOWN_TICKS)) return;
  const origin = playerOrigins.get(keyFor(player));
  if (!origin) {
    player.sendMessage(`${PREFIX} Origem não encontrada nesta sessão.`);
    return;
  }
  teleport(player, getDimensionSafe(origin.dimensionId), origin.location, "Retorno concluído. Os fragmentos permanecem orbitando o núcleo.");
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
    if (block.typeId === "minecraft:lodestone") {
      for (const [fragmentId, fragment] of Object.entries(FRAGMENTS)) {
        if (distanceSquared(block.location, fragment.anchor) <= 2) {
          activateFragment(player, block, fragmentId);
          return;
        }
      }
      if (distanceSquared(block.location, { x: 0, y: ARRIVAL.y, z: -57 }) <= 2) {
        returnToOrigin(player);
        return;
      }
    }
    if (block.typeId === "minecraft:lectern" && distanceSquared(block.location, { x: 0, y: ARRIVAL.y, z: -49 }) <= 4) {
      player.sendMessage(`${PREFIX} MISSÃO: Natureza à esquerda, Ruínas à frente e Máquina à direita. Ative uma pedra-ímã em cada fragmento.`);
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
    system.runTimeout(() => teleport(event.sourceEntity, dimension, ARRIVAL, "Recuperação concluída no observatório do Planeta Partido."), 18);
  } else if (event.id === NEARBY_PORTAL_SCRIPT_EVENT_ID) {
    mountPortalNearPlayer(event.sourceEntity, event.message);
  } else if (event.id === COORDINATE_PORTAL_SCRIPT_EVENT_ID) {
    mountPortalFromCoordinates(event.message);
  }
});

system.run(() => {
  log("Sprint 15 carregada: Planeta Partido, buraco negro e três fragmentos exploráveis.");
  ensureWorld(true);
});

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    if (player.dimension.id === CUSTOM_DIMENSION_ID) {
      const visited = Object.values(FRAGMENT_TAGS).filter((tag) => player.hasTag(tag)).length;
      player.onScreenDisplay?.setActionBar(`§5PLANETA PARTIDO §7| Fragmentos reativados: §f${visited}/3 §7| Siga as pontes coloridas`);
      if (player.location.y < 58) teleport(player, getDimensionSafe(CUSTOM_DIMENSION_ID), ARRIVAL, "Resgate automático concluído no observatório.");
      continue;
    }
    const center = portalCenterNearPlayer(player);
    if (center) enterWorld(player, center, "travessia");
  }
}, PORTAL_WALK_CHECK_INTERVAL_TICKS);
