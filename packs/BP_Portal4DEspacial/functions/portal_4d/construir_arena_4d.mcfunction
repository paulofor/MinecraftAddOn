# Sprint 2 - arena fallback segura do Portal 4D Espacial.
# Cria uma plataforma isolada no Overworld em coordenadas fixas para ambientes sem Beta APIs.

tellraw @s {"rawtext":[{"text":"[Portal4D] Construindo arena fallback segura em 4096 96 4096..."}]}

fill 4090 95 4090 4102 95 4102 smooth_stone
fill 4090 96 4090 4102 98 4102 air
fill 4090 95 4090 4102 95 4090 sea_lantern
fill 4090 95 4102 4102 95 4102 sea_lantern
fill 4090 95 4090 4090 95 4102 sea_lantern
fill 4102 95 4090 4102 95 4102 sea_lantern
setblock 4096 95 4096 amethyst_block
setblock 4096 96 4092 lectern
setblock 4092 96 4096 lodestone
setblock 4100 96 4096 sea_lantern
setblock 4096 96 4100 standing_sign

tellraw @s {"rawtext":[{"text":"[Portal4D] Arena fallback pronta. A Sprint 3 conectara o portal a este destino quando a dimensao customizada nao estiver disponivel."}]}
