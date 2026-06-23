# Torre Invertida Abissal — Sprint 3: eixo vertical e anéis de exploração

## Entrega executada
A Sprint 3 transforma a Torre Invertida Abissal em uma experiência vertical explorável por meio de uma função de construção para mundo de teste, sem texturas PNG. Ela deve ser executada após as Sprints 1 e 2, usando a mesma origem relativa.

## Função entregue
- `/function torre_invertida_abissal/eixo_aneis_sprint3`

A função cria o eixo central aberto, três anéis exploráveis, salas laterais, rotas alternativas, conexões verticais e pontos de segurança para queda.

## Elementos construídos
- **Eixo central aberto:** poço vertical em `air` com moldura de `deepslate_bricks` e `cracked_deepslate_bricks`, coluna de água central e marcadores luminosos em alturas diferentes.
- **Mitigação de quedas:** plataformas intermediárias em alturas distintas, piscinas de água no fundo e pontos de recuperação distribuídos ao longo da descida.
- **Anel 1 — Ecos Azuis:** corredor circular inicial com quatro acessos cardeais, salas laterais, checkpoint azul e leitura de orientação leve.
- **Anel 2 — Pontes Âmbar:** anel intermediário com passarelas de cobre, guarda-corpos, rotas alternativas e checkpoint âmbar para destacar mudança de camada.
- **Anel 3 — Cristal Verde:** anel profundo com amethyst blocks, áreas de descanso e checkpoint verde para preparar a transição às áreas abissais futuras.
- **Conexões verticais:** escadas, scaffolding, água, passarelas e plataformas que permitem alternar entre caminhos sem apagar a rota principal.
- **Orientação por cores:** checkpoints em azul, âmbar e verde para indicar progressão vertical e ajudar o jogador a se localizar.

## Rota esperada do jogador
1. Entrar pela superfície criada nas Sprints 1 e 2.
2. Olhar para o eixo central e perceber a profundidade por causa da água, luzes e plataformas em alturas diferentes.
3. Acessar o **Anel 1 — Ecos Azuis** como primeira camada explorável.
4. Descer por escada, scaffolding, água ou passarelas até o **Anel 2 — Pontes Âmbar**.
5. Continuar até o **Anel 3 — Cristal Verde**, usando as cores como referência de progressão.
6. Retornar por rotas verticais ou usar água/plataformas para recuperar quedas sem depender de comandos.

## Critérios de aceite da Sprint 3
- O jogador percebe profundidade real ao olhar para cima ou para baixo no eixo central.
- Existem três anéis exploráveis com variação visual, salas laterais e checkpoints por cor.
- Há rotas alternativas por escadas, água, scaffolding, túneis e passarelas.
- Quedas acidentais são mitigadas por água, plataformas intermediárias e molduras naturais.
- A função não adiciona arquivos PNG nem depende de textura customizada.

## Como validar em mundo de teste
1. Ativar os packs `BP_TorreInvertidaAbissal` e `RP_TorreInvertidaAbissal` no mundo de teste.
2. Posicionar o operador no mesmo centro usado nas Sprints anteriores.
3. Executar `/function torre_invertida_abissal/blocagem_sprint1`, se a blocagem ainda não existir.
4. Executar `/function torre_invertida_abissal/superficie_sprint2`, se a superfície ainda não existir.
5. Executar `/function torre_invertida_abissal/eixo_aneis_sprint3`.
6. Validar profundidade visual, legibilidade das cores, rotas alternativas e segurança das quedas.

## Pós-conclusão
- **O que foi feito:** criada a função de Sprint 3 para eixo vertical e anéis de exploração; adicionados poço central, três anéis por cor, salas laterais, passarelas, escadas, scaffolding, água de segurança, plataformas intermediárias e checkpoints visuais; manifests BP/RP atualizados para `0.3.0`.
- **O que ficou faltando:** executar e ajustar em mundo Bedrock de teste com avaliação visual real, especialmente altura dos acessos, comportamento das escadas/scaffolding e clareza dos retornos.
- **Impedimentos/bloqueios:** sem validação bloco-a-bloco no mundo ativo por limitação do MCP remoto/LevelDB já registrada; a entrega permanece como função versionada para execução controlada em mundo de teste.
