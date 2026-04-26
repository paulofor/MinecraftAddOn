# Sprint 4 - gera versao nova do teste mantendo tipo de exercicio e nivel de dificuldade
execute as @a run scoreboard players add @s ilhlog_versao_teste 1
execute as @a[scores={ilhlog_versao_teste=5..}] run scoreboard players set @s ilhlog_versao_teste 1

execute as @a[scores={ilhlog_versao_teste=1}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Caderno V1 ativo (novo): A) 7 ∈ {5,7,9}; B) {2,4} ⊆ {1,2,3,4}; C) A={1,2,5}, B={2,6}; D) A={1,3}, B={a,b}."}]}
execute as @a[scores={ilhlog_versao_teste=1}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] LP V1: classificar '8 e par' e avaliar p=V, q=F em ∧, ∨ e →."}]}

execute as @a[scores={ilhlog_versao_teste=2}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Caderno V2 ativo (novo): A) 6 ∈ {2,4,6}; B) {1,5} ⊆ {1,3,5,7}; C) A={0,2,4}, B={2,3}; D) A={2,4}, B={x,y}."}]}
execute as @a[scores={ilhlog_versao_teste=2}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] LP V2: classificar '11 > 20' e avaliar p=F, q=V em ∧, ∨ e →."}]}

execute as @a[scores={ilhlog_versao_teste=3}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Caderno V3 ativo (novo): A) 10 ∈ {8,9,10}; B) {3,6} ⊆ {0,3,6,9}; C) A={3,4,7}, B={4,8}; D) A={5,6}, B={m,n}."}]}
execute as @a[scores={ilhlog_versao_teste=3}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] LP V3: classificar '2+2=5' e avaliar p=V, q=V em ∧, ∨ e →."}]}

execute as @a[scores={ilhlog_versao_teste=4}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] Caderno V4 ativo (novo): A) 12 ∈ {10,11,12}; B) {4,8} ⊆ {2,4,6,8}; C) A={1,4,9}, B={4,5}; D) A={7,8}, B={p,q}."}]}
execute as @a[scores={ilhlog_versao_teste=4}] run tellraw @s {"rawtext":[{"text":"[IlhaLogica] LP V4: classificar '15 e multiplo de 3' e avaliar p=F, q=F em ∧, ∨ e →."}]}
