# Funcao interna: executar somente apos precheck aprovado.
execute positioned 10 72 92 run function portal_4d/construir_portal
tellraw @s {"rawtext":[{"text":"[Portal4D] Portal construido no centro 10 72 92. Entrada recomendada: 10 73 94."}]}
