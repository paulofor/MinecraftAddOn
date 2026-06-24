# Sprint 4 - laboratorios, puzzles e conteudo educativo da Torre Invertida Abissal
# Origem recomendada: mesmo centro usado nas Sprints 1-3. Execute apenas em mundo de teste/area livre.
# A funcao cria quatro salas de desafio observacionais: sequencia, logica booleana, padrao visual e causa/consequencia.

tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Iniciando Sprint 4: laboratorios educativos, feedback visual e recompensas simbolicas."}]}

# Hub dos laboratorios no Anel 2, conectando desafios sem bloquear a rota principal.
fill ~-24 ~-48 ~-72 ~24 ~-45 ~-52 polished_deepslate hollow
fill ~-20 ~-47 ~-68 ~20 ~-45 ~-56 air
fill ~-3 ~-47 ~-56 ~3 ~-45 ~-50 air
fill ~-22 ~-44 ~-70 ~22 ~-44 ~-54 deepslate_tiles
fill ~-18 ~-43 ~-66 ~18 ~-43 ~-58 smooth_stone
setblock ~0 ~-42 ~-62 lectern
setblock ~0 ~-42 ~-66 sea_lantern
setblock ~0 ~-42 ~-58 standing_sign
setblock ~-20 ~-42 ~-62 blue_wool
setblock ~-7 ~-42 ~-62 lime_wool
setblock ~7 ~-42 ~-62 purple_wool
setblock ~20 ~-42 ~-62 red_wool

# Sala 1 - Sequencia: observar a ordem azul, verde, amarelo, vermelho e seguir placas/pedestais.
fill ~-72 ~-48 ~-72 ~-42 ~-45 ~-42 stone_bricks hollow
fill ~-68 ~-47 ~-68 ~-46 ~-45 ~-46 air
fill ~-42 ~-47 ~-60 ~-24 ~-45 ~-56 air
fill ~-68 ~-44 ~-68 ~-46 ~-44 ~-46 deepslate_tiles
setblock ~-57 ~-42 ~-66 lectern
setblock ~-64 ~-42 ~-60 blue_concrete
setblock ~-59 ~-42 ~-60 lime_concrete
setblock ~-54 ~-42 ~-60 yellow_concrete
setblock ~-49 ~-42 ~-60 red_concrete
setblock ~-64 ~-41 ~-60 sea_lantern
setblock ~-59 ~-41 ~-60 redstone_lamp
setblock ~-54 ~-41 ~-60 redstone_lamp
setblock ~-49 ~-41 ~-60 sea_lantern
setblock ~-64 ~-42 ~-52 blue_glazed_terracotta
setblock ~-59 ~-42 ~-52 lime_glazed_terracotta
setblock ~-54 ~-42 ~-52 yellow_glazed_terracotta
setblock ~-49 ~-42 ~-52 red_glazed_terracotta
fill ~-66 ~-42 ~-48 ~-48 ~-42 ~-48 gold_block
setblock ~-57 ~-41 ~-48 chest
setblock ~-57 ~-42 ~-46 standing_sign

# Sala 2 - Logica booleana simples: AND/OR/NOT como portas coloridas e leitura por comparacao.
fill ~42 ~-48 ~-72 ~72 ~-45 ~-42 stone_bricks hollow
fill ~46 ~-47 ~-68 ~68 ~-45 ~-46 air
fill ~24 ~-47 ~-60 ~42 ~-45 ~-56 air
fill ~46 ~-44 ~-68 ~68 ~-44 ~-46 polished_andesite
setblock ~57 ~-42 ~-66 lectern
fill ~49 ~-42 ~-62 ~53 ~-42 ~-62 lime_concrete
fill ~61 ~-42 ~-62 ~65 ~-42 ~-62 lime_concrete
fill ~54 ~-42 ~-58 ~60 ~-42 ~-58 iron_bars
setblock ~57 ~-41 ~-58 sea_lantern
fill ~49 ~-42 ~-54 ~53 ~-42 ~-54 lime_concrete
fill ~61 ~-42 ~-54 ~65 ~-42 ~-54 red_concrete
fill ~54 ~-42 ~-50 ~60 ~-42 ~-50 iron_bars
setblock ~57 ~-41 ~-50 redstone_lamp
setblock ~48 ~-42 ~-62 standing_sign
setblock ~66 ~-42 ~-62 standing_sign
setblock ~48 ~-42 ~-54 standing_sign
setblock ~66 ~-42 ~-54 standing_sign
setblock ~57 ~-41 ~-46 chest
setblock ~57 ~-42 ~-46 standing_sign

