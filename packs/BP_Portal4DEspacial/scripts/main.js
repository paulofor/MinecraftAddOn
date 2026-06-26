import { system, world } from "@minecraft/server";

const PREFIX = "[Portal4D]";
const CUSTOM_DIMENSION_ID = "portal4d:espaco_4d";
const FALLBACK_DIMENSION_ID = "minecraft:overworld";
const FALLBACK_CENTER = { x: 4096, y: 96, z: 4096 };
const CUSTOM_CENTER = { x: 0, y: 80, z: 0 };
const USE_CUSTOM_DIMENSION_DESTINATION = false;
const PLATFORM_RADIUS = 7;
const PORTAL_TRIGGER_BLOCK = "minecraft:sea_lantern";
const RETURN_TRIGGER_BLOCKS = new Set(["minecraft:lodestone", "minecraft:sea_lantern"]);
const GUIDE_TRIGGER_BLOCK = "minecraft:lectern";
const TELEPORT_COOLDOWN_TICKS = 80;
const PORTAL_WALK_CHECK_INTERVAL_TICKS = 10;
const PORTAL_ENTRY_HALF_WIDTH = 3.25;
const PORTAL_ENTRY_HALF_DEPTH = 2.25;
const ROTATION_CONTROL_BLOCK = "minecraft:lapis_block";
const W_CONTROL_BLOCK = "minecraft:emerald_block";
const ROTATION_PROGRESS_TAG = "portal4d_rotacao_4d";
const W_PROGRESS_TAG_PREFIX = "portal4d_w_";
const EXPANSION_MARKERS = [
  { dx: -24, dz: 0, block: "minecraft:gold_block", label: "matrizes" },
  { dx: -24, dz: 6, block: "minecraft:diamond_block", label: "projecoes" },
  { dx: -24, dz: 12, block: "minecraft:copper_block", label: "topologia" },
  { dx: -24, dz: 18, block: "minecraft:emerald_block", label: "grafos" },
];
const arenaStates = new Map();

let customDimensionRegistered = false;
let customDimensionError = "startup ainda nao executado";
let fallbackStatusLogged = false;
const builtDestinations = new Set();
const playerOrigins = new Map();
const playerCooldowns = new Map();
const playerNarrativeSteps = new Map();

const NARRATIVE_STEPS = [
  "1/4: Imagine uma criatura 2D vendo um cubo 3D. Ela veria cortes e sombras, nao o cubo inteiro.",
  "2/4: Aqui fazemos o mesmo com 4D: o Minecraft continua 3D, mas mostra projecoes, fatias e estados.",
  "3/4: Interaja com o lapis_block para alternar a rotacao 4D simulada; compare as duas projecoes.",
  "4/4: Interaja com o emerald_block para avancar W. Cada W e uma fatia visual do mesmo espaco.",
  "Extra: blocos dourado/diamante/cobre/esmeralda na ala oeste marcam futuras expansoes: matrizes, projecoes, topologia e grafos.",
];

const OPERATOR_GUIDE = [
  "Como entrar: caminhe pelo vao roxo do portal, como em um portal do Nether; nao precisa ficar exatamente no centro.",
  "A zona de entrada e larga: passe pela abertura entre as colunas ou pela base roxa; a sea_lantern do piso continua sendo atalho por interacao.",
  "Escolhas: atravessar o portal = Entrar; sea_lantern do piso = atalho; lectern = Repetir explicacao; lodestone/sea_lantern da arena = Voltar.",
  "Recuperacao: /function portal_4d/montar_completa remonta portal, arena e polimento; /function portal_4d/recuperar leva o operador para a arena fallback.",
  "Seguranca: a entrada envia para a arena 4D segura no Overworld; a dimensao customizada fica desativada ate validarmos piso e limites.",
  "Conceito-chave: isto e uma simulacao 3D de ideias 4D, nao uma quarta coordenada real do motor Bedrock.",
  "Tempo sugerido: 10 a 15 minutos para uma oficina curta; use grupos iniciante, intermediario e avancado no playtest.",
];

