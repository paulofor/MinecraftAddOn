# Sprint 14 - Portal para a Nave Cronos
# Orienta operadores sobre a experiência temporal reconstruída do zero.
scoreboard objectives add p4d_sprint dummy
scoreboard objectives add p4d_local_ok dummy
scoreboard players set @s p4d_sprint 14

title @s title §dNave Cronos
title @s subtitle §fMundo 4D reconstruido do zero
tellraw @s {"rawtext":[{"text":"[Portal4D] Como entrar: caminhe pelo vao roxo/aberto do portal, como em um portal do Nether; nao precisa ficar exatamente no centro."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Se nada acontecer, caminhe pela base roxa entre as colunas ou use/interaja na sea_lantern do piso; o lectern serve para repetir a explicacao."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Missao nova: use COBRE=ORIGEM, OURO=AGORA e DIAMANTE=AMANHA para ver o mesmo lugar mudar no tempo."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] O script valida a moldura do portal antes de teleportar, evitando disparos por sea_lanterns comuns fora da estrutura."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] API Microsoft: o BP usa @minecraft/server 2.0.0 e tenta registerCustomDimension no system.beforeEvents.startup para criar portal4d:espaco_4d."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Destino unico: a entrada agora usa portal4d:espaco_4d pela Custom Dimension API; se a API nao registrar, o teleporte e bloqueado em vez de cair no fallback Overworld."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Local seco: use /function portal_4d/ir_para_portal para validar/montar no centro 10 72 92 e teleportar para a entrada 10 73 94."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Novo local seco escolhido: /function portal_4d/montar_portal_local_10_72_92 valida e monta no centro 10 72 92; entrada 10 73 94."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] A experiencia nao usa mais laboratorio, tesseracto, fatias W ou rotacao. X/Y/Z dizem ONDE; a quarta coordenada desta historia diz QUANDO."}]}
