# Sprint 3 - Biblioteca Infinita e Arquivo de Conhecimento da Academia Arcana Monumental
# Execute depois de academia_arcana_monumental/detalhamento_sprint2, a partir do mesmo centro do Patio das Casas Arcanas.
# Sem PNG customizado: lore, segredos e orientacao usam blocos vanilla, lecterns, luzes e contrastes materiais.

tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Iniciando Sprint 3: Biblioteca Infinita, lore curto, salas secretas e acesso sinalizado ao Arquivo Proibido."}]}
scoreboard players set @s aam_sprint 3

# Reforco externo da Biblioteca Infinita ao oeste: fachada alta, vitrais e cupula de conhecimento.
fill ~-106 ~1 ~-34 ~-52 ~40 ~34 stone_bricks hollow
fill ~-104 ~2 ~-32 ~-54 ~38 ~32 air
fill ~-104 ~3 ~-30 ~-104 ~34 ~30 bookshelf
fill ~-52 ~3 ~-30 ~-52 ~34 ~30 bookshelf
fill ~-104 ~36 ~-34 ~-52 ~44 ~34 chiseled_stone_bricks hollow
fill ~-98 ~45 ~-26 ~-60 ~54 ~26 quartz_block hollow
fill ~-94 ~46 ~-22 ~-64 ~58 ~22 purple_stained_glass hollow
setblock ~-79 ~59 ~0 sea_lantern
setblock ~-79 ~60 ~0 amethyst_block

# Entrada monumental conectada ao patio e grande atrio interno.
fill ~-52 ~1 ~-8 ~-28 ~7 ~8 oak_planks
fill ~-52 ~2 ~-5 ~-52 ~9 ~5 air
fill ~-50 ~1 ~-6 ~-46 ~12 ~6 quartz_block hollow
fill ~-49 ~2 ~-5 ~-47 ~11 ~5 air
setblock ~-45 ~2 ~0 lectern
setblock ~-47 ~4 ~-6 sea_lantern
setblock ~-47 ~4 ~6 sea_lantern

# Piso terreo com salas de leitura e informacao curta por disciplina.
fill ~-100 ~1 ~-28 ~-58 ~1 ~28 polished_andesite
fill ~-96 ~2 ~-24 ~-62 ~2 ~24 smooth_stone
fill ~-100 ~2 ~-30 ~-96 ~7 ~-24 bookshelf
fill ~-66 ~2 ~-30 ~-58 ~7 ~-24 bookshelf
fill ~-100 ~2 ~24 ~-92 ~7 ~30 bookshelf
fill ~-66 ~2 ~24 ~-58 ~7 ~30 bookshelf
setblock ~-90 ~2 ~-20 lectern
setblock ~-68 ~2 ~-20 lectern
setblock ~-90 ~2 ~20 lectern
setblock ~-68 ~2 ~20 lectern
setblock ~-79 ~2 ~0 enchanting_table
setblock ~-79 ~3 ~0 sea_lantern

# Múltiplos andares: mezaninos, passarelas internas, varandas e escadas em degraus simples.
fill ~-100 ~12 ~-28 ~-58 ~12 ~28 oak_planks hollow
fill ~-92 ~12 ~-20 ~-66 ~12 ~20 air
fill ~-100 ~22 ~-28 ~-58 ~22 ~28 dark_oak_planks hollow
fill ~-92 ~22 ~-20 ~-66 ~22 ~20 air
fill ~-100 ~32 ~-28 ~-58 ~32 ~28 spruce_planks hollow
fill ~-92 ~32 ~-20 ~-66 ~32 ~20 air
fill ~-82 ~2 ~-26 ~-76 ~34 ~-24 scaffolding
fill ~-82 ~2 ~24 ~-76 ~34 ~26 scaffolding
fill ~-104 ~12 ~-4 ~-52 ~14 ~4 oak_planks
fill ~-104 ~22 ~-4 ~-52 ~24 ~4 dark_oak_planks
fill ~-104 ~32 ~-4 ~-52 ~34 ~4 spruce_planks
fill ~-101 ~15 ~-28 ~-57 ~15 ~-28 stone_brick_wall
fill ~-101 ~25 ~28 ~-57 ~25 ~28 stone_brick_wall
fill ~-101 ~35 ~-28 ~-57 ~35 ~-28 stone_brick_wall

