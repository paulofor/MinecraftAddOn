# Prechecagem por amostragem antes da Piramide Egito Gigante.
# Area estimada: X/Z de ~-60 a ~60; subsolo preparado ate ~-8; altura maxima construida ~58 e volume limpo ate ~70.
# Limite conhecido: esta trava usa amostragem, nao varredura completa; valide visualmente se nao ha construcao importante dentro da area.
# A funcao deve ser executada com o jogador no centro desejado e com os pes sobre terreno solido/seco, nao voando sobre a area.
scoreboard objectives add peg_agua dummy
scoreboard objectives add peg_bloqueio dummy
scoreboard players set @s peg_agua 0
scoreboard players set @s peg_bloqueio 0
execute if block ~ ~-1 ~ water run scoreboard players add @s peg_agua 1
execute if block ~ ~-1 ~ lava run scoreboard players add @s peg_agua 1
execute if block ~-60 ~-1 ~-60 water run scoreboard players add @s peg_agua 1
execute if block ~-60 ~-1 ~-60 lava run scoreboard players add @s peg_agua 1
execute if block ~60 ~-1 ~-60 water run scoreboard players add @s peg_agua 1
execute if block ~60 ~-1 ~-60 lava run scoreboard players add @s peg_agua 1
execute if block ~-60 ~-1 ~60 water run scoreboard players add @s peg_agua 1
execute if block ~-60 ~-1 ~60 lava run scoreboard players add @s peg_agua 1
execute if block ~60 ~-1 ~60 water run scoreboard players add @s peg_agua 1
execute if block ~60 ~-1 ~60 lava run scoreboard players add @s peg_agua 1
execute if block ~0 ~-1 ~-60 water run scoreboard players add @s peg_agua 1
execute if block ~0 ~-1 ~-60 lava run scoreboard players add @s peg_agua 1
execute if block ~0 ~-1 ~60 water run scoreboard players add @s peg_agua 1
execute if block ~0 ~-1 ~60 lava run scoreboard players add @s peg_agua 1
execute if block ~-60 ~-1 ~0 water run scoreboard players add @s peg_agua 1
execute if block ~-60 ~-1 ~0 lava run scoreboard players add @s peg_agua 1
execute if block ~60 ~-1 ~0 water run scoreboard players add @s peg_agua 1
execute if block ~60 ~-1 ~0 lava run scoreboard players add @s peg_agua 1
execute if block ~ ~-6 ~ water run scoreboard players add @s peg_agua 1
execute if block ~ ~-6 ~ lava run scoreboard players add @s peg_agua 1
execute if block ~-45 ~-6 ~-45 water run scoreboard players add @s peg_agua 1
execute if block ~-45 ~-6 ~-45 lava run scoreboard players add @s peg_agua 1
execute if block ~45 ~-6 ~-45 water run scoreboard players add @s peg_agua 1
execute if block ~45 ~-6 ~-45 lava run scoreboard players add @s peg_agua 1
execute if block ~-45 ~-6 ~45 water run scoreboard players add @s peg_agua 1
execute if block ~-45 ~-6 ~45 lava run scoreboard players add @s peg_agua 1
execute if block ~45 ~-6 ~45 water run scoreboard players add @s peg_agua 1
execute if block ~45 ~-6 ~45 lava run scoreboard players add @s peg_agua 1
execute if score @s peg_agua matches 1.. run scoreboard players add @s peg_bloqueio 1
execute if block ~ ~-1 ~ air run scoreboard players add @s peg_bloqueio 1
execute if block ~ ~-8 ~ air run scoreboard players add @s peg_bloqueio 1
execute if block ~-60 ~-8 ~-60 air run scoreboard players add @s peg_bloqueio 1
execute if block ~60 ~-8 ~-60 air run scoreboard players add @s peg_bloqueio 1
execute if block ~-60 ~-8 ~60 air run scoreboard players add @s peg_bloqueio 1
execute if block ~60 ~-8 ~60 air run scoreboard players add @s peg_bloqueio 1
execute if block ~0 ~-8 ~-60 air run scoreboard players add @s peg_bloqueio 1
execute if block ~0 ~-8 ~60 air run scoreboard players add @s peg_bloqueio 1
execute if block ~-60 ~-8 ~0 air run scoreboard players add @s peg_bloqueio 1
execute if block ~60 ~-8 ~0 air run scoreboard players add @s peg_bloqueio 1
execute if score @s peg_bloqueio matches 0 run tellraw @s {"rawtext":[{"text":"[Piramide][TRAVA] Precheck aprovado: amostras sem agua/lava e jogador com suporte no centro. Relevo natural sera preenchido ate Y-8 antes da montagem."}]}
execute if score @s peg_bloqueio matches 1.. run tellraw @s {"rawtext":[{"text":"[Piramide][TRAVA] Precheck bloqueado: detectei agua/lava amostrada, jogador sem bloco sob os pes ou terreno sem apoio ate Y-8. Fique no centro de area seca, com os pes no chao, e tente novamente."}]}
