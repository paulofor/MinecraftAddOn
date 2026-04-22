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
minecraftaddon-bedrock-mcp-readonly-1 -> 0.0.0.0:8765->8765/tcp
```

## Host/IP correto para acesso remoto (conforme deploy)
De acordo com os arquivos de deploy/workflow, o host remoto correto é:

```text
186.202.209.206
```

URLs externas esperadas:

```text
Log Viewer: http://186.202.209.206:8081
MCP Readonly: http://186.202.209.206:8765
```

## Local real dos logs do Bedrock (validado em ambiente)
Conforme verificado no servidor, os logs do Bedrock estão em:

```text
/opt/bedrock-server/logs/
```

Arquivo principal observado:

```text
/opt/bedrock-server/logs/bedrock.log
```

> Observação: para MCP readonly, use este caminho de logs em vez de `/root/MinecraftServer/logging` quando houver restrição de escopo de diretórios.
