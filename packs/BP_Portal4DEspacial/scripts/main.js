import { system, world } from "@minecraft/server";

const PREFIX = "[Portal4D]";
const CUSTOM_DIMENSION_ID = "portal4d:espaco_4d";
const FALLBACK_DIMENSION_ID = "minecraft:overworld";
const FALLBACK_CENTER = { x: 4096, y: 96, z: 4096 };
const CUSTOM_CENTER = { x: 0, y: 80, z: 0 };
const PLATFORM_RADIUS = 6;
const PORTAL_TRIGGER_BLOCK = "minecraft:sea_lantern";
const RETURN_TRIGGER_BLOCKS = new Set(["minecraft:lodestone", "minecraft:sea_lantern"]);
const TELEPORT_COOLDOWN_TICKS = 60;

let customDimensionRegistered = false;
let customDimensionError = "startup ainda nao executado";
let fallbackStatusLogged = false;
const builtDestinations = new Set();
const playerOrigins = new Map();
const playerCooldowns = new Map();

function log(message) {
  console.warn(`${PREFIX} ${message}`);
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
  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z - 4 }, "minecraft:lectern");
  setBlockSafe(dimension, { x: center.x - 4, y: center.y, z: center.z }, "minecraft:lodestone");
  setBlockSafe(dimension, { x: center.x + 4, y: center.y, z: center.z }, "minecraft:sea_lantern");
  builtDestinations.add(key);
  log(`Plataforma segura criada para ${label} em ${dimensionId} @ ${center.x} ${center.y} ${center.z}.`);
  return true;
}

function buildAllKnownDestinations() {
  buildSafePlatform(FALLBACK_DIMENSION_ID, FALLBACK_CENTER, "arena fallback Overworld");

  if (customDimensionRegistered) {
    buildSafePlatform(CUSTOM_DIMENSION_ID, CUSTOM_CENTER, "dimensao customizada 4D");
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

function isPortalFrameSeaLantern(block) {
  if (!block || block.typeId !== PORTAL_TRIGGER_BLOCK) {
    return false;
  }

  const { dimension, location } = block;
  const { x, y, z } = location;
  const hasLodestoneBase = getBlockTypeId(dimension, { x, y: y - 2, z }) === "minecraft:lodestone";
  const hasGlassInterior = getBlockTypeId(dimension, { x, y: y - 1, z }) === "minecraft:purple_stained_glass";
  const hasObsidianFrameX = getBlockTypeId(dimension, { x: x - 3, y, z }) === "minecraft:crying_obsidian" && getBlockTypeId(dimension, { x: x + 3, y, z }) === "minecraft:crying_obsidian";
  const hasObsidianFrameY = getBlockTypeId(dimension, { x: x - 3, y: y + 2, z }) === "minecraft:crying_obsidian" && getBlockTypeId(dimension, { x: x + 3, y: y + 2, z }) === "minecraft:crying_obsidian";

  return hasLodestoneBase && hasGlassInterior && (hasObsidianFrameX || hasObsidianFrameY);
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
  if (customDimensionRegistered) {
    const customDimension = getDimensionSafe(CUSTOM_DIMENSION_ID, false);
    if (customDimension) {
      buildSafePlatform(CUSTOM_DIMENSION_ID, CUSTOM_CENTER, "dimensao customizada 4D");
      return {
        center: CUSTOM_CENTER,
        dimension: customDimension,
        label: "dimensao customizada 4D",
      };
    }
  }

  const fallbackDimension = getDimensionSafe(FALLBACK_DIMENSION_ID);
  buildSafePlatform(FALLBACK_DIMENSION_ID, FALLBACK_CENTER, "arena fallback Overworld");
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

function enterPortal(player, block) {
  if (isOnTeleportCooldown(player)) {
    return;
  }

  savePlayerOrigin(player);
  player.sendMessage(`${PREFIX} Portal ativado: entrando em uma simulacao 3D de ideias 4D.`);
  log(`Interacao valida de ${player.name} no portal em ${block.location.x} ${block.location.y} ${block.location.z}.`);
  teleportPlayer(player, getDestination(), "Observe as projecoes, fatias e mudancas de perspectiva. Isto e uma simulacao educativa de 4D.");
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
}

function handlePlayerInteractWithBlock(event) {
  const { player, block } = event;
  if (!player || !block) {
    return;
  }

  if (isPortalFrameSeaLantern(block)) {
    enterPortal(player, block);
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
  log("Sprint 3 carregada: trigger do portal, teleporte e retorno preparados.");
  notifyOperators("Sprint 3 ativa. Interaja com a sea_lantern central do portal para entrar; use lodestone/sea_lantern da arena para retornar.");
  buildAllKnownDestinations();
});

system.runInterval(() => {
  buildAllKnownDestinations();
}, 200);
