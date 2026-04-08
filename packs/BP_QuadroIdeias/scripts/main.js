import { world, system, BlockPermutation, ItemStack, DynamicPropertiesDefinition } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

const PRIMARY_BOARD_ITEM_ID = "digicomo:quadro_ideias";
const BOARD_ITEM_IDS = [
  PRIMARY_BOARD_ITEM_ID,
  "digicom:quadro_ideias",
  "digicomo:quadro_ideias_item",
  "digicom:quadro_ideias_item"
];
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

  if (itemStack && BOARD_ITEM_IDS.includes(itemStack.typeId)) {
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

  const amount = current.amount - 1;

  if (amount <= 0) {
    inventory.setItem(slot, undefined);
  } else {
    current.amount = amount;
    inventory.setItem(slot, current);
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
  logInfo(`Diagnóstico de conteúdo: comandos aceitos /give @s <${BOARD_ITEM_IDS.join(" | ")}> 1`);

  const availableIds = [];

  for (const candidate of BOARD_ITEM_IDS) {
    try {
      const stack = new ItemStack(candidate, 1);
      availableIds.push(stack.typeId);
    } catch (error) {
      // ignora ids não registrados
    }
  }

  if (availableIds.length === 0) {
    logError(
      `Nenhum id de item compatível foi instanciado (${BOARD_ITEM_IDS.join(", ")}). Possível BP desatualizado ou item não carregado.`,
      "ids-nao-encontrados"
    );
  } else {
    logInfo(`Item(ns) registrado(s): ${availableIds.join(", ")}.`);
    if (!availableIds.includes(PRIMARY_BOARD_ITEM_ID)) {
      logInfo(`Atenção: id principal (${PRIMARY_BOARD_ITEM_ID}) não foi encontrado neste carregamento.`);
    }
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

  sourceEntity.runCommandAsync(`give @s ${PRIMARY_BOARD_ITEM_ID} 1`)
    .then(() => {
      logInfo(`Teste de permissão: jogador ${sourceEntity.name} conseguiu executar /give com sucesso para ${PRIMARY_BOARD_ITEM_ID}.`);
    })
    .catch((error) => {
      logError(
        `Teste de permissão falhou para ${sourceEntity.name} no id ${PRIMARY_BOARD_ITEM_ID}. Possível falta de OP/permissão de comando ou id não registrado.`,
        error
      );
    });
}
