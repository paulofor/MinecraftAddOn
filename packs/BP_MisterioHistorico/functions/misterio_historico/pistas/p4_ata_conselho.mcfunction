# P4 - Ata incompleta do conselho
execute as @a[tag=!mh_p4] run scoreboard players add @s mh_pistas 1
execute as @a[tag=!mh_p4] run tag @s add mh_p4
tellraw @a[tag=mh_p4] {"rawtext":[{"text":"[P4] Ata: preservar reservas, expandir mineracao ou abrir rotas. A votacao terminou sem consenso."}]}
execute as @a[tag=mh_p4] run title @s actionbar §6Pista P4 registrada
