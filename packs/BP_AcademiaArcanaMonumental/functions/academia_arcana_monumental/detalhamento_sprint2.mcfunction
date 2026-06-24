# Sprint 2 - Portao, muralhas, patio central e identidade visual da Academia Arcana Monumental
# Execute depois de academia_arcana_monumental/blocagem_sprint1, a partir do mesmo centro do Patio das Casas Arcanas.
# Sem PNG customizado: identidade visual feita com blocos, cores, luzes e materiais vanilla.

tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Iniciando Sprint 2: portão monumental, muralhas, pátio orientado e identidade visual das alas."}]}
scoreboard players set @s aam_sprint 2

# Caminho de chegada e ponte cerimonial ao norte.
fill ~-10 ~0 ~-122 ~10 ~0 ~-91 stone_bricks
fill ~-8 ~1 ~-121 ~8 ~1 ~-94 smooth_stone
fill ~-14 ~0 ~-122 ~-11 ~0 ~-94 water
fill ~11 ~0 ~-122 ~14 ~0 ~-94 water
fill ~-12 ~1 ~-120 ~-12 ~3 ~-96 stone_brick_wall
fill ~12 ~1 ~-120 ~12 ~3 ~-96 stone_brick_wall
setblock ~-6 ~2 ~-116 sea_lantern
setblock ~6 ~2 ~-116 sea_lantern
setblock ~0 ~1 ~-112 purple_glazed_terracotta
setblock ~0 ~2 ~-104 sea_lantern

# Portao dos Aprendizes com arco, torres, brasoes e estatuas.
fill ~-26 ~1 ~-91 ~26 ~7 ~-81 stone_bricks
fill ~-22 ~8 ~-89 ~-14 ~32 ~-83 stone_bricks hollow
fill ~14 ~8 ~-89 ~22 ~32 ~-83 stone_bricks hollow
fill ~-22 ~29 ~-89 ~22 ~36 ~-83 chiseled_stone_bricks
fill ~-9 ~1 ~-84 ~9 ~22 ~-84 air
fill ~-7 ~20 ~-84 ~7 ~24 ~-84 quartz_block
fill ~-4 ~24 ~-84 ~4 ~29 ~-84 amethyst_block
fill ~-18 ~33 ~-88 ~-18 ~38 ~-84 quartz_block
fill ~18 ~33 ~-88 ~18 ~38 ~-84 quartz_block
setblock ~-18 ~39 ~-86 sea_lantern
setblock ~18 ~39 ~-86 sea_lantern
setblock ~0 ~30 ~-84 beacon
setblock ~-10 ~13 ~-82 blue_wool
setblock ~-4 ~13 ~-82 green_wool
setblock ~4 ~13 ~-82 orange_wool
setblock ~10 ~13 ~-82 red_wool
fill ~-34 ~1 ~-92 ~-30 ~9 ~-88 stone_bricks
fill ~30 ~1 ~-92 ~34 ~9 ~-88 stone_bricks
setblock ~-32 ~10 ~-90 carved_pumpkin
setblock ~32 ~10 ~-90 carved_pumpkin
setblock ~-32 ~11 ~-90 sea_lantern
setblock ~32 ~11 ~-90 sea_lantern
setblock ~0 ~2 ~-79 lectern

