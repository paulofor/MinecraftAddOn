import { system, world } from "@minecraft/server";
import "./main.js";

const PREFIX = "[Portal4D]";
const DIMENSION_ID = "portal4d:espaco_4d";
const CENTER = { x: 0, y: 80, z: 0 };
const W_BUTTON = { x: 0, y: 80, z: 24 };
const ROTATION_BUTTON = { x: 24, y: 80, z: 0 };
const CENTER_W_BUTTON = { x: -6, y: 80, z: 0 };
const CENTER_ROTATION_BUTTON = { x: 6, y: 80, z: 0 };
const W_CONTROL_BLOCK = "minecraft:emerald_block";
const ROTATION_CONTROL_BLOCK = "minecraft:lapis_block";
const BREAK_COOLDOWN_TICKS = 18;
const SNEAK_COOLDOWN_TICKS = 36;
const W_BLOCKS = [
  "minecraft:redstone_block",
  "minecraft:gold_block",
  "minecraft:emerald_block",
  "minecraft:lapis_block",
  "minecraft:diamond_block",
];
const ROTATION_BLOCKS = [
  "minecraft:purple_stained_glass",
  "minecraft:cyan_stained_glass",
  "minecraft:magenta_stained_glass",
  "minecraft:light_blue_stained_glass",
];

const stateByArena = new Map();
const cooldowns = new Map();

function log(message) {
  console.warn(`${PREFIX} ${message}`);
}

function playerKey(player) {
  return player.id ?? player.name;
}

function arenaKey() {
  return `${DIMENSION_ID}:${CENTER.x}:${CENTER.y}:${CENTER.z}`;
}

function getState() {
  const key = arenaKey();
  const state = stateByArena.get(key) ?? { w: 0, rotation: 0, completed: false };
  stateByArena.set(key, state);
  return state;
}

function getDimensionSafe() {
  try {
    return world.getDimension(DIMENSION_ID);
  } catch {
    return undefined;
  }
}

