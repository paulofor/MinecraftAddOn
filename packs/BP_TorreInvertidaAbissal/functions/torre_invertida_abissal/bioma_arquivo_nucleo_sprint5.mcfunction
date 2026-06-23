# Sprint 5 - bioma abissal, arquivo e nucleo final da Torre Invertida Abissal
# Origem recomendada: mesmo centro usado nas Sprints 1-4. Execute apenas em mundo de teste/area livre.
# A funcao cria o climax visual e narrativo: jardim bioluminescente, Arquivo Abissal, Nucleo da Gravidade e elevador de retorno.

tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Iniciando Sprint 5: jardim bioluminescente, arquivo abissal, nucleo e retorno seguro."}]}

# Jardim bioluminescente amplo: caverna profunda com agua, cristais, vegetacao e iluminacao dramatica.
fill ~-72 ~-112 ~-72 ~72 ~-94 ~72 air
fill ~-74 ~-113 ~-74 ~74 ~-113 ~74 deepslate
fill ~-74 ~-94 ~-74 ~74 ~-94 ~74 blackstone
fill ~-74 ~-112 ~-74 ~-74 ~-94 ~74 deepslate_tiles
fill ~74 ~-112 ~-74 ~74 ~-94 ~74 deepslate_tiles
fill ~-74 ~-112 ~-74 ~74 ~-94 ~-74 deepslate_tiles
fill ~-74 ~-112 ~74 ~74 ~-94 ~74 deepslate_tiles
fill ~-58 ~-112 ~-58 ~58 ~-112 ~58 moss_block
fill ~-48 ~-111 ~-48 ~48 ~-111 ~48 water
fill ~-24 ~-110 ~-24 ~24 ~-108 ~24 air
fill ~-10 ~-111 ~-10 ~10 ~-111 ~10 sea_lantern
fill ~-9 ~-110 ~-9 ~9 ~-108 ~9 blue_stained_glass
setblock ~0 ~-107 ~0 conduit
setblock ~-36 ~-110 ~-36 amethyst_block
setblock ~36 ~-110 ~-36 amethyst_block
setblock ~-36 ~-110 ~36 amethyst_block
setblock ~36 ~-110 ~36 amethyst_block
setblock ~-36 ~-109 ~-36 sea_lantern
setblock ~36 ~-109 ~-36 sea_lantern
setblock ~-36 ~-109 ~36 sea_lantern
setblock ~36 ~-109 ~36 sea_lantern
fill ~-62 ~-111 ~-6 ~-44 ~-111 ~6 warped_nylium
fill ~44 ~-111 ~-6 ~62 ~-111 ~6 warped_nylium
fill ~-6 ~-111 ~44 ~6 ~-111 ~62 warped_nylium
fill ~-6 ~-111 ~-62 ~6 ~-111 ~-44 warped_nylium
setblock ~-54 ~-110 ~0 warped_fungus
setblock ~54 ~-110 ~0 warped_fungus
setblock ~0 ~-110 ~54 warped_fungus
setblock ~0 ~-110 ~-54 warped_fungus
setblock ~-50 ~-110 ~4 warped_roots
setblock ~50 ~-110 ~-4 warped_roots
setblock ~4 ~-110 ~50 warped_roots
setblock ~-4 ~-110 ~-50 warped_roots
fill ~-2 ~-94 ~-2 ~2 ~-82 ~2 water
fill ~-6 ~-94 ~-6 ~6 ~-94 ~6 sea_lantern hollow
setblock ~0 ~-93 ~-16 lectern
setblock ~0 ~-93 ~16 standing_sign

# Trilhas de exploracao do jardim ate os polos narrativos.
fill ~-4 ~-110 ~-72 ~4 ~-110 ~-24 deepslate_bricks
fill ~-4 ~-110 ~24 ~4 ~-110 ~72 deepslate_bricks
fill ~-72 ~-110 ~-4 ~-24 ~-110 ~4 deepslate_bricks
fill ~24 ~-110 ~-4 ~72 ~-110 ~4 deepslate_bricks
fill ~-4 ~-109 ~-68 ~4 ~-109 ~-68 soul_lantern
fill ~-4 ~-109 ~68 ~4 ~-109 ~68 soul_lantern
fill ~-68 ~-109 ~-4 ~-68 ~-109 ~4 soul_lantern
fill ~68 ~-109 ~-4 ~68 ~-109 ~4 soul_lantern

# Arquivo Abissal: salas de lore, mapas simbolicos e pistas da origem da torre.
fill ~-94 ~-108 ~-34 ~-66 ~-99 ~34 deepslate_bricks hollow
fill ~-90 ~-107 ~-30 ~-70 ~-100 ~30 air
fill ~-66 ~-106 ~-5 ~-54 ~-100 ~5 air
fill ~-90 ~-99 ~-30 ~-70 ~-99 ~30 polished_deepslate
fill ~-88 ~-98 ~-28 ~-72 ~-98 ~-24 bookshelves
fill ~-88 ~-98 ~24 ~-72 ~-98 ~28 bookshelves
fill ~-90 ~-98 ~-20 ~-90 ~-98 ~20 bookshelves
fill ~-70 ~-98 ~-20 ~-70 ~-98 ~20 bookshelves
setblock ~-80 ~-98 ~0 lectern
setblock ~-80 ~-97 ~-8 sea_lantern
setblock ~-80 ~-97 ~8 sea_lantern
setblock ~-86 ~-98 ~0 cartography_table
setblock ~-74 ~-98 ~0 cartography_table
setblock ~-84 ~-98 ~-14 yellow_glazed_terracotta
setblock ~-76 ~-98 ~-14 yellow_glazed_terracotta
setblock ~-84 ~-98 ~14 yellow_glazed_terracotta
setblock ~-76 ~-98 ~14 yellow_glazed_terracotta
fill ~-88 ~-98 ~-4 ~-84 ~-98 ~4 blue_wool
fill ~-76 ~-98 ~-4 ~-72 ~-98 ~4 purple_wool
setblock ~-80 ~-98 ~-26 standing_sign
setblock ~-80 ~-98 ~26 standing_sign
setblock ~-88 ~-97 ~0 soul_lantern
setblock ~-72 ~-97 ~0 soul_lantern
setblock ~-80 ~-97 ~-24 soul_lantern
setblock ~-80 ~-97 ~24 soul_lantern

