# Sprint 6 - polimento, validacao e preparacao para expansao da Torre Invertida Abissal
# Origem recomendada: mesmo centro usado nas Sprints 1-5. Execute apos todas as funcoes anteriores, em mundo de teste/area livre.
# A funcao reforca orientacao, iluminacao, mitigacao de quedas, retorno sem comandos e marcadores de expansao futura.

tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Iniciando Sprint 6: polimento, seguranca, orientacao e pontos de expansao."}]}

# Trilha principal norte -> portal -> eixo: reforco visual para o jogador sempre ter uma pista de direcao.
fill ~-3 ~2 ~-82 ~3 ~2 ~-72 blue_carpet
fill ~-3 ~2 ~-68 ~3 ~2 ~-16 blue_carpet
setblock ~0 ~3 ~-84 standing_sign
setblock ~0 ~3 ~-70 sea_lantern
setblock ~0 ~3 ~-58 sea_lantern
setblock ~0 ~3 ~-46 sea_lantern
setblock ~0 ~3 ~-34 sea_lantern
setblock ~0 ~3 ~-22 sea_lantern
setblock ~0 ~3 ~-14 standing_sign

# Iluminacao anti-spawn e leitura de contorno na superficie, sem remover a atmosfera de ruina.
setblock ~-52 ~4 ~0 lantern
setblock ~52 ~4 ~0 lantern
setblock ~0 ~4 ~52 lantern
setblock ~0 ~4 ~-52 lantern
setblock ~-42 ~2 ~-42 sea_lantern
setblock ~42 ~2 ~-42 sea_lantern
setblock ~-42 ~2 ~42 sea_lantern
setblock ~42 ~2 ~42 sea_lantern
fill ~-9 ~2 ~-70 ~-9 ~3 ~-10 deepslate_brick_wall
fill ~9 ~2 ~-70 ~9 ~3 ~-10 deepslate_brick_wall

# Guard rails e luzes nos aneis de exploracao para reduzir quedas perigosas sem fechar a vista vertical.
fill ~-36 ~-14 ~-36 ~36 ~-14 ~-36 deepslate_brick_wall
fill ~-36 ~-14 ~36 ~36 ~-14 ~36 deepslate_brick_wall
fill ~-36 ~-14 ~-36 ~-36 ~-14 ~36 deepslate_brick_wall
fill ~36 ~-14 ~-36 ~36 ~-14 ~36 deepslate_brick_wall
setblock ~0 ~-13 ~-36 sea_lantern
setblock ~36 ~-13 ~0 sea_lantern
setblock ~0 ~-13 ~36 sea_lantern
setblock ~-36 ~-13 ~0 sea_lantern
setblock ~0 ~-13 ~-40 standing_sign

fill ~-44 ~-50 ~-44 ~44 ~-50 ~-44 cobbled_deepslate_wall
fill ~-44 ~-50 ~44 ~44 ~-50 ~44 cobbled_deepslate_wall
fill ~-44 ~-50 ~-44 ~-44 ~-50 ~44 cobbled_deepslate_wall
fill ~44 ~-50 ~-44 ~44 ~-50 ~44 cobbled_deepslate_wall
setblock ~0 ~-49 ~-44 lantern
setblock ~44 ~-49 ~0 lantern
setblock ~0 ~-49 ~44 lantern
setblock ~-44 ~-49 ~0 lantern
setblock ~0 ~-49 ~-48 standing_sign

fill ~-52 ~-78 ~-52 ~52 ~-78 ~-52 polished_deepslate_wall
fill ~-52 ~-78 ~52 ~52 ~-78 ~52 polished_deepslate_wall
fill ~-52 ~-78 ~-52 ~-52 ~-78 ~52 polished_deepslate_wall
fill ~52 ~-78 ~-52 ~52 ~-78 ~52 polished_deepslate_wall
setblock ~0 ~-77 ~-52 sea_lantern
setblock ~52 ~-77 ~0 sea_lantern
setblock ~0 ~-77 ~52 sea_lantern
setblock ~-52 ~-77 ~0 sea_lantern
setblock ~0 ~-77 ~-56 standing_sign

