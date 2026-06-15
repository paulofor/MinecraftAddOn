import { system, world } from "@minecraft/server";

const MONITORED_BOAT_TYPES = ["minecraftaddon:barco_3_jogadores", "minecraftaddon:barco_simples", "minecraft:boat"];
const LOG_PREFIX = "[Barco3Teste]";
const POSITION_EPSILON = 0.05;
const SUMMARY_INTERVAL_TICKS = 100;
const COMMAND_LOG_INTERVAL_TICKS = 20;
const IDLE_MOVEMENT_LOG_INTERVAL_TICKS = 5;
const SIGNIFICANT_TURN_DEGREES = 35;
const MISSING_LOG_TICKS = 60;
const BOAT_END_OFFSET = 0.9;

const SPAWN_SCRIPT_EVENT_ID = "minecraftaddon:spawn_boat";
const BOAT_SPAWN_TYPES = new Map([
  ["3_jogadores", "minecraftaddon:barco_3_jogadores"],
  ["simples", "minecraftaddon:barco_simples"],
]);

function log(message) {
  console.warn(`${LOG_PREFIX} ${message}`);
}

function getPassengers(boat) {
  try {
    const rideable = boat.getComponent("minecraft:rideable");
    return rideable?.getRiders?.() ?? [];
  } catch {
    return [];
  }
}

const state = new Map();
const metrics = new Map();
let tickCounter = 0;

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(2) : "n/a";
}

function getMovementInput(pilot) {
  const vector = pilot?.inputInfo?.getMovementVector?.();
  if (!vector) return null;

  return {
    x: vector.x ?? 0,
    y: vector.y ?? 0,
  };
}

function classifyCommand(input) {
  if (!input) return "sem_input";

  const up = input.y > 0.1;
  const down = input.y < -0.1;
  const right = input.x > 0.1;
  const left = input.x < -0.1;

  if (up && left) return "W+A";
  if (up && right) return "W+D";
  if (down && left) return "S+A";
  if (down && right) return "S+D";
  if (up) return "W";
  if (down) return "S";
  if (left) return "A";
  if (right) return "D";
  return "nenhuma";
}

function getPressedKeysLabel(input) {
  if (!input) return "indisponivel";

  const pressed = [];
  if (input.y > 0.1) pressed.push("W");
  if (input.y < -0.1) pressed.push("S");
  if (input.x > 0.1) pressed.push("D");
  if (input.x < -0.1) pressed.push("A");

  return pressed.length ? pressed.join("+") : "nenhuma";
}

function getBoatVelocity(boat) {
  try {
    const velocity = boat.getVelocity?.();
    if (!velocity) return null;

    return {
      x: velocity.x ?? 0,
      y: velocity.y ?? 0,
      z: velocity.z ?? 0,
    };
  } catch {
    return null;
  }
}

function getHorizontalSpeed(velocity) {
  if (!velocity) return 0;
  return Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
}

function getYawDelta(previous, current) {
  if (!Number.isFinite(previous) || !Number.isFinite(current)) return 0;
  let delta = current - previous;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
}

function hasMoved(lastPosition, currentPosition) {
  if (!lastPosition) return true;

  return (
    Math.abs(currentPosition.x - lastPosition.x) > POSITION_EPSILON ||
    Math.abs(currentPosition.y - lastPosition.y) > POSITION_EPSILON ||
    Math.abs(currentPosition.z - lastPosition.z) > POSITION_EPSILON
  );
}

function getBoatEnds(location, yaw) {
  const rad = (yaw * Math.PI) / 180;
  const dirX = -Math.sin(rad);
  const dirZ = Math.cos(rad);

  return {
    proa: {
      x: location.x + dirX * BOAT_END_OFFSET,
      y: location.y,
      z: location.z + dirZ * BOAT_END_OFFSET,
    },
    popa: {
      x: location.x - dirX * BOAT_END_OFFSET,
      y: location.y,
      z: location.z - dirZ * BOAT_END_OFFSET,
    },
  };
}

function getSpawnType(message) {
  const key = String(message ?? "").trim().toLowerCase();
  return BOAT_SPAWN_TYPES.get(key);
}

