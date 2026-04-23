# Sprint 1 - desbloqueio final por progresso
execute as @a[tag=ilhlog_fase_a,tag=ilhlog_fase_b,tag=ilhlog_fase_c,tag=ilhlog_fase_d,tag=!ilhlog_final] run tag @s add ilhlog_final
execute as @a[tag=ilhlog_final] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Trilha MVP concluida! Revise os conceitos e avance para os proximos modulos."}]}
execute as @a unless entity @s[tag=ilhlog_fase_a,tag=ilhlog_fase_b,tag=ilhlog_fase_c,tag=ilhlog_fase_d] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Final bloqueado: conclua as fases A-D."}]}
