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


# Sprint 5 - Ala 3: rotação 4D simulada.
# O lapis_block central é o controle interativo; o script alterna os dois layouts.
fill 4115 95 4091 4125 95 4101 smooth_quartz
fill 4115 96 4091 4125 98 4101 air
setblock 4120 96 4096 lapis_block
setblock 4120 97 4096 sea_lantern
setblock 4117 96 4093 purple_stained_glass
setblock 4118 96 4094 purple_stained_glass
setblock 4119 96 4095 purple_stained_glass
setblock 4121 96 4097 purple_stained_glass
setblock 4122 96 4098 purple_stained_glass
setblock 4123 96 4099 purple_stained_glass
setblock 4117 96 4099 purple_stained_glass
setblock 4123 96 4093 purple_stained_glass
setblock 4120 96 4091 standing_sign

# Sprint 5 - Ala 4: corredor de coordenada W simulada.
# O emerald_block marca o estado W atual; cada interação avança a fatia visual.
fill 4096 95 4120 4112 95 4120 polished_andesite
fill 4096 96 4120 4112 98 4120 air
setblock 4096 95 4120 amethyst_block
setblock 4096 96 4120 emerald_block
setblock 4096 96 4121 sea_lantern
setblock 4100 96 4121 redstone_lamp
setblock 4104 96 4121 redstone_lamp
setblock 4108 96 4121 redstone_lamp
setblock 4112 96 4121 redstone_lamp

tellraw @s {"rawtext":[{"text":"[Portal4D] Sprint 5 adicionada: interaja com lapis_block para rotacao 4D e emerald_block para avancar a coordenada W simulada."}]}


# Sprint 6 - guias educativos e escolhas sem UI modal.
setblock 4096 96 4092 lectern
setblock 4120 96 4092 lectern
setblock 4096 96 4118 lectern
tellraw @s {"rawtext":[{"text":"[Portal4D] Sprint 6: escolhas disponiveis — sea_lantern=Entrar, lectern=Repetir explicacao, lodestone/sea_lantern=Voltar."}]}