function handleSpawnBoatEvent(event) {
  if (event.id !== SPAWN_SCRIPT_EVENT_ID) return;

  const typeId = getSpawnType(event.message);
  if (!typeId) {
    log(`spawn_event_ignorado message=${event.message ?? "vazio"}`);
    return;
  }

  const source = event.sourceEntity;
  if (!source) {
    log(`spawn_event_sem_origem type=${typeId}`);
    return;
  }

  const location = {
    x: source.location.x,
    y: source.location.y + 1,
    z: source.location.z,
  };
  const boat = source.dimension.spawnEntity(typeId, location);
  log(
    `spawn_event_ok type=${typeId} boat=${boat.id} origem=${source.name ?? source.typeId} pos=(${formatNumber(location.x)}, ${formatNumber(location.y)}, ${formatNumber(location.z)})`,
  );
}

function recordMetric(command, movedDistance, yawDelta) {
  const entry = metrics.get(command) ?? { samples: 0, moved: 0, distance: 0, turns: 0 };
  entry.samples += 1;

  if (movedDistance > POSITION_EPSILON) {
    entry.moved += 1;
    entry.distance += movedDistance;
  }

  if (Math.abs(yawDelta) >= SIGNIFICANT_TURN_DEGREES) {
    entry.turns += 1;
  }

  metrics.set(command, entry);
}

function getInputSignature(input) {
  if (!input) return "sem_input";
  return `${classifyCommand(input)}:${formatNumber(input.x)},${formatNumber(input.y)}`;
}

function shouldLogCommand(old, commandSignature) {
  if (!old) return true;
  if (old.commandSignature !== commandSignature) return true;

  return tickCounter - (old.lastCommandLogTick ?? 0) >= COMMAND_LOG_INTERVAL_TICKS;
}

function shouldLogMovement(old, movedDistance, yawDelta, speed) {
  if (movedDistance > POSITION_EPSILON) return true;
  if (Math.abs(yawDelta) >= 1) return true;
  if (speed > 0.01) return true;
  if (!old) return true;

  return tickCounter - (old.lastMovementLogTick ?? 0) >= IDLE_MOVEMENT_LOG_INTERVAL_TICKS;
}

function emitSummaryIfNeeded() {
  if (tickCounter % SUMMARY_INTERVAL_TICKS !== 0) return;
  if (!metrics.size) return;

  const summary = [...metrics.entries()]
    .map(([command, value]) => {
      const moveRate = value.samples ? (value.moved / value.samples) * 100 : 0;
      const avgDistance = value.moved ? value.distance / value.moved : 0;
      const turnRate = value.samples ? (value.turns / value.samples) * 100 : 0;
      return `${command}:amostras=${value.samples},mov%=${moveRate.toFixed(0)},dist=${avgDistance.toFixed(2)},giro%=${turnRate.toFixed(0)}`;
    })
    .join(" | ");

  log(`resumo_controles ${summary}`);
  metrics.clear();
}


function stabilizeInPlaceTurn(boat, typeId, input) {
  // A pilotagem do barco de 3 lugares deve ficar livre para o motor nativo do
  // runtime_identifier minecraft:boat + minecraft:input_ground_controlled.
  // Antes esta função chamava clearVelocity() quando o jogador usava apenas
  // input lateral; isso anulava parte da resposta de curva e deixava o barco
  // com controle irregular. Mantemos o hook sem ação para preservar o log de
  // métricas sem interferir no movimento.
  void boat;
  void typeId;
  void input;
}

