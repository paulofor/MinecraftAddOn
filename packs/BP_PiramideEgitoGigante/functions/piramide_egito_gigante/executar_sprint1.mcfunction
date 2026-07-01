# Funcao publica para executar apenas a Sprint 1 com seguranca.
# Use quando quiser preparar o terreno e montar somente a fundacao/base antes das demais sprints.
function piramide_egito_gigante/precheck_ambiente
execute if score @s peg_agua matches 0 run function piramide_egito_gigante/preparar_terreno
execute if score @s peg_agua matches 0 run function piramide_egito_gigante/init
execute if score @s peg_agua matches 0 run function piramide_egito_gigante/sprint1_base_fundacao
execute unless score @s peg_agua matches 0 run tellraw @s {"rawtext":[{"text":"[Piramide][Sprint 1][TRAVA] Execucao bloqueada: agua detectada em ponto de amostragem. Escolha area seca/desertica e execute novamente."}]}
