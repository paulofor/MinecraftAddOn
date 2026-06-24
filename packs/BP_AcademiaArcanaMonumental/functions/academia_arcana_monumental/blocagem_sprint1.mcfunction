# Sprint 1 - blocagem do campus da Academia Arcana Monumental
# Origem recomendada: centro do Patio das Casas Arcanas. Area aproximada: 220 x 180; altura: +96; profundidade: -48.
# Sem PNG customizado: todos os marcadores usam blocos vanilla para validar escala, silhueta e navegacao.

tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Iniciando Sprint 1: planta mestre, pátio hub, torres, biblioteca, jardins, anfiteatro e subsolo."}]}

# Limpeza da maquete e base geral.
fill ~-112 ~1 ~-92 ~112 ~96 ~92 air
fill ~-72 ~-48 ~-52 ~72 ~0 ~52 air
fill ~-112 ~-1 ~-92 ~112 ~-1 ~92 stone
fill ~-110 ~0 ~-90 ~110 ~0 ~90 grass_block
fill ~-110 ~0 ~-90 ~110 ~0 ~-90 stone_bricks
fill ~-110 ~0 ~90 ~110 ~0 ~90 stone_bricks
fill ~-110 ~0 ~-90 ~-110 ~0 ~90 stone_bricks
fill ~110 ~0 ~-90 ~110 ~0 ~90 stone_bricks

# Patio central como hub claro.
fill ~-28 ~0 ~-28 ~28 ~0 ~28 polished_andesite
fill ~-20 ~0 ~-20 ~20 ~0 ~20 smooth_stone
fill ~-7 ~1 ~-7 ~7 ~1 ~7 water
fill ~-5 ~1 ~-5 ~5 ~1 ~5 sea_lantern hollow
setblock ~0 ~2 ~0 beacon
setblock ~0 ~1 ~-24 lectern
setblock ~0 ~1 ~24 cartography_table
setblock ~-24 ~1 ~0 stonecutter_block
setblock ~24 ~1 ~0 smithing_table

# Quatro rotas cardeais largas para leitura de navegacao.
fill ~-5 ~0 ~-88 ~5 ~0 ~-28 quartz_block
fill ~-5 ~0 ~28 ~5 ~0 ~88 quartz_block
fill ~-108 ~0 ~-5 ~-28 ~0 ~5 quartz_block
fill ~28 ~0 ~-5 ~108 ~0 ~5 quartz_block
fill ~-3 ~1 ~-86 ~3 ~1 ~-30 purple_carpet
fill ~-3 ~1 ~30 ~3 ~1 ~86 blue_carpet
fill ~-106 ~1 ~-3 ~-30 ~1 ~3 green_carpet
fill ~30 ~1 ~-3 ~106 ~1 ~3 orange_carpet

# Portao dos Aprendizes ao norte: volume simples para aproximacao monumental.
fill ~-22 ~1 ~-88 ~22 ~5 ~-82 stone_bricks
fill ~-18 ~6 ~-86 ~-12 ~26 ~-82 stone_bricks
fill ~12 ~6 ~-86 ~18 ~26 ~-82 stone_bricks
fill ~-18 ~24 ~-86 ~18 ~30 ~-82 chiseled_stone_bricks
fill ~-8 ~1 ~-84 ~8 ~18 ~-84 air
fill ~-30 ~1 ~-90 ~-24 ~18 ~-84 stone_bricks hollow
fill ~24 ~1 ~-90 ~30 ~18 ~-84 stone_bricks hollow
setblock ~0 ~19 ~-84 sea_lantern
setblock ~0 ~1 ~-80 standing_sign

# Torre central e corte vertical da silhueta principal.
fill ~-12 ~1 ~-12 ~12 ~78 ~12 stone_bricks hollow
fill ~-8 ~2 ~-8 ~8 ~76 ~8 air
fill ~-4 ~2 ~-4 ~4 ~92 ~4 amethyst_block hollow
fill ~-2 ~3 ~-2 ~2 ~91 ~2 air
fill ~-18 ~78 ~-18 ~18 ~86 ~18 quartz_block hollow
fill ~-12 ~86 ~-12 ~12 ~96 ~12 purple_stained_glass hollow
setblock ~0 ~96 ~0 sea_lantern

# Biblioteca Infinita ao oeste: massa vertical com passarelas futuras.
fill ~-104 ~1 ~-32 ~-54 ~32 ~32 bookshelf hollow
fill ~-98 ~2 ~-26 ~-60 ~30 ~26 air
fill ~-104 ~33 ~-32 ~-54 ~46 ~32 oak_planks hollow
fill ~-80 ~47 ~-20 ~-64 ~62 ~20 glass hollow
fill ~-54 ~1 ~-5 ~-28 ~5 ~5 oak_planks
setblock ~-78 ~2 ~0 lectern
setblock ~-92 ~2 ~0 cartography_table
setblock ~-64 ~2 ~0 sea_lantern

