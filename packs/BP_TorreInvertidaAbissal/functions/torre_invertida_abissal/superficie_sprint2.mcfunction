# Sprint 2 - superficie e entrada monumental da Torre Invertida Abissal
# Origem recomendada: mesmo centro usado em blocagem_sprint1. Execute apenas em mundo de teste/area livre.
# A funcao detalha a superficie: bordas da cratera, ruinas, ponte principal, portal, pontos de interesse e rotas de retorno.

tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Iniciando Sprint 2: superficie, entrada monumental, POIs e retornos seguros."}]}

# Preparacao leve da superficie sem apagar o eixo/anel gerados na Sprint 1.
fill ~-72 ~0 ~-72 ~72 ~0 ~72 coarse_dirt
fill ~-64 ~0 ~-64 ~64 ~0 ~64 smooth_stone hollow
fill ~-56 ~0 ~-20 ~56 ~0 ~20 calcite
fill ~-20 ~0 ~-56 ~20 ~0 ~56 calcite
fill ~-46 ~0 ~-46 ~46 ~0 ~46 tuff hollow
fill ~-38 ~0 ~-38 ~38 ~0 ~38 air
fill ~-32 ~-1 ~-32 ~32 ~-1 ~32 cobbled_deepslate hollow
fill ~-25 ~-2 ~-25 ~25 ~-2 ~25 deepslate_tiles hollow

# Borda irregular da cratera e pontos de observacao.
fill ~-58 ~1 ~-18 ~-50 ~3 ~18 stone_bricks hollow
fill ~50 ~1 ~-18 ~58 ~3 ~18 stone_bricks hollow
fill ~-18 ~1 ~50 ~18 ~3 ~58 stone_bricks hollow
fill ~-18 ~1 ~-58 ~18 ~3 ~-50 stone_bricks hollow
setblock ~-58 ~4 ~0 cracked_stone_bricks
setblock ~58 ~4 ~0 cracked_stone_bricks
setblock ~0 ~4 ~58 cracked_stone_bricks
setblock ~0 ~4 ~-58 cracked_stone_bricks
setblock ~-44 ~1 ~-44 mossy_stone_bricks
setblock ~44 ~1 ~-44 mossy_stone_bricks
setblock ~-44 ~1 ~44 mossy_stone_bricks
setblock ~44 ~1 ~44 mossy_stone_bricks

# Ponte principal norte: caminho convidativo da borda ate o portal arquitetonico.
fill ~-7 ~1 ~-70 ~7 ~1 ~-9 deepslate_bricks
fill ~-6 ~2 ~-69 ~6 ~2 ~-10 smooth_stone_slab
fill ~-8 ~2 ~-70 ~-8 ~3 ~-9 deepslate_brick_wall
fill ~8 ~2 ~-70 ~8 ~3 ~-9 deepslate_brick_wall
fill ~-6 ~1 ~-62 ~6 ~1 ~-58 copper_block
fill ~-6 ~1 ~-42 ~6 ~1 ~-38 copper_block
fill ~-6 ~1 ~-22 ~6 ~1 ~-18 copper_block
setblock ~-5 ~3 ~-60 sea_lantern
setblock ~5 ~3 ~-60 sea_lantern
setblock ~-5 ~3 ~-40 sea_lantern
setblock ~5 ~3 ~-40 sea_lantern
setblock ~-5 ~3 ~-20 sea_lantern
setblock ~5 ~3 ~-20 sea_lantern

# Portal monumental de entrada com sinalizacao narrativa.
fill ~-13 ~1 ~-13 ~13 ~1 ~-9 polished_andesite
fill ~-11 ~2 ~-11 ~-8 ~13 ~-9 cut_copper
fill ~8 ~2 ~-11 ~11 ~13 ~-9 cut_copper
fill ~-11 ~12 ~-11 ~11 ~15 ~-9 exposed_copper
fill ~-7 ~2 ~-10 ~7 ~10 ~-10 air
fill ~-14 ~1 ~-14 ~14 ~3 ~-14 stone_bricks
fill ~-14 ~4 ~-14 ~-10 ~8 ~-14 stone_bricks
fill ~10 ~4 ~-14 ~14 ~8 ~-14 stone_bricks
setblock ~0 ~5 ~-14 lectern
setblock ~0 ~2 ~-8 sea_lantern
setblock ~-12 ~9 ~-10 chain
setblock ~12 ~9 ~-10 chain
setblock ~-12 ~4 ~-10 lantern
setblock ~12 ~4 ~-10 lantern

