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

- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:
- Resultado visual aprovado pelo operador: sim / não

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
