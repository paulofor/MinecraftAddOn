import { system, world } from "@minecraft/server";
import "./main.js";

const PREFIX = "[Portal4D]";
const CUSTOM_DIMENSION_ID = "portal4d:espaco_4d";
const CUSTOM_CENTER = { x: 0, y: 80, z: 0 };
const HYPERCUBE_ROOM = { halfWidth: 12, halfDepth: 12 };
const ROTATION_CONTROL_BLOCK = "minecraft:lapis_block";
const W_CONTROL_BLOCK = "minecraft:emerald_block";
const INTERACTION_COOLDOWN_TICKS = 16;
const BREAK_CONTROL_COOLDOWN_TICKS = 28;
const SNEAK_CONTROL_COOLDOWN_TICKS = 28;
const W_SLICE_BLOCKS = [
  "minecraft:redstone_block",
  "minecraft:gold_block",
  "minecraft:emerald_block",
  "minecraft:lapis_block",
  "minecraft:diamond_block",
];
const ROTATION_MARKER_BLOCKS = [
  "minecraft:purple_stained_glass",
  "minecraft:cyan_stained_glass",
  "minecraft:magenta_stained_glass",
  "minecraft:light_blue_stained_glass",
];

const controllerStates = new Map();
const controllerCooldowns = new Map();
const activeSneakControls = new Map();

function log(message) {
  console.warn(`${PREFIX} ${message}`);
}

function getPlayerKey(player) {
  return player.id ?? player.name;
}

function getArenaStateKey(dimensionId, center) {
  return `${dimensionId}:${center.x}:${center.y}:${center.z}`;
}

function getControllerState() {
  const key = getArenaStateKey(CUSTOM_DIMENSION_ID, CUSTOM_CENTER);
  const state = controllerStates.get(key) ?? { rotation: 0, w: 0, completed: false };
  controllerStates.set(key, state);
  return state;
}

function isOnControllerCooldown(player, scope, ticks) {
  const key = `${getPlayerKey(player)}:${scope}`;
  const now = system.currentTick;
  const availableAt = controllerCooldowns.get(key) ?? 0;
  if (now < availableAt) {
    return true;
  }

  controllerCooldowns.set(key, now + ticks);
  return false;
}

function distanceSquared(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

function horizontalDistanceSquared(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return dx * dx + dz * dz;
}

function setBlockSafe(dimension, location, blockId) {
  try {
    dimension.getBlock(location)?.setType(blockId);
  } catch (error) {
    log(`Falha ao posicionar ${blockId} em ${location.x} ${location.y} ${location.z}: ${error}`);
  }
}

function getBlockSafe(dimension, location) {
  try {
    return dimension.getBlock(location);
  } catch {
    return undefined;
  }
}

function setLineSafe(dimension, start, end, blockId) {
  const dx = Math.sign(end.x - start.x);
  const dy = Math.sign(end.y - start.y);
  const dz = Math.sign(end.z - start.z);
  const steps = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y), Math.abs(end.z - start.z));
  for (let step = 0; step <= steps; step += 1) {
    setBlockSafe(dimension, {
      x: start.x + dx * Math.min(step, Math.abs(end.x - start.x)),
      y: start.y + dy * Math.min(step, Math.abs(end.y - start.y)),
      z: start.z + dz * Math.min(step, Math.abs(end.z - start.z)),
    }, blockId);
  }
}

function fillRoomLayer(dimension, x1, y, z1, x2, z2, blockId) {
  for (let x = x1; x <= x2; x += 1) {
    for (let z = z1; z <= z2; z += 1) {
      setBlockSafe(dimension, { x, y, z }, blockId);
    }
  }
}

function runCommandSafe(dimension, command, context) {
  try {
    const runner = dimension.runCommandAsync ?? dimension.runCommand;
    const result = runner?.call(dimension, command);
    result?.catch?.((error) => log(`Falha no comando ${context}: ${error}`));
  } catch (error) {
    log(`Falha ao iniciar comando ${context}: ${error}`);
  }
}

