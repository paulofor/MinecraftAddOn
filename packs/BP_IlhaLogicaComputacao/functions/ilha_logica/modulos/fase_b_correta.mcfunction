# Fase B - Subconjuntos (⊆)
execute as @a[tag=!ilhlog_fase_a] run tellraw @s {"rawtext":[{"text":"[Fase B] Bloqueada. Conclua a Fase A primeiro."}]}
execute as @a[tag=ilhlog_fase_a,tag=ilhlog_fase_b] run tellraw @s {"rawtext":[{"text":"[Fase B] Voce ja concluiu esta fase."}]}
execute as @a[tag=ilhlog_fase_a,tag=!ilhlog_fase_b] run scoreboard players add @s ilhlog_acertos 1
execute as @a[tag=ilhlog_fase_a,tag=!ilhlog_fase_b] run scoreboard players set @s ilhlog_progresso 2
execute as @a[tag=ilhlog_fase_a,tag=!ilhlog_fase_b] run tellraw @s {"rawtext":[{"text":"[Fase B] Correto! A ⊆ B quando todo elemento de A tambem esta em B."}]}
execute as @a[tag=ilhlog_fase_a,tag=!ilhlog_fase_b] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Fase C desbloqueada: Operacoes (∪, ∩, \\)."}]}
execute as @a[tag=ilhlog_fase_a,tag=!ilhlog_fase_b] run tag @s add ilhlog_fase_b
