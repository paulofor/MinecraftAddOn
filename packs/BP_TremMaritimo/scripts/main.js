import { system, world } from "@minecraft/server";

const PREFIX = "[TremMaritimo]";
const SCRIPT_EVENT_ID = "digicomo:trem_maritimo";
const RAIL_BLOCK = "digicomo:trilho_maritimo";
const LIGHT_BLOCK = "digicomo:trilho_maritimo_luz";
const OVERWORLD_ID = "minecraft:overworld";
const DECK_BLOCK = "minecraft:prismarine_bricks";
const EDGE_BLOCK = "minecraft:dark_prismarine";
const SUPPORT_BLOCK = "minecraft:dark_prismarine";
const GUARDRAIL_BLOCK = "minecraft:iron_bars";
const STATION_LIGHT_BLOCK = "minecraft:sea_lantern";
const SUPPORT_BOTTOM_Y = 61;

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

function placeAndCount(dimension, location, blockTypeId) {
  return setBlockSafe(dimension, location, blockTypeId) ? 1 : 0;
}

function placeSupportPier(dimension, x, topY, z) {
  let placed = 0;
  for (let y = topY - 1; y >= SUPPORT_BOTTOM_Y; y -= 1) {
    placed += placeAndCount(dimension, { x, y, z }, SUPPORT_BLOCK);
  }
  return placed;
}

function placeBridgeSlice(dimension, centerX, y, centerZ, index, axis = "x") {
  let placed = 0;
  const light = index % 6 === 0;

  placed += placeAndCount(dimension, { x: centerX, y, z: centerZ - 1 }, DECK_BLOCK);
  placed += placeAndCount(dimension, { x: centerX, y, z: centerZ + 1 }, DECK_BLOCK);
  placed += placeAndCount(dimension, { x: centerX, y, z: centerZ - 2 }, EDGE_BLOCK);
  placed += placeAndCount(dimension, { x: centerX, y, z: centerZ + 2 }, EDGE_BLOCK);

  if (placeTrackBlock(dimension, { x: centerX, y, z: centerZ }, light)) {
    placed += 1;
  }

  if (index % 2 === 0) {
    placed += placeAndCount(dimension, { x: centerX, y: y + 1, z: centerZ - 2 }, GUARDRAIL_BLOCK);
    placed += placeAndCount(dimension, { x: centerX, y: y + 1, z: centerZ + 2 }, GUARDRAIL_BLOCK);
  }

  if (index % 7 === 0) {
    placed += placeSupportPier(dimension, centerX, y, centerZ - 1);
    placed += placeSupportPier(dimension, centerX, y, centerZ + 1);
  }

  if (axis === "z") {
    placed += placeAndCount(dimension, { x: centerX - 1, y, z: centerZ }, DECK_BLOCK);
    placed += placeAndCount(dimension, { x: centerX + 1, y, z: centerZ }, DECK_BLOCK);
  }

  return placed;
}

function buildSegment(source) {
  const dimension = source?.dimension ?? getOverworld();
  const origin = floorLocation(source?.location ?? { x: -8, y: 64, z: 386 });
  let placed = 0;

  for (let z = 0; z <= 12; z += 1) {
    placed += placeBridgeSlice(dimension, origin.x, origin.y, origin.z + z, z, "z");
  }

  const message = `segmento ponte-trilho concluido com ${placed} blocos a partir de ${origin.x} ${origin.y} ${origin.z}`;
  log(message);
  notify(source, message);
}

function buildStation(dimension, centerX, y, centerZ, label) {
  let placed = 0;
  for (let x = centerX - 4; x <= centerX + 4; x += 1) {
    for (let z = centerZ - 3; z <= centerZ + 3; z += 1) {
      const border = x === centerX - 4 || x === centerX + 4 || z === centerZ - 3 || z === centerZ + 3;
      const corner = (x === centerX - 4 || x === centerX + 4) && (z === centerZ - 3 || z === centerZ + 3);
      const centerLine = z === centerZ && Math.abs(x - centerX) <= 3;
      const blockType = corner ? STATION_LIGHT_BLOCK : border ? EDGE_BLOCK : centerLine ? RAIL_BLOCK : DECK_BLOCK;
      placed += placeAndCount(dimension, { x, y, z }, blockType);
    }
  }

  for (const x of [centerX - 3, centerX + 3]) {
    for (const z of [centerZ - 2, centerZ + 2]) {
      placed += placeAndCount(dimension, { x, y: y + 1, z }, EDGE_BLOCK);
      placed += placeAndCount(dimension, { x, y: y + 2, z }, STATION_LIGHT_BLOCK);
    }
  }

  log(`estacao ${label} concluida em ${centerX} ${y} ${centerZ}`);
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

  placed += buildStation(dimension, start.x, start.y, start.z, "oeste");
  placed += buildStation(dimension, end.x, end.y, end.z, "leste");

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

    placed += placeBridgeSlice(dimension, centerX, start.y, centerZ, i);
  }

  const message = `rota ponte-trilho margem oeste -> leste concluida com ${placed} blocos (trilho, deck, guarda-corpo, suportes e estacoes).`;
  log(message);
  notify(source, message);
}

system.afterEvents.scriptEventReceive.subscribe((event) => {
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
