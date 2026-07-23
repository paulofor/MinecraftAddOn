# Construção interna pequena do protótipo, executada na posição do jogador ou da âncora PEG_Ancora_Prototipo.
# Area afetada: X/Z ~= -12..+12; Y ~= -1..+6. Não usar diretamente via MCP; usar montar_base_chao ou montar_base_ancora.
tellraw @a[r=50] {"rawtext":[{"text":"[Piramide][Prototipo] Montando prototipo pequeno ancorado neste ponto. Nao e a piramide gigante."}]}
fill ~-12 ~-1 ~-12 ~12 ~-1 ~12 minecraft:smooth_sandstone
fill ~-12 ~-1 ~-12 ~12 ~-1 ~12 minecraft:sandstone outline
fill ~-10 ~0 ~-10 ~10 ~0 ~10 minecraft:sandstone
fill ~-8 ~1 ~-8 ~8 ~1 ~8 minecraft:sandstone
fill ~-6 ~2 ~-6 ~6 ~2 ~6 minecraft:sandstone
fill ~-4 ~3 ~-4 ~4 ~3 ~4 minecraft:sandstone
fill ~-2 ~4 ~-2 ~2 ~4 ~2 minecraft:chiseled_sandstone
setblock ~ ~5 ~ minecraft:gold_block
setblock ~ ~6 ~ minecraft:sea_lantern
fill ~-2 ~-1 ~-2 ~2 ~6 ~2 minecraft:air
fill ~-2 ~0 ~-12 ~2 ~3 ~-3 minecraft:air
setblock ~-3 ~0 ~-9 minecraft:torch
setblock ~3 ~0 ~-9 minecraft:torch
setblock ~-3 ~0 ~-4 minecraft:torch
setblock ~3 ~0 ~-4 minecraft:torch
tellraw @a[r=50] {"rawtext":[{"text":"[Piramide][Prototipo] Pronto: verifique se a base encostou no chao. Se flutuar em qualquer lado, pare e nao aumente a escala."}]}
