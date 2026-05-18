import { system, world } from "@minecraft/server";

const BOAT_ID = "minecraftaddon:barco_3_jogadores";
const LOG_PREFIX = "[Barco3Teste]";
const POSITION_EPSILON = 0.05;
const SUMMARY_INTERVAL_TICKS = 100;
const SIGNIFICANT_TURN_DEGREES = 35;

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

system.runInterval(() => {
  tickCounter += 1;

  for (const dimensionId of ["overworld", "nether", "the_end"]) {
    const dimension = world.getDimension(dimensionId);

    for (const boat of dimension.getEntities({ type: BOAT_ID })) {
      const riders = getPassengers(boat);
      const names = riders.map((r) => r.name ?? r.typeId);
      const key = names.join("|");
      const location = boat.location;
      const pilot = riders[0];
      const input = getMovementInput(pilot);
      const command = classifyCommand(input);

      const old = state.get(boat.id);
      if (!old || old.key !== key) {
        log(`boat=${boat.id} riders=[${names.join(", ") || "vazio"}] piloto=${names[0] ?? "nenhum"}`);
      }

      if (pilot && old?.location) {
        const dx = location.x - old.location.x;
        const dy = location.y - old.location.y;
        const dz = location.z - old.location.z;
        const movedDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const yawDelta = getYawDelta(old.yaw, boat.getRotation().y);
        recordMetric(command, movedDistance, yawDelta);
      }

      if (pilot && hasMoved(old?.location, location)) {
        log(
          `movimento boat=${boat.id} pos=(${formatNumber(location.x)}, ${formatNumber(location.y)}, ${formatNumber(location.z)}) teclas=${getPressedKeysLabel(input)} comando=${command} input=(${formatNumber(input?.x)}, ${formatNumber(input?.y)}) piloto=${pilot.name ?? pilot.typeId}`,
        );
      }

      state.set(boat.id, {
        key,
        yaw: boat.getRotation().y,
        location: {
          x: location.x,
          y: location.y,
          z: location.z,
        },
      });
    }
  }

  emitSummaryIfNeeded();
}, 20);

log("Debug simples do barco 3 lugares carregado com resumo de comandos.");
