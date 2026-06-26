import { system, world } from "@minecraft/server";

const PREFIX = "[Portal4D]";
const CUSTOM_DIMENSION_ID = "portal4d:espaco_4d";
const CUSTOM_CENTER = { x: 0, y: 80, z: 0 };
const USE_CUSTOM_DIMENSION_DESTINATION = true;
const PLATFORM_RADIUS = 7;
const DIMENSION_IDENTITY_RADIUS = 10;
const IMMERSION_RADIUS = 18;
const TESSERACT_CENTER = { x: CUSTOM_CENTER.x, y: CUSTOM_CENTER.y + 6, z: CUSTOM_CENTER.z + 2 };
const HYPERCUBE_ROOM = { halfWidth: 12, halfDepth: 12, height: 15 };
const PORTAL_TRIGGER_BLOCK = "minecraft:sea_lantern";
const RETURN_TRIGGER_BLOCKS = new Set(["minecraft:lodestone", "minecraft:sea_lantern"]);
const GUIDE_TRIGGER_BLOCK = "minecraft:lectern";
const TELEPORT_COOLDOWN_TICKS = 80;
const INTERACTION_COOLDOWN_TICKS = 16;
const PORTAL_WALK_CHECK_INTERVAL_TICKS = 10;
const PORTAL_ENTRY_HALF_WIDTH = 3.25;
const PORTAL_ENTRY_HALF_DEPTH = 2.25;
const ROTATION_CONTROL_BLOCK = "minecraft:lapis_block";
const W_CONTROL_BLOCK = "minecraft:emerald_block";
const ROTATION_PROGRESS_TAG = "portal4d_rotacao_4d";
const W_PROGRESS_TAG_PREFIX = "portal4d_w_";
const ROOM_COMPLETION_TAG = "portal4d_hipercubo_alinhado";
const RECOVERY_SCRIPT_EVENT_ID = "portal4d:recuperar";
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
  "2/4: Aqui fazemos o mesmo com 4D: o motor continua 3D, entao a experiencia usa projecoes, fatias W, parallax e mudanca de referencia.",
  "3/4: Interaja com o lapis_block para alternar quatro projecoes 4D simuladas. A forma muda porque sua referencia mudou.",
  "4/4: Interaja com o emerald_block para avancar W. Agora a sala central tambem muda, incluindo uma porta que so existe em uma fatia.",
  "Desafio: alinhe W=4 e Projecao=4 para revelar a passagem final da Sala do Hipercubo.",
  "Extra: blocos dourado/diamante/cobre/esmeralda na ala oeste marcam futuras expansoes: matrizes, projecoes, topologia e grafos.",
];

