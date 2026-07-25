# Funcao publica segura para o ponto escolhido pelo operador.
# Por que poderia danificar ou ficar mal posicionada? Agua/lava, borda sem apoio ou colisao dentro de X=5..15, Y=71..77, Z=85..96.
function portal_4d/init
function portal_4d/precheck_local_10_72_92
execute if score @s p4d_local_ok matches 1 run function portal_4d/construir_portal_local_10_72_92
