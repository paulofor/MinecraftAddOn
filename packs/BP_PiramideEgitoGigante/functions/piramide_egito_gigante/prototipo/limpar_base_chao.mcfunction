# Limpa o protótipo pequeno criado ao redor da posição atual do jogador.
# Por que existe? A montagem relativa pode ter criado a base onde o jogador estava, não no marcador; esta limpeza remove apenas materiais do protótipo em volume pequeno.
# Area afetada: X/Z ~= -12..+12; Y ~= -1..+6 ao redor do jogador. Restaura camada inferior para areia quando possível.
tellraw @s {"rawtext":[{"text":"[Piramide][Prototipo][Limpeza] Limpando prototipo pequeno ao redor da sua posicao atual."}]}
fill ~-12 ~0 ~-12 ~12 ~6 ~12 minecraft:air replace minecraft:sandstone
fill ~-12 ~0 ~-12 ~12 ~6 ~12 minecraft:air replace minecraft:smooth_sandstone
fill ~-12 ~0 ~-12 ~12 ~6 ~12 minecraft:air replace minecraft:chiseled_sandstone
fill ~-12 ~0 ~-12 ~12 ~6 ~12 minecraft:air replace minecraft:gold_block
fill ~-12 ~0 ~-12 ~12 ~6 ~12 minecraft:air replace minecraft:sea_lantern
fill ~-12 ~0 ~-12 ~12 ~6 ~12 minecraft:air replace minecraft:torch
fill ~-12 ~-1 ~-12 ~12 ~-1 ~12 minecraft:sand replace minecraft:smooth_sandstone
fill ~-12 ~-1 ~-12 ~12 ~-1 ~12 minecraft:sand replace minecraft:sandstone
