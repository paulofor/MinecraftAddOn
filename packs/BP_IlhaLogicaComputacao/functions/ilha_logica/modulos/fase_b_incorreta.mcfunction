# Sprint 2 - Fase B resposta incorreta com feedback explicativo
scoreboard players add @a[tag=ilhlog_fase_a,tag=!ilhlog_fase_b] ilhlog_erros 1
execute as @a[tag=ilhlog_fase_a,tag=!ilhlog_fase_b] run title @s actionbar §e[Fase B] Verifique todos os elementos de A.
tellraw @a[tag=ilhlog_fase_a,tag=!ilhlog_fase_b] {"rawtext":[{"text":"[Fase B] Incorreta. A ⊆ B somente quando TODO elemento de A tambem esta em B."}]}
tellraw @a[tag=ilhlog_fase_a,tag=!ilhlog_fase_b] {"rawtext":[{"text":"[Fase B] Exemplo: {1,2} ⊆ {1,2,3} (verdadeiro) e {1,4} ⊆ {1,2,3} (falso)."}]}
