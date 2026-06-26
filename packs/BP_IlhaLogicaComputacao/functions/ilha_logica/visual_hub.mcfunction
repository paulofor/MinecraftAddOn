# Sprint 2/3 - melhoria visual: cria ilha-hub didatica ao redor do jogador
# Base principal da ilha (nucleo firme)
fill ~-14 ~-4 ~-14 ~14 ~-2 ~14 dirt
fill ~-12 ~-1 ~-12 ~12 ~-1 ~12 grass

# Saia submersa para ampliar a base inferior e reduzir aproximacao hostil pelo mar
fill ~-18 ~-6 ~-18 ~18 ~-5 ~18 stone
fill ~-20 ~-8 ~-20 ~20 ~-7 ~20 stone
fill ~-19 ~-6 ~-19 ~19 ~-6 ~19 dirt

# Faixa de praia ao redor para entrada nadando mais natural
fill ~-16 ~-2 ~-16 ~16 ~-2 ~16 dirt
fill ~-17 ~-1 ~-17 ~17 ~-1 ~17 sand
fill ~-18 ~-1 ~-18 ~18 ~-1 ~18 sand
fill ~-22 ~-2 ~-22 ~22 ~-2 ~22 sandstone
fill ~-21 ~-1 ~-21 ~21 ~-1 ~21 sand

# Praia ampliada (anel externo mais largo, com nivel seco acima do mar)
fill ~-26 ~-1 ~-26 ~26 ~0 ~-23 sand
fill ~-26 ~-1 ~23 ~26 ~0 ~26 sand
fill ~-26 ~-1 ~-22 ~-23 ~0 ~22 sand
fill ~23 ~-1 ~-22 ~26 ~0 ~22 sand
fill ~-24 ~0 ~-24 ~24 ~0 ~-22 sand
fill ~-24 ~0 ~22 ~24 ~0 ~24 sand
fill ~-24 ~0 ~-21 ~-22 ~0 ~21 sand
fill ~22 ~0 ~-21 ~24 ~0 ~21 sand

# Recorte dos cantos para reduzir simetria e deixar contorno organico
fill ~-14 ~-4 ~-14 ~-11 ~-1 ~-11 air
fill ~11 ~-4 ~-14 ~14 ~-1 ~-11 air
fill ~-14 ~-4 ~11 ~-11 ~-1 ~14 air
fill ~11 ~-4 ~11 ~14 ~-1 ~14 air
fill ~-14 ~-4 ~-2 ~-12 ~-1 ~3 air
fill ~12 ~-4 ~-3 ~14 ~-1 ~2 air
fill ~-3 ~-4 ~12 ~2 ~-1 ~14 air
fill ~-2 ~-4 ~-14 ~3 ~-1 ~-12 air

# Pequenas saliencias naturais
fill ~-15 ~-4 ~4 ~-14 ~-2 ~6 dirt
fill ~14 ~-4 ~-7 ~15 ~-2 ~-5 dirt
fill ~-6 ~-4 ~14 ~-4 ~-2 ~15 dirt
fill ~5 ~-4 ~-15 ~7 ~-2 ~-14 dirt

# Rampas suaves de acesso pela praia (N, S, L, O)
fill ~ ~-3 ~-13 ~ ~-1 ~-18 sand
fill ~ ~-3 ~13 ~ ~-1 ~18 sand
fill ~13 ~-3 ~ ~18 ~-1 ~ sand
fill ~-13 ~-3 ~ ~-18 ~-1 ~ sand

# Praca central e marco visual
fill ~-3 ~-1 ~-3 ~3 ~-1 ~3 oak_planks
setblock ~ ~0 ~ sea_lantern

# Gramados e canteiros para visual mais bonito
fill ~-10 ~-1 ~8 ~-6 ~-1 ~10 moss_block
fill ~6 ~-1 ~-10 ~10 ~-1 ~-6 moss_block
setblock ~-9 ~0 ~9 dandelion
setblock ~-8 ~0 ~9 poppy
setblock ~8 ~0 ~-9 blue_orchid
setblock ~9 ~0 ~-8 allium

# Laguinhos rasos
fill ~-7 ~-1 ~1 ~-5 ~-1 ~3 water
fill ~5 ~-1 ~-4 ~7 ~-1 ~-2 water

# Arvores um pouco mais cheias (tronco + copa ampliada)
fill ~-8 ~0 ~-8 ~-8 ~3 ~-8 oak_log
fill ~-9 ~4 ~-9 ~-7 ~5 ~-7 oak_leaves
fill ~-10 ~4 ~-8 ~-6 ~5 ~-8 oak_leaves
fill ~-8 ~4 ~-10 ~-8 ~5 ~-6 oak_leaves
setblock ~-8 ~6 ~-8 oak_leaves

