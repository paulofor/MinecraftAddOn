# Sprint 4: camaras internas com mensagens educativas.
tellraw @s {"rawtext":[{"text":"[Piramide][Sprint 4] Criando camaras internas educativas."}]}
fill ~-10 ~4 ~-8 ~10 ~12 ~12 air
fill ~-12 ~3 ~-10 ~12 ~3 ~14 smooth_sandstone
fill ~-12 ~13 ~-10 ~12 ~13 ~14 sandstone
fill ~-12 ~4 ~-10 ~12 ~12 ~14 sandstone outline
setblock ~ ~4 ~2 gold_block
setblock ~-8 ~5 ~2 lectern
setblock ~8 ~5 ~2 lectern
setblock ~ ~6 ~13 sea_lantern
setblock ~ ~10 ~13 sea_lantern
tellraw @s {"rawtext":[{"text":"[Piramide][Educativo] Camara pronta: use lecterns para registrar conteudos sobre engenharia, historia e geometria."}]}
