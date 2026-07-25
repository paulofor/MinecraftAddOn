# Executada somente quando o precheck bloqueia; informa a amostra que falhou.
execute if block 10 71 92 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Sem apoio: 10 71 92."}]}
execute if block 5 71 88 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Sem apoio: 5 71 88."}]}
execute if block 15 71 88 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Sem apoio: 15 71 88."}]}
execute if block 5 71 96 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Sem apoio: 5 71 96."}]}
execute if block 15 71 96 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Sem apoio: 15 71 96."}]}
execute if block 10 71 88 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Sem apoio: 10 71 88."}]}
execute if block 10 71 96 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Sem apoio: 10 71 96."}]}
execute if block 5 71 92 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Sem apoio: 5 71 92."}]}
execute if block 15 71 92 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Sem apoio: 15 71 92."}]}
execute if block 10 71 92 water run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Agua detectada no centro: 10 71 92."}]}
execute if block 10 71 92 lava run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Lava detectada no centro: 10 71 92."}]}
execute unless block 10 72 92 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Colisao no centro: 10 72 92."}]}
execute unless block 5 72 85 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Colisao no limite: 5 72 85."}]}
execute unless block 15 72 85 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Colisao no limite: 15 72 85."}]}
execute unless block 5 72 96 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Colisao no limite: 5 72 96."}]}
execute unless block 15 72 96 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Colisao no limite: 15 72 96."}]}
execute unless block 10 77 92 air run tellraw @s {"rawtext":[{"text":"[Portal4D][Precheck] Colisao acima do portal: 10 77 92."}]}
