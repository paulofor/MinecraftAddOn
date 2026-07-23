# Fixa uma âncora persistente no ponto atual do jogador para permitir sair do local antes da montagem.
# Por que isso é necessário? O marcador de bloco confirma visualmente o ponto, mas o MCP não recebe coordenadas numéricas do Bedrock; a armor stand nomeada mantém a referência no mundo.
# Area afetada: somente marcação local em ~ ~3 ~ e ~ ~4 ~, além da entidade PEG_Ancora_Prototipo no ponto dos pés.
tellraw @s {"rawtext":[{"text":"[Piramide][Prototipo][Ancora] Fixando PEG_Ancora_Prototipo neste ponto. Voce pode sair do local depois de confirmar o marcador."}]}
summon armor_stand PEG_Ancora_Prototipo ~ ~ ~
setblock ~ ~3 ~ minecraft:diamond_block
setblock ~ ~4 ~ minecraft:sea_lantern
