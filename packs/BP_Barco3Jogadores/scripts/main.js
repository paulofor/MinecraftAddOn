import { system, world } from "@minecraft/server";

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

function normalizeYawDegrees(yaw) {
  let y = yaw % 360;
  if (y > 180) y -= 360;
  if (y < -180) y += 360;
  return y;
}

function deltaYawDegrees(currentYaw, previousYaw) {
  return normalizeYawDegrees(currentYaw - previousYaw);
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


function normalize2D(v) {
  const mag = Math.hypot(v.x, v.z);
  if (mag < 1e-6) return { x: 0, z: 0 };
  return { x: v.x / mag, z: v.z / mag };
}

function inferPressedKeys(pilot, delta) {
  const pressed = [];
  const move2D = normalize2D(delta);
  if (move2D.z < -0.25) pressed.push("W");
  if (move2D.z > 0.25) pressed.push("S");
  if (move2D.x > 0.25) pressed.push("D");
  if (move2D.x < -0.25) pressed.push("A");

  if (delta.y > 0.12) pressed.push("SPACE");

  const isSneaking = typeof pilot?.isSneaking === "boolean" ? pilot.isSneaking : false;
  if (isSneaking) pressed.push("SHIFT");

  return pressed;
}

function shouldSuppressSpin(inferredKeys, velocity, lateralOnlyStreak) {
  const lateralOnly = inferredKeys.length > 0 && inferredKeys.every((k) => k === "A" || k === "D");
  const horizontalSpeed = Math.hypot(velocity.x, velocity.z);
  const lowSpeed = horizontalSpeed < 0.12;
  const stableLateralInput = lateralOnlyStreak >= 3;
  return lateralOnly && lowSpeed && stableLateralInput;
}

function clampSpinForLateralOnly(boat, inferredKeys, velocity, lateralOnlyStreak) {
  if (!shouldSuppressSpin(inferredKeys, velocity, lateralOnlyStreak)) return false;

  const dampedVelocity = {
    x: velocity.x * 0.35,
    y: velocity.y,
    z: velocity.z * 0.35
  };

  log(
    `ANTI_GIRO boat=${boat.id} | teclas=[${inferredKeys.join("+")}] | velAntes=${vecToStr(velocity)} | velDepois=${vecToStr(dampedVelocity)}`
  );

  if (typeof boat.setVelocity === "function") {
    boat.setVelocity(dampedVelocity);
    return true;
  }

  if (typeof boat.clearVelocity === "function" && typeof boat.applyImpulse === "function") {
    boat.clearVelocity();
    boat.applyImpulse({
      x: dampedVelocity.x * 0.5,
      y: 0,
      z: dampedVelocity.z * 0.5
    });
    return true;
  }

  log(`ANTI_GIRO indisponível para boat=${boat.id} (API sem setVelocity/applyImpulse)`);
  return false;
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
  for (const dimensionId of ["overworld", "nether", "the_end"]) {
    const dimension = world.getDimension(dimensionId);
    for (const boat of dimension.getEntities({ type: BOAT_ID })) {
      const riders = getPassengers(boat);
      const ridersNames = riders.map((r) => r.name ?? r.typeId);
      const riderKey = ridersNames.join("|");
      const velocity = boat.getVelocity();
      const direction = directionFromVelocity(velocity);
      const currentLocation = boat.location;
      const previous = boatState.get(boat.id);
      const currentRotation = boat.getRotation();
      const yaw = normalizeYawDegrees(currentRotation.y);

      if (!previous || previous.riderKey !== riderKey) {
        log(
          `ASSENTOS boat=${boat.id} -> riders=[${ridersNames.join(", ") || "vazio"}] | piloto=${ridersNames[0] ?? "nenhum"}`
        );
      }

      let nextLateralOnlyStreak = 0;

      if (riders.length > 0) {
        const pilot = riders[0];
        const delta = previous
          ? {
              x: currentLocation.x - previous.location.x,
              y: currentLocation.y - previous.location.y,
              z: currentLocation.z - previous.location.z
            }
          : { x: 0, y: 0, z: 0 };

        const inferredKeys = inferPressedKeys(pilot, delta);
        const previousStreak = previous?.lateralOnlyStreak ?? 0;
        const lateralOnly = inferredKeys.length > 0 && inferredKeys.every((k) => k === "A" || k === "D");
        const lateralOnlyStreak = lateralOnly ? previousStreak + 1 : 0;
        nextLateralOnlyStreak = lateralOnlyStreak;
        const antiGiroAplicado = clampSpinForLateralOnly(boat, inferredKeys, velocity, lateralOnlyStreak);
        const deltaYaw = previous ? deltaYawDegrees(yaw, previous.yaw) : 0;
        const yawRate = deltaYaw; // loop a cada 20 ticks (~1s)
        const horizontalSpeed = Math.hypot(velocity.x, velocity.z);
        const delta2D = Math.hypot(delta.x, delta.z);

        log(
          `CONTROLE piloto=${pilot?.name ?? "desconhecido"} | teclas(inferidas)=[${inferredKeys.join("+") || "nenhuma"}] | boatPos=${vecToStr(currentLocation)} | vel=${vecToStr(velocity)} | desloc=${vecToStr(delta)} | desloc2D=${round(delta2D)} | speed2D=${round(horizontalSpeed)} | yaw=${round(yaw)} | deltaYaw=${round(deltaYaw)} | yawRate=${round(yawRate)}deg/s | lateralStreak=${lateralOnlyStreak} | direcao=${direction} | antiGiro=${antiGiroAplicado ? "sim" : "nao"}`
        );
      }

      boatState.set(boat.id, {
        riderKey,
        location: { ...currentLocation },
        yaw,
        lateralOnlyStreak: nextLateralOnlyStreak
      });
    }
  }
}, 20);

log(
  `Script de debug do Barco3 carregado. Texture lookup esperado: ${EXPECTED_TEXTURE} (def: ${CLIENT_ENTITY_DEF})`
);
