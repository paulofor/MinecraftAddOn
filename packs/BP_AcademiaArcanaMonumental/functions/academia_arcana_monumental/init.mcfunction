# Sprint 3 - Academia Arcana Monumental
# Inicializa orientacoes para criar a blocagem do campus em mundo de teste.
scoreboard objectives add aam_sprint dummy
scoreboard players set @s aam_sprint 3

title @s title §5Academia Arcana Monumental
title @s subtitle §fSprint 3: Biblioteca Infinita e Arquivo de Conhecimento
tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Execute /function academia_arcana_monumental/montar_completa em uma area livre para criar a blocagem da Sprint 1, o detalhamento da Sprint 2 e a Biblioteca Infinita da Sprint 3."}]}
tellraw @s {"rawtext":[{"text":"[AcademiaArcana] A montagem usa apenas blocos vanilla e nao cria texturas PNG. Nao executar perto do spawn, bases ou estruturas importantes."}]}
