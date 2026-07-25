# Sprint 12 — Tutorial guiado e linguagem concreta

## Objetivo

Fazer com que um visitante sem conhecimento prévio entenda o que observar e o
que fazer na Sala do Hipercubo em menos de um minuto.

## Por que isso aconteceu?

O primeiro visitante confirmou que o portal e o teleporte funcionaram, mas
relatou que não entendeu o conteúdo. O log comprova entrada e teleporte bem
sucedidos, seguidos de uma permanência curta, sem interação registrada com os
controles. A implementação exibia quatro mensagens imediatamente, usava termos
como `W`, “projeção” e “tesseracto” antes de uma ação concreta e escondia a
explicação detalhada atrás de vários usos do atril.

A causa raiz não era falta de conteúdo: era excesso de informação abstrata antes
da primeira experiência observável, sem uma missão curta e persistente na tela.

## Entregas

- Entrada reduzida a uma ideia: verde troca a **fatia** e azul troca a **vista**.
- Instruções espaçadas no tempo para não inundar o chat no teleporte.
- Barra inferior com o próximo passo, estado atual e objetivo final.
- Feedback dos controles usando analogia de tomografia e pedido explícito para
  olhar novamente o objeto central.
- Atril com cinco explicações curtas, uma por interação.
- Missão explícita: alcançar `W=4` e `Vista=4` para abrir a passagem.

## Segurança da alteração no mundo

**Por que essa construção poderia danificar ou ficar mal posicionada no mundo?**
A câmara é reconstruída pelo script na dimensão customizada. Esta sprint não
amplia o envelope existente: permanece em X=`-18..18`, com a sala principal em
Y=`79..95` e Z=`-18..18`; o tesseracto continua dentro desse volume funcional.
Não há novos `fill`, novos pontos no Overworld nem alteração da posição do portal
em `22 72 96`. O deploy ainda exige backup e validação visual porque o rebuild
existente altera blocos dentro desse envelope.

## Critérios de aceite

- Ao entrar, o jogador recebe uma única missão imediatamente.
- Após alguns segundos, recebe o primeiro passo sem precisar procurar um manual.
- A barra inferior diz qual controle usar em seguida.
- Cada controle explica, em linguagem concreta, o que mudou e onde olhar.
- O retorno continua indicado pela pedra-ímã.
- O log registra que o tutorial simplificado foi exibido.

## Registro pós-conclusão

- O que foi feito: tutorial em etapas, barra de objetivo contextual, mensagens
  concretas dos controles e manifests BP/RP pareados em `0.1.33`.
- O que ficou faltando: deploy, restart e novo playtest com o mesmo operador para
  confirmar entendimento sem explicação externa.
- Impedimentos/bloqueios: a Script API não fornece neste fluxo confirmação de
  leitura do chat; compreensão precisa ser confirmada pelo jogador.
