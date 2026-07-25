# Padrão permanente para montagem parametrizada no mundo

## Objetivo

Toda peça, estrutura ou megaconstrução automatizada deve poder ser posicionada
por coordenadas absolutas fornecidas pelo operador ou pela automação, sem
depender da posição ou da presença de um jogador. Este documento é o padrão
canônico para novos módulos e para alterações em montagens existentes.

## Por que isso aconteceu?

A primeira busca automática do Portal 4D aceitava um raio, mas obtinha o centro
de `event.sourceEntity.location`. O parâmetro dava a impressão de uma operação
autônoma, embora o resultado ainda dependesse de onde o personagem estivesse e
de ele estar conectado. Pontos fixos também exigiram novos deploys a cada ajuste
e leituras externas de chunks descarregados não foram confiáveis.

A causa raiz foi misturar três responsabilidades: escolher a origem, carregar o
terreno e construir. A correção duradoura é transformar a origem em dados
explícitos, carregar os chunks de forma controlada e somente então validar e
montar.

## Contrato obrigatório

Uma montagem parametrizada deve:

1. Receber `X Y Z` absolutos; pode receber também dimensão, orientação, variante
   e um raio de busca com limites conhecidos.
2. Rejeitar parâmetros ausentes, valores não inteiros, altura inválida,
   dimensão não autorizada e raio acima do limite de desempenho.
3. Documentar antes da execução o envelope completo afetado em X/Y/Z, incluindo
   fundação, subsolo, elementos decorativos e altura máxima.
4. Carregar temporariamente os chunks da região antes da leitura. A área de
   carregamento deve ter nome único, tamanho limitado e ser removida em todos os
   caminhos de sucesso, bloqueio e erro.
5. Avaliar candidatos do mais próximo ao mais distante da origem recebida.
6. Executar precheck de apoio, água, lava, colisões, margem e altura. Quando a
   análise for por amostragem, declarar essa limitação e exigir inspeção visual.
7. Chamar a rotina interna de construção somente depois da aprovação. A função
   pública nunca deve contornar a trava.
8. Registrar origem solicitada, raio, candidato escolhido, motivo de rejeição e
   resultado final no log operacional.
9. Expor remotamente apenas um comando estrito na allowlist, com formato e
   intervalos validados; não liberar comandos genéricos de construção.
10. Criar backup antes da primeira modificação no mundo e validar visualmente o
    resultado antes de ampliar, repetir ou remover a estrutura.

## Fluxo de referência

```text
entrada: montar_coordenada X Y Z [raio]
  -> validar parâmetros e calcular envelope
  -> criar área temporária de carregamento de chunks
  -> aguardar os chunks ficarem disponíveis
  -> procurar candidatos e executar prechecks
  -> se aprovado: chamar construir_estrutura no centro escolhido
  -> registrar resultado
  -> remover a área temporária, inclusive em erro/bloqueio
```

Arquivos sugeridos:

```text
montar_coordenada.*       -> entrada pública, validação e orquestração
precheck_ambiente.*       -> apoio, líquidos, colisões e limites
construir_estrutura.*     -> modificação interna do mundo após aprovação
```

## Ajuste autônomo e seguro

Se a busca não encontrar candidato, a automação pode ajustar os parâmetros sem
mover o jogador: primeiro aumentar gradualmente o raio dentro do máximo
documentado e depois deslocar a origem para outra coordenada da região. Cada
nova tentativa deve partir do motivo registrado pela anterior. É proibido
repetir indefinidamente o mesmo comando ou chamar a construção interna para
forçar aprovação.

O jogador não precisa estar no local nem conectado para a busca. Sua presença é
recomendada apenas para a validação visual final, não como requisito técnico de
posicionamento.

## Segurança e exceções

- Construções persistentes não devem usar `@s`, `@p` ou
  `event.sourceEntity.location` como única origem.
- Uma mecânica deliberadamente relativa ao jogador pode usar sua posição, desde
  que a decisão seja documentada e exista uma entrada absoluta para operações
  administrativas ou persistentes.
- Uma ticking area não substitui backup, precheck ou verificação visual.
- Funções que usam `fill`, `setblock` ou estruturas continuam sujeitas a todas
  as regras de segurança e causa raiz do `AGENTS.md`.

## Checklist de aceite

- [ ] Coordenadas absolutas são parâmetros reais, não apenas mensagens.
- [ ] A execução funciona sem jogador como `sourceEntity`.
- [ ] Parâmetros inválidos não modificam o mundo.
- [ ] Envelope X/Y/Z e margem estão documentados.
- [ ] Chunks são carregados antes da leitura e liberados ao final.
- [ ] Água, lava, falta de apoio e colisões bloqueiam a montagem.
- [ ] A função interna não é chamada antes do precheck.
- [ ] Allowlist e testes cobrem valores aceitos e recusados.
- [ ] Backup, logs e validação visual fazem parte do procedimento.
- [ ] O trabalho e as evidências foram registrados em `docs/registros1.md`.
