# Sprint 2 - Fase C resposta incorreta com feedback explicativo
scoreboard players add @a[tag=ilhlog_fase_b,tag=!ilhlog_fase_c] ilhlog_erros 1
execute as @a[tag=ilhlog_fase_b,tag=!ilhlog_fase_c] run title @s actionbar §e[Fase C] Diferencie uniao, intersecao e diferenca.
tellraw @a[tag=ilhlog_fase_b,tag=!ilhlog_fase_c] {"rawtext":[{"text":"[Fase C] Incorreta. Uniao (∪) junta todos os elementos; intersecao (∩) pega apenas os comuns."}]}
tellraw @a[tag=ilhlog_fase_b,tag=!ilhlog_fase_c] {"rawtext":[{"text":"[Fase C] Diferenca (A\\B) remove de A os elementos que aparecem em B."}]}
