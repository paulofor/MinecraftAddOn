import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const HUB_TRIGGER_BLOCKS = new Set(["minecraft:sea_lantern", "minecraft:lectern"]);
const COOLDOWN_TICKS = 40;
const MENU_COOLDOWN_TICKS = 100;
const playerCooldown = new Map();
const playerMenuCooldown = new Map();

function logHub(message) {
  console.warn(`[IlhaLogica][Hub] ${message}`);
}

function runHub(player) {
  logHub(`runHub acionado para ${player.name} no tick ${system.currentTick}.`);
  player.runCommandAsync("function ilha_logica/hub");
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
      runHub(player);
    } else if (response.selection === 1) {
      player.runCommandAsync("function ilha_logica/diagnostico");
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
      runHub(player);
      return;
    }

    player.sendMessage("§e[IlhaLogica] Abra o menu para continuar a trilha.");
    logHub(`abrindo fluxo de menu no bloco ${block?.typeId ?? "desconhecido"} para ${player.name}.`);
    openHubMenu(player);
  });
}

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
  const player = event.player;
  const block = event.block;

  if (!player || !block || !HUB_TRIGGER_BLOCKS.has(block.typeId)) {
    return;
  }

  logHub(`interação válida de ${player.name} no bloco ${block.typeId}.`);
  triggerHub(player, block, "interact");
});

world.afterEvents.playerBreakBlock.subscribe((event) => {
  const player = event.player;
  const block = event.block;

  if (!player || !block || !HUB_TRIGGER_BLOCKS.has(block.typeId)) {
    return;
  }

  logHub(`quebra válida de ${player.name} no bloco ${block.typeId}.`);
  triggerHub(player, block, "break");
});
