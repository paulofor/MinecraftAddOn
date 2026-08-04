import { system, world } from "@minecraft/server";

const PREFIX = "[Piramide][Diagnostico]";
const DIAGNOSTIC_EVENT_ID = "piramide:diagnosticar_local";
const INTERIOR_BUILD_EVENT_ID = "piramide:refazer_interior";
const INTERIOR_ROLLBACK_EVENT_ID = "piramide:restaurar_interior";
const SEALS_BUILD_EVENT_ID = "piramide:construir_quatro_selos";
const SEALS_ROLLBACK_EVENT_ID = "piramide:remover_quatro_selos";
const INTERIOR_TICKING_AREA = "piramide_interior_tmp";
let interiorBuildRunning = false;
const sealProgress = new Map();
const SEAL_CENTER_PROPERTY = "piramide:quatro_selos_centro";
const RADIUS = 64;
const STRUCTURE_RADIUS = 60;
const SAMPLE_POINTS = [
  { dx: 0, dz: 0, label: "centro" },
  { dx: -60, dz: -60, label: "canto noroeste" },
  { dx: 60, dz: -60, label: "canto nordeste" },
  { dx: -60, dz: 60, label: "canto sudoeste" },
  { dx: 60, dz: 60, label: "canto sudeste" },
  { dx: 0, dz: -60, label: "borda norte" },
  { dx: 0, dz: 60, label: "borda sul" },
  { dx: -60, dz: 0, label: "borda oeste" },
  { dx: 60, dz: 0, label: "borda leste" },
  { dx: -30, dz: -30, label: "quadrante noroeste" },
  { dx: 30, dz: -30, label: "quadrante nordeste" },
  { dx: -30, dz: 30, label: "quadrante sudoeste" },
  { dx: 30, dz: 30, label: "quadrante sudeste" },
  { dx: -45, dz: -45, label: "subsolo noroeste" },
  { dx: 45, dz: -45, label: "subsolo nordeste" },
  { dx: -45, dz: 45, label: "subsolo sudoeste" },
  { dx: 45, dz: 45, label: "subsolo sudeste" },
];
const CLEARANCE_OFFSETS = [2, 16, 32, 58, 70];
const FIT_SCAN_TOP = 2;
const FIT_SCAN_BOTTOM = -32;
const LIQUID_BLOCKS = new Set(["minecraft:water", "minecraft:flowing_water", "minecraft:lava", "minecraft:flowing_lava"]);
const UNSAFE_CENTER_BLOCKS = new Set(["minecraft:air", "minecraft:water", "minecraft:flowing_water", "minecraft:lava", "minecraft:flowing_lava"]);

function log(message) {
  console.warn(`${PREFIX} ${message}`);
}

function send(entity, message) {
  if (entity?.sendMessage) {
    entity.sendMessage(`${PREFIX} ${message}`);
  }
}

function blockType(dimension, x, y, z) {
  const block = dimension.getBlock({ x, y, z });
  return block?.typeId ?? "minecraft:air";
}

function isLiquid(typeId) {
  return LIQUID_BLOCKS.has(typeId);
}

function isUnsafeCenter(typeId) {
  return UNSAFE_CENTER_BLOCKS.has(typeId);
}

function isTerrainSupport(typeId) {
  return typeId !== "minecraft:air" && !isLiquid(typeId) && !typeId.endsWith("_leaves") && !typeId.endsWith("_log");
}

function findTerrainOffset(dimension, center, point) {
  const x = center.x + point.dx;
  const z = center.z + point.dz;
  for (let dy = FIT_SCAN_TOP; dy >= FIT_SCAN_BOTTOM; dy -= 1) {
    const y = center.y + dy;
    const typeId = blockType(dimension, x, y, z);
    if (isTerrainSupport(typeId)) {
      return { dy, x, y, z, typeId, label: point.label };
    }
  }
  return null;
}

function summarize(items, limit = 6) {
  if (items.length <= limit) {
    return items.join("; ");
  }
  return `${items.slice(0, limit).join("; ")}; ... +${items.length - limit}`;
}

