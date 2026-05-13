import { system, world } from "@minecraft/server";

const BOAT_ID = "minecraftaddon:barco_3_jogadores";
const LOG_PREFIX = "[Barco3Debug]";
const EXPECTED_TEXTURE = "textures/entity/boat/boat_oak";
const CLIENT_ENTITY_DEF = "RP_Barco3Jogadores/entity/barco_3_jogadores.entity.json";

function log(message) {
  console.warn(`${LOG_PREFIX} ${message}`);

  system.run(() => {
    world.sendMessage(`§7${LOG_PREFIX} ${message}`);
  });
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

log(
  `Script de debug do Barco3 carregado. Texture lookup esperado: ${EXPECTED_TEXTURE} (def: ${CLIENT_ENTITY_DEF})`
);
