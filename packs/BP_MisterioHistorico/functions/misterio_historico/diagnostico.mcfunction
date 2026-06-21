# Sprint 2 - diagnostico do progresso por jogador
tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Diagnostico da investigacao."}]}
execute as @s run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Pistas registradas: "},{"score":{"name":"*","objective":"mh_pistas"}},{"text":"/9. Minimo para conclusao: 6."}]}
execute as @s[tag=mh_p1] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] ✓ P1 Diario da moradora."}]}
execute as @s[tag=mh_p2] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] ✓ P2 Cisternas secas com reparos."}]}
execute as @s[tag=mh_p3] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] ✓ P3 Aviso da assembleia."}]}
execute as @s[tag=mh_p4] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] ✓ P4 Ata incompleta do conselho."}]}
execute as @s[tag=mh_p5] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] ✓ P5 Chave de comporta quebrada."}]}
execute as @s[tag=mh_p6] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] ✓ P6 Canal bloqueado."}]}
execute as @s[tag=mh_p7] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] ✓ P7 Registro de chuva suficiente."}]}
execute as @s[tag=mh_p8] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] ✓ P8 Rotas de migracao planejadas."}]}
execute as @s[tag=mh_p9] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] ✓ P9 Mural de sintese."}]}
execute as @s[scores={mh_pistas=..5}] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Continue investigando: ainda faltam evidencias para uma conclusao forte."}]}
execute as @s[scores={mh_pistas=6..}] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Evidencias suficientes. Va para a Sala das Tres Versoes e escolha uma conclusao."}]}
