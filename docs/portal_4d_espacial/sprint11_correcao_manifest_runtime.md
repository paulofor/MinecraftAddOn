# Portal 4D Espacial — Sprint 11: correção definitiva do manifest publicado

## Pergunta obrigatória de causa raiz

**Por que isso aconteceu?**

O deploy pós-restart ainda falhou porque o arquivo versionado em `packs/BP_Portal4DEspacial/manifest.json` continuava declarando a dependência `@minecraft/server` como `2.0.0-beta`, apesar dos registros da Sprint 10 já indicarem que a correção esperada era usar `2.0.0`. Assim, o workflow republicou para o mundo ativo um manifest ainda incompatível com o BDS `1.26.30.5`.

## Evidências usadas

- O `bedrock.log` pós-restart/deploy de `2026-06-25 15:56:16` reportou `failed to create context`, `requested invalid version [2.0.0-beta] of [@minecraft/server]` e `run failed, no runtime or context available` para `BP Portal 4D Espacial - 0.1.8`.
- Consulta MCP readonly ao log remoto confirmou que o servidor está em `Version: 1.26.30.5`, com experimento `gtst` ativo, e lista versões disponíveis do módulo incluindo `2.8.0`, `2.9.0-beta` e `3.0.0-alpha`, mas não `2.0.0-beta`.
- Inspeção local do manifest confirmou que `packs/BP_Portal4DEspacial/manifest.json` ainda possuía `"version": "2.0.0-beta"` na dependência `@minecraft/server`.
- `docs/portal_4d_espacial/sprint10_compatibilidade_bds_126.md` e `docs/registros1.md` já registravam que a solução correta era trocar a dependência para `2.0.0`; portanto a causa raiz foi divergência entre a documentação/decisão técnica e o conteúdo real do manifest versionado.

## Correção aplicada

- `packs/BP_Portal4DEspacial/manifest.json` foi atualizado para depender de `@minecraft/server` `2.0.0`.
- Os manifests pareados BP/RP foram incrementados para `0.1.9`, incluindo `header.version`, `modules[].version` e a dependência BP → RP.
- Nenhum arquivo `.png` foi criado, alterado ou versionado.

## Validação esperada após deploy

Após publicar a versão `0.1.9` e reiniciar o Bedrock, validar no `bedrock.log`:

```text
Pack Stack - [..] BP Portal 4D Espacial ... version: 0.1.9
```

E confirmar ausência de:

```text
requested invalid version [2.0.0-beta]
failed to create context
run failed, no runtime or context available
```

## Registro pós-conclusão

- **O que foi feito:** corrigida a dependência real do manifest BP para `@minecraft/server` `2.0.0`; manifests BP/RP pareados versionados para `0.1.9`; causa raiz documentada.
- **O que ficou faltando:** executar o deploy/restart no servidor e validar o `bedrock.log` pós-deploy da versão `0.1.9`.
- **Impedimentos/bloqueios:** validação completa em runtime depende do deploy no host Bedrock; neste ambiente foi possível validar apenas o conteúdo versionado e consultar o log remoto atual via MCP readonly.