function diagnoseLocation(player) {
  const dimension = player.dimension;
  const loc = player.location;
  const center = {
    x: Math.floor(loc.x),
    y: Math.floor(loc.y),
    z: Math.floor(loc.z),
  };

  const liquids = [];
  const supportWarnings = [];
  const clearanceWarnings = [];
  const centerProblems = [];
  const fitProblems = [];
  const fitWarnings = [];
  const readProblems = [];

  for (const point of SAMPLE_POINTS) {
    const x = center.x + point.dx;
    const z = center.z + point.dz;

    for (const dy of [-1, -6, -16, -28]) {
      const y = center.y + dy;
      let typeId = "minecraft:air";
      try {
        typeId = blockType(dimension, x, y, z);
      } catch (error) {
        readProblems.push(`${point.label} ${x} ${y} ${z}: ${error}`);
        continue;
      }
      if (isLiquid(typeId)) {
        liquids.push(`${point.label} ${x} ${y} ${z}: ${typeId}`);
      }
    }

    const supportY = center.y - 3;
    let supportType = "minecraft:air";
    try {
      supportType = blockType(dimension, x, supportY, z);
    } catch (error) {
      readProblems.push(`${point.label} suporte ${x} ${supportY} ${z}: ${error}`);
      continue;
    }
    if (isUnsafeCenter(supportType)) {
      supportWarnings.push(`${point.label} ${x} ${supportY} ${z}: ${supportType}`);
    }

    try {
      const terrain = findTerrainOffset(dimension, center, point);
      if (!terrain) {
        fitProblems.push(`${point.label} sem terreno entre Y${FIT_SCAN_BOTTOM} e Y+${FIT_SCAN_TOP}`);
      } else if (terrain.dy < -3) {
        fitWarnings.push(`${terrain.label} ${terrain.x} ${terrain.y} ${terrain.z}: ${terrain.typeId} em Y${terrain.dy}`);
      } else if (terrain.dy > 1) {
        fitWarnings.push(`${terrain.label} ${terrain.x} ${terrain.y} ${terrain.z}: terreno alto ${terrain.typeId} em Y+${terrain.dy}`);
      }
    } catch (error) {
      readProblems.push(`${point.label} ajuste vertical: ${error}`);
      continue;
    }

    for (const dy of CLEARANCE_OFFSETS) {
      const y = center.y + dy;
      let typeId = "minecraft:air";
      try {
        typeId = blockType(dimension, x, y, z);
      } catch (error) {
        readProblems.push(`${point.label} altura ${x} ${y} ${z}: ${error}`);
        continue;
      }
      if (typeId !== "minecraft:air") {
        clearanceWarnings.push(`${point.label} ${x} ${y} ${z}: ${typeId}`);
      }
    }
  }

  const centerBelowY = center.y - 1;
  try {
    const centerBelowType = blockType(dimension, center.x, centerBelowY, center.z);
    if (isUnsafeCenter(centerBelowType)) {
      centerProblems.push(`centro ${center.x} ${centerBelowY} ${center.z}: ${centerBelowType}`);
    }
  } catch (error) {
    readProblems.push(`centro suporte ${center.x} ${centerBelowY} ${center.z}: ${error}`);
  }

  const blocked = liquids.length > 0 || centerProblems.length > 0 || fitProblems.length > 0 || readProblems.length > 0;
  const affected = `X ${center.x - RADIUS}..${center.x + RADIUS}, Y ${center.y - 32}..${center.y + 70}, Z ${center.z - RADIUS}..${center.z + RADIUS}`;
  const structure = `base util aprox. X/Z ${center.x - STRUCTURE_RADIUS}..${center.x + STRUCTURE_RADIUS} / ${center.z - STRUCTURE_RADIUS}..${center.z + STRUCTURE_RADIUS}`;

  if (blocked) {
    log(`BLOQUEADO centro=${center.x} ${center.y} ${center.z}; area=${affected}; ${structure}; liquidos=${liquids.length}; centro=${centerProblems.length}; ajuste=${fitProblems.length}; avisos_ajuste=${fitWarnings.length}; avisos_suporte=${supportWarnings.length}; avisos_ocupacao=${clearanceWarnings.length}; leitura=${readProblems.length}.`);
    if (liquids.length > 0) log(`Liquidos: ${summarize(liquids)}`);
    if (centerProblems.length > 0) log(`Centro sem suporte seguro: ${summarize(centerProblems)}`);
    if (fitProblems.length > 0) log(`Terreno sem ancoragem ate Y-32: ${summarize(fitProblems)}`);
    if (fitWarnings.length > 0) log(`Aviso ajuste vertical dentro do limite Y-32..Y+2: ${summarize(fitWarnings)}`);
    if (supportWarnings.length > 0) log(`Aviso suporte periferico sera preenchido ate Y-32: ${summarize(supportWarnings)}`);
    if (clearanceWarnings.length > 0) log(`Aviso volume acima sera limpo; valide visualmente se nao ha construcao: ${summarize(clearanceWarnings)}`);
    if (readProblems.length > 0) log(`Falhas de leitura: ${summarize(readProblems)}`);
    send(player, `BLOQUEADO em ${center.x} ${center.y} ${center.z}. Motivo critico: liquido no volume, centro sem suporte, sem ancoragem ate Y-32 ou falha de leitura. Veja bedrock.log por ${PREFIX}.`);
    return;
  }

  log(`APROVADO centro=${center.x} ${center.y} ${center.z}; area=${affected}; ${structure}; amostras=${SAMPLE_POINTS.length}; sem_ancoragem_profunda=${fitProblems.length}; avisos_ajuste=${fitWarnings.length}; avisos_suporte=${supportWarnings.length}; avisos_ocupacao=${clearanceWarnings.length}; fundacao_preenchida=Y-32..Y-1. Rode /function piramide_egito_gigante/executar_sprint1 antes da montagem completa.`);
  if (fitProblems.length > 0) log(`Terreno sem ancoragem ate Y-32: ${summarize(fitProblems)}`);
  if (fitWarnings.length > 0) log(`Aviso ajuste vertical dentro do limite Y-32..Y+2: ${summarize(fitWarnings)}`);
  if (supportWarnings.length > 0) log(`Aviso suporte periferico sera preenchido ate Y-32: ${summarize(supportWarnings)}`);
  if (clearanceWarnings.length > 0) log(`Aviso volume acima sera limpo; valide visualmente se nao ha construcao: ${summarize(clearanceWarnings)}`);
  send(player, `APROVADO centro ${center.x} ${center.y} ${center.z}. Fundacao sera preenchida ate Y-32; rode primeiro /function piramide_egito_gigante/executar_sprint1.`);
}

