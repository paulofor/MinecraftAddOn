# Reparo publico: ancora a Piramide do centro historico ate a cota baixa para remover efeito flutuante.
# Por que essa construcao poderia danificar ou ficar mal posicionada no mundo? Porque reforca um volume grande ja construido; se usado fora do centro historico, pode soterrar terreno, agua, cavernas ou obras existentes.
# Area afetada absoluta: X=-258..-130, Y=37..71, Z=47..175. Subsolo/baixos: preenche de Y37 a Y68; topo tecnico: Y69..Y71.
# Limitacao: reparo absoluto sem varredura completa; usar somente no centro historico ja validado apos backup.
tellraw @a[x=-194,y=69,z=111,r=180] {"rawtext":[{"text":"[Piramide][Reparo] Reforcando fundacao absoluta X=-258..-130 Y=37..71 Z=47..175 para remover efeito flutuante."}]}
effect @a[x=-258,y=37,z=47,dx=128,dy=40,dz=128] slow_falling 40 1 true
tp @a[x=-258,y=37,z=47,dx=128,dy=40,dz=128] -194 134 111
fill -258 37 47 -227 52 78 minecraft:sandstone
fill -258 37 79 -227 52 110 minecraft:sandstone
fill -258 37 111 -227 52 142 minecraft:sandstone
fill -258 37 143 -227 52 175 minecraft:sandstone
fill -226 37 47 -195 52 78 minecraft:sandstone
fill -226 37 79 -195 52 110 minecraft:sandstone
fill -226 37 111 -195 52 142 minecraft:sandstone
fill -226 37 143 -195 52 175 minecraft:sandstone
fill -194 37 47 -163 52 78 minecraft:sandstone
fill -194 37 79 -163 52 110 minecraft:sandstone
fill -194 37 111 -163 52 142 minecraft:sandstone
fill -194 37 143 -163 52 175 minecraft:sandstone
fill -162 37 47 -130 52 78 minecraft:sandstone
fill -162 37 79 -130 52 110 minecraft:sandstone
fill -162 37 111 -130 52 142 minecraft:sandstone
fill -162 37 143 -130 52 175 minecraft:sandstone
fill -258 53 47 -227 68 78 minecraft:sandstone
fill -258 53 79 -227 68 110 minecraft:sandstone
fill -258 53 111 -227 68 142 minecraft:sandstone
fill -258 53 143 -227 68 175 minecraft:sandstone
fill -226 53 47 -195 68 78 minecraft:sandstone
fill -226 53 79 -195 68 110 minecraft:sandstone
fill -226 53 111 -195 68 142 minecraft:sandstone
fill -226 53 143 -195 68 175 minecraft:sandstone
fill -194 53 47 -163 68 78 minecraft:sandstone
fill -194 53 79 -163 68 110 minecraft:sandstone
fill -194 53 111 -163 68 142 minecraft:sandstone
fill -194 53 143 -163 68 175 minecraft:sandstone
fill -162 53 47 -130 68 78 minecraft:sandstone
fill -162 53 79 -130 68 110 minecraft:sandstone
fill -162 53 111 -130 68 142 minecraft:sandstone
fill -162 53 143 -130 68 175 minecraft:sandstone
fill -258 69 47 -227 69 78 minecraft:smooth_sandstone
fill -258 69 79 -227 69 110 minecraft:smooth_sandstone
fill -258 69 111 -227 69 142 minecraft:smooth_sandstone
fill -258 69 143 -227 69 175 minecraft:smooth_sandstone
fill -226 69 47 -195 69 78 minecraft:smooth_sandstone
fill -226 69 79 -195 69 110 minecraft:smooth_sandstone
fill -226 69 111 -195 69 142 minecraft:smooth_sandstone
fill -226 69 143 -195 69 175 minecraft:smooth_sandstone
fill -194 69 47 -163 69 78 minecraft:smooth_sandstone
fill -194 69 79 -163 69 110 minecraft:smooth_sandstone
fill -194 69 111 -163 69 142 minecraft:smooth_sandstone
fill -194 69 143 -163 69 175 minecraft:smooth_sandstone
fill -162 69 47 -130 69 78 minecraft:smooth_sandstone
fill -162 69 79 -130 69 110 minecraft:smooth_sandstone
fill -162 69 111 -130 69 142 minecraft:smooth_sandstone
fill -162 69 143 -130 69 175 minecraft:smooth_sandstone
fill -258 70 47 -227 71 78 minecraft:sandstone
fill -258 70 79 -227 71 110 minecraft:sandstone
fill -258 70 111 -227 71 142 minecraft:sandstone
fill -258 70 143 -227 71 175 minecraft:sandstone
fill -226 70 47 -195 71 78 minecraft:sandstone
fill -226 70 79 -195 71 110 minecraft:sandstone
fill -226 70 111 -195 71 142 minecraft:sandstone
fill -226 70 143 -195 71 175 minecraft:sandstone
fill -194 70 47 -163 71 78 minecraft:sandstone
fill -194 70 79 -163 71 110 minecraft:sandstone
fill -194 70 111 -163 71 142 minecraft:sandstone
fill -194 70 143 -163 71 175 minecraft:sandstone
fill -162 70 47 -130 71 78 minecraft:sandstone
fill -162 70 79 -130 71 110 minecraft:sandstone
fill -162 70 111 -130 71 142 minecraft:sandstone
fill -162 70 143 -130 71 175 minecraft:sandstone
fill -258 72 47 -130 72 175 minecraft:sandstone outline
setblock -194 72 111 minecraft:gold_block
tellraw @a[x=-194,y=69,z=111,r=220] {"rawtext":[{"text":"[Piramide][Reparo] Fundacao reforcada. Valide visualmente as laterais e a conexao com o terreno."}]}
