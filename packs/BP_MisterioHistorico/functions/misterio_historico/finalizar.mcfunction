# Sprint 2 - validacao final da investigacao
execute as @a[scores={mh_pistas=..5}] run title @s title §eInvestigação incompleta
execute as @a[scores={mh_pistas=..5}] run title @s subtitle §fEncontrem pelo menos 6 pistas antes de concluir
execute as @a[scores={mh_pistas=..5}] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Final bloqueado: voce tem "},{"score":{"name":"*","objective":"mh_pistas"}},{"text":"/9 pistas. Minimo: 6."}]}

execute as @a[scores={mh_pistas=6..},tag=!mh_conclusao_a,tag=!mh_conclusao_b,tag=!mh_conclusao_c] run title @s title §6Escolha uma versão
execute as @a[scores={mh_pistas=6..},tag=!mh_conclusao_a,tag=!mh_conclusao_b,tag=!mh_conclusao_c] run title @s subtitle §fUse uma funcao de conclusao A, B ou C
execute as @a[scores={mh_pistas=6..},tag=!mh_conclusao_a,tag=!mh_conclusao_b,tag=!mh_conclusao_c] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Evidencias suficientes. Agora escolha: /function misterio_historico/conclusoes/hipotese_a, hipotese_b ou hipotese_c."}]}

execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_a] run title @s title §aInvestigação concluída
execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_a] run title @s subtitle §fVersão defendida: escassez de água
execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_a] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Conclusao A registrada. Debate final: quais 3 evidencias sustentam escassez de agua, e quais evidencias enfraquecem essa versao?"}]}
execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_b] run title @s title §aInvestigação concluída
execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_b] run title @s subtitle §fVersão defendida: conflito político
execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_b] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Conclusao B registrada. Debate final: quais 3 evidencias sustentam conflito politico, e quais evidencias enfraquecem essa versao?"}]}
execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_c] run title @s title §aInvestigação concluída
execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_c] run title @s subtitle §fVersão defendida: falha nos canais
execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_c] run tellraw @s {"rawtext":[{"text":"[MisterioHistorico] Conclusao C registrada. Debate final: quais 3 evidencias sustentam falha tecnica, e quais evidencias mostram participacao de decisoes politicas?"}]}
execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_a] run tag @s add mh_finalizado
execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_b] run tag @s add mh_finalizado
execute as @a[scores={mh_pistas=6..},tag=mh_conclusao_c] run tag @s add mh_finalizado