function parseAbsoluteCenter(message) {
  const parts = String(message ?? "").trim().split(/\s+/);
  if (parts.length !== 3 || !parts.every((value) => /^-?\d+$/.test(value))) return null;
  const [x, y, z] = parts.map(Number);
  if (![x, y, z].every(Number.isSafeInteger) || y < 5 || y > 300) return null;
  return { x, y, z };
}

function pyramidBlock(typeId) {
  return typeId.includes("sandstone") || typeId === "minecraft:gold_block" || typeId === "minecraft:sea_lantern";
}

function precheckExistingPyramid(dimension, center) {
  const shellSamples = [
    { x: center.x - 8, y: center.y - 1, z: center.z },
    { x: center.x + 8, y: center.y - 1, z: center.z },
    { x: center.x, y: center.y + 8, z: center.z + 4 },
    { x: center.x - 3, y: center.y, z: center.z - 17 },
    { x: center.x + 3, y: center.y, z: center.z - 17 },
  ];
  const invalidShell = shellSamples.filter((location) => !pyramidBlock(blockType(dimension, location.x, location.y, location.z)));
  const liquids = [];
  for (const dx of [-7, 0, 7]) for (const dz of [-23, -8, 4, 13, 20]) {
    for (const dy of [-1, 0, 4, 8]) {
      const location = { x: center.x + dx, y: center.y + dy, z: center.z + dz };
      const typeId = blockType(dimension, location.x, location.y, location.z);
      if (isLiquid(typeId)) liquids.push(`${location.x} ${location.y} ${location.z}=${typeId}`);
    }
  }
  return { ok: invalidShell.length <= 1 && liquids.length === 0, invalidShell, liquids };
}

