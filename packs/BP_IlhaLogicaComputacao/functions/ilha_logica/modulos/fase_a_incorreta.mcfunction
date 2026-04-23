# Sprint 2 - Fase A resposta incorreta com feedback explicativo
scoreboard players add @a[tag=!ilhlog_fase_a] ilhlog_erros 1
execute as @a[tag=!ilhlog_fase_a] run title @s actionbar §e[Fase A] Revise: elemento x conjunto.
tellraw @a[tag=!ilhlog_fase_a] {"rawtext":[{"text":"[Fase A] Incorreta. Em pertinencia, comparamos um elemento com um conjunto: 3 ∈ {1,2,3}, mas 4 ∉ {1,2,3}."}]}
tellraw @a[tag=!ilhlog_fase_a] {"rawtext":[{"text":"[Fase A] Tente de novo identificando se o item aparece literalmente dentro do conjunto."}]}
