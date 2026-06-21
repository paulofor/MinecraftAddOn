# Conclusao B - Conflito politico
execute as @s[tag=mh_conclusao_a] run tag @s remove mh_conclusao_a
execute as @s[tag=mh_conclusao_c] run tag @s remove mh_conclusao_c
execute as @s[tag=!mh_conclusao_b] run scoreboard players add @s mh_conclusoes 1
execute as @s run tag @s add mh_conclusao_b
execute as @s run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Hipotese B escolhida: conflito politico. Agora execute /function misterio_historico/finalizar."}]}
