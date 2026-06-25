import { world } from "@minecraft/server";

const PREFIX = "[TremMaritimo]";
const SCRIPT_EVENT_ID = "digicomo:trem_maritimo";
const RAIL_BLOCK = "digicomo:trilho_maritimo";
const LIGHT_BLOCK = "digicomo:trilho_maritimo_luz";
const OVERWORLD_ID = "minecraft:overworld";

function log(message) {
  console.warn(`${PREFIX} ${message}`);
}

function notify(source, message) {
  try {
    source?.sendMessage?.(`${PREFIX} ${message}`);
  } catch {
    // Sem entidade fonte (ex.: console/automação); o bedrock.log ainda recebe console.warn.
  }
}

function getOverworld() {
  try {
    return world.getDimension(OVERWORLD_ID);
  } catch (error) {
    log(`Falha ao acessar ${OVERWORLD_ID}: ${error}`);
    return undefined;
  }
}

function floorLocation(location) {
  return {
    x: Math.floor(location.x),
    y: Math.floor(location.y),
    z: Math.floor(location.z)
  };
}

function setBlockSafe(dimension, location, blockTypeId) {
  try {
    dimension.getBlock(location)?.setType(blockTypeId);
    return true;
  } catch (error) {
    log(`Falha ao posicionar ${blockTypeId} em ${location.x} ${location.y} ${location.z}: ${error}`);
    return false;
  }
}

function placeTrackBlock(dimension, location, light = false) {
  return setBlockSafe(dimension, location, light ? LIGHT_BLOCK : RAIL_BLOCK);
}

function buildSegment(source) {
  const dimension = source?.dimension ?? getOverworld();
  const origin = floorLocation(source?.location ?? { x: -8, y: 64, z: 386 });
  let placed = 0;

  for (let z = 0; z <= 8; z += 1) {
    for (const x of [-1, 0, 1]) {
      const isCenterLight = x === 0 && z % 3 === 0;
      if (placeTrackBlock(dimension, { x: origin.x + x, y: origin.y, z: origin.z + z }, isCenterLight)) {
        placed += 1;
      }
    }
  }

  const message = `segmento concluido com ${placed} blocos customizados a partir de ${origin.x} ${origin.y} ${origin.z}`;
  log(message);
  notify(source, message);
}

function buildStation(dimension, centerX, y, centerZ) {
  let placed = 0;
  for (let x = centerX - 2; x <= centerX + 2; x += 1) {
    for (let z = centerZ - 2; z <= centerZ + 2; z += 1) {
      const border = x === centerX - 2 || x === centerX + 2 || z === centerZ - 2 || z === centerZ + 2;
      if (placeTrackBlock(dimension, { x, y, z }, border || (x === centerX && z === centerZ))) {
        placed += 1;
      }
    }
  }
  return placed;
}

function buildRoute(source) {
  const dimension = getOverworld();
  if (!dimension) {
    notify(source, "nao foi possivel acessar o Overworld para construir a rota.");
    return;
  }

  const start = { x: -8, y: 64, z: 386 };
  const end = { x: 82, y: 64, z: 352 };
  let placed = 0;

  placed += buildStation(dimension, start.x, start.y, start.z);
  placed += buildStation(dimension, end.x, end.y, end.z);

  const steps = Math.max(Math.abs(end.x - start.x), Math.abs(end.z - start.z));
  let previousKey = "";
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const centerX = Math.round(start.x + (end.x - start.x) * t);
    const centerZ = Math.round(start.z + (end.z - start.z) * t);
    const key = `${centerX}:${centerZ}`;
    if (key === previousKey) {
      continue;
    }
    previousKey = key;

    for (const lateral of [-1, 0, 1]) {
      const light = lateral === 0 && i % 5 === 0;
      if (placeTrackBlock(dimension, { x: centerX, y: start.y, z: centerZ + lateral }, light)) {
        placed += 1;
      }
    }
  }

  const message = `rota margem oeste -> leste concluida com ${placed} blocos customizados (${RAIL_BLOCK}/${LIGHT_BLOCK}).`;
  log(message);
  notify(source, message);
}

world.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id !== SCRIPT_EVENT_ID) {
    return;
  }

  if (event.message === "segmento") {
    buildSegment(event.sourceEntity);
    return;
  }

  if (event.message === "rota_margens") {
    buildRoute(event.sourceEntity);
    return;
  }

  log(`Mensagem scriptevent desconhecida: '${event.message}'`);
});

log(`Script carregado; use /function estruturas/trilho_maritimo_segmento ou /function estruturas/trilho_maritimo_rota_margens.`);
