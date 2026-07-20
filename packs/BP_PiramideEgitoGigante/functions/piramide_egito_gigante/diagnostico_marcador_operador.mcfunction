# Diagnostico visual reforcado para validar dimensao/posicao vista pelo operador.
# Baseado na captura do operador em 2026-07-20: Posicao aproximada -195 71 114.
# Forca execucao no overworld e usa IDs minecraft:* para reduzir ambiguidade de comando.
tellraw @a {"rawtext":[{"text":"[Piramide][Diagnostico] Criando pilar visual no overworld em -195 72 114 para validar comandos de bloco."}]}
execute in overworld run setblock -195 72 114 minecraft:gold_block
execute in overworld run setblock -195 73 114 minecraft:sea_lantern
execute in overworld run setblock -195 74 114 minecraft:emerald_block
execute in overworld run setblock -195 75 114 minecraft:redstone_block
execute in overworld run setblock -195 76 114 minecraft:lapis_block
execute in overworld run setblock -195 77 114 minecraft:diamond_block
execute in overworld run setblock -196 72 114 minecraft:torch
execute in overworld run setblock -194 72 114 minecraft:torch
tellraw @a {"rawtext":[{"text":"[Piramide][Diagnostico] Pilar enviado para -195 72 114. Se nao aparecer, investigar dimensao/execucao/persistencia antes da Piramide."}]}
