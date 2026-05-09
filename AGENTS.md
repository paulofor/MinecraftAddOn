# AGENTS

## Objetivo do projeto
Este projeto tem como objetivo criar funcionalidades de Add-Ons com foco educativo para jovens de 16 a 20 anos.

## Containers de apoio
- **Server**: container responsável por executar e validar os serviços principais do projeto.
- **MCP**: container de apoio para integração de contexto, automações e suporte às operações de desenvolvimento.

## Estrutura canônica no host (Servidor Bedrock)
A estrutura de pastas e arquivos do host, relacionada ao servidor Bedrock, deve seguir este padrão:

```text
/root/MinecraftServer/
├── worlds/
├── world_templates/
├── treatments/
├── resource_packs/
├── premium_cache/
├── minecraftpe/
├── logging/
├── development_skin_packs/
├── development_resource_packs/
├── development_behavior_packs/
├── definitions/
├── data/
├── config/
├── behavior_packs/
├── server.properties
├── release-notes.txt
├── profanity_filter.wlist
├── permissions.json
├── packetlimiting.json
├── packet-statistics.txt
├── Dedicated_Server.txt
├── bedrock_server_how_to.html
├── bedrock_server
└── allowlist.json
```

Containers auxiliares observados no host:

```text
minecraftaddon-bedrock-log-viewer-1   -> 0.0.0.0:8081->8081/tcp
minecraftaddon-bedrock-mcp-readonly-1 -> 0.0.0.0:80->8765/tcp
```

## Host/IP correto para acesso remoto (conforme deploy)
De acordo com os arquivos de deploy/workflow, o host remoto correto é:

```text
186.202.209.206
```

URLs externas esperadas:

```text
Log Viewer: http://186.202.209.206:8081
MCP Readonly (atual): http://186.202.209.206/mcp
```

## Local real dos logs do Bedrock (validado em ambiente)
Conforme verificado no servidor, os logs do Bedrock estão em:

```text
/root/MinecraftServer/logging/
```

Arquivo principal observado:

```text
/root/MinecraftServer/logging/bedrock.log
```

> Observação: o MCP readonly também deve usar `/root/MinecraftServer/logging` para manter o padrão único de diretórios.

## Diretriz para planos de Add-On
Sempre que for solicitado um **plano de Add-On**, o plano deve ser estruturado por **sprints**.

Além disso, cada sprint deve conter obrigatoriamente um espaço de **registro pós-conclusão** para o(a) desenvolvedor(a) preencher:
- o que foi feito;
- o que ficou faltando;
- impedimentos/bloqueios (se houver).

## MCP Server oficial da Microsoft (Minecraft)
Para consultas de documentação e materiais oficiais de Minecraft, utilizar também o MCP Server da Microsoft Learn:

```json
"microsoft-learn": {
  "type": "http",
  "url": "https://learn.microsoft.com/api/mcp"
}
```

## Playbook de depuração — módulo Ilha da Lógica

Quando houver problema de interação (ex.: `sea_lantern`/`lectern` não responde), seguir este fluxo.

### 1) Acessar o MCP Readonly (JSON-RPC)
Endpoint:

```text
http://186.202.209.206/mcp
```

Listar tools disponíveis:

```bash
curl -sS -X POST 'http://186.202.209.206/mcp' \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

### 2) Verificar diretório e log do Bedrock
Listar diretório de logs:

```bash
curl -sS -X POST 'http://186.202.209.206/mcp' \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_directory","arguments":{"path":"/root/MinecraftServer/logging"}}}'
```

Ler últimas linhas do log:

```bash
curl -sS -X POST 'http://186.202.209.206/mcp' \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"run_read_command","arguments":{"command":"tail","args":["-n","200","/root/MinecraftServer/logging/bedrock.log"]}}}'
```

### 3) O que buscar no `bedrock.log`
Filtrar mensagens úteis:

- `[Scripting]`
- `[IlhaLogica][Hub]`
- `TypeError`
- `SyntaxError`
- `runHub`
- nome do arquivo, por exemplo `main.js`

Dica prática: confirmar no log se houve:
1. interação detectada (`interação válida ... sea_lantern/lectern`);
2. trigger disparado (`triggerHub ...`);
3. erro imediatamente após (`TypeError`, `not a function`, etc.).

### 4) Ajustar código no módulo da Ilha da Lógica
Arquivo principal:

```text
packs/BP_IlhaLogicaComputacao/scripts/main.js
```

Checklist mínimo após ajuste:

1. validar sintaxe JS local (`node --check`);
2. publicar/deploy do pack no servidor;
3. reproduzir interação no jogo;
4. revalidar `bedrock.log` via MCP para confirmar ausência de erro.

### 5) Usar MCP da Microsoft para referência oficial
Quando a correção envolver API Script do Bedrock (mudança de método/evento/comportamento), consultar MCP da Microsoft Learn para validar a API atual antes de alterar o código.

Configuração de referência:

```json
"microsoft-learn": {
  "type": "http",
  "url": "https://learn.microsoft.com/api/mcp"
}
```

Objetivo: evitar regressão por uso de método indisponível na versão do servidor.
