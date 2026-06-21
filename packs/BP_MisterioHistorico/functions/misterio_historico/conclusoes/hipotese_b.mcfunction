# Conclusao B - Conflito politico
execute as @a[tag=mh_conclusao_a] run tag @s remove mh_conclusao_a
execute as @a[tag=mh_conclusao_c] run tag @s remove mh_conclusao_c
execute as @a[tag=!mh_conclusao_b] run scoreboard players add @s mh_conclusoes 1
execute as @a run tag @s add mh_conclusao_b
execute as @a run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Hipotese B escolhida: conflito politico. Agora execute /function misterio_historico/finalizar."}]}
