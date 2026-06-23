# Sprint 1 - Torre Invertida Abissal
# Inicializa marcadores de planejamento e orienta o operador antes da blocagem.
scoreboard objectives add tia_sprint dummy
scoreboard players set @s tia_sprint 1

title @s title §3Torre Invertida Abissal
title @s subtitle §fSprints 1-6: exploracao, nucleo e polimento
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Para criar tudo de uma vez, use /function torre_invertida_abissal/montar_completa em uma area livre. Para executar por etapas: blocagem_sprint1 -> superficie_sprint2 -> eixo_aneis_sprint3 -> laboratorios_sprint4 -> bioma_arquivo_nucleo_sprint5 -> polimento_sprint6."}]}
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] As funcoes usam coordenadas relativas ao executor para marcar cratera, silhueta, entrada monumental, POIs, eixo vertical, aneis exploraveis, rotas seguras, laboratorios educativos, jardim bioluminescente, arquivo abissal, nucleo final, elevador de retorno, polimento de seguranca e marcadores de expansao."}]}
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Nao executar perto do spawn, bases ou estruturas importantes."}]}