function log(message) {
  console.warn(`${PREFIX} ${message}`);
}

function sendNarrative(player, message) {
  player.sendMessage(`${PREFIX} ${message}`);
}

function sendGuide(player) {
  for (const line of OPERATOR_GUIDE) {
    sendNarrative(player, line);
  }
}

function advanceNarrative(player) {
  const key = getPlayerKey(player);
  const currentStep = playerNarrativeSteps.get(key) ?? 0;
  const message = NARRATIVE_STEPS[currentStep];
  playerNarrativeSteps.set(key, (currentStep + 1) % NARRATIVE_STEPS.length);
  emitFeedback(player, "Guia 4D", message, "random.orb");
  sendNarrative(player, message);
  if (currentStep === NARRATIVE_STEPS.length - 1) {
    sendGuide(player);
  }
  log(`Narrativa exibida para ${player.name}; passo=${currentStep + 1}.`);
}

function notifyOperators(message) {
  for (const player of world.getPlayers()) {
    player.sendMessage(`${PREFIX} ${message}`);
  }
}

function getPlayerKey(player) {
  return player.id ?? player.name;
}

function getDimensionSafe(dimensionId, shouldLog = true) {
  try {
    return world.getDimension(dimensionId);
  } catch (error) {
    if (shouldLog) {
      log(`Dimensao indisponivel '${dimensionId}': ${error}`);
    }
    return undefined;
  }
}

function getBlockTypeId(dimension, location) {
  try {
    return dimension.getBlock(location)?.typeId;
  } catch {
    return undefined;
  }
}

function setBlockSafe(dimension, location, blockId) {
  try {
    const block = dimension.getBlock(location);
    block?.setType(blockId);
  } catch (error) {
    log(`Falha ao posicionar ${blockId} em ${location.x} ${location.y} ${location.z}: ${error}`);
  }
}

function buildSafePlatform(dimensionId, center, label) {
  const key = `${dimensionId}:${center.x}:${center.y}:${center.z}`;
  if (builtDestinations.has(key)) {
    return true;
  }

  const dimension = getDimensionSafe(dimensionId, false);
  if (!dimension) {
    return false;
  }

  for (let x = center.x - PLATFORM_RADIUS; x <= center.x + PLATFORM_RADIUS; x += 1) {
    for (let z = center.z - PLATFORM_RADIUS; z <= center.z + PLATFORM_RADIUS; z += 1) {
      const border = x === center.x - PLATFORM_RADIUS || x === center.x + PLATFORM_RADIUS || z === center.z - PLATFORM_RADIUS || z === center.z + PLATFORM_RADIUS;
      setBlockSafe(dimension, { x, y: center.y - 1, z }, border ? "minecraft:sea_lantern" : "minecraft:smooth_stone");
      setBlockSafe(dimension, { x, y: center.y, z }, "minecraft:air");
      setBlockSafe(dimension, { x, y: center.y + 1, z }, "minecraft:air");
    }
  }

  setBlockSafe(dimension, { x: center.x, y: center.y - 1, z: center.z }, "minecraft:amethyst_block");
  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z - 4 }, GUIDE_TRIGGER_BLOCK);
  setBlockSafe(dimension, { x: center.x - 4, y: center.y, z: center.z }, "minecraft:lodestone");
  setBlockSafe(dimension, { x: center.x + 4, y: center.y, z: center.z }, "minecraft:sea_lantern");
  builtDestinations.add(key);
  log(`Plataforma segura criada para ${label} em ${dimensionId} @ ${center.x} ${center.y} ${center.z}.`);
  return true;
}

function runCommandSafe(dimension, command, context) {
  try {
    const runner = dimension.runCommandAsync ?? dimension.runCommand;
    if (!runner) {
      log(`Comando ${context} indisponivel nesta dimensao/API.`);
      return;
    }

    const result = runner.call(dimension, command);
    result?.catch?.((error) => log(`Falha no comando ${context}: ${error}`));
  } catch (error) {
    log(`Falha ao iniciar comando ${context}: ${error}`);
  }
}

