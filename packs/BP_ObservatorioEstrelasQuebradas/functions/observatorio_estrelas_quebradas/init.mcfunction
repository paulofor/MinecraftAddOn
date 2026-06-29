# Inicializacao do Observatorio das Estrelas Quebradas.
scoreboard objectives add oeq_sprint dummy
scoreboard players set @s oeq_sprint 0
title @s title §bObservatorio das Estrelas Quebradas
title @s subtitle §fAddon educativo por sprints
tellraw @s {"rawtext":[{"text":"[Observatorio] Execute /function observatorio_estrelas_quebradas/montar_completa em uma area livre. A estrutura usa ~180x180 blocos, altura elevada e subsolo."}]}
tellraw @s {"rawtext":[{"text":"[Observatorio] Sem PNG customizado: toda a experiencia usa blocos vanilla, lecterns, luzes e comandos de funcao."}]}
