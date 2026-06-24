# Sprint 1 - Academia Arcana Monumental
# Inicializa orientacoes para criar a blocagem do campus em mundo de teste.
scoreboard objectives add aam_sprint dummy
scoreboard players set @s aam_sprint 1

title @s title §5Academia Arcana Monumental
title @s subtitle §fSprint 1: mapa mestre, escala e rotas principais
tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Execute /function academia_arcana_monumental/blocagem_sprint1 em uma area livre para criar a planta do campus, torre central, biblioteca, quatro torres, jardins, anfiteatro e arquivo subterraneo."}]}
tellraw @s {"rawtext":[{"text":"[AcademiaArcana] A blocagem usa apenas blocos vanilla e nao cria texturas PNG. Nao executar perto do spawn, bases ou estruturas importantes."}]}
