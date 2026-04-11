import { world, system, BlockPermutation, ItemStack } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

const BOARD_ITEM_ID = "digicomo:quadro_ideias";
const BOARD_BLOCK_ID = "digicomo:quadro_ideias_bloco";
const IDEAS_DB_KEY = "digicomo:quadro_ideias_db";
const MAX_IDEAS_PER_BOARD = 8;
const LOG_PREFIX = "[QuadroIdeias]";
const SCRIPT_EVENT_DIAG_ID = "digicomo:diagnostico";
const CHAT_HELP_COMMAND = "!quadro";
const CHAT_DIAG_COMMAND = "!quadrodiag";
const GIVE_COMMAND_HINT = `/give @s ${BOARD_ITEM_ID} 1`;

function logInfo(message) {
  console.warn(`${LOG_PREFIX} ${message}`);
}

function logError(message, error) {
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : `${error ?? "erro-desconhecido"}`;
  console.error(`${LOG_PREFIX} ${message} | ${detail}`);
}

world.afterEvents.worldInitialize.subscribe(() => {
  logInfo("worldInitialize acionado. Inicializando banco de ideias.");

  system.run(() => {
    ensureIdeasDBInitialized();
    validateContentRegistration();
    logInfo("Colocação do quadro delegada ao minecraft:block_placer (sem colocação manual por script).");
    logInfo(`Comando válido para obter o item: ${GIVE_COMMAND_HINT}`);
  });
});

const scriptEventReceive = world.afterEvents?.scriptEventReceive;
if (scriptEventReceive?.subscribe) {
  scriptEventReceive.subscribe((event) => {
    if (event.id !== SCRIPT_EVENT_DIAG_ID) {
      return;
    }

    const sourceName = event.sourceEntity?.typeId === "minecraft:player" ? event.sourceEntity.name : "servidor";
    logInfo(`Diagnóstico manual solicitado via /scriptevent por ${sourceName}. message=${event.message || "(vazio)"}`);

    validateContentRegistration();
    runCommandPermissionDiagnostic(event.sourceEntity);
  });
} else {
  logInfo("Evento scriptEventReceive indisponível nesta versão da API. Diagnóstico via /scriptevent desabilitado.");
}

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { player, block } = event;

  if (!block || !player) {
    return;
  }

  if (block.typeId === BOARD_BLOCK_ID) {
    logInfo(`Abertura de formulário do quadro por ${player.name} em ${makeBoardKey(block)}`);
    event.cancel = true;
    system.run(() => openIdeaForm(player, block));
  }
});

const chatSendEvent = world.beforeEvents?.chatSend;
if (chatSendEvent?.subscribe) {
  chatSendEvent.subscribe((event) => {
    const message = `${event.message ?? ""}`.trim();
    const lower = message.toLowerCase();
    const player = event.sender;

    if (!player) {
      return;
    }

    if (lower === CHAT_HELP_COMMAND) {
      event.cancel = true;
      giveBoardWithoutCommand(player);
      return;
    }

    if (lower === CHAT_DIAG_COMMAND) {
      event.cancel = true;
      player.sendMessage("§7Executando diagnóstico do Quadro de Ideias. Verifique os logs.");
      logInfo(`Diagnóstico solicitado via chat por ${player.name}.`);
      validateContentRegistration();
      runCommandPermissionDiagnostic(player);
      return;
    }

    if (lower.startsWith("/give") && message.includes("%")) {
      player.sendMessage("§cErro comum detectado: remova o caractere '%' do comando /give.");
      player.sendMessage(`§eExemplo correto: ${GIVE_COMMAND_HINT}`);
      logInfo(`Sintaxe suspeita detectada no chat de ${player.name}: "${message}".`);
    }
  });
} else {
  logInfo("Evento chatSend indisponível nesta versão da API. Comandos via chat (!quadro/!quadrodiag) desabilitados.");
}

function ensureIdeasDBInitialized() {
  try {
    const raw = world.getDynamicProperty(IDEAS_DB_KEY);
    if (!raw) {
      world.setDynamicProperty(IDEAS_DB_KEY, JSON.stringify({}));
      logInfo(`Banco de ideias inicializado com chave "${IDEAS_DB_KEY}".`);
      return;
    }

    JSON.parse(`${raw}`);
  } catch (error) {
    logError(`Falha ao inicializar a chave "${IDEAS_DB_KEY}". Resetando conteúdo.`, error);
    try {
      world.setDynamicProperty(IDEAS_DB_KEY, JSON.stringify({}));
    } catch (innerError) {
      logError(`Não foi possível resetar a chave "${IDEAS_DB_KEY}".`, innerError);
    }
  }
}

