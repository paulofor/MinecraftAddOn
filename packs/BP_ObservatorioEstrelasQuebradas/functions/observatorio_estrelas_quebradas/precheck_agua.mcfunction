# Prechecagem anti-agua para evitar que o Observatorio fique flutuando sobre oceano/lago.
# Projetada para a altura recomendada Y=90: a camada ~-27 corresponde ao nivel do mar aproximado (Y=63).
scoreboard objectives add oeq_agua dummy
scoreboard players set @s oeq_agua 0
execute if block ~ ~-27 ~ water run scoreboard players add @s oeq_agua 1
execute if block ~-90 ~-27 ~-90 water run scoreboard players add @s oeq_agua 1
execute if block ~90 ~-27 ~-90 water run scoreboard players add @s oeq_agua 1
execute if block ~-90 ~-27 ~90 water run scoreboard players add @s oeq_agua 1
execute if block ~90 ~-27 ~90 water run scoreboard players add @s oeq_agua 1
execute if block ~0 ~-27 ~-90 water run scoreboard players add @s oeq_agua 1
execute if block ~0 ~-27 ~90 water run scoreboard players add @s oeq_agua 1
execute if block ~-90 ~-27 ~0 water run scoreboard players add @s oeq_agua 1
execute if block ~90 ~-27 ~0 water run scoreboard players add @s oeq_agua 1
execute if block ~0 ~-1 ~0 water run scoreboard players add @s oeq_agua 1
execute if block ~-90 ~-1 ~-90 water run scoreboard players add @s oeq_agua 1
execute if block ~90 ~-1 ~-90 water run scoreboard players add @s oeq_agua 1
execute if block ~-90 ~-1 ~90 water run scoreboard players add @s oeq_agua 1
execute if block ~90 ~-1 ~90 water run scoreboard players add @s oeq_agua 1
execute if score @s oeq_agua matches 0 run tellraw @s {"rawtext":[{"text":"[Observatorio][TRAVA] Prechecagem aprovada: nenhum ponto de amostragem encontrou agua. Iniciando montagem."}]}
