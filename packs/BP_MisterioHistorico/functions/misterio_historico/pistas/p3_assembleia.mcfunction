# P3 - Aviso da assembleia
execute as @a[tag=!mh_p3] run scoreboard players add @s mh_pistas 1
execute as @a[tag=!mh_p3] run tag @s add mh_p3
tellraw @a[tag=mh_p3] {"rawtext":[{"text":"[P3] Assembleia: a cidade discutia reservas, mineracao e migracao. Havia conflito de prioridades."}]}
execute as @a[tag=mh_p3] run title @s actionbar §6Pista P3 registrada
