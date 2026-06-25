# Sprint 8 - polimento, ritmo de oficina e pontos de expansão do Portal 4D.
# Usa apenas blocos vanilla; não cria nem referencia PNG customizado.

tellraw @s {"rawtext":[{"text":"[Portal4D] Sprint 8: aplicando polimento visual, roteiro de 10-15 min e pontos de expansão."}]}

# Luz e legibilidade da plataforma central.
fill 4089 95 4089 4103 95 4103 smooth_stone
fill 4089 96 4089 4103 98 4103 air
fill 4089 95 4089 4103 95 4089 sea_lantern
fill 4089 95 4103 4103 95 4103 sea_lantern
fill 4089 95 4089 4089 95 4103 sea_lantern
fill 4103 95 4089 4103 95 4103 sea_lantern
setblock 4096 95 4096 amethyst_block
setblock 4096 96 4092 lectern
setblock 4092 96 4096 lodestone
setblock 4100 96 4096 sea_lantern

# Marcadores de expansão: matrizes, projeções, topologia e grafos.
fill 4068 95 4094 4076 95 4118 deepslate_tiles
fill 4068 96 4094 4076 98 4118 air
setblock 4072 96 4094 lectern
setblock 4072 96 4096 gold_block
setblock 4073 96 4096 sea_lantern
setblock 4072 96 4102 diamond_block
setblock 4073 96 4102 sea_lantern
setblock 4072 96 4108 copper_block
setblock 4073 96 4108 sea_lantern
setblock 4072 96 4114 emerald_block
setblock 4073 96 4114 sea_lantern
setblock 4076 96 4118 sea_lantern

# Reforço visual das alas de rotação e W para facilitar playtest.
setblock 4120 96 4092 lectern
setblock 4120 97 4096 sea_lantern
setblock 4096 96 4118 lectern
setblock 4096 96 4121 sea_lantern
setblock 4100 96 4121 sea_lantern
setblock 4104 96 4121 sea_lantern
setblock 4108 96 4121 sea_lantern
setblock 4112 96 4121 sea_lantern

tellraw @s {"rawtext":[{"text":"[Portal4D] Sprint 8 pronta: playtest sugerido com perfis iniciante, intermediario e avancado."}]}