function emitFeedback(player, title, subtitle, sound = "random.orb") {
  try {
    player.onScreenDisplay?.setTitle(title, { subtitle, fadeInDuration: 3, stayDuration: 35, fadeOutDuration: 8 });
  } catch (error) {
    log(`Falha ao exibir titulo para ${player.name}: ${error}`);
  }

  runCommandSafe(player.dimension, `playsound ${sound} @a ${Math.floor(player.location.x)} ${Math.floor(player.location.y)} ${Math.floor(player.location.z)} 1 1`, "feedback controle");
  runCommandSafe(player.dimension, `particle minecraft:totem_particle ${Math.floor(player.location.x)} ${Math.floor(player.location.y + 1)} ${Math.floor(player.location.z)}`, "particula controle");
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

function renderProjectionMarker(dimension, center, rotation) {
  const positions = [
    { x: center.x - 4, y: center.y + 4, z: center.z - 4 },
    { x: center.x + 4, y: center.y + 4, z: center.z - 4 },
    { x: center.x + 4, y: center.y + 4, z: center.z + 4 },
    { x: center.x - 4, y: center.y + 4, z: center.z + 4 },
  ];

  for (let index = 0; index < positions.length; index += 1) {
    setBlockSafe(dimension, positions[index], index === rotation ? ROTATION_MARKER_BLOCKS[index] : "minecraft:redstone_lamp");
    setBlockSafe(dimension, { ...positions[index], y: positions[index].y + 1 }, index === rotation ? "minecraft:sea_lantern" : "minecraft:black_stained_glass");
  }
}

function renderImpossibleDoor(dimension, center, w) {
  const doorX = center.x + HYPERCUBE_ROOM.halfWidth;
  const doorZ = center.z + 8;
  const doorBlock = w === 2 ? "minecraft:air" : "minecraft:black_stained_glass";
  for (let y = center.y; y <= center.y + 3; y += 1) {
    for (let z = doorZ - 1; z <= doorZ + 1; z += 1) {
      setBlockSafe(dimension, { x: doorX, y, z }, doorBlock);
    }
  }
  setBlockSafe(dimension, { x: doorX - 1, y: center.y, z: doorZ }, w === 2 ? "minecraft:emerald_block" : "minecraft:redstone_lamp");
  setBlockSafe(dimension, { x: doorX - 1, y: center.y + 1, z: doorZ }, "minecraft:sea_lantern");
}

function renderCompletionGate(dimension, center, completed) {
  const gateX = center.x + 8;
  const gateZ = center.z + HYPERCUBE_ROOM.halfDepth;
  const gateBlock = completed ? "minecraft:air" : "minecraft:black_stained_glass";

  for (let y = center.y; y <= center.y + 3; y += 1) {
    for (let x = gateX - 1; x <= gateX + 1; x += 1) {
      setBlockSafe(dimension, { x, y, z: gateZ }, gateBlock);
    }
  }

  setBlockSafe(dimension, { x: gateX, y: center.y - 1, z: gateZ - 1 }, completed ? "minecraft:diamond_block" : "minecraft:redstone_lamp");
  setBlockSafe(dimension, { x: gateX, y: center.y, z: gateZ - 1 }, completed ? "minecraft:sea_lantern" : "minecraft:black_stained_glass");
}

function renderCentralWSlice(dimension, center, w) {
  for (let index = 0; index < W_SLICE_BLOCKS.length; index += 1) {
    const z = center.z - 12 + index * 6;
    setLineSafe(dimension, { x: center.x - 10, y: center.y + 2, z }, { x: center.x + 10, y: center.y + 2, z }, "minecraft:air");
    setLineSafe(dimension, { x: center.x - 10, y: center.y + 3, z }, { x: center.x + 10, y: center.y + 3, z }, "minecraft:air");
  }

  const z = center.z - 12 + w * 6;
  const block = W_SLICE_BLOCKS[w] ?? W_SLICE_BLOCKS[0];
  setLineSafe(dimension, { x: center.x - 10, y: center.y + 2, z }, { x: center.x + 10, y: center.y + 2, z }, block);
  setLineSafe(dimension, { x: center.x - 10, y: center.y + 3, z }, { x: center.x + 10, y: center.y + 3, z }, "minecraft:white_stained_glass");
  renderImpossibleDoor(dimension, center, w);
}

function buildRotationRoom(dimension, center, state) {
  fillRoomLayer(dimension, center.x - 5, center.y - 1, center.z - 5, center.x + 5, center.z + 5, "minecraft:smooth_quartz");
  fillRoomLayer(dimension, center.x - 5, center.y, center.z - 5, center.x + 5, center.z + 5, "minecraft:air");
  fillRoomLayer(dimension, center.x - 5, center.y + 1, center.z - 5, center.x + 5, center.z + 5, "minecraft:air");
  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z }, ROTATION_CONTROL_BLOCK);
  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z - 4 }, "minecraft:lectern");
  setBlockSafe(dimension, { x: center.x, y: center.y + 1, z: center.z }, "minecraft:sea_lantern");

  const layouts = [
    {
      block: "minecraft:purple_stained_glass",
      points: [
        { x: -3, z: -3 }, { x: -2, z: -2 }, { x: -1, z: -1 }, { x: 1, z: 1 },
        { x: 2, z: 2 }, { x: 3, z: 3 }, { x: -3, z: 3 }, { x: 3, z: -3 },
      ],
    },
    {
      block: "minecraft:cyan_stained_glass",
      points: [
        { x: -3, z: 0 }, { x: -2, z: 0 }, { x: -1, z: 0 }, { x: 1, z: 0 },
        { x: 2, z: 0 }, { x: 3, z: 0 }, { x: 0, z: -3 }, { x: 0, z: 3 },
      ],
    },
    {
      block: "minecraft:magenta_stained_glass",
      points: [
        { x: -2, z: -3 }, { x: -1, z: -2 }, { x: 0, z: -1 }, { x: 1, z: 0 },
        { x: 2, z: 1 }, { x: 3, z: 2 }, { x: -3, z: 1 }, { x: 1, z: 3 },
      ],
    },
    {
      block: "minecraft:light_blue_stained_glass",
      points: [
        { x: -3, z: -1 }, { x: -2, z: 1 }, { x: -1, z: 3 }, { x: 0, z: 0 },
        { x: 1, z: -3 }, { x: 2, z: -1 }, { x: 3, z: 1 }, { x: 0, z: -4 },
      ],
    },
  ];

  const layout = layouts[state % layouts.length];
  for (const point of layout.points) {
    setBlockSafe(dimension, { x: center.x + point.x, y: center.y, z: center.z + point.z }, layout.block);
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
  setBlockSafe(dimension, { x: start.x, y: start.y, z: start.z - 2 }, "minecraft:lectern");
}

