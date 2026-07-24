# Protótipo pequeno absoluto no ponto informado pela tela do operador: centro -182 71 95.
# Por que esta versão existe? A montagem relativa via execute/function retornou sucesso parcial, mas não apareceu; usar coordenadas absolutas elimina perda de contexto do executor/âncora.
# Area afetada: X=-194..-170, Y=70..77, Z=83..107. Volume pequeno, sem plataforma alta e sem megaconstrução.
tellraw @a[x=-182,y=71,z=95,r=80] {"rawtext":[{"text":"[Piramide][Prototipo] Montando versao absoluta pequena no ponto -182 71 95."}]}
fill -194 70 83 -170 70 107 minecraft:smooth_sandstone
fill -194 70 83 -170 70 107 minecraft:sandstone outline
fill -192 71 85 -172 71 105 minecraft:sandstone
fill -190 72 87 -174 72 103 minecraft:sandstone
fill -188 73 89 -176 73 101 minecraft:sandstone
fill -186 74 91 -178 74 99 minecraft:sandstone
fill -184 75 93 -180 75 97 minecraft:chiseled_sandstone
setblock -182 76 95 minecraft:gold_block
setblock -182 77 95 minecraft:sea_lantern
fill -184 70 93 -180 77 97 minecraft:air
fill -184 71 83 -180 74 92 minecraft:air
setblock -185 71 86 minecraft:torch
setblock -179 71 86 minecraft:torch
setblock -185 71 91 minecraft:torch
setblock -179 71 91 minecraft:torch
tellraw @a[x=-182,y=71,z=95,r=80] {"rawtext":[{"text":"[Piramide][Prototipo] Pronto no ponto absoluto. Verifique se encostou no chao; se flutuar, pare."}]}
