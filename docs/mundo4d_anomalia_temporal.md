# Mundo 4D — Anomalia das Três Linhas do Tempo

## Causa raiz

**Por que o Mundo 4D pode parecer repetitivo mesmo possuindo três ilhas?**

Natureza, Ruínas e Máquina têm identidades visuais diferentes, mas a missão
original repete a mesma ação: atravessar uma ponte e tocar uma pedra-ímã. O
problema não é falta de volume; é falta de regras e decisões próprias em cada
fragmento.

## Plano por sprints

### Sprint 1 — Ruínas: Memória do Presente

- construir quatro selos temporais: ORIGEM, ASCENSÃO, APOGEU e QUEDA;
- exigir a sequência correta por jogador;
- reiniciar o progresso individual em caso de erro;
- abrir uma pequena câmara de memória e somente então reativar as Ruínas;
- oferecer montagem e rollback absolutos.

**Registro pós-conclusão**

- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 2 — Natureza: Memória do Passado

- criar sequência observável de vida, água e luz;
- ensinar reconhecimento de padrões sem punição destrutiva;
- integrar a solução à reativação do fragmento.

**Registro pós-conclusão**

- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 3 — Máquina: Memória do Futuro

- criar circuito lógico com limite de tempo e reinício seguro;
- fornecer feedback claro do estado de cada núcleo;
- manter alternativa acessível sem perda de inventário.

**Registro pós-conclusão**

- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 4 — Convergência

- alterar o núcleo conforme as três memórias são recuperadas;
- liberar decisão narrativa final no observatório;
- preservar alternativa solo e estado por jogador.

**Registro pós-conclusão**

- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

## Sprint 1 ampliada — versão 0.1.40

Comando de montagem após deploy, backup e reinício:

```text
scriptevent portal4d:construir_ruinas_temporais 42 96 -48
```

Rollback automatizado:

```text
scriptevent portal4d:remover_ruinas_temporais 42 96 -48
```

### Segurança

**Por que essa construção poderia danificar ou ficar mal posicionada no
mundo?** Um centro incorreto poderia colocar os pilares no vazio, atravessar a
borda da ilha ou substituir outro fragmento.

- dimensão obrigatória: `portal4d:espaco_4d`;
- centro absoluto obrigatório: `42 96 -48`;
- envelope afetado: X=`24..60`, Y=`96..110`, Z=`-63..-33`;
- subsolo: nenhum bloco abaixo de Y=`96` é modificado;
- altura máxima: Y=`110`;
- precheck: centro exato, envelope, pedra-ímã original, apoios dos quatro
  pilares e ausência de água/lava;
- chunks: tickingarea temporária de raio 2, removida em sucesso e falha;
- concorrência: uma operação por vez;
- rollback: remove somente a câmara e os quatro pilares adicionados;
- limitação: o precheck usa amostragem de 25 pontos, não varredura completa;
- validação final: inspeção visual e teste ORIGEM → ASCENSÃO → APOGEU → QUEDA.

### Correção preventiva do ciclo de restart

O script anterior chamava `ensureWorld(true)` em toda inicialização e, por isso,
apagava e reconstruía integralmente X/Z=`-96..96`, Y=`45..150` a cada restart.
Isso destruiria qualquer expansão local persistente. A primeira correção ainda
consultava o marcador antes de o chunk da dimensão estar disponível e, no
deploy `0.1.39`, a leitura vazia provocou outra reconstrução. A versão `0.1.40`
torna o comportamento seguro por padrão: chamadas normais sempre reutilizam o
mundo; somente uma chamada interna explicitamente forçada pode reconstruí-lo.

### Densidade arquitetônica e de jogabilidade

A primeira proposta `0.1.38` ainda seria pequena: quatro pilares próximos e uma
câmara mínima repetiriam o erro de entregar somente um cenário com uma ação
curta. Antes da montagem, a Sprint 1 foi ampliada e consolidada em `0.1.40`:

- praça central de 15 × 15 com cobre, andesito e anel temporal;
- dois eixos de caminhos, com até 33 blocos de extensão;
- quatro pavilhões de 7 × 7 e seis blocos de altura, um por era;
- três arcos monumentais de travessia;
- obelisco central de dez blocos com beacon;
- Grande Câmara da Memória de 13 × 6 × 10, teto de cobre oxidado, iluminação,
  porta de cinco blocos de altura e recompensa com fragmentos de eco;
- feedback visual: cada selo acende ao ser alinhado e todos apagam após erro;
- conclusão abre a câmara, altera a praça e reativa o fragmento.

O percurso ocupa quase todo o diâmetro útil da ilha, mas continua dentro do
envelope conhecido e não escava abaixo do piso original.