function emitFeedback(player, title, subtitle, sound = "random.levelup") {
  try {
    player.onScreenDisplay?.setTitle(title, { subtitle, fadeInDuration: 5, stayDuration: 45, fadeOutDuration: 10 });
  } catch (error) {
    log(`Falha ao exibir titulo para ${player.name}: ${error}`);
  }

  runCommandSafe(player.dimension, `playsound ${sound} @a ${Math.floor(player.location.x)} ${Math.floor(player.location.y)} ${Math.floor(player.location.z)} 1 1`, "feedback sonoro");
  runCommandSafe(player.dimension, `particle minecraft:totem_particle ${Math.floor(player.location.x)} ${Math.floor(player.location.y + 1)} ${Math.floor(player.location.z)}`, "feedback de particula");
}

function addTagSafe(player, tag) {
  try {
    player.addTag(tag);
  } catch (error) {
    log(`Falha ao adicionar tag ${tag} em ${player.name}: ${error}`);
  }
}

function setProgressPropertySafe(player, key, value) {
  try {
    player.setDynamicProperty?.(key, value);
  } catch (error) {
    log(`Dynamic property indisponivel para ${key}; progresso mantido por tag. Erro: ${error}`);
  }
}

function isNearPoint(block, center, dimensionId, maxDistanceSquared = 49) {
  return block?.dimension?.id === dimensionId && distanceSquared(block.location, center) <= maxDistanceSquared;
}

function fillRoomLayer(dimension, x1, y, z1, x2, z2, blockId) {
  for (let x = x1; x <= x2; x += 1) {
    for (let z = z1; z <= z2; z += 1) {
      setBlockSafe(dimension, { x, y, z }, blockId);
    }
  }
}

function buildRotationRoom(dimension, center, state) {
  fillRoomLayer(dimension, center.x - 5, center.y - 1, center.z - 5, center.x + 5, center.z + 5, "minecraft:smooth_quartz");
  fillRoomLayer(dimension, center.x - 5, center.y, center.z - 5, center.x + 5, center.z + 5, "minecraft:air");
  fillRoomLayer(dimension, center.x - 5, center.y + 1, center.z - 5, center.x + 5, center.z + 5, "minecraft:air");
  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z }, ROTATION_CONTROL_BLOCK);
  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z - 4 }, GUIDE_TRIGGER_BLOCK);
  setBlockSafe(dimension, { x: center.x, y: center.y + 1, z: center.z }, "minecraft:sea_lantern");

  const layoutA = [
    { x: -3, z: -3 }, { x: -2, z: -2 }, { x: -1, z: -1 }, { x: 1, z: 1 }, { x: 2, z: 2 }, { x: 3, z: 3 },
    { x: -3, z: 3 }, { x: 3, z: -3 },
  ];
  const layoutB = [
    { x: -3, z: 0 }, { x: -2, z: 0 }, { x: -1, z: 0 }, { x: 1, z: 0 }, { x: 2, z: 0 }, { x: 3, z: 0 },
    { x: 0, z: -3 }, { x: 0, z: 3 },
  ];
  const points = state % 2 === 0 ? layoutA : layoutB;
  for (const point of points) {
    setBlockSafe(dimension, { x: center.x + point.x, y: center.y, z: center.z + point.z }, state % 2 === 0 ? "minecraft:purple_stained_glass" : "minecraft:cyan_stained_glass");
  }
}

