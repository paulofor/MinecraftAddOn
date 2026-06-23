# Torre Invertida Abissal — Sprint 2: superfície e entrada monumental

## Entrega executada
A Sprint 2 detalha a primeira impressão da Torre Invertida Abissal por meio de uma função de construção para mundo de teste, sem texturas PNG. Ela deve ser executada após a blocagem da Sprint 1, usando a mesma origem relativa.

## Função entregue
- `/function torre_invertida_abissal/superficie_sprint2`

A função cria a área externa jogável da superfície, incluindo cratera reforçada, ponte principal, portal arquitetônico, pátio seguro, pontos de interesse, torres laterais, correntes decorativas, sinalização e rotas de retorno.

## Elementos construídos
- **Cratera externa:** bordas em `stone_bricks`, `mossy_stone_bricks`, `tuff`, `cobbled_deepslate` e `deepslate_tiles`, mantendo leitura de abertura central.
- **Ponte principal norte:** caminho largo em `deepslate_bricks` e `smooth_stone_slab`, com muretas, cobre e iluminação por `sea_lantern`.
- **Entrada monumental:** portal de cobre/cobre exposto com vão central, lectern, lanternas e correntes.
- **Área segura inicial:** pátio no acesso norte com campfire, barrels, iluminação e sinalização de orientação.
- **Pontos de interesse antes da descida:** mirante oeste, acampamento leste e arco rachado sul.
- **Elementos de escala:** torres laterais de cobre oxidado, arco elevado e correntes suspensas.
- **Pontos de retorno:** ponte de saída, escadas laterais, plataformas intermediárias e poço de água para recuperação de quedas próximas à entrada.

## Rota esperada do jogador
1. Aproximar-se pelo pátio norte iluminado.
2. Ler a sinalização inicial e atravessar a ponte principal.
3. Entrar pelo portal monumental.
4. Explorar ao menos três pontos de interesse antes da descida: mirante oeste, acampamento leste e arco rachado sul.
5. Retornar pela ponte ou por rotas laterais de escada/plataforma, sem depender de comandos.

## Critérios de aceite da Sprint 2
- A entrada fica visível e convidativa por causa da ponte iluminada, do beacon e do portal monumental.
- A superfície contém pelo menos três pontos de interesse exploráveis antes da descida.
- O jogador tem alternativas de saída e recuperação: ponte principal, escadas laterais e água de mitigação.
- A função não adiciona arquivos PNG nem depende de textura customizada.

## Como validar em mundo de teste
1. Ativar os packs `BP_TorreInvertidaAbissal` e `RP_TorreInvertidaAbissal` no mundo de teste.
2. Posicionar o operador no mesmo centro usado para a Sprint 1.
3. Executar `/function torre_invertida_abissal/blocagem_sprint1`, se a blocagem ainda não existir.
4. Executar `/function torre_invertida_abissal/superficie_sprint2`.
5. Validar se a entrada é legível à distância, se os três POIs são encontrados antes da descida e se é possível sair sem comandos.

## Pós-conclusão
- **O que foi feito:** criada a função de Sprint 2 para superfície e entrada monumental; adicionados cratera externa detalhada, ponte principal, portal arquitetônico, pátio seguro, mirante, acampamento, arco rachado, torres laterais, correntes, sinalização e pontos de retorno; manifests BP/RP atualizados para `0.2.0`.
- **O que ficou faltando:** executar e ajustar em mundo Bedrock de teste com avaliação visual real, especialmente largura da ponte, legibilidade das placas e segurança das quedas.
- **Impedimentos/bloqueios:** sem validação bloco-a-bloco no mundo ativo por limitação do MCP remoto/LevelDB já registrada; a entrega permanece como função versionada para execução controlada em mundo de teste.
