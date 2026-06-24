# Academia Arcana Monumental — Sprint 3: Biblioteca Infinita e Arquivo de Conhecimento

## Objetivo
Criar o coração narrativo e informacional da Academia Arcana Monumental, com uma biblioteca vertical explorável, pontos de lore curto, passarelas, varandas, segredos opcionais e a primeira sinalização física do futuro Arquivo Proibido Subterrâneo.

## Arquivos entregues
- `packs/BP_AcademiaArcanaMonumental/functions/academia_arcana_monumental/biblioteca_sprint3.mcfunction`
- `packs/BP_AcademiaArcanaMonumental/functions/academia_arcana_monumental/montar_completa.mcfunction`
- `packs/BP_AcademiaArcanaMonumental/functions/academia_arcana_monumental/init.mcfunction`
- `packs/BP_AcademiaArcanaMonumental/manifest.json`
- `packs/RP_AcademiaArcanaMonumental/manifest.json`

## Como executar em mundo de teste
A função usa coordenadas relativas ao executor e deve ser executada no mesmo centro do Pátio das Casas Arcanas usado nas Sprints 1 e 2.

```mcfunction
/function academia_arcana_monumental/montar_completa
```

Alternativa por etapas:

```mcfunction
/function academia_arcana_monumental/init
/function academia_arcana_monumental/blocagem_sprint1
/function academia_arcana_monumental/detalhamento_sprint2
/function academia_arcana_monumental/biblioteca_sprint3
```

## Elementos implementados

### Biblioteca vertical
- Fachada oeste reforçada com casca de `stone_bricks`, andar superior em `chiseled_stone_bricks`, cúpula de `quartz_block` e vitrais de `purple_stained_glass`.
- Átrio interno aberto para dar leitura de altura e escala.
- Três níveis principais com pisos de madeira, passarelas internas e guardas visuais.
- Varandas externas em duas alturas para que a construção pareça grande tanto por dentro quanto por fora.

### Arquivo de Conhecimento
- Nichos de consulta por disciplina usando blocos de cor:
  - `lapis_block` para lógica/observação;
  - `gold_block` para algoritmos/ordem;
  - `emerald_block` para elementos/causa e consequência;
  - `redstone_block` para arquivo/memória da academia.
- `lectern` em cada nicho para receber textos curtos em sprint futura, mantendo a diretriz de não depender de longas leituras.
- Iluminação com `sea_lantern` para destacar pontos relevantes e reduzir ambiguidade de navegação.

### Segredos opcionais
- Sala de observação atrás de uma estante marcada por `amethyst_block`, pensada como recompensa por atenção visual.
- Sequência ambiental de blocos vitrificados coloridos em diferentes andares, levando a uma varanda oculta com novo `lectern`.
- Os segredos não bloqueiam o fluxo principal; servem como recompensa para exploração cuidadosa.

### Conexão com Arquivo Proibido Subterrâneo
- Volume inicial subterrâneo sob a biblioteca, com estética de `deepslate_bricks` e `deepslate_tiles`.
- Acesso fechado por `iron_bars`, sinalizando que a rota será aberta/expandida na Sprint 6.
- Marcadores de luz e `lectern` indicam que o local é relevante para narrativa futura.

## Critérios de aceite da Sprint 3
- A biblioteca possui fachada, volume vertical, cúpula, múltiplos andares, passarelas, varandas e iluminação interna.
- O jogador consegue identificar áreas informacionais por blocos, cores, lecterns e luzes sem depender de mapa externo.
- Há pelo menos dois segredos opcionais baseados em observação e sequência visual.
- A conexão com o Arquivo Proibido Subterrâneo está presente, mas inicialmente bloqueada/sinalizada para expansão futura.

## Checklist de validação in-game
- Executar a montagem em área livre de mundo de teste.
- Confirmar se a biblioteca não colide de forma indesejada com o pátio, muralhas e rotas da Sprint 2.
- Percorrer o térreo, os mezaninos, as passarelas e as varandas.
- Verificar se a sala secreta e a sequência colorida são perceptíveis, mas não óbvias demais.
- Confirmar se o acesso ao Arquivo Proibido está fechado, visível e compreensível como conteúdo futuro.
- Observar performance e densidade de blocos na área da biblioteca.

## Registro pós-conclusão
- O que foi feito: criada a função da Sprint 3 com Biblioteca Infinita vertical, múltiplos andares, passarelas, varandas, nichos de lore, lecterns, duas áreas secretas e acesso subterrâneo fechado para o Arquivo Proibido. A montagem completa foi atualizada para executar as Sprints 1, 2 e 3 em sequência, e os manifests pareados foram versionados para `0.1.4`.
- O que ficou faltando: validação visual dentro do jogo, textos finais para lecterns, ajuste fino das pistas secretas após playtest e abertura funcional do Arquivo Proibido na Sprint 6.
- Impedimentos/bloqueios: não houve uso de PNG por regra do projeto; a entrega usa apenas blocos vanilla e arquivos texto versionáveis.