const OPERATOR_GUIDE = [
  "Como entrar: caminhe pelo vao roxo do portal, como em um portal do Nether; nao precisa ficar exatamente no centro.",
  "A zona de entrada e larga: passe pela abertura entre as colunas ou pela base roxa; a sea_lantern do piso continua sendo atalho por interacao.",
  "Escolhas: atravessar o portal = Entrar; sea_lantern do piso = atalho; lectern = Repetir explicacao; lodestone/sea_lantern da arena = Voltar.",
  "Experiencia: emerald_block cicla W=0..4 e muda a sala central; lapis_block cicla quatro projecoes; W=4 + Projecao=4 revela a passagem final.",
  "Recuperacao: /function portal_4d/montar_completa remonta portal, arena e polimento; /function portal_4d/recuperar reconstrói a dimensão 4D e leva o operador ao destino customizado.",
  "Seguranca: a entrada usa a dimensao Microsoft Custom Dimension API como destino unico; se a API nao registrar, o portal avisa e nao usa fallback no Overworld.",
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

function setInterpolatedLineSafe(dimension, start, end, blockId) {
  const steps = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y), Math.abs(end.z - start.z));
  for (let step = 0; step <= steps; step += 1) {
    const t = steps === 0 ? 0 : step / steps;
    setBlockSafe(dimension, {
      x: Math.round(start.x + (end.x - start.x) * t),
      y: Math.round(start.y + (end.y - start.y) * t),
      z: Math.round(start.z + (end.z - start.z) * t),
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

function buildCubeProjection(dimension, center, radius, blockId) {
  const xs = [center.x - radius, center.x + radius];
  const ys = [center.y - radius, center.y + radius];
  const zs = [center.z - radius, center.z + radius];
  for (const y of ys) {
    for (const z of zs) {
      setLineSafe(dimension, { x: xs[0], y, z }, { x: xs[1], y, z }, blockId);
    }
    for (const x of xs) {
      setLineSafe(dimension, { x, y, z: zs[0] }, { x, y, z: zs[1] }, blockId);
    }
  }
  for (const x of xs) {
    for (const z of zs) {
      setLineSafe(dimension, { x, y: ys[0], z }, { x, y: ys[1], z }, blockId);
    }
  }
}

function buildTesseractProjection(dimension, center) {
  const outer = { x: center.x, y: center.y, z: center.z };
  const inner = { x: center.x + 2, y: center.y + 1, z: center.z + 2 };
  buildCubeProjection(dimension, outer, 6, "minecraft:purple_stained_glass");
  buildCubeProjection(dimension, inner, 3, "minecraft:cyan_stained_glass");

  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      for (const sz of [-1, 1]) {
        setInterpolatedLineSafe(dimension, {
          x: outer.x + sx * 6,
          y: outer.y + sy * 6,
          z: outer.z + sz * 6,
        }, {
          x: inner.x + sx * 3,
          y: inner.y + sy * 3,
          z: inner.z + sz * 3,
        }, "minecraft:sea_lantern");
      }
    }
  }
}

function getArenaStateKey(dimensionId, center) {
  return `${dimensionId}:${center.x}:${center.y}:${center.z}`;
}

function getArenaState(dimensionId, center) {
  const key = getArenaStateKey(dimensionId, center);
  const state = arenaStates.get(key) ?? { rotation: 0, w: 0, completed: false };
  if (state.completed === undefined) {
    state.completed = false;
  }
  arenaStates.set(key, state);
  return state;
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

function checkRoomCompletion(player, dimension, center, state) {
  if (state.completed || state.w !== 4 || state.rotation !== 3) {
    renderCompletionGate(dimension, center, Boolean(state.completed));
    return;
  }

  state.completed = true;
  arenaStates.set(getArenaStateKey(dimension.id, center), state);
  addTagSafe(player, ROOM_COMPLETION_TAG);
  setProgressPropertySafe(player, "portal4d:room_completed", true);
  renderCompletionGate(dimension, center, true);
  emitFeedback(player, "Hipercubo alinhado", "W=4 e Projecao=4 revelaram a passagem final.", "random.levelup");
  player.sendMessage(`${PREFIX} Sala alinhada: voce combinou a fatia W correta com a quarta projecao. A passagem final apareceu.`);
  log(`Sala do Hipercubo concluida por ${player.name}.`);
}

function buildHypercubeRoom(dimension, center) {
  const minX = center.x - HYPERCUBE_ROOM.halfWidth;
  const maxX = center.x + HYPERCUBE_ROOM.halfWidth;
  const minZ = center.z - HYPERCUBE_ROOM.halfDepth;
  const maxZ = center.z + HYPERCUBE_ROOM.halfDepth;
  const floorY = center.y - 1;
  const ceilingY = center.y + HYPERCUBE_ROOM.height;

  for (let x = minX; x <= maxX; x += 1) {
    for (let z = minZ; z <= maxZ; z += 1) {
      const axis = x === center.x || z === center.z;
      const nearCenter = Math.abs(x - center.x) <= 2 && Math.abs(z - center.z) <= 2;
      const floorBlock = nearCenter ? "minecraft:amethyst_block" : axis ? "minecraft:deepslate_tiles" : "minecraft:blackstone";
      setBlockSafe(dimension, { x, y: floorY, z }, floorBlock);
      setBlockSafe(dimension, { x, y: ceilingY, z }, (x + z) % 4 === 0 ? "minecraft:sea_lantern" : "minecraft:black_stained_glass");
    }
  }

  for (let y = center.y; y <= ceilingY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const doorway = Math.abs(x - center.x) <= 2 && y <= center.y + 3;
      setBlockSafe(dimension, { x, y, z: minZ }, doorway ? "minecraft:air" : "minecraft:black_stained_glass");
      setBlockSafe(dimension, { x, y, z: maxZ }, doorway ? "minecraft:air" : "minecraft:black_stained_glass");
    }
    for (let z = minZ; z <= maxZ; z += 1) {
      const doorway = Math.abs(z - center.z) <= 2 && y <= center.y + 3;
      setBlockSafe(dimension, { x: minX, y, z }, doorway ? "minecraft:air" : "minecraft:black_stained_glass");
      setBlockSafe(dimension, { x: maxX, y, z }, doorway ? "minecraft:air" : "minecraft:black_stained_glass");
    }
  }

  setLineSafe(dimension, { x: minX + 1, y: center.y + 1, z: minZ + 1 }, { x: maxX - 1, y: center.y + 1, z: minZ + 1 }, "minecraft:sea_lantern");
  setLineSafe(dimension, { x: minX + 1, y: center.y + 1, z: maxZ - 1 }, { x: maxX - 1, y: center.y + 1, z: maxZ - 1 }, "minecraft:sea_lantern");
  setLineSafe(dimension, { x: minX + 1, y: center.y + 1, z: minZ + 1 }, { x: minX + 1, y: center.y + 1, z: maxZ - 1 }, "minecraft:sea_lantern");
  setLineSafe(dimension, { x: maxX - 1, y: center.y + 1, z: minZ + 1 }, { x: maxX - 1, y: center.y + 1, z: maxZ - 1 }, "minecraft:sea_lantern");

  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z }, "minecraft:air");
  setBlockSafe(dimension, { x: center.x, y: center.y + 1, z: center.z }, "minecraft:air");
}