# Area segura inicial: patio de leitura, retorno e primeiras pistas.
fill ~-18 ~1 ~-84 ~18 ~1 ~-70 stone_bricks
fill ~-18 ~2 ~-84 ~18 ~2 ~-84 stone_brick_wall
fill ~-18 ~2 ~-70 ~18 ~2 ~-70 stone_brick_wall
fill ~-18 ~2 ~-84 ~-18 ~2 ~-70 stone_brick_wall
fill ~18 ~2 ~-84 ~18 ~2 ~-70 stone_brick_wall
setblock ~0 ~2 ~-77 campfire
setblock ~-6 ~2 ~-77 barrel
setblock ~6 ~2 ~-77 barrel
setblock ~0 ~2 ~-71 oak_sign ["facing_direction"=2]
setblock ~-16 ~2 ~-77 sea_lantern
setblock ~16 ~2 ~-77 sea_lantern

# Tres pontos de interesse antes da descida: mirante oeste, acampamento leste e arco rachado sul.
fill ~-72 ~1 ~-12 ~-58 ~1 ~12 polished_andesite
fill ~-72 ~2 ~-12 ~-72 ~3 ~12 stone_brick_wall
fill ~-58 ~2 ~-12 ~-58 ~3 ~12 stone_brick_wall
fill ~-72 ~2 ~-12 ~-58 ~2 ~-12 stone_brick_wall
fill ~-72 ~2 ~12 ~-58 ~2 ~12 stone_brick_wall
setblock ~-65 ~2 ~0 lectern
setblock ~-65 ~2 ~-10 oak_sign ["facing_direction"=2]

fill ~58 ~1 ~-12 ~72 ~1 ~12 oak_planks
setblock ~65 ~2 ~0 campfire
setblock ~61 ~2 ~-5 chest
setblock ~69 ~2 ~5 crafting_table
setblock ~65 ~2 ~-10 oak_sign ["facing_direction"=2]
fill ~58 ~2 ~-12 ~72 ~2 ~-12 oak_fence
fill ~58 ~2 ~12 ~72 ~2 ~12 oak_fence

fill ~-18 ~1 ~58 ~18 ~1 ~72 mossy_stone_bricks
fill ~-14 ~2 ~62 ~-10 ~12 ~66 cracked_stone_bricks
fill ~10 ~2 ~62 ~14 ~12 ~66 cracked_stone_bricks
fill ~-14 ~12 ~62 ~14 ~15 ~66 mossy_stone_bricks
fill ~-7 ~2 ~64 ~7 ~10 ~64 air
setblock ~0 ~3 ~61 glowstone
setblock ~0 ~2 ~70 oak_sign ["facing_direction"=3]

# Torres laterais e arcos gigantes para escala.
fill ~-42 ~1 ~-62 ~-34 ~24 ~-54 weathered_copper hollow
fill ~34 ~1 ~-62 ~42 ~24 ~-54 weathered_copper hollow
fill ~-39 ~2 ~-59 ~-37 ~22 ~-57 air
fill ~37 ~2 ~-59 ~39 ~22 ~-57 air
fill ~-46 ~24 ~-66 ~-30 ~27 ~-50 exposed_copper hollow
fill ~30 ~24 ~-66 ~46 ~27 ~-50 exposed_copper hollow
fill ~-34 ~18 ~-58 ~34 ~20 ~-56 cut_copper
fill ~-2 ~19 ~-56 ~2 ~23 ~-56 sea_lantern
setblock ~-38 ~28 ~-58 lightning_rod
setblock ~38 ~28 ~-58 lightning_rod
setblock ~-24 ~18 ~-56 chain
setblock ~24 ~18 ~-56 chain

# Rotas de retorno: escadas laterais e agua de recuperacao proxima a cratera.
fill ~-52 ~1 ~-36 ~-44 ~1 ~-28 smooth_stone
fill ~44 ~1 ~-36 ~52 ~1 ~-28 smooth_stone
fill ~-49 ~2 ~-34 ~-47 ~8 ~-32 ladder
fill ~47 ~2 ~-34 ~49 ~8 ~-32 ladder
fill ~-4 ~-16 ~-21 ~4 ~0 ~-17 water
fill ~-14 ~1 ~-18 ~-10 ~1 ~-14 stone_bricks
fill ~10 ~1 ~-18 ~14 ~1 ~-14 stone_bricks
setblock ~-12 ~2 ~-16 oak_sign ["facing_direction"=2]
setblock ~12 ~2 ~-16 oak_sign ["facing_direction"=2]

# Marcadores luminosos de orientacao para nao depender de comandos.
setblock ~0 ~2 ~-64 beacon
setblock ~-64 ~2 ~0 sea_lantern
setblock ~64 ~2 ~0 sea_lantern
setblock ~0 ~2 ~64 sea_lantern
setblock ~0 ~2 ~-12 sea_lantern

tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Sprint 2 concluida. Valide entrada visivel, 3 POIs e rotas de retorno pela ponte/escadas/agua."}]}
