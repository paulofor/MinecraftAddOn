# Sprint 1 - construcao vanilla do portal 4D.
# Executar em uma area livre. A estrutura e criada relativa ao executor.

tellraw @s {"rawtext":[{"text":"[Portal4D] Construindo portal vanilla da Sprint 1..."}]}

fill ~-5 ~-1 ~-4 ~5 ~-1 ~4 smooth_stone
fill ~-4 ~ ~-3 ~4 ~ ~3 air
fill ~-4 ~ ~-3 ~4 ~ ~3 polished_deepslate
fill ~-2 ~ ~-1 ~2 ~ ~1 amethyst_block
setblock ~ ~ ~ sea_lantern

# Moldura principal do portal.
fill ~-3 ~1 ~ ~-3 ~5 ~ crying_obsidian
fill ~3 ~1 ~ ~3 ~5 ~ crying_obsidian
fill ~-3 ~5 ~ ~3 ~5 ~ crying_obsidian
fill ~-2 ~1 ~ ~2 ~4 ~ air

# Indicadores visuais de projecao/fatias 4D simuladas.
setblock ~-5 ~1 ~-3 lectern
setblock ~5 ~1 ~-3 lectern
setblock ~-5 ~1 ~3 lectern
setblock ~5 ~1 ~3 lectern
fill ~-4 ~1 ~-4 ~4 ~1 ~-4 blue_stained_glass
fill ~-4 ~2 ~-5 ~4 ~2 ~-5 cyan_stained_glass
fill ~-4 ~3 ~-6 ~4 ~3 ~-6 light_blue_stained_glass
fill ~-4 ~4 ~-7 ~4 ~4 ~-7 white_stained_glass

# Sinalizacao e seguranca.
fill ~-4 ~1 ~4 ~4 ~1 ~4 sea_lantern
fill ~-5 ~1 ~-4 ~5 ~1 ~-4 soul_lantern
setblock ~-1 ~1 ~2 standing_sign
setblock ~1 ~1 ~2 standing_sign

tellraw @s {"rawtext":[{"text":"[Portal4D] Portal construido. Para entrar, caminhe pelo vao roxo/aberto como em um portal do Nether."}]}
tellraw @s {"rawtext":[{"text":"[Portal4D] Dica: se nada acontecer, pare no centro do vao por um instante ou use/interaja na sea_lantern do piso; o lectern apenas repete a explicacao."}]}
