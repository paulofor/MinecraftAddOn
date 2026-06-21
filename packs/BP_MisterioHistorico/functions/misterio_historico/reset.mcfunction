# Sprint 2 - reset operacional da investigacao
scoreboard players set @s mh_pistas 0
scoreboard players set @s mh_conclusoes 0

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

title @s title §eInvestigação reiniciada
title @s subtitle §fProcurem as pistas de Arandu novamente
tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Progresso, conclusoes e tags foram resetados."}]}
