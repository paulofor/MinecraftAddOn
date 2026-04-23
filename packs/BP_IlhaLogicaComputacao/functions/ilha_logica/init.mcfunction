# Sprint 3 - inicializacao canônica da trilha (Conjuntos + Logica Proposicional)
scoreboard objectives add ilhlog_progresso dummy
scoreboard objectives add ilhlog_acertos dummy
scoreboard objectives add ilhlog_erros dummy
scoreboard objectives add ilhlog_lp_progresso dummy

say [IlhaLogica] Objetivos de progresso inicializados (base e bloco proposicional).
execute as @a at @s run function ilha_logica/visual_hub
say [IlhaLogica] Hub visual da ilha preparado para os jogadores ativos.
