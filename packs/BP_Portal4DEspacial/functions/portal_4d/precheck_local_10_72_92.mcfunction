# Precheck por amostragem do Portal 4D absoluto em 10 72 92.
# Area total da construcao: X=5..15, Y=71..77, Z=85..96; sem subsolo abaixo de Y=71.
# Limitação: valida centro, cantos e meios das bordas; não varre todos os blocos. Confirmacao visual continua obrigatoria.
scoreboard players set @s p4d_local_ok 1

# Nove amostras da base real em X=5..15, Z=88..96, Y=71: bloqueia ar, agua e lava.
execute if block 10 71 92 air run scoreboard players set @s p4d_local_ok 0
execute if block 5 71 88 air run scoreboard players set @s p4d_local_ok 0
execute if block 15 71 88 air run scoreboard players set @s p4d_local_ok 0
execute if block 5 71 96 air run scoreboard players set @s p4d_local_ok 0
execute if block 15 71 96 air run scoreboard players set @s p4d_local_ok 0
execute if block 10 71 88 air run scoreboard players set @s p4d_local_ok 0
execute if block 10 71 96 air run scoreboard players set @s p4d_local_ok 0
execute if block 5 71 92 air run scoreboard players set @s p4d_local_ok 0
execute if block 15 71 92 air run scoreboard players set @s p4d_local_ok 0
execute if block 10 71 92 water run scoreboard players set @s p4d_local_ok 0
execute if block 5 71 88 water run scoreboard players set @s p4d_local_ok 0
execute if block 15 71 88 water run scoreboard players set @s p4d_local_ok 0
execute if block 5 71 96 water run scoreboard players set @s p4d_local_ok 0
execute if block 15 71 96 water run scoreboard players set @s p4d_local_ok 0
execute if block 10 71 88 water run scoreboard players set @s p4d_local_ok 0
execute if block 10 71 96 water run scoreboard players set @s p4d_local_ok 0
execute if block 5 71 92 water run scoreboard players set @s p4d_local_ok 0
execute if block 15 71 92 water run scoreboard players set @s p4d_local_ok 0
execute if block 10 71 92 lava run scoreboard players set @s p4d_local_ok 0
execute if block 5 71 88 lava run scoreboard players set @s p4d_local_ok 0
execute if block 15 71 88 lava run scoreboard players set @s p4d_local_ok 0
execute if block 5 71 96 lava run scoreboard players set @s p4d_local_ok 0
execute if block 15 71 96 lava run scoreboard players set @s p4d_local_ok 0
execute if block 10 71 88 lava run scoreboard players set @s p4d_local_ok 0
execute if block 10 71 96 lava run scoreboard players set @s p4d_local_ok 0
execute if block 5 71 92 lava run scoreboard players set @s p4d_local_ok 0
execute if block 15 71 92 lava run scoreboard players set @s p4d_local_ok 0

# Volume livre amostrado nos pes e no topo; qualquer bloco impede a montagem.
execute unless block 10 72 92 air run scoreboard players set @s p4d_local_ok 0
execute unless block 5 72 85 air run scoreboard players set @s p4d_local_ok 0
execute unless block 15 72 85 air run scoreboard players set @s p4d_local_ok 0
execute unless block 5 72 96 air run scoreboard players set @s p4d_local_ok 0
execute unless block 15 72 96 air run scoreboard players set @s p4d_local_ok 0
execute unless block 10 77 92 air run scoreboard players set @s p4d_local_ok 0
execute unless block 5 77 85 air run scoreboard players set @s p4d_local_ok 0
execute unless block 15 77 85 air run scoreboard players set @s p4d_local_ok 0
execute unless block 5 77 96 air run scoreboard players set @s p4d_local_ok 0
execute unless block 15 77 96 air run scoreboard players set @s p4d_local_ok 0

execute if score @s p4d_local_ok matches 1 run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] APROVADO por amostragem em 10 72 92. Montagem absoluta liberada."}]}
execute if score @s p4d_local_ok matches 0 run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck][BLOQUEADO] Ha agua/lava, falta de apoio ou colisao em uma amostra. Nada sera construido."}]}
execute if score @s p4d_local_ok matches 0 run function portal_4d/diagnosticar_precheck_local_10_72_92
