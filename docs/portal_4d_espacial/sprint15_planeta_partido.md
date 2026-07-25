# Sprint 15 — Planeta Partido e o Buraco Negro

## Objetivo

Substituir integralmente a Nave Cronos por uma paisagem monumental que possa
ser entendida sem explicação prévia: um buraco negro sempre visível, três
fragmentos de planeta e uma única missão — atravessar as ilhas e reacender o
núcleo.

## Por que isso aconteceu?

A Nave Cronos continuou confusa porque ainda começava por um conceito abstrato.
O jogador precisava interpretar os cenários como tempos diferentes antes de
entender por que deveria interagir com eles. O ambiente parecia uma aula em uma
arena, não um destino extraordinário para explorar.

### Causa raiz

Os projetos anteriores priorizaram o conteúdo a explicar e só depois a
fantasia visual. A correção de causa raiz inverte essa ordem: primeiro uma
silhueta monumental, depois uma missão de uma frase e, por fim, mensagens
opcionais. O buraco negro funciona como referência central permanente e elimina
a necessidade de explicar onde está o objetivo.

### Evidências consultadas

- feedback reiterado do operador sobre o laboratório e a Nave Cronos;
- Sprints 12, 13 e 14 em `docs/registros1.md`;
- código `0.1.35`, que ainda dependia de três consoles e textos temporais;
- opção Planeta Partido registrada e escolhida pelo operador.

## Experiência construída

### Marco central

- buraco negro esférico em `0 90 0`, com raio base de 12 blocos;
- disco de acreção colorido com raio externo de 28 blocos;
- núcleo final energizado com casca luminosa e raio até Y=`124`.

### Observatório de chegada

- chegada absoluta em `0 82 -54`;
- plataforma circular com borda iluminada;
- atril opcional com a missão resumida;
- pedra-ímã de retorno em `0 82 -57`;
- o buraco negro já fica enquadrado à frente do jogador.

### Três fragmentos

1. **Natureza**, centro `-38 83 -6`: ilha de musgo, árvores, água e ponte verde;
2. **Ruínas**, centro `25 87 -32`: colunas quebradas, esfera antiga e ponte laranja;
3. **Máquina**, centro `32 80 28`: torres, beacons, reatores e ponte azul.

Cada fragmento possui uma pedra-ímã em coordenada absoluta. Ao interagir, um
feixe de luz liga a ilha diretamente ao buraco negro. Depois dos três feixes,
o núcleo se acende e dispara o raio orbital final.

## Segurança da megaconstrução

Pergunta obrigatória: **por que essa construção poderia danificar ou ficar mal
posicionada no mundo?** Porque a migração apaga a Nave Cronos e monta mais de
cem blocos de largura em uma dimensão persistente. Um envelope incorreto pode
deixar resíduos, apagar blocos manuais, gerar pontes sem apoio ou colocar o
jogador fora da plataforma.

- dimensão exclusiva: `portal4d:espaco_4d`;
- envelope de limpeza: X=`-64..64`, Y=`60..124`, Z=`-64..64`;
- construção efetiva aproximada: X=`-51..46`, Y=`71..124`, Z=`-63..42`;
- subsolo de segurança limpo até Y=`60`;
- altura máxima: Y=`124`;
- os `/fill` são divididos em quadrantes e fatias de sete blocos, mantendo cada
  comando abaixo do limite de volume;
- um precheck confirma o identificador da dimensão e que marco, chegada,
  centros e âncoras estão dentro do envelope antes de qualquer limpeza;
- uma `tickingarea` temporária de quatro chunks carrega toda a região antes da
  alteração e é removida depois da montagem;
- `runCommand` síncrono é preferido para que a limpeza termine antes da montagem;
- o script só obtém a dimensão pelo identificador customizado explícito;
- observatório, fragmentos, âncoras e pontes usam coordenadas absolutas;
- jogadores que caírem abaixo de Y=`58` retornam automaticamente ao observatório;
- o portal existente no Overworld não é apagado nem reposicionado.

### Limitações conhecidas

- a limpeza não distingue blocos manuais dentro do envelope;
- as pontes são corredores lineares de vidro, não uma varredura completa de
  colisões em cada bloco;
- a composição procedural deve ser inspecionada no jogo para validar silhueta,
  legibilidade das pontes e desempenho do primeiro rebuild;
- o progresso usa tags por jogador, mas os feixes são visuais globais; em
  multiplayer, um jogador pode ver um feixe ativado por outro.

## Critérios de aceite

- o observatório enquadra o buraco negro na chegada;
- as três pontes são visíveis e atravessáveis;
- cada pedra-ímã ativa somente seu fragmento;
- os feixes terminam no núcleo;
- o final só ocorre após os três fragmentos;
- queda abaixo de Y=`58` aciona resgate;
- não há restos visíveis da Nave Cronos;
- não há `TypeError`, `SyntaxError` ou falha de bloco no `bedrock.log`.

## Registro pós-conclusão

- **O que foi feito:** implementação textual completa do Planeta Partido,
  remoção da mecânica temporal, três fragmentos, pontes, missão, final, resgate,
  documentação, testes e versionamento BP/RP `0.1.36`.
- **O que ficou faltando:** backup, deploy/restart, inspeção visual, travessia
  real das pontes e validação do `bedrock.log` no servidor Bedrock.
- **Impedimentos/bloqueios:** nenhum para implementação local; a validação
  estética e de desempenho depende do runtime real.

## Próximo passo de validação

Criar backup antes do primeiro deploy `0.1.36`, reiniciar uma única vez e
validar, nesta ordem: construção do planeta, chegada segura, Natureza, Ruínas,
Máquina, três feixes, raio final e retorno. Se o rebuild falhar ou ficar
incompleto, não repeti-lo cegamente: restaurar o backup, ler o log e ajustar o
volume ou intervalo com base na evidência.
