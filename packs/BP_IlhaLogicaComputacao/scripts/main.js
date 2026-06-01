import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const HUB_TRIGGER_BLOCKS = new Set(["digicomo:hub_lanterna_logica", "minecraft:sea_lantern", "minecraft:lectern"]);
const COOLDOWN_TICKS = 40;
const MENU_COOLDOWN_TICKS = 100;
const playerCooldown = new Map();
const playerMenuCooldown = new Map();
const PROXIMITY_HINT_INTERVAL_TICKS = 20;
const PROXIMITY_RADIUS = 2;
const playerHintCooldown = new Map();

function logHub(message) {
  console.warn(`[IlhaLogica][Hub] ${message}`);
}


async function runCommandForPlayer(player, command) {
  const executor = player?.dimension;
  if (!executor) {
    throw new Error("dimension indisponível para este jogador.");
  }

  const escapedName = String(player.name).replace(/"/g, '\\"');
  const commandToRun = `execute as "${escapedName}" run ${command}`;

  if (typeof executor.runCommand === "function") {
    executor.runCommand(commandToRun);
    return;
  }

  if (typeof executor.runCommandAsync === "function") {
    await executor.runCommandAsync(commandToRun);
    return;
  }

  throw new Error("dimension.runCommand/runCommandAsync indisponível para este jogador.");
}

async function runHub(player) {
  logHub(`runHub acionado para ${player.name} no tick ${system.currentTick}.`);
  await runCommandForPlayer(player, "function ilha_logica/hub");
  player.sendMessage("§b[IlhaLogica] Instruções da trilha exibidas no chat.");
}

async function openHubMenu(player) {
  const key = player.id ?? player.name;
  const now = system.currentTick;
  const nextMenuTick = playerMenuCooldown.get(key) ?? 0;

  if (now < nextMenuTick) {
    logHub(`menu em cooldown para ${player.name}: tick atual ${now}, próximo ${nextMenuTick}.`);
    return;
  }

  playerMenuCooldown.set(key, now + MENU_COOLDOWN_TICKS);

  const form = new ActionFormData()
    .title("Ilha de Lógica e Computação")
    .body("Você chegou ao centro da ilha. Escolha uma ação:")
    .button("Ver instruções")
    .button("Diagnóstico rápido")
    .button("Fechar");

  try {
    logHub(`abrindo menu para ${player.name} no tick ${now}.`);
    const response = await form.show(player);
    if (response.canceled) {
      logHub(`menu cancelado por ${player.name}.`);
      return;
    }

    logHub(`seleção de menu de ${player.name}: ${response.selection}.`);

    if (response.selection === 0) {
      await runHub(player);
    } else if (response.selection === 1) {
      await runCommandForPlayer(player, "function ilha_logica/diagnostico");
    }
  } catch (error) {
    logHub(`falha ao abrir menu para ${player.name}: ${error}`);
    player.sendMessage("§c[IlhaLogica] Não foi possível abrir o menu agora. Tente novamente sem outras telas abertas.");
  }
}

function triggerHub(player, block, source) {
  const key = player.id ?? player.name;
  const now = system.currentTick;
  const nextAllowedTick = playerCooldown.get(key) ?? 0;

  if (now < nextAllowedTick) {
    logHub(`trigger em cooldown para ${player.name}: tick atual ${now}, próximo ${nextAllowedTick}.`);
    return;
  }

  playerCooldown.set(key, now + COOLDOWN_TICKS);

  logHub(`triggerHub(${source}) para ${player.name} no bloco ${block?.typeId ?? "desconhecido"} (tick ${now}).`);

  system.run(() => {
    if (block?.typeId === "minecraft:lectern") {
      logHub(`atalho lectern para ${player.name}.`);
      void runHub(player).catch((error) => {
        logHub(`falha ao executar hub para ${player.name}: ${error}`);
        player.sendMessage("§c[IlhaLogica] Não foi possível executar o hub agora.");
      });
      return;
    }

    player.sendMessage("§e[IlhaLogica] Abra o menu para continuar a trilha.");
    logHub(`abrindo fluxo de menu no bloco ${block?.typeId ?? "desconhecido"} para ${player.name}.`);
    openHubMenu(player);
  });
}


function subscribeEvent(eventSignal, eventName, handler) {
  if (!eventSignal || typeof eventSignal.subscribe !== "function") {
    logHub(`evento indisponível na API atual: ${eventName}.`);
    return false;
  }

  eventSignal.subscribe(handler);
  logHub(`evento registrado: ${eventName}.`);
  return true;
}

subscribeEvent(world.afterEvents?.playerInteractWithBlock, "afterEvents.playerInteractWithBlock", (event) => {
  const player = event.player;
  const block = event.block;

  if (!player || !block || !HUB_TRIGGER_BLOCKS.has(block.typeId)) {
    return;
  }

  logHub(`interação válida de ${player.name} no bloco ${block.typeId}.`);
  triggerHub(player, block, "interact");
});

subscribeEvent(world.afterEvents?.playerBreakBlock, "afterEvents.playerBreakBlock", (event) => {
  const player = event.player;
  const block = event.block;

  if (!player || !block || !HUB_TRIGGER_BLOCKS.has(block.typeId)) {
    return;
  }

  logHub(`quebra válida de ${player.name} no bloco ${block.typeId}.`);
  triggerHub(player, block, "break");
});

subscribeEvent(world.afterEvents?.itemStartUseOn, "afterEvents.itemStartUseOn", (event) => {
  const player = event.source;
  const block = event.block;

  if (!player || !block || !HUB_TRIGGER_BLOCKS.has(block.typeId)) {
    return;
  }

  logHub(`itemStartUseOn válido de ${player.name} no bloco ${block.typeId}.`);
  triggerHub(player, block, "itemStartUseOn");
});

function findNearbyHubBlock(player) {
  const location = player.location;
  const baseX = Math.floor(location.x);
  const baseY = Math.floor(location.y);
  const baseZ = Math.floor(location.z);

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -PROXIMITY_RADIUS; dx <= PROXIMITY_RADIUS; dx++) {
      for (let dz = -PROXIMITY_RADIUS; dz <= PROXIMITY_RADIUS; dz++) {
        const distanceSquared = dx * dx + dz * dz;
        if (distanceSquared > PROXIMITY_RADIUS * PROXIMITY_RADIUS) {
          continue;
        }

        const candidate = player.dimension.getBlock({
          x: baseX + dx,
          y: baseY + dy,
          z: baseZ + dz,
        });

        if (candidate && HUB_TRIGGER_BLOCKS.has(candidate.typeId)) {
          return candidate;
        }
      }
    }
  }

  return undefined;
}

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    const nearbyHubBlock = findNearbyHubBlock(player);
    if (!nearbyHubBlock) {
      continue;
    }

    const key = player.id ?? player.name;
    const now = system.currentTick;
    const nextHintTick = playerHintCooldown.get(key) ?? 0;

    if (now < nextHintTick) {
      continue;
    }

    playerHintCooldown.set(key, now + PROXIMITY_HINT_INTERVAL_TICKS);
    player.onScreenDisplay.setActionBar("§e[IlhaLogica] Pressione usar na Lanterna Lógica/Lectern para iniciar.");
  }
}, PROXIMITY_HINT_INTERVAL_TICKS);