function buildImmersive4DChamber(dimension, center) {
  for (let x = center.x - IMMERSION_RADIUS; x <= center.x + IMMERSION_RADIUS; x += 1) {
    for (let z = center.z - IMMERSION_RADIUS; z <= center.z + IMMERSION_RADIUS; z += 1) {
      const ax = Math.abs(x - center.x);
      const az = Math.abs(z - center.z);
      const ring = ax === IMMERSION_RADIUS || az === IMMERSION_RADIUS;
      const axis = x === center.x || z === center.z;
      const diagonal = ax === az && ax % 3 === 0;
      const block = ring ? "minecraft:crying_obsidian" : axis ? "minecraft:amethyst_block" : diagonal ? "minecraft:purple_glazed_terracotta" : "minecraft:blackstone";
      setBlockSafe(dimension, { x, y: center.y - 1, z }, block);
      if (ring && (x + z) % 2 === 0) {
        setBlockSafe(dimension, { x, y: center.y, z }, "minecraft:purple_stained_glass");
        setBlockSafe(dimension, { x, y: center.y + 1, z }, "minecraft:purple_stained_glass");
      }
    }
  }

  for (let offset = -IMMERSION_RADIUS; offset <= IMMERSION_RADIUS; offset += 3) {
    setBlockSafe(dimension, { x: center.x + offset, y: center.y + 8, z: center.z - IMMERSION_RADIUS }, "minecraft:sea_lantern");
    setBlockSafe(dimension, { x: center.x + offset, y: center.y + 8, z: center.z + IMMERSION_RADIUS }, "minecraft:sea_lantern");
    setBlockSafe(dimension, { x: center.x - IMMERSION_RADIUS, y: center.y + 8, z: center.z + offset }, "minecraft:sea_lantern");
    setBlockSafe(dimension, { x: center.x + IMMERSION_RADIUS, y: center.y + 8, z: center.z + offset }, "minecraft:sea_lantern");
  }

  buildHypercubeRoom(dimension, center);
  buildTesseractProjection(dimension, TESSERACT_CENTER);

  for (let index = 0; index < W_SLICE_BLOCKS.length; index += 1) {
    const z = center.z - 12 + index * 6;
    setLineSafe(dimension, { x: center.x - 14, y: center.y, z }, { x: center.x + 14, y: center.y, z }, W_SLICE_BLOCKS[index]);
    setLineSafe(dimension, { x: center.x - 14, y: center.y + 1, z }, { x: center.x + 14, y: center.y + 1, z }, "minecraft:white_stained_glass");
    setBlockSafe(dimension, { x: center.x - 15, y: center.y, z }, "minecraft:sea_lantern");
    setBlockSafe(dimension, { x: center.x + 15, y: center.y, z }, "minecraft:sea_lantern");
  }

  const state = getArenaState(dimension.id, center);
  renderCentralWSlice(dimension, center, state.w);
  renderProjectionMarker(dimension, center, state.rotation);
  renderCompletionGate(dimension, center, state.completed);

  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z }, "minecraft:air");
  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z - 4 }, GUIDE_TRIGGER_BLOCK);
  setBlockSafe(dimension, { x: center.x + 6, y: center.y, z: center.z }, ROTATION_CONTROL_BLOCK);
  setBlockSafe(dimension, { x: center.x - 6, y: center.y, z: center.z }, W_CONTROL_BLOCK);
}

