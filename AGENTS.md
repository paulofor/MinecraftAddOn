**Todo trabalho realizado nesse projeto deve ser registrado em : /docs/registros1.md**

# AGENTS

## Objetivo do projeto
Este projeto tem como objetivo criar funcionalidades de Add-Ons com foco educativo para jovens de 16 a 20 anos.

## Regra obrigatória de investigação de causa raiz
Antes de propor ou aplicar qualquer solução, investigue e registre **por que o problema aconteceu**.

Diretriz fixa:
- não resolver apenas o sintoma;
- sempre perguntar explicitamente: **"por que isso aconteceu?"**;
- consultar registros existentes, logs, histórico de tentativas e arquivos impactados antes de escolher a correção;
- se houver uma solução aparente, validar se ela explica a causa raiz ou se apenas contorna o erro;
- registrar a causa identificada, evidências usadas e, quando ainda houver incerteza, a hipótese mais provável e o próximo passo de validação.

Essa regra vale para bugs, falhas de deploy, erros de runtime, problemas de textura, problemas de API, workflows e qualquer comportamento inesperado.

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

## Diretriz obrigatória para funções de construção no mundo
Sempre que criar ou alterar uma função de construção/megaconstrução que use `fill`, `setblock`, estruturas por sprint ou qualquer rotina capaz de modificar uma área grande do mundo, incluir uma etapa de segurança antes da montagem efetiva.

A etapa deve, no mínimo:
- perguntar explicitamente: **"por que essa construção poderia danificar ou ficar mal posicionada no mundo?"**;
- estimar e documentar a área afetada nos eixos X/Y/Z, incluindo subsolo e altura máxima;
- validar se o local recomendado tem margem suficiente para a construção inteira;
- quando houver risco de plataforma flutuando, construção sobre água/lava, colisão com terreno/obras existentes ou execução fora do centro de uma ilha, criar uma trava/prechecagem antes da função de montagem;
- separar, sempre que viável, a função pública de montagem da função interna que realmente constrói, permitindo que a função pública rode validações e só então chame a construção;
- se a trava for por amostragem e não por varredura completa, registrar claramente essa limitação e manter recomendação de validação visual no jogo;
- registrar a causa raiz, evidências, limitação conhecida e próximo passo de validação em `/docs/registros1.md`.

Exemplo de padrão recomendado para Add-Ons arquitetônicos:

```text
montar_completa.mcfunction        -> função pública com prechecks/travas
precheck_ambiente.mcfunction      -> valida água/lava/colisão/altura conforme o caso
construir_estrutura.mcfunction    -> chama init e sprints somente após aprovação
```

Essa regra vale para qualquer construção nova ou alteração em construção existente, não apenas para o Observatório das Estrelas Quebradas.

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


## Regra para arquivos PNG
Arquivos `.png` devem **sempre** ser enviados para o host usando o MCP Server (tool de upload), e **nunca** devem ser adicionados/commitados no Git deste repositório.

Diretriz operacional:
- usar a tool MCP de upload de PNG para publicar/atualizar imagens no host;
- evitar PRs com diff binário de `.png`;
- manter no Git apenas definições, manifests, scripts e demais arquivos texto de configuração.

### Processo obrigatório para imagens de textura (sempre)
Quando houver criação/alteração de **texturas** (`textures/**/*.png`), seguir **obrigatoriamente** este fluxo:

1. **Não commitar PNG no Git**  
   - é proibido abrir PR com diff binário de `.png`;
   - se houver alteração visual, manter no Git apenas arquivos texto correlatos (JSON, manifest, controllers, scripts).

2. **Publicar textura somente via MCP**  
   - usar `tools/call` com `write_png_base64`;
   - destino deve ser caminho do host Bedrock (ex.: `/root/MinecraftServer/resource_packs/.../*.png`).
   - **não usar GitHub Actions/workflow para publicar, copiar, sincronizar, validar ou diagnosticar `.png`**; esse ciclo é exclusivo do MCP.

3. **Validar disponibilidade do MCP antes do upload**  
   - executar `tools/list` no endpoint `http://186.202.209.206/mcp`;
   - se houver `timeout`/`503`, aplicar retentativas até estabilizar.

4. **Validar resultado do upload**  
   - confirmar resposta de sucesso com `bytes_written`;
   - reconsultar arquivo/diretório remoto (quando aplicável) para garantir persistência.

5. **Registrar evidências em `/docs/registros1.md`**  
   - registrar timestamp UTC-3, origem da textura, caminho de destino, resultado e erros/intermitências;
   - em caso de falha, registrar causa e próximo passo.

6. **Versionar objetos relacionados (arquivos texto)**  
   - sempre incrementar versão dos manifests/definições impactadas por alteração de textura, garantindo rastreabilidade de deploy.

### Regra explícita: PNG fora do workflow GitHub
- O pipeline/workflow do GitHub **não é o fluxo oficial de PNG**.
- Qualquer operação com textura `.png` (deploy, atualização, correção, diagnóstico de arquivo) deve ocorrer **somente via MCP**.
- Em PRs, manter no workflow apenas arquivos texto de configuração/manifest/scripts; não adicionar etapas especiais para tratar `.png`.

## Regra de versionamento de objetos
Sempre que alterar qualquer objeto do projeto (entidades, blocos, itens, scripts, manifests ou definições relacionadas), atualizar a versão correspondente no arquivo impactado para garantir rastreabilidade e deploy consistente.

### Regra fixa para BP/RP do mesmo módulo
Sempre que houver alteração em qualquer arquivo de um módulo que possua **Behavior Pack (BP)** e **Resource Pack (RP)** pareados, atualizar **sempre os 2 manifests** no mesmo commit:
- `packs/<BP>/manifest.json`
- `packs/<RP>/manifest.json`

Diretriz de versionamento:
- incrementar ao menos o patch em `header.version` e em todos os `modules[].version` de ambos os manifests;
- não entregar alteração de módulo com bump em apenas um dos manifests (BP ou RP).

## MUITO IMPORTANTE — caminho efetivo de PNG no servidor (prioridade alta)
Para itens/blocos com textura custom em mundos ativos, o PNG **deve existir no pack do mundo** (não apenas no pack global), respeitando exatamente o path referenciado no JSON de textura.

Exemplo validado no ambiente:
- Se `item_texture.json` do `RP_GooDemo` usa `"textures": "textures/items/goo"`, então o arquivo obrigatório é:
  `/root/MinecraftServer/worlds/Bedrock level/resource_packs/RP_GooDemo/textures/items/goo.png`

Regra operacional:
1. Verificar primeiro o pack em `worlds/<nome-do-mundo>/resource_packs/<RP>/...`.
2. Não assumir que `/root/MinecraftServer/resource_packs/<RP>/...` (global) será usado pelo mundo atual.
3. Se faltar PNG no pack do mundo, publicar via MCP (`write_png_base64`) no path do mundo.
4. Após upload, validar presença/tamanho do arquivo e manter versionamento dos manifests/definições impactadas.

Sinal de erro típico: textura preto/roxo mesmo com mapeamento correto no `item_texture.json`.