# Galeria de pistas: tres observacoes curtas antes do desafio final.
fill ~-90 ~-106 ~38 ~-70 ~-100 ~58 deepslate_tiles hollow
fill ~-86 ~-105 ~42 ~-74 ~-100 ~54 air
fill ~-80 ~-99 ~34 ~-80 ~-99 ~42 deepslate_bricks
setblock ~-84 ~-99 ~46 lectern
setblock ~-80 ~-99 ~50 lectern
setblock ~-76 ~-99 ~46 lectern
setblock ~-84 ~-98 ~50 sea_lantern
setblock ~-76 ~-98 ~50 sea_lantern
setblock ~-80 ~-98 ~54 amethyst_block

# Nucleo da Gravidade: artefato central, desafio final de ativacao e leitura clara de conclusao.
fill ~-42 ~-124 ~-42 ~42 ~-114 ~42 blackstone hollow
fill ~-34 ~-123 ~-34 ~34 ~-115 ~34 air
fill ~-42 ~-114 ~-42 ~42 ~-114 ~42 polished_blackstone_bricks
fill ~-30 ~-113 ~-30 ~30 ~-113 ~30 deepslate_tiles
fill ~-14 ~-112 ~-14 ~14 ~-112 ~14 obsidian
fill ~-9 ~-111 ~-9 ~9 ~-109 ~9 crying_obsidian
fill ~-5 ~-108 ~-5 ~5 ~-104 ~5 amethyst_block hollow
fill ~-3 ~-107 ~-3 ~3 ~-105 ~3 sea_lantern
setblock ~0 ~-104 ~0 beacon
setblock ~0 ~-103 ~0 end_rod
setblock ~0 ~-102 ~0 end_rod
fill ~-2 ~-101 ~-2 ~2 ~-101 ~2 purple_stained_glass
setblock ~0 ~-100 ~0 lodestone
setblock ~0 ~-112 ~-22 lectern
setblock ~0 ~-112 ~22 standing_sign

# Desafio final: ativar quatro ecos em ordem por observacao das pistas do Arquivo Abissal.
setblock ~0 ~-111 ~-30 blue_concrete
setblock ~30 ~-111 ~0 purple_concrete
setblock ~0 ~-111 ~30 cyan_concrete
setblock ~-30 ~-111 ~0 lime_concrete
setblock ~0 ~-110 ~-30 sea_lantern
setblock ~30 ~-110 ~0 redstone_lamp
setblock ~0 ~-110 ~30 redstone_lamp
setblock ~-30 ~-110 ~0 sea_lantern
fill ~-3 ~-111 ~-28 ~3 ~-111 ~-24 blue_stained_glass
fill ~24 ~-111 ~-3 ~28 ~-111 ~3 purple_stained_glass
fill ~-3 ~-111 ~24 ~3 ~-111 ~28 light_blue_stained_glass
fill ~-28 ~-111 ~-3 ~-24 ~-111 ~3 lime_stained_glass
setblock ~0 ~-110 ~-34 standing_sign
setblock ~34 ~-110 ~0 standing_sign
setblock ~0 ~-110 ~34 standing_sign
setblock ~-34 ~-110 ~0 standing_sign
fill ~-8 ~-111 ~36 ~8 ~-111 ~40 emerald_block
setblock ~0 ~-110 ~38 chest
setblock ~0 ~-109 ~38 sea_lantern

# Conexao Jardim -> Nucleo e retorno seguro para a superficie.
fill ~-6 ~-112 ~-24 ~6 ~-112 ~-42 deepslate_bricks
fill ~-4 ~-111 ~-42 ~4 ~-111 ~-72 deepslate_bricks
fill ~-4 ~-110 ~-72 ~4 ~-110 ~-72 sea_lantern
fill ~18 ~-123 ~18 ~24 ~1 ~24 air
fill ~18 ~-123 ~18 ~18 ~1 ~24 deepslate_tiles
fill ~24 ~-123 ~18 ~24 ~1 ~24 deepslate_tiles
fill ~18 ~-123 ~18 ~24 ~1 ~18 deepslate_tiles
fill ~18 ~-123 ~24 ~24 ~1 ~24 deepslate_tiles
fill ~20 ~-122 ~20 ~22 ~0 ~22 water
fill ~19 ~-121 ~19 ~23 ~-121 ~23 sea_lantern hollow
fill ~19 ~-60 ~19 ~23 ~-60 ~23 sea_lantern hollow
fill ~19 ~0 ~19 ~23 ~0 ~23 sea_lantern hollow
fill ~16 ~1 ~16 ~26 ~3 ~26 polished_andesite
setblock ~21 ~2 ~21 standing_sign
setblock ~21 ~4 ~21 beacon

# Marcadores de conclusao e orientacao para playtest.
title @s title §5Nucleo da Gravidade
title @s subtitle §fO arquivo revelou a origem. Use o elevador de agua para retornar.
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Sprint 5 concluida. Valide contraste visual, conclusao narrativa, desafio final e elevador de retorno a superficie."}]}
