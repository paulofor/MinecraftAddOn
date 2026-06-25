# Portal 4D Espacial — Sprint 9: aderência explícita à Custom Dimension API Microsoft

## Pergunta obrigatória de causa raiz
**Por que isso aconteceu?**

A implementação já chamava `event.dimensionRegistry.registerCustomDimension("portal4d:espaco_4d")` durante `system.beforeEvents.startup`, mas a configuração do módulo `@minecraft/server` no manifest ainda estava declarada como `2.0.0`. A documentação oficial Microsoft Learn consultada para Custom Dimensions informa que o recurso é experimental/beta e que o Behavior Pack deve optar pela superfície beta do módulo de servidor. Assim, a solução anterior explicava o status, mas ainda podia passar a impressão de que o projeto não estava realmente optando pela API Microsoft de Custom Dimensions.

## Evidências consultadas
- Script principal: `packs/BP_Portal4DEspacial/scripts/main.js`.
- Manifests pareados: `packs/BP_Portal4DEspacial/manifest.json` e `packs/RP_Portal4DEspacial/manifest.json`.
- Função de instrução operacional: `packs/BP_Portal4DEspacial/functions/portal_4d/init.mcfunction`.
- MCP Microsoft Learn (`https://learn.microsoft.com/api/mcp`) via `microsoft_docs_search` para Custom Dimension API.

## Decisão técnica
- Manter o uso oficial de `system.beforeEvents.startup` + `event.dimensionRegistry.registerCustomDimension(...)` no script.
- Declarar explicitamente `@minecraft/server` como `2.0.0-beta` no Behavior Pack, alinhando o manifest ao requisito beta descrito na documentação oficial para Custom Dimensions.
- Manter fallback seguro no Overworld, porque a API continua experimental e depende do mundo/servidor estar com Beta APIs habilitadas.
- Atualizar as mensagens de `/function portal_4d/init` para deixar claro para operadores que o caminho preferencial usa a API Microsoft e que o fallback só existe por compatibilidade.

## Resultado esperado
Após deploy e restart em mundo com Beta APIs habilitadas, o `bedrock.log` deve registrar:

```text
[Portal4D] Dimensao customizada registrada no startup: portal4d:espaco_4d.
```

Se a Beta API não estiver ativa, o módulo deve continuar funcional via fallback e registrar o motivo no log, em vez de quebrar o pack.

## Registro pós-conclusão
- **O que foi feito:** manifest do BP ajustado para `@minecraft/server` `2.0.0-beta`, manifests BP/RP versionados para `0.1.7`, mensagens de `init` atualizadas para explicitar a API Microsoft e registro da decisão nesta sprint.
- **O que ficou faltando:** publicar no servidor, reiniciar Bedrock e validar o `bedrock.log` do mundo ativo.
- **Impedimentos/bloqueios:** validação de runtime depende de deploy/restart e de mundo com Beta APIs habilitadas.

## Verificação pós-deploy — 2026-06-25 11:55 UTC-3

### Resultado observado no servidor
- O deploy dos arquivos chegou ao mundo ativo: manifests BP/RP do `Portal4D` estão em `0.1.7` nos diretórios de `worlds/Bedrock level`.
- `world_behavior_packs.json` e `world_resource_packs.json` também apontam para os UUIDs pareados do Portal 4D em versão `0.1.7`.
- O `bedrock.log` do restart de `2026-06-25 14:47:55` carregou `BP Portal 4D Espacial` versão `0.1.7` no Pack Stack.

### Bloqueio encontrado
O runtime do script foi bloqueado antes da inicialização do Portal 4D porque o mundo ativo não está com **Beta APIs** habilitado:

```text
[Scripting] Plugin [BP Portal 4D Espacial - 0.1.7] - requesting dependency on beta APIs [@minecraft/server - 2.0.0-beta], but the Beta APIs experiment is not enabled.
```

### Próximo passo obrigatório
1. Habilitar **Beta APIs** no mundo `Bedrock level`.
2. Reiniciar o Bedrock Dedicated Server.
3. Revalidar `/root/MinecraftServer/logging/bedrock.log` e confirmar:
   - `Pack Stack` com `BP Portal 4D Espacial` `0.1.7`;
   - ausência do erro de Beta APIs;
   - presença de `[Portal4D] Trigger de interacao com bloco registrado para o portal 4D.`;
   - presença de `[Portal4D] Dimensao customizada registrada no startup: portal4d:espaco_4d.`;
   - criação das plataformas segura fallback e customizada.
4. Executar playtest em jogo: entrada pelo portal, retorno, `lectern`, `lapis_block` e `emerald_block`.
