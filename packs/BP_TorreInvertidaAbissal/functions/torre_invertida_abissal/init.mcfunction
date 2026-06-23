# Sprint 1 - Torre Invertida Abissal
# Inicializa marcadores de planejamento e orienta o operador antes da blocagem.
scoreboard objectives add tia_sprint dummy
scoreboard players set @s tia_sprint 1

title @s title §3Torre Invertida Abissal
title @s subtitle §fSprints 1-5: exploracao, laboratorios e nucleo
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Use /function torre_invertida_abissal/blocagem_sprint1, depois /function torre_invertida_abissal/superficie_sprint2, em seguida /function torre_invertida_abissal/eixo_aneis_sprint3, depois /function torre_invertida_abissal/laboratorios_sprint4 e por fim /function torre_invertida_abissal/bioma_arquivo_nucleo_sprint5 em um mundo de teste e em area livre."}]}
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] As funcoes usam coordenadas relativas ao executor para marcar cratera, silhueta, entrada monumental, POIs, eixo vertical, aneis exploraveis, rotas seguras, laboratorios educativos, jardim bioluminescente, arquivo abissal, nucleo final e elevador de retorno."}]}
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Nao executar perto do spawn, bases ou estruturas importantes."}]}
