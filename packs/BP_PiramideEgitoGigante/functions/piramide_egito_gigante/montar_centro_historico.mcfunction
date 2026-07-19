# Atalho operacional para continuar a Piramide no centro historico ja preparado.
# Use somente se a area/fundacao existente for a do centro -194 69 111.
tellraw @s {"rawtext":[{"text":"[Piramide] Montando no centro historico preparado -194 69 111. Se sua area foi preparada em outro Y, pare e use /execute positioned <X> <Y> <Z> run function piramide_egito_gigante/montar_completa."}]}
execute positioned -194 69 111 run function piramide_egito_gigante/montar_completa