# Anfiteatro ao sul: volume em degraus e arena central.
fill ~-42 ~0 ~58 ~42 ~0 ~88 sandstone
fill ~-34 ~1 ~62 ~34 ~1 ~84 smooth_sandstone hollow
fill ~-26 ~2 ~66 ~26 ~2 ~80 cut_sandstone hollow
fill ~-18 ~3 ~70 ~18 ~3 ~76 sandstone_stairs
fill ~-12 ~1 ~64 ~12 ~1 ~72 orange_concrete
setblock ~0 ~2 ~68 lectern
setblock ~0 ~2 ~76 sea_lantern

# Jardins de Runas ao leste: labirintos leves e fontes de orientacao.
fill ~54 ~0 ~-36 ~104 ~0 ~36 moss_block
fill ~60 ~1 ~-30 ~98 ~1 ~-26 oak_leaves
fill ~60 ~1 ~26 ~98 ~1 ~30 oak_leaves
fill ~60 ~1 ~-30 ~64 ~1 ~30 oak_leaves
fill ~94 ~1 ~-30 ~98 ~1 ~30 oak_leaves
fill ~76 ~1 ~-12 ~82 ~1 ~12 water
fill ~75 ~1 ~-13 ~83 ~1 ~13 sea_lantern hollow
setblock ~58 ~1 ~0 lectern
setblock ~102 ~1 ~0 emerald_block

# Torres disciplinares em cores para expansao futura.
fill ~-98 ~1 ~-74 ~-74 ~52 ~-50 blue_concrete hollow
fill ~-92 ~2 ~-68 ~-80 ~50 ~-56 air
setblock ~-86 ~53 ~-62 lapis_block
setblock ~-86 ~1 ~-48 standing_sign
fill ~74 ~1 ~-74 ~98 ~52 ~-50 orange_concrete hollow
fill ~80 ~2 ~-68 ~92 ~50 ~-56 air
setblock ~86 ~53 ~-62 gold_block
setblock ~86 ~1 ~-48 standing_sign
fill ~-98 ~1 ~50 ~-74 ~52 ~74 green_concrete hollow
fill ~-92 ~2 ~56 ~-80 ~50 ~68 air
setblock ~-86 ~53 ~62 emerald_block
setblock ~-86 ~1 ~48 standing_sign
fill ~74 ~1 ~50 ~98 ~52 ~74 red_concrete hollow
fill ~80 ~2 ~56 ~92 ~50 ~68 air
setblock ~86 ~53 ~62 redstone_block
setblock ~86 ~1 ~48 standing_sign

# Pontes e alas intermediarias conectando hub, torres e volumes principais.
fill ~-74 ~12 ~-62 ~-12 ~14 ~-58 stone_bricks
fill ~12 ~12 ~-62 ~74 ~14 ~-58 stone_bricks
fill ~-74 ~12 ~58 ~-12 ~14 ~62 stone_bricks
fill ~12 ~12 ~58 ~74 ~14 ~62 stone_bricks
fill ~-62 ~8 ~-50 ~-58 ~10 ~50 stone_bricks
fill ~58 ~8 ~-50 ~62 ~10 ~50 stone_bricks

# Arquivo Proibido Subterraneo: corte vertical e volume de profundidade futura.
fill ~-44 ~-36 ~-34 ~44 ~-28 ~34 deepslate_bricks hollow
fill ~-38 ~-35 ~-28 ~38 ~-29 ~28 air
fill ~-4 ~-28 ~-4 ~4 ~0 ~4 scaffolding
fill ~-8 ~-37 ~-8 ~8 ~-37 ~8 sea_lantern hollow
setblock ~0 ~-27 ~0 lectern
setblock ~0 ~-27 ~28 amethyst_block
setblock ~0 ~1 ~32 deepslate_tiles

# Marcadores de expansao e seguranca visual nas extremidades do campus.
setblock ~-108 ~1 ~-88 blue_glazed_terracotta
setblock ~108 ~1 ~-88 orange_glazed_terracotta
setblock ~-108 ~1 ~88 green_glazed_terracotta
setblock ~108 ~1 ~88 red_glazed_terracotta
setblock ~0 ~1 ~-88 sea_lantern
setblock ~0 ~1 ~88 sea_lantern
setblock ~-108 ~1 ~0 sea_lantern
setblock ~108 ~1 ~0 sea_lantern

tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Blocagem Sprint 1 concluida. Valide megasilhueta, pátio hub, quatro rotas, biblioteca, anfiteatro, jardins, torres e leitura do subsolo."}]}