function buildApiDimensionIdentity(dimension, center) {
  for (let x = center.x - DIMENSION_IDENTITY_RADIUS; x <= center.x + DIMENSION_IDENTITY_RADIUS; x += 1) {
    for (let z = center.z - DIMENSION_IDENTITY_RADIUS; z <= center.z + DIMENSION_IDENTITY_RADIUS; z += 1) {
      const isBorder = x === center.x - DIMENSION_IDENTITY_RADIUS || x === center.x + DIMENSION_IDENTITY_RADIUS || z === center.z - DIMENSION_IDENTITY_RADIUS || z === center.z + DIMENSION_IDENTITY_RADIUS;
      if (isBorder) {
        setBlockSafe(dimension, { x, y: center.y - 1, z }, "minecraft:magenta_glazed_terracotta");
      }
    }
  }

  const pillars = [
    { x: center.x - DIMENSION_IDENTITY_RADIUS, z: center.z - DIMENSION_IDENTITY_RADIUS },
    { x: center.x + DIMENSION_IDENTITY_RADIUS, z: center.z - DIMENSION_IDENTITY_RADIUS },
    { x: center.x - DIMENSION_IDENTITY_RADIUS, z: center.z + DIMENSION_IDENTITY_RADIUS },
    { x: center.x + DIMENSION_IDENTITY_RADIUS, z: center.z + DIMENSION_IDENTITY_RADIUS },
  ];
  for (const pillar of pillars) {
    for (let y = center.y; y <= center.y + 5; y += 1) {
      setBlockSafe(dimension, { x: pillar.x, y, z: pillar.z }, y % 2 === 0 ? "minecraft:crying_obsidian" : "minecraft:purple_stained_glass");
    }
    setBlockSafe(dimension, { x: pillar.x, y: center.y + 6, z: pillar.z }, "minecraft:sea_lantern");
  }

  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z + 3 }, "minecraft:lodestone");
  setBlockSafe(dimension, { x: center.x - 2, y: center.y, z: center.z - 3 }, "minecraft:amethyst_block");
  setBlockSafe(dimension, { x: center.x - 1, y: center.y, z: center.z - 3 }, "minecraft:purple_concrete");
  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z - 3 }, "minecraft:sea_lantern");
  setBlockSafe(dimension, { x: center.x + 1, y: center.y, z: center.z - 3 }, "minecraft:purple_concrete");
  setBlockSafe(dimension, { x: center.x + 2, y: center.y, z: center.z - 3 }, "minecraft:amethyst_block");
}

