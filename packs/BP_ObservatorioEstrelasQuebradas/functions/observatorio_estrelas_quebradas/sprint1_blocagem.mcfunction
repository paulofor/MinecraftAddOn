# Sprint 1 - Conceito, localizacao e blocagem monumental.
tellraw @s {"rawtext":[{"text":"[Observatorio] Sprint 1: blocagem do plato, patio, torre, cupulas, cratera e subsolo."}]}
scoreboard players set @s oeq_sprint 1
fill ~-90 ~-1 ~-90 ~90 ~-1 ~90 smooth_stone
fill ~-70 ~0 ~-70 ~70 ~0 ~70 stone_bricks
fill ~-28 ~1 ~-28 ~28 ~1 ~28 polished_andesite
fill ~-35 ~1 ~-35 ~35 ~1 ~35 quartz_block outline
fill ~-6 ~1 ~-82 ~6 ~1 ~-35 smooth_stone
fill ~-9 ~2 ~-86 ~9 ~6 ~-80 stone_bricks hollow
fill ~-4 ~2 ~-80 ~4 ~5 ~-80 air
fill ~-14 ~1 ~-14 ~14 ~1 ~14 gold_block outline
fill ~-4 ~2 ~-4 ~4 ~2 ~4 amethyst_block
fill ~-12 ~2 ~42 ~12 ~70 ~66 stone_bricks hollow
fill ~-9 ~3 ~45 ~9 ~68 ~63 air
fill ~-48 ~1 ~-48 ~-20 ~18 ~-20 quartz_block hollow
fill ~20 ~1 ~-48 ~48 ~18 ~-20 copper_block hollow
fill ~-48 ~1 ~20 ~-20 ~18 ~48 deepslate_bricks hollow
fill ~20 ~1 ~20 ~48 ~18 ~48 calcite hollow
fill ~-65 ~0 ~55 ~-35 ~0 ~85 blackstone
fill ~-58 ~1 ~62 ~-42 ~3 ~78 obsidian
fill ~-24 ~-42 ~88 ~24 ~-4 ~132 deepslate_tiles hollow
fill ~-20 ~-41 ~92 ~20 ~-5 ~128 air
setblock ~0 ~2 ~0 beacon
setblock ~0 ~3 ~0 lectern
setblock ~0 ~2 ~56 lectern
playsound random.orb @s ~ ~ ~ 1 1
