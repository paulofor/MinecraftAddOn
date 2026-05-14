import { system } from "@minecraft/server";

const BOAT_ID = "minecraftaddon:barco_3_jogadores";
const LOG_PREFIX = "[Barco3Debug]";
const EXPECTED_TEXTURE = "textures/entity/barco_3_jogadores";
const CLIENT_ENTITY_DEF = "RP_Barco3Jogadores/entity/barco_3_jogadores.entity.json";

const boatState = new Map();

function log(message) {
  console.warn(`${LOG_PREFIX} ${message}`);
}

function round(n) {
  return Math.round(n * 100) / 100;
}

function vecToStr(v) {
  return `x=${round(v.x)} y=${round(v.y)} z=${round(v.z)}`;
}

function getPassengers(boat) {
  try {
    const rideable = boat.getComponent("minecraft:rideable");
    return rideable?.getRiders?.() ?? [];
  } catch {
    return [];
  }
}

function summarizeBoat(boat) {
  const passengers = getPassengers(boat);
  const tags = boat.getTags();
  return [
    `id=${boat.id}`,
    `isValid=${boat.isValid}`,
    `dimension=${boat.dimension.id}`,
    `loc=${JSON.stringify(boat.location)}`,
    `riders=${passengers.length}`,
    `tags=${tags.length ? tags.join(",") : "(nenhuma)"}`
  ].join(" | ");
}

function directionFromVelocity(v) {
  const ax = Math.abs(v.x);
  const az = Math.abs(v.z);
  if (ax < 0.03 && az < 0.03) return "parado";

  if (ax >= az) {
    return v.x >= 0 ? "leste (+X)" : "oeste (-X)";
  }

  return v.z >= 0 ? "sul (+Z)" : "norte (-Z)";
}

world.afterEvents.entitySpawn.subscribe((event) => {
  if (event.entity.typeId !== BOAT_ID) return;

  log(
    `TEXTURA lookup esperado -> entity=${BOAT_ID} | texture=${EXPECTED_TEXTURE} | source=${CLIENT_ENTITY_DEF}`
  );
  log(`SPAWN detectado -> ${summarizeBoat(event.entity)}`);

  system.runTimeout(() => {
    if (!event.entity.isValid) {
      log("SPAWN +10 ticks -> entidade inválida (possível replace/kill). ");
      return;
    }

    log(`SPAWN +10 ticks -> ${summarizeBoat(event.entity)}`);
  }, 10);
});

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    const dimension = player.dimension;
    const nearbyBoats = dimension.getEntities({
      type: BOAT_ID,
      location: player.location,
      maxDistance: 8
    });

    for (const boat of nearbyBoats) {
      log(`PROXIMIDADE jogador=${player.name} -> ${summarizeBoat(boat)}`);
    }
  }
}, 100);

system.runInterval(() => {
  for (const dimension of world.getDimensions()) {
    for (const boat of dimension.getEntities({ type: BOAT_ID })) {
      const riders = getPassengers(boat);
      const ridersNames = riders.map((r) => r.name ?? r.typeId);
      const riderKey = ridersNames.join("|");
      const velocity = boat.getVelocity();
      const direction = directionFromVelocity(velocity);
      const currentLocation = boat.location;
      const previous = boatState.get(boat.id);

      if (!previous || previous.riderKey !== riderKey) {
        log(
          `ASSENTOS boat=${boat.id} -> riders=[${ridersNames.join(", ") || "vazio"}] | piloto=${ridersNames[0] ?? "nenhum"}`
        );
      }

      if (riders.length > 0) {
        const pilot = riders[0];
        const pilotDirection = pilot?.getViewDirection?.();
        const delta = previous
          ? {
              x: currentLocation.x - previous.location.x,
              y: currentLocation.y - previous.location.y,
              z: currentLocation.z - previous.location.z
            }
          : { x: 0, y: 0, z: 0 };

        log(
          `CONTROLE piloto=${pilot?.name ?? "desconhecido"} | view=${pilotDirection ? vecToStr(pilotDirection) : "n/d"} | vel=${vecToStr(velocity)} | desloc=${vecToStr(delta)} | direcao=${direction}`
        );
      }

      boatState.set(boat.id, {
        riderKey,
        location: { ...currentLocation }
      });
    }
  }
}, 20);

log(
  `Script de debug do Barco3 carregado. Texture lookup esperado: ${EXPECTED_TEXTURE} (def: ${CLIENT_ENTITY_DEF})`
);
