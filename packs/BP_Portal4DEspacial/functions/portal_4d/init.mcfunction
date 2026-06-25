# Sprint 3 - Portal para o Mundo 4D Espacial
# Orienta operadores sobre trigger jogavel, dimensao customizada e fallback seguro.
scoreboard objectives add p4d_sprint dummy
scoreboard players set @s p4d_sprint 3

title @s title §bPortal 4D Espacial
title @s subtitle §fSprint 3: trigger, teleporte e retorno
tellraw @s {"rawtext":[{"text":"[Portal4D] Interaja com a sea_lantern central da moldura do portal para entrar na experiencia 4D simulada."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] O script valida a moldura do portal antes de teleportar, evitando disparos por sea_lanterns comuns fora da estrutura."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Se portal4d:espaco_4d estiver disponivel, o destino preferencial sera a dimensao customizada; caso contrario, sera a arena fallback no Overworld em 4096 96 4096."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Na arena, interaja com o lodestone ou a sea_lantern de referencia para retornar ao ponto de origem salvo nesta sessao."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Execute /function portal_4d/montar_completa em uma area plana; confira o bedrock.log por mensagens [Portal4D]."}]}
