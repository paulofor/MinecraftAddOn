# Sprint 3 - Modulo LP 1: Proposicoes e conectivos (conclusao)
execute as @a[tag=!ilhlog_final] run tellraw @s {"rawtext":[{"text":"[LP Intro] Bloqueada. Conclua o bloco de Conjuntos (A-D) primeiro."}]}
execute as @a[tag=ilhlog_final,tag=ilhlog_lp_intro] run tellraw @s {"rawtext":[{"text":"[LP Intro] Voce ja concluiu esta etapa."}]}
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] run scoreboard players add @s ilhlog_acertos 1
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] run scoreboard players set @s ilhlog_lp_progresso 1
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] run title @s title §dLogica Proposicional
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] run title @s subtitle §fProposicoes e conectivos
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] run tellraw @s {"rawtext":[{"text":"[LP Intro] Correto! Proposicao e uma frase declarativa que pode ser verdadeira (V) ou falsa (F)."}]}
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] run tellraw @s {"rawtext":[{"text":"[LP Intro] Conectivos: ¬ (nao), ∧ (e), ∨ (ou), → (implica)."}]}
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Puzzle desbloqueado: Tabela-Verdade (execute lp_tabela_correta quando resolver)."}]}
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] run tag @s add ilhlog_lp_intro
