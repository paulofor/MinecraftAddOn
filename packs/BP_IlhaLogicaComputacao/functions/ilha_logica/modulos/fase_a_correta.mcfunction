# Fase A - Pertinencia (∈ / ∉)
execute as @a[tag=ilhlog_fase_a] run tellraw @s {"rawtext":[{"text":"[Fase A] Voce ja concluiu esta fase."}]}
execute as @a[tag=!ilhlog_fase_a] run scoreboard players add @s ilhlog_acertos 1
execute as @a[tag=!ilhlog_fase_a] run scoreboard players set @s ilhlog_progresso 1
execute as @a[tag=!ilhlog_fase_a] run tellraw @s {"rawtext":[{"text":"[Fase A] Correto! Pertinencia indica se um elemento pertence (∈) ou nao pertence (∉) a um conjunto."}]}
execute as @a[tag=!ilhlog_fase_a] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Fase B desbloqueada: Subconjuntos (⊆)."}]}
execute as @a[tag=!ilhlog_fase_a] run tag @s add ilhlog_fase_a