function buildSafePlatform(dimensionId, center, label, force = false) {
  const key = `${dimensionId}:${center.x}:${center.y}:${center.z}`;
  if (!force && builtDestinations.has(key)) {
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
  if (dimensionId === CUSTOM_DIMENSION_ID) {
    buildApiDimensionIdentity(dimension, center);
    buildImmersive4DChamber(dimension, center);
  }
  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z - 4 }, GUIDE_TRIGGER_BLOCK);
  setBlockSafe(dimension, { x: center.x - 4, y: center.y, z: center.z }, "minecraft:lodestone");
  setBlockSafe(dimension, { x: center.x + 4, y: center.y, z: center.z }, "minecraft:sea_lantern");
  const anchorBlock = getBlockTypeId(dimension, { x: center.x, y: center.y - 1, z: center.z });
  if (anchorBlock !== "minecraft:amethyst_block") {
    builtDestinations.delete(key);
    log(`Plataforma ${label} ainda nao verificou bloco ancora em ${center.x} ${center.y - 1} ${center.z}; bloco atual=${anchorBlock ?? "indisponivel"}.`);
    return false;
  }

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

function buildRotationRoom(dimension, center, state) {
  fillRoomLayer(dimension, center.x - 5, center.y - 1, center.z - 5, center.x + 5, center.z + 5, "minecraft:smooth_quartz");
  fillRoomLayer(dimension, center.x - 5, center.y, center.z - 5, center.x + 5, center.z + 5, "minecraft:air");
  fillRoomLayer(dimension, center.x - 5, center.y + 1, center.z - 5, center.x + 5, center.z + 5, "minecraft:air");
  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z }, ROTATION_CONTROL_BLOCK);
  setBlockSafe(dimension, { x: center.x, y: center.y, z: center.z - 4 }, GUIDE_TRIGGER_BLOCK);
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

function buildSprint5Arena(dimensionId, center) {
  const dimension = getDimensionSafe(dimensionId, false);
  if (!dimension) {
    return;
  }
  const state = getArenaState(dimensionId, center);
  buildRotationRoom(dimension, { x: center.x + 24, y: center.y, z: center.z }, state.rotation);
  buildWCorridor(dimension, { x: center.x, y: center.y, z: center.z + 24 }, state.w);
  buildExpansionAnchors(dimension, center);
  renderCentralWSlice(dimension, center, state.w);
  renderProjectionMarker(dimension, center, state.rotation);
  renderCompletionGate(dimension, center, state.completed);
}

function buildAllKnownDestinations() {
  if (customDimensionRegistered) {
    buildSafePlatform(CUSTOM_DIMENSION_ID, CUSTOM_CENTER, "dimensao customizada 4D", true);
    buildSprint5Arena(CUSTOM_DIMENSION_ID, CUSTOM_CENTER);
    return;
  }

  if (!fallbackStatusLogged) {
    log(`Dimensao customizada ainda nao ativa; destino unico bloqueado ate registerCustomDimension estar disponivel. Motivo: ${customDimensionError}`);
    fallbackStatusLogged = true;
  }
}