function buildWCorridor(dimension, start, step) {
  for (let side = -1; side <= 1; side += 2) {
    for (let offset = 0; offset <= 16; offset += 4) {
      setBlockSafe(dimension, { x: start.x + offset, y: start.y, z: start.z + side }, "minecraft:sea_lantern");
    }
  }

  for (let offset = 0; offset <= 16; offset += 1) {
    const x = start.x + offset;
    const block = offset <= step * 4 ? "minecraft:amethyst_block" : "minecraft:polished_andesite";
    setBlockSafe(dimension, { x, y: start.y - 1, z: start.z }, block);
    setBlockSafe(dimension, { x, y: start.y, z: start.z }, "minecraft:air");
    setBlockSafe(dimension, { x, y: start.y + 1, z: start.z }, "minecraft:air");
    if (offset % 4 === 0) {
      setBlockSafe(dimension, { x, y: start.y, z: start.z + 1 }, offset / 4 <= step ? "minecraft:sea_lantern" : "minecraft:redstone_lamp");
    }
  }
  setBlockSafe(dimension, { x: start.x + step * 4, y: start.y, z: start.z }, W_CONTROL_BLOCK);
  setBlockSafe(dimension, { x: start.x, y: start.y, z: start.z - 2 }, GUIDE_TRIGGER_BLOCK);
}

function buildExpansionAnchors(dimension, center) {
  fillRoomLayer(dimension, center.x - 28, center.y - 1, center.z - 2, center.x - 20, center.z + 22, "minecraft:deepslate_tiles");
  fillRoomLayer(dimension, center.x - 28, center.y, center.z - 2, center.x - 20, center.z + 22, "minecraft:air");
  fillRoomLayer(dimension, center.x - 28, center.y + 1, center.z - 2, center.x - 20, center.z + 22, "minecraft:air");
  setBlockSafe(dimension, { x: center.x - 24, y: center.y, z: center.z - 2 }, GUIDE_TRIGGER_BLOCK);
  setBlockSafe(dimension, { x: center.x - 20, y: center.y, z: center.z + 22 }, "minecraft:sea_lantern");
  for (const marker of EXPANSION_MARKERS) {
    setBlockSafe(dimension, { x: center.x + marker.dx, y: center.y, z: center.z + marker.dz }, marker.block);
    setBlockSafe(dimension, { x: center.x + marker.dx + 1, y: center.y, z: center.z + marker.dz }, "minecraft:sea_lantern");
  }
}

function getArenaStateKey(dimensionId, center) {
  return `${dimensionId}:${center.x}:${center.y}:${center.z}`;
}

function buildSprint5Arena(dimensionId, center) {
  const dimension = getDimensionSafe(dimensionId, false);
  if (!dimension) {
    return;
  }
  const key = getArenaStateKey(dimensionId, center);
  const state = arenaStates.get(key) ?? { rotation: 0, w: 0 };
  buildRotationRoom(dimension, { x: center.x + 24, y: center.y, z: center.z }, state.rotation);
  buildWCorridor(dimension, { x: center.x, y: center.y, z: center.z + 24 }, state.w);
  buildExpansionAnchors(dimension, center);
}

function buildAllKnownDestinations() {
  buildSafePlatform(FALLBACK_DIMENSION_ID, FALLBACK_CENTER, "arena fallback Overworld");
  buildSprint5Arena(FALLBACK_DIMENSION_ID, FALLBACK_CENTER);

  if (customDimensionRegistered) {
    buildSafePlatform(CUSTOM_DIMENSION_ID, CUSTOM_CENTER, "dimensao customizada 4D");
    buildSprint5Arena(CUSTOM_DIMENSION_ID, CUSTOM_CENTER);
    return;
  }

  if (!fallbackStatusLogged) {
    log(`Dimensao customizada nao ativa; fallback permanece em ${FALLBACK_CENTER.x} ${FALLBACK_CENTER.y} ${FALLBACK_CENTER.z}. Motivo: ${customDimensionError}`);
    fallbackStatusLogged = true;
  }
}

