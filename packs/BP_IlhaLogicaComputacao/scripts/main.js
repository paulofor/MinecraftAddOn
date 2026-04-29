import { system, world } from "@minecraft/server";

const HUB_TRIGGER_BLOCKS = new Set(["minecraft:sea_lantern", "minecraft:lectern"]);
const COOLDOWN_TICKS = 40;
const playerCooldown = new Map();

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
  const player = event.player;
  const block = event.block;

  if (!player || !block || !HUB_TRIGGER_BLOCKS.has(block.typeId)) {
    return;
  }

  const key = player.id ?? player.name;
  const now = system.currentTick;
  const nextAllowedTick = playerCooldown.get(key) ?? 0;

  if (now < nextAllowedTick) {
    return;
  }

  playerCooldown.set(key, now + COOLDOWN_TICKS);

  system.run(() => {
    player.runCommandAsync("function ilha_logica/hub");
    player.sendMessage("§b[IlhaLogica] Instruções da trilha exibidas no chat.");
  });
});
