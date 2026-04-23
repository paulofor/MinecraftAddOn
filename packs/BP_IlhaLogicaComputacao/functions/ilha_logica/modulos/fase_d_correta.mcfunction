# Fase D - Produto cartesiano (A×B)
execute as @a[tag=!ilhlog_fase_c] run tellraw @s {"rawtext":[{"text":"[Fase D] Bloqueada. Conclua a Fase C primeiro."}]}
execute as @a[tag=ilhlog_fase_c,tag=ilhlog_fase_d] run tellraw @s {"rawtext":[{"text":"[Fase D] Voce ja concluiu esta fase."}]}
execute as @a[tag=ilhlog_fase_c,tag=!ilhlog_fase_d] run scoreboard players add @s ilhlog_acertos 1
execute as @a[tag=ilhlog_fase_c,tag=!ilhlog_fase_d] run scoreboard players set @s ilhlog_progresso 4
execute as @a[tag=ilhlog_fase_c,tag=!ilhlog_fase_d] run tellraw @s {"rawtext":[{"text":"[Fase D] Correto! Produto cartesiano A×B forma pares ordenados (a,b) com a em A e b em B."}]}
execute as @a[tag=ilhlog_fase_c,tag=!ilhlog_fase_d] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Revisao final desbloqueada."}]}
execute as @a[tag=ilhlog_fase_c,tag=!ilhlog_fase_d] run tag @s add ilhlog_fase_d