fill ~8 ~0 ~7 ~8 ~3 ~7 oak_log
fill ~7 ~4 ~6 ~9 ~5 ~8 oak_leaves
fill ~6 ~4 ~7 ~10 ~5 ~7 oak_leaves
fill ~8 ~4 ~5 ~8 ~5 ~9 oak_leaves
setblock ~8 ~6 ~7 oak_leaves

# Totem/placa de madeira de boas-vindas (area da Ilha da Logica)
fill ~-2 ~0 ~-11 ~2 ~2 ~-11 stripped_oak_wood
setblock ~0 ~0 ~-10 standing_sign
setblock ~0 ~1 ~-10 lantern

# Iluminacao charmosa (pontos quentes na borda e no eixo central)
fill ~-6 ~0 ~0 ~-6 ~2 ~0 oak_log
fill ~6 ~0 ~0 ~6 ~2 ~0 oak_log
fill ~0 ~0 ~-6 ~0 ~2 ~-6 oak_log
fill ~0 ~0 ~6 ~0 ~2 ~6 oak_log
setblock ~-6 ~3 ~0 lantern
setblock ~6 ~3 ~0 lantern
setblock ~0 ~3 ~-6 lantern
setblock ~0 ~3 ~6 lantern
setblock ~-4 ~-1 ~0 sea_lantern
setblock ~4 ~-1 ~0 sea_lantern
setblock ~0 ~-1 ~-4 sea_lantern
setblock ~0 ~-1 ~4 sea_lantern

# Pontos de interesse didatico
setblock ~-2 ~0 ~-4 bookshelf
setblock ~2 ~0 ~-4 enchanting_table
setblock ~-2 ~0 ~4 crafting_table
setblock ~2 ~0 ~4 lectern

# Trilha intuitiva com baus de resposta: base mineral = fase; verde = registrar correta; vermelho = pedir revisao
fill ~-13 ~-1 ~-10 ~-6 ~-1 ~11 stone_bricks
fill ~-12 ~-1 ~-9 ~-7 ~-1 ~-7 emerald_block
fill ~-12 ~-1 ~-3 ~-7 ~-1 ~-1 lapis_block
fill ~-12 ~-1 ~3 ~-7 ~-1 ~5 gold_block
fill ~-12 ~-1 ~9 ~-7 ~-1 ~11 diamond_block

# Fase A - Pertinencia
setblock ~-12 ~0 ~-8 lime_concrete
setblock ~-12 ~1 ~-8 chest
setblock ~-8 ~0 ~-8 red_concrete
setblock ~-8 ~1 ~-8 chest
replaceitem block ~-12 ~1 ~-8 slot.container 0 emerald 1
replaceitem block ~-12 ~1 ~-8 slot.container 1 paper 1
replaceitem block ~-8 ~1 ~-8 slot.container 0 redstone 1
replaceitem block ~-8 ~1 ~-8 slot.container 1 book 1

# Fase B - Subconjuntos
setblock ~-12 ~0 ~-2 lime_concrete
setblock ~-12 ~1 ~-2 chest
setblock ~-8 ~0 ~-2 red_concrete
setblock ~-8 ~1 ~-2 chest
replaceitem block ~-12 ~1 ~-2 slot.container 0 lapis_block 1
replaceitem block ~-12 ~1 ~-2 slot.container 1 paper 1
replaceitem block ~-8 ~1 ~-2 slot.container 0 redstone 1
replaceitem block ~-8 ~1 ~-2 slot.container 1 book 1

# Fase C - Operacoes
setblock ~-12 ~0 ~4 lime_concrete
setblock ~-12 ~1 ~4 chest
setblock ~-8 ~0 ~4 red_concrete
setblock ~-8 ~1 ~4 chest
replaceitem block ~-12 ~1 ~4 slot.container 0 gold_ingot 1
replaceitem block ~-12 ~1 ~4 slot.container 1 paper 1
replaceitem block ~-8 ~1 ~4 slot.container 0 redstone 1
replaceitem block ~-8 ~1 ~4 slot.container 1 book 1

# Fase D - Produto Cartesiano
setblock ~-12 ~0 ~10 lime_concrete
setblock ~-12 ~1 ~10 chest
setblock ~-8 ~0 ~10 red_concrete
setblock ~-8 ~1 ~10 chest
replaceitem block ~-12 ~1 ~10 slot.container 0 diamond 1
replaceitem block ~-12 ~1 ~10 slot.container 1 paper 1
replaceitem block ~-8 ~1 ~10 slot.container 0 redstone 1
replaceitem block ~-8 ~1 ~10 slot.container 1 book 1

tellraw @s {"rawtext":[{"text":"[IlhaLogica] Hub visual ampliado com trilha de baus. Para textos mais legiveis, mire na Lanterna/Lectern e use/interaja (botao direito, LT ou toque) para abrir o Painel escuro de leitura."}]}
