# MCP Read-Only para host do Bedrock

Este módulo adiciona um servidor **MCP via STDIO** focado em leitura de arquivos e execução de comandos Linux de inspeção no host do Bedrock.

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
```

## Exemplo de configuração no cliente Codex (MCP local por Docker)

Use um comando equivalente ao abaixo no arquivo de configuração de MCP do cliente:

```json
{
  "mcpServers": {
    "bedrock-readonly": {
      "command": "docker",
      "args": ["exec", "-i", "bedrock-mcp-readonly", "python", "/app/server.py"]
    }
  }
}
```

> Observação: como o transporte aqui é `stdio`, o cliente precisa iniciar/acoplar ao processo MCP via comando local (ou SSH + comando remoto).

## Variáveis de ambiente principais

- `ALLOWED_ROOTS` (padrão: `/opt/bedrock-server,/var/log,/root/MinecraftAddOn`)
- `READ_CMD_TIMEOUT` (padrão: `10`)
- `MAX_FILE_BYTES` (padrão: `200000`)
