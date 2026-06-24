# Academia Arcana Monumental — Sprint 2: Portão, muralhas, pátio central e identidade visual

## Objetivo
Construir a primeira impressão da Academia Arcana Monumental e transformar o Pátio das Casas Arcanas em um hub de orientação claro, explorável e preparado para expansões educativas.

## Arquivos entregues
- `packs/BP_AcademiaArcanaMonumental/functions/academia_arcana_monumental/detalhamento_sprint2.mcfunction`: função principal da Sprint 2.
- `packs/BP_AcademiaArcanaMonumental/functions/academia_arcana_monumental/montar_completa.mcfunction`: montagem completa atualizada para executar Sprint 1 e Sprint 2 em sequência.
- `packs/BP_AcademiaArcanaMonumental/functions/academia_arcana_monumental/init.mcfunction`: instruções atualizadas para a montagem completa.
- `packs/BP_AcademiaArcanaMonumental/manifest.json` e `packs/RP_AcademiaArcanaMonumental/manifest.json`: versões incrementadas para `0.1.2`.

## Como executar em mundo de teste
Execute a função abaixo no mesmo ponto escolhido como centro do Pátio das Casas Arcanas:

```mcfunction
/function academia_arcana_monumental/montar_completa
```

Para aplicar apenas o detalhamento da Sprint 2 sobre uma blocagem já criada, execute:

```mcfunction
/function academia_arcana_monumental/detalhamento_sprint2
```

> Atenção: a montagem usa `fill` em uma área grande. Execute somente em mundo de teste ou em área totalmente livre.

## Entregas implementadas

### Portão dos Aprendizes
- Ponte cerimonial ao norte com água lateral, guarda-corpos, luzes e caminho de chegada.
- Arco monumental com torres laterais, coroamento em ametista, beacon e brasões coloridos.
- Estátuas simples com blocos vanilla para marcar a entrada sem depender de PNG.

### Muralhas externas
- Muralhas nos quatro lados do campus com ameias de `stone_brick_wall`.
- Torres de canto com marcadores coloridos para reforçar a leitura espacial do campus.

### Pátio das Casas Arcanas
- Pátio ampliado com fonte central, beacon, ametista e iluminação.
- Quatro pontos de interesse exploráveis no hub:
  1. lectern norte de boas-vindas/orientação;
  2. cartography table leste para leitura de rotas;
  3. enchanting table sul como marco arcano;
  4. bell oeste como ponto de encontro.
- Quatro marcos baixos nos cantos do pátio com cores das casas/alas.

### Sistema visual de orientação
- Norte: rota azul/lápis para a Torre da Lógica.
- Leste: rota laranja/cobre para a Torre dos Algoritmos.
- Oeste: rota verde/esmeralda para a Biblioteca/Jardins de Runas.
- Sul: rota vermelha/redstone para Anfiteatro e futuras áreas de desafio.
- Marcadores de terracota esmaltada e lecterns posicionados nas rotas principais para facilitar orientação sem mapa externo.

## Critérios de aceite
- A entrada comunica escala monumental por ponte, muralhas, torres, arco alto, luzes e beacon.
- O jogador identifica rotas por cor e material diretamente a partir do pátio central.
- O pátio possui pelo menos quatro pontos de interesse exploráveis e claros.
- A Sprint 2 não adiciona PNGs, mantendo a regra do projeto de texturas fora do Git.

## Registro pós-conclusão
- O que foi feito: criada função de detalhamento da Sprint 2 com Portão dos Aprendizes, ponte, muralhas externas, torres de canto, pátio central ampliado, fonte, quatro pontos de interesse e sistema de orientação por cores/materiais vanilla. A montagem completa foi atualizada para executar Sprints 1 e 2 em sequência, e os manifests BP/RP foram versionados para `0.1.2`.
- O que ficou faltando: validação visual em jogo, ajuste fino de proporções do arco/muralhas após navegação real e preenchimento textual de lecterns/placas por scripts ou entidades futuras.
- Impedimentos/bloqueios: não houve uso de PNG por regra do projeto; a entrega permanece baseada em blocos vanilla e funções `.mcfunction` para execução segura em mundo de teste.
