# Sprint 16 — Planeta Perdido expandido

## Objetivo

Concluir a substituição do cenário legado do Portal 4D e ampliar o Planeta
Perdido para uma aventura monumental, com distâncias de exploração maiores,
três biomas mais ricos, um núcleo mais expressivo e destroços orbitais.

## Investigação de causa raiz

### Por que isso aconteceu?

Uma parte do Portal 4D antigo podia permanecer porque a versão `0.1.36`
disparava todas as fatias de limpeza no mesmo tick e começava a reconstrução
após um atraso fixo de apenas 12 ticks. `runCommandSafe` aceitava tanto a API
síncrona quanto a assíncrona, mas o fluxo não aguardava a conclusão real de
cada `/fill`. Portanto, a ordem escrita no arquivo não garantia a ordem de
conclusão no runtime. Além disso, o envelope `-64..64`, Y=`60..124` foi
definido a partir do Planeta Partido, não como uma margem definitiva para todo
o legado procedural e para uma expansão posterior.

### Evidências consultadas

- feedback visual do operador de que ainda existe uma parte do Portal 4D antigo;
- `docs/registros1.md`, especialmente as Sprints 13–15 e os envelopes anteriores;
- `clearPreviousWorld`, que enfileirava dezenas de comandos no mesmo tick;
- `ensureWorld`, que usava um timeout fixo de 12 ticks antes de construir;
- teste anterior, que verificava apenas a ordem textual das chamadas e não a
  barreira entre limpeza e montagem.

### Causa identificada

A causa raiz é uma barreira de migração incompleta: o código tratava “comando
solicitado” como “limpeza concluída”. O envelope apertado agravava o risco de
resíduos. Apenas ampliar ou cobrir visualmente a área seria contornar o erro;
a correção precisa serializar a limpeza e liberar a construção somente depois
da última fatia.

## Experiência ampliada

- envelope total: X/Z=`-96..96`, Y=`45..150`;
- chegada absoluta: `0 84 -82`;
- buraco negro: centro `0 96 0`, raio 18 e disco de acreção até raio 42;
- Natureza: centro `-62 88 -8`, ilha de raio 20;
- Ruínas: centro `42 96 -48`, ilha de raio 21;
- Máquina: centro `56 82 42`, ilha de raio 21;
- cinco asteroides/destroços em diferentes alturas;
- dois anéis de marcadores orbitais;
- pontes mais longas e objetivo final com feixe até Y=`150`.

A largura do envelope passou de 129 para 193 blocos em X e Z (+49,6% por
eixo); a faixa vertical passou de 65 para 106 blocos (+63,1%).

## Segurança antes da montagem

**Por que essa construção poderia danificar ou ficar mal posicionada no
mundo?** Porque a migração apaga um volume persistente maior; sem dimensão
explícita, chunks carregados, limites validados e ordem determinística, poderia
apagar outra obra, deixar resíduos, construir sobre blocos antigos ou
teleportar o visitante antes do piso existir.

- a dimensão continua fixada em `portal4d:espaco_4d`;
- o precheck valida chegada, núcleo, centros e âncoras no novo envelope;
- quatro `tickingarea` temporárias cobrem os quadrantes da área expandida;
- a limpeza usa 288 fatias de no máximo `49 × 49 × 6 = 14.406` blocos;
- apenas uma fatia é solicitada por tick;
- a construção começa pelo callback da última fatia, sem timeout arbitrário;
- entradas e recuperação aguardam `worldBuilt` por callbacks;
- uma trava `buildInProgress` impede rebuilds concorrentes;
- as quatro áreas temporárias são removidas depois da construção;
- o portal do Overworld não é modificado.

## Limitações conhecidas

- a limpeza é destrutiva para qualquer construção manual dentro do envelope;
- a serialização prioriza consistência e pode levar cerca de 15 segundos, além
  do tempo da montagem, no primeiro carregamento;
- comandos ainda devem ser confirmados pelo `bedrock.log` no runtime real;
- estética, travessia das pontes e desempenho exigem inspeção visual no jogo;
- antes do primeiro deploy `0.1.37`, é obrigatório criar backup do mundo.

## Critérios de aceite

- nenhuma peça visual do laboratório, tesseracto ou Nave Cronos permanece;
- o log registra a conclusão de todas as 288 fatias antes da construção;
- o jogador só chega depois de existir o observatório;
- as três ilhas e as três pedras-ímã são alcançáveis;
- asteroides, anéis, disco e núcleo são legíveis da chegada;
- não há `TypeError`, `SyntaxError`, erro de `/fill` ou tickingarea residual.

## Registro pós-conclusão

- **O que foi feito:** limpeza serializada, envelope expandido, barreira real de
  montagem, entrada aguardando conclusão, escala maior, destroços, anéis,
  pontes e manifests BP/RP `0.1.37`.
- **O que ficou faltando:** backup, deploy/restart, leitura do log e validação
  visual/jogável no servidor real.
- **Impedimentos/bloqueios:** nenhum na implementação local; confirmação final
  depende do Bedrock ativo.

## Próximo passo de validação

Criar backup, publicar BP/RP `0.1.37`, reiniciar uma vez e procurar no log
`Limpeza integral concluída` antes de `Planeta Partido construído`. Entrar só
depois disso e inspecionar todo o envelope. Se houver resíduo, não repetir às
cegas: registrar a coordenada do bloco legado e verificar se está fora do
envelope ou se algum `/fill` falhou.
