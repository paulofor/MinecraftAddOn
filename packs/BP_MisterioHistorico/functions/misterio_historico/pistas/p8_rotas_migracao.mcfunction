# P8 - Rotas de migracao planejadas
execute as @a[tag=!mh_p8] run scoreboard players add @s mh_pistas 1
execute as @a[tag=!mh_p8] run tag @s add mh_p8
tellraw @a[tag=mh_p8] {"rawtext":[{"text":"[P8] Mapas: havia rotas de migracao planejadas. A saida de Arandu parece ter sido organizada."}]}
execute as @a[tag=mh_p8] run title @s actionbar §6Pista P8 registrada
