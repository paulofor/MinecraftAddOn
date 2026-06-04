# Plano — Pipelines e contrato operacional de backend

Este plano organiza a evolução dos pipelines de publicação/validação do backend operacional do servidor Bedrock. O foco é preservar o contrato já validado em ambiente: deploy no host `186.202.209.206`, mundo ativo em `/root/MinecraftServer/worlds/Bedrock level`, logs em `/root/MinecraftServer/logging/bedrock.log`, MCP readonly em `http://186.202.209.206/mcp` e publicação de PNG exclusivamente via MCP.

## Fase 1 — Guardrail estático do contrato operacional

### Objetivo
Criar uma validação automática e localmente reprodutível para impedir regressões em workflows, compose files, scripts e documentação operacional crítica.

### Escopo
- Adicionar script versionado para validar invariantes do contrato operacional.
- Adicionar workflow dedicado para executar o script em `push`, `pull_request` e `workflow_dispatch`.
- Confirmar que o contrato protege os pontos críticos:
  - host canônico do deploy;
  - diretório canônico do mundo Bedrock;
  - diretório/arquivo canônico de logs;
  - MCP readonly e Log Viewer;
  - regra de PNG fora do GitHub Actions;
  - presença de registros operacionais em `docs/registros1.md`.

### Entregáveis
- `tools/validate_pipeline_contract.py`.
- `.github/workflows/validate-pipeline-contract.yml`.
- Registro da execução em `docs/registros1.md`.

### Critérios de aceite
- O validador deve rodar sem acesso ao VPS e sem dependências externas além de Python 3.
- O workflow dedicado deve ter execução manual (`workflow_dispatch`) e validação automática para alterações em workflows, compose, scripts, documentação de contrato e registros.
- A validação deve falhar se algum invariant crítico for removido.
- Nenhum arquivo `.png` deve ser criado ou alterado por esta fase.

### Registro pós-conclusão
- **o que foi feito:** guardrail estático implementado em `tools/validate_pipeline_contract.py`, workflow `.github/workflows/validate-pipeline-contract.yml` criado e registro operacional atualizado.
- **o que ficou faltando:** fases futuras podem extrair checks repetidos dos workflows para scripts reutilizáveis e adicionar smoke tests remotos via MCP/SSH quando houver janela de deploy.
- **impedimentos/bloqueios:** o arquivo de plano solicitado não existia no checkout inicial; ele foi criado nesta execução para materializar a Fase 1 e manter rastreabilidade.

## Fase 2 — Reuso de scripts operacionais pelos workflows

### Objetivo
Reduzir lógica inline em YAML e mover rotinas de vínculo, diagnóstico e validação para scripts versionados reutilizáveis.

### Registro pós-conclusão
- **o que foi feito:** _preencher ao concluir._
- **o que ficou faltando:** _preencher ao concluir._
- **impedimentos/bloqueios:** _preencher ao concluir._

## Fase 3 — Smoke tests remotos controlados

### Objetivo
Adicionar verificações remotas controladas para MCP readonly, Log Viewer e logs Bedrock, mantendo a separação entre deploy de texto via workflow e PNG via MCP.

### Registro pós-conclusão
- **o que foi feito:** _preencher ao concluir._
- **o que ficou faltando:** _preencher ao concluir._
- **impedimentos/bloqueios:** _preencher ao concluir._
