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
