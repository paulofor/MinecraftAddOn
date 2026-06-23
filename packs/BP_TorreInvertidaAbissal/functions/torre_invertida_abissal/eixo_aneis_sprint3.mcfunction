# Sprint 3 - eixo vertical e aneis de exploracao da Torre Invertida Abissal
# Origem recomendada: mesmo centro usado nas Sprints 1-2. Execute apenas em mundo de teste/area livre.
# A funcao abre leitura vertical, cria tres aneis exploraveis e adiciona conexoes, checkpoints por cor e mitigacao de quedas.

tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Iniciando Sprint 3: eixo vertical, aneis, conexoes e checkpoints por cor."}]}

# Eixo central aberto: poco vertical visivel com colunas de luz e agua para leitura de profundidade/seguranca.
fill ~-10 ~-86 ~-10 ~10 ~52 ~10 air
fill ~-7 ~-86 ~-7 ~7 ~52 ~7 air
fill ~-3 ~-86 ~-3 ~3 ~52 ~3 air
fill ~-1 ~-86 ~-1 ~1 ~52 ~1 water
fill ~-13 ~-86 ~-13 ~13 ~52 ~-13 deepslate_bricks
fill ~-13 ~-86 ~13 ~13 ~52 ~13 deepslate_bricks
fill ~-13 ~-86 ~-13 ~-13 ~52 ~13 deepslate_bricks
fill ~13 ~-86 ~-13 ~13 ~52 ~13 deepslate_bricks
fill ~-12 ~-84 ~-12 ~12 ~50 ~-12 cracked_deepslate_bricks
fill ~-12 ~-84 ~12 ~12 ~50 ~12 cracked_deepslate_bricks
fill ~-12 ~-84 ~-12 ~-12 ~50 ~12 cracked_deepslate_bricks
fill ~12 ~-84 ~-12 ~12 ~50 ~12 cracked_deepslate_bricks
setblock ~0 ~50 ~0 beacon
setblock ~0 ~20 ~0 sea_lantern
setblock ~0 ~-18 ~0 sea_lantern
setblock ~0 ~-54 ~0 sea_lantern
setblock ~0 ~-84 ~0 sea_lantern

# Plataformas intermediarias e piscinas de mitigacao para quedas acidentais.
fill ~-16 ~18 ~-16 ~16 ~18 ~16 polished_andesite hollow
fill ~-9 ~18 ~-9 ~9 ~18 ~9 air
fill ~-18 ~-18 ~-18 ~18 ~-18 ~18 smooth_stone hollow
fill ~-10 ~-18 ~-10 ~10 ~-18 ~10 air
fill ~-20 ~-54 ~-20 ~20 ~-54 ~20 cobbled_deepslate hollow
fill ~-11 ~-54 ~-11 ~11 ~-54 ~11 air
fill ~-7 ~-85 ~-7 ~7 ~-82 ~7 water
fill ~-24 ~-86 ~-24 ~24 ~-86 ~24 deepslate_tiles hollow
fill ~-14 ~-86 ~-14 ~14 ~-86 ~14 water

# Anel 1 - Ecos Azuis: orientacao inicial, salas laterais e descanso visual.
fill ~-34 ~-18 ~-34 ~34 ~-15 ~34 smooth_stone hollow
fill ~-22 ~-18 ~-22 ~22 ~-14 ~22 air
fill ~-6 ~-18 ~-34 ~6 ~-14 ~-22 air
fill ~-6 ~-18 ~22 ~6 ~-14 ~34 air
fill ~-34 ~-18 ~-6 ~-22 ~-14 ~6 air
fill ~22 ~-18 ~-6 ~34 ~-14 ~6 air
fill ~-42 ~-17 ~-8 ~-34 ~-15 ~8 blue_concrete
fill ~34 ~-17 ~-8 ~42 ~-15 ~8 blue_concrete
fill ~-8 ~-17 ~34 ~8 ~-15 ~42 blue_concrete
fill ~-8 ~-17 ~-42 ~8 ~-15 ~-34 blue_concrete
fill ~-48 ~-17 ~-14 ~-42 ~-15 ~14 smooth_stone hollow
fill ~42 ~-17 ~-14 ~48 ~-15 ~14 smooth_stone hollow
fill ~-14 ~-17 ~42 ~14 ~-15 ~48 smooth_stone hollow
fill ~-14 ~-17 ~-48 ~14 ~-15 ~-42 smooth_stone hollow
setblock ~0 ~-14 ~-34 blue_glazed_terracotta
setblock ~0 ~-14 ~34 blue_glazed_terracotta
setblock ~-34 ~-14 ~0 blue_glazed_terracotta
setblock ~34 ~-14 ~0 blue_glazed_terracotta
setblock ~0 ~-14 ~-46 lectern
setblock ~0 ~-14 ~46 sea_lantern
setblock ~-46 ~-14 ~0 sea_lantern
setblock ~46 ~-14 ~0 sea_lantern