# Sala 3 - Padrao visual: completar simetria e repeticao sem conhecimento externo.
fill ~-72 ~-84 ~-72 ~-42 ~-81 ~-42 deepslate_bricks hollow
fill ~-68 ~-83 ~-68 ~-46 ~-81 ~-46 air
fill ~-42 ~-83 ~-60 ~-24 ~-81 ~-56 air
fill ~-68 ~-80 ~-68 ~-46 ~-80 ~-46 polished_deepslate
setblock ~-57 ~-78 ~-66 lectern
setblock ~-65 ~-78 ~-62 amethyst_block
setblock ~-61 ~-78 ~-62 sea_lantern
setblock ~-57 ~-78 ~-62 amethyst_block
setblock ~-53 ~-78 ~-62 sea_lantern
setblock ~-49 ~-78 ~-62 amethyst_block
setblock ~-65 ~-78 ~-56 blue_stained_glass
setblock ~-61 ~-78 ~-56 purple_stained_glass
setblock ~-57 ~-78 ~-56 blue_stained_glass
setblock ~-53 ~-78 ~-56 purple_stained_glass
setblock ~-49 ~-78 ~-56 blue_stained_glass
setblock ~-65 ~-78 ~-50 amethyst_block
setblock ~-61 ~-78 ~-50 sea_lantern
setblock ~-57 ~-78 ~-50 amethyst_block
setblock ~-53 ~-78 ~-50 sea_lantern
setblock ~-49 ~-78 ~-50 amethyst_block
setblock ~-57 ~-77 ~-46 chest
setblock ~-57 ~-78 ~-44 standing_sign

# Sala 4 - Causa e consequencia: trilha de energia mostrando entrada, processo, resultado e retorno seguro.
fill ~42 ~-84 ~-72 ~72 ~-81 ~-42 deepslate_bricks hollow
fill ~46 ~-83 ~-68 ~68 ~-81 ~-46 air
fill ~24 ~-83 ~-60 ~42 ~-81 ~-56 air
fill ~46 ~-80 ~-68 ~68 ~-80 ~-46 deepslate_tiles
setblock ~57 ~-78 ~-66 lectern
setblock ~48 ~-78 ~-62 copper_block
setblock ~52 ~-78 ~-62 cut_copper
setblock ~56 ~-78 ~-62 exposed_copper
setblock ~60 ~-78 ~-62 weathered_copper
setblock ~64 ~-78 ~-62 oxidized_copper
setblock ~48 ~-77 ~-62 redstone_torch
setblock ~52 ~-77 ~-62 redstone_lamp
setblock ~56 ~-77 ~-62 sea_lantern
setblock ~60 ~-77 ~-62 redstone_lamp
setblock ~64 ~-77 ~-62 sea_lantern
fill ~48 ~-78 ~-56 ~64 ~-78 ~-56 redstone_block
setblock ~57 ~-77 ~-56 iron_door
setblock ~57 ~-77 ~-50 chest
setblock ~57 ~-78 ~-48 standing_sign

# Feedback comum: luzes de conclusao, atalhos simbolicos e retorno ao eixo.
fill ~-4 ~-42 ~-72 ~4 ~-42 ~-70 emerald_block
fill ~-4 ~-78 ~-72 ~4 ~-78 ~-70 emerald_block
fill ~-2 ~-42 ~-70 ~2 ~-42 ~-62 sea_lantern
fill ~-2 ~-78 ~-70 ~2 ~-78 ~-62 sea_lantern
fill ~-1 ~-78 ~-62 ~1 ~-43 ~-62 ladder
setblock ~0 ~-41 ~-70 beacon
setblock ~0 ~-77 ~-70 beacon

tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Sprint 4 concluida. Valide quatro desafios, feedback visual, recompensas e textos curtos em lecterns/placas."}]}
