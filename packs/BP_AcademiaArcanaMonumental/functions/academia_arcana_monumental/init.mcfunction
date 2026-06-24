# Sprint 2 - Academia Arcana Monumental
# Inicializa orientacoes para criar a blocagem do campus em mundo de teste.
scoreboard objectives add aam_sprint dummy
scoreboard players set @s aam_sprint 2

title @s title §5Academia Arcana Monumental
title @s subtitle §fSprint 2: portão, muralhas, pátio e orientação visual
tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Execute /function academia_arcana_monumental/montar_completa em uma area livre para criar a blocagem da Sprint 1 e o detalhamento visual da Sprint 2."}]}
tellraw @s {"rawtext":[{"text":"[AcademiaArcana] A montagem usa apenas blocos vanilla e nao cria texturas PNG. Nao executar perto do spawn, bases ou estruturas importantes."}]}
