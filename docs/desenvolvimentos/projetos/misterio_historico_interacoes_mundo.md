# Mistério Histórico — interações com elementos do mundo

## Objetivo
Evitar que a aventura dependa de comandos digitados no chat. A partir da versão `0.1.4`, o jogador pode avançar usando blocos vanilla posicionados no mapa como estações de investigação. Também há uma função de montagem rápida para fazer esses elementos aparecerem no mundo.

## Como fazer aparecer no mundo rapidamente
Em modo operador/criativo, posicione-se no local desejado e execute:

```mcfunction
/function misterio_historico/montar_area_interativa
```

Essa função corta/limpa o entorno e cria uma pequena área de ruínas ao redor do jogador, com piso irregular, paredes quebradas, colunas, cisternas, canal bloqueado, arquivo/templo, estações de pista, mesa de diagnóstico, sala das hipóteses e bloco de finalização. A arena fica salva no mundo como qualquer construção normal até alguém quebrar os blocos ou executar `/function misterio_historico/desmontar_area_interativa` no mesmo ponto de referência. Depois, a área ainda pode ser complementada manualmente com placas, caminhos, iluminação e decoração adicional.

## Terraplanagem automática
- A montagem automática limpa um volume aproximado de `19x10x19` blocos ao redor do jogador.
- A função corta árvores, morros e blocos soltos nesse volume, abrindo espaço de jogo.
- A função também aterra uma base de `smooth_stone` de 3 blocos de profundidade e cria caminhos/escombros com `cobblestone` e `gravel`, reduzindo buracos e dando aparência de ruína.
- Não execute perto de construções que você queira preservar.


## Visual das ruínas automáticas
- **Acampamento inicial:** lectern, lodestone, grindstone, baú e barril em uma entrada iluminada.
- **Praça antiga:** caminhos cruzados de pedra, paredes quebradas, colunas incompletas e um marco central de pedra.
- **Cisternas e canal:** reservatório parcialmente seco com pouca água, cascalho e blocos indicando canal obstruído.
- **Arquivo/templo:** base de pedra com cantos elevados para sugerir uma construção antiga desabada.
- **Sala final:** plataforma de pedra com blocos coloridos para as três hipóteses e diamond_block de validação.

## Como montar a área jogável manualmente
Coloque os blocos abaixo em locais narrativamente coerentes. O jogador deve clicar/interagir com cada bloco para acionar a função correspondente.

| Elemento no mundo | Função executada | Papel narrativo |
| --- | --- | --- |
| `lectern` | `misterio_historico/nova_sessao` | Diário de campo / nova sessão individual |
| `barrel` | `misterio_historico/pistas/p1_diario_moradora` | Diário de uma moradora |
| `cauldron` | `misterio_historico/pistas/p2_cisternas_secas` | Cisternas secas com sinais de reparo |
| `bell` | `misterio_historico/pistas/p3_assembleia` | Ponto de assembleia pública |
| `chiseled_bookshelf` | `misterio_historico/pistas/p4_ata_conselho` | Arquivo com ata incompleta do conselho |
| `lever` | `misterio_historico/pistas/p5_chave_comporta` | Chave de comporta quebrada |
| `stonecutter_block` / `stonecutter` | `misterio_historico/pistas/p6_canal_bloqueado` | Mecanismo de canal subterrâneo bloqueado |
| `composter` | `misterio_historico/pistas/p7_registro_chuva` | Vestígio de chuva/cultivo |
| `chest` | `misterio_historico/pistas/p8_rotas_migracao` | Baú com mapas de rotas de migração |
| `bookshelf` | `misterio_historico/pistas/p9_mural_sintese` | Mural/estante de síntese |
| `lodestone` | `misterio_historico/diagnostico` | Mesa de consulta do caderno de investigação |
| `emerald_block` | `misterio_historico/conclusoes/hipotese_a` | Final A: escassez de água |
| `lapis_block` | `misterio_historico/conclusoes/hipotese_b` | Final B: conflito político |
| `redstone_block` | `misterio_historico/conclusoes/hipotese_c` | Final C: falha técnica nos canais |
| `diamond_block` | `misterio_historico/finalizar` | Validação final e reflexão |
| `grindstone` | `misterio_historico/reset` | Reinício da investigação do jogador |

## Fluxo recomendado para o jogador
1. Clicar no `lectern` do acampamento inicial para iniciar uma nova sessão individual. Isso zera apenas o progresso daquele jogador e mantém a arena no mundo para outras pessoas.
2. Explorar as ruínas e clicar nos blocos-pista.
3. Clicar no `lodestone` quando quiser ver quantas pistas já foram registradas.
4. Ir à sala final após coletar pelo menos 6 pistas.
5. Clicar em `emerald_block`, `lapis_block` ou `redstone_block` para escolher uma hipótese.
6. Clicar no `diamond_block` para finalizar e responder à reflexão com 3 evidências.
7. Se for rejogar, clicar no `lectern` para uma nova sessão completa ou no `grindstone` para resetar o progresso individual.

## Persistência e uso por vários jogadores
- A arena **fica no mundo** depois de criada, como uma construção vanilla comum.
- Cada jogador tem progresso próprio porque as funções usam `@s`: pistas, hipóteses e finalização são registradas no jogador que clicou.
- Outro jogador pode jogar depois usando a mesma arena: basta clicar no `lectern` para iniciar uma nova sessão individual.
- Para remover a arena gerada automaticamente, posicione-se no mesmo centro usado para montar e execute `/function misterio_historico/desmontar_area_interativa`.

## Observações para construção do mapa
- Use placas, iluminação, caminhos e decoração para fazer cada bloco parecer parte da narrativa, não apenas um botão.
- Os blocos podem ser repetidos, mas repetir o mesmo tipo de bloco em muitos locais pode registrar a mesma pista em locais indesejados.
- Para evitar acionamentos duplicados por cliques rápidos, o script aplica um pequeno cooldown por jogador e tipo de bloco.
