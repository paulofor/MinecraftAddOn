# Sprint 15 - montagem do Portal 4D em coordenada canonica.
# Pode ser executada de qualquer lugar por operador no Overworld.
# Centro/base canonico do portal: 0 96 32. Ponto seguro de chegada: 0 97 36.

function portal_4d/init
execute positioned 0 96 32 run function portal_4d/construir_portal
function portal_4d/construir_arena_4d
function portal_4d/polimento_sprint8
tellraw @s {"rawtext":[{"text":"[Portal4D] Portal fixo montado/atualizado em 0 96 32. Use /function portal_4d/ir_para_portal para voltar a ele de qualquer lugar."}]}
