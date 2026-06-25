import { system, world } from "@minecraft/server";

const PREFIX = "[Portal4D]";

system.run(() => {
  console.warn(`${PREFIX} Sprint 1 carregada: portal vanilla e arquitetura inicial prontos.`);
  for (const player of world.getPlayers()) {
    player.sendMessage(`${PREFIX} Use /function portal_4d/init para ver as instrucoes iniciais.`);
  }
});
