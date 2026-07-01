# Funcao publica: valida agua, prepara terreno e so entao constroi a Piramide Egito Gigante.
function piramide_egito_gigante/precheck_ambiente
execute if score @s peg_bloqueio matches 0 run function piramide_egito_gigante/preparar_terreno
execute if score @s peg_bloqueio matches 0 run function piramide_egito_gigante/construir_estrutura
execute unless score @s peg_bloqueio matches 0 run tellraw @s {"rawtext":[{"text":"[Piramide][TRAVA] Montagem bloqueada: agua ou falta de suporte solido detectada em ponto de amostragem. Escolha area seca/desertica, com os pes no chao e longe de rios/oceanos, e execute novamente."}]}
