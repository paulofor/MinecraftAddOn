# Sprint 2 - melhoria visual: cria ilha-hub didatica ao redor do jogador
# Base da ilha (camadas)
fill ~-8 ~-3 ~-8 ~8 ~-2 ~8 dirt
fill ~-6 ~-1 ~-6 ~6 ~-1 ~6 grass

# Recorte dos cantos para deixar formato de ilha
fill ~-8 ~-3 ~-8 ~-6 ~-1 ~-6 air
fill ~6 ~-3 ~-8 ~8 ~-1 ~-6 air
fill ~-8 ~-3 ~6 ~-6 ~-1 ~8 air
fill ~6 ~-3 ~6 ~8 ~-1 ~8 air

# Praca central e marco visual
fill ~-2 ~-1 ~-2 ~2 ~-1 ~2 oak_planks
setblock ~ ~0 ~ sea_lantern

# Totens simples de orientacao
fill ~-4 ~0 ~0 ~-4 ~2 ~0 oak_log
fill ~4 ~0 ~0 ~4 ~2 ~0 oak_log
setblock ~-4 ~3 ~0 lantern
setblock ~4 ~3 ~0 lantern

# Pontos de interesse didatico
setblock ~-1 ~0 ~-4 bookshelf
setblock ~1 ~0 ~-4 enchanting_table
setblock ~-1 ~0 ~4 crafting_table
setblock ~1 ~0 ~4 lectern

tellraw @s {"rawtext":[{"text":"[IlhaLogica] Hub visual criado ao seu redor. Use /function ilha_logica/hub para orientacao da trilha."}]}
