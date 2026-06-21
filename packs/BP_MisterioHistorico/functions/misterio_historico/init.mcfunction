# Sprint 2 - inicializacao do prototipo jogavel Mistério Histórico
scoreboard objectives add mh_pistas dummy
scoreboard objectives add mh_conclusoes dummy
scoreboard objectives add mh_sessao dummy

scoreboard players add @s mh_sessao 1

title @s title §6Mistério Histórico
title @s subtitle §fInvestiguem por que Arandu foi abandonada
tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Sprint 2 inicializada. Objetivo: coletar pelo menos 6 das 9 pistas e defender uma conclusao com evidencias."}]}
tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Use /function misterio_historico/diagnostico para ver progresso e /function misterio_historico/reset para recomecar."}]}
