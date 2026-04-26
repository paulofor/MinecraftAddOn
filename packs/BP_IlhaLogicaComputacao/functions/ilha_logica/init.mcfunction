# Sprint 3 - inicializacao canônica da trilha (Conjuntos + Logica Proposicional)
scoreboard objectives add ilhlog_progresso dummy
scoreboard objectives add ilhlog_acertos dummy
scoreboard objectives add ilhlog_erros dummy
scoreboard objectives add ilhlog_lp_progresso dummy
scoreboard objectives add ilhlog_melhor_acertos dummy
scoreboard objectives add ilhlog_record_temp dummy
scoreboard objectives add ilhlog_versao_teste dummy

tellraw @a {"rawtext":[{"text":"[IlhaLogica] Objetivos de progresso inicializados (base, bloco proposicional e versoes de caderno)."}]}
function ilha_logica/gerar_versao_teste
execute as @a at @s run function ilha_logica/visual_hub
tellraw @a {"rawtext":[{"text":"[IlhaLogica] Hub visual da ilha preparado para os jogadores ativos."}]}
