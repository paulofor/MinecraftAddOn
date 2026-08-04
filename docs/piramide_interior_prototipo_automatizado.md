# Pirâmide — protótipo automatizado do interior

## Objetivo

Substituir somente o interior pobre da Pirâmide por um percurso curto e mais
denso, preservando integralmente a fachada aprovada. O operador não coloca nem
remove blocos manualmente.

## Por que isso aconteceu?

A versão `0.1.28` chama seu interior de simples e contém apenas uma galeria,
uma câmara, dois atris e iluminação básica. A função de aventura separada está
bloqueada. O desenvolvimento priorizou silhueta externa e segurança, sem
critério de densidade interna.

## Por que essa construção poderia danificar ou ficar mal posicionada no mundo?

O builder escava e substitui blocos. Coordenadas incorretas poderiam abrir uma
câmara fora da Pirâmide, danificar terreno ou modificar outra construção. Uma
execução concorrente poderia deixar o interior pela metade; chunks ausentes
poderiam produzir vazios incompletos.

## Entrada parametrizada

Função pública remota:

```text
scriptevent piramide:refazer_interior X Y Z
```

`X Y Z` é o centro absoluto da Pirâmide, com `Y` no nível dos pés do corredor.
Para a Pirâmide atualmente validada:

```text
scriptevent piramide:refazer_interior -182 71 95
```

Rollback automatizado:

```text
scriptevent piramide:restaurar_interior -182 71 95
```

## Envelope afetado

Relativo ao centro informado:

- X: `X-8..X+8` (17 blocos);
- Y: `Y-1..Y+8` (10 blocos);
- Z: `Z-24..Z+21` (46 blocos);
- subsolo: somente `Y-1`, usado como piso;
- altura máxima: `Y+8`.

No centro atual, o envelope é X=`-190..-174`, Y=`70..79`,
Z=`71..116`. Ele permanece dentro da Pirâmide já construída e não amplia a
fachada.

## Travas automáticas

- exige exatamente três coordenadas absolutas inteiras;
- restringe Y a `5..300`;
- usa sempre o Overworld, sem jogador conectado;
- carrega três chunks por `tickingarea` temporária;
- amostra paredes/piso/teto para confirmar que existe uma Pirâmide de arenito;
- recusa líquidos no envelope;
- impede duas construções simultâneas;
- remove a `tickingarea` no sucesso e em falhas detectadas;
- executa comandos sequencialmente e interrompe após erro;
- oferece rollback pelo mesmo centro absoluto.

A validação da casca é por amostragem, não por varredura completa. Backup e
inspeção visual continuam obrigatórios.

## Conteúdo do protótipo

- corredor com nichos e lanternas de alma;
- portal interno de arenito cinzelado;
- câmara central alta com teto escuro;
- oito pilares iluminados;
- sarcófago monumental de arenito vermelho, ouro, esmeralda e lápis;
- bifurcação curta pelos dois lados do sarcófago;
- abertura lateral para passagem secreta;
- tesouro com recompensa visível e beacon final.

O percurso é propositalmente pequeno. Nenhuma nova ala será acrescentada antes
do playtest.

## Execução segura

1. publicar BP/RP `0.1.30` e MCP `0.16.1`;
2. reiniciar e confirmar as versões no log;
3. criar backup do mundo;
4. enviar o `scriptevent` absoluto uma única vez;
5. confirmar no log `INTERIOR CONCLUÍDO` e remoção da tickingarea;
6. entrar pela fachada existente e percorrer por 5–10 minutos;
7. se houver dano ou reprovação, executar o rollback uma única vez.

## Registro pós-conclusão

- O que foi feito: BP/RP `0.1.30` confirmados no host; execução absoluta em
  `-182 71 95` concluída com 63 comandos e remoção da tickingarea.
- O que ficou faltando: percurso e aprovação visual do operador.
- Impedimentos/bloqueios: leitura LevelDB do bloco de controle continua
  indisponível com `NBT raiz não é compound: 0`; o log runtime confirmou a
  conclusão.
- Resultado visual aprovado pelo operador: pendente.

## Resultado da primeira execução

A execução de `0.1.29` foi bloqueada antes de alterar blocos:

```text
INTERIOR BLOQUEADO precheck: shell_invalido=1; liquidos=0
```

**Por que isso aconteceu?** Uma das cinco amostras rígidas não correspondia ao
material esperado na Pirâmide real, embora as outras quatro confirmassem a
casca e nenhuma amostra encontrasse líquido. A versão inicial exigia 5/5 e não
registrava a coordenada divergente, impedindo distinguir pequena variação da
construção de centro incorreto.

A versão `0.1.30` exige pelo menos 4/5 amostras válidas e continua bloqueando
duas ou mais divergências ou qualquer líquido. Quando exatamente uma divergir,
registra sua coordenada e prossegue somente no envelope interno conhecido. Essa
é uma amostragem limitada; backup e validação visual continuam obrigatórios.

## Resultado da execução `0.1.30`

O deploy e o restart foram confirmados. A segunda tentativa foi enviada uma
única vez e terminou com:

```text
INTERIOR CONCLUÍDO centro=-182 71 95; comandos=63; tickingarea removida.
```

Não executar novamente. O próximo passo é somente entrar pela fachada da
Pirâmide e avaliar o corredor, câmara, sarcófago, bifurcação, passagem secreta e
tesouro. O rollback permanece disponível se houver dano ou reprovação visual.

## Ainda existe espaço?

Sim. A Pirâmide externa ocupa X=`-206..-158`, Y=`70..94`, Z=`71..119`
(49 × 25 × 49 no envelope máximo), enquanto o protótipo usa somente
X=`-190..-174`, Y=`70..79`, Z=`71..116` (17 × 10 × 46). O corpo escalonado
estreita nos níveis superiores, mas ainda há volume lateral na base e volume
vertical acima da câmara atual.

