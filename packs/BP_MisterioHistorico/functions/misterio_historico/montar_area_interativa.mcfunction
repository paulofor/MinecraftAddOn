# Sprint complementar - terraplana e monta uma arena simples de interacoes no mundo ao redor do jogador
# Use em modo operador/criativo: /function misterio_historico/montar_area_interativa
# Cuidado: corta/limpa um volume aproximado de 17x10x17 ao redor do jogador.
execute at @s run fill ~-8 ~-3 ~-8 ~8 ~-1 ~8 minecraft:smooth_stone
execute at @s run fill ~-8 ~ ~-8 ~8 ~6 ~8 minecraft:air

# Acampamento inicial e manutencao
execute at @s run setblock ~ ~ ~-5 minecraft:lectern
execute at @s run setblock ~2 ~ ~-5 minecraft:lodestone
execute at @s run setblock ~-2 ~ ~-5 minecraft:grindstone

# Trilha de pistas nas ruinas
execute at @s run setblock ~-6 ~ ~-2 minecraft:barrel
execute at @s run setblock ~-4 ~ ~-2 minecraft:cauldron
execute at @s run setblock ~-2 ~ ~-2 minecraft:bell
execute at @s run setblock ~ ~ ~-2 minecraft:chiseled_bookshelf
execute at @s run setblock ~2 ~ ~-2 minecraft:lever
execute at @s run setblock ~4 ~ ~-2 minecraft:stonecutter
execute at @s run setblock ~6 ~ ~-2 minecraft:composter
execute at @s run setblock ~-2 ~ ~1 minecraft:chest
execute at @s run setblock ~2 ~ ~1 minecraft:bookshelf

# Sala das tres versoes e validacao final
execute at @s run setblock ~-3 ~ ~5 minecraft:emerald_block
execute at @s run setblock ~ ~ ~5 minecraft:lapis_block
execute at @s run setblock ~3 ~ ~5 minecraft:redstone_block
execute at @s run setblock ~ ~ ~7 minecraft:diamond_block

# Marcadores visuais simples
execute at @s run setblock ~ ~1 ~-5 minecraft:sea_lantern
execute at @s run setblock ~2 ~1 ~-5 minecraft:sea_lantern
execute at @s run setblock ~-2 ~1 ~-5 minecraft:sea_lantern
execute at @s run setblock ~ ~1 ~7 minecraft:sea_lantern

title @s title §6Área interativa criada
title @s subtitle §fClique nos blocos para jogar sem comandos de chat
tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Área interativa montada ao seu redor. Comece clicando no lectern; investigue as pistas; use o lodestone para diagnóstico; escolha uma hipótese nos blocos verde/azul/vermelho; finalize no diamond_block."}]}
