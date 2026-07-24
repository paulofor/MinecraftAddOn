# Limpeza publica do artefato suspenso da Piramide no centro historico.
# Por que essa construcao poderia danificar ou ficar mal posicionada no mundo? Porque remove um volume grande; se houver jogador/obra dentro do envelope, pode apagar blocos desejados.
# Area afetada absoluta: X=-258..-130, Y=70..139, Z=47..175. Abaixo de Y70 nao e alterado para preservar terreno/solo.
# Limitacao: limpeza absoluta sem varredura completa; executar somente apos backup e confirmacao visual do artefato suspenso.
tellraw @a[x=-194,y=69,z=111,r=220] {"rawtext":[{"text":"[Piramide][Limpeza] Removendo artefato suspenso X=-258..-130 Y=70..139 Z=47..175 em segmentos seguros."}]}
effect @a[x=-258,y=70,z=47,dx=128,dy=69,dz=128] slow_falling 40 1 true
tp @a[x=-258,y=70,z=47,dx=128,dy=69,dz=128] -194 145 111
fill -258 70 47 -227 85 78 minecraft:air
fill -258 70 79 -227 85 110 minecraft:air
fill -258 70 111 -227 85 142 minecraft:air
fill -258 70 143 -227 85 175 minecraft:air
fill -226 70 47 -195 85 78 minecraft:air
fill -226 70 79 -195 85 110 minecraft:air
fill -226 70 111 -195 85 142 minecraft:air
fill -226 70 143 -195 85 175 minecraft:air
fill -194 70 47 -163 85 78 minecraft:air
fill -194 70 79 -163 85 110 minecraft:air
fill -194 70 111 -163 85 142 minecraft:air
fill -194 70 143 -163 85 175 minecraft:air
fill -162 70 47 -130 85 78 minecraft:air
fill -162 70 79 -130 85 110 minecraft:air
fill -162 70 111 -130 85 142 minecraft:air
fill -162 70 143 -130 85 175 minecraft:air
fill -258 86 47 -227 101 78 minecraft:air
fill -258 86 79 -227 101 110 minecraft:air
fill -258 86 111 -227 101 142 minecraft:air
fill -258 86 143 -227 101 175 minecraft:air
fill -226 86 47 -195 101 78 minecraft:air
fill -226 86 79 -195 101 110 minecraft:air
fill -226 86 111 -195 101 142 minecraft:air
fill -226 86 143 -195 101 175 minecraft:air
fill -194 86 47 -163 101 78 minecraft:air
fill -194 86 79 -163 101 110 minecraft:air
fill -194 86 111 -163 101 142 minecraft:air
fill -194 86 143 -163 101 175 minecraft:air
fill -162 86 47 -130 101 78 minecraft:air
fill -162 86 79 -130 101 110 minecraft:air
fill -162 86 111 -130 101 142 minecraft:air
fill -162 86 143 -130 101 175 minecraft:air
fill -258 102 47 -227 117 78 minecraft:air
fill -258 102 79 -227 117 110 minecraft:air
fill -258 102 111 -227 117 142 minecraft:air
fill -258 102 143 -227 117 175 minecraft:air
fill -226 102 47 -195 117 78 minecraft:air
fill -226 102 79 -195 117 110 minecraft:air
fill -226 102 111 -195 117 142 minecraft:air
fill -226 102 143 -195 117 175 minecraft:air
fill -194 102 47 -163 117 78 minecraft:air
fill -194 102 79 -163 117 110 minecraft:air
fill -194 102 111 -163 117 142 minecraft:air
fill -194 102 143 -163 117 175 minecraft:air
fill -162 102 47 -130 117 78 minecraft:air
fill -162 102 79 -130 117 110 minecraft:air
fill -162 102 111 -130 117 142 minecraft:air
fill -162 102 143 -130 117 175 minecraft:air
fill -258 118 47 -227 133 78 minecraft:air
fill -258 118 79 -227 133 110 minecraft:air
fill -258 118 111 -227 133 142 minecraft:air
fill -258 118 143 -227 133 175 minecraft:air
fill -226 118 47 -195 133 78 minecraft:air
fill -226 118 79 -195 133 110 minecraft:air
fill -226 118 111 -195 133 142 minecraft:air
fill -226 118 143 -195 133 175 minecraft:air
fill -194 118 47 -163 133 78 minecraft:air
fill -194 118 79 -163 133 110 minecraft:air
fill -194 118 111 -163 133 142 minecraft:air
fill -194 118 143 -163 133 175 minecraft:air
fill -162 118 47 -130 133 78 minecraft:air
fill -162 118 79 -130 133 110 minecraft:air
fill -162 118 111 -130 133 142 minecraft:air
fill -162 118 143 -130 133 175 minecraft:air
fill -258 134 47 -227 139 78 minecraft:air
fill -258 134 79 -227 139 110 minecraft:air
fill -258 134 111 -227 139 142 minecraft:air
fill -258 134 143 -227 139 175 minecraft:air
fill -226 134 47 -195 139 78 minecraft:air
fill -226 134 79 -195 139 110 minecraft:air
fill -226 134 111 -195 139 142 minecraft:air
fill -226 134 143 -195 139 175 minecraft:air
fill -194 134 47 -163 139 78 minecraft:air
fill -194 134 79 -163 139 110 minecraft:air
fill -194 134 111 -163 139 142 minecraft:air
fill -194 134 143 -163 139 175 minecraft:air
fill -162 134 47 -130 139 78 minecraft:air
fill -162 134 79 -130 139 110 minecraft:air
fill -162 134 111 -130 139 142 minecraft:air
fill -162 134 143 -130 139 175 minecraft:air
tellraw @a[x=-194,y=69,z=111,r=240] {"rawtext":[{"text":"[Piramide][Limpeza] Volume suspenso removido. Nao reexecute a Piramide antiga sem a versao redesenhada."}]}