function ensureDestinationHealthy() {
  if (!customDimensionRegistered) {
    return;
  }

  const dimension = getDimensionSafe(CUSTOM_DIMENSION_ID, false);
  if (!dimension) {
    return;
  }

  const anchor = getBlockTypeId(dimension, { x: CUSTOM_CENTER.x, y: CUSTOM_CENTER.y - 1, z: CUSTOM_CENTER.z });
  if (anchor !== "minecraft:amethyst_block") {
    builtDestinations.delete(`${CUSTOM_DIMENSION_ID}:${CUSTOM_CENTER.x}:${CUSTOM_CENTER.y}:${CUSTOM_CENTER.z}`);
    log("Ancora da Sala do Hipercubo ausente; reconstruindo destino customizado sem depender do intervalo pesado.");
    buildSafePlatform(CUSTOM_DIMENSION_ID, CUSTOM_CENTER, "dimensao customizada 4D", true);
    buildSprint5Arena(CUSTOM_DIMENSION_ID, CUSTOM_CENTER);
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

function isOnPlayerCooldown(player, scope, durationTicks) {
  const key = `${getPlayerKey(player)}:${scope}`;
  const now = system.currentTick;
  const availableAt = playerCooldowns.get(key) ?? 0;
  if (now < availableAt) {
    return true;
  }

  playerCooldowns.set(key, now + durationTicks);
  return false;
}

function isOnTeleportCooldown(player) {
  return isOnPlayerCooldown(player, "teleport", TELEPORT_COOLDOWN_TICKS);
}

function isOnInteractionCooldown(player) {
  return isOnPlayerCooldown(player, "interacao", INTERACTION_COOLDOWN_TICKS);
}

function getDestination() {
  if (!USE_CUSTOM_DIMENSION_DESTINATION) {
    log("Configuracao invalida: Portal 4D deve usar a dimensao customizada como destino unico.");
  }

  if (!customDimensionRegistered) {
    return {
      center: CUSTOM_CENTER,
      dimension: undefined,
      label: `dimensao customizada indisponivel (${customDimensionError})`,
    };
  }

  const customDimension = getDimensionSafe(CUSTOM_DIMENSION_ID, false);
  if (!customDimension) {
    return {
      center: CUSTOM_CENTER,
      dimension: undefined,
      label: "dimensao customizada registrada, mas inacessivel",
    };
  }

  buildSafePlatform(CUSTOM_DIMENSION_ID, CUSTOM_CENTER, "dimensao customizada 4D", true);
  buildSprint5Arena(CUSTOM_DIMENSION_ID, CUSTOM_CENTER);
  return {
    center: CUSTOM_CENTER,
    dimension: customDimension,
    label: "dimensao customizada 4D",
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

function reinforceDestinationAfterTeleport(player, destination) {
  system.runTimeout(() => {
    buildSafePlatform(destination.dimension.id, destination.center, destination.label, true);
    buildSprint5Arena(destination.dimension.id, destination.center);

    if (player.location.y < destination.center.y - 2) {
      player.teleport({
        x: destination.center.x + 0.5,
        y: destination.center.y,
        z: destination.center.z + 0.5,
      }, { dimension: destination.dimension, rotation: { x: 0, y: 180 } });
      player.sendMessage(`${PREFIX} Segurança: arena reconstruída e posição corrigida para evitar queda/água.`);
      log(`Reposicionamento de seguranca aplicado para ${player.name} em ${destination.label}.`);
    }
  }, 1);
}

function teleportPlayer(player, destination, message) {
  if (!destination.dimension) {
    player.sendMessage(`${PREFIX} A dimensão customizada 4D ainda não está disponível. Avise um operador e confira Beta APIs/registerCustomDimension no bedrock.log.`);
    log(`Teleporte cancelado para ${player.name}: ${destination.label}.`);
    return;
  }

  const target = {
    x: destination.center.x + 0.5,
    y: destination.center.y,
    z: destination.center.z + 0.5,
  };

  try {
    buildSafePlatform(destination.dimension.id, destination.center, destination.label, true);
    player.teleport(target, { dimension: destination.dimension, rotation: { x: 0, y: 180 } });
    reinforceDestinationAfterTeleport(player, destination);
    player.sendMessage(`${PREFIX} ${message}`);
    log(`Teleporte concluido para ${player.name}: ${destination.label} @ ${target.x} ${target.y} ${target.z}.`);
  } catch (error) {
    player.sendMessage(`${PREFIX} Falha no teleporte. Confira o bedrock.log por [Portal4D].`);
    log(`Falha no teleporte de ${player.name}: ${error}`);
  }
}

function showEntryNarrative(player) {
  emitFeedback(player, "Sala do Hipercubo", "W muda a sala; projecao muda a referencia.", "portal.travel");
  sendNarrative(player, "O Bedrock continua 3D; por isso a experiência 4D é uma simulação navegável: projeção de tesseracto, fatias W e mudança de perspectiva.");
  sendNarrative(player, "Agora W nao muda apenas o corredor: ele altera a sala central e pode revelar uma porta que nao existia na fatia anterior.");
  sendNarrative(player, "Use emerald_block para ciclar W=0..4, lapis_block para ciclar Projecao=1..4 e lectern para receber o roteiro guiado.");
  sendNarrative(player, "Desafio: encontre W=4 e Projecao=4 para alinhar o Hipercubo e abrir a passagem final.");
}

function enterPortal(player, triggerLocation, triggerMode = "interacao") {
  if (isOnTeleportCooldown(player)) {
    return;
  }

  savePlayerOrigin(player);
  player.sendMessage(`${PREFIX} Portal ativado: atravessando o vao 4D como um portal do Nether.`);
  log(`Entrada valida de ${player.name} no portal por ${triggerMode} em ${triggerLocation.x} ${triggerLocation.y} ${triggerLocation.z}.`);
  teleportPlayer(player, getDestination(), "Você entrou na Sala do Hipercubo: observe o tesseracto projetado, caminhe pelas fatias W e mude a perspectiva.");

  system.runTimeout(() => {
    if (player.dimension.id === CUSTOM_DIMENSION_ID) {
      showEntryNarrative(player);
    }
  }, 8);
}

function handlePortalWalkthrough() {
  for (const player of world.getPlayers()) {
    const portalCenter = getPortalCenterFromPlayer(player);
    if (portalCenter) {
      enterPortal(player, portalCenter, "travessia");
    }
  }
}

function showCustomDimensionStatus(player) {
  try {
    const state = getArenaState(CUSTOM_DIMENSION_ID, CUSTOM_CENTER);
    const completed = state.completed ? " | alinhado" : "";
    player.onScreenDisplay?.setActionBar(`§d[Portal4D] W=${state.w}/4 | Projecao=${state.rotation + 1}/4${completed} | lectern=guia | lapis=rotacionar | emerald=W | lodestone=voltar`);
  } catch (error) {
    log(`Falha ao exibir actionbar da dimensao customizada para ${player.name}: ${error}`);
  }
}

function rescueUnsafePortalPlayers() {
  for (const player of world.getPlayers()) {
    if (player.dimension.id !== CUSTOM_DIMENSION_ID) {
      continue;
    }

    showCustomDimensionStatus(player);

    if (player.location.y >= CUSTOM_CENTER.y - 8) {
      continue;
    }

    player.sendMessage(`${PREFIX} Resgate automatico: reconstruindo o piso da dimensao customizada 4D e reposicionando no destino unico.`);
    teleportPlayer(player, {
      center: CUSTOM_CENTER,
      dimension: getDimensionSafe(CUSTOM_DIMENSION_ID),
      label: "resgate na dimensao customizada 4D",
    }, "Resgate concluido dentro da dimensao customizada 4D.");
  }
}

function returnFromPortal(player) {
  if (isOnTeleportCooldown(player)) {
    return;
  }

  const origin = playerOrigins.get(getPlayerKey(player));
  if (!origin) {
    player.sendMessage(`${PREFIX} Origem nao encontrada nesta sessao. Use /function portal_4d/recuperar para reposicionar no centro da dimensao 4D.`);
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

function recoverToCustomDimension(player) {
  if (!player) {
    log("Recuperacao por scriptevent ignorada: sourceEntity ausente.");
    return;
  }

  teleportPlayer(player, getDestination(), "Recuperacao concluida no destino unico portal4d:espaco_4d.");
}

function advanceRotationRoom(player, block, center) {
  if (isOnInteractionCooldown(player)) {
    return;
  }
  const state = getArenaState(block.dimension.id, center);
  state.rotation = (state.rotation + 1) % 4;
  arenaStates.set(getArenaStateKey(block.dimension.id, center), state);
  buildRotationRoom(block.dimension, { x: center.x + 24, y: center.y, z: center.z }, state.rotation);
  renderProjectionMarker(block.dimension, center, state.rotation);
  checkRoomCompletion(player, block.dimension, center, state);
  addTagSafe(player, ROTATION_PROGRESS_TAG);
  setProgressPropertySafe(player, "portal4d:rotation_state", state.rotation);
  emitFeedback(player, "Rotacao 4D", `Projecao ${state.rotation + 1}/4.`);
  player.sendMessage(`${PREFIX} Rotacao 4D simulada: a sala esta mostrando outra projecao do mesmo conceito. Combine com W para revelar caminhos.`);
  log(`Rotacao 4D acionada por ${player.name}; estado=${state.rotation}.`);
}

function advanceWCorridor(player, block, center) {
  if (isOnInteractionCooldown(player)) {
    return;
  }
  const state = getArenaState(block.dimension.id, center);
  state.w = (state.w + 1) % 5;
  arenaStates.set(getArenaStateKey(block.dimension.id, center), state);
  buildWCorridor(block.dimension, { x: center.x, y: center.y, z: center.z + 24 }, state.w);
  renderCentralWSlice(block.dimension, center, state.w);
  checkRoomCompletion(player, block.dimension, center, state);
  addTagSafe(player, `${W_PROGRESS_TAG_PREFIX}${state.w}`);
  setProgressPropertySafe(player, "portal4d:w_state", state.w);
  emitFeedback(player, "Coordenada W", `Fatia W=${state.w}/4.`);
  player.sendMessage(`${PREFIX} Coordenada W simulada: a sala central mudou junto com o corredor. Procure portas que so existem em uma fatia.`);
  log(`Corredor W acionado por ${player.name}; estado=${state.w}.`);
}

function handleGuideInteraction(player, block) {
  if (block.typeId !== GUIDE_TRIGGER_BLOCK) {
    return false;
  }

  const centers = [
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

  if (isNearDestinationArena(block, CUSTOM_CENTER, CUSTOM_DIMENSION_ID)) {
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
      log(`Falha ao registrar ${CUSTOM_DIMENSION_ID}; destino unico indisponivel ate corrigir Beta APIs/Custom Dimension API. Erro: ${error}`);
    }
  });
} else {
  customDimensionError = "system.beforeEvents.startup indisponivel nesta versao da Script API";
  log(`${customDimensionError}; destino unico indisponivel ate atualizar/habilitar a Script API.`);
}

const interactWithBlockEvent = world.afterEvents?.playerInteractWithBlock;
if (interactWithBlockEvent?.subscribe) {
  interactWithBlockEvent.subscribe(handlePlayerInteractWithBlock);
  log("Trigger de interacao com bloco registrado para o portal 4D.");
} else {
  log("world.afterEvents.playerInteractWithBlock indisponivel; use funcoes manuais ate atualizar a Script API.");
}

const scriptEventReceive = system.afterEvents?.scriptEventReceive;
if (scriptEventReceive?.subscribe) {
  scriptEventReceive.subscribe((event) => {
    if (event.id === RECOVERY_SCRIPT_EVENT_ID) {
      recoverToCustomDimension(event.sourceEntity);
    }
  });
  log("Scriptevent de recuperacao registrado para o destino unico 4D.");
} else {
  log("system.afterEvents.scriptEventReceive indisponivel; /function portal_4d/recuperar nao podera acionar recuperacao por script.");
}

system.run(() => {
  log("Sprint 9 carregada: Sala do Hipercubo com W dinamico, quatro projecoes, puzzle final e verificacao leve de saude.");
  notifyOperators("Sprint 9 ativa. Sala do Hipercubo: W muda a sala, lapis tem 4 projecoes, W=4 + Projecao=4 abre a passagem final.");
  buildAllKnownDestinations();
});

system.runInterval(() => {
  ensureDestinationHealthy();
}, 200);

system.runInterval(() => {
  rescueUnsafePortalPlayers();
  handlePortalWalkthrough();
}, PORTAL_WALK_CHECK_INTERVAL_TICKS);
