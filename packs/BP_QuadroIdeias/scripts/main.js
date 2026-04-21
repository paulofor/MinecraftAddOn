import {
  DynamicPropertiesDefinition,
  system,
  world,
} from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

const QUADRO_BLOCK_ID = "digicomo:quadro_ideias";
const IDEAS_PROPERTY_ID = "digicomo:quadro_ideias_ideas";
const IDEA_LIMIT = 20;

world.afterEvents.worldInitialize.subscribe(({ propertyRegistry }) => {
  const definition = new DynamicPropertiesDefinition();
  definition.defineString(IDEAS_PROPERTY_ID, 32767);
  propertyRegistry.registerWorldDynamicProperties(definition);
});

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
  const block = event.block;
  const player = event.player;

  if (!block || block.typeId !== QUADRO_BLOCK_ID || !player) {
    return;
  }

  system.run(() => {
    openMainMenu(player);
  });
});

function openMainMenu(player) {
  const form = new ActionFormData()
    .title("§lQuadro de Ideias")
    .body("Escolha uma ação para gerenciar as ideias da família.")
    .button("Nova ideia")
    .button("Ver ideias")
    .button("Em andamento")
    .button("Concluído");

  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        return;
      }

      switch (response.selection) {
        case 0:
          openNewIdeaForm(player);
          break;
        case 1:
          openIdeasByStatus(player, "nova");
          break;
        case 2:
          openIdeasByStatus(player, "andamento");
          break;
        case 3:
          openIdeasByStatus(player, "concluida");
          break;
        default:
          break;
      }
    })
    .catch(() => {
      player.sendMessage("§cNão foi possível abrir o menu do Quadro de Ideias.");
    });
}

function openNewIdeaForm(player) {
  const form = new ModalFormData()
    .title("Nova ideia")
    .textField("Nome do projeto", "Ex.: Casa na montanha")
    .textField("Objetivo", "Ex.: Construir base segura")
    .textField("Responsável", "Ex.: Pai, Filho, Filha")
    .textField("Materiais principais", "Ex.: Pedra, madeira, vidro");

  form
    .show(player)
    .then((response) => {
      if (response.canceled) {
        return;
      }

      const [titleRaw, objectiveRaw, ownerRaw, materialsRaw] = response.formValues;
      const title = `${titleRaw ?? ""}`.trim();
      const objective = `${objectiveRaw ?? ""}`.trim();

      if (!title || !objective) {
        player.sendMessage("§ePreencha pelo menos Nome do projeto e Objetivo.");
        return;
      }

      const ideas = getIdeas();
      if (ideas.length >= IDEA_LIMIT) {
        player.sendMessage(`§cLimite atingido (${IDEA_LIMIT} ideias). Conclua ou remova ideias antigas.`);
        return;
      }

      ideas.push({
        id: Date.now(),
        title,
        objective,
        owner: `${ownerRaw ?? ""}`.trim() || "Não definido",
        materials: `${materialsRaw ?? ""}`.trim() || "Não definido",
        status: "nova",
        author: player.name,
        createdAt: new Date().toISOString(),
      });

      setIdeas(ideas);
      player.sendMessage(`§aIdeia registrada: §f${title}`);
    })
    .catch(() => {
      player.sendMessage("§cNão foi possível abrir o formulário de nova ideia.");
    });
}

function openIdeasByStatus(player, status) {
  const ideas = getIdeas().filter((idea) => idea.status === status);

  if (ideas.length === 0) {
    player.sendMessage(`§eNenhuma ideia no status '${status}'.`);
    return;
  }

  const form = new ActionFormData()
    .title(getStatusLabel(status))
    .body(`Total: ${ideas.length}`);

  for (const idea of ideas) {
    form.button(`§l${idea.title}\n§r${idea.owner}`);
  }

  form
    .show(player)
    .then((response) => {
      if (response.canceled || response.selection === undefined) {
        return;
      }

      const selectedIdea = ideas[response.selection];
      if (!selectedIdea) {
        return;
      }

      openIdeaDetail(player, selectedIdea.id);
    })
    .catch(() => {
      player.sendMessage("§cNão foi possível carregar a lista de ideias.");
    });
}

function openIdeaDetail(player, ideaId) {
  const ideas = getIdeas();
  const index = ideas.findIndex((idea) => idea.id === ideaId);

  if (index < 0) {
    player.sendMessage("§cIdeia não encontrada.");
    return;
  }

  const idea = ideas[index];

  const form = new MessageFormData()
    .title(idea.title)
    .body(
      [
        `§lObjetivo:§r ${idea.objective}`,
        `§lResponsável:§r ${idea.owner}`,
        `§lMateriais:§r ${idea.materials}`,
        `§lStatus:§r ${getStatusLabel(idea.status)}`,
        `§lAutor:§r ${idea.author}`,
      ].join("\n"),
    )
    .button1("Avançar status")
    .button2("Fechar");

  form
    .show(player)
    .then((response) => {
      if (response.canceled || response.selection !== 0) {
        return;
      }

      ideas[index].status = getNextStatus(ideas[index].status);
      setIdeas(ideas);
      player.sendMessage(`§aStatus atualizado para: §f${getStatusLabel(ideas[index].status)}`);
    })
    .catch(() => {
      player.sendMessage("§cNão foi possível abrir o detalhe da ideia.");
    });
}

function getIdeas() {
  const raw = world.getDynamicProperty(IDEAS_PROPERTY_ID);

  if (!raw || typeof raw !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

function setIdeas(ideas) {
  world.setDynamicProperty(IDEAS_PROPERTY_ID, JSON.stringify(ideas));
}

function getStatusLabel(status) {
  switch (status) {
    case "andamento":
      return "Em andamento";
    case "concluida":
      return "Concluído";
    default:
      return "Nova ideia";
  }
}

function getNextStatus(status) {
  if (status === "nova") {
    return "andamento";
  }
  if (status === "andamento") {
    return "concluida";
  }
  return "concluida";
}

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (!initialSpawn || !player) {
    return;
  }

  player.sendMessage("§7Quadro de Ideias ativo: interaja com o bloco para abrir o menu.");
});
