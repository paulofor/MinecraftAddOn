# Nova sessao por jogador - prepara scoreboards e limpa o progresso individual
scoreboard objectives add mh_pistas dummy
scoreboard objectives add mh_conclusoes dummy
scoreboard objectives add mh_sessao dummy

scoreboard players set @s mh_pistas 0
scoreboard players set @s mh_conclusoes 0
scoreboard players add @s mh_sessao 1

tag @s remove mh_p1
tag @s remove mh_p2
tag @s remove mh_p3
tag @s remove mh_p4
tag @s remove mh_p5
tag @s remove mh_p6
tag @s remove mh_p7
tag @s remove mh_p8
tag @s remove mh_p9
tag @s remove mh_conclusao_a
tag @s remove mh_conclusao_b
tag @s remove mh_conclusao_c
tag @s remove mh_finalizado

title @s title §6Mistério Histórico
title @s subtitle §fNova investigação iniciada: descubra por que Arandu foi abandonada
tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Nova sessão iniciada para você. A arena permanece no mundo; seu progresso individual foi zerado. Colete pelo menos 6 das 9 pistas e defenda uma hipótese com evidências."}]}
