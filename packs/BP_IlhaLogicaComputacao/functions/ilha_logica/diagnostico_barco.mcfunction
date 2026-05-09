# Diagnostico de presença do barco customizado e status visual do hub
say [IlhaLogica][Barco] Iniciando diagnostico do barco 3 jogadores.
execute if entity @e[type=minecraftaddon:barco_3_jogadores] run tellraw @a {"rawtext":[{"text":"[IlhaLogica][Barco] Barco customizado encontrado no mundo."}]}
execute unless entity @e[type=minecraftaddon:barco_3_jogadores] run tellraw @a {"rawtext":[{"text":"[IlhaLogica][Barco] Nenhum barco customizado encontrado no mundo."}]}
execute if block ~ ~-1 ~ sea_lantern run tellraw @a {"rawtext":[{"text":"[IlhaLogica][Barco] Hub visual detectado (sea_lantern abaixo do executor)."}]}
execute unless block ~ ~-1 ~ sea_lantern run tellraw @a {"rawtext":[{"text":"[IlhaLogica][Barco] Hub visual não detectado nesta posição. Vá até a ilha e rode novamente."}]}
