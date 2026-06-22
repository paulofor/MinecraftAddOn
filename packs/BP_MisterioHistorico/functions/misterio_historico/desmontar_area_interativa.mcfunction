# Remove a arena simples criada ao redor do jogador por montar_area_interativa.
# Cuidado: limpa blocos no volume relativo de 17x10x17 ao redor da posição atual.
execute at @s run fill ~-8 ~-3 ~-8 ~8 ~6 ~8 minecraft:air

title @s title §cÁrea interativa removida
title @s subtitle §fO espaço ao redor foi limpo
tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Arena interativa removida no volume ao redor da sua posição atual. Use montar_area_interativa em outro local se quiser recriar o desafio."}]}
