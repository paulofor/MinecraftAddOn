# Sprint 6 - Portal para o Mundo 4D Espacial
# Orienta operadores sobre trigger jogavel, narrativa educativa, dimensao customizada e fallback seguro.
scoreboard objectives add p4d_sprint dummy
scoreboard players set @s p4d_sprint 6

title @s title §bPortal 4D Espacial
title @s subtitle §fSprint 6: narrativa, escolhas e recuperacao
tellraw @s {"rawtext":[{"text":"[Portal4D] Como entrar: caminhe pelo vao roxo/aberto do portal, como em um portal do Nether; nao precisa ficar exatamente no centro."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Se nada acontecer, caminhe pela base roxa entre as colunas ou use/interaja na sea_lantern do piso; o lectern serve para repetir a explicacao."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Escolhas: atravessar o portal entra; sea_lantern do piso tambem entra; lectern repete explicacao; lodestone/sea_lantern da arena volta; lapis/emerald acionam desafios."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] O script valida a moldura do portal antes de teleportar, evitando disparos por sea_lanterns comuns fora da estrutura."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] API Microsoft: o BP usa @minecraft/server 2.0.0 e tenta registerCustomDimension no system.beforeEvents.startup para criar portal4d:espaco_4d."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Se a Custom Dimension API nao estiver disponivel nesta versao, o destino cai para a arena fallback no Overworld em 4096 96 4096."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Local fixo: use /function portal_4d/ir_para_portal para montar/localizar o portal canonico e teleportar para a entrada 0 97 36."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] A experiencia explica 2D -> 3D -> 4D por analogia: projecoes, fatias, rotacao e coordenada W simulada. Confira o bedrock.log por [Portal4D]."}]}