Isso não significa que devemos preencher tudo. O melhor próximo acréscimo é
uma experiência interativa curta, e não mais corredores vazios.

### Opções com melhor relação espaço/experiência

1. **Enigma dos quatro selos (recomendado):** quatro símbolos em paredes
   laterais; uma sequência correta abre uma porta para uma câmara superior.
2. **Galeria vertical do faraó:** escada curta em espiral/rampa até uma câmara
   pequena entre Y=`81..88`, aproveitando o volume acima sem tocar na fachada.
3. **Armadilha segura:** placas de pressão alteram luz/som e fecham uma porta
   por poucos segundos, sem matar nem destruir itens.
4. **Câmara do mapa celeste:** teto escuro com constelações luminosas e uma
   orientação curta ligada ao Egito/astronomia.
5. **Sala arqueológica:** quatro objetos encontrados no percurso formam uma
   micro-história, terminando no sarcófago.
6. **Tesouro variável:** recompensa simbólica e controlada por jogador, para a
   exploração continuar interessante sem duplicação ilimitada de diamantes.

### O que não cabe bem ou não vale o risco

- dezenas de salas grandes;
- labirinto longo sem marcos visuais;
- escavação profunda fora da fundação validada;
- combate com muitos mobs em corredores estreitos;
- nova expansão externa ou segundo monumento dentro da mesma Pirâmide.

Antes de escolher uma expansão, o operador deve avaliar visualmente o
protótipo já construído. Se a câmara atual ainda não estiver boa, acrescentar
um puzzle apenas esconderia o problema estético em vez de resolvê-lo.

## Expansão aprovada — Enigma dos Quatro Selos

O operador aprovou a implementação do enigma, porta secreta e Câmara Superior
do Faraó. A entrada pública é parametrizada:

```text
scriptevent piramide:construir_quatro_selos X Y Z
```

Para o centro atual:

```text
scriptevent piramide:construir_quatro_selos -182 71 95
```

Rollback automatizado:

```text
scriptevent piramide:remover_quatro_selos -182 71 95
```

### Por que essa construção poderia danificar ou ficar mal posicionada no mundo?

A expansão escava uma escadaria e uma sala em camadas superiores do corpo. Um
centro errado poderia perfurar a fachada; altura ou largura excessivas poderiam
atravessar a inclinação da Pirâmide. Por isso ela exige o centro absoluto,
confirma blocos exclusivos do interior `0.1.30`, carrega chunks, trava
concorrência e permanece dentro das camadas calculadas da estrutura existente.

### Envelope adicional

- relativo: X=`X-7..X+7`, Y=`Y..Y+16`, Z=`Z-6..Z+12`;
- centro atual: X=`-189..-175`, Y=`71..87`, Z=`89..107`;
- subsolo: nenhum bloco abaixo de Y=`71` é escavado pela expansão;
- altura máxima: Y=`87`, ainda dentro da casca que chega a Y=`94`.

### Experiência

1. quatro selos aparecem na câmara: **SOL → NILO → CÉU → VIDA**;
2. cada jogador precisa tocar a sequência correta; erro reinicia seu progresso;
3. ao completar, a porta dourada desaparece;
4. uma escadaria de dez degraus leva à Câmara Superior;
5. a sala contém teto celeste, trono do faraó, iluminação, lodestone e beacon;
6. o centro do enigma é persistido no mundo para continuar funcionando após
   restart.

### Segurança e limitação

- precheck aceita no máximo uma divergência entre quatro marcadores exclusivos
  do interior rico;
- build e rollback são sequenciais e removem a tickingarea;
- a porta abre globalmente quando um jogador conclui; o progresso da sequência
  é individual e reinicia se o jogador desconectar;
- não há dano, lava, TNT ou perda de inventário;
- confirmação final continua visual.

### Registro pós-conclusão da expansão

- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

## Correção operacional 0.1.32 — precheck dos Quatro Selos

Na primeira execução após o deploy `0.1.31`, a expansão foi corretamente
interrompida antes de modificar o mundo: o precheck informou quatro marcadores
internos divergentes. A causa raiz foi dupla: a primeira amostra esperava
`gold_block` numa coordenada onde o builder cria `smooth_sandstone`, e a trava
tratava decoração interna exata como se fosse a evidência estrutural principal.

A versão `0.1.32`:

- corrige o bloco esperado na primeira amostra;
- reutiliza a casca e a ausência de líquidos como trava estrutural obrigatória;
- exige que ao menos dois dos quatro marcadores internos coincidam;
- registra coordenada, bloco esperado e bloco observado em cada divergência;
- mantém o mesmo envelope absoluto, tickingarea temporária e rollback.

O evento `0.1.31` não executou nenhum comando de construção, portanto não há
alteração parcial a reparar. Após publicar BP/RP `0.1.32`, reiniciar e confirmar
o Pack Stack, deve-se repetir o comando apenas uma vez.
- Enigma e Câmara Superior aprovados: sim / não

## Execução concluída no mundo — 0.1.32

Após a publicação e o reinício, o MCP confirmou BP/RP `0.1.32` no pack do
mundo e o Bedrock carregou `BP Piramide Egito Gigante 0.1.32` no Pack Stack.
O evento absoluto foi enviado uma única vez no centro aprovado:

```text
scriptevent piramide:construir_quatro_selos -182 71 95
```

O log registrou início no envelope X=`-189..-175`, Y=`71..87`,
Z=`89..107` e conclusão dos 40 comandos, com remoção da tickingarea. Não houve
erro de script nem bloqueio de precheck. A construção automatizada está
concluída; falta apenas a validação visual e funcional dos quatro selos pelo
operador dentro do jogo.
