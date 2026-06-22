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
4. `get_block`
   - Lê um bloco específico do LevelDB do mundo Bedrock por coordenada absoluta.
5. `get_block_region`
   - Lê uma região limitada de blocos do LevelDB do mundo Bedrock por coordenadas absolutas.
6. `suggest_arena_location`
   - Sugere um centro seguro para montar uma arena no mundo usando coordenadas recentes do `bedrock.log`, tamanho da arena e margem de afastamento.

### Comandos Linux permitidos

`cat`, `head`, `tail`, `ls`, `find`, `stat`, `du`, `df`, `wc`, `journalctl`



## Ferramentas de leitura bloco-a-bloco

As ferramentas `get_block` e `get_block_region` permitem consultar blocos diretamente no LevelDB do mundo Bedrock. Elas continuam readonly: não escrevem no mundo e não executam comandos no servidor Bedrock.

### `get_block`

Entrada típica:

```json
{
  "world_path": "/root/MinecraftServer/worlds/Bedrock level",
  "x": 120,
  "y": 64,
  "z": 430,
  "dimension": 0,
  "use_snapshot": true
}
```

A resposta inclui o nome do bloco, coordenada absoluta, chunk/subchunk e fonte (`leveldb_subchunk` ou `missing_subchunk`).

### `get_block_region`

Entrada típica:

```json
{
  "world_path": "/root/MinecraftServer/worlds/Bedrock level",
  "x1": 111,
  "y1": 61,
  "z1": 421,
  "x2": 129,
  "y2": 70,
  "z2": 439,
  "dimension": 0,
  "include_air": false,
  "use_snapshot": true
}
```

Para proteger o MCP contra respostas enormes, `get_block_region` respeita `MAX_BLOCK_REGION_VOLUME` (padrão: `4096` blocos). Para ler áreas maiores, o cliente deve paginar em regiões menores.

Limitações conhecidas:

- a leitura depende de `plyvel` na imagem do MCP;
- por padrão, `use_snapshot=true` copia temporariamente o diretório `db` antes de abrir o LevelDB, evitando conflito de lock com o Bedrock em execução, mas isso tem custo de I/O;
- o formato de subchunks do Bedrock pode variar por versão, então a ferramenta retorna erro se encontrar um formato não suportado;
- a ferramenta prioriza leitura do layer principal do subchunk; água/fluido ou layers adicionais podem exigir evolução futura;
- recomenda-se usar com o servidor parado ou com cópia/snapshot do mundo quando a consulta exigir consistência forte.

## Ferramenta `suggest_arena_location`

A ferramenta `suggest_arena_location` ajuda a escolher um ponto para montar arenas ou estruturas geradas por função sem depender apenas de inspeção manual dos logs. Ela continua sendo readonly: não altera o mundo e não executa comandos no Bedrock.

Entrada típica para a arena do Mistério Histórico:

```json
{
  "world_path": "/root/MinecraftServer/worlds/Bedrock level",
  "log_path": "/root/MinecraftServer/logging/bedrock.log",
  "size_x": 19,
  "size_y": 10,
  "size_z": 19,
  "preferred_y": 64,
  "margin": 48
}
```

A resposta inclui:

- `recommended_center`: coordenada central sugerida;
- `affected_area`: faixa aproximada que será afetada pela construção;
- `confidence`: confiança heurística (`medium` ou `low`);
- `reasons`: justificativas baseadas em coordenadas recentes encontradas no log;
- `warnings`: limitações, incluindo a necessidade de confirmar visualmente no jogo;
- `operator_commands`: comandos prontos para teleporte e execução da função de montagem.

Limitação importante: a ferramenta usa logs e heurística de afastamento. Ela não faz varredura bloco-a-bloco do LevelDB nem garante que a área esteja vazia.

## Segurança aplicada

- Apenas diretórios em `ALLOWED_ROOTS` podem ser lidos.
- Container com montagens `:ro` (somente leitura).
- Sem comandos arbitrários: apenas allowlist.
- Timeout configurável para comandos shell.

## Caminhos padrão dentro do container

Para manter um único padrão canônico, o compose usa os mesmos caminhos absolutos do host dentro do container:

- Bedrock root: `/root/MinecraftServer`
- Log canônico: `/root/MinecraftServer/logging/bedrock.log`
- Repositório: `/root/MinecraftAddOn`

Use esses caminhos nas chamadas MCP (`list_directory`, `read_file`, `run_read_command` com `cwd`).

## Deploy no host Bedrock

No servidor Linux onde roda o Bedrock:

```bash
docker compose -f docker-compose.mcp-bedrock-readonly.yml build
docker compose -f docker-compose.mcp-bedrock-readonly.yml up -d

# validação rápida
curl -s http://SEU_HOST/health
```

Com a configuração padrão do compose, o endpoint MCP fica em:

- `http://SEU_HOST/mcp`

## Exemplo de configuração no cliente Codex (MCP remoto por HTTP)

Use a URL HTTP do container:

```json
{
  "mcpServers": {
    "bedrock-readonly-http": {
      "url": "http://SEU_HOST/mcp"
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

- `ALLOWED_ROOTS` (padrão: `/root/MinecraftServer,/root/MinecraftServer/logging,/root/MinecraftServer/logging/bedrock.log,/root/MinecraftAddOn`)
- `READ_CMD_TIMEOUT` (padrão: `10`)
- `MAX_FILE_BYTES` (padrão: `200000`)
- `MCP_TRANSPORT` (`http` ou `stdio`; padrão: `http`)
- `MCP_HTTP_HOST` (padrão: `0.0.0.0`)
- `MCP_HOST_PORT` (padrão: `80`, porta publicada no host)
- `MCP_HTTP_PORT` (padrão: `8765`, porta interna do serviço no container)
- `MAX_BLOCK_REGION_VOLUME` (padrão: `4096`, limite de blocos retornados por `get_block_region`)
