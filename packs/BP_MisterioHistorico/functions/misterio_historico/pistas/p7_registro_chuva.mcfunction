# P7 - Registro de chuva suficiente
execute as @s[tag=!mh_p7] run scoreboard players add @s mh_pistas 1
execute as @s[tag=!mh_p7] run tag @s add mh_p7
tellraw @s[tag=mh_p7] {"rawtext":[{"text":"[P7] Registro climatico: houve chuva suficiente. O problema talvez nao fosse falta de chuva."}]}
execute as @s[tag=mh_p7] run title @s actionbar §6Pista P7 registrada
