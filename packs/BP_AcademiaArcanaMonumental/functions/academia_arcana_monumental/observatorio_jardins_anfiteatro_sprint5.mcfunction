# Sprint 5 - Observatorio, jardins e anfiteatro de eventos da Academia Arcana Monumental
# Execute depois de academia_arcana_monumental/torres_educativas_sprint4, a partir do mesmo centro do Patio das Casas Arcanas.
# Sem PNG customizado: mapas estelares, runas, trilhas e arquibancadas usam blocos vanilla.

tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Iniciando Sprint 5: Observatorio Celeste, Jardins de Runas, Anfiteatro e rotas panoramicas."}]}
scoreboard players set @s aam_sprint 5

# Observatorio Celeste - sudeste/roxo: recompensa visual no topo, telescopios, vitrais e alinhamento.
fill ~72 ~1 ~48 ~100 ~74 ~76 purple_concrete hollow
fill ~76 ~2 ~52 ~96 ~72 ~72 air
fill ~72 ~12 ~48 ~100 ~12 ~76 smooth_stone
fill ~72 ~28 ~48 ~100 ~28 ~76 quartz_block
fill ~72 ~44 ~48 ~100 ~44 ~76 smooth_stone
fill ~76 ~74 ~52 ~96 ~78 ~72 glass
fill ~80 ~79 ~56 ~92 ~81 ~68 amethyst_block
fill ~84 ~82 ~60 ~88 ~84 ~64 sea_lantern
fill ~74 ~1 ~78 ~98 ~5 ~84 purple_wool
fill ~81 ~2 ~78 ~91 ~5 ~78 air
setblock ~86 ~5 ~78 sea_lantern
setblock ~86 ~2 ~81 lectern
fill ~78 ~2 ~54 ~94 ~2 ~70 black_concrete
setblock ~80 ~3 ~56 sea_lantern
setblock ~84 ~3 ~60 sea_lantern
setblock ~88 ~3 ~64 sea_lantern
setblock ~92 ~3 ~68 sea_lantern
setblock ~86 ~3 ~62 lectern
fill ~80 ~13 ~56 ~92 ~13 ~68 black_wool
setblock ~80 ~14 ~56 white_concrete
setblock ~84 ~14 ~60 white_concrete
setblock ~88 ~14 ~64 yellow_concrete
setblock ~92 ~14 ~68 white_concrete
setblock ~86 ~14 ~62 lectern
fill ~80 ~29 ~56 ~92 ~29 ~68 dark_prismarine
setblock ~82 ~30 ~58 lightning_rod
setblock ~86 ~30 ~62 lightning_rod
setblock ~90 ~30 ~66 lightning_rod
setblock ~86 ~30 ~58 lectern
fill ~78 ~45 ~54 ~94 ~45 ~70 quartz_block
setblock ~80 ~46 ~56 lapis_block
setblock ~84 ~46 ~60 amethyst_block
setblock ~88 ~46 ~64 diamond_block
setblock ~92 ~46 ~68 emerald_block
setblock ~86 ~46 ~62 beacon
setblock ~86 ~46 ~58 lectern
fill ~98 ~1 ~73 ~98 ~50 ~75 ladder

# Jardins de Runas - trilhas, fontes, bancos, labirinto leve e puzzles ambientais.
fill ~-110 ~0 ~86 ~110 ~0 ~118 grass
fill ~-106 ~1 ~98 ~106 ~1 ~102 gravel
fill ~-4 ~1 ~86 ~4 ~1 ~118 gravel
fill ~-64 ~1 ~90 ~-52 ~1 ~114 moss_block
fill ~52 ~1 ~90 ~64 ~1 ~114 moss_block
fill ~-96 ~1 ~92 ~-72 ~1 ~116 green_wool
fill ~72 ~1 ~92 ~96 ~1 ~116 green_wool
fill ~-92 ~2 ~96 ~-76 ~3 ~112 leaves
fill ~-88 ~2 ~100 ~-80 ~3 ~108 air
setblock ~-84 ~2 ~104 lectern
setblock ~-92 ~2 ~96 sea_lantern
setblock ~-76 ~2 ~112 sea_lantern
fill ~76 ~2 ~96 ~92 ~3 ~112 leaves
fill ~80 ~2 ~100 ~88 ~3 ~108 air
setblock ~84 ~2 ~104 lectern
setblock ~76 ~2 ~112 sea_lantern
setblock ~92 ~2 ~96 sea_lantern
fill ~-10 ~1 ~96 ~10 ~1 ~116 stone_bricks
fill ~-6 ~2 ~100 ~6 ~2 ~112 water
setblock ~0 ~3 ~106 sea_lantern
setblock ~0 ~4 ~106 bell
setblock ~-14 ~1 ~94 lectern
setblock ~14 ~1 ~94 lectern
setblock ~-44 ~1 ~104 blue_concrete
setblock ~-36 ~1 ~104 green_concrete
setblock ~-28 ~1 ~104 orange_concrete
setblock ~-20 ~1 ~104 purple_concrete
setblock ~20 ~1 ~104 purple_concrete
setblock ~28 ~1 ~104 orange_concrete
setblock ~36 ~1 ~104 green_concrete
setblock ~44 ~1 ~104 blue_concrete
fill ~-62 ~2 ~92 ~-54 ~2 ~92 wooden_slab
fill ~54 ~2 ~92 ~62 ~2 ~92 wooden_slab
fill ~-62 ~2 ~114 ~-54 ~2 ~114 wooden_slab
fill ~54 ~2 ~114 ~62 ~2 ~114 wooden_slab

