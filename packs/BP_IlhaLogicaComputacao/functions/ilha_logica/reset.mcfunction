# Sprint 3 - reset operacional completo
scoreboard players reset @a ilhlog_progresso
scoreboard players reset @a ilhlog_acertos
scoreboard players reset @a ilhlog_erros
scoreboard players reset @a ilhlog_lp_progresso

tag @a remove ilhlog_fase_a
tag @a remove ilhlog_fase_b
tag @a remove ilhlog_fase_c
tag @a remove ilhlog_fase_d
tag @a remove ilhlog_final
tag @a remove ilhlog_lp_intro
tag @a remove ilhlog_lp_tabela
tag @a remove ilhlog_lp_final

tellraw @a {"rawtext":[{"text":"[IlhaLogica] Progresso e tags resetados (Conjuntos + Logica Proposicional)."}]}
