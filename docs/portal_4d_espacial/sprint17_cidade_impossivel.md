# Sprint 17 — Cidade Impossível

## Por que isso aconteceu?

O feedback visual do operador confirmou que o Planeta Partido continuava sem
graça. A auditoria anterior encontrou funcionamento técnico, mas não alterou o
mundo; por isso, entrar novamente necessariamente mostrou a mesma experiência.
A causa raiz estética é a composição baseada em três ilhas isoladas, pontes
estreitas e uma interação repetida de tocar uma pedra-ímã. Aumentar mais as
ilhas contornaria o problema sem mudar a experiência.

## Solução

A versão `0.1.41` substitui o gerador visual por uma **Cidade Impossível**
contínua e vertical:

- praça central circular de 77 blocos de diâmetro;
- santuário em quatro níveis, sete torres e eixo luminoso até Y=`132`;
- avenida monumental entre a chegada e o centro;
- Jardins Suspensos com canais, árvores e estufa esférica;
- Arquivo do Tempo monumental, preservando o enigma das quatro memórias;
- Forja de Autômatos com torres, beacons e reator esférico;
- avenidas largas e iluminadas no lugar das antigas passarelas estreitas.

O evento público de migração é exclusivamente:

```text
scriptevent portal4d:reconstruir_cidade_impossivel 0 96 0
```

Qualquer outro centro é recusado. O startup continua reutilizando o mundo sem
rebuild automático.

## Segurança antes da montagem

**Por que essa construção poderia danificar ou ficar mal posicionada no
mundo?** A migração limpa todo o cenário anterior. Se executada sem backup, na
dimensão errada, com centro diferente ou simultaneamente, poderia apagar uma
obra manual ou deixar o mundo parcial.

- dimensão obrigatória: `portal4d:espaco_4d`;
- centro absoluto obrigatório: `0 96 0`;
- envelope afetado: X=`-96..96`, Y=`45..150`, Z=`-96..96`;
- subsolo efetivamente limpo até Y=`45`; altura máxima Y=`150`;
- quatro `tickingarea` temporárias cobrem os quadrantes e são removidas ao fim;
- `buildInProgress` bloqueia concorrência;
- limpeza serializada precede a nova montagem;
- o comando remoto possui allowlist específica, sem permissão genérica;
- backup e inspeção visual são obrigatórios antes/depois da primeira execução.

A trava valida dimensão, centro e envelope, mas não varre construções manuais
bloco a bloco. Essa limitação exige backup e validação visual.

## Procedimento de deploy

1. Publicar BP e RP `0.1.41` e MCP `0.16.5`.
2. Reiniciar e confirmar no log a Sprint 17 sem limpeza automática.
3. Criar backup do mundo ativo.
4. Enviar uma única vez o evento absoluto acima.
5. Confirmar no log `Limpeza integral concluída` e depois `Cidade Impossível construída`.
6. Entrar pelo portal e validar chegada, centro, três bairros, quedas e retorno.
7. Não repetir o evento em caso de falha; diagnosticar o log primeiro.

## Registro pós-conclusão

- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

