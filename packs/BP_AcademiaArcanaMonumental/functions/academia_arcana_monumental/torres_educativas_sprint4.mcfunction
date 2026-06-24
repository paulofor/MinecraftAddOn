# Sprint 4 - Torres educativas: Logica, Algoritmos e Elementos da Academia Arcana Monumental
# Execute depois de academia_arcana_monumental/biblioteca_sprint3, a partir do mesmo centro do Patio das Casas Arcanas.
# Sem PNG customizado: desafios, feedback e orientacao usam blocos vanilla, portas, placas, luzes, sons e mensagens.

tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Iniciando Sprint 4: torres educativas com desafios curtos de Logica, Algoritmos e Elementos."}]}
scoreboard players set @s aam_sprint 4

# Torre da Logica - noroeste/azul: padroes, verdadeiro/falso, sequencia e condicao.
fill ~-100 ~1 ~-76 ~-72 ~60 ~-48 blue_concrete hollow
fill ~-96 ~2 ~-72 ~-76 ~58 ~-52 air
fill ~-100 ~10 ~-76 ~-72 ~10 ~-48 smooth_stone
fill ~-100 ~24 ~-76 ~-72 ~24 ~-48 smooth_stone
fill ~-100 ~38 ~-76 ~-72 ~38 ~-48 smooth_stone
fill ~-98 ~1 ~-46 ~-74 ~4 ~-40 lapis_block
fill ~-91 ~2 ~-46 ~-81 ~5 ~-46 air
setblock ~-86 ~5 ~-46 sea_lantern
setblock ~-86 ~2 ~-43 lectern
setblock ~-86 ~2 ~-50 wooden_door
fill ~-95 ~2 ~-70 ~-77 ~2 ~-64 white_concrete
setblock ~-93 ~3 ~-67 blue_glazed_terracotta
setblock ~-89 ~3 ~-67 blue_glazed_terracotta
setblock ~-85 ~3 ~-67 white_concrete
setblock ~-81 ~3 ~-67 blue_glazed_terracotta
setblock ~-77 ~3 ~-67 white_concrete
setblock ~-85 ~2 ~-62 lectern
setblock ~-81 ~2 ~-62 sea_lantern
setblock ~-77 ~2 ~-62 redstone_lamp
fill ~-95 ~12 ~-70 ~-77 ~12 ~-64 black_concrete
setblock ~-93 ~13 ~-67 redstone_block
setblock ~-89 ~13 ~-67 emerald_block
setblock ~-85 ~13 ~-67 redstone_block
setblock ~-81 ~13 ~-67 emerald_block
setblock ~-77 ~13 ~-67 redstone_block
setblock ~-85 ~13 ~-62 lectern
setblock ~-81 ~13 ~-62 iron_door
setblock ~-81 ~13 ~-63 stone_pressure_plate
fill ~-94 ~26 ~-70 ~-78 ~26 ~-64 quartz_block
setblock ~-94 ~27 ~-68 redstone_lamp
setblock ~-90 ~27 ~-68 redstone_lamp
setblock ~-86 ~27 ~-68 sea_lantern
setblock ~-82 ~27 ~-68 redstone_lamp
setblock ~-78 ~27 ~-68 sea_lantern
setblock ~-86 ~27 ~-62 lectern
setblock ~-86 ~39 ~-62 bell
fill ~-98 ~1 ~-51 ~-98 ~42 ~-49 ladder

# Torre dos Algoritmos - nordeste/laranja: passos ordenados, caminho eficiente e repeticao.
fill ~72 ~1 ~-76 ~100 ~60 ~-48 orange_concrete hollow
fill ~76 ~2 ~-72 ~96 ~58 ~-52 air
fill ~72 ~10 ~-76 ~100 ~10 ~-48 smooth_sandstone
fill ~72 ~24 ~-76 ~100 ~24 ~-48 smooth_sandstone
fill ~72 ~38 ~-76 ~100 ~38 ~-48 smooth_sandstone
fill ~74 ~1 ~-46 ~98 ~4 ~-40 cut_copper
fill ~81 ~2 ~-46 ~91 ~5 ~-46 air
setblock ~86 ~5 ~-46 sea_lantern
setblock ~86 ~2 ~-43 lectern
fill ~78 ~2 ~-70 ~94 ~2 ~-54 light_gray_concrete
setblock ~80 ~3 ~-68 gold_block
setblock ~84 ~3 ~-68 gold_block
setblock ~88 ~3 ~-68 gold_block
setblock ~92 ~3 ~-68 emerald_block
setblock ~92 ~2 ~-64 lectern
setblock ~92 ~3 ~-62 sea_lantern
fill ~78 ~12 ~-70 ~94 ~12 ~-54 smooth_stone
fill ~80 ~13 ~-68 ~80 ~13 ~-56 blue_carpet
fill ~84 ~13 ~-68 ~84 ~13 ~-60 blue_carpet
fill ~88 ~13 ~-68 ~88 ~13 ~-64 blue_carpet
setblock ~92 ~13 ~-56 diamond_block
setblock ~80 ~13 ~-54 redstone_lamp
setblock ~84 ~13 ~-58 redstone_lamp
setblock ~88 ~13 ~-62 sea_lantern
setblock ~92 ~13 ~-60 lectern
fill ~78 ~26 ~-70 ~94 ~26 ~-54 yellow_concrete
setblock ~80 ~27 ~-68 noteblock
setblock ~84 ~27 ~-68 noteblock
setblock ~88 ~27 ~-68 noteblock
setblock ~92 ~27 ~-68 noteblock
setblock ~80 ~27 ~-64 redstone_lamp
setblock ~84 ~27 ~-64 redstone_lamp
setblock ~88 ~27 ~-64 redstone_lamp
setblock ~92 ~27 ~-64 sea_lantern
setblock ~86 ~27 ~-60 lectern
setblock ~86 ~39 ~-62 bell
fill ~98 ~1 ~-51 ~98 ~42 ~-49 ladder

