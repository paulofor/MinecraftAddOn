# Sprint 3 - Modulo LP 2: resposta incorreta no puzzle de tabela-verdade
scoreboard players add @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] ilhlog_erros 1
execute as @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] run title @s actionbar §e[LP Tabela] Revise combinacoes V/F em cada conectivo.
tellraw @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] {"rawtext":[{"text":"[LP Tabela] Incorreta. Para p∧q ser verdadeiro, ambos devem ser V."}]}
tellraw @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] {"rawtext":[{"text":"[LP Tabela] Para p∨q basta um V. Na implicacao p→q, apenas V→F gera falso."}]}
