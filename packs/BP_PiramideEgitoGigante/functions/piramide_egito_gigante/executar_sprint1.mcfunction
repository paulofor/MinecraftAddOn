# Funcao publica para executar apenas a Sprint 1 com seguranca.
# Use quando quiser preparar o terreno e montar somente a fundacao/base antes das demais sprints.
function piramide_egito_gigante/precheck_ambiente
execute if score peg_state peg_bloqueio matches 0 run function piramide_egito_gigante/preparar_terreno
execute if score peg_state peg_bloqueio matches 0 run function piramide_egito_gigante/init
execute if score peg_state peg_bloqueio matches 0 run function piramide_egito_gigante/sprint1_base_fundacao
execute if score peg_state peg_bloqueio matches 0 run effect @a[r=80] slow_falling 20 1 true
execute if score peg_state peg_bloqueio matches 0 run tp @a[r=80] ~ ~8 ~
execute if score peg_state peg_bloqueio matches 0 run tellraw @a[r=80] {"rawtext":[{"text":"[Piramide][Sprint 1] Voce foi movido alguns blocos acima da fundacao com queda lenta para evitar sufocamento durante a validacao visual."}]}
execute unless score peg_state peg_bloqueio matches 0 run tellraw @a[r=80] {"rawtext":[{"text":"[Piramide][Sprint 1][TRAVA] Execucao bloqueada: agua/lava amostrada ou jogador sem bloco sob os pes. Escolha area seca/desertica, com os pes no chao, e execute novamente."}]}
