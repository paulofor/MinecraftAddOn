# Diagnostico de presença do barco customizado
say [IlhaLogica][Barco] Iniciando diagnostico do barco 3 jogadores.
execute if entity @e[type=minecraftaddon:barco_3_jogadores] run tellraw @a {"rawtext":[{"text":"[IlhaLogica][Barco] Barco customizado encontrado no mundo."}]}
execute unless entity @e[type=minecraftaddon:barco_3_jogadores] run tellraw @a {"rawtext":[{"text":"[IlhaLogica][Barco] Nenhum barco customizado encontrado no mundo."}]}
