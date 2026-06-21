# P2 - Cisternas secas com sinais de reparo
execute as @s[tag=!mh_p2] run scoreboard players add @s mh_pistas 1
execute as @s[tag=!mh_p2] run tag @s add mh_p2
tellraw @s[tag=mh_p2] {"rawtext":[{"text":"[P2] Cisternas: reservatorios vazios, mas com reparos recentes. Pode ser escassez real ou falha no sistema."}]}
execute as @s[tag=mh_p2] run title @s actionbar §6Pista P2 registrada