function checkRoomCompletion(player, dimension, state) {
  if (state.completed || state.w !== 4 || state.rotation !== 3) {
    renderCompletionGate(dimension, CUSTOM_CENTER, Boolean(state.completed));
    return;
  }

  state.completed = true;
  addTagSafe(player, "portal4d_hipercubo_alinhado");
  setProgressPropertySafe(player, "portal4d:room_completed", true);
  renderCompletionGate(dimension, CUSTOM_CENTER, true);
  emitFeedback(player, "Hipercubo alinhado", "W=4 e Projecao=4 revelaram a passagem final.", "random.levelup");
  player.sendMessage(`${PREFIX} Sala alinhada: voce combinou a fatia W correta com a quarta projecao. A passagem final apareceu.`);
}

function syncControllerScene(dimension, state) {
  buildWCorridor(dimension, { x: CUSTOM_CENTER.x, y: CUSTOM_CENTER.y, z: CUSTOM_CENTER.z + 24 }, state.w);
  buildRotationRoom(dimension, { x: CUSTOM_CENTER.x + 24, y: CUSTOM_CENTER.y, z: CUSTOM_CENTER.z }, state.rotation);
  renderCentralWSlice(dimension, CUSTOM_CENTER, state.w);
  renderProjectionMarker(dimension, CUSTOM_CENTER, state.rotation);
  renderCompletionGate(dimension, CUSTOM_CENTER, state.completed);
}

