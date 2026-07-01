# Prechecagem por amostragem antes da Piramide Egito Gigante.
# Area estimada: X/Z de ~-60 a ~60; subsolo preparado ate ~-2; altura maxima construida ~58 e volume limpo ate ~70.
# Limite conhecido: esta trava usa amostragem, nao varredura completa; valide visualmente se nao ha construcao importante dentro da area.
scoreboard objectives add peg_agua dummy
scoreboard players set @s peg_agua 0
execute if block ~ ~-1 ~ water run scoreboard players add @s peg_agua 1
execute if block ~-60 ~-1 ~-60 water run scoreboard players add @s peg_agua 1
execute if block ~60 ~-1 ~-60 water run scoreboard players add @s peg_agua 1
execute if block ~-60 ~-1 ~60 water run scoreboard players add @s peg_agua 1
execute if block ~60 ~-1 ~60 water run scoreboard players add @s peg_agua 1
execute if block ~0 ~-1 ~-60 water run scoreboard players add @s peg_agua 1
execute if block ~0 ~-1 ~60 water run scoreboard players add @s peg_agua 1
execute if block ~-60 ~-1 ~0 water run scoreboard players add @s peg_agua 1
execute if block ~60 ~-1 ~0 water run scoreboard players add @s peg_agua 1
execute if block ~ ~-6 ~ water run scoreboard players add @s peg_agua 1
execute if block ~-45 ~-6 ~-45 water run scoreboard players add @s peg_agua 1
execute if block ~45 ~-6 ~-45 water run scoreboard players add @s peg_agua 1
execute if block ~-45 ~-6 ~45 water run scoreboard players add @s peg_agua 1
execute if block ~45 ~-6 ~45 water run scoreboard players add @s peg_agua 1
execute if score @s peg_agua matches 0 run tellraw @s {"rawtext":[{"text":"[Piramide][TRAVA] Precheck aprovado: pontos amostrados nao indicam agua. Preparando terreno antes da montagem."}]}
