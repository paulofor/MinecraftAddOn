import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const HUB_TRIGGER_BLOCKS = new Set(["digicomo:hub_lanterna_logica", "minecraft:sea_lantern", "minecraft:lectern"]);
const ANSWER_CONTAINER_BLOCKS = new Set(["minecraft:chest", "minecraft:barrel"]);
const ANSWER_CHOICE_BY_BLOCK = new Map([
  ["minecraft:lime_concrete", "correta"],
  ["minecraft:red_concrete", "incorreta"],
]);
const ANSWER_PHASE_BY_BLOCK = new Map([
  ["minecraft:emerald_block", "fase_a"],
  ["minecraft:lapis_block", "fase_b"],
  ["minecraft:gold_block", "fase_c"],
  ["minecraft:diamond_block", "fase_d"],
]);
const ANSWER_PHASE_LABELS = new Map([
  ["fase_a", "Fase A - Pertinencia"],
  ["fase_b", "Fase B - Subconjuntos"],
  ["fase_c", "Fase C - Operacoes"],
  ["fase_d", "Fase D - Produto Cartesiano"],
]);
const COOLDOWN_TICKS = 40;
const MENU_COOLDOWN_TICKS = 100;
const playerCooldown = new Map();
const playerMenuCooldown = new Map();
const PROXIMITY_HINT_INTERVAL_TICKS = 20;
const PROXIMITY_RADIUS = 2;
const playerHintCooldown = new Map();
const playerAnswerCooldown = new Map();
const GUIDE_PANEL_BODY = [
  "Esta janela cria um painel escuro para leitura, sem depender do fundo do mundo.",
  "",
  "Como jogar:",
  "1) Leia no chat qual caderno V1-V4 está ativo.",
  "2) Resolva a fase atual: A, B, C e D.",
  "3) Na trilha de baús, use o baú verde para registrar resposta correta.",
  "4) Use o baú vermelho quando quiser revisão e dica do conceito.",
  "",
  "Cores da trilha:",
  "• Esmeralda: Fase A - Pertinência",
  "• Lápis: Fase B - Subconjuntos",
  "• Ouro: Fase C - Operações",
  "• Diamante: Fase D - Produto Cartesiano",
  "",
  "Dica: se o texto do mundo ficar difícil de ler, volte à Lanterna/Lectern e abra este painel novamente.",
].join("\n");

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

async function openReadingPanel(player) {
  const form = new ActionFormData()
    .title("Painel escuro da Ilha")
    .body(GUIDE_PANEL_BODY)
    .button("Entendi")
    .button("Enviar caderno no chat");

  try {
    logHub(`abrindo painel escuro para ${player.name}.`);
    const response = await form.show(player);
    if (!response.canceled && response.selection === 1) {
      await runHub(player);
    }
  } catch (error) {
    logHub(`falha ao abrir painel escuro para ${player.name}: ${error}`);
    player.sendMessage("§c[IlhaLogica] Não foi possível abrir o painel escuro agora. Tente fechar outras telas e usar a Lanterna/Lectern novamente.");
  }
}

function getRelativeBlock(block, dy) {
  return block.dimension.getBlock({
    x: block.location.x,
    y: block.location.y + dy,
    z: block.location.z,
  });
}

function getAnswerStation(block) {
  if (!block || !ANSWER_CONTAINER_BLOCKS.has(block.typeId)) {
    return undefined;
  }

  const choiceBlock = getRelativeBlock(block, -1);
  const phaseBlock = getRelativeBlock(block, -2);
  const choice = ANSWER_CHOICE_BY_BLOCK.get(choiceBlock?.typeId);
  const phase = ANSWER_PHASE_BY_BLOCK.get(phaseBlock?.typeId);

  if (!choice || !phase) {
    return undefined;
  }

  return {
    choice,
    phase,
    label: ANSWER_PHASE_LABELS.get(phase) ?? phase,
    functionPath: `ilha_logica/modulos/${phase}_${choice}`,
  };
}

function triggerAnswerStation(player, block) {
  const station = getAnswerStation(block);
  if (!station) {
    return false;
  }

  const key = player.id ?? player.name;
  const now = system.currentTick;
  const nextAllowedTick = playerAnswerCooldown.get(key) ?? 0;

  if (now < nextAllowedTick) {
    logHub(`baú de resposta em cooldown para ${player.name}: tick atual ${now}, próximo ${nextAllowedTick}.`);
    return true;
  }

  playerAnswerCooldown.set(key, now + COOLDOWN_TICKS);
  logHub(`baú de resposta acionado por ${player.name}: ${station.functionPath} no tick ${now}.`);

  system.run(() => {
    void runCommandForPlayer(player, `function ${station.functionPath}`).catch((error) => {
      logHub(`falha ao executar ${station.functionPath} para ${player.name}: ${error}`);
      player.sendMessage("§c[IlhaLogica] Não foi possível registrar essa resposta agora.");
    });
  });

  const choiceLabel = station.choice === "correta" ? "§aCORRETA" : "§cREVISAR";
  player.sendMessage(`§b[IlhaLogica] ${station.label}: baú ${choiceLabel}§b acionado.`);
  return true;
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
    .body("Você chegou ao centro da ilha. Escolha uma ação. O painel escuro melhora a leitura quando o texto fica misturado ao cenário.")
    .button("Painel escuro de leitura")
    .button("Enviar caderno no chat")
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
      await openReadingPanel(player);
    } else if (response.selection === 1) {
      await runHub(player);
    } else if (response.selection === 2) {
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
      logHub(`atalho lectern para painel escuro de ${player.name}.`);
      player.sendMessage("§e[IlhaLogica] Abrindo painel escuro para leitura.");
      void openReadingPanel(player);
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

  if (!player || !block) {
    return;
  }

  if (triggerAnswerStation(player, block)) {
    return;
  }

  if (!HUB_TRIGGER_BLOCKS.has(block.typeId)) {
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

        let candidate;
        try {
          candidate = player.dimension.getBlock({
            x: baseX + dx,
            y: baseY + dy,
            z: baseZ + dz,
          });
        } catch {
          continue;
        }

        if (candidate && (HUB_TRIGGER_BLOCKS.has(candidate.typeId) || getAnswerStation(candidate))) {
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

    const answerStation = getAnswerStation(nearbyHubBlock);
    if (answerStation) {
      player.onScreenDisplay.setActionBar(`§e[IlhaLogica] Baús da ${answerStation.label}: verde = certo, vermelho = revisar.`);
      continue;
    }

    player.onScreenDisplay.setActionBar("§e[IlhaLogica] Mire na Lanterna/Lectern e use/interaja (botão direito, LT ou toque) para abrir o painel.");
  }
}, PROXIMITY_HINT_INTERVAL_TICKS);