# Torre dos Elementos - sudoeste/verde: causa/consequencia, experimento visual seguro e comparacao de estados.
fill ~-100 ~1 ~48 ~-72 ~60 ~76 green_concrete hollow
fill ~-96 ~2 ~52 ~-76 ~58 ~72 air
fill ~-100 ~10 ~48 ~-72 ~10 ~76 mossy_stone_bricks
fill ~-100 ~24 ~48 ~-72 ~24 ~76 mossy_stone_bricks
fill ~-100 ~38 ~48 ~-72 ~38 ~76 mossy_stone_bricks
fill ~-98 ~1 ~40 ~-74 ~4 ~46 emerald_block
fill ~-91 ~2 ~46 ~-81 ~5 ~46 air
setblock ~-86 ~5 ~46 sea_lantern
setblock ~-86 ~2 ~43 lectern
fill ~-95 ~2 ~54 ~-77 ~2 ~70 prismarine
fill ~-94 ~3 ~55 ~-90 ~3 ~59 water
fill ~-82 ~3 ~55 ~-78 ~3 ~59 magma
setblock ~-86 ~3 ~62 lectern
setblock ~-86 ~4 ~66 sea_lantern
fill ~-95 ~12 ~54 ~-77 ~12 ~70 hardened_clay
setblock ~-93 ~13 ~56 redstone_block
setblock ~-89 ~13 ~56 redstone_lamp
setblock ~-85 ~13 ~56 redstone_lamp
setblock ~-81 ~13 ~56 sea_lantern
setblock ~-85 ~13 ~62 lectern
fill ~-95 ~26 ~54 ~-77 ~26 ~70 calcite
setblock ~-93 ~27 ~58 ice
setblock ~-89 ~27 ~58 packed_ice
setblock ~-85 ~27 ~58 blue_ice
setblock ~-81 ~27 ~58 water
setblock ~-87 ~27 ~64 lectern
setblock ~-83 ~27 ~64 bell
setblock ~-86 ~39 ~62 beacon
fill ~-98 ~1 ~73 ~-98 ~42 ~75 ladder

# Feedback e orientacao entre torres: circuito seguro de tentativa e erro no patio, sem dano permanente.
fill ~-10 ~1 ~-42 ~10 ~1 ~-38 blue_carpet
fill ~38 ~1 ~-10 ~42 ~1 ~10 orange_carpet
fill ~-42 ~1 ~10 ~-38 ~1 ~42 green_carpet
setblock ~-8 ~2 ~-40 redstone_lamp
setblock ~0 ~2 ~-40 sea_lantern
setblock ~8 ~2 ~-40 redstone_lamp
setblock ~40 ~2 ~-8 noteblock
setblock ~40 ~2 ~0 sea_lantern
setblock ~40 ~2 ~8 noteblock
setblock ~-40 ~2 ~14 water
setblock ~-40 ~2 ~26 sea_lantern
setblock ~-40 ~2 ~38 magma
setblock ~-12 ~1 ~-36 lectern
setblock ~36 ~1 ~-12 lectern
setblock ~-36 ~1 ~12 lectern

# Sala de sintese da Sprint 4 no patio: registra progresso e deixa gancho para Observatorio/Jardins/Anfiteatro.
fill ~-8 ~1 ~44 ~8 ~7 ~54 quartz_block hollow
fill ~-6 ~2 ~46 ~6 ~6 ~52 air
setblock ~0 ~2 ~45 lectern
setblock ~-4 ~2 ~50 lapis_block
setblock ~0 ~2 ~50 gold_block
setblock ~4 ~2 ~50 emerald_block
setblock ~0 ~7 ~49 sea_lantern
playsound random.levelup @s ~ ~ ~ 1 1

tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Sprint 4 concluida. Valide duas atividades por torre, leitura dos feedbacks por luz/som/porta e seguranca de tentativa e erro."}]}
