# Sprint 7 - Polimento, validacao e preparacao tecnica da Academia Arcana Monumental
# Execute depois de academia_arcana_monumental/arquivo_proibido_sprint6, a partir do mesmo centro do Patio das Casas Arcanas.
# Sem PNG customizado: polimento usa somente blocos vanilla, iluminacao e marcadores textuais.

tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Iniciando Sprint 7: polimento de rotas, seguranca, iluminacao e marcadores tecnicos."}]}
scoreboard players set @s aam_sprint 7

# Hub de validacao no Patio das Casas Arcanas: ponto inicial para testar fluxo sem comandos administrativos apos a montagem.
fill ~-8 ~1 ~-8 ~8 ~1 ~8 smooth_stone
fill ~-6 ~2 ~-6 ~6 ~2 ~6 air
setblock ~0 ~2 ~0 sea_lantern
setblock ~0 ~3 ~0 bell
setblock ~0 ~2 ~-6 lectern
setblock ~-6 ~2 ~0 emerald_block
setblock ~6 ~2 ~0 lapis_block
setblock ~0 ~2 ~6 gold_block
setblock ~-4 ~2 ~-4 glowstone
setblock ~4 ~2 ~-4 glowstone
setblock ~-4 ~2 ~4 glowstone
setblock ~4 ~2 ~4 glowstone

# Sinalizacao e iluminacao das quatro rotas principais a partir do patio.
fill ~-3 ~1 ~-46 ~3 ~1 ~-12 glowstone replace air
fill ~-3 ~1 ~12 ~3 ~1 ~46 glowstone replace air
fill ~-46 ~1 ~-3 ~-12 ~1 ~3 glowstone replace air
fill ~12 ~1 ~-3 ~46 ~1 ~3 glowstone replace air
setblock ~0 ~2 ~-34 blue_concrete
setblock ~0 ~2 ~34 green_concrete
setblock ~-34 ~2 ~0 orange_concrete
setblock ~34 ~2 ~0 purple_concrete
setblock ~0 ~3 ~-34 standing_sign
setblock ~0 ~3 ~34 standing_sign
setblock ~-34 ~3 ~0 standing_sign
setblock ~34 ~3 ~0 standing_sign

# Marcadores de caminho completo: entrada -> patio -> biblioteca -> arquivo -> retorno.
setblock ~0 ~2 ~-86 beacon
setblock ~0 ~2 ~-72 lectern
setblock ~0 ~2 ~52 sea_lantern
setblock ~0 ~-17 ~56 glowstone
setblock ~0 ~-22 ~96 glowstone
setblock ~0 ~-27 ~184 glowstone
setblock ~0 ~-22 ~254 beacon
setblock ~16 ~2 ~250 emerald_block
setblock ~16 ~3 ~250 standing_sign

# Reforco de seguranca em pontos altos e passarelas panoramicas com bordas visuais.
fill ~-72 ~28 ~-4 ~-42 ~28 ~-4 polished_andesite
fill ~-72 ~28 ~4 ~-42 ~28 ~4 polished_andesite
fill ~42 ~28 ~-4 ~72 ~28 ~-4 polished_andesite
fill ~42 ~28 ~4 ~72 ~28 ~4 polished_andesite
fill ~-4 ~34 ~42 ~-4 ~34 ~72 polished_andesite
fill ~4 ~34 ~42 ~4 ~34 ~72 polished_andesite
fill ~-4 ~34 ~-72 ~-4 ~34 ~-42 polished_andesite
fill ~4 ~34 ~-72 ~4 ~34 ~-42 polished_andesite
setblock ~-57 ~29 ~0 sea_lantern
setblock ~57 ~29 ~0 sea_lantern
setblock ~0 ~35 ~57 sea_lantern
setblock ~0 ~35 ~-57 sea_lantern

# Pontos de descanso/retomada para reduzir travamento de exploracao e indicar retorno seguro.
setblock ~-24 ~2 ~24 hay_block
setblock ~24 ~2 ~24 hay_block
setblock ~-24 ~2 ~-24 crafting_table
setblock ~24 ~2 ~-24 barrel
setblock ~-18 ~-22 ~246 glowstone
setblock ~18 ~-22 ~246 glowstone
setblock ~14 ~-12 ~250 glowstone
setblock ~18 ~-12 ~250 glowstone

# Marcadores tecnicos para futuras automacoes, NPCs, triggers e interacoes.
setblock ~0 ~1 ~-90 target
setblock ~0 ~1 ~0 target
setblock ~0 ~1 ~46 target
setblock ~-56 ~1 ~0 target
setblock ~56 ~1 ~0 target
setblock ~0 ~1 ~76 target
setblock ~0 ~-23 ~96 target
setblock ~0 ~-29 ~184 target
setblock ~0 ~-23 ~254 target
setblock ~16 ~1 ~250 target

# Checklist in-game resumido para operadores durante validacao manual.
tellraw @s {"rawtext":[{"text":"[AcademiaArcana][Checklist] 1) Entrada e Portao; 2) Patio e rotas coloridas; 3) Biblioteca; 4) Torres; 5) Observatorio/Jardins/Anfiteatro; 6) Arquivo Proibido; 7) Atalho de retorno."}]}
tellraw @s {"rawtext":[{"text":"[AcademiaArcana][Coords] Origem relativa = Patio. Marcadores: entrada ~0 ~1 ~-90, biblioteca ~0 ~1 ~46, arquivo ~0 ~-23 ~96, desafio final ~0 ~-29 ~184, conclusao ~0 ~-23 ~254, retorno ~16 ~1 ~250."}]}
playsound random.levelup @s ~ ~ ~ 1 1.0
tellraw @s {"rawtext":[{"text":"[AcademiaArcana] Sprint 7 concluida. A academia esta preparada para validacao jogavel e futuras automacoes sem uso de PNG."}]}