# Anel 2 - Pontes Âmbar: rotas alternativas, passarelas quebradas e tuneis curtos.
fill ~-42 ~-54 ~-42 ~42 ~-51 ~42 deepslate_tiles hollow
fill ~-26 ~-54 ~-26 ~26 ~-50 ~26 air
fill ~-5 ~-54 ~-42 ~5 ~-50 ~-26 air
fill ~-5 ~-54 ~26 ~5 ~-50 ~42 air
fill ~-42 ~-54 ~-5 ~-26 ~-50 ~5 air
fill ~26 ~-54 ~-5 ~42 ~-50 ~5 air
fill ~-50 ~-53 ~-6 ~-42 ~-51 ~6 orange_concrete
fill ~42 ~-53 ~-6 ~50 ~-51 ~6 orange_concrete
fill ~-6 ~-53 ~42 ~6 ~-51 ~50 orange_concrete
fill ~-6 ~-53 ~-50 ~6 ~-51 ~-42 orange_concrete
fill ~-38 ~-53 ~-2 ~38 ~-53 ~2 cut_copper
fill ~-2 ~-53 ~-38 ~2 ~-53 ~38 cut_copper
fill ~-38 ~-52 ~-3 ~38 ~-51 ~-3 iron_bars
fill ~-38 ~-52 ~3 ~38 ~-51 ~3 iron_bars
fill ~-3 ~-52 ~-38 ~-3 ~-51 ~38 iron_bars
fill ~3 ~-52 ~-38 ~3 ~-51 ~38 iron_bars
setblock ~0 ~-50 ~-50 orange_glazed_terracotta
setblock ~0 ~-50 ~50 orange_glazed_terracotta
setblock ~-50 ~-50 ~0 orange_glazed_terracotta
setblock ~50 ~-50 ~0 orange_glazed_terracotta
setblock ~0 ~-50 ~-46 lectern
setblock ~0 ~-50 ~46 lantern
setblock ~-46 ~-50 ~0 lantern
setblock ~46 ~-50 ~0 lantern

# Anel 3 - Cristal Verde: camada profunda com descanso, orientacao e preparacao para sprints futuras.
fill ~-50 ~-82 ~-50 ~50 ~-79 ~50 polished_deepslate hollow
fill ~-30 ~-82 ~-30 ~30 ~-78 ~30 air
fill ~-7 ~-82 ~-50 ~7 ~-78 ~-30 air
fill ~-7 ~-82 ~30 ~7 ~-78 ~50 air
fill ~-50 ~-82 ~-7 ~-30 ~-78 ~7 air
fill ~30 ~-82 ~-7 ~50 ~-78 ~7 air
fill ~-58 ~-81 ~-10 ~-50 ~-79 ~10 green_concrete
fill ~50 ~-81 ~-10 ~58 ~-79 ~10 green_concrete
fill ~-10 ~-81 ~50 ~10 ~-79 ~58 green_concrete
fill ~-10 ~-81 ~-58 ~10 ~-79 ~-50 green_concrete
fill ~-18 ~-81 ~54 ~18 ~-79 ~62 amethyst_block hollow
fill ~-18 ~-81 ~-62 ~18 ~-79 ~-54 amethyst_block hollow
fill ~54 ~-81 ~-18 ~62 ~-79 ~18 amethyst_block hollow
fill ~-62 ~-81 ~-18 ~-54 ~-79 ~18 amethyst_block hollow
setblock ~0 ~-78 ~-58 green_glazed_terracotta
setblock ~0 ~-78 ~58 green_glazed_terracotta
setblock ~-58 ~-78 ~0 green_glazed_terracotta
setblock ~58 ~-78 ~0 green_glazed_terracotta
setblock ~0 ~-78 ~-60 lectern
setblock ~0 ~-78 ~60 sea_lantern
setblock ~-60 ~-78 ~0 sea_lantern
setblock ~60 ~-78 ~0 sea_lantern

# Conexoes verticais: escadas, agua, plataformas e passarelas para alternar caminhos sem confundir a rota principal.
fill ~15 ~-82 ~-2 ~17 ~18 ~2 ladder
fill ~-17 ~-54 ~-2 ~-15 ~52 ~2 ladder
fill ~-2 ~-54 ~15 ~2 ~18 ~17 scaffolding
fill ~-2 ~-82 ~-17 ~2 ~-18 ~-15 scaffolding
fill ~18 ~-17 ~0 ~42 ~-17 ~0 deepslate_bricks
fill ~-42 ~-53 ~0 ~-18 ~-53 ~0 deepslate_bricks
fill ~0 ~-81 ~18 ~0 ~-81 ~50 deepslate_bricks
fill ~0 ~-53 ~-42 ~0 ~-53 ~-18 deepslate_bricks
setblock ~20 ~-16 ~0 sea_lantern
setblock ~-20 ~-52 ~0 sea_lantern
setblock ~0 ~-80 ~20 sea_lantern
setblock ~0 ~-52 ~-20 sea_lantern

# Checkpoints visuais por cor e sinalizacao curta para orientacao do jogador.
setblock ~3 ~-14 ~-34 standing_sign
setblock ~3 ~-50 ~-50 standing_sign
setblock ~3 ~-78 ~-58 standing_sign
fill ~-4 ~-13 ~-36 ~4 ~-13 ~-36 blue_wool
fill ~-4 ~-49 ~-52 ~4 ~-49 ~-52 orange_wool
fill ~-4 ~-77 ~-60 ~4 ~-77 ~-60 green_wool

tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Sprint 3 concluida. Valide profundidade, aneis azul/ambar/verde, rotas alternativas e mitigacao por agua/plataformas."}]}
