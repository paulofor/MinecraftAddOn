# Sprint 2 - reset operacional da investigacao
scoreboard players set @a mh_pistas 0
scoreboard players set @a mh_conclusoes 0

tag @a remove mh_p1
tag @a remove mh_p2
tag @a remove mh_p3
tag @a remove mh_p4
tag @a remove mh_p5
tag @a remove mh_p6
tag @a remove mh_p7
tag @a remove mh_p8
tag @a remove mh_p9
tag @a remove mh_conclusao_a
tag @a remove mh_conclusao_b
tag @a remove mh_conclusao_c
tag @a remove mh_finalizado

title @a title §eInvestigação reiniciada
title @a subtitle §fProcurem as pistas de Arandu novamente
tellraw @a {"rawtext":[{"text":"[MisterioHistorico] Progresso, conclusoes e tags foram resetados."}]}
