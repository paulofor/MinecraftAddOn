# Sprint 6 - Portal para o Mundo 4D Espacial
# Orienta operadores sobre trigger jogavel, narrativa educativa, dimensao customizada e fallback seguro.
scoreboard objectives add p4d_sprint dummy
scoreboard players set @s p4d_sprint 6

title @s title §bPortal 4D Espacial
title @s subtitle §fSprint 6: narrativa, escolhas e recuperacao
tellraw @s {"rawtext":[{"text":"[Portal4D] Escolhas: sea_lantern central entra; lectern repete explicacao; lodestone/sea_lantern da arena volta; lapis/emerald acionam desafios."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] O script valida a moldura do portal antes de teleportar, evitando disparos por sea_lanterns comuns fora da estrutura."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Se portal4d:espaco_4d estiver disponivel, o destino preferencial sera a dimensao customizada; caso contrario, sera a arena fallback no Overworld em 4096 96 4096."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] A experiencia explica 2D -> 3D -> 4D por analogia: projecoes, fatias, rotacao e coordenada W simulada."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Recuperacao: /function portal_4d/recuperar leva o operador para a arena fallback; confira o bedrock.log por mensagens [Portal4D]."}]}
