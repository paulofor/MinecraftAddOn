# Sprint 14 — Nave Cronos: reconstrução integral do Mundo 4D

## Objetivo

Apagar a experiência anterior da dimensão `portal4d:espaco_4d` e substituí-la
por uma proposta visual, mecânica e pedagógica inteiramente nova: uma nave
temporal circular em que o jogador observa o mesmo lugar em três momentos.

## Por que isso aconteceu?

O Mundo 4D continuou ruim mesmo depois do laboratório linear porque o redesign
mudou a ordem dos elementos, mas preservou a mesma metáfora abstrata: projeção,
tesseracto, fatia `W`, rotação e combinação numérica. O log do servidor mostra
entrada na Sprint 13 às `23:53:34`, mas não registra ações posteriores nos
controles. Isso reforça o feedback humano de que a mudança anterior ainda não
produziu uma experiência interessante e autoexplicativa.

### Causa raiz

A implementação vinha sendo corrigida por acréscimos. Cada sprint reorganizava
ou explicava os mesmos elementos, em vez de questionar a metáfora central. O
resultado acumulou arquitetura, controles e textos de versões diferentes. A
causa não era só estética: era insistir em ensinar 4D por um diagrama espacial
abstrato sem uma ação cotidiana imediatamente compreensível.

### Evidências consultadas

- `docs/registros1.md`, especialmente as Sprints 12 e 13;
- histórico Git do Portal 4D;
- `packs/BP_Portal4DEspacial/scripts/main.js` anterior, com sala, tesseracto,
  fatias `W`, rotação e laboratório linear coexistindo;
- `scripts/controller_patch.js`, que ainda carregava controles e interface da
  sala antiga por cima de `main.js`;
- `/root/MinecraftServer/logging/bedrock.log` via MCP readonly, que confirma BP
  `0.1.34`, entrada válida e teleporte, sem sequência registrada nos controles
  no recorte consultado;
- feedback explícito do operador pedindo apagar e recomeçar.

## Solução completamente nova

### Conceito: tempo como quarta coordenada

A **Nave Cronos** abandona tesseracto, fatias e rotação. O jogador permanece no
mesmo X/Y/Z e usa três consoles para mudar o momento do setor observado:

1. **Cobre — ORIGEM:** vegetação, árvores e água;
2. **Ouro — AGORA:** cidade de pedra e via construída;
3. **Diamante — AMANHÃ:** estruturas suspensas, vidro e luz.

Ao visitar os três estados, a missão conclui com a síntese: X/Y/Z dizem onde;
o quarto valor da experiência diz quando.

## Segurança da reconstrução

Pergunta obrigatória: **por que essa construção poderia danificar ou ficar mal
posicionada no mundo?** Porque o rebuild apaga blocos antes de montar a nave. Se
executado na dimensão errada ou com envelope incompleto, poderia apagar obra
legítima, deixar resíduos da arena antiga ou remover o piso sob um jogador.

- dimensão afetada: somente `portal4d:espaco_4d`;
- limpeza: X=`-30..30`, Y=`76..104`, Z=`-30..30`;
- construção nova: X=`-20..20`, Y=`79..91`, Z=`-20..20`;
- subsolo: não altera abaixo de Y=`76`;
- altura máxima: Y=`104` na limpeza e Y=`91` na construção;
- os quatro comandos de limpeza ficam abaixo do limite de volume do `/fill`;
- o portal existente no Overworld, inclusive o centro `22 72 96`, não é tocado;
- construção e interações usam coordenadas absolutas compartilhadas no script;
- o rebuild só obtém a dimensão pelo identificador customizado explícito.

### Limitação conhecida

O apagamento é intencionalmente destrutivo dentro do envelope e não distingue
blocos colocados manualmente. É obrigatório criar backup antes do primeiro
restart/deploy da versão `0.1.35` e fazer validação visual depois. O script
agenda a construção oito ticks após a limpeza; o servidor real deve confirmar
que todos os comandos de limpeza terminaram antes da montagem.

## Critérios de aceite

- nenhum tesseracto, laboratório 2D/3D/4D, fatia `W` ou sala de rotação resta;
- o manifest carrega `scripts/main.js` diretamente, sem controller legado;
- o jogador chega em `0 80 -16` com caminho claro para a nave;
- cobre, ouro e diamante respondem exatamente nos pontos construídos;
- o mesmo setor muda de origem para agora e amanhã;
- a conclusão acontece apenas após visitar as três eras;
- a pedra-ímã retorna à origem salva;
- não há `TypeError` ou `SyntaxError` do Portal 4D no `bedrock.log`.

## Registro pós-conclusão

- **O que foi feito:** código e conteúdo textual da Sprint 14 implementados;
  remoção integral da arena antiga e construção da Nave Cronos preparadas para
  o próximo deploy.
- **O que ficou faltando:** backup, deploy/restart do BP/RP `0.1.35`, travessia
  real e validação visual/log das três eras.
- **Impedimentos/bloqueios:** nenhum para a implementação local; a confirmação
  final depende do runtime Bedrock e de playtest humano.

## Próximo passo de validação

Criar backup do mundo, publicar BP/RP `0.1.35`, reiniciar uma única vez e
validar em ordem os logs `Nave Cronos construída`, `Era origem`, `Era agora`,
`Era amanha` e `Linha do tempo concluída`. Se a limpeza ou construção falhar,
não repetir cegamente: restaurar o backup e ajustar o intervalo entre etapas a
partir do log.
