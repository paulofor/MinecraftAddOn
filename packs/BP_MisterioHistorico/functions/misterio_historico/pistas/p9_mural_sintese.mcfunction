# P9 - Mural de sintese
execute as @a[tag=!mh_p9] run scoreboard players add @s mh_pistas 1
execute as @a[tag=!mh_p9] run tag @s add mh_p9
tellraw @a[tag=mh_p9] {"rawtext":[{"text":"[P9] Mural: compare evidencias antes de concluir. Uma boa resposta historica explica, nao apenas escolhe."}]}
execute as @a[tag=mh_p9] run title @s actionbar §6Pista P9 registrada