function activateW(player, dimension, mode) {
  if (isOnControllerCooldown(player, `w:${mode}`, mode === "extrair" ? BREAK_CONTROL_COOLDOWN_TICKS : SNEAK_CONTROL_COOLDOWN_TICKS)) {
    return;
  }

  const state = getControllerState();
  state.w = (state.w + 1) % 5;
  syncControllerScene(dimension, state);
  checkRoomCompletion(player, dimension, state);
  addTagSafe(player, `portal4d_w_${state.w}`);
  setProgressPropertySafe(player, "portal4d:w_state", state.w);
  emitFeedback(player, "Coordenada W", `Fatia W=${state.w}/4.`, "random.orb");
  player.sendMessage(`${PREFIX} Controle por ${mode}: W mudou para ${state.w}/4. Agora use RT no novo emerald ou agache novamente para avancar.`);
  log(`Controle W por ${mode} acionado por ${player.name}; estado=${state.w}.`);
}

function activateRotation(player, dimension, mode) {
  if (isOnControllerCooldown(player, `rotacao:${mode}`, mode === "extrair" ? BREAK_CONTROL_COOLDOWN_TICKS : SNEAK_CONTROL_COOLDOWN_TICKS)) {
    return;
  }

  const state = getControllerState();
  state.rotation = (state.rotation + 1) % 4;
  syncControllerScene(dimension, state);
  checkRoomCompletion(player, dimension, state);
  addTagSafe(player, "portal4d_rotacao_4d");
  setProgressPropertySafe(player, "portal4d:rotation_state", state.rotation);
  emitFeedback(player, "Rotacao 4D", `Projecao ${state.rotation + 1}/4.`, "random.orb");
  player.sendMessage(`${PREFIX} Controle por ${mode}: projecao mudou para ${state.rotation + 1}/4.`);
  log(`Controle de rotacao por ${mode} acionado por ${player.name}; estado=${state.rotation}.`);
}

function getControlKindFromBlock(block) {
  if (!block || block.dimension.id !== CUSTOM_DIMENSION_ID) {
    return undefined;
  }

  const location = block.location;
  if (block.typeId === W_CONTROL_BLOCK) {
    const centralW = { x: CUSTOM_CENTER.x - 6, y: CUSTOM_CENTER.y, z: CUSTOM_CENTER.z };
    const corridorZ = CUSTOM_CENTER.z + 24;
    const inWCorridor = Math.abs(location.y - CUSTOM_CENTER.y) <= 1
      && Math.abs(location.z - corridorZ) <= 1
      && location.x >= CUSTOM_CENTER.x - 1
      && location.x <= CUSTOM_CENTER.x + 17;
    if (inWCorridor || distanceSquared(location, centralW) <= 9) {
      return "w";
    }
  }

  if (block.typeId === ROTATION_CONTROL_BLOCK) {
    const centralRotation = { x: CUSTOM_CENTER.x + 6, y: CUSTOM_CENTER.y, z: CUSTOM_CENTER.z };
    const rotationRoom = { x: CUSTOM_CENTER.x + 24, y: CUSTOM_CENTER.y, z: CUSTOM_CENTER.z };
    if (distanceSquared(location, rotationRoom) <= 64 || distanceSquared(location, centralRotation) <= 9) {
      return "rotation";
    }
  }

  return undefined;
}

