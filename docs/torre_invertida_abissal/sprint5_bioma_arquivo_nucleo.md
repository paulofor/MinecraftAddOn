# Sprint 5 — Bioma abissal, arquivo e núcleo final

## Objetivo
Construir o clímax visual e narrativo da Torre Invertida Abissal, diferenciando a parte final das áreas anteriores e oferecendo uma conclusão clara com retorno seguro ao exterior.

## Função entregue
Executar após as Sprints 1 a 4, na mesma origem relativa e somente em mundo de teste/área livre:

```mcfunction
/function torre_invertida_abissal/bioma_arquivo_nucleo_sprint5
```

## Elementos construídos

### Jardim bioluminescente
- Caverna ampla profunda em torno de `y -112` a `y -94`, com contorno de deepslate/blackstone.
- Lago central com iluminação submersa, vidro azul, conduit simbólico e cristais de ametista.
- Ilhas de warped nylium, fungos e raízes para criar contraste bioluminescente sem textura PNG customizada.
- Trilhas cardeais iluminadas para manter orientação e reduzir perda do jogador.

### Arquivo Abissal
- Biblioteca lateral com bookshelves, lecterns, cartography tables e blocos esmaltados como mapas/pistas simbólicas.
- Galeria de pistas com três lecterns para preparar o desafio final sem exigir conhecimento externo.
- Uso de lã colorida e luzes para reforçar a sequência visual que será lida no Núcleo da Gravidade.

### Núcleo da Gravidade
- Câmara final em blackstone, deepslate, obsidian, crying obsidian, ametista, sea lanterns, beacon e lodestone.
- Artefato central vertical com vidro roxo e end rods, marcando o ponto de conclusão da exploração.
- Desafio final observacional com quatro ecos coloridos, baseado nas pistas visuais do Arquivo Abissal.
- Baú de recompensa simbólica após a sequência final.

### Retorno seguro
- Elevador de água protegido do núcleo até a superfície, com moldura de deepslate e iluminação em níveis intermediários.
- Plataforma de saída superior com placa e beacon para indicar conclusão e caminho de retorno.

## Rota esperada do jogador
1. Chegar ao terceiro anel profundo criado na Sprint 3.
2. Entrar no Jardim Bioluminescente e identificar que a atmosfera mudou.
3. Explorar o Arquivo Abissal para ler pistas sobre a origem da torre.
4. Acessar o Núcleo da Gravidade e observar a sequência dos quatro ecos.
5. Encontrar a recompensa simbólica e usar o elevador de água para retornar à superfície.

## Critérios de aceite da Sprint 5
- A parte final usa paleta e iluminação distintas das áreas anteriores.
- O jogador encontra uma conclusão visual/narrativa clara no Núcleo da Gravidade.
- O retorno ao exterior não depende de comandos administrativos.
- Não há textura PNG nova; a entrega usa apenas blocos vanilla e arquivos texto.

## Checklist de validação em jogo
1. Executar as funções das Sprints 1 a 5 na mesma origem em mundo de teste.
2. Validar se o jardim não colide com salas profundas da Sprint 4.
3. Confirmar se o Arquivo Abissal é acessível e se os marcadores de pistas são visíveis.
4. Verificar se a câmara do núcleo tem leitura de clímax e recompensa perceptível.
5. Testar o elevador de água do núcleo até a superfície.
6. Ajustar dimensões/iluminação após playtest, se necessário.

## Pendências conhecidas
- Preencher conteúdo rico dos lecterns/baús se houver pipeline controlado para NBT/loot em sprint futura.
- Validar colisões e ritmo de navegação em mundo Bedrock real após execução manual.
- Transformar o desafio final observacional em interação scriptada caso a expansão futura inclua eventos/NPCs.
