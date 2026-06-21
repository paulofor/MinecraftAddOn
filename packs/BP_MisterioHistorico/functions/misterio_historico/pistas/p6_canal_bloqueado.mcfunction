# P6 - Canal subterraneo bloqueado
execute as @s[tag=!mh_p6] run scoreboard players add @s mh_pistas 1
execute as @s[tag=!mh_p6] run tag @s add mh_p6
tellraw @s[tag=mh_p6] {"rawtext":[{"text":"[P6] Canal: agua represada de um lado e seca do outro. O caminho da agua foi interrompido."}]}
execute as @s[tag=mh_p6] run title @s actionbar §6Pista P6 registrada
