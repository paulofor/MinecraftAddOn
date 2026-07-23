# Monta o protótipo pequeno no ponto salvo pela entidade PEG_Ancora_Prototipo.
# Por que essa construção poderia ficar mal posicionada? Se houver mais de uma âncora com o mesmo nome ou se a âncora tiver sido movida/quebrada, a montagem pode usar o ponto errado.
# Area afetada: X/Z ~= -12..+12 ao redor da âncora; Y ~= -1..+6. A Pirâmide gigante continua bloqueada.
tellraw @a {"rawtext":[{"text":"[Piramide][Prototipo][Ancora] Tentando montar no ponto salvo PEG_Ancora_Prototipo. Se nada acontecer, fixe a ancora novamente."}]}
execute as @e[type=armor_stand,name=PEG_Ancora_Prototipo,c=1] at @s run function piramide_egito_gigante/prototipo/construir_base_pequena