function interiorCommands(center) {
  const { x, y, z } = center;
  const commands = [
    // Limpa somente o envelope interno conhecido; fachada e corpo externo permanecem intactos.
    `fill ${x - 2} ${y} ${z - 24} ${x + 2} ${y + 4} ${z - 1} air`,
    `fill ${x - 7} ${y} ${z} ${x + 7} ${y + 7} ${z + 14} air`,
    `fill ${x - 2} ${y} ${z + 15} ${x + 2} ${y + 4} ${z + 21} air`,
    // Pisos ricos e corredor de chegada.
    `fill ${x - 2} ${y - 1} ${z - 24} ${x + 2} ${y - 1} ${z - 1} cut_sandstone`,
    `fill ${x - 7} ${y - 1} ${z} ${x + 7} ${y - 1} ${z + 14} smooth_sandstone`,
    `fill ${x - 2} ${y - 1} ${z + 15} ${x + 2} ${y - 1} ${z + 21} chiseled_sandstone`,
    `fill ${x} ${y - 1} ${z - 22} ${x} ${y - 1} ${z + 20} gold_block`,
    // Portal interno e nichos alternados no corredor.
    `fill ${x - 2} ${y} ${z - 2} ${x + 2} ${y + 5} ${z - 2} chiseled_sandstone outline`,
    `fill ${x - 1} ${y} ${z - 2} ${x + 1} ${y + 3} ${z - 2} air`,
  ];
  for (const offset of [-19, -14, -9, -4]) {
    commands.push(
      `setblock ${x - 2} ${y + 1} ${z + offset} chiseled_sandstone`,
      `setblock ${x + 2} ${y + 1} ${z + offset} chiseled_sandstone`,
      `setblock ${x - 2} ${y + 2} ${z + offset} soul_lantern`,
      `setblock ${x + 2} ${y + 2} ${z + offset} soul_lantern`,
    );
  }
  commands.push(
    // Câmara central alta, teto estrelado e oito pilares.
    `fill ${x - 7} ${y + 7} ${z} ${x + 7} ${y + 7} ${z + 14} cut_sandstone`,
    `fill ${x - 6} ${y + 7} ${z + 1} ${x + 6} ${y + 7} ${z + 13} black_glazed_terracotta`,
    `fill ${x - 7} ${y} ${z} ${x - 7} ${y + 7} ${z + 14} chiseled_sandstone`,
    `fill ${x + 7} ${y} ${z} ${x + 7} ${y + 7} ${z + 14} chiseled_sandstone`,
    `fill ${x - 7} ${y} ${z + 14} ${x + 7} ${y + 7} ${z + 14} chiseled_sandstone`,
  );
  for (const dx of [-5, 5]) for (const dz of [2, 6, 10, 13]) {
    commands.push(
      `fill ${x + dx} ${y} ${z + dz} ${x + dx} ${y + 5} ${z + dz} smooth_sandstone`,
      `setblock ${x + dx} ${y + 6} ${z + dz} sea_lantern`,
    );
  }
  commands.push(
    // Bifurcação ao redor do túmulo central e sarcófago monumental.
    `fill ${x - 2} ${y} ${z + 3} ${x + 2} ${y + 3} ${z + 10} red_sandstone`,
    `fill ${x - 1} ${y + 1} ${z + 4} ${x + 1} ${y + 2} ${z + 9} gold_block`,
    `setblock ${x} ${y + 3} ${z + 6} emerald_block`,
    `setblock ${x} ${y + 3} ${z + 8} lapis_block`,
    `fill ${x - 6} ${y} ${z + 3} ${x - 4} ${y + 3} ${z + 11} air`,
    `fill ${x + 4} ${y} ${z + 3} ${x + 6} ${y + 3} ${z + 11} air`,
    `fill ${x - 6} ${y - 1} ${z + 3} ${x - 4} ${y - 1} ${z + 11} orange_glazed_terracotta`,
    `fill ${x + 4} ${y - 1} ${z + 3} ${x + 6} ${y - 1} ${z + 11} orange_glazed_terracotta`,
    // Passagem secreta visível somente por uma abertura lateral e tesouro final.
    `fill ${x + 6} ${y} ${z + 11} ${x + 6} ${y + 2} ${z + 13} air`,
    `fill ${x - 2} ${y} ${z + 15} ${x + 2} ${y + 4} ${z + 21} air`,
    `setblock ${x - 2} ${y + 2} ${z + 17} soul_lantern`,
    `setblock ${x + 2} ${y + 2} ${z + 17} soul_lantern`,
    `setblock ${x} ${y} ${z + 19} chest`,
    `replaceitem block ${x} ${y} ${z + 19} slot.container 0 diamond 3`,
    `replaceitem block ${x} ${y} ${z + 19} slot.container 1 emerald 8`,
    `replaceitem block ${x} ${y} ${z + 19} slot.container 2 golden_apple 1`,
    `setblock ${x} ${y + 2} ${z + 21} beacon`,
  );
  return commands;
}

