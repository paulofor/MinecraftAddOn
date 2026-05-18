import { system, world } from "@minecraft/server";

const BOAT_ID = "minecraftaddon:barco_3_jogadores";
const LOG_PREFIX = "[Barco3Teste]";
const POSITION_EPSILON = 0.05;

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

function getPressedKeysLabel(input) {
  if (!input) return "indisponivel";

  const pressed = [];
  if (input.y > 0.1) pressed.push("W");
  if (input.y < -0.1) pressed.push("S");
  if (input.x > 0.1) pressed.push("D");
  if (input.x < -0.1) pressed.push("A");

  return pressed.length ? pressed.join("+") : "nenhuma";
}

function hasMoved(lastPosition, currentPosition) {
  if (!lastPosition) return true;

  return (
    Math.abs(currentPosition.x - lastPosition.x) > POSITION_EPSILON ||
    Math.abs(currentPosition.y - lastPosition.y) > POSITION_EPSILON ||
    Math.abs(currentPosition.z - lastPosition.z) > POSITION_EPSILON
  );
}

system.runInterval(() => {
  for (const dimensionId of ["overworld", "nether", "the_end"]) {
    const dimension = world.getDimension(dimensionId);

    for (const boat of dimension.getEntities({ type: BOAT_ID })) {
      const riders = getPassengers(boat);
      const names = riders.map((r) => r.name ?? r.typeId);
      const key = names.join("|");
      const location = boat.location;
      const pilot = riders[0];
      const input = getMovementInput(pilot);

      const old = state.get(boat.id);
      if (!old || old.key !== key) {
        log(`boat=${boat.id} riders=[${names.join(", ") || "vazio"}] piloto=${names[0] ?? "nenhum"}`);
      }

      if (pilot && hasMoved(old?.location, location)) {
        log(
          `movimento boat=${boat.id} pos=(${formatNumber(location.x)}, ${formatNumber(location.y)}, ${formatNumber(location.z)}) teclas=${getPressedKeysLabel(input)} input=(${formatNumber(input?.x)}, ${formatNumber(input?.y)}) piloto=${pilot.name ?? pilot.typeId}`,
        );
      }

      state.set(boat.id, {
        key,
        location: {
          x: location.x,
          y: location.y,
          z: location.z,
        },
      });
    }
  }
}, 20);

log("Debug simples do barco 3 lugares carregado.");
