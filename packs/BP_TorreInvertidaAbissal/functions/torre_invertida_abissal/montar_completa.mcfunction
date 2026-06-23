# Montagem completa da Torre Invertida Abissal
# Execute em area livre, no centro escolhido para a torre.
# Sugestao MCP registrada: /tp @s -373 80 368 antes de executar esta funcao.

tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Montagem completa iniciada. Confirme que voce esta em area livre; a torre sera criada relativa a sua posicao atual."}]}
function torre_invertida_abissal/init
function torre_invertida_abissal/blocagem_sprint1
function torre_invertida_abissal/superficie_sprint2
function torre_invertida_abissal/eixo_aneis_sprint3
function torre_invertida_abissal/laboratorios_sprint4
function torre_invertida_abissal/bioma_arquivo_nucleo_sprint5
function torre_invertida_abissal/polimento_sprint6
tellraw @s {"rawtext":[{"text":"[TorreInvertidaAbissal] Montagem completa finalizada. Valide acesso, iluminacao, quedas, retorno e ausencia de conflito com construcoes existentes."}]}
