# Sprint 2 - hub com orientacao pedagogica reforcada
execute as @a[tag=!ilhlog_fase_a,tag=!ilhlog_fase_b,tag=!ilhlog_fase_c,tag=!ilhlog_fase_d,tag=!ilhlog_final] run scoreboard players set @s ilhlog_progresso 0

execute as @a run title @s title §bIlha de Logica e Computacao
execute as @a run title @s subtitle §fTrilha de Conjuntos: A → D

tellraw @a {"rawtext":[{"text":"[IlhaLogica] Objetivo: concluir 4 fases com no minimo 80% de acertos (max. 1 erro)."}]}
tellraw @a {"rawtext":[{"text":"[IlhaLogica] Sequencia guiada: A) Pertinencia, B) Subconjuntos, C) Operacoes, D) Produto Cartesiano."}]}
tellraw @a {"rawtext":[{"text":"[IlhaLogica] Dica: ao errar, leia a explicacao e tente novamente antes de avancar."}]}