function rollbackInteriorCommands(center) {
  const { x, y, z } = center;
  return [
    `fill ${x - 2} ${y} ${z - 24} ${x + 2} ${y + 4} ${z - 1} air`,
    `fill ${x - 2} ${y - 1} ${z - 24} ${x + 2} ${y - 1} ${z - 1} sandstone`,
    `fill ${x - 7} ${y} ${z} ${x + 7} ${y + 7} ${z + 14} air`,
    `fill ${x - 7} ${y - 1} ${z} ${x + 7} ${y - 1} ${z + 14} smooth_sandstone`,
    `fill ${x - 7} ${y + 7} ${z} ${x + 7} ${y + 7} ${z + 14} sandstone`,
    `fill ${x - 7} ${y} ${z} ${x + 7} ${y + 7} ${z + 14} cut_sandstone outline`,
    `fill ${x - 2} ${y} ${z + 15} ${x + 2} ${y + 4} ${z + 21} air`,
    `fill ${x - 2} ${y - 1} ${z + 15} ${x + 2} ${y - 1} ${z + 21} sandstone`,
    `setblock ${x - 6} ${y + 1} ${z + 4} lectern`,
    `setblock ${x + 6} ${y + 1} ${z + 4} lectern`,
    `setblock ${x} ${y + 1} ${z + 9} sea_lantern`,
    `setblock ${x} ${y + 2} ${z + 9} gold_block`,
  ];
}

function sealsForCenter(center) {
  return [
    { x: center.x - 7, y: center.y + 2, z: center.z + 2, block: "minecraft:gold_block", name: "SOL" },
    { x: center.x + 7, y: center.y + 2, z: center.z + 2, block: "minecraft:emerald_block", name: "NILO" },
    { x: center.x - 7, y: center.y + 2, z: center.z + 12, block: "minecraft:lapis_block", name: "CÉU" },
    { x: center.x + 7, y: center.y + 2, z: center.z + 12, block: "minecraft:redstone_block", name: "VIDA" },
  ];
}

function sealsExpansionCommands(center) {
  const { x, y, z } = center;
  const commands = [
    // Câmara superior dentro das camadas Y80..88 da pirâmide.
    `fill ${x - 5} ${y + 9} ${z - 6} ${x + 5} ${y + 15} ${z + 6} air`,
    `fill ${x - 5} ${y + 8} ${z - 6} ${x + 5} ${y + 8} ${z + 6} chiseled_sandstone`,
    `fill ${x - 5} ${y + 16} ${z - 6} ${x + 5} ${y + 16} ${z + 6} black_glazed_terracotta`,
    `fill ${x - 5} ${y + 9} ${z - 6} ${x - 5} ${y + 15} ${z + 6} smooth_sandstone`,
    `fill ${x + 5} ${y + 9} ${z - 6} ${x + 5} ${y + 15} ${z + 6} smooth_sandstone`,
    `fill ${x - 5} ${y + 9} ${z - 6} ${x + 5} ${y + 15} ${z - 6} smooth_sandstone`,
    `fill ${x - 5} ${y + 9} ${z + 6} ${x + 5} ${y + 15} ${z + 6} smooth_sandstone`,
  ];
  // Escadaria de dez degraus atrás da porta secreta, sem escavar abaixo da fundação.
  for (let step = 0; step < 10; step += 1) {
    const stepY = y + step;
    const stepZ = z + 10 - step;
    commands.push(
      `fill ${x + 3} ${stepY} ${stepZ} ${x + 5} ${stepY + 2} ${stepZ} air`,
      `fill ${x + 3} ${stepY - 1} ${stepZ} ${x + 5} ${stepY - 1} ${stepZ} sandstone_stairs`,
    );
  }
  commands.push(
    // Porta dos selos fecha o acesso até a sequência correta.
    `fill ${x + 3} ${y} ${z + 10} ${x + 5} ${y + 3} ${z + 10} gold_block`,
  );
  for (const seal of sealsForCenter(center)) commands.push(`setblock ${seal.x} ${seal.y} ${seal.z} ${seal.block}`);
  commands.push(
    // Trono, mapa celeste e iluminação da pequena câmara superior.
    `fill ${x - 2} ${y + 9} ${z - 4} ${x + 2} ${y + 10} ${z - 2} red_sandstone`,
    `fill ${x - 1} ${y + 11} ${z - 4} ${x + 1} ${y + 13} ${z - 4} gold_block`,
    `setblock ${x} ${y + 14} ${z - 4} emerald_block`,
    `setblock ${x - 3} ${y + 14} ${z} sea_lantern`,
    `setblock ${x + 3} ${y + 14} ${z} sea_lantern`,
    `setblock ${x} ${y + 14} ${z + 3} sea_lantern`,
    `setblock ${x} ${y + 9} ${z + 3} lodestone`,
    `setblock ${x} ${y + 10} ${z + 3} beacon`,
  );
  return commands;
}

