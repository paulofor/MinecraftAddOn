# Sprint 4 - pergunta final de reflexao pedagogica
execute as @s run tellraw @s {"rawtext":[{"text":"[MisterioHistorico][Reflexao] Qual evidencia mais mudou sua opiniao? Explique por que ela pesou mais que as outras."}]}
execute as @s run tellraw @s {"rawtext":[{"text":"[MisterioHistorico][Reflexao] Antes de finalizar, cite 3 evidencias e diga quais incertezas ainda permanecem."}]}
execute as @s[scores={mh_pistas=..5}] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico][Reflexao] Voce ainda tem poucas pistas. Continue investigando para fortalecer sua argumentacao."}]}
execute as @s[scores={mh_pistas=6..}] run title @s actionbar §eDefenda sua hipótese com 3 evidências
