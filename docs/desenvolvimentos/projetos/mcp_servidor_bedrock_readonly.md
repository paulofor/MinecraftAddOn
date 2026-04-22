# MCP Read-Only para host do Bedrock

Este módulo adiciona um servidor MCP focado em leitura de arquivos e execução de comandos Linux de inspeção no host do Bedrock.
Ele suporta transporte via **HTTP** (padrão atual) e também **STDIO** (modo legado).

## O que foi criado

- `infra/mcp-bedrock-readonly/server.py`: servidor MCP com ferramentas de leitura.
- `infra/mcp-bedrock-readonly/Dockerfile`: imagem mínima para execução.
- `docker-compose.mcp-bedrock-readonly.yml`: compose para rodar no mesmo host do Bedrock.

## Ferramentas MCP expostas

1. `list_directory`
   - Lista diretórios permitidos.
2. `read_file`
   - Lê arquivos texto com limite configurável.
3. `run_read_command`
   - Executa somente comandos presentes em allowlist.

### Comandos Linux permitidos

`cat`, `head`, `tail`, `ls`, `find`, `stat`, `du`, `df`, `wc`, `journalctl`

## Segurança aplicada

- Apenas diretórios em `ALLOWED_ROOTS` podem ser lidos.
- Container com montagens `:ro` (somente leitura).
- Sem comandos arbitrários: apenas allowlist.
- Timeout configurável para comandos shell.

## Deploy no host Bedrock

No servidor Linux onde roda o Bedrock:

```bash
docker compose -f docker-compose.mcp-bedrock-readonly.yml build
docker compose -f docker-compose.mcp-bedrock-readonly.yml up -d

# validação rápida
curl -s http://SEU_HOST:8765/health
```

Com a configuração padrão do compose, o endpoint MCP fica em:

- `http://SEU_HOST:8765/mcp`

## Exemplo de configuração no cliente Codex (MCP remoto por HTTP)

Use a URL HTTP do container:

```json
{
  "mcpServers": {
    "bedrock-readonly-http": {
      "url": "http://SEU_HOST:8765/mcp"
    }
  }
}
```

## Exemplo de configuração no cliente Codex (MCP local por Docker/STDIO)

Use um comando equivalente ao abaixo no arquivo de configuração de MCP do cliente:

```json
{
  "mcpServers": {
    "bedrock-readonly": {
      "command": "docker",
      "args": ["compose", "-f", "/root/MinecraftAddOn/docker-compose.mcp-bedrock-readonly.yml", "exec", "-T", "bedrock-mcp-readonly", "python", "/app/server.py"]
    }
  }
}
```

> Observação: no modo `stdio`, o cliente precisa iniciar/acoplar ao processo MCP via comando local (ou SSH + comando remoto).

## Variáveis de ambiente principais

- `ALLOWED_ROOTS` (padrão: `/opt/bedrock-server,/var/log,/root/MinecraftAddOn`)
- `READ_CMD_TIMEOUT` (padrão: `10`)
- `MAX_FILE_BYTES` (padrão: `200000`)
- `MCP_TRANSPORT` (`http` ou `stdio`; padrão: `http`)
- `MCP_HTTP_HOST` (padrão: `0.0.0.0`)
- `MCP_HTTP_PORT` (padrão: `8765`)
