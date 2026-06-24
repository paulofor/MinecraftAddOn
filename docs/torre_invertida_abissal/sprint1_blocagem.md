# Torre Invertida Abissal — Sprint 1: blocagem da escala

## Entrega executada
A Sprint 1 consolida a pré-produção em arquivos versionados e entrega uma função de blocagem para mundo de teste, sem texturas PNG e sem detalhes finos.

## Limites definidos
- **Área horizontal de validação:** 128 x 128 blocos, com cratera principal dentro de aproximadamente 104 x 104 blocos.
- **Altura de leitura inicial:** 60 blocos acima da origem da cratera para silhueta temporária da torre/coroa partida.
- **Profundidade visual inicial:** 48 blocos abaixo da origem para validar a sensação de torre invertida e primeiro anel subterrâneo.
- **Caminho crítico da Sprint 1:** borda norte da cratera → ponte temporária → eixo central → descida visual/segura → primeiro anel subterrâneo.

## Mapa conceitual — vista superior

```text
Legenda: C=cratera, T=eixo/torre, P=ponte inicial, A=anel subterrâneo, M=marcador de zona futura

M ........................................................ M
.                         borda norte                       .
.                             PPPPP                         .
.                             PPPPP                         .
.                 CCCCCCCCCCCCCCCCCCCCC                     .
.             CCCCCCCCCCCCCCCCCCCCCCCCCCCCC                 .
.          CCCCCCCCCCCCCCCCC T CCCCCCCCCCCCCCCC             .
.          CCCCCCCCCCCCCCCC TTT CCCCCCCCCCCCCCC             .
.          CCCCCCCCCCCCCCCCC T CCCCCCCCCCCCCCCC             .
.             CCCCCCCCCCCCCCCCCCCCCCCCCCCCC                 .
.                 CCCCCCCCCCCCCCCCCCCCC                     .
.                      A A A A A A A                        .
M ........................................................ M
```

## Mapa conceitual — corte vertical

```text
Y+60           coroa partida / observatório quebrado
               ┌───────────────┐
Y+48           │ torre superior │
               │ eixo luminoso  │
Y+01  ponte -> ├──── cratera ───┤ <- borda segura
Y-02           \   garganta    /
Y-16              primeiro anel subterrâneo
Y-18           ┌────────────────┐
Y-48              vazio técnico para profundidade futura
```

## Materiais base por zona
- **Ruínas da Superfície:** `smooth_stone`, `calcite`, `oak_planks`, `oak_fence`.
- **Coroa Partida:** `copper_block`, `cut_copper`, `exposed_copper`, `weathered_copper`.
- **Eixo Central:** `sea_lantern`, `blue_stained_glass`, `copper_block`.
- **Primeiro Anel Subterrâneo:** `polished_deepslate`, `deepslate_tiles`, `cobbled_deepslate`.
- **Marcadores de expansão:** `emerald_block`, `gold_block`, `lapis_block`, `redstone_block`, `amethyst_block`.

## Como gerar o protótipo em mundo de teste
1. Ativar os packs `BP_TorreInvertidaAbissal` e `RP_TorreInvertidaAbissal` no mundo de teste.
2. Posicionar o operador no centro desejado da cratera, longe do spawn e de estruturas existentes.
3. Executar `/function torre_invertida_abissal/init`.
4. Executar `/function torre_invertida_abissal/blocagem_sprint1`.
5. Validar a leitura visual a distância, a ponte norte e o acesso ao primeiro anel.

## Critérios de aceite da Sprint 1
- A megatorre/cratera é legível de longe pela silhueta vertical, bordas claras e eixo luminoso.
- A rota inicial existe e vai da superfície ao primeiro anel subterrâneo.
- O operador deve executar a função apenas em mundo de teste e área livre para não bloquear spawn, caminhos ou construções existentes.

## Pós-conclusão
- **O que foi feito:** criados packs pareados BP/RP da Torre Invertida Abissal, função de inicialização, função de blocagem Sprint 1, mapa conceitual em vista superior/corte vertical, limites de escala, caminho crítico e materiais base por zona.
- **O que ficou faltando:** validação visual dentro do jogo em mundo de teste e ajuste fino de escala após feedback de navegação.
- **Impedimentos/bloqueios:** o MCP readonly remoto segue inadequado para edição/validação bloco-a-bloco do mundo ativo; por segurança, a blocagem foi entregue como função versionada para execução manual em mundo de teste.
