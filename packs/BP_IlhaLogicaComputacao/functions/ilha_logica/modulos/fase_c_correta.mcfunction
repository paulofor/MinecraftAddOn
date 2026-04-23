# Fase C - Operacoes de conjuntos
execute as @a[tag=!ilhlog_fase_b] run tellraw @s {"rawtext":[{"text":"[Fase C] Bloqueada. Conclua a Fase B primeiro."}]}
execute as @a[tag=ilhlog_fase_b,tag=ilhlog_fase_c] run tellraw @s {"rawtext":[{"text":"[Fase C] Voce ja concluiu esta fase."}]}
execute as @a[tag=ilhlog_fase_b,tag=!ilhlog_fase_c] run scoreboard players add @s ilhlog_acertos 1
execute as @a[tag=ilhlog_fase_b,tag=!ilhlog_fase_c] run scoreboard players set @s ilhlog_progresso 3
execute as @a[tag=ilhlog_fase_b,tag=!ilhlog_fase_c] run tellraw @s {"rawtext":[{"text":"[Fase C] Correto! Uniao (∪) junta elementos, intersecao (∩) pega comuns e diferenca (\\) remove os repetidos."}]}
execute as @a[tag=ilhlog_fase_b,tag=!ilhlog_fase_c] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Fase D desbloqueada: Produto Cartesiano (A×B)."}]}
execute as @a[tag=ilhlog_fase_b,tag=!ilhlog_fase_c] run tag @s add ilhlog_fase_c