function setBlockSafe(dimension, location, blockId) {
  try {
    dimension.getBlock(location)?.setType(blockId);
  } catch (error) {
    log(`Falha ao posicionar ${blockId} em ${location.x} ${location.y} ${location.z}: ${error}`);
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

function onCooldown(player, scope, ticks) {
  const key = `${playerKey(player)}:${scope}`;
  const now = system.currentTick;
  const availableAt = cooldowns.get(key) ?? 0;
  if (now < availableAt) {
    return true;
  }
  cooldowns.set(key, now + ticks);
  return false;
}

function sameBlock(a, b) {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}

function horizontalDistanceSquared(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return dx * dx + dz * dz;
}

function renderFixedButtons(dimension) {
  setBlockSafe(dimension, W_BUTTON, W_CONTROL_BLOCK);
  setBlockSafe(dimension, CENTER_W_BUTTON, W_CONTROL_BLOCK);
  setBlockSafe(dimension, ROTATION_BUTTON, ROTATION_CONTROL_BLOCK);
  setBlockSafe(dimension, CENTER_ROTATION_BUTTON, ROTATION_CONTROL_BLOCK);
}

function renderWCorridor(dimension, w) {
  for (let offset = 0; offset <= 16; offset += 1) {
    const x = W_BUTTON.x + offset;
    const floorBlock = offset <= w * 4 ? "minecraft:amethyst_block" : "minecraft:polished_andesite";
    setBlockSafe(dimension, { x, y: W_BUTTON.y - 1, z: W_BUTTON.z }, floorBlock);
    setBlockSafe(dimension, { x, y: W_BUTTON.y, z: W_BUTTON.z }, "minecraft:air");
    setBlockSafe(dimension, { x, y: W_BUTTON.y + 1, z: W_BUTTON.z }, "minecraft:air");
    setBlockSafe(dimension, { x, y: W_BUTTON.y, z: W_BUTTON.z + 2 }, "minecraft:air");

    if (offset % 4 === 0) {
      const step = offset / 4;
      setBlockSafe(dimension, { x, y: W_BUTTON.y, z: W_BUTTON.z + 1 }, step <= w ? "minecraft:sea_lantern" : "minecraft:redstone_lamp");
      if (step === w) {
        setBlockSafe(dimension, { x, y: W_BUTTON.y, z: W_BUTTON.z + 2 }, W_BLOCKS[w] ?? "minecraft:emerald_block");
      }
    }
  }

  for (let offset = 0; offset <= 16; offset += 4) {
    setBlockSafe(dimension, { x: W_BUTTON.x + offset, y: W_BUTTON.y, z: W_BUTTON.z - 1 }, "minecraft:sea_lantern");
    setBlockSafe(dimension, { x: W_BUTTON.x + offset, y: W_BUTTON.y, z: W_BUTTON.z + 1 }, offset / 4 <= w ? "minecraft:sea_lantern" : "minecraft:redstone_lamp");
  }

  setBlockSafe(dimension, W_BUTTON, W_CONTROL_BLOCK);
  setBlockSafe(dimension, { x: W_BUTTON.x, y: W_BUTTON.y, z: W_BUTTON.z - 2 }, "minecraft:lectern");
}

function renderCentralWSlice(dimension, w) {
  for (let index = 0; index < W_BLOCKS.length; index += 1) {
    const z = CENTER.z - 12 + index * 6;
    setLineSafe(dimension, { x: CENTER.x - 10, y: CENTER.y + 2, z }, { x: CENTER.x + 10, y: CENTER.y + 2, z }, "minecraft:air");
    setLineSafe(dimension, { x: CENTER.x - 10, y: CENTER.y + 3, z }, { x: CENTER.x + 10, y: CENTER.y + 3, z }, "minecraft:air");
  }

  const z = CENTER.z - 12 + w * 6;
  setLineSafe(dimension, { x: CENTER.x - 10, y: CENTER.y + 2, z }, { x: CENTER.x + 10, y: CENTER.y + 2, z }, W_BLOCKS[w] ?? W_BLOCKS[0]);
  setLineSafe(dimension, { x: CENTER.x - 10, y: CENTER.y + 3, z }, { x: CENTER.x + 10, y: CENTER.y + 3, z }, "minecraft:white_stained_glass");
}

function renderImpossibleDoor(dimension, w) {
  const doorX = CENTER.x + 12;
  const doorZ = CENTER.z + 8;
  const doorBlock = w === 2 ? "minecraft:air" : "minecraft:black_stained_glass";
  for (let y = CENTER.y; y <= CENTER.y + 3; y += 1) {
    for (let z = doorZ - 1; z <= doorZ + 1; z += 1) {
      setBlockSafe(dimension, { x: doorX, y, z }, doorBlock);
    }
  }
  setBlockSafe(dimension, { x: doorX - 1, y: CENTER.y, z: doorZ }, w === 2 ? "minecraft:emerald_block" : "minecraft:redstone_lamp");
}

function renderRotationMarkers(dimension, rotation) {
  const markers = [
    { x: CENTER.x - 4, y: CENTER.y + 4, z: CENTER.z - 4 },
    { x: CENTER.x + 4, y: CENTER.y + 4, z: CENTER.z - 4 },
    { x: CENTER.x + 4, y: CENTER.y + 4, z: CENTER.z + 4 },
    { x: CENTER.x - 4, y: CENTER.y + 4, z: CENTER.z + 4 },
  ];

  for (let index = 0; index < markers.length; index += 1) {
    setBlockSafe(dimension, markers[index], index === rotation ? ROTATION_BLOCKS[index] : "minecraft:redstone_lamp");
    setBlockSafe(dimension, { ...markers[index], y: markers[index].y + 1 }, index === rotation ? "minecraft:sea_lantern" : "minecraft:black_stained_glass");
  }
}

function renderRotationRoom(dimension, rotation) {
  for (let x = ROTATION_BUTTON.x - 5; x <= ROTATION_BUTTON.x + 5; x += 1) {
    for (let z = ROTATION_BUTTON.z - 5; z <= ROTATION_BUTTON.z + 5; z += 1) {
      setBlockSafe(dimension, { x, y: ROTATION_BUTTON.y - 1, z }, "minecraft:smooth_quartz");
      setBlockSafe(dimension, { x, y: ROTATION_BUTTON.y, z }, "minecraft:air");
      setBlockSafe(dimension, { x, y: ROTATION_BUTTON.y + 1, z }, "minecraft:air");
    }
  }

  const layouts = [
    [{ x: -3, z: -3 }, { x: -2, z: -2 }, { x: -1, z: -1 }, { x: 1, z: 1 }, { x: 2, z: 2 }, { x: 3, z: 3 }, { x: -3, z: 3 }, { x: 3, z: -3 }],
    [{ x: -3, z: 0 }, { x: -2, z: 0 }, { x: -1, z: 0 }, { x: 1, z: 0 }, { x: 2, z: 0 }, { x: 3, z: 0 }, { x: 0, z: -3 }, { x: 0, z: 3 }],
    [{ x: -2, z: -3 }, { x: -1, z: -2 }, { x: 0, z: -1 }, { x: 1, z: 0 }, { x: 2, z: 1 }, { x: 3, z: 2 }, { x: -3, z: 1 }, { x: 1, z: 3 }],
    [{ x: -3, z: -1 }, { x: -2, z: 1 }, { x: -1, z: 3 }, { x: 0, z: 0 }, { x: 1, z: -3 }, { x: 2, z: -1 }, { x: 3, z: 1 }, { x: 0, z: -4 }],
  ];

  for (const point of layouts[rotation]) {
    setBlockSafe(dimension, { x: ROTATION_BUTTON.x + point.x, y: ROTATION_BUTTON.y, z: ROTATION_BUTTON.z + point.z }, ROTATION_BLOCKS[rotation]);
  }

  setBlockSafe(dimension, ROTATION_BUTTON, ROTATION_CONTROL_BLOCK);
  setBlockSafe(dimension, { x: ROTATION_BUTTON.x, y: ROTATION_BUTTON.y, z: ROTATION_BUTTON.z - 4 }, "minecraft:lectern");
}

function renderCompletionGate(dimension, completed) {
  const gateX = CENTER.x + 8;
  const gateZ = CENTER.z + 12;
  const gateBlock = completed ? "minecraft:air" : "minecraft:black_stained_glass";

  for (let y = CENTER.y; y <= CENTER.y + 3; y += 1) {
    for (let x = gateX - 1; x <= gateX + 1; x += 1) {
      setBlockSafe(dimension, { x, y, z: gateZ }, gateBlock);
    }
  }
  setBlockSafe(dimension, { x: gateX, y: CENTER.y - 1, z: gateZ - 1 }, completed ? "minecraft:diamond_block" : "minecraft:redstone_lamp");
}

function syncScene(dimension, state) {
  renderWCorridor(dimension, state.w);
  renderCentralWSlice(dimension, state.w);
  renderImpossibleDoor(dimension, state.w);
  renderRotationRoom(dimension, state.rotation);
  renderRotationMarkers(dimension, state.rotation);
  renderCompletionGate(dimension, state.completed);
  renderFixedButtons(dimension);
}

function checkCompletion(player, dimension, state) {
  if (state.completed || state.w !== 4 || state.rotation !== 3) {
    renderCompletionGate(dimension, state.completed);
    return;
  }

  state.completed = true;
  addTagSafe(player, "portal4d_hipercubo_alinhado");
  setProgressPropertySafe(player, "portal4d:room_completed", true);
  syncScene(dimension, state);
  emitFeedback(player, "Hipercubo alinhado", "W=4 e Projecao=4 abriram a passagem final.", "random.levelup");
  player.sendMessage(`${PREFIX} Sala alinhada: a passagem final apareceu.`);
}

function activateW(player, dimension, mode) {
  const cooldown = mode === "extrair" ? BREAK_COOLDOWN_TICKS : SNEAK_COOLDOWN_TICKS;
  if (onCooldown(player, `w:${mode}`, cooldown)) return;

  const state = getState();
  state.w = (state.w + 1) % 5;
  syncScene(dimension, state);
  checkCompletion(player, dimension, state);
  addTagSafe(player, `portal4d_w_${state.w}`);
  setProgressPropertySafe(player, "portal4d:w_state", state.w);
  emitFeedback(player, "Coordenada W", `W=${state.w}/4.`, "random.orb");
  player.sendMessage(`${PREFIX} W=${state.w}/4. O emerald agora fica fixo no inicio do corredor.`);
}

function activateRotation(player, dimension, mode) {
  const cooldown = mode === "extrair" ? BREAK_COOLDOWN_TICKS : SNEAK_COOLDOWN_TICKS;
  if (onCooldown(player, `rot:${mode}`, cooldown)) return;

  const state = getState();
  state.rotation = (state.rotation + 1) % 4;
  syncScene(dimension, state);
  checkCompletion(player, dimension, state);
  addTagSafe(player, "portal4d_rotacao_4d");
  setProgressPropertySafe(player, "portal4d:rotation_state", state.rotation);
  emitFeedback(player, "Rotacao 4D", `Projecao=${state.rotation + 1}/4.`, "random.orb");
  player.sendMessage(`${PREFIX} Projecao=${state.rotation + 1}/4.`);
}

function kindFromBlock(block) {
  if (!block || block.dimension.id !== DIMENSION_ID) return undefined;
  if (block.typeId === W_CONTROL_BLOCK && (sameBlock(block.location, W_BUTTON) || sameBlock(block.location, CENTER_W_BUTTON))) return "w";
  if (block.typeId === ROTATION_CONTROL_BLOCK && (sameBlock(block.location, ROTATION_BUTTON) || sameBlock(block.location, CENTER_ROTATION_BUTTON))) return "rotation";
  return undefined;
}

function activateKind(player, dimension, kind, mode) {
  if (kind === "w") {
    activateW(player, dimension, mode);
    return;
  }
  if (kind === "rotation") {
    activateRotation(player, dimension, mode);
  }
}

const breakBlockEvent = world.beforeEvents?.playerBreakBlock;
if (breakBlockEvent?.subscribe) {
  breakBlockEvent.subscribe((event) => {
    const kind = kindFromBlock(event.block);
    if (!kind) return;
    event.cancel = true;
    const { player } = event;
    const dimension = event.block.dimension;
    system.run(() => activateKind(player, dimension, kind, "extrair"));
  });
  log("Controle fixo ativo: extrair no emerald/lapis aciona sem mover o botao.");
}

function findSneakControl(player) {
  if (player.dimension.id !== DIMENSION_ID) return undefined;
  const controls = [
    { kind: "w", location: { x: W_BUTTON.x + 0.5, y: W_BUTTON.y, z: W_BUTTON.z + 0.5 }, radiusSquared: 9 },
    { kind: "rotation", location: { x: ROTATION_BUTTON.x + 0.5, y: ROTATION_BUTTON.y, z: ROTATION_BUTTON.z + 0.5 }, radiusSquared: 9 },
    { kind: "w", location: { x: CENTER_W_BUTTON.x + 0.5, y: CENTER_W_BUTTON.y, z: CENTER_W_BUTTON.z + 0.5 }, radiusSquared: 4 },
    { kind: "rotation", location: { x: CENTER_ROTATION_BUTTON.x + 0.5, y: CENTER_ROTATION_BUTTON.y, z: CENTER_ROTATION_BUTTON.z + 0.5 }, radiusSquared: 4 },
  ];

  for (const control of controls) {
    if (Math.abs(player.location.y - CENTER.y) <= 2 && horizontalDistanceSquared(player.location, control.location) <= control.radiusSquared) {
      return control;
    }
  }
  return undefined;
}

function handleSneakControls() {
  for (const player of world.getPlayers()) {
    if (player.dimension.id !== DIMENSION_ID || player.isSneaking !== true) continue;
    const control = findSneakControl(player);
    if (!control) continue;
    activateKind(player, player.dimension, control.kind, "agachar");
  }
}

function showStatus() {
  const state = getState();
  for (const player of world.getPlayers()) {
    if (player.dimension.id !== DIMENSION_ID) continue;
    try {
      const done = state.completed ? " | alinhado" : "";
      player.onScreenDisplay?.setActionBar(`§d[Portal4D] W=${state.w}/4 | Projecao=${state.rotation + 1}/4${done} | botoes fixos | RT ou segure agachar=ativar | lodestone=voltar`);
    } catch (error) {
      log(`Falha ao exibir actionbar do controle fixo para ${player.name}: ${error}`);
    }
  }
}

system.runTimeout(() => {
  const dimension = getDimensionSafe();
  if (!dimension) return;
  syncScene(dimension, getState());
  log("Sala do Hipercubo sincronizada com controles fixos.");
}, 20);

system.runInterval(() => {
  handleSneakControls();
  showStatus();
}, 4);
