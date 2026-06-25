# Portal 4D Espacial — Sprint 10: compatibilidade com BDS 1.26.30.5

## Pergunta obrigatória de causa raiz
**Por que isso aconteceu?**

Após habilitar as flags experimentais no `level.dat`, o erro do servidor mudou. O Bedrock Dedicated Server deixou de reclamar que Beta APIs não estavam habilitadas e passou a bloquear o módulo com:

```text
[Scripting] Plugin [BP Portal 4D Espacial] - module [BP Portal 4D Espacial - 0.1.7] requested invalid version [2.0.0-beta] of [@minecraft/server].
```

Isso mostra que a causa raiz atual não é mais a flag experimental do mundo. A causa passou a ser a versão literal do módulo no manifest: o BDS `1.26.30.5` em uso rejeita `@minecraft/server` `2.0.0-beta` como dependência válida.

## Evidências usadas
- `bedrock.log` pós-restart em `2026-06-25 15:33:31`, com `BP Portal 4D Espacial` `0.1.7` carregado no Pack Stack.
- O erro anterior de `Beta APIs experiment is not enabled` deixou de ser o erro final.
- O novo erro final é `requested invalid version [2.0.0-beta] of [@minecraft/server]`.
- Registros anteriores mostram que o mesmo servidor já registrou `portal4d:espaco_4d` quando o BP estava com `@minecraft/server` `2.0.0`.

## Decisão técnica
- Trocar a dependência do manifest de `@minecraft/server` `2.0.0-beta` para `2.0.0`, porque esta é a versão aceita pelo BDS atual.
- Manter o código que usa `system.beforeEvents.startup` e `event.dimensionRegistry.registerCustomDimension(...)`.
- Manter o fallback seguro no Overworld caso `dimensionRegistry/registerCustomDimension` não exista ou falhe.
- Incrementar BP/RP pareados para `0.1.8`, garantindo rastreabilidade do ajuste.

## Resultado esperado após deploy
Após publicar `0.1.8` e reiniciar o servidor, o log deve mostrar:

```text
Pack Stack - [..] BP Portal 4D Espacial ... version: 0.1.8
[Scripting] [Portal4D] Trigger de interacao com bloco registrado para o portal 4D.
[Scripting] [Portal4D] Dimensao customizada registrada no startup: portal4d:espaco_4d.
```

Não deve aparecer:

```text
requested invalid version [2.0.0-beta] of [@minecraft/server]
```

## Registro pós-conclusão
- **O que foi feito:** manifests BP/RP atualizados para `0.1.8`; dependência `@minecraft/server` ajustada para `2.0.0`; mensagens de `init` atualizadas para remover referência ao módulo beta literal.
- **O que ficou faltando:** publicar `0.1.8`, reiniciar o servidor e validar `bedrock.log`.
- **Impedimentos/bloqueios:** nenhum bloqueio de código local; falta deploy/runtime.
