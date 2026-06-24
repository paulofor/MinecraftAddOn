# Academia Arcana Monumental — Sprint 1: conceito, mapa mestre e blocagem do campus

## Entrega executada
A Sprint 1 consolidou a pré-produção da Academia Arcana Monumental em arquivos versionados e entregou uma função de blocagem para mundo de teste. A entrega não usa texturas PNG customizadas e foca em escala, leitura visual, navegação principal e espaço para expansões futuras.

## Limites definidos
- **Área horizontal de validação:** aproximadamente 220 x 180 blocos, com muralha perimetral, jardins, torres, anfiteatro, biblioteca e pátio central.
- **Altura de leitura inicial:** até 96 blocos acima da origem para validar a torre central, a cúpula arcana e a presença monumental da academia.
- **Profundidade inicial:** até 48 blocos abaixo da origem para reservar o Arquivo Proibido Subterrâneo e validar o corte vertical do campus.
- **Caminho crítico da Sprint 1:** Portão dos Aprendizes ao norte → Pátio das Casas Arcanas → quatro rotas cardeais → biblioteca, jardins, anfiteatro e torres disciplinares.

## Mapa conceitual — vista superior

```text
Legenda: G=portão, P=pátio/hub, C=torre central, B=biblioteca, J=jardins,
         A=anfiteatro, L=lógica, R=algoritmos, E=elementos, O=observatório

┌──────────────────────────────────────────────────────────────┐
│ L ................. GGGGGGGGGGG ................. R           │
│ .                    rota norte                    .          │
│ .          B B B B B      C      alas futuras      .          │
│ .          B B B B B     PPP     alas futuras      .          │
│ .          Biblioteca ← PPPPP → Jardins de Runas   J          │
│ .                    PPPPPPPPP                     J          │
│ .          E ........ rota sul ........ A A A A A   O          │
└──────────────────────────────────────────────────────────────┘
```

## Mapa conceitual — corte vertical

```text
Y+96            cúpula arcana / farol visual
                ┌───────────────┐
Y+78            │ torre central │
                │ eixo vertical │
Y+47            biblioteca alta / observatório futuro
Y+12            pontes suspensas e alas intermediárias
Y+01  portão -> pátio central -> rotas cardeais
Y-28            entrada técnica do Arquivo Proibido
Y-36            salão subterrâneo inicial
Y-48            reserva para catacumbas e desafios finais
```

## Paleta inicial por zona
- **Portão dos Aprendizes e muralhas:** `stone_bricks`, `chiseled_stone_bricks`, `sea_lantern`.
- **Pátio das Casas Arcanas:** `polished_andesite`, `smooth_stone`, `water`, `sea_lantern`, `beacon`.
- **Torre central:** `stone_bricks`, `amethyst_block`, `quartz_block`, `purple_stained_glass`.
- **Biblioteca Infinita:** `bookshelf`, `oak_planks`, `glass`, `lectern`, `cartography_table`.
- **Jardins de Runas:** `moss_block`, `oak_leaves`, `water`, `emerald_block`.
- **Anfiteatro dos Duelos Didáticos:** `sandstone`, `smooth_sandstone`, `cut_sandstone`, `orange_concrete`.
- **Torres disciplinares:** `blue_concrete`, `orange_concrete`, `green_concrete`, `red_concrete`, com blocos de identificação em `lapis_block`, `gold_block`, `emerald_block` e `redstone_block`.
- **Arquivo Proibido Subterrâneo:** `deepslate_bricks`, `deepslate_tiles`, `amethyst_block`, `sea_lantern`.

## Como gerar o protótipo em mundo de teste
1. Ativar os packs `BP_AcademiaArcanaMonumental` e `RP_AcademiaArcanaMonumental` no mundo de teste.
2. Posicionar o operador no centro desejado do Pátio das Casas Arcanas, longe do spawn e de estruturas existentes.
3. Executar `/function academia_arcana_monumental/init`.
4. Executar `/function academia_arcana_monumental/blocagem_sprint1`.
5. Validar a leitura visual a distância, o hub central, as quatro rotas coloridas, as massas das torres, a biblioteca, os jardins, o anfiteatro e a reserva subterrânea.

## Critérios de aceite da Sprint 1
- A academia é reconhecível como megaconstrução ao se aproximar pela presença do portão, da torre central, das torres disciplinares e da área murada.
- O pátio central funciona como hub legível, com rotas cardeais coloridas e pontos de interesse em todas as direções.
- Há espaço reservado para futuras salas, NPCs, scripts, puzzles, subsolo, pontes suspensas e expansões sem depender de novas texturas PNG.

## Pós-conclusão
- **O que foi feito:** criados packs pareados BP/RP da Academia Arcana Monumental, função de inicialização, função de blocagem Sprint 1, mapa conceitual em vista superior/corte vertical, limites de escala, caminho crítico, paleta inicial de blocos e instruções de execução em mundo de teste.
- **O que ficou faltando:** validação visual dentro do jogo em mundo de teste e ajustes finos de escala após feedback de navegação e performance.
- **Impedimentos/bloqueios:** não houve uso de PNG por regra do projeto; a blocagem foi entregue como função versionada para execução segura em área livre, sem edição direta do mundo ativo.
