import { world, system, BlockPermutation, ItemStack, DynamicPropertiesDefinition } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

const BOARD_ITEM_ID = "digicomo:quadro_ideias";
const BOARD_BLOCK_ID = "digicomo:quadro_ideias_bloco";
const IDEAS_DB_KEY = "digicomo:quadro_ideias_db";
const MAX_IDEAS_PER_BOARD = 8;
const LOG_PREFIX = "[QuadroIdeias]";
const SCRIPT_EVENT_DIAG_ID = "digicomo:diagnostico";

function logInfo(message) {
  console.warn(`${LOG_PREFIX} ${message}`);
}

function logError(message, error) {
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : `${error ?? "erro-desconhecido"}`;
  console.error(`${LOG_PREFIX} ${message} | ${detail}`);
}

world.afterEvents.worldInitialize.subscribe((event) => {
  logInfo("worldInitialize acionado. Registrando propriedades dinâmicas.");
  const properties = new DynamicPropertiesDefinition();
  properties.defineString(IDEAS_DB_KEY, 32767);
  event.propertyRegistry.registerWorldDynamicProperties(properties);

  system.run(() => {
    if (!world.getDynamicProperty(IDEAS_DB_KEY)) {
      world.setDynamicProperty(IDEAS_DB_KEY, JSON.stringify({}));
      logInfo(`Banco de ideias inicializado com chave "${IDEAS_DB_KEY}".`);
    }

    validateContentRegistration();
    logInfo(`Se o /give falhar após atualização do addon, reinicie o mundo/servidor para recarregar os packs.`);
  });
});



world.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id !== SCRIPT_EVENT_DIAG_ID) {
    return;
  }

  const sourceName = event.sourceEntity?.typeId === "minecraft:player" ? event.sourceEntity.name : "servidor";
  logInfo(`Diagnóstico manual solicitado via /scriptevent por ${sourceName}. message=${event.message || "(vazio)"}`);

  validateContentRegistration();
  runCommandPermissionDiagnostic(event.sourceEntity);
});

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { player, block, itemStack } = event;

  if (!block || !player) {
    return;
  }

  if (itemStack?.typeId === BOARD_ITEM_ID) {
    logInfo(`Interação de colocação detectada por ${player.name}. item=${itemStack.typeId}, blocoBase=${block.typeId}`);
    event.cancel = true;

    const above = block.above();
    if (!above || !above.isAir) {
      player.sendMessage("§cNão há espaço para colocar o quadro aqui.");
      logInfo(`Falha ao posicionar quadro por falta de espaço. jogador=${player.name}`);
      return;
    }

    above.setPermutation(BlockPermutation.resolve(BOARD_BLOCK_ID));
    consumeBoardItem(player, itemStack);
    player.sendMessage("§aQuadro de Ideias colocado! Toque nele para adicionar um post-it.");
    return;
  }

  if (block.typeId === BOARD_BLOCK_ID) {
    logInfo(`Abertura de formulário do quadro por ${player.name} em ${makeBoardKey(block)}`);
    event.cancel = true;
    system.run(() => openIdeaForm(player, block));
  }
});

function consumeBoardItem(player, itemStack) {
  const inventory = player.getComponent("minecraft:inventory")?.container;
  const slot = player.selectedSlotIndex;
  const current = inventory?.getItem(slot);

  if (!inventory || !current || current.typeId !== itemStack.typeId) {
    logInfo(`Consumo de item ignorado. inventory=${Boolean(inventory)}, current=${current?.typeId ?? "vazio"}, esperado=${itemStack.typeId}`);
    return;
  }

  if (current.amount <= 1) {
    inventory.setItem(slot, undefined);
    return;
  }

  const next = new ItemStack(current.typeId, current.amount - 1);
  inventory.setItem(slot, next);
}

