# Compatibilidade: monta somente o portal local. O Planeta Partido e criado pelo script na dimensao customizada.
# Para montagem administrativa segura e absoluta, prefira scriptevent portal4d:montar_coordenada X Y Z raio.
function portal_4d/init
tellraw @s {"rawtext":[{"text":"[Portal4D] Use a montagem parametrizada por coordenadas; nenhuma arena antiga no Overworld sera criada."}]}
