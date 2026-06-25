# Sprint 7 — Validação no servidor, logs e hardening

## Pergunta obrigatória de causa raiz
**Por que isso aconteceu?**

A Sprint 7 existia no plano como etapa de validação e hardening, mas ainda não havia registro consolidado das evidências do servidor real para o `Portal4D`. A causa raiz da pendência era operacional: as Sprints 5 e 6 já tinham implementado lógica e narrativa, porém a validação precisava comparar o estado local com o pack efetivamente carregado no mundo Bedrock e consultar `bedrock.log` via MCP readonly antes de decidir se havia erro de API a corrigir.

## Evidências consultadas
- Plano do módulo: `docs/portal_4d_espacial_plano.md`.
- Registros anteriores do projeto: `docs/registros1.md`.
- Script principal: `packs/BP_Portal4DEspacial/scripts/main.js`.
- Manifests pareados: `packs/BP_Portal4DEspacial/manifest.json` e `packs/RP_Portal4DEspacial/manifest.json`.
- MCP readonly em `http://186.202.209.206/mcp`:
  - `tools/list` respondeu com `read_file`, `run_read_command`, `restart_bedrock`, `get_block`, `get_block_region` e demais tools readonly/upload PNG.
  - `read_file` confirmou manifests remotos do mundo ativo em versão `0.1.5` para BP e RP.
  - `tail -n 500 /root/MinecraftServer/logging/bedrock.log` confirmou o carregamento do `BP Portal 4D Espacial` versão `0.1.5` no mundo `Bedrock level`.

## Checklist local executado
- Parsing JSON dos manifests do BP/RP do módulo.
- `node --check` no script principal.
- `git diff --check` para evitar whitespace inválido.
- Inspeção do diff antes de registrar a sprint.

## Resultado no servidor Bedrock
- O mundo ativo observado é `Bedrock level`.
- O log do servidor indica Bedrock Dedicated Server `1.26.30.5`.
- O pack `BP Portal 4D Espacial` está carregado no mundo ativo em versão `0.1.5`.
- Os manifests remotos no diretório do mundo ativo também estão em versão `0.1.5`, compatíveis com o estado local da Sprint 6.
- O log contém mensagens `[Portal4D]` de inicialização, registro do trigger de interação, registro da dimensão customizada `portal4d:espaco_4d` e criação das plataformas seguras.
- No recorte validado não há `TypeError` nem `SyntaxError` associados ao `Portal4D`.
- A Custom Dimension API parece estar habilitada no servidor, pois o log registrou `Dimensao customizada registrada no startup: portal4d:espaco_4d`.

## Hardening e decisões
- Nenhum ajuste de compatibilidade foi aplicado nesta sprint, porque as evidências do log não indicaram erro de API no `Portal4D`.
- O fallback em Overworld permanece documentado e implementado para ambientes sem `dimensionRegistry/registerCustomDimension`.
- A tentativa de reinício via MCP retornou falha operacional: `Reinício não configurado: defina BEDROCK_RESTART_CMD no ambiente do MCP`. Por isso, a validação foi baseada no último restart registrado no `bedrock.log` e nos arquivos remotos já publicados.

## Pendências pós-validação
- Executar playtest em jogo para confirmar entrada, saída, interação com `lectern`, rotação por `lapis_block` e avanço de W por `emerald_block`.
- Se o portal não responder no playtest, coletar novo `bedrock.log` filtrando `[Portal4D]`, `[Scripting]`, `TypeError`, `SyntaxError` e `main.js` antes de alterar código.
- Configurar `BEDROCK_RESTART_CMD` no MCP readonly se o fluxo de validação quiser usar reinício remoto via tool MCP.
