# Auditoria e plano de melhoria do mundo do Portal 4D

## Estado verificado em 2026-08-04

O portal leva à dimensão customizada `portal4d:espaco_4d`, chamada na experiência
de **Planeta Partido**. A versão `0.1.40` do BP está carregada no mundo ativo. O
log do servidor confirma, sem `TypeError` ou `SyntaxError` associado ao módulo:

- registro bem-sucedido da dimensão customizada;
- carregamento da Sprint 16;
- construção anterior do Planeta Partido;
- construção das Ruínas Temporais em `42 96 -48`, concluída com 72 comandos e
  remoção da `tickingarea` temporária.

O mundo atual ocupa o envelope absoluto X=`-96..96`, Y=`45..150`, Z=`-96..96`.
A chegada fica no observatório, três pontes levam aos fragmentos Natureza,
Ruínas e Máquina, e cada fragmento possui uma pedra-ímã de ativação. Ao concluir
as três ativações, o núcleo é energizado. O retorno usa a pedra-ímã do
observatório.

## Investigação de causa raiz

Pergunta obrigatória: **por que isso aconteceu?** Por que um mundo que já
funciona pode ainda parecer que precisa ser melhorado?

Não foi encontrado um erro de runtime que explique a percepção. A causa mais
provável é de **profundidade da experiência**, e não de transporte: o script
oferece uma apresentação visual grande, mas o ciclo principal dos fragmentos se
resume a atravessar uma ponte e tocar uma pedra-ímã. As Ruínas já têm um enigma
adicional, enquanto Natureza e Máquina ainda dependem apenas da ativação
simples. Isso torna duas das três rotas menos interessantes e reduz o valor de
replay.

### Evidências usadas

- `buildShatteredPlanet` monta três ilhas, três pontes e decorações distintas.
- `handleInteraction` conclui Natureza e Máquina diretamente ao tocar a
  pedra-ímã; somente Ruínas pode encaminhar para uma sequência de quatro selos.
- o progresso dos fragmentos usa tags do jogador, mas a origem de retorno e o
  progresso do enigma ficam somente em memória; uma reinicialização ou nova
  sessão pode interromper a continuidade esperada.
- os logs confirmam carregamento e construção, mas não registram métricas de
  entrada, abandono, tempo por fragmento ou conclusão. Portanto ainda não há
  evidência operacional suficiente para saber qual rota confunde ou desmotiva.

### Incerteza e próximo passo de validação

A hipótese de baixa profundidade deve ser validada com um playtest no jogo,
porque os logs provam execução técnica, não qualidade visual ou diversão. O
próximo passo recomendado é um percurso gravado por pelo menos um jogador do
público-alvo, anotando: entendimento da missão sem ajuda, rota escolhida,
quedas, tempo por ilha, conclusão e clareza do retorno.

## Prioridade recomendada

Antes de reconstruir o planeta, preservar o cenário atual e melhorar o conteúdo
de forma incremental:

1. instrumentar a jornada e validar a experiência atual;
2. dar a Natureza e à Máquina um desafio próprio, equiparando-as às Ruínas;
3. melhorar navegação, segurança e retorno;
4. só então aplicar polimento visual e uma recompensa final persistente.

Nenhuma reconstrução ou alteração do mundo ativo faz parte desta auditoria.

## Plano por sprints

### Sprint 1 — Telemetria educativa e playtest-base

**Objetivo:** descobrir onde a experiência perde clareza ou interesse antes de
alterar o cenário.

**Entregas:**

- logs estruturados de entrada, chegada a cada fragmento, queda/resgate,
  ativação, conclusão, retorno e tempo total;
- identificador anônimo por jogador, sem registrar conteúdo de conversa;
- roteiro de playtest para perfis iniciante, intermediário e avançado;
- critérios de sucesso: missão compreendida, três fragmentos encontrados,
  retorno localizado e conclusão sem comando administrativo.

**Registro pós-conclusão (preencher):**

- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 2 — Desafios da Natureza e da Máquina

**Objetivo:** fazer cada fragmento ensinar uma ideia e exigir uma ação diferente.

**Entregas propostas:**

- **Natureza — equilíbrio do ecossistema:** ordenar água, solo, luz e vegetação
  para recuperar uma árvore-núcleo, com feedback imediato e reset sem dano;
- **Máquina — circuito de energia:** fechar uma sequência lógica curta entre
  sensores, condutores e núcleo, trabalhando causa e efeito;
- manter nas **Ruínas — memória temporal** o enigma ORIGEM → ASCENSÃO → APOGEU
  → QUEDA já existente;
- oferecer pista opcional após duas tentativas incorretas, evitando punição e
  frustração excessivas.

**Registro pós-conclusão (preencher):**

- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 3 — Navegação, acessibilidade e continuidade

**Objetivo:** reduzir quedas, desorientação e perda de progresso.

**Entregas propostas:**

- marcos visuais e nomes consistentes nas três rotas;
- checkpoints seguros por ilha e resgate para o último checkpoint, não apenas
  para a chegada;
- instruções curtas em texto, cor e forma, sem depender somente da distinção de
  cores;
- persistência revisada para progresso, origem de retorno e estado dos enigmas;
- saída de emergência documentada caso a origem da sessão não esteja disponível.

**Registro pós-conclusão (preencher):**

- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 4 — Final, replay e polimento visual

**Objetivo:** transformar a conclusão em consequência percebida e incentivar um
novo percurso.

**Entregas propostas:**

- animação segura de reativação do núcleo, sem apagar/reconstruir o envelope;
- observatório final com síntese do que cada fragmento ensinou;
- recompensa cosmética ou título por conclusão, sem vantagem desbalanceada;
- variação opcional da ordem/pistas para replay;
- playtest comparativo usando as métricas da Sprint 1.

**Registro pós-conclusão (preencher):**

- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

## Segurança de qualquer construção futura

Pergunta obrigatória: **por que essa construção poderia danificar ou ficar mal
posicionada no mundo?** O planeta atual é gerado dentro de uma dimensão
exclusiva, mas uma reconstrução integral apaga blocos em todo o envelope. Um
centro incorreto, marcador falso, execução concorrente ou limpeza automática no
startup poderia remover a experiência existente e o progresso dos jogadores.

Para cada expansão, deve-se:

- usar coordenadas absolutas dentro de `portal4d:espaco_4d` e rejeitar qualquer
  outra dimensão;
- documentar X/Y/Z, subsolo e altura máxima da peça antes da implementação;
- carregar chunks com `tickingarea` temporária e removê-la em sucesso e falha;
- validar apoio, líquidos, colisões e marcadores exclusivos antes de construir;
- separar evento público, precheck e builder interno;
- fornecer rollback limitado à peça adicionada;
- criar backup antes da primeira execução e nunca chamar a reconstrução total
  automaticamente no startup;
- validar visualmente no jogo, pois prechecks por amostragem não inspecionam
  cada bloco do volume.

