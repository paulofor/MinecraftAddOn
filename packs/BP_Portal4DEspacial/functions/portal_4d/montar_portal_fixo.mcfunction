# Sprint 15 - montagem do Portal 4D em coordenada canonica.
# Pode ser executada de qualquer lugar por operador no Overworld; usa altura segura no ceu para evitar agua/terreno.
# Centro/base canonico do portal: 0 128 32. Ponto seguro de chegada: 0 129 34.

function portal_4d/init
execute positioned 0 128 32 run fill ~-7 ~-1 ~-7 ~7 ~8 ~7 air
execute positioned 0 128 32 run function portal_4d/construir_portal
function portal_4d/construir_arena_4d
function portal_4d/polimento_sprint8
tellraw @s {"rawtext":[{"text":"[Portal4D] Portal fixo montado/atualizado em 0 128 32. Use /function portal_4d/ir_para_portal para voltar a ele de qualquer lugar."}]}
