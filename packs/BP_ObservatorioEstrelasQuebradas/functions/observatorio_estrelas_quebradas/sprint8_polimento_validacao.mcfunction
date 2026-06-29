# Sprint 8 - Polimento, validacao e preparacao para expansao.
tellraw @s {"rawtext":[{"text":"[Observatorio] Sprint 8: iluminacao, rotas seguras, marcadores tecnicos e checklist de expansao."}]}
scoreboard players set @s oeq_sprint 8
fill ~-90 ~2 ~-90 ~90 ~2 ~-90 sea_lantern
fill ~-90 ~2 ~90 ~90 ~2 ~90 sea_lantern
fill ~-90 ~2 ~-90 ~-90 ~2 ~90 sea_lantern
fill ~90 ~2 ~-90 ~90 ~2 ~90 sea_lantern
fill ~-4 ~2 ~-140 ~4 ~2 ~-88 lantern
fill ~-60 ~2 ~0 ~-38 ~2 ~0 yellow_concrete
fill ~38 ~2 ~0 ~60 ~2 ~0 orange_concrete
fill ~0 ~2 ~38 ~0 ~2 ~70 purple_concrete
fill ~0 ~2 ~-38 ~0 ~2 ~-70 light_blue_concrete
setblock ~8 ~2 ~8 lectern
setblock ~-8 ~2 ~8 lectern
setblock ~8 ~2 ~-8 lectern
setblock ~-8 ~2 ~-8 lectern
setblock ~0 ~3 ~-86 lectern
setblock ~0 ~3 ~0 bell
setblock ~0 ~81 ~58 lectern
setblock ~0 ~-31 ~110 lectern
setblock ~0 ~-43 ~206 lectern
tellraw @s {"rawtext":[{"text":"[Observatorio] Montagem completa. Valide fluxo: caminho, portao, patio, torre, cupulas, calculos, planetario e nucleo. Registre coordenadas importantes para NPCs e triggers futuros."}]}
