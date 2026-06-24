# Sprint 1 - blocagem conceitual em mundo de teste
# Origem recomendada: centro da cratera. Area aproximada: 121 x 121; altura: +60; profundidade visual: -48.
# Materiais temporarios por zona: calcite/smooth_stone (superficie), copper (torre), deepslate (subsolo), sea_lantern/blue_glass (orientacao).

tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Iniciando blocagem Sprint 1: cratera, torre, eixo e rota inicial."}]}

# Limpeza segura do volume principal da maquete.
fill ~-60 ~1 ~-60 ~60 ~72 ~60 air
fill ~-44 ~-48 ~-44 ~44 ~0 ~44 air

# Piso de teste e contorno quadrado de seguranca.
fill ~-64 ~-1 ~-64 ~64 ~-1 ~64 stone
fill ~-64 ~0 ~-64 ~64 ~0 ~-64 smooth_stone
fill ~-64 ~0 ~64 ~64 ~0 ~64 smooth_stone
fill ~-64 ~0 ~-64 ~-64 ~0 ~64 smooth_stone
fill ~64 ~0 ~-64 ~64 ~0 ~64 smooth_stone

# Cratera em aneis octogonais simplificados para leitura de longe.
fill ~-52 ~0 ~-16 ~52 ~0 ~16 calcite
fill ~-16 ~0 ~-52 ~16 ~0 ~52 calcite
fill ~-42 ~0 ~-42 ~42 ~0 ~42 calcite hollow
fill ~-34 ~0 ~-34 ~34 ~0 ~34 air
fill ~-28 ~-1 ~-28 ~28 ~-1 ~28 cobbled_deepslate hollow
fill ~-20 ~-2 ~-20 ~20 ~-2 ~20 deepslate_tiles hollow

# Eixo central e leitura vertical.
fill ~-4 ~0 ~-4 ~4 ~60 ~4 copper_block hollow
fill ~-2 ~1 ~-2 ~2 ~60 ~2 air
fill ~ ~1 ~ ~ ~60 ~ sea_lantern
fill ~-1 ~2 ~-1 ~1 ~58 ~1 blue_stained_glass hollow

# Coroa partida acima da superficie.
fill ~-10 ~48 ~-10 ~10 ~52 ~10 cut_copper hollow
fill ~-14 ~56 ~-2 ~14 ~59 ~2 exposed_copper
fill ~-2 ~56 ~-14 ~2 ~59 ~14 exposed_copper
fill ~8 ~52 ~8 ~18 ~66 ~18 weathered_copper hollow
fill ~11 ~53 ~11 ~15 ~66 ~15 air

# Primeiro anel subterraneo e plataformas de leitura do caminho critico.
fill ~-30 ~-18 ~-30 ~30 ~-16 ~30 polished_deepslate hollow
fill ~-22 ~-17 ~-22 ~22 ~-15 ~22 air
fill ~-8 ~-18 ~-34 ~8 ~-16 ~-22 polished_deepslate
fill ~-2 ~-17 ~-60 ~2 ~-16 ~-34 smooth_stone
fill ~-2 ~1 ~-60 ~2 ~1 ~-34 smooth_stone
fill ~-1 ~2 ~-58 ~1 ~3 ~-36 sea_lantern

# Rota inicial da borda norte ate o eixo e descida visual ao primeiro anel.
fill ~-4 ~1 ~-64 ~4 ~1 ~-8 oak_planks
fill ~-4 ~2 ~-64 ~-4 ~3 ~-8 oak_fence
fill ~4 ~2 ~-64 ~4 ~3 ~-8 oak_fence
fill ~-3 ~-1 ~-8 ~3 ~1 ~-8 ladder
fill ~-3 ~-17 ~-22 ~3 ~-16 ~-8 water

# Marcadores de zonas futuras.
setblock ~-48 ~1 ~-48 emerald_block
setblock ~48 ~1 ~-48 gold_block
setblock ~-48 ~1 ~48 lapis_block
setblock ~48 ~1 ~48 redstone_block
setblock ~0 ~-18 ~-30 sea_lantern
setblock ~0 ~-18 ~30 amethyst_block

tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Blocagem concluida. Valide silhueta a distancia, rota pela ponte norte e acesso visual ao primeiro anel."}]}
