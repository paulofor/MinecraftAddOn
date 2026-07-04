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
const LIQUID_BLOCKS = new Set(["minecraft:water", "minecraft:flowing_water", "minecraft:lava", "minecraft:flowing_lava"]);
const UNSAFE_SUPPORT_BLOCKS = new Set(["minecraft:air", "minecraft:water", "minecraft:flowing_water", "minecraft:lava", "minecraft:flowing_lava"]);

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

function isUnsafeSupport(typeId) {
  return UNSAFE_SUPPORT_BLOCKS.has(typeId);
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
  const supportProblems = [];
  const clearanceProblems = [];
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
    if (isUnsafeSupport(supportType)) {
      supportProblems.push(`${point.label} ${x} ${supportY} ${z}: ${supportType}`);
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
        clearanceProblems.push(`${point.label} ${x} ${y} ${z}: ${typeId}`);
      }
    }
  }

  const blocked = liquids.length > 0 || supportProblems.length > 0 || readProblems.length > 0 || clearanceProblems.length > 0;
  const affected = `X ${center.x - RADIUS}..${center.x + RADIUS}, Y ${center.y - 2}..${center.y + 70}, Z ${center.z - RADIUS}..${center.z + RADIUS}`;
  const structure = `base util aprox. X/Z ${center.x - STRUCTURE_RADIUS}..${center.x + STRUCTURE_RADIUS} / ${center.z - STRUCTURE_RADIUS}..${center.z + STRUCTURE_RADIUS}`;

  if (blocked) {
    log(`BLOQUEADO centro=${center.x} ${center.y} ${center.z}; area=${affected}; ${structure}; liquidos=${liquids.length}; suporte=${supportProblems.length}; ocupacao_altura=${clearanceProblems.length}; leitura=${readProblems.length}.`);
    if (liquids.length > 0) log(`Liquidos: ${summarize(liquids)}`);
    if (supportProblems.length > 0) log(`Suporte insuficiente: ${summarize(supportProblems)}`);
    if (clearanceProblems.length > 0) log(`Volume acima nao livre: ${summarize(clearanceProblems)}`);
    if (readProblems.length > 0) log(`Falhas de leitura: ${summarize(readProblems)}`);
    send(player, `BLOQUEADO em ${center.x} ${center.y} ${center.z}. Veja bedrock.log por ${PREFIX}. Nao rode montar_completa aqui.`);
    return;
  }

  log(`APROVADO centro=${center.x} ${center.y} ${center.z}; area=${affected}; ${structure}; amostras=${SAMPLE_POINTS.length}; clearance_y=+${CLEARANCE_OFFSETS.join('/+')}. Pode executar /function piramide_egito_gigante/executar_sprint1 antes da montagem completa.`);
  send(player, `APROVADO centro ${center.x} ${center.y} ${center.z}. Rode primeiro /function piramide_egito_gigante/executar_sprint1; detalhes no bedrock.log.`);
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