function scanBoats() {
  const activeBoatIds = new Set();

  for (const dimensionId of ["overworld", "nether", "the_end"]) {
    const dimension = world.getDimension(dimensionId);

    for (const typeId of MONITORED_BOAT_TYPES) {
      for (const boat of dimension.getEntities({ type: typeId })) {
        activeBoatIds.add(boat.id);
        const riders = getPassengers(boat);
        const names = riders.map((r) => r.name ?? r.typeId);
        const key = names.join("|");
        const location = boat.location;
        const pilot = riders[0];
        const input = getMovementInput(pilot);
        const command = classifyCommand(input);
        const commandSignature = getInputSignature(input);
        const yaw = boat.getRotation().y;
        const velocity = getBoatVelocity(boat);
        const speed = getHorizontalSpeed(velocity);
        stabilizeInPlaceTurn(boat, typeId, input);

        const old = state.get(boat.id);
        if (!old || old.key !== key) {
          log(`boat=${boat.id} type=${typeId} riders=[${names.join(", ") || "vazio"}] piloto=${names[0] ?? "nenhum"} dim=${dimensionId}`);
        }

        const dx = old?.location ? location.x - old.location.x : 0;
        const dy = old?.location ? location.y - old.location.y : 0;
        const dz = old?.location ? location.z - old.location.z : 0;
        const movedDistance = old?.location ? Math.sqrt(dx * dx + dy * dy + dz * dz) : 0;
        const yawDelta = getYawDelta(old?.yaw, yaw);

        if (pilot) {
          recordMetric(command, movedDistance, yawDelta);

          if (shouldLogCommand(old, commandSignature)) {
            log(
              `comando_jogador boat=${boat.id} type=${typeId} piloto=${pilot.name ?? pilot.typeId} teclas=${getPressedKeysLabel(input)} comando=${command} input=(${formatNumber(input?.x)}, ${formatNumber(input?.y)}) yaw=${formatNumber(yaw)} vel=(${formatNumber(velocity?.x)}, ${formatNumber(velocity?.y)}, ${formatNumber(velocity?.z)}) speed=${formatNumber(speed)} riders=${riders.length} dim=${dimensionId}`,
            );
          }

          if (shouldLogMovement(old, movedDistance, yawDelta, speed)) {
            const ends = getBoatEnds(location, yaw);
            log(
              `movimento boat=${boat.id} type=${typeId} pos=(${formatNumber(location.x)}, ${formatNumber(location.y)}, ${formatNumber(location.z)}) delta=(${formatNumber(dx)}, ${formatNumber(dy)}, ${formatNumber(dz)}) dist=${formatNumber(movedDistance)} yaw=${formatNumber(yaw)} yaw_delta=${formatNumber(yawDelta)} vel=(${formatNumber(velocity?.x)}, ${formatNumber(velocity?.y)}, ${formatNumber(velocity?.z)}) speed=${formatNumber(speed)} proa=(${formatNumber(ends.proa.x)}, ${formatNumber(ends.proa.y)}, ${formatNumber(ends.proa.z)}) popa=(${formatNumber(ends.popa.x)}, ${formatNumber(ends.popa.y)}, ${formatNumber(ends.popa.z)}) teclas=${getPressedKeysLabel(input)} comando=${command} input=(${formatNumber(input?.x)}, ${formatNumber(input?.y)}) piloto=${pilot.name ?? pilot.typeId} dim=${dimensionId}`,
            );
          }
        }

        state.set(boat.id, {
          key,
          typeId,
          dimensionId,
          yaw,
          commandSignature,
          lastCommandLogTick: pilot && shouldLogCommand(old, commandSignature) ? tickCounter : (old?.lastCommandLogTick ?? 0),
          lastMovementLogTick: pilot && shouldLogMovement(old, movedDistance, yawDelta, speed) ? tickCounter : (old?.lastMovementLogTick ?? 0),
          location: {
            x: location.x,
            y: location.y,
            z: location.z,
          },
          missingTicks: 0,
        });
      }
    }
  }

  for (const [boatId, boatState] of state.entries()) {
    if (activeBoatIds.has(boatId)) continue;
    boatState.missingTicks = (boatState.missingTicks ?? 0) + 1;

    if (boatState.missingTicks === MISSING_LOG_TICKS) {
      log(
        `barco_nao_encontrado boat=${boatId} type=${boatState.typeId ?? "desconhecido"} ultima_pos=(${formatNumber(boatState.location?.x)}, ${formatNumber(boatState.location?.y)}, ${formatNumber(boatState.location?.z)}) ultima_dim=${boatState.dimensionId ?? "desconhecida"} sem_scan=${MISSING_LOG_TICKS}s`,
      );
    }
  }
}

system.afterEvents.scriptEventReceive.subscribe(handleSpawnBoatEvent);

system.runInterval(() => {
  tickCounter += 1;
  scanBoats();
  emitSummaryIfNeeded();
}, 20);

log("Monitor de barcos carregado (barco_3_jogadores + barco_simples + minecraft:boat), com spawn via scriptevent, logs de comando, movimento e desaparecimento.");
