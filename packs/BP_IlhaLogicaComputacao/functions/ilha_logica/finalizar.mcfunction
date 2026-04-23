# Sprint 3 - encerramento da trilha de conjuntos e ponte para bloco proposicional
execute as @a[tag=ilhlog_fase_a,tag=ilhlog_fase_b,tag=ilhlog_fase_c,tag=ilhlog_fase_d,tag=!ilhlog_final] run tag @s add ilhlog_final

execute as @a[tag=ilhlog_final,scores={ilhlog_erros=..1}] run title @s title §aBloco de Conjuntos concluido
execute as @a[tag=ilhlog_final,scores={ilhlog_erros=..1}] run title @s subtitle §fDesempenho >= 80% de acertos
execute as @a[tag=ilhlog_final,scores={ilhlog_erros=..1}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Parabens! Base de conjuntos consolidada para avancar a Logica Proposicional."}]}

execute as @a[tag=ilhlog_final,scores={ilhlog_erros=2..}] run title @s title §eBloco de Conjuntos concluido
execute as @a[tag=ilhlog_final,scores={ilhlog_erros=2..}] run title @s subtitle §fRevise os conceitos antes do proximo bloco
execute as @a[tag=ilhlog_final,scores={ilhlog_erros=2..}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Conjuntos concluido com necessidade de revisao. Ainda assim, bloco introdutorio de LP pode ser explorado."}]}

execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Proximo passo: /function ilha_logica/modulos/lp_intro_correta"}]}
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_tabela] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Depois execute: /function ilha_logica/modulos/lp_tabela_correta"}]}

execute as @a unless entity @s[tag=ilhlog_fase_a,tag=ilhlog_fase_b,tag=ilhlog_fase_c,tag=ilhlog_fase_d] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Final bloqueado: conclua as fases A-D."}]}