function sealsRollbackCommands(center) {
  const { x, y, z } = center;
  const commands = [];
  for (let step = 9; step >= 0; step -= 1) {
    const stepY = y + step;
    const stepZ = z + 10 - step;
    commands.push(`fill ${x + 3} ${stepY - 1} ${stepZ} ${x + 5} ${stepY + 2} ${stepZ} sandstone`);
  }
  commands.push(
    `fill ${x - 5} ${y + 8} ${z - 6} ${x + 5} ${y + 16} ${z + 6} sandstone`,
    `fill ${x + 4} ${y} ${z + 3} ${x + 6} ${y + 3} ${z + 11} air`,
  );
  for (const seal of sealsForCenter(center)) commands.push(`setblock ${seal.x} ${seal.y} ${seal.z} chiseled_sandstone`);
  return commands;
}

function saveSealCenter(center) {
  try {
    world.setDynamicProperty(SEAL_CENTER_PROPERTY, JSON.stringify(center));
  } catch (error) {
    log(`QUATRO SELOS aviso: centro não persistido: ${error}`);
  }
}

function loadSealCenter() {
  try {
    const raw = world.getDynamicProperty(SEAL_CENTER_PROPERTY);
    if (typeof raw !== "string") return null;
    const center = JSON.parse(raw);
    return parseAbsoluteCenter(`${center.x} ${center.y} ${center.z}`);
  } catch {
    return null;
  }
}

function precheckRichInterior(dimension, center) {
  const pyramid = precheckExistingPyramid(dimension, center);
  const expected = [
    { x: center.x, y: center.y - 1, z: center.z, block: "minecraft:smooth_sandstone" },
    { x: center.x - 5, y: center.y + 6, z: center.z + 2, block: "minecraft:sea_lantern" },
    { x: center.x + 5, y: center.y + 6, z: center.z + 10, block: "minecraft:sea_lantern" },
    { x: center.x, y: center.y + 3, z: center.z + 6, block: "minecraft:emerald_block" },
  ];
  const observed = expected.map((item) => ({ ...item, actual: blockType(dimension, item.x, item.y, item.z) }));
  const invalid = observed.filter((item) => item.actual !== item.block);
  // A casca é a trava destrutiva já validada pelo builder anterior. Os marcadores
  // internos são evidência adicional e não podem bloquear sozinhos uma expansão
  // confinada ao corpo quando o runtime divergir da decoração esperada.
  return { ok: pyramid.ok && invalid.length <= 2, invalid, pyramid };
}

