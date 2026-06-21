# P1 - Diario da moradora
execute as @a[tag=!mh_p1] run scoreboard players add @s mh_pistas 1
execute as @a[tag=!mh_p1] run tag @s add mh_p1
tellraw @a[tag=mh_p1] {"rawtext":[{"text":"[P1] Diario: racionamento de agua gerou medo, mas algumas pessoas diziam que a agua nem chegava aos reservatorios."}]}
execute as @a[tag=mh_p1] run title @s actionbar §6Pista P1 registrada