# Reforco das rotas verticais: checkpoints, agua de recuperacao e sinalizacao de retorno.
fill ~-4 ~-86 ~-4 ~4 ~-82 ~4 water
fill ~-6 ~-87 ~-6 ~6 ~-87 ~6 sea_lantern hollow
setblock ~15 ~19 ~0 sea_lantern
setblock ~15 ~-17 ~0 sea_lantern
setblock ~15 ~-53 ~0 sea_lantern
setblock ~15 ~-81 ~0 sea_lantern
setblock ~17 ~19 ~0 standing_sign
setblock ~-17 ~-53 ~0 standing_sign
setblock ~2 ~-81 ~-17 standing_sign

# Laboratorios: clarear entradas, marcar recompensas e assegurar retorno ao eixo.
fill ~-5 ~-42 ~-72 ~5 ~-42 ~-72 yellow_concrete
fill ~-5 ~-78 ~-72 ~5 ~-78 ~-72 yellow_concrete
setblock ~0 ~-41 ~-72 sea_lantern
setblock ~0 ~-77 ~-72 sea_lantern
setblock ~-24 ~-42 ~-62 standing_sign
setblock ~24 ~-42 ~-62 standing_sign
setblock ~-24 ~-78 ~-62 standing_sign
setblock ~24 ~-78 ~-62 standing_sign
fill ~-1 ~-78 ~-63 ~1 ~-43 ~-63 ladder

# Jardim, Arquivo e Nucleo: rota final mais legivel e retorno sem comandos administrativos.
fill ~-2 ~-110 ~-72 ~2 ~-110 ~72 cyan_carpet
fill ~-72 ~-110 ~-2 ~72 ~-110 ~2 cyan_carpet
setblock ~0 ~-109 ~-72 sea_lantern
setblock ~0 ~-109 ~72 sea_lantern
setblock ~-72 ~-109 ~0 sea_lantern
setblock ~72 ~-109 ~0 sea_lantern
setblock ~0 ~-109 ~-76 standing_sign
setblock ~-54 ~-99 ~0 standing_sign
setblock ~0 ~-111 ~-42 standing_sign
setblock ~21 ~2 ~16 standing_sign
fill ~17 ~1 ~17 ~25 ~1 ~25 emerald_block hollow
setblock ~21 ~3 ~25 sea_lantern

# Marcadores de coordenadas relativas e pontos de expansao futura para PRs posteriores.
fill ~-90 ~2 ~70 ~-74 ~4 ~86 smooth_stone hollow
fill ~74 ~2 ~70 ~90 ~4 ~86 smooth_stone hollow
fill ~-90 ~-80 ~70 ~-74 ~-76 ~86 deepslate_tiles hollow
fill ~74 ~-80 ~70 ~90 ~-76 ~86 deepslate_tiles hollow
setblock ~-82 ~3 ~78 lectern
setblock ~82 ~3 ~78 lectern
setblock ~-82 ~-75 ~78 lectern
setblock ~82 ~-75 ~78 lectern
setblock ~-82 ~4 ~78 emerald_block
setblock ~82 ~4 ~78 gold_block
setblock ~-82 ~-74 ~78 amethyst_block
setblock ~82 ~-74 ~78 diamond_block

# Checklist in-game para playtest: inicio, aneis, laboratorios, jardim, arquivo, nucleo, elevador e expansoes.
title @s title §bTorre Polida
title @s subtitle §fPercurso pronto para playtest completo e expansoes futuras.
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Sprint 6 concluida. Checklist: entrada visivel, pistas por cor, quedas mitigadas, luzes anti-spawn, laboratorios sinalizados, nucleo com retorno e quatro pontos de expansao marcados."}]}
