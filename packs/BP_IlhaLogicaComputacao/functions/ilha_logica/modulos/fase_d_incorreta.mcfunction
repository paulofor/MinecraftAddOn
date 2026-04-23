# Sprint 2 - Fase D resposta incorreta com feedback explicativo
scoreboard players add @a[tag=ilhlog_fase_c,tag=!ilhlog_fase_d] ilhlog_erros 1
execute as @a[tag=ilhlog_fase_c,tag=!ilhlog_fase_d] run title @s actionbar §e[Fase D] Monte pares ordenados (a,b).
tellraw @a[tag=ilhlog_fase_c,tag=!ilhlog_fase_d] {"rawtext":[{"text":"[Fase D] Incorreta. Em A×B, cada elemento de A combina com cada elemento de B em pares (a,b)."}]}
tellraw @a[tag=ilhlog_fase_c,tag=!ilhlog_fase_d] {"rawtext":[{"text":"[Fase D] Exemplo: A={1,2}, B={x} => A×B={(1,x),(2,x)}."}]}