# Muralhas externas com ameias e torres de canto legiveis.
fill ~-112 ~1 ~-92 ~112 ~6 ~-88 stone_bricks
fill ~-112 ~1 ~88 ~112 ~6 ~92 stone_bricks
fill ~-112 ~1 ~-92 ~-108 ~6 ~92 stone_bricks
fill ~108 ~1 ~-92 ~112 ~6 ~92 stone_bricks
fill ~-112 ~7 ~-92 ~112 ~7 ~-88 stone_brick_wall
fill ~-112 ~7 ~88 ~112 ~7 ~92 stone_brick_wall
fill ~-112 ~7 ~-92 ~-108 ~7 ~92 stone_brick_wall
fill ~108 ~7 ~-92 ~112 ~7 ~92 stone_brick_wall
fill ~-114 ~1 ~-94 ~-104 ~16 ~-84 stone_bricks hollow
fill ~104 ~1 ~-94 ~114 ~16 ~-84 stone_bricks hollow
fill ~-114 ~1 ~84 ~-104 ~16 ~94 stone_bricks hollow
fill ~104 ~1 ~84 ~114 ~16 ~94 stone_bricks hollow
setblock ~-109 ~17 ~-89 blue_glazed_terracotta
setblock ~109 ~17 ~-89 orange_glazed_terracotta
setblock ~-109 ~17 ~89 green_glazed_terracotta
setblock ~109 ~17 ~89 red_glazed_terracotta

# Patio das Casas Arcanas com fonte central ampliada e quatro pontos de interesse.
fill ~-34 ~0 ~-34 ~34 ~0 ~34 polished_andesite
fill ~-26 ~0 ~-26 ~26 ~0 ~26 smooth_stone
fill ~-11 ~1 ~-11 ~11 ~1 ~11 quartz_block hollow
fill ~-9 ~1 ~-9 ~9 ~1 ~9 water
fill ~-5 ~2 ~-5 ~5 ~2 ~5 sea_lantern hollow
setblock ~0 ~3 ~0 beacon
setblock ~0 ~4 ~0 amethyst_cluster
setblock ~0 ~1 ~-28 lectern
setblock ~28 ~1 ~0 cartography_table
setblock ~0 ~1 ~28 enchanting_table
setblock ~-28 ~1 ~0 bell
setblock ~-18 ~1 ~-18 blue_glazed_terracotta
setblock ~18 ~1 ~-18 orange_glazed_terracotta
setblock ~-18 ~1 ~18 green_glazed_terracotta
setblock ~18 ~1 ~18 red_glazed_terracotta

# Sistema visual de orientacao por cores e materiais nas quatro rotas principais.
fill ~-3 ~1 ~-86 ~3 ~1 ~-30 blue_carpet
fill ~-5 ~0 ~-86 ~5 ~0 ~-30 lapis_block
fill ~30 ~1 ~-3 ~106 ~1 ~3 orange_carpet
fill ~30 ~0 ~-5 ~106 ~0 ~5 cut_copper
fill ~-106 ~1 ~-3 ~-30 ~1 ~3 green_carpet
fill ~-106 ~0 ~-5 ~-30 ~0 ~5 emerald_block
fill ~-3 ~1 ~30 ~3 ~1 ~86 red_carpet
fill ~-5 ~0 ~30 ~5 ~0 ~86 redstone_block
setblock ~0 ~2 ~-40 blue_glazed_terracotta
setblock ~40 ~2 ~0 orange_glazed_terracotta
setblock ~-40 ~2 ~0 green_glazed_terracotta
setblock ~0 ~2 ~40 red_glazed_terracotta

# Marcos baixos exploraveis no patio para orientar sem mapa externo.
fill ~-24 ~1 ~-24 ~-20 ~5 ~-20 lapis_block hollow
setblock ~-22 ~6 ~-22 sea_lantern
fill ~20 ~1 ~-24 ~24 ~5 ~-20 gold_block hollow
setblock ~22 ~6 ~-22 sea_lantern
fill ~-24 ~1 ~20 ~-20 ~5 ~24 emerald_block hollow
setblock ~-22 ~6 ~22 sea_lantern
fill ~20 ~1 ~20 ~24 ~5 ~24 redstone_block hollow
setblock ~22 ~6 ~22 sea_lantern

# Placas/lecterns de orientacao vanilla para cada rota.
setblock ~0 ~1 ~-36 lectern
setblock ~36 ~1 ~0 lectern
setblock ~-36 ~1 ~0 lectern
setblock ~0 ~1 ~36 lectern

tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Sprint 2 concluida. Valide imponencia do portão, leitura das muralhas, pátio com 4 pontos de interesse e rotas por cor/material."}]}
