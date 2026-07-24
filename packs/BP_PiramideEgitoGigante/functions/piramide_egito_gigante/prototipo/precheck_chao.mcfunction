# Precheck visual do prototipo pequeno da Piramide.
# Por que essa construcao poderia danificar ou ficar mal posicionada no mundo? Porque ainda usa coordenadas relativas ao jogador; se o jogador estiver voando, em arvore, encosta ou borda de agua, partes podem ficar suspensas.
# Area afetada estimada antes da montagem: X/Z ~= -12..+12 em torno do jogador; Y ~= -1..+6. Nao altera subsolo profundo nem altura grande.
# Trava operacional: esta funcao nao constroi; ela exige confirmacao visual do operador com os pes no chao antes de chamar montar_base_chao.
tellraw @s {"rawtext":[{"text":"[Piramide][Prototipo][Precheck] Confirme: pes no chao, area plana/seca, sem construcao importante num raio de 12 blocos. Se estiver ok, use a montagem do prototipo pequeno."}]}
