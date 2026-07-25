# Monta com precheck no novo ponto seco e teleporta somente se aprovado.
function portal_4d/montar_portal_local_10_72_92
execute if score #portal_10_72_92 p4d_local_ok matches 1 run teleport @s 10 73 94
execute if score #portal_10_72_92 p4d_local_ok matches 1 run title @s title §bPortal 4D localizado
execute if score #portal_10_72_92 p4d_local_ok matches 1 run title @s subtitle §fEntrada seca: 10 73 94
