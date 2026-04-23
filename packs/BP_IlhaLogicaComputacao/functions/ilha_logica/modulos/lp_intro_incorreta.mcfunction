# Sprint 3 - Modulo LP 1: resposta incorreta
scoreboard players add @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] ilhlog_erros 1
execute as @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] run title @s actionbar §e[LP Intro] Revise: proposicao precisa ter valor V ou F.
tellraw @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] {"rawtext":[{"text":"[LP Intro] Incorreta. Perguntas ou ordens nao sao proposicoes logicas, pois nao recebem V/F."}]}
tellraw @a[tag=ilhlog_final,tag=!ilhlog_lp_intro] {"rawtext":[{"text":"[LP Intro] Exemplo: '2+2=4' e proposicao (V). 'Feche a porta' nao e proposicao."}]}
