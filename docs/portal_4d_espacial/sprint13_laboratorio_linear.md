# Sprint 13 — Laboratório linear 2D → 3D → 4D

## Objetivo

Refazer a Sala do Hipercubo como uma experiência linear, visual e autoexplicativa,
na qual o jogador aprende primeiro pela observação e somente depois recebe os
controles do desafio.

## Por que isso aconteceu?

O tutorial textual da Sprint 12 reduziu o vocabulário, mas o espaço físico ainda
apresentava simultaneamente sala, tesseracto, faixas, marcadores e pedestais. A
investigação do código encontrou ainda uma falha funcional: os controles foram
movidos visualmente para `X=-6/+6, Z=-4`, porém o handler continuou procurando o
azul perto de `X=24, Z=0` e o verde perto de `X=0, Z=24`. Assim, mesmo que o
jogador identificasse os pedestais, a interação nos blocos visíveis não atendia
às distâncias aceitas pelo script.

A causa raiz foi atualizar a composição visual sem manter uma única definição de
posição compartilhada pela montagem e pela detecção, somada a uma organização
espacial baseada em conceitos simultâneos em vez de uma sequência de descoberta.

## Entregas

- Chegada reposicionada em `0 80 -9`, no início do percurso.
- Piso amarelo para a estação **2D**, com um quadrado plano atravessável.
- Piso azul para a estação **3D**, com um cubo de contorno observável.
- Piso roxo para a estação **4D**, com dois cubos conectados no tesseracto.
- Títulos automáticos acionados pela posição ao entrar em cada estação.
- Três atris de repetição distribuídos ao longo do percurso.
- Controles verde e azul reunidos na estação final em `-6 80 5` e `6 80 5`.
- Detecção das interações alinhada exatamente às coordenadas dos controles
  construídos, com tolerância pequena.
- Limpeza dos antigos controles em `Z=-4` e dos três anexos legados para evitar
  pistas falsas e caminhos sem função educativa.

## Segurança da reconstrução

**Por que essa construção poderia danificar ou ficar mal posicionada no mundo?**
O script reconstrói blocos na dimensão customizada. O novo laboratório permanece
em X=`-18..18`, Y=`79..95`, Z=`-18..18`; a chegada, estações, tesseracto em
Z=`1..13` e controles cabem nesse volume. A migração também limpa somente os
anexos criados pelas versões anteriores em um envelope total X=`-28..29`,
Y=`79..81`, Z=`-5..25`. Não há alteração no portal do Overworld em `22 72 96`.
O deploy requer backup porque remove os anexos e reorganiza o interior existente.

## Critérios de aceite

- O jogador aparece no início amarelo, e não no meio da sala.
- O percurso apresenta, nessa ordem, um quadrado, um cubo e dois cubos ligados.
- Entrar em cada cor mostra uma explicação automática apenas uma vez.
- Os blocos verde e azul visíveis respondem à interação.
- A barra inferior só pede os controles após a chegada à estação roxa.
- O jogador consegue resumir: “2D é plano, 3D tem profundidade e 4D é observada
  aqui por fatias e diferentes vistas”.

## Registro pós-conclusão

- O que foi feito: laboratório linear, chegada no início, estações por cor,
  orientação por proximidade e correção das coordenadas dos controles.
- O que ficou faltando: deploy/restart do BP/RP `0.1.34` e playtest completo com
  observação de cada interação no `bedrock.log`.
- Impedimentos/bloqueios: compreensão conceitual continua sendo um critério
  humano; testes automatizados validam estrutura e coordenadas, não aprendizagem.
