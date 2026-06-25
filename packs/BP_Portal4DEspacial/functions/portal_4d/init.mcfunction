# Sprint 1 - Portal para o Mundo 4D Espacial
# Orienta operadores antes da construcao do portal vanilla.
scoreboard objectives add p4d_sprint dummy
scoreboard players set @s p4d_sprint 1

title @s title §bPortal 4D Espacial
title @s subtitle §fSprint 1: pesquisa, arquitetura e blocagem
tellraw @s {"rawtext":[{"text":"[Portal4D] Execute /function portal_4d/construir_portal em uma area plana e segura para criar o portal fisico vanilla."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] A Sprint 1 nao teleporta jogadores. O bloco-chave planejado para a interacao futura e a sea_lantern no centro do portal."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Use Custom Dimension API somente quando Beta APIs estiverem habilitadas; caso contrario, seguir com arena fallback no Overworld."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Nenhuma textura PNG customizada e necessaria nesta sprint."}]}
