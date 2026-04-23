# Sprint 2 - desbloqueio final por progresso e qualidade de desempenho
execute as @a[tag=ilhlog_fase_a,tag=ilhlog_fase_b,tag=ilhlog_fase_c,tag=ilhlog_fase_d,tag=!ilhlog_final] run tag @s add ilhlog_final

execute as @a[tag=ilhlog_final,scores={ilhlog_erros=..1}] run title @s title §aTrilha concluida
execute as @a[tag=ilhlog_final,scores={ilhlog_erros=..1}] run title @s subtitle §fDesempenho >= 80% de acertos
execute as @a[tag=ilhlog_final,scores={ilhlog_erros=..1}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Parabens! Voce concluiu a trilha com desempenho recomendado para avancar."}]}

execute as @a[tag=ilhlog_final,scores={ilhlog_erros=2..}] run title @s title §eTrilha concluida
execute as @a[tag=ilhlog_final,scores={ilhlog_erros=2..}] run title @s subtitle §fRevise os conceitos antes do proximo bloco
execute as @a[tag=ilhlog_final,scores={ilhlog_erros=2..}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Trilha concluida, mas com mais de 1 erro. Recomendacao: revisar fases para consolidar base."}]}

execute as @a unless entity @s[tag=ilhlog_fase_a,tag=ilhlog_fase_b,tag=ilhlog_fase_c,tag=ilhlog_fase_d] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Final bloqueado: conclua as fases A-D."}]}
