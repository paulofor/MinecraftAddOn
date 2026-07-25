# Busca parametrizada via Script API ao redor do jogador/chunk carregado.
# Raio padrao 16; o script aceita mensagem numerica entre 8 e 32 via scriptevent.
tellraw @s {"rawtext":[{"text":"[Portal4D][Busca] Procurando ponto seco, apoiado e livre em raio de 16 blocos..."}]}
execute as @s at @s run scriptevent portal4d:montar_proximo 16
