# Sprint 7 - Academia Arcana Monumental
# Inicializa orientacoes para criar o campus em mundo de teste.
scoreboard objectives add aam_sprint dummy
scoreboard players set @s aam_sprint 7

title @s title §5Academia Arcana Monumental
title @s subtitle §fSprint 7: Polimento e Validacao
tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Execute /function academia_arcana_monumental/montar_completa em uma area livre para criar as Sprints 1 a 7 da Academia Arcana Monumental."}]}
tellraw @s {"rawtext":[{"text":"[AcademiaArcana] A montagem usa apenas blocos vanilla e nao cria texturas PNG. Nao executar perto do spawn, bases ou estruturas importantes."}]}