function distanceSquared(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

function isPortalFrameCenter(dimension, center) {
  const { x, y, z } = center;
  const hasFloorTrigger = getBlockTypeId(dimension, { x, y, z }) === PORTAL_TRIGGER_BLOCK;
  const hasLeftFrame = getBlockTypeId(dimension, { x: x - 3, y: y + 1, z }) === "minecraft:crying_obsidian" && getBlockTypeId(dimension, { x: x - 3, y: y + 5, z }) === "minecraft:crying_obsidian";
  const hasRightFrame = getBlockTypeId(dimension, { x: x + 3, y: y + 1, z }) === "minecraft:crying_obsidian" && getBlockTypeId(dimension, { x: x + 3, y: y + 5, z }) === "minecraft:crying_obsidian";
  const hasTopFrame = getBlockTypeId(dimension, { x, y: y + 5, z }) === "minecraft:crying_obsidian";

  return hasFloorTrigger && hasLeftFrame && hasRightFrame && hasTopFrame;
}

function isPortalFrameSeaLantern(block) {
  return Boolean(block && block.typeId === PORTAL_TRIGGER_BLOCK && isPortalFrameCenter(block.dimension, block.location));
}

function isInsidePortalEntryZone(location, center) {
  const centerX = center.x + 0.5;
  const centerZ = center.z + 0.5;
  const insideX = Math.abs(location.x - centerX) <= PORTAL_ENTRY_HALF_WIDTH;
  const insideY = location.y >= center.y + 0.8 && location.y <= center.y + 5.2;
  const insideZ = Math.abs(location.z - centerZ) <= PORTAL_ENTRY_HALF_DEPTH;

  return insideX && insideY && insideZ;
}

function getPortalCenterFromPlayer(player) {
  const dimension = player.dimension;
  const location = player.location;
  const playerX = Math.floor(location.x);
  const playerY = Math.floor(location.y);
  const playerZ = Math.floor(location.z);

  for (let y = playerY - 2; y <= playerY; y += 1) {
    for (let x = playerX - 3; x <= playerX + 3; x += 1) {
      for (let z = playerZ - 2; z <= playerZ + 2; z += 1) {
        const center = { x, y, z };
        if (isPortalFrameCenter(dimension, center) && isInsidePortalEntryZone(location, center)) {
          return center;
        }
      }
    }
  }

  return undefined;
}

function isNearDestinationArena(block, center, dimensionId) {
  if (!block || block.dimension.id !== dimensionId || !RETURN_TRIGGER_BLOCKS.has(block.typeId)) {
    return false;
  }

  return distanceSquared(block.location, center) <= 36;
}

function isOnTeleportCooldown(player) {
  const key = getPlayerKey(player);
  const now = system.currentTick;
  const availableAt = playerCooldowns.get(key) ?? 0;
  if (now < availableAt) {
    return true;
  }

  playerCooldowns.set(key, now + TELEPORT_COOLDOWN_TICKS);
  return false;
}

function getDestination() {
  if (USE_CUSTOM_DIMENSION_DESTINATION && customDimensionRegistered) {
    const customDimension = getDimensionSafe(CUSTOM_DIMENSION_ID, false);
    if (customDimension) {
      buildSafePlatform(CUSTOM_DIMENSION_ID, CUSTOM_CENTER, "dimensao customizada 4D");
      buildSprint5Arena(CUSTOM_DIMENSION_ID, CUSTOM_CENTER);
      return {
        center: CUSTOM_CENTER,
        dimension: customDimension,
        label: "dimensao customizada 4D",
      };
    }
  }

  if (customDimensionRegistered && !USE_CUSTOM_DIMENSION_DESTINATION && !fallbackStatusLogged) {
    log("Dimensao customizada registrada, mas destino customizado desativado por seguranca; usando arena 4D segura no Overworld.");
    fallbackStatusLogged = true;
  }

  const fallbackDimension = getDimensionSafe(FALLBACK_DIMENSION_ID);
  buildSafePlatform(FALLBACK_DIMENSION_ID, FALLBACK_CENTER, "arena fallback Overworld");
  buildSprint5Arena(FALLBACK_DIMENSION_ID, FALLBACK_CENTER);
  return {
    center: FALLBACK_CENTER,
    dimension: fallbackDimension,
    label: "arena fallback Overworld",
  };
}

function savePlayerOrigin(player) {
  playerOrigins.set(getPlayerKey(player), {
    dimensionId: player.dimension.id,
    location: {
      x: Math.floor(player.location.x),
      y: Math.floor(player.location.y),
      z: Math.floor(player.location.z),
    },
  });
}

function teleportPlayer(player, destination, message) {
  if (!destination.dimension) {
    player.sendMessage(`${PREFIX} Nao foi possivel localizar uma dimensao segura para teleporte. Avise um operador.`);
    log(`Teleporte cancelado para ${player.name}: dimensao de destino indisponivel.`);
    return;
  }

  const target = {
    x: destination.center.x + 0.5,
    y: destination.center.y,
    z: destination.center.z + 0.5,
  };

  try {
    player.teleport(target, { dimension: destination.dimension, rotation: { x: 0, y: 180 } });
    player.sendMessage(`${PREFIX} ${message}`);
    log(`Teleporte concluido para ${player.name}: ${destination.label} @ ${target.x} ${target.y} ${target.z}.`);
  } catch (error) {
    player.sendMessage(`${PREFIX} Falha no teleporte. Confira o bedrock.log por [Portal4D].`);
    log(`Falha no teleporte de ${player.name}: ${error}`);
  }
}

function showEntryNarrative(player) {
  emitFeedback(player, "Entrar", "Roteiro de 10-15 min: observar, comparar, interagir e concluir.", "portal.travel");
  sendNarrative(player, "Pense em uma sombra 2D de um cubo 3D. O Portal 4D faz algo parecido: mostra sombras/fatias 3D de uma ideia 4D.");
  sendNarrative(player, "Escolhas no espaco 4D: lectern repete explicacao, lapis_block muda perspectiva, emerald_block avanca W, lodestone/sea_lantern volta. Ala oeste mostra futuras expansoes.");
}

function enterPortal(player, triggerLocation, triggerMode = "interacao") {
  if (isOnTeleportCooldown(player)) {
    return;
  }

  savePlayerOrigin(player);
  player.sendMessage(`${PREFIX} Portal ativado: atravessando o vao 4D como um portal do Nether.`);
  showEntryNarrative(player);
  log(`Entrada valida de ${player.name} no portal por ${triggerMode} em ${triggerLocation.x} ${triggerLocation.y} ${triggerLocation.z}.`);
  teleportPlayer(player, getDestination(), "Observe as projecoes, fatias e mudancas de perspectiva na arena 4D segura do Overworld.");
}

function handlePortalWalkthrough() {
  for (const player of world.getPlayers()) {
    const portalCenter = getPortalCenterFromPlayer(player);
    if (portalCenter) {
      enterPortal(player, portalCenter, "travessia");
    }
  }
}

function rescueUnsafePortalPlayers() {
  for (const player of world.getPlayers()) {
    if (player.dimension.id !== CUSTOM_DIMENSION_ID || player.location.y >= CUSTOM_CENTER.y - 8) {
      continue;
    }

    player.sendMessage(`${PREFIX} Resgate automatico: a dimensao customizada ficou insegura. Voltando para a arena 4D segura no Overworld.`);
    teleportPlayer(player, {
      center: FALLBACK_CENTER,
      dimension: getDimensionSafe(FALLBACK_DIMENSION_ID),
      label: "resgate fallback Overworld",
    }, "Resgate concluido. A experiencia 4D continua na arena segura do Overworld.");
  }
}

function handlePortalWalkthrough() {
  for (const player of world.getPlayers()) {
    const portalCenter = getPortalCenterFromPlayer(player);
    if (portalCenter) {
      enterPortal(player, portalCenter, "travessia");
    }
  }
}

function returnFromPortal(player) {
  if (isOnTeleportCooldown(player)) {
    return;
  }

  const origin = playerOrigins.get(getPlayerKey(player));
  if (!origin) {
    player.sendMessage(`${PREFIX} Origem nao encontrada nesta sessao. Voltando para uma area segura proxima ao portal fallback.`);
    teleportPlayer(player, {
      center: { x: FALLBACK_CENTER.x, y: FALLBACK_CENTER.y, z: FALLBACK_CENTER.z + 4 },
      dimension: getDimensionSafe(FALLBACK_DIMENSION_ID),
      label: "retorno fallback Overworld",
    }, "Retorno fallback concluido. Reative o portal a partir do mundo de teste se necessario.");
    return;
  }

  const originDimension = getDimensionSafe(origin.dimensionId);
  teleportPlayer(player, {
    center: origin.location,
    dimension: originDimension,
    label: `origem salva em ${origin.dimensionId}`,
  }, "Retorno ao ponto de origem concluido. Pense: o que mudou entre a projecao e a fatia observada?");
  sendNarrative(player, "Conclusao: voce nao via 4D real; voce comparou projecoes, fatias e estados para construir intuicao espacial.");
}

function advanceRotationRoom(player, block, center) {
  if (isOnTeleportCooldown(player)) {
    return;
  }
  const key = getArenaStateKey(block.dimension.id, center);
  const state = arenaStates.get(key) ?? { rotation: 0, w: 0 };
  state.rotation = (state.rotation + 1) % 2;
  arenaStates.set(key, state);
  buildRotationRoom(block.dimension, { x: center.x + 24, y: center.y, z: center.z }, state.rotation);
  addTagSafe(player, ROTATION_PROGRESS_TAG);
  setProgressPropertySafe(player, "portal4d:rotation_state", state.rotation);
  emitFeedback(player, "Rotacao 4D", `A mesma sala virou a projecao ${state.rotation + 1}/2.`);
  player.sendMessage(`${PREFIX} Rotacao 4D simulada: o objeto nao mudou no motor 3D; voce esta vendo outra projecao/fatia do mesmo conceito.`);
  log(`Rotacao 4D acionada por ${player.name}; estado=${state.rotation}.`);
}

function advanceWCorridor(player, block, center) {
  if (isOnTeleportCooldown(player)) {
    return;
  }
  const key = getArenaStateKey(block.dimension.id, center);
  const state = arenaStates.get(key) ?? { rotation: 0, w: 0 };
  state.w = Math.min(state.w + 1, 4);
  arenaStates.set(key, state);
  buildWCorridor(block.dimension, { x: center.x, y: center.y, z: center.z + 24 }, state.w);
  addTagSafe(player, `${W_PROGRESS_TAG_PREFIX}${state.w}`);
  setProgressPropertySafe(player, "portal4d:w_state", state.w);
  emitFeedback(player, "Coordenada W", `W simulado = ${state.w}. Avance sem medo: ha retorno seguro.`);
  player.sendMessage(`${PREFIX} Coordenada W simulada: cada passo muda o estado visual do mesmo corredor, como comparar fatias sucessivas.`);
  log(`Corredor W acionado por ${player.name}; estado=${state.w}.`);
}

function handleGuideInteraction(player, block) {
  if (block.typeId !== GUIDE_TRIGGER_BLOCK) {
    return false;
  }

  const centers = [
    { center: FALLBACK_CENTER, dimensionId: FALLBACK_DIMENSION_ID },
    { center: CUSTOM_CENTER, dimensionId: CUSTOM_DIMENSION_ID },
  ];

  for (const arena of centers) {
    const nearCenterGuide = isNearPoint(block, { x: arena.center.x, y: arena.center.y, z: arena.center.z - 4 }, arena.dimensionId, 16);
    const nearRotationGuide = isNearPoint(block, { x: arena.center.x + 24, y: arena.center.y, z: arena.center.z - 4 }, arena.dimensionId, 16);
    const nearWGuide = isNearPoint(block, { x: arena.center.x, y: arena.center.y, z: arena.center.z + 22 }, arena.dimensionId, 16);
    const nearExpansionGuide = isNearPoint(block, { x: arena.center.x - 24, y: arena.center.y, z: arena.center.z - 2 }, arena.dimensionId, 25);
    if (nearCenterGuide || nearRotationGuide || nearWGuide || nearExpansionGuide) {
      advanceNarrative(player);
      return true;
    }
  }

  return false;
}

function handleSprint5Interaction(player, block) {
  const centers = [
    { center: FALLBACK_CENTER, dimensionId: FALLBACK_DIMENSION_ID },
    { center: CUSTOM_CENTER, dimensionId: CUSTOM_DIMENSION_ID },
  ];

  for (const arena of centers) {
    const rotationCenter = { x: arena.center.x + 24, y: arena.center.y, z: arena.center.z };
    const wStart = { x: arena.center.x, y: arena.center.y, z: arena.center.z + 24 };
    if (block.typeId === ROTATION_CONTROL_BLOCK && isNearPoint(block, rotationCenter, arena.dimensionId, 64)) {
      advanceRotationRoom(player, block, arena.center);
      return true;
    }

    if (block.typeId === W_CONTROL_BLOCK && isNearPoint(block, wStart, arena.dimensionId, 400)) {
      advanceWCorridor(player, block, arena.center);
      return true;
    }
  }

  return false;
}

function handlePlayerInteractWithBlock(event) {
  const { player, block } = event;
  if (!player || !block) {
    return;
  }

  if (handleGuideInteraction(player, block)) {
    return;
  }

  if (handleSprint5Interaction(player, block)) {
    return;
  }

  if (isPortalFrameSeaLantern(block)) {
    enterPortal(player, block.location, "interacao sea_lantern");
    return;
  }

  if (isNearDestinationArena(block, FALLBACK_CENTER, FALLBACK_DIMENSION_ID) || isNearDestinationArena(block, CUSTOM_CENTER, CUSTOM_DIMENSION_ID)) {
    returnFromPortal(player);
  }
}

const startupEvent = system.beforeEvents?.startup;
if (startupEvent?.subscribe) {
  startupEvent.subscribe((event) => {
    const registry = event.dimensionRegistry;
    if (!registry?.registerCustomDimension) {
      customDimensionError = "dimensionRegistry/registerCustomDimension indisponivel; habilite Beta APIs para dimensao customizada";
      log(customDimensionError);
      return;
    }

    try {
      registry.registerCustomDimension(CUSTOM_DIMENSION_ID);
      customDimensionRegistered = true;
      customDimensionError = "nenhum";
      fallbackStatusLogged = false;
      log(`Dimensao customizada registrada no startup: ${CUSTOM_DIMENSION_ID}.`);
    } catch (error) {
      customDimensionRegistered = false;
      customDimensionError = `${error}`;
      log(`Falha ao registrar ${CUSTOM_DIMENSION_ID}; usando fallback seguro no Overworld. Erro: ${error}`);
    }
  });
} else {
  customDimensionError = "system.beforeEvents.startup indisponivel nesta versao da Script API";
  log(`${customDimensionError}; usando fallback seguro no Overworld.`);
}

const interactWithBlockEvent = world.afterEvents?.playerInteractWithBlock;
if (interactWithBlockEvent?.subscribe) {
  interactWithBlockEvent.subscribe(handlePlayerInteractWithBlock);
  log("Trigger de interacao com bloco registrado para o portal 4D.");
} else {
  log("world.afterEvents.playerInteractWithBlock indisponivel; use funcoes manuais ate atualizar a Script API.");
}

system.run(() => {
  log("Sprint 8 carregada: polimento, ritmo de oficina, playtest e pontos de expansao preparados.");
  notifyOperators("Sprint 8 ativa. Tempo sugerido 10-15 min; valide perfis iniciante/intermediario/avancado e pontos de expansao.");
  buildAllKnownDestinations();
});

system.runInterval(() => {
  buildAllKnownDestinations();
}, 200);

system.runInterval(() => {
  rescueUnsafePortalPlayers();
  handlePortalWalkthrough();
}, PORTAL_WALK_CHECK_INTERVAL_TICKS);
