# Atalho operacional absoluto para continuar a Piramide no centro historico ja preparado.
# Gerado para execucao via console/FIFO sem depender de propagacao de contexto relativo em funcoes aninhadas.
# Centro historico: -194 69 111. Area aproximada: X=-258..-130, Z=47..175, Y=37..139.
scoreboard objectives add peg_agua dummy
scoreboard objectives add peg_bloqueio dummy
scoreboard players set peg_state peg_agua 0
scoreboard players set peg_state peg_bloqueio 0
tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide] Montagem absoluta no centro historico -194 69 111 iniciada pelo console/FIFO."}]}
execute if block -194 68 111 water run scoreboard players add peg_state peg_agua 1
execute if block -194 68 111 lava run scoreboard players add peg_state peg_agua 1
execute if block -254 68 51 water run scoreboard players add peg_state peg_agua 1
execute if block -254 68 51 lava run scoreboard players add peg_state peg_agua 1
execute if block -134 68 51 water run scoreboard players add peg_state peg_agua 1
execute if block -134 68 51 lava run scoreboard players add peg_state peg_agua 1
execute if block -254 68 171 water run scoreboard players add peg_state peg_agua 1
execute if block -254 68 171 lava run scoreboard players add peg_state peg_agua 1
execute if block -134 68 171 water run scoreboard players add peg_state peg_agua 1
execute if block -134 68 171 lava run scoreboard players add peg_state peg_agua 1
execute if block -194 68 51 water run scoreboard players add peg_state peg_agua 1
execute if block -194 68 51 lava run scoreboard players add peg_state peg_agua 1
execute if block -194 68 171 water run scoreboard players add peg_state peg_agua 1
execute if block -194 68 171 lava run scoreboard players add peg_state peg_agua 1
execute if block -254 68 111 water run scoreboard players add peg_state peg_agua 1
execute if block -254 68 111 lava run scoreboard players add peg_state peg_agua 1
execute if block -134 68 111 water run scoreboard players add peg_state peg_agua 1
execute if block -134 68 111 lava run scoreboard players add peg_state peg_agua 1
execute if block -194 63 111 water run scoreboard players add peg_state peg_agua 1
execute if block -194 63 111 lava run scoreboard players add peg_state peg_agua 1
execute if block -239 63 66 water run scoreboard players add peg_state peg_agua 1
execute if block -239 63 66 lava run scoreboard players add peg_state peg_agua 1
execute if block -149 63 66 water run scoreboard players add peg_state peg_agua 1
execute if block -149 63 66 lava run scoreboard players add peg_state peg_agua 1
execute if block -239 63 156 water run scoreboard players add peg_state peg_agua 1
execute if block -239 63 156 lava run scoreboard players add peg_state peg_agua 1
execute if block -149 63 156 water run scoreboard players add peg_state peg_agua 1
execute if block -149 63 156 lava run scoreboard players add peg_state peg_agua 1
execute if block -194 53 111 water run scoreboard players add peg_state peg_agua 1
execute if block -194 53 111 lava run scoreboard players add peg_state peg_agua 1
execute if block -254 53 51 water run scoreboard players add peg_state peg_agua 1
execute if block -254 53 51 lava run scoreboard players add peg_state peg_agua 1
execute if block -134 53 51 water run scoreboard players add peg_state peg_agua 1
execute if block -134 53 51 lava run scoreboard players add peg_state peg_agua 1
execute if block -254 53 171 water run scoreboard players add peg_state peg_agua 1
execute if block -254 53 171 lava run scoreboard players add peg_state peg_agua 1
execute if block -134 53 171 water run scoreboard players add peg_state peg_agua 1
execute if block -134 53 171 lava run scoreboard players add peg_state peg_agua 1
execute if block -194 53 51 water run scoreboard players add peg_state peg_agua 1
execute if block -194 53 51 lava run scoreboard players add peg_state peg_agua 1
execute if block -194 53 171 water run scoreboard players add peg_state peg_agua 1
execute if block -194 53 171 lava run scoreboard players add peg_state peg_agua 1
execute if block -254 53 111 water run scoreboard players add peg_state peg_agua 1
execute if block -254 53 111 lava run scoreboard players add peg_state peg_agua 1
execute if block -134 53 111 water run scoreboard players add peg_state peg_agua 1
execute if block -134 53 111 lava run scoreboard players add peg_state peg_agua 1
execute if block -224 53 81 water run scoreboard players add peg_state peg_agua 1
execute if block -224 53 81 lava run scoreboard players add peg_state peg_agua 1
execute if block -164 53 81 water run scoreboard players add peg_state peg_agua 1
execute if block -164 53 81 lava run scoreboard players add peg_state peg_agua 1
execute if block -224 53 141 water run scoreboard players add peg_state peg_agua 1
execute if block -224 53 141 lava run scoreboard players add peg_state peg_agua 1
execute if block -164 53 141 water run scoreboard players add peg_state peg_agua 1
execute if block -164 53 141 lava run scoreboard players add peg_state peg_agua 1
execute if block -239 53 66 water run scoreboard players add peg_state peg_agua 1
execute if block -239 53 66 lava run scoreboard players add peg_state peg_agua 1
execute if block -149 53 66 water run scoreboard players add peg_state peg_agua 1
execute if block -149 53 66 lava run scoreboard players add peg_state peg_agua 1
execute if block -239 53 156 water run scoreboard players add peg_state peg_agua 1
execute if block -239 53 156 lava run scoreboard players add peg_state peg_agua 1
execute if block -149 53 156 water run scoreboard players add peg_state peg_agua 1
execute if block -149 53 156 lava run scoreboard players add peg_state peg_agua 1
execute if block -194 41 111 water run scoreboard players add peg_state peg_agua 1
execute if block -194 41 111 lava run scoreboard players add peg_state peg_agua 1
execute if block -254 41 51 water run scoreboard players add peg_state peg_agua 1
execute if block -254 41 51 lava run scoreboard players add peg_state peg_agua 1
execute if block -134 41 51 water run scoreboard players add peg_state peg_agua 1
execute if block -134 41 51 lava run scoreboard players add peg_state peg_agua 1
execute if block -254 41 171 water run scoreboard players add peg_state peg_agua 1
execute if block -254 41 171 lava run scoreboard players add peg_state peg_agua 1
execute if block -134 41 171 water run scoreboard players add peg_state peg_agua 1
execute if block -134 41 171 lava run scoreboard players add peg_state peg_agua 1
execute if block -194 41 51 water run scoreboard players add peg_state peg_agua 1
execute if block -194 41 51 lava run scoreboard players add peg_state peg_agua 1
execute if block -194 41 171 water run scoreboard players add peg_state peg_agua 1
execute if block -194 41 171 lava run scoreboard players add peg_state peg_agua 1
execute if block -254 41 111 water run scoreboard players add peg_state peg_agua 1
execute if block -254 41 111 lava run scoreboard players add peg_state peg_agua 1
execute if block -134 41 111 water run scoreboard players add peg_state peg_agua 1
execute if block -134 41 111 lava run scoreboard players add peg_state peg_agua 1
execute if block -224 41 81 water run scoreboard players add peg_state peg_agua 1
execute if block -224 41 81 lava run scoreboard players add peg_state peg_agua 1
execute if block -164 41 81 water run scoreboard players add peg_state peg_agua 1
execute if block -164 41 81 lava run scoreboard players add peg_state peg_agua 1
execute if block -224 41 141 water run scoreboard players add peg_state peg_agua 1
execute if block -224 41 141 lava run scoreboard players add peg_state peg_agua 1
execute if block -164 41 141 water run scoreboard players add peg_state peg_agua 1
execute if block -164 41 141 lava run scoreboard players add peg_state peg_agua 1
execute if block -239 41 66 water run scoreboard players add peg_state peg_agua 1
execute if block -239 41 66 lava run scoreboard players add peg_state peg_agua 1
execute if block -149 41 66 water run scoreboard players add peg_state peg_agua 1
execute if block -149 41 66 lava run scoreboard players add peg_state peg_agua 1
execute if block -239 41 156 water run scoreboard players add peg_state peg_agua 1
execute if block -239 41 156 lava run scoreboard players add peg_state peg_agua 1
execute if block -149 41 156 water run scoreboard players add peg_state peg_agua 1
execute if block -149 41 156 lava run scoreboard players add peg_state peg_agua 1
execute if score peg_state peg_agua matches 1.. run scoreboard players add peg_state peg_bloqueio 1
execute if block -194 68 111 air run scoreboard players add peg_state peg_bloqueio 1
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide][TRAVA] Precheck absoluto aprovado. Construindo corpo completo."}]}
execute if score peg_state peg_bloqueio matches 1.. run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide][TRAVA] Montagem absoluta bloqueada por agua/lava ou centro sem suporte."}]}
# Expandido de preparar_terreno.mcfunction
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide] Limpando volume de seguranca e nivelando base 121x121 antes da construcao."}]}
execute if score peg_state peg_bloqueio matches 0 run fill -258 70 47 -227 85 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 70 79 -227 85 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 70 111 -227 85 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 70 143 -227 85 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 70 47 -195 85 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 70 79 -195 85 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 70 111 -195 85 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 70 143 -195 85 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 70 47 -163 85 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 70 79 -163 85 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 70 111 -163 85 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 70 143 -163 85 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 70 47 -130 85 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 70 79 -130 85 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 70 111 -130 85 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 70 143 -130 85 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 86 47 -227 101 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 86 79 -227 101 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 86 111 -227 101 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 86 143 -227 101 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 86 47 -195 101 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 86 79 -195 101 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 86 111 -195 101 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 86 143 -195 101 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 86 47 -163 101 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 86 79 -163 101 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 86 111 -163 101 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 86 143 -163 101 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 86 47 -130 101 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 86 79 -130 101 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 86 111 -130 101 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 86 143 -130 101 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 102 47 -227 117 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 102 79 -227 117 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 102 111 -227 117 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 102 143 -227 117 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 102 47 -195 117 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 102 79 -195 117 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 102 111 -195 117 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 102 143 -195 117 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 102 47 -163 117 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 102 79 -163 117 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 102 111 -163 117 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 102 143 -163 117 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 102 47 -130 117 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 102 79 -130 117 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 102 111 -130 117 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 102 143 -130 117 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 118 47 -227 133 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 118 79 -227 133 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 118 111 -227 133 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 118 143 -227 133 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 118 47 -195 133 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 118 79 -195 133 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 118 111 -195 133 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 118 143 -195 133 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 118 47 -163 133 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 118 79 -163 133 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 118 111 -163 133 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 118 143 -163 133 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 118 47 -130 133 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 118 79 -130 133 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 118 111 -130 133 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 118 143 -130 133 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 134 47 -227 139 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 134 79 -227 139 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 134 111 -227 139 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 134 143 -227 139 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 134 47 -195 139 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 134 79 -195 139 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 134 111 -195 139 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -226 134 143 -195 139 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 134 47 -163 139 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 134 79 -163 139 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 134 111 -163 139 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -194 134 143 -163 139 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 134 47 -130 139 78 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 134 79 -130 139 110 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 134 111 -130 139 142 air
execute if score peg_state peg_bloqueio matches 0 run fill -162 134 143 -130 139 175 air
execute if score peg_state peg_bloqueio matches 0 run fill -258 37 47 -227 60 78 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 37 79 -227 60 110 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 37 111 -227 60 142 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 37 143 -227 60 175 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 37 47 -195 60 78 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 37 79 -195 60 110 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 37 111 -195 60 142 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 37 143 -195 60 175 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 37 47 -163 60 78 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 37 79 -163 60 110 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 37 111 -163 60 142 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 37 143 -163 60 175 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 37 47 -130 60 78 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 37 79 -130 60 110 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 37 111 -130 60 142 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 37 143 -130 60 175 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 61 47 -227 68 78 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 61 79 -227 68 110 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 61 111 -227 68 142 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 61 143 -227 68 175 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 61 47 -195 68 78 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 61 79 -195 68 110 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 61 111 -195 68 142 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 61 143 -195 68 175 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 61 47 -163 68 78 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 61 79 -163 68 110 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 61 111 -163 68 142 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 61 143 -163 68 175 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 61 47 -130 68 78 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 61 79 -130 68 110 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 61 111 -130 68 142 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 61 143 -130 68 175 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 69 47 -227 69 78 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 69 79 -227 69 110 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 69 111 -227 69 142 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 69 143 -227 69 175 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 69 47 -195 69 78 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 69 79 -195 69 110 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 69 111 -195 69 142 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 69 143 -195 69 175 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 69 47 -163 69 78 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 69 79 -163 69 110 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 69 111 -163 69 142 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -194 69 143 -163 69 175 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 69 47 -130 69 78 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 69 79 -130 69 110 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 69 111 -130 69 142 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -162 69 143 -130 69 175 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 70 47 -227 70 78 sand
execute if score peg_state peg_bloqueio matches 0 run fill -258 70 79 -227 70 110 sand
execute if score peg_state peg_bloqueio matches 0 run fill -258 70 111 -227 70 142 sand
execute if score peg_state peg_bloqueio matches 0 run fill -258 70 143 -227 70 175 sand
execute if score peg_state peg_bloqueio matches 0 run fill -226 70 47 -195 70 78 sand
execute if score peg_state peg_bloqueio matches 0 run fill -226 70 79 -195 70 110 sand
execute if score peg_state peg_bloqueio matches 0 run fill -226 70 111 -195 70 142 sand
execute if score peg_state peg_bloqueio matches 0 run fill -226 70 143 -195 70 175 sand
execute if score peg_state peg_bloqueio matches 0 run fill -194 70 47 -163 70 78 sand
execute if score peg_state peg_bloqueio matches 0 run fill -194 70 79 -163 70 110 sand
execute if score peg_state peg_bloqueio matches 0 run fill -194 70 111 -163 70 142 sand
execute if score peg_state peg_bloqueio matches 0 run fill -194 70 143 -163 70 175 sand
execute if score peg_state peg_bloqueio matches 0 run fill -162 70 47 -130 70 78 sand
execute if score peg_state peg_bloqueio matches 0 run fill -162 70 79 -130 70 110 sand
execute if score peg_state peg_bloqueio matches 0 run fill -162 70 111 -130 70 142 sand
execute if score peg_state peg_bloqueio matches 0 run fill -162 70 143 -130 70 175 sand
execute if score peg_state peg_bloqueio matches 0 run fill -258 69 47 -130 69 175 sandstone outline
# Expandido de init.mcfunction
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide] Execute /function piramide_egito_gigante/montar_completa em area seca, livre, e com os pes no chao no centro desejado. A obra ocupa X/Z ~121x121, ancora a fundacao de Y-32 a Y+58 e limpa ate Y+70."}]}
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide] Por que essa construcao poderia danificar ou ficar mal posicionada no mundo? Porque o terreno natural e irregular, pode haver agua/lava, construcoes existentes ou desniveis sob a base."}]}
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide] A funcao publica roda precheck anti-agua antes da limpeza automatica e so depois chama a construcao interna."}]}
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide] Para executar somente a Sprint 1 com seguranca, use /function piramide_egito_gigante/executar_sprint1."}]}
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide] Para escolher coordenada olhando o mundo pelo proprio jogo, fique no centro desejado e use /function piramide_egito_gigante/diagnosticar_local; o resultado APROVADO/BLOQUEADO sai no bedrock.log."}]}
# Expandido de sprint1_base_fundacao.mcfunction
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide][Sprint 1] Fundacao nivelada, moldura de seguranca e eixo central."}]}
execute if score peg_state peg_bloqueio matches 0 run fill -254 70 51 -134 70 171 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -252 71 53 -136 71 169 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -258 70 47 -130 70 175 sandstone outline
execute if score peg_state peg_bloqueio matches 0 run setblock -194 71 111 chiseled_sandstone
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide][Sprint 1] Marcador central agora fica embutido na base; o cubo dourado isolado nao e a piramide completa."}]}
# Expandido de sprint2_corpo_piramide.mcfunction
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide][Sprint 2] Construindo camadas externas em arenito."}]}
execute if score peg_state peg_bloqueio matches 0 run fill -250 72 55 -138 73 167 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -250 74 55 -138 75 167 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -246 76 59 -142 77 163 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -246 78 59 -142 79 163 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -242 80 63 -146 81 159 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -242 82 63 -146 83 159 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -238 84 67 -150 85 155 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -238 86 67 -150 87 155 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -234 88 71 -154 89 151 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -234 90 71 -154 91 151 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -230 92 75 -158 93 147 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -230 94 75 -158 95 147 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 96 79 -162 97 143 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -226 98 79 -162 99 143 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -222 100 83 -166 101 139 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -222 102 83 -166 103 139 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -218 104 87 -170 105 135 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -218 106 87 -170 107 135 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -214 108 91 -174 109 131 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -214 110 91 -174 111 131 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -210 112 95 -178 113 127 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -210 114 95 -178 115 127 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -206 116 99 -182 117 123 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -206 118 99 -182 119 123 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -202 120 103 -186 121 119 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -202 122 103 -186 123 119 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -198 124 107 -190 125 115 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -198 126 107 -190 127 115 sandstone
execute if score peg_state peg_bloqueio matches 0 run setblock -194 128 111 gold_block
# Expandido de sprint3_entrada_corredor.mcfunction
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide][Sprint 3] Abrindo entrada e corredor central."}]}
execute if score peg_state peg_bloqueio matches 0 run fill -198 71 50 -190 77 61 air
execute if score peg_state peg_bloqueio matches 0 run fill -197 72 61 -191 76 101 air
execute if score peg_state peg_bloqueio matches 0 run fill -199 71 50 -189 71 61 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -199 77 50 -189 77 61 sandstone
execute if score peg_state peg_bloqueio matches 0 run setblock -194 73 49 torch
execute if score peg_state peg_bloqueio matches 0 run setblock -197 73 63 torch
execute if score peg_state peg_bloqueio matches 0 run setblock -191 73 63 torch
# Expandido de sprint4_camaras_educativas.mcfunction
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide][Sprint 4] Criando camaras internas educativas."}]}
execute if score peg_state peg_bloqueio matches 0 run fill -204 73 103 -184 81 123 air
execute if score peg_state peg_bloqueio matches 0 run fill -206 72 101 -182 72 125 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -206 82 101 -182 82 125 sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -206 73 101 -182 81 125 sandstone outline
execute if score peg_state peg_bloqueio matches 0 run setblock -194 73 113 gold_block
execute if score peg_state peg_bloqueio matches 0 run setblock -202 74 113 lectern
execute if score peg_state peg_bloqueio matches 0 run setblock -186 74 113 lectern
execute if score peg_state peg_bloqueio matches 0 run setblock -194 75 124 sea_lantern
execute if score peg_state peg_bloqueio matches 0 run setblock -194 79 124 sea_lantern
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide][Educativo] Camara pronta: use lecterns para registrar conteudos sobre engenharia, historia e geometria."}]}
# Expandido de sprint5_polimento_validacao.mcfunction
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=100] {"rawtext":[{"text":"[Piramide][Sprint 5] Polimento concluido. Validacao visual ainda e recomendada porque o precheck e por amostragem."}]}
execute if score peg_state peg_bloqueio matches 0 run fill -200 71 45 -188 71 50 smooth_sandstone
execute if score peg_state peg_bloqueio matches 0 run fill -201 70 41 -187 70 45 sandstone
execute if score peg_state peg_bloqueio matches 0 run setblock -200 72 47 torch
execute if score peg_state peg_bloqueio matches 0 run setblock -188 72 47 torch
execute if score peg_state peg_bloqueio matches 0 run setblock -200 72 41 torch
execute if score peg_state peg_bloqueio matches 0 run setblock -188 72 41 torch
execute if score peg_state peg_bloqueio matches 0 run effect @a[x=-194,y=69,z=111,r=100] slow_falling 40 1 true
execute if score peg_state peg_bloqueio matches 0 run tp @a[x=-194,y=69,z=111,r=100] -194 134 111
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[x=-194,y=69,z=111,r=140] {"rawtext":[{"text":"[Piramide] Montagem absoluta concluida. Valide visualmente a silhueta e camaras."}]}
