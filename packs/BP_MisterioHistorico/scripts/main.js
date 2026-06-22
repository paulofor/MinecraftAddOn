import { system, world } from "@minecraft/server";

const COOLDOWN_TICKS = 30;
const playerCooldowns = new Map();

const INTERACTIONS = new Map([
  ["minecraft:lectern", {
    functionName: "misterio_historico/nova_sessao",
    message: "§6[Mistério Histórico] Diário de campo aberto. Uma nova investigação começou para você.",
  }],
  ["minecraft:barrel", {
    functionName: "misterio_historico/pistas/p1_diario_moradora",
    message: "§e[Pista] Você examinou o diário guardado no barril.",
  }],
  ["minecraft:cauldron", {
    functionName: "misterio_historico/pistas/p2_cisternas_secas",
    message: "§e[Pista] Você inspecionou a cisterna seca.",
  }],
  ["minecraft:bell", {
    functionName: "misterio_historico/pistas/p3_assembleia",
    message: "§e[Pista] O sino marca o antigo ponto de assembleia.",
  }],
  ["minecraft:chiseled_bookshelf", {
    functionName: "misterio_historico/pistas/p4_ata_conselho",
    message: "§e[Pista] Você consultou a ata incompleta do conselho.",
  }],
  ["minecraft:lever", {
    functionName: "misterio_historico/pistas/p5_chave_comporta",
    message: "§e[Pista] A chave de comporta parece quebrada ou adulterada.",
  }],
  ["minecraft:stonecutter", {
    functionName: "misterio_historico/pistas/p6_canal_bloqueado",
    message: "§e[Pista] O mecanismo revela um canal interrompido.",
  }],
  ["minecraft:composter", {
    functionName: "misterio_historico/pistas/p7_registro_chuva",
    message: "§e[Pista] Você encontrou marcas de chuva e cultivo.",
  }],
  ["minecraft:chest", {
    functionName: "misterio_historico/pistas/p8_rotas_migracao",
    message: "§e[Pista] O baú contém mapas de rotas de migração.",
  }],
  ["minecraft:bookshelf", {
    functionName: "misterio_historico/pistas/p9_mural_sintese",
    message: "§e[Pista] O mural pede comparação entre as evidências.",
  }],
  ["minecraft:emerald_block", {
    functionName: "misterio_historico/conclusoes/hipotese_a",
    message: "§a[Conclusão] Você escolheu a versão A: escassez de água.",
  }],
  ["minecraft:lapis_block", {
    functionName: "misterio_historico/conclusoes/hipotese_b",
    message: "§9[Conclusão] Você escolheu a versão B: conflito político.",
  }],
  ["minecraft:redstone_block", {
    functionName: "misterio_historico/conclusoes/hipotese_c",
    message: "§c[Conclusão] Você escolheu a versão C: falha técnica nos canais.",
  }],
  ["minecraft:diamond_block", {
    functionName: "misterio_historico/finalizar",
    message: "§b[Mistério Histórico] Validando conclusão final.",
  }],
  ["minecraft:lodestone", {
    functionName: "misterio_historico/diagnostico",
    message: "§b[Mistério Histórico] Consultando seu caderno de investigação.",
  }],
  ["minecraft:grindstone", {
    functionName: "misterio_historico/reset",
    message: "§d[Mistério Histórico] Reiniciando investigação deste jogador.",
  }],
]);

function cooldownKey(player, blockTypeId) {
  return `${player.id}:${blockTypeId}`;
}

function isCoolingDown(player, blockTypeId) {
  const key = cooldownKey(player, blockTypeId);
  const availableAt = playerCooldowns.get(key) ?? 0;
  return system.currentTick < availableAt;
}

function startCooldown(player, blockTypeId) {
  playerCooldowns.set(cooldownKey(player, blockTypeId), system.currentTick + COOLDOWN_TICKS);
}

async function runFunctionAsPlayer(player, functionName) {
  const escapedName = String(player.name).replace(/"/g, "\\\"");
  const command = `execute as "${escapedName}" run function ${functionName}`;

  if (typeof player.dimension.runCommandAsync === "function") {
    await player.dimension.runCommandAsync(command);
    return;
  }

  player.dimension.runCommand(command);
}

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
  const player = event.player;
  const block = event.block;
  const interaction = INTERACTIONS.get(block?.typeId);

  if (!player || !block || !interaction || isCoolingDown(player, block.typeId)) {
    return;
  }

  startCooldown(player, block.typeId);
  player.sendMessage(interaction.message);

  system.run(() => {
    runFunctionAsPlayer(player, interaction.functionName).catch((error) => {
      console.warn(`[MisterioHistorico] Falha ao executar ${interaction.functionName} para ${player.name}: ${error}`);
      player.sendMessage("§c[Mistério Histórico] Não foi possível registrar esta interação. Avise o professor/facilitador.");
    });
  });
});

console.warn("[MisterioHistorico] Interações de mundo carregadas: pistas, diagnóstico, reset e conclusão por blocos vanilla.");
