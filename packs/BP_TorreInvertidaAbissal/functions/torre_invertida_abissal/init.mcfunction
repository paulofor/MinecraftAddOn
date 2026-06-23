# Sprint 1 - Torre Invertida Abissal
# Inicializa marcadores de planejamento e orienta o operador antes da blocagem.
scoreboard objectives add tia_sprint dummy
scoreboard players set @s tia_sprint 1

title @s title §3Torre Invertida Abissal
title @s subtitle §fSprint 1: blocagem de escala
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Use /function torre_invertida_abissal/blocagem_sprint1 em um mundo de teste e em area livre."}]}
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] A funcao usa coordenadas relativas ao executor para marcar cratera, silhueta, eixo vertical e rota ate o primeiro anel."}]}
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Nao executar perto do spawn, bases ou estruturas importantes."}]}