async function openIdeaForm(player, block) {
  const allBoards = readIdeasDB();
  const key = makeBoardKey(block);
  const boardIdeas = allBoards[key] ?? [];
  logInfo(`Formulário aberto. key=${key}, ideiasAtuais=${boardIdeas.length}, jogador=${player.name}`);

  const preview = boardIdeas.length
    ? boardIdeas.map((idea, idx) => `${idx + 1}. ${idea.author}: ${idea.text}`).join("\n")
    : "Sem post-its ainda.";

  const form = new ModalFormData()
    .title("Quadro de Ideias")
    .textField(`Post-its atuais:\n${preview}\n\nEscreva uma nova ideia:`, "Ex.: Organizar sessão de construção colaborativa", "")
    .toggle("Limpar quadro (somente para facilitadores)", false);

  const result = await form.show(player);

  if (result.canceled) {
    logInfo(`Formulário cancelado por ${player.name}.`);
    return;
  }

  const [ideaText, clearBoard] = result.formValues;

  if (clearBoard === true && player.hasTag("facilitador")) {
    allBoards[key] = [];
    writeIdeasDB(allBoards);
    world.sendMessage(`§e${player.name} limpou um Quadro de Ideias.`);
    logInfo(`Quadro limpo por facilitador. key=${key}, jogador=${player.name}`);
    return;
  }

  const text = (ideaText ?? "").trim();
  if (!text) {
    player.sendMessage("§7Nenhuma ideia adicionada.");
    logInfo(`Entrada vazia ignorada. key=${key}, jogador=${player.name}`);
    return;
  }

  if (boardIdeas.length >= MAX_IDEAS_PER_BOARD) {
    player.sendMessage(`§cEste quadro já tem ${MAX_IDEAS_PER_BOARD} post-its.`);
    logInfo(`Limite de ideias atingido. key=${key}, limite=${MAX_IDEAS_PER_BOARD}`);
    return;
  }

  boardIdeas.push({
    author: player.name,
    text: text.slice(0, 80)
  });

  allBoards[key] = boardIdeas;
  writeIdeasDB(allBoards);

  world.sendMessage(`§b[Quadro] ${player.name} adicionou: §f${text.slice(0, 80)}`);
  logInfo(`Ideia registrada com sucesso. key=${key}, total=${boardIdeas.length}, jogador=${player.name}`);
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
  logInfo(`Diagnóstico de conteúdo: esperado /give @s ${BOARD_ITEM_ID} 1`);

  try {
    const stack = new ItemStack(BOARD_ITEM_ID, 1);
    logInfo(`Item registrado com sucesso: ${stack.typeId}.`);
  } catch (error) {
    logError(
      `Item "${BOARD_ITEM_ID}" não pôde ser instanciado. Possíveis causas: namespace incorreto, nome do item diferente ou item não carregado no BP.`,
      error
    );
    suggestAlternativeItemIds();
  }

  try {
    BlockPermutation.resolve(BOARD_BLOCK_ID);
    logInfo(`Bloco registrado com sucesso: ${BOARD_BLOCK_ID}.`);
  } catch (error) {
    logError(`Bloco "${BOARD_BLOCK_ID}" não pôde ser resolvido. Possível BP incompleto ou id diferente no arquivo de bloco.`, error);
  }
}

function suggestAlternativeItemIds() {
  const alternatives = [
    "digicom:quadro_ideias",
    "digicomo:quadro_ideias_item",
    "digicom:quadro_ideias_item"
  ];

  for (const candidate of alternatives) {
    try {
      const stack = new ItemStack(candidate, 1);
      logInfo(`Atenção: id alternativo encontrado (${stack.typeId}). Revise namespace/nome do item e o comando /give.`);
      return;
    } catch (error) {
      // ignora candidatos inválidos
    }
  }

  logInfo(`Nenhum id alternativo comum foi encontrado (${alternatives.join(", ")}).`);
}

function runCommandPermissionDiagnostic(sourceEntity) {
  if (!sourceEntity || sourceEntity.typeId !== "minecraft:player") {
    logInfo("Diagnóstico de permissão de comando ignorado: execute /scriptevent como jogador para validar OP/permissão.");
    return;
  }

  sourceEntity.runCommandAsync(`give @s ${BOARD_ITEM_ID} 1`)
    .then(() => {
      logInfo(`Teste de permissão: jogador ${sourceEntity.name} conseguiu executar /give com sucesso.`);
    })
    .catch((error) => {
      logError(
        `Teste de permissão falhou para ${sourceEntity.name}. Possível falta de OP/permissão de comando ou cheats desativados.`,
        error
      );
    });
}
