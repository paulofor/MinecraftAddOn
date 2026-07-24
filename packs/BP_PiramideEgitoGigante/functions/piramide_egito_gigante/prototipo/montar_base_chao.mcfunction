# Prototipo pequeno e ancorado no chao da Piramide, usando a posição atual do jogador.
# Por que essa construcao poderia danificar ou ficar mal posicionada no mundo? Porque usa coordenadas relativas ao jogador; executar apenas com os pes no chao e depois do precheck visual.
# Area afetada: X/Z ~= -12..+12 ao redor do jogador; Y ~= -1..+6. Volume pequeno, sem plataforma alta e sem megaconstrucao.
# Limitação: precheck visual/manual; se o terreno tiver desnível forte dentro do raio, validar visualmente e limpar com /fill local se necessário.
function piramide_egito_gigante/prototipo/precheck_chao
function piramide_egito_gigante/prototipo/construir_base_pequena
