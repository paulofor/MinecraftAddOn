# Sprint 2 - melhoria visual: cria ilha-hub didatica ao redor do jogador
# Base ampliada da ilha (camadas)
fill ~-14 ~-4 ~-14 ~14 ~-2 ~14 dirt
fill ~-12 ~-1 ~-12 ~12 ~-1 ~12 grass

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

# Rampas de acesso para quem chega nadando (N, S, L, O)
fill ~ ~-2 ~-12 ~ ~-1 ~-16 dirt
fill ~ ~-2 ~12 ~ ~-1 ~16 dirt
fill ~12 ~-2 ~ ~16 ~-1 ~ dirt
fill ~-12 ~-2 ~ ~-16 ~-1 ~ dirt

# Rampas de acesso para quem chega nadando (N, S, L, O)
fill ~ ~-2 ~-7 ~ ~-1 ~-9 dirt
fill ~ ~-2 ~7 ~ ~-1 ~9 dirt
fill ~7 ~-2 ~ ~9 ~-1 ~ dirt
fill ~-7 ~-2 ~ ~-9 ~-1 ~ dirt

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

# Arvores simples (tronco + copa)
fill ~-8 ~0 ~-8 ~-8 ~3 ~-8 oak_log
fill ~-9 ~4 ~-9 ~-7 ~5 ~-7 oak_leaves
setblock ~-8 ~6 ~-8 oak_leaves

fill ~8 ~0 ~7 ~8 ~3 ~7 oak_log
fill ~7 ~4 ~6 ~9 ~5 ~8 oak_leaves
setblock ~8 ~6 ~7 oak_leaves

# Plaquinha cenografica "Ilha da Logica"
fill ~-2 ~0 ~-11 ~2 ~2 ~-11 stripped_oak_wood
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

tellraw @s {"rawtext":[{"text":"[IlhaLogica] Hub visual ampliado: gramados, laguinhos, arvores e iluminacao ativados. Bem-vindo(a) a Ilha da Logica!"}]}
