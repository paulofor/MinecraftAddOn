# Sprint 1 - hub inicial da ilha
execute as @a[tag=!ilhlog_fase_a,tag=!ilhlog_fase_b,tag=!ilhlog_fase_c,tag=!ilhlog_fase_d,tag=!ilhlog_final] run scoreboard players set @s ilhlog_progresso 0

tellraw @a {"rawtext":[{"text":"[IlhaLogica] Bem-vindo(a)! Trilha MVP: A) Pertinencia, B) Subconjuntos, C) Operacoes, D) Produto Cartesiano."}]}
tellraw @a {"rawtext":[{"text":"[IlhaLogica] Use os botoes/NPCs da ilha para responder cada fase e desbloquear a revisao final."}]}
