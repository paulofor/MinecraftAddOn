# Sprint 15 - retorno rapido ao Portal 4D fixo.
# Execute de qualquer lugar para garantir a montagem do portal canonico e teleportar para a entrada.

function portal_4d/montar_portal_fixo
teleport @s 0 97 36
title @s title §bPortal 4D localizado
title @s subtitle §fEntrada fixa: 0 97 36
tellraw @s {"rawtext":[{"text":"[Portal4D] Voce foi levado para a entrada do portal fixo. Caminhe pela base roxa entre as colunas; nao precisa ficar exatamente no centro."}]}