function activateControlKind(player, dimension, kind, mode) {
  if (kind === "w") {
    activateW(player, dimension, mode);
    return true;
  }

  if (kind === "rotation") {
    activateRotation(player, dimension, mode);
    return true;
  }

  return false;
}

const breakBlockEvent = world.beforeEvents?.playerBreakBlock;
if (breakBlockEvent?.subscribe) {
  breakBlockEvent.subscribe((event) => {
    const kind = getControlKindFromBlock(event.block);
    if (!kind) {
      return;
    }

    event.cancel = true;
    const { player } = event;
    const dimension = event.block.dimension;
    system.run(() => activateControlKind(player, dimension, kind, "extrair"));
  });
  log("Patch de controle ativo: RT/Extrair em emerald/lapis agora aciona W/projecao sem quebrar o bloco.");
} else {
  log("world.beforeEvents.playerBreakBlock indisponivel; patch RT/Extrair nao registrado.");
}

function findSneakControl(player) {
  if (player.dimension.id !== CUSTOM_DIMENSION_ID) {
    return undefined;
  }

  const state = getControllerState();
  const controls = [
    {
      kind: "w",
      location: { x: CUSTOM_CENTER.x + state.w * 4 + 0.5, y: CUSTOM_CENTER.y, z: CUSTOM_CENTER.z + 24 + 0.5 },
      radiusSquared: 6.25,
    },
    {
      kind: "rotation",
      location: { x: CUSTOM_CENTER.x + 24 + 0.5, y: CUSTOM_CENTER.y, z: CUSTOM_CENTER.z + 0.5 },
      radiusSquared: 6.25,
    },
    {
      kind: "w",
      location: { x: CUSTOM_CENTER.x - 6 + 0.5, y: CUSTOM_CENTER.y, z: CUSTOM_CENTER.z + 0.5 },
      radiusSquared: 2.25,
    },
    {
      kind: "rotation",
      location: { x: CUSTOM_CENTER.x + 6 + 0.5, y: CUSTOM_CENTER.y, z: CUSTOM_CENTER.z + 0.5 },
      radiusSquared: 2.25,
    },
  ];

  for (const control of controls) {
    if (Math.abs(player.location.y - CUSTOM_CENTER.y) <= 2 && horizontalDistanceSquared(player.location, control.location) <= control.radiusSquared) {
      return control;
    }
  }

  return undefined;
}

function handleSneakControls() {
  for (const player of world.getPlayers()) {
    const playerKey = getPlayerKey(player);
    if (player.dimension.id !== CUSTOM_DIMENSION_ID || player.isSneaking !== true) {
      activeSneakControls.delete(playerKey);
      continue;
    }

    const control = findSneakControl(player);
    if (!control) {
      activeSneakControls.delete(playerKey);
      continue;
    }

    if (activeSneakControls.get(playerKey) === control.kind) {
      continue;
    }

    activeSneakControls.set(playerKey, control.kind);
    activateControlKind(player, player.dimension, control.kind, "agachar");
  }
}

function showControllerStatus() {
  const state = getControllerState();
  for (const player of world.getPlayers()) {
    if (player.dimension.id !== CUSTOM_DIMENSION_ID) {
      continue;
    }

    try {
      const completed = state.completed ? " | alinhado" : "";
      player.onScreenDisplay?.setActionBar(`§d[Portal4D] W=${state.w}/4 | Projecao=${state.rotation + 1}/4${completed} | RT no emerald/lapis=ativar | agachar perto=tambem ativa | lodestone=voltar`);
    } catch (error) {
      log(`Falha ao exibir actionbar do patch de controle para ${player.name}: ${error}`);
    }
  }
}

system.runInterval(() => {
  handleSneakControls();
  showControllerStatus();
}, 4);
