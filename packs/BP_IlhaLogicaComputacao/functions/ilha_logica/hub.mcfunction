# Sprint 3 - hub com orientacao de dois blocos (Conjuntos e Logica Proposicional)
execute as @a[tag=!ilhlog_fase_a,tag=!ilhlog_fase_b,tag=!ilhlog_fase_c,tag=!ilhlog_fase_d,tag=!ilhlog_final] run scoreboard players set @s ilhlog_progresso 0
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_intro,tag=!ilhlog_lp_tabela,tag=!ilhlog_lp_final] run scoreboard players set @s ilhlog_lp_progresso 0

execute as @a run title @s title §bIlha de Logica e Computacao
execute as @a[tag=!ilhlog_final] run title @s subtitle §fBloco 1: Conjuntos (A → D)
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_final] run title @s subtitle §fBloco 2: Logica Proposicional

execute as @a[tag=!ilhlog_final] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Objetivo atual: concluir 4 fases de Conjuntos com no minimo 80% de acertos (max. 1 erro)."}]}
execute as @a[tag=!ilhlog_final] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Sequencia guiada: A) Pertinencia, B) Subconjuntos, C) Operacoes, D) Produto Cartesiano."}]}

execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_final] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Bloco de Logica Proposicional liberado: Intro + Tabela-Verdade."}]}
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_final] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Use as funcoes do bloco LP para treinar proposicoes, conectivos e avaliacao logica."}]}
execute as @a[tag=ilhlog_lp_final] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Excelente! Voce concluiu Conjuntos + Intro de Logica Proposicional."}]}
