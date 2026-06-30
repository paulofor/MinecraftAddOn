# Monta as Sprints 1 a 8 do Observatorio das Estrelas Quebradas com prechecagem anti-agua.
function observatorio_estrelas_quebradas/precheck_agua
execute if score @s oeq_agua matches 0 run function observatorio_estrelas_quebradas/construir_estrutura
execute unless score @s oeq_agua matches 0 run tellraw @s {"rawtext":[{"text":"[Observatorio][TRAVA] Montagem bloqueada: ha agua em pontos de amostragem sob a area prevista. Escolha o centro de uma ilha maior ou uma area seca e execute novamente."}]}
