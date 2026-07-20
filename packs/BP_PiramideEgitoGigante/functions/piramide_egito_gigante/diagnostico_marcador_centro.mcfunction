# Diagnostico minimo e reversivel para confirmar que comandos do console/FIFO alteram blocos no mundo.
# Marcador absoluto no centro historico da Piramide: -194 69 111.
# Use somente apos backup; altera poucos blocos acima da plataforma para validar escrita no mundo.
tellraw @a[x=-194,y=69,z=111,r=160] {"rawtext":[{"text":"[Piramide][Diagnostico] Criando marcador pequeno no centro historico para validar setblock via console/FIFO."}]}
setblock -194 72 111 gold_block
setblock -194 73 111 sea_lantern
setblock -193 72 111 emerald_block
setblock -195 72 111 redstone_block
setblock -194 72 110 lapis_block
setblock -194 72 112 chiseled_sandstone
tellraw @a[x=-194,y=69,z=111,r=160] {"rawtext":[{"text":"[Piramide][Diagnostico] Marcador criado em -194 72 111. Se aparecer, comandos de alteracao de blocos estao funcionando."}]}
