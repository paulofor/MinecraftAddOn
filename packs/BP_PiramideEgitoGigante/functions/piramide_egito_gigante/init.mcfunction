# Inicializacao da Piramide Egito Gigante.
scoreboard objectives add peg_agua dummy
scoreboard players set @s peg_agua 0
title @s title §6Piramide Egito Gigante
title @s subtitle §fMegaconstrucao educativa com terreno preparado
tellraw @s {"rawtext":[{"text":"[Piramide] Execute /function piramide_egito_gigante/montar_completa em area seca, livre, e com os pes no chao no centro desejado. A obra ocupa X/Z ~121x121, prepara o terreno de Y-2 a Y+58 e limpa ate Y+70."}]}
tellraw @s {"rawtext":[{"text":"[Piramide] Por que essa construcao poderia danificar ou ficar mal posicionada no mundo? Porque o terreno natural e irregular, pode haver agua/lava, construcoes existentes ou desniveis sob a base."}]}
tellraw @s {"rawtext":[{"text":"[Piramide] A funcao publica roda precheck anti-agua antes da limpeza automatica e so depois chama a construcao interna."}]}
tellraw @s {"rawtext":[{"text":"[Piramide] Para executar somente a Sprint 1 com seguranca, use /function piramide_egito_gigante/executar_sprint1."}]}
