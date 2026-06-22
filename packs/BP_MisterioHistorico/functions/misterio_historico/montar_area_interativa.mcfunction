# Sprint complementar - terraplana e monta uma arena de ruinas interativas ao redor do jogador
# Use em modo operador/criativo: /function misterio_historico/montar_area_interativa
# Cuidado: corta/limpa um volume aproximado de 19x10x19 ao redor do jogador.
execute at @s run fill ~-9 ~-3 ~-9 ~9 ~-1 ~9 minecraft:smooth_stone
execute at @s run fill ~-9 ~ ~-9 ~9 ~6 ~9 minecraft:air

# Piso irregular de ruinas: caminho principal, escombros e pontos quebrados
execute at @s run fill ~-8 ~-1 ~-1 ~8 ~-1 ~1 minecraft:cobblestone
execute at @s run fill ~-1 ~-1 ~-8 ~1 ~-1 ~8 minecraft:cobblestone
execute at @s run setblock ~-7 ~-1 ~-4 minecraft:gravel
execute at @s run setblock ~-5 ~-1 ~-1 minecraft:gravel
execute at @s run setblock ~-3 ~-1 ~2 minecraft:gravel
execute at @s run setblock ~4 ~-1 ~-3 minecraft:gravel
execute at @s run setblock ~6 ~-1 ~2 minecraft:gravel
execute at @s run setblock ~1 ~-1 ~6 minecraft:gravel
execute at @s run setblock ~-6 ~-1 ~5 minecraft:cobblestone
execute at @s run setblock ~7 ~-1 ~-6 minecraft:cobblestone

# Paredes quebradas da antiga praca
execute at @s run fill ~-8 ~ ~-8 ~-8 ~2 ~-4 minecraft:cobblestone
execute at @s run fill ~-8 ~ ~4 ~-8 ~2 ~8 minecraft:cobblestone
execute at @s run fill ~8 ~ ~-8 ~8 ~2 ~-4 minecraft:cobblestone
execute at @s run fill ~8 ~ ~4 ~8 ~2 ~8 minecraft:cobblestone
execute at @s run fill ~-5 ~ ~8 ~5 ~1 ~8 minecraft:cobblestone
execute at @s run setblock ~-8 ~2 ~-6 minecraft:air
execute at @s run setblock ~8 ~2 ~6 minecraft:air
execute at @s run setblock ~-2 ~1 ~8 minecraft:air
execute at @s run setblock ~3 ~1 ~8 minecraft:air

# Colunas e marco central da cidade abandonada
execute at @s run fill ~-6 ~ ~-6 ~-6 ~3 ~-6 minecraft:cobblestone
execute at @s run fill ~6 ~ ~-6 ~6 ~2 ~-6 minecraft:cobblestone
execute at @s run fill ~-6 ~ ~6 ~-6 ~2 ~6 minecraft:cobblestone
execute at @s run fill ~6 ~ ~6 ~6 ~3 ~6 minecraft:cobblestone
execute at @s run fill ~-1 ~-1 ~-1 ~1 ~-1 ~1 minecraft:cobblestone

# Cisternas secas e canal bloqueado perto das pistas P2 e P6
execute at @s run fill ~-7 ~ ~2 ~-4 ~ ~5 minecraft:cobblestone
execute at @s run fill ~-6 ~ ~3 ~-5 ~ ~4 minecraft:air
execute at @s run setblock ~-6 ~-1 ~3 minecraft:water
execute at @s run setblock ~-5 ~-1 ~4 minecraft:water
execute at @s run fill ~2 ~-1 ~-4 ~7 ~-1 ~-4 minecraft:cobblestone
execute at @s run fill ~2 ~ ~-4 ~7 ~ ~-4 minecraft:gravel
execute at @s run setblock ~5 ~ ~-4 minecraft:cobblestone
execute at @s run setblock ~6 ~ ~-4 minecraft:cobblestone

# Arquivo/templo em ruinas para fontes escritas
execute at @s run fill ~-3 ~ ~2 ~3 ~ ~2 minecraft:cobblestone
execute at @s run fill ~-3 ~ ~4 ~3 ~ ~4 minecraft:cobblestone
execute at @s run setblock ~-3 ~1 ~2 minecraft:cobblestone
execute at @s run setblock ~3 ~1 ~2 minecraft:cobblestone
execute at @s run setblock ~-3 ~1 ~4 minecraft:cobblestone
execute at @s run setblock ~3 ~1 ~4 minecraft:cobblestone

# Acampamento inicial e manutencao
execute at @s run setblock ~ ~ ~-5 minecraft:lectern
execute at @s run setblock ~2 ~ ~-5 minecraft:lodestone
execute at @s run setblock ~-2 ~ ~-5 minecraft:grindstone
execute at @s run setblock ~-1 ~ ~-6 minecraft:chest
execute at @s run setblock ~1 ~ ~-6 minecraft:barrel

# Trilha de pistas nas ruinas
execute at @s run setblock ~-6 ~ ~-2 minecraft:barrel
execute at @s run setblock ~-4 ~ ~-2 minecraft:cauldron
execute at @s run setblock ~-2 ~ ~-2 minecraft:bell
execute at @s run setblock ~ ~ ~-2 minecraft:chiseled_bookshelf
execute at @s run setblock ~2 ~ ~-2 minecraft:lever
execute at @s run setblock ~4 ~ ~-2 minecraft:stonecutter_block
execute at @s run setblock ~6 ~ ~-2 minecraft:composter
execute at @s run setblock ~-2 ~ ~1 minecraft:chest
execute at @s run setblock ~2 ~ ~1 minecraft:bookshelf

# Sala das tres versoes e validacao final
execute at @s run fill ~-4 ~-1 ~5 ~4 ~-1 ~7 minecraft:cobblestone
execute at @s run setblock ~-3 ~ ~5 minecraft:emerald_block
execute at @s run setblock ~ ~ ~5 minecraft:lapis_block
execute at @s run setblock ~3 ~ ~5 minecraft:redstone_block
execute at @s run setblock ~ ~ ~7 minecraft:diamond_block

# Iluminacao e marcadores visuais simples
execute at @s run setblock ~ ~1 ~-5 minecraft:sea_lantern
execute at @s run setblock ~2 ~1 ~-5 minecraft:sea_lantern
execute at @s run setblock ~-2 ~1 ~-5 minecraft:sea_lantern
execute at @s run setblock ~ ~1 ~7 minecraft:sea_lantern
execute at @s run setblock ~-6 ~1 ~-2 minecraft:sea_lantern
execute at @s run setblock ~6 ~1 ~-2 minecraft:sea_lantern

title @s title §6Ruínas interativas criadas
title @s subtitle §fExplore a praça, cisternas, arquivo e sala final
tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Ruínas interativas montadas ao seu redor. Comece no lectern do acampamento; investigue as pistas na praça, cisternas e arquivo; use o lodestone para diagnóstico; escolha uma hipótese nos blocos verde/azul/vermelho; finalize no diamond_block."}]}
