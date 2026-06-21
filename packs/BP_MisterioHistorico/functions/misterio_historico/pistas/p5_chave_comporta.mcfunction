# P5 - Chave de comporta quebrada
execute as @a[tag=!mh_p5] run scoreboard players add @s mh_pistas 1
execute as @a[tag=!mh_p5] run tag @s add mh_p5
tellraw @a[tag=mh_p5] {"rawtext":[{"text":"[P5] Manutencao: a chave de comporta quebrada sugere falha tecnica ou sabotagem."}]}
execute as @a[tag=mh_p5] run title @s actionbar §6Pista P5 registrada
