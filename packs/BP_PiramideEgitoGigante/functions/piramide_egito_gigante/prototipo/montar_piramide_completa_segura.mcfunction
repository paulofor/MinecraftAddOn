# Pirâmide completa segura, baseada no protótipo validado e em coordenadas absolutas.
# Por que essa construção poderia danificar ou ficar mal posicionada? Porque amplia o protótipo; por isso mantém centro fixo -182 71 95, começa no chão Y=70, evita coordenadas relativas e segmenta camadas pequenas.
# Area afetada: X=-206..-158, Y=70..94, Z=71..119. Sem subsolo profundo, sem plataforma alta e sem megaconstrução 129x129.
# Trava operacional: executar somente após backup e validação visual do protótipo absoluto já aprovado.
tellraw @a[x=-182,y=71,z=95,r=120] {"rawtext":[{"text":"[Piramide][CompletaSegura] Montando piramide completa segura no ponto absoluto -182 71 95."}]}
# Base e corpo escalonado: cada fill fica pequeno e começa encostado no chão validado.
fill -206 70 71 -158 70 119 minecraft:smooth_sandstone
fill -206 70 71 -158 70 119 minecraft:sandstone outline
fill -204 71 73 -160 72 117 minecraft:sandstone
fill -202 73 75 -162 74 115 minecraft:sandstone
fill -200 75 77 -164 76 113 minecraft:sandstone
fill -198 77 79 -166 78 111 minecraft:sandstone
fill -196 79 81 -168 80 109 minecraft:sandstone
fill -194 81 83 -170 82 107 minecraft:sandstone
fill -192 83 85 -172 84 105 minecraft:sandstone
fill -190 85 87 -174 86 103 minecraft:sandstone
fill -188 87 89 -176 88 101 minecraft:sandstone
fill -186 89 91 -178 90 99 minecraft:sandstone
fill -184 91 93 -180 92 97 minecraft:chiseled_sandstone
setblock -182 93 95 minecraft:gold_block
setblock -182 94 95 minecraft:sea_lantern
# Entrada, galeria e câmara interna simples para virar uma pirâmide explorável.
fill -184 71 70 -180 75 94 minecraft:air
fill -190 71 95 -174 78 109 minecraft:air
fill -190 70 95 -174 70 109 minecraft:smooth_sandstone
fill -190 79 95 -174 79 109 minecraft:sandstone
fill -190 71 95 -174 78 109 minecraft:cut_sandstone outline
fill -184 71 109 -180 75 116 minecraft:air
setblock -188 72 99 minecraft:lectern
setblock -176 72 99 minecraft:lectern
setblock -182 72 104 minecraft:sea_lantern
setblock -182 73 104 minecraft:gold_block
setblock -185 72 78 minecraft:torch
setblock -179 72 78 minecraft:torch
setblock -185 72 88 minecraft:torch
setblock -179 72 88 minecraft:torch
setblock -188 72 107 minecraft:torch
setblock -176 72 107 minecraft:torch
tellraw @a[x=-182,y=71,z=95,r=120] {"rawtext":[{"text":"[Piramide][CompletaSegura] Concluida. Validar visualmente: base no chao, sem flutuar e interior acessivel pela entrada."}]}