# Anfiteatro dos Duelos Didaticos - arena segura e preparada para eventos futuros.
fill ~-44 ~1 ~126 ~44 ~1 ~176 polished_andesite
fill ~-28 ~2 ~140 ~28 ~2 ~164 sandstone
fill ~-18 ~3 ~146 ~18 ~3 ~158 smooth_stone
fill ~-40 ~2 ~130 ~40 ~2 ~134 stone_bricks
fill ~-40 ~3 ~134 ~40 ~3 ~138 stone_bricks
fill ~-40 ~4 ~138 ~40 ~4 ~142 stone_bricks
fill ~-40 ~2 ~166 ~40 ~2 ~170 stone_bricks
fill ~-40 ~3 ~162 ~40 ~3 ~166 stone_bricks
fill ~-40 ~4 ~158 ~40 ~4 ~162 stone_bricks
fill ~-48 ~2 ~140 ~-44 ~5 ~164 stone_bricks
fill ~44 ~2 ~140 ~48 ~5 ~164 stone_bricks
setblock ~0 ~4 ~152 sea_lantern
setblock ~-12 ~4 ~152 gold_block
setblock ~12 ~4 ~152 lapis_block
setblock ~0 ~4 ~146 lectern
setblock ~0 ~4 ~158 bell
setblock ~-36 ~5 ~136 lectern
setblock ~36 ~5 ~136 lectern
setblock ~-36 ~5 ~168 lectern
setblock ~36 ~5 ~168 lectern

# Rotas panoramicas - pontes suspensas e varandas ligando torres e areas externas.
fill ~-72 ~42 ~-64 ~72 ~42 ~-60 smooth_stone
fill ~-72 ~43 ~-65 ~72 ~43 ~-65 iron_bars
fill ~-72 ~43 ~-59 ~72 ~43 ~-59 iron_bars
fill ~-86 ~42 ~-48 ~-82 ~42 ~48 smooth_stone
fill ~-87 ~43 ~-48 ~-87 ~43 ~48 iron_bars
fill ~-81 ~43 ~-48 ~-81 ~43 ~48 iron_bars
fill ~82 ~42 ~-48 ~86 ~42 ~48 smooth_stone
fill ~81 ~43 ~-48 ~81 ~43 ~48 iron_bars
fill ~87 ~43 ~-48 ~87 ~43 ~48 iron_bars
fill ~-72 ~42 ~60 ~72 ~42 ~64 smooth_stone
fill ~-72 ~43 ~59 ~72 ~43 ~59 iron_bars
fill ~-72 ~43 ~65 ~72 ~43 ~65 iron_bars
fill ~-12 ~32 ~54 ~12 ~32 ~92 quartz_block
fill ~-12 ~33 ~53 ~12 ~33 ~53 iron_bars
fill ~-12 ~33 ~93 ~12 ~33 ~93 iron_bars
setblock ~0 ~33 ~74 sea_lantern
setblock ~0 ~33 ~88 lectern

playsound random.levelup @s ~ ~ ~ 1 1
tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Sprint 5 concluida. Valide escala externa, recompensa visual do Observatorio, legibilidade dos Jardins e capacidade do Anfiteatro para eventos futuros."}]}
