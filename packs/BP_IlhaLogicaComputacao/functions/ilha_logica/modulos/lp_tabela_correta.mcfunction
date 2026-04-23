# Sprint 3 - Modulo LP 2: puzzle de tabela-verdade (conclusao)
execute as @a[tag=!ilhlog_lp_intro] run tellraw @s {"rawtext":[{"text":"[LP Tabela] Bloqueada. Conclua LP Intro primeiro."}]}
execute as @a[tag=ilhlog_lp_intro,tag=ilhlog_lp_tabela] run tellraw @s {"rawtext":[{"text":"[LP Tabela] Voce ja concluiu o puzzle."}]}
execute as @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] run scoreboard players add @s ilhlog_acertos 1
execute as @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] run scoreboard players set @s ilhlog_lp_progresso 2
execute as @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] run tellraw @s {"rawtext":[{"text":"[LP Tabela] Correto! Exemplo-chave: se p=V e q=F, entao p∧q=F e p∨q=V."}]}
execute as @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] run tellraw @s {"rawtext":[{"text":"[LP Tabela] Na implicacao p→q, so e falso quando p=V e q=F."}]}
execute as @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] run title @s title §aPuzzle concluido
execute as @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] run title @s subtitle §fTabela-verdade dominada
execute as @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] run tag @s add ilhlog_lp_tabela
execute as @a[tag=ilhlog_lp_intro,tag=!ilhlog_lp_tabela] run tag @s add ilhlog_lp_final