function openIdeaForm(player, block) {
  const db = readIdeasDB();
  const key = makeBoardKey(block);
  const boardIdeas = db[key] ?? [];
  const ideasText = boardIdeas.length
    ? boardIdeas.map((idea, index) => `${index + 1}. §e${idea.author}§r: ${idea.text}`).join("\n")
    : "(Nenhum post-it ainda)";

  logInfo(`Formulário aberto. key=${key}, ideiasAtuais=${boardIdeas.length}, jogador=${player.name}`);

  const form = new ModalFormData()
    .title("Quadro de Ideias")
    .textField(
      `Post-its atuais:\n${ideasText}\n\nNova ideia (máx. 80 caracteres):`,
      "Escreva sua ideia",
      ""
    )
    .toggle("Limpar quadro (somente para facilitadores)", false);

  form.show(player).then((response) => {
    if (response.canceled || !response.formValues) {
      logInfo(`Formulário cancelado por ${player.name}.`);
      return;
    }

    const [newIdeaRaw, clearFlag] = response.formValues;
    const newIdea = `${newIdeaRaw ?? ""}`.trim();
    const shouldClear = Boolean(clearFlag);

    if (shouldClear && player.hasTag("facilitador")) {
      db[key] = [];
      writeIdeasDB(db);
      player.sendMessage("§aQuadro limpo com sucesso.");
      logInfo(`Quadro limpo por ${player.name}. key=${key}`);
      return;
    }

    if (!newIdea) {
      player.sendMessage("§eNenhuma ideia adicionada.");
      return;
    }

    if (newIdea.length > 80) {
      player.sendMessage("§cA ideia deve ter no máximo 80 caracteres.");
      return;
    }

    if (boardIdeas.length >= MAX_IDEAS_PER_BOARD) {
      player.sendMessage(`§cEste quadro já tem ${MAX_IDEAS_PER_BOARD} post-its.`);
      logInfo(`Limite de ideias atingido. key=${key}, limite=${MAX_IDEAS_PER_BOARD}`);
      return;
    }

    boardIdeas.push({
      author: player.name,
      text: newIdea
    });

    db[key] = boardIdeas;
    writeIdeasDB(db);
    player.sendMessage("§aIdeia adicionada ao quadro!");
    logInfo(`Ideia adicionada. key=${key}, total=${boardIdeas.length}, autor=${player.name}`);
  }).catch((error) => {
    logError(`Erro ao exibir/processar formulário para ${player.name}.`, error);
  });
}

function makeBoardKey(block) {
  const { x, y, z } = block.location;
  return `${block.dimension.id}:${x},${y},${z}`;
}

function readIdeasDB() {
  try {
    return JSON.parse(world.getDynamicProperty(IDEAS_DB_KEY) ?? "{}");
  } catch (error) {
    logError(`Falha ao ler JSON da chave "${IDEAS_DB_KEY}". Resetando para objeto vazio.`, error);
    return {};
  }
}

function writeIdeasDB(data) {
  try {
    world.setDynamicProperty(IDEAS_DB_KEY, JSON.stringify(data));
  } catch (error) {
    logError(`Falha ao escrever JSON da chave "${IDEAS_DB_KEY}".`, error);
  }
}

function validateContentRegistration() {
  logInfo(`Diagnóstico de conteúdo: comando aceito ${GIVE_COMMAND_HINT}`);

  try {
    const stack = new ItemStack(BOARD_ITEM_ID, 1);
    logInfo(`Item registrado com sucesso: ${stack.typeId}.`);
  } catch (error) {
    logError(`Item "${BOARD_ITEM_ID}" não pôde ser instanciado. Possível BP desatualizado ou item não carregado.`, error);
  }

  try {
    BlockPermutation.resolve(BOARD_BLOCK_ID);
    logInfo(`Bloco registrado com sucesso: ${BOARD_BLOCK_ID}.`);
  } catch (error) {
    logError(`Bloco "${BOARD_BLOCK_ID}" não pôde ser resolvido. Possível BP incompleto ou id diferente no arquivo de bloco.`, error);
  }
}

function runCommandPermissionDiagnostic(sourceEntity) {
  if (!sourceEntity || sourceEntity.typeId !== "minecraft:player") {
    logInfo("Diagnóstico de permissão de comando ignorado: execute /scriptevent como jogador para validar OP/permissão.");
    return;
  }

  sourceEntity.runCommandAsync(`give @s ${BOARD_ITEM_ID} 1`)
    .then(() => {
      logInfo(`Teste de permissão: jogador ${sourceEntity.name} conseguiu executar /give com sucesso para ${BOARD_ITEM_ID}.`);
    })
    .catch((error) => {
      logError(
        `Teste de permissão falhou para ${sourceEntity.name} no id ${BOARD_ITEM_ID}. Possível falta de OP/permissão de comando ou id não registrado.`,
        error
      );
    });
}

function giveBoardWithoutCommand(player) {
  const inventory = player.getComponent("minecraft:inventory")?.container;

  if (!inventory) {
    logError(`Falha ao acessar inventário para entrega de item sem /give. jogador=${player.name}`, "inventario-indisponivel");
    player.sendMessage("§cNão foi possível acessar seu inventário agora.");
    return;
  }

  try {
    const item = new ItemStack(BOARD_ITEM_ID, 1);
    const leftover = inventory.addItem(item);
    if (leftover) {
      player.sendMessage("§eSeu inventário está cheio. Libere espaço e tente novamente.");
      logInfo(`Entrega via chat sem /give falhou por inventário cheio. jogador=${player.name}, item=${BOARD_ITEM_ID}`);
      return;
    }

    player.sendMessage(`§aVocê recebeu 1x ${BOARD_ITEM_ID} (via ${CHAT_HELP_COMMAND}).`);
    logInfo(`Entrega via chat concluída para ${player.name}. item=${BOARD_ITEM_ID}`);
  } catch (error) {
    logError(`Erro ao entregar item via chat para ${player.name}. item=${BOARD_ITEM_ID}`, error);
    player.sendMessage("§cFalha ao entregar o item. Consulte os logs do servidor.");
  }
}
