# Diagnostico publico: amostra o local atual via Script API e registra APROVADO/BLOQUEADO no bedrock.log.
# Execute com os pes no chao, no centro desejado, antes de executar montar_completa.
tellraw @s {"rawtext":[{"text":"[Piramide][Diagnostico] Iniciando varredura do centro atual. Aguarde e confira o bedrock.log por [Piramide][Diagnostico]."}]}
execute as @s at @s run scriptevent piramide:diagnosticar_local centro_atual
