# Sprint 6 - Arquivo Proibido Subterraneo e desafio final da Academia Arcana Monumental
# Execute depois de academia_arcana_monumental/observatorio_jardins_anfiteatro_sprint5, a partir do mesmo centro do Patio das Casas Arcanas.
# Sem PNG customizado: atmosfera, simbolos, arquivos e recompensa usam blocos vanilla.

tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Iniciando Sprint 6: Arquivo Proibido Subterraneo, desafio final e retorno seguro."}]}
scoreboard players set @s aam_sprint 6

# Entrada subterranea conectada a Biblioteca Infinita e ao Patio das Casas Arcanas.
fill ~-10 ~1 ~52 ~10 ~1 ~58 deepslate_bricks
fill ~-8 ~2 ~54 ~8 ~5 ~56 air
fill ~-10 ~2 ~52 ~10 ~6 ~52 cracked_deepslate_bricks
fill ~-10 ~2 ~58 ~10 ~6 ~58 cracked_deepslate_bricks
fill ~-10 ~6 ~52 ~10 ~6 ~58 deepslate_tiles
setblock ~0 ~2 ~52 lectern
setblock ~-7 ~2 ~55 sea_lantern
setblock ~7 ~2 ~55 sea_lantern
fill ~-3 ~1 ~57 ~3 ~-18 ~57 ladder
fill ~-5 ~-18 ~53 ~5 ~-18 ~61 deepslate_tiles
setblock ~0 ~-17 ~56 sea_lantern

# Galeria de descida: transicao visual da academia iluminada para o clima antigo do subsolo.
fill ~-14 ~-20 ~50 ~14 ~-10 ~90 tuff hollow
fill ~-11 ~-19 ~53 ~11 ~-11 ~87 air
fill ~-12 ~-20 ~50 ~12 ~-20 ~90 polished_deepslate
fill ~-10 ~-19 ~60 ~10 ~-19 ~60 soul_lantern
fill ~-10 ~-19 ~72 ~10 ~-19 ~72 soul_lantern
fill ~-10 ~-19 ~84 ~10 ~-19 ~84 soul_lantern
setblock ~0 ~-19 ~62 lectern
setblock ~-6 ~-19 ~68 chiseled_deepslate
setblock ~0 ~-19 ~72 chiseled_deepslate
setblock ~6 ~-19 ~76 chiseled_deepslate

# Sala dos Arquivos Perdidos: memoria ambiental, prateleiras, simbolos e pistas dos conceitos aprendidos.
fill ~-32 ~-24 ~92 ~32 ~-8 ~132 deepslate_bricks hollow
fill ~-29 ~-23 ~95 ~29 ~-9 ~129 air
fill ~-28 ~-23 ~98 ~-18 ~-15 ~128 bookshelf
fill ~18 ~-23 ~98 ~28 ~-15 ~128 bookshelf
fill ~-14 ~-23 ~98 ~14 ~-23 ~128 dark_oak_planks
fill ~-12 ~-22 ~100 ~12 ~-22 ~126 candle
setblock ~0 ~-22 ~96 lectern
setblock ~-22 ~-22 ~114 lectern
setblock ~22 ~-22 ~114 lectern
setblock ~-10 ~-22 ~110 blue_concrete
setblock ~-4 ~-22 ~110 green_concrete
setblock ~2 ~-22 ~110 orange_concrete
setblock ~8 ~-22 ~110 purple_concrete
setblock ~-10 ~-22 ~118 redstone_lamp
setblock ~-4 ~-22 ~118 redstone_lamp
setblock ~2 ~-22 ~118 redstone_lamp
setblock ~8 ~-22 ~118 redstone_lamp
setblock ~0 ~-21 ~122 bell

# Corredor dos Mecanismos Antigos: causa/consequencia visual com energia, agua e portas simbolicas.
fill ~-12 ~-24 ~134 ~12 ~-12 ~176 blackstone hollow
fill ~-9 ~-23 ~137 ~9 ~-13 ~173 air
fill ~-8 ~-23 ~142 ~8 ~-23 ~142 redstone_block
fill ~-8 ~-23 ~150 ~8 ~-23 ~150 copper_block
fill ~-8 ~-23 ~158 ~8 ~-23 ~158 lapis_block
fill ~-8 ~-23 ~166 ~8 ~-23 ~166 emerald_block
setblock ~0 ~-22 ~140 lectern
setblock ~-6 ~-22 ~146 target
setblock ~0 ~-22 ~154 lightning_rod
setblock ~6 ~-22 ~162 cauldron
setblock ~0 ~-22 ~170 iron_door
setblock ~0 ~-21 ~170 iron_door
setblock ~2 ~-22 ~170 lever

# Desafio Final - Câmara do Selo: combina sequencia, logica, observacao e causa/consequencia sem script obrigatorio.
fill ~-38 ~-30 ~178 ~38 ~-8 ~236 polished_deepslate hollow
fill ~-34 ~-29 ~182 ~34 ~-9 ~232 air
fill ~-30 ~-29 ~186 ~30 ~-29 ~228 smooth_basalt
fill ~-18 ~-28 ~192 ~18 ~-28 ~222 black_concrete
setblock ~0 ~-27 ~184 lectern
setblock ~-24 ~-28 ~194 blue_concrete
setblock ~-12 ~-28 ~194 green_concrete
setblock ~0 ~-28 ~194 orange_concrete
setblock ~12 ~-28 ~194 purple_concrete
setblock ~24 ~-28 ~194 gold_block
setblock ~-24 ~-27 ~202 sea_lantern
setblock ~-12 ~-27 ~206 redstone_lamp
setblock ~0 ~-27 ~210 target
setblock ~12 ~-27 ~214 lightning_rod
setblock ~24 ~-27 ~218 beacon
setblock ~-24 ~-27 ~198 lectern
setblock ~-12 ~-27 ~202 lectern
setblock ~0 ~-27 ~206 lectern
setblock ~12 ~-27 ~210 lectern
setblock ~24 ~-27 ~214 lectern
fill ~-4 ~-28 ~224 ~4 ~-28 ~230 amethyst_block
setblock ~0 ~-27 ~227 bell

# Câmara de conclusão, recompensa, atalho de retorno e gancho para expansao futura.
fill ~-20 ~-24 ~238 ~20 ~-8 ~270 deepslate_tiles hollow
fill ~-17 ~-23 ~241 ~17 ~-9 ~267 air
fill ~-10 ~-23 ~248 ~10 ~-23 ~260 gold_block
setblock ~0 ~-22 ~254 beacon
setblock ~0 ~-21 ~254 lectern
setblock ~-8 ~-22 ~254 chest
setblock ~8 ~-22 ~254 ender_chest
fill ~14 ~-23 ~250 ~18 ~1 ~250 ladder
fill ~12 ~1 ~246 ~20 ~1 ~254 deepslate_tiles
setblock ~16 ~2 ~250 sea_lantern
setblock ~16 ~2 ~246 lectern
fill ~-18 ~-23 ~266 ~18 ~-18 ~270 tinted_glass
setblock ~0 ~-20 ~268 crying_obsidian
setblock ~0 ~-19 ~268 lectern

playsound random.levelup @s ~ ~ ~ 1 0.7
tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Sprint 6 concluida. Valide entrada pelo patio/biblioteca, desafio final, camara de recompensa e atalho de retorno seguro."}]}
