import { world, system, BlockPermutation, ItemStack } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

const BOARD_ITEM_ID = "digicomo:quadro_ideias";
const BOARD_BLOCK_ID = "digicomo:quadro_ideias_bloco";
const IDEAS_DB_KEY = "digicomo:quadro_ideias_db";
const MAX_IDEAS_PER_BOARD = 8;

world.afterEvents.worldInitialize.subscribe((event) => {
  const def = event.propertyRegistry;
  def.registerWorldDynamicProperties({
    [IDEAS_DB_KEY]: "string"
  });

  if (!world.getDynamicProperty(IDEAS_DB_KEY)) {
    world.setDynamicProperty(IDEAS_DB_KEY, JSON.stringify({}));
  }
});

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const { player, block, itemStack } = event;

  if (!block || !player) {
    return;
  }

  if (itemStack?.typeId === BOARD_ITEM_ID) {
    event.cancel = true;

    const above = block.above();
    if (!above || !above.isAir) {
      player.sendMessage("§cNão há espaço para colocar o quadro aqui.");
      return;
    }

    above.setPermutation(BlockPermutation.resolve(BOARD_BLOCK_ID));
    consumeBoardItem(player, itemStack);
    player.sendMessage("§aQuadro de Ideias colocado! Toque nele para adicionar um post-it.");
    return;
  }

  if (block.typeId === BOARD_BLOCK_ID) {
    event.cancel = true;
    system.run(() => openIdeaForm(player, block));
  }
});

function consumeBoardItem(player, itemStack) {
  const inventory = player.getComponent("minecraft:inventory")?.container;
  const slot = player.selectedSlotIndex;
  const current = inventory?.getItem(slot);

  if (!inventory || !current || current.typeId !== itemStack.typeId) {
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

  const preview = boardIdeas.length
    ? boardIdeas.map((idea, idx) => `${idx + 1}. ${idea.author}: ${idea.text}`).join("\n")
    : "Sem post-its ainda.";

  const form = new ModalFormData()
    .title("Quadro de Ideias")
    .textField(`Post-its atuais:\n${preview}\n\nEscreva uma nova ideia:`, "Ex.: Organizar sessão de construção colaborativa", "")
    .toggle("Limpar quadro (somente para facilitadores)", false);

  const result = await form.show(player);

  if (result.canceled) {
    return;
  }

  const [ideaText, clearBoard] = result.formValues;

  if (clearBoard === true && player.hasTag("facilitador")) {
    allBoards[key] = [];
    writeIdeasDB(allBoards);
    world.sendMessage(`§e${player.name} limpou um Quadro de Ideias.`);
    return;
  }

  const text = (ideaText ?? "").trim();
  if (!text) {
    player.sendMessage("§7Nenhuma ideia adicionada.");
    return;
  }

  if (boardIdeas.length >= MAX_IDEAS_PER_BOARD) {
    player.sendMessage(`§cEste quadro já tem ${MAX_IDEAS_PER_BOARD} post-its.`);
    return;
  }

  boardIdeas.push({
    author: player.name,
    text: text.slice(0, 80)
  });

  allBoards[key] = boardIdeas;
  writeIdeasDB(allBoards);

  world.sendMessage(`§b[Quadro] ${player.name} adicionou: §f${text.slice(0, 80)}`);
}

function makeBoardKey(block) {
  const { x, y, z } = block.location;
  return `${block.dimension.id}:${x},${y},${z}`;
}

function readIdeasDB() {
  try {
    return JSON.parse(world.getDynamicProperty(IDEAS_DB_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeIdeasDB(data) {
  world.setDynamicProperty(IDEAS_DB_KEY, JSON.stringify(data));
}
