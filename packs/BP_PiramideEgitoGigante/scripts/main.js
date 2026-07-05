import { system } from "@minecraft/server";

const PREFIX = "[Piramide][Diagnostico]";
const DIAGNOSTIC_EVENT_ID = "piramide:diagnosticar_local";
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
const FIT_SCAN_BOTTOM = -8;
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

    for (const dy of [-1, -6]) {
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

  const blocked = liquids.length > 0 || centerProblems.length > 0 || readProblems.length > 0;
  const affected = `X ${center.x - RADIUS}..${center.x + RADIUS}, Y ${center.y - 8}..${center.y + 70}, Z ${center.z - RADIUS}..${center.z + RADIUS}`;
  const structure = `base util aprox. X/Z ${center.x - STRUCTURE_RADIUS}..${center.x + STRUCTURE_RADIUS} / ${center.z - STRUCTURE_RADIUS}..${center.z + STRUCTURE_RADIUS}`;

  if (blocked) {
    log(`BLOQUEADO centro=${center.x} ${center.y} ${center.z}; area=${affected}; ${structure}; liquidos=${liquids.length}; centro=${centerProblems.length}; ajuste=${fitProblems.length}; avisos_ajuste=${fitWarnings.length}; avisos_suporte=${supportWarnings.length}; avisos_ocupacao=${clearanceWarnings.length}; leitura=${readProblems.length}.`);
    if (liquids.length > 0) log(`Liquidos: ${summarize(liquids)}`);
    if (centerProblems.length > 0) log(`Centro sem suporte seguro: ${summarize(centerProblems)}`);
    if (fitProblems.length > 0) log(`Aviso terreno baixo/ausente que sera preenchido pela preparacao: ${summarize(fitProblems)}`);
    if (fitWarnings.length > 0) log(`Aviso ajuste vertical dentro do limite Y-8..Y+2: ${summarize(fitWarnings)}`);
    if (supportWarnings.length > 0) log(`Aviso suporte periferico sera preenchido ate Y-8: ${summarize(supportWarnings)}`);
    if (clearanceWarnings.length > 0) log(`Aviso volume acima sera limpo; valide visualmente se nao ha construcao: ${summarize(clearanceWarnings)}`);
    if (readProblems.length > 0) log(`Falhas de leitura: ${summarize(readProblems)}`);
    send(player, `BLOQUEADO em ${center.x} ${center.y} ${center.z}. Motivo critico: liquido no volume, centro sem suporte ou falha de leitura. Veja bedrock.log por ${PREFIX}.`);
    return;
  }

  log(`APROVADO centro=${center.x} ${center.y} ${center.z}; area=${affected}; ${structure}; amostras=${SAMPLE_POINTS.length}; terreno_baixo_preenchido=${fitProblems.length}; avisos_ajuste=${fitWarnings.length}; avisos_suporte=${supportWarnings.length}; avisos_ocupacao=${clearanceWarnings.length}; subsolo_preenchido=Y-8..Y-1. Rode /function piramide_egito_gigante/executar_sprint1 antes da montagem completa.`);
  if (fitProblems.length > 0) log(`Aviso terreno baixo/ausente que sera preenchido pela preparacao: ${summarize(fitProblems)}`);
  if (fitWarnings.length > 0) log(`Aviso ajuste vertical dentro do limite Y-8..Y+2: ${summarize(fitWarnings)}`);
  if (supportWarnings.length > 0) log(`Aviso suporte periferico sera preenchido ate Y-8: ${summarize(supportWarnings)}`);
  if (clearanceWarnings.length > 0) log(`Aviso volume acima sera limpo; valide visualmente se nao ha construcao: ${summarize(clearanceWarnings)}`);
  send(player, `APROVADO centro ${center.x} ${center.y} ${center.z}. Relevo natural sera preparado ate Y-8; rode primeiro /function piramide_egito_gigante/executar_sprint1.`);
}

const scriptEventReceive = system.afterEvents?.scriptEventReceive;
if (scriptEventReceive?.subscribe) {
  scriptEventReceive.subscribe((event) => {
    if (event.id !== DIAGNOSTIC_EVENT_ID) return;
    if (!event.sourceEntity) {
      log("Evento de diagnostico ignorado: sourceEntity ausente.");
      return;
    }
    diagnoseLocation(event.sourceEntity);
  });
  log(`Script carregado. Use /function piramide_egito_gigante/diagnosticar_local antes da montagem completa.`);
} else {
  log("system.afterEvents.scriptEventReceive indisponivel; diagnostico in-game nao podera registrar coordenada aprovada.");
}
