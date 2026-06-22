# Remove a arena de ruínas criada ao redor do jogador por montar_area_interativa.
# Cuidado: limpa blocos no volume relativo de 19x10x19 ao redor da posição atual.
execute at @s run fill ~-9 ~-3 ~-9 ~9 ~6 ~9 minecraft:air

title @s title §cÁrea interativa removida
title @s subtitle §fO espaço ao redor foi limpo
tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Ruínas interativas removidas no volume ao redor da sua posição atual. Use montar_area_interativa em outro local se quiser recriar o desafio."}]}
