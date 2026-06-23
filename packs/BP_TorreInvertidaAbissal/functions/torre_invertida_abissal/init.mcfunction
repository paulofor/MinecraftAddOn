# Sprint 1 - Torre Invertida Abissal
# Inicializa marcadores de planejamento e orienta o operador antes da blocagem.
scoreboard objectives add tia_sprint dummy
scoreboard players set @s tia_sprint 1

title @s title §3Torre Invertida Abissal
title @s subtitle §fSprints 1-2: blocagem e entrada
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Use /function torre_invertida_abissal/blocagem_sprint1 e depois /function torre_invertida_abissal/superficie_sprint2 em um mundo de teste e em area livre."}]}
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] As funcoes usam coordenadas relativas ao executor para marcar cratera, silhueta, entrada monumental, POIs e rota ate o primeiro anel."}]}
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Nao executar perto do spawn, bases ou estruturas importantes."}]}
