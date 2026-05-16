import { system, world } from "@minecraft/server";

const BOAT_ID = "minecraftaddon:barco_3_jogadores";
const LOG_PREFIX = "[Barco3Teste]";

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

system.runInterval(() => {
  for (const dimensionId of ["overworld", "nether", "the_end"]) {
    const dimension = world.getDimension(dimensionId);

    for (const boat of dimension.getEntities({ type: BOAT_ID })) {
      const riders = getPassengers(boat);
      const names = riders.map((r) => r.name ?? r.typeId);
      const key = names.join("|");

      const old = state.get(boat.id);
      if (!old || old.key !== key) {
        log(`boat=${boat.id} riders=[${names.join(", ") || "vazio"}] piloto=${names[0] ?? "nenhum"}`);
      }

      state.set(boat.id, { key });
    }
  }
}, 20);

log("Debug simples do barco 3 lugares carregado.");