function handleSealsBuildEvent(event, rollback = false) {
  const center = parseAbsoluteCenter(event.message);
  if (!center || interiorBuildRunning) {
    log(`QUATRO SELOS BLOQUEADO: centro inválido ou outra operação em andamento.`);
    return;
  }
  const dimension = world.getDimension("overworld");
  interiorBuildRunning = true;
  log(`QUATRO SELOS ${rollback ? "ROLLBACK" : "INÍCIO"} centro=${center.x} ${center.y} ${center.z}; envelope=X${center.x - 7}..${center.x + 7},Y${center.y}..${center.y + 16},Z${center.z - 6}..${center.z + 12}.`);
  removeInteriorTickingArea(dimension);
  let loaded;
  try {
    loaded = runDimensionCommand(dimension, `tickingarea add circle ${center.x} ${center.y} ${center.z} 3 ${INTERIOR_TICKING_AREA} true`);
  } catch (error) {
    interiorBuildRunning = false;
    log(`QUATRO SELOS BLOQUEADO carregamento: ${error}`);
    return;
  }
  Promise.resolve(loaded).then(() => system.runTimeout(() => {
    const precheck = precheckRichInterior(dimension, center);
    if (!precheck.ok) {
      log(`QUATRO SELOS BLOQUEADO precheck: shell_invalido=${precheck.pyramid.invalidShell.length}; liquidos=${precheck.pyramid.liquids.length}; interior_invalido=${precheck.invalid.length} [${precheck.invalid.map((item) => `${item.x} ${item.y} ${item.z}: esperado=${item.block}, atual=${item.actual}`).join("; ")}].`);
      removeInteriorTickingArea(dimension);
      interiorBuildRunning = false;
      return;
    }
    const commands = rollback ? sealsRollbackCommands(center) : sealsExpansionCommands(center);
    runInteriorCommands(dimension, commands, "QUATRO SELOS", () => {
      if (!rollback) saveSealCenter(center);
      else {
        try { world.setDynamicProperty(SEAL_CENTER_PROPERTY, undefined); } catch { /* no-op */ }
      }
      removeInteriorTickingArea(dimension);
      interiorBuildRunning = false;
      log(`QUATRO SELOS ${rollback ? "ROLLBACK" : "CONCLUÍDO"} centro=${center.x} ${center.y} ${center.z}; comandos=${commands.length}; tickingarea removida.`);
    });
  }, 10)).catch((error) => {
    removeInteriorTickingArea(dimension);
    interiorBuildRunning = false;
    log(`QUATRO SELOS BLOQUEADO chunks: ${error}`);
  });
}

function handleSealInteraction(event) {
  const player = event.player;
  const block = event.block;
  if (!player || !block) return;
  const center = loadSealCenter();
  if (!center) return;
  const seals = sealsForCenter(center);
  const index = seals.findIndex((seal) => seal.x === block.location.x && seal.y === block.location.y && seal.z === block.location.z && seal.block === block.typeId);
  if (index < 0) return;
  const key = player.id ?? player.name;
  const expected = sealProgress.get(key) ?? 0;
  if (index !== expected) {
    sealProgress.set(key, 0);
    player.sendMessage(`${PREFIX} Os selos perderam a luz. Recomece pelo SOL.`);
    player.playSound?.("random.break");
    return;
  }
  const next = expected + 1;
  sealProgress.set(key, next);
  player.sendMessage(`${PREFIX} Selo ${seals[index].name} desperto (${next}/4).`);
  player.playSound?.("random.orb");
  if (next < seals.length) return;
  const dimension = world.getDimension("overworld");
  runDimensionCommand(dimension, `fill ${center.x + 3} ${center.y} ${center.z + 10} ${center.x + 5} ${center.y + 3} ${center.z + 10} air`);
  sealProgress.delete(key);
  player.onScreenDisplay?.setTitle("CÂMARA DO FARAÓ", { subtitle: "Os quatro selos abriram a passagem superior" });
  player.playSound?.("random.levelup");
  log(`QUATRO SELOS RESOLVIDO jogador=${player.name}; centro=${center.x} ${center.y} ${center.z}; porta aberta.`);
}

function runInteriorCommands(dimension, commands, context, onComplete) {
  let index = 0;
  const next = () => {
    if (index >= commands.length) {
      onComplete();
      return;
    }
    const command = commands[index];
    index += 1;
    try {
      const result = dimension.runCommandAsync?.(command) ?? dimension.runCommand(command);
      if (result?.then) result.then(() => system.run(next)).catch((error) => {
        log(`${context} FALHOU comando=${index}/${commands.length}: ${error}`);
        interiorBuildRunning = false;
        removeInteriorTickingArea(dimension);
      });
      else system.run(next);
    } catch (error) {
      log(`${context} FALHOU comando=${index}/${commands.length}: ${error}`);
      interiorBuildRunning = false;
      removeInteriorTickingArea(dimension);
    }
  };
  next();
}

function runDimensionCommand(dimension, command) {
  return dimension.runCommandAsync?.(command) ?? dimension.runCommand(command);
}

function removeInteriorTickingArea(dimension) {
  try {
    return runDimensionCommand(dimension, `tickingarea remove ${INTERIOR_TICKING_AREA}`);
  } catch (error) {
    log(`Falha ao remover tickingarea temporária: ${error}`);
    return undefined;
  }
}