# Varandas externas para reforcar escala por dentro e por fora.
fill ~-108 ~16 ~-20 ~-104 ~18 ~20 quartz_block
fill ~-108 ~19 ~-20 ~-108 ~21 ~20 stone_brick_wall
fill ~-54 ~26 ~-24 ~-50 ~28 ~24 quartz_block
fill ~-50 ~29 ~-24 ~-50 ~31 ~24 stone_brick_wall
setblock ~-108 ~22 ~0 sea_lantern
setblock ~-50 ~32 ~0 sea_lantern

# Lore curto e areas de consulta: quatro nichos, uma frase por tema em lectern futuro.
fill ~-96 ~13 ~-24 ~-88 ~18 ~-16 lapis_block hollow
fill ~-70 ~13 ~-24 ~-62 ~18 ~-16 gold_block hollow
fill ~-96 ~23 ~16 ~-88 ~28 ~24 emerald_block hollow
fill ~-70 ~23 ~16 ~-62 ~28 ~24 redstone_block hollow
setblock ~-92 ~13 ~-20 lectern
setblock ~-66 ~13 ~-20 lectern
setblock ~-92 ~23 ~20 lectern
setblock ~-66 ~23 ~20 lectern
setblock ~-92 ~19 ~-20 sea_lantern
setblock ~-66 ~19 ~-20 sea_lantern
setblock ~-92 ~29 ~20 sea_lantern
setblock ~-66 ~29 ~20 sea_lantern

# Segredo 1: sala de observacao atras de estante com pista visual por ametista.
fill ~-104 ~8 ~8 ~-96 ~15 ~18 deepslate_tiles hollow
fill ~-103 ~9 ~9 ~-97 ~14 ~17 air
setblock ~-100 ~9 ~8 bookshelf
setblock ~-100 ~10 ~8 amethyst_block
setblock ~-100 ~9 ~13 lectern
setblock ~-100 ~10 ~13 sea_lantern

# Segredo 2: sequencia ambiental de tres cores levando a uma varanda oculta.
setblock ~-72 ~12 ~-27 blue_glazed_terracotta
setblock ~-79 ~22 ~-27 green_glazed_terracotta
setblock ~-86 ~32 ~-27 purple_glazed_terracotta
fill ~-90 ~33 ~-34 ~-68 ~38 ~-30 deepslate_bricks hollow
fill ~-88 ~34 ~-33 ~-70 ~37 ~-31 air
setblock ~-79 ~34 ~-32 lectern
setblock ~-79 ~35 ~-32 sea_lantern

# Conexao para o Arquivo Proibido Subterraneo: fechada/sinalizada para Sprint 6.
fill ~-86 ~-10 ~-6 ~-72 ~1 ~6 deepslate_bricks hollow
fill ~-84 ~-9 ~-4 ~-74 ~0 ~4 air
fill ~-82 ~1 ~-3 ~-76 ~1 ~3 deepslate_tiles
fill ~-82 ~2 ~-3 ~-76 ~5 ~3 iron_bars
setblock ~-79 ~2 ~0 lectern
setblock ~-79 ~3 ~0 redstone_lamp
setblock ~-79 ~-9 ~0 amethyst_block
fill ~-81 ~-8 ~-2 ~-77 ~-8 ~2 sea_lantern

# Iluminacao e marcadores de leitura rapida para reduzir dependencia de texto longo.
setblock ~-100 ~10 ~-30 sea_lantern
setblock ~-58 ~10 ~-30 sea_lantern
setblock ~-100 ~20 ~30 sea_lantern
setblock ~-58 ~20 ~30 sea_lantern
setblock ~-100 ~30 ~-30 sea_lantern
setblock ~-58 ~30 ~30 sea_lantern
setblock ~-79 ~40 ~-30 purple_glazed_terracotta
setblock ~-79 ~40 ~30 purple_glazed_terracotta

tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Sprint 3 concluida. Valide escala interna/externa, leitura dos lecterns, passarelas, segredos opcionais e acesso fechado ao Arquivo Proibido."}]}
