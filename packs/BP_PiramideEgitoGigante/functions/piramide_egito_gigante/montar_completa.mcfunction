# Funcao publica: valida agua, prepara terreno e so entao constroi a Piramide Egito Gigante.
function piramide_egito_gigante/precheck_ambiente
execute if score @s peg_bloqueio matches 0 run function piramide_egito_gigante/preparar_terreno
execute if score @s peg_bloqueio matches 0 run function piramide_egito_gigante/construir_estrutura
execute if score @s peg_bloqueio matches 0 run effect @s slow_falling 40 1 true
execute if score @s peg_bloqueio matches 0 run tp @s ~ ~65 ~
execute if score @s peg_bloqueio matches 0 run tellraw @s {"rawtext":[{"text":"[Piramide] Voce foi movido acima da piramide com queda lenta para evitar sufocamento e dano de queda."}]}
execute unless score @s peg_bloqueio matches 0 run tellraw @s {"rawtext":[{"text":"[Piramide][TRAVA] Montagem bloqueada: agua/lava amostrada ou jogador sem bloco sob os pes. Escolha area seca/desertica, com os pes no chao e longe de rios/oceanos, e execute novamente."}]}