function handleInteriorEvent(event, rollback = false) {
  const center = parseAbsoluteCenter(event.message);
  if (!center) {
    log(`${rollback ? "ROLLBACK" : "INTERIOR"} BLOQUEADO: use X Y Z absolutos inteiros; Y=5..300.`);
    return;
  }
  if (interiorBuildRunning) {
    log(`${rollback ? "ROLLBACK" : "INTERIOR"} BLOQUEADO: outra operação está em andamento.`);
    return;
  }
  const dimension = world.getDimension("overworld");
  interiorBuildRunning = true;
  log(`${rollback ? "ROLLBACK" : "INTERIOR"} INÍCIO centro=${center.x} ${center.y} ${center.z}; envelope=X${center.x - 8}..${center.x + 8},Y${center.y - 1}..${center.y + 8},Z${center.z - 24}..${center.z + 21}.`);
  removeInteriorTickingArea(dimension);
  let loaded;
  try {
    loaded = runDimensionCommand(dimension, `tickingarea add circle ${center.x} ${center.y} ${center.z} 3 ${INTERIOR_TICKING_AREA} true`);
  } catch (error) {
    interiorBuildRunning = false;
    log(`${rollback ? "ROLLBACK" : "INTERIOR"} BLOQUEADO: falha ao solicitar chunks: ${error}`);
    return;
  }
  Promise.resolve(loaded).then(() => {
    system.runTimeout(() => {
      const precheck = precheckExistingPyramid(dimension, center);
      if (!precheck.ok) {
        log(`${rollback ? "ROLLBACK" : "INTERIOR"} BLOQUEADO precheck: shell_invalido=${precheck.invalidShell.length} [${precheck.invalidShell.map((item) => `${item.x} ${item.y} ${item.z}`).join("; ")}]; liquidos=${precheck.liquids.length}.`);
        removeInteriorTickingArea(dimension);
        interiorBuildRunning = false;
        return;
      }
      if (precheck.invalidShell.length === 1) {
        const sample = precheck.invalidShell[0];
        log(`${rollback ? "ROLLBACK" : "INTERIOR"} AVISO precheck: 4/5 amostras da casca válidas; amostra divergente=${sample.x} ${sample.y} ${sample.z}. Prosseguindo dentro do envelope interno.`);
      }
      const commands = rollback ? rollbackInteriorCommands(center) : interiorCommands(center);
      runInteriorCommands(dimension, commands, rollback ? "ROLLBACK" : "INTERIOR", () => {
        removeInteriorTickingArea(dimension);
        interiorBuildRunning = false;
        log(`${rollback ? "ROLLBACK" : "INTERIOR"} CONCLUÍDO centro=${center.x} ${center.y} ${center.z}; comandos=${commands.length}; tickingarea removida.`);
      });
    }, 10);
  }).catch((error) => {
    interiorBuildRunning = false;
    log(`${rollback ? "ROLLBACK" : "INTERIOR"} BLOQUEADO: falha ao carregar chunks: ${error}`);
  });
}

const scriptEventReceive = system.afterEvents?.scriptEventReceive;
if (scriptEventReceive?.subscribe) {
  scriptEventReceive.subscribe((event) => {
    if (event.id === INTERIOR_BUILD_EVENT_ID) {
      handleInteriorEvent(event, false);
      return;
    }
    if (event.id === INTERIOR_ROLLBACK_EVENT_ID) {
      handleInteriorEvent(event, true);
      return;
    }
    if (event.id === SEALS_BUILD_EVENT_ID) {
      handleSealsBuildEvent(event, false);
      return;
    }
    if (event.id === SEALS_ROLLBACK_EVENT_ID) {
      handleSealsBuildEvent(event, true);
      return;
    }
    if (event.id !== DIAGNOSTIC_EVENT_ID) return;
    if (!event.sourceEntity) {
      log("Evento de diagnostico ignorado: sourceEntity ausente.");
      return;
    }
    diagnoseLocation(event.sourceEntity);
  });
  log(`Script carregado. Use /function piramide_egito_gigante/diagnosticar_local antes da montagem completa.`);
  world.afterEvents.playerInteractWithBlock?.subscribe(handleSealInteraction);
} else {
  log("system.afterEvents.scriptEventReceive indisponivel; diagnostico in-game nao podera registrar coordenada aprovada.");
}
