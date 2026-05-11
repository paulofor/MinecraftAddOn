# Registros 

> Orientação: todos os registros deste documento devem sempre incluir **data e hora no fuso UTC-3**.
> Neste documento segue política de **append-only** (não pode ter nenhuma linha apagada; apenas inserções).

> Regra obrigatória de timestamp:
> Antes de adicionar qualquer novo registro, execute obrigatoriamente:
>
> ```bash
> TZ=America/Sao_Paulo date '+%Y-%m-%d %H:%M:%S UTC-3'
> ```
>
> Use exatamente a saída desse comando no título do novo registro.
> É proibido inventar, estimar, inferir ou reaproveitar data/hora a partir de:
> - contexto da conversa;
> - data do commit;
> - data do CI/build;
> - metadados do arquivo;
> - relógio UTC sem conversão explícita;
> - registros anteriores deste documento.
>
> O formato obrigatório do título é:
>
> ```md
> ## YYYY-MM-DD HH:mm:ss UTC-3
> ```
>
> Cada novo registro deve ser adicionado no final do arquivo.
> Se for necessário registrar mais de uma entrada, execute novamente o comando de data/hora para cada entrada.
> Nunca crie registro com timestamp futuro em relação ao horário atual de `America/Sao_Paulo`.
> Em caso de timestamp incorreto já registrado, não apague nem edite o registro antigo; adicione um novo registro de correção explicando o erro.
> Neste documento segue política de **append-only** (não pode ter nenhuma linha apagada; apenas inserções).


## 2026-05-11 11:40:30 UTC-3
- Investigação do barco de 3 lugares com textura rosa/magenta.
- Consulta à documentação oficial da Microsoft Learn (MCP Server Microsoft) para validar configuração correta de textura em `minecraft:client_entity` (uso de `description.textures` com caminho relativo sem extensão e correspondência com `render_controllers`).
- Correção aplicada: arquivo `packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png` estava como ponteiro Git LFS (texto) e não PNG válido; foi substituído por PNG válido para eliminar fallback magenta.
- Versionamento atualizado no `manifest.json` do RP Barco 3 Jogadores de `0.1.4` para `0.1.5` para rastreabilidade de objeto visual.

## 2026-05-11 11:45:27 UTC-3
- Ajuste complementar após revisão: substituição da textura temporária por textura oficial de referência (`boat_oak.png`) do repositório oficial Mojang Bedrock Samples (Microsoft/Mojang).
- Objetivo: garantir UV/layout fiel ao modelo de barco e evitar desalinhamentos visuais.
- Versionamento do RP Barco 3 Jogadores atualizado de `0.1.5` para `0.1.6` (header e module) por alteração de objeto visual.
- 2026-05-11: tentativa de consulta ao MCP Readonly do host `http://186.202.209.206/mcp` via JSON-RPC (`tools/list`) retornou timeout de conexão (indisponibilidade no momento da análise).
- 2026-05-11: consulta de referência na Microsoft Learn (MCP/Docs) para `minecraft:input_ground_controlled` e `client_entity` confirmou uso de WASD para entidades montáveis e referência de textura por caminho relativo sem extensão.
- Correção do barco 3 lugares:
  - textura `packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png` estava em formato ponteiro (texto Git LFS) e foi substituída por PNG válido (base `boat_oak.png` do repositório oficial `Mojang/bedrock-samples`), removendo o preto/magenta;
  - saneamento de `packs/BP_Barco3Jogadores/entities/barco_3_jogadores.json` removendo chaves duplicadas de componentes (`minecraft:health` e `minecraft:collision_box`), que causavam comportamento inconsistente de pilotagem/colisão;
  - versionamento atualizado por regra de rastreabilidade: BP `0.1.5` -> `0.1.6`; RP `0.1.6` -> `0.1.7`.

## 2026-05-11 13:58:25 UTC-3
- Nova tentativa de correção do Barco 3 Jogadores após feedback de que persistia problema de navegação.
- Ajuste estrutural em         : remoção dos componentes manuais de movimento/controle terrestre e alinhamento do comportamento ao padrão oficial da entidade  (colisão, buoyancy e configuração de assentos).
- Reconfiguração dos assentos para 3 jogadores mantendo o primeiro assento como controlador () e com offsets compatíveis com o barco vanilla.
- Versionamento atualizado por alteração de objeto: BP incrementado para  e RP incrementado para .

## 2026-05-11 13:58:37 UTC-3
- Registro de correção: a entrada imediatamente anterior perdeu trechos entre crases por expansão indevida de shell durante o append.
- Conteúdo correto da correção aplicada no barco:
  - arquivo `packs/BP_Barco3Jogadores/entities/barco_3_jogadores.json` foi reestruturado para remover componentes manuais de controle terrestre e alinhar a base de movimentação/flutuação ao padrão da `minecraft:boat` oficial;
  - assentos configurados para 3 jogadores com `controlling_seat: 0` e posições baseadas no layout do barco vanilla, preservando dirigibilidade no assento do piloto;
  - versionamento atualizado por alteração de objeto: BP `0.1.6` -> `0.1.7` e RP `0.1.7` -> `0.1.8`.

## 2026-05-11 14:40:09 UTC-3
- Ajuste no workflow de publicação do servidor para evitar envio de ponteiros Git LFS no lugar dos binários reais (ex.: `.png`).
- Alteração aplicada em `.github/workflows/publish-server.yml`:
  - `actions/checkout@v4` configurado com `lfs: true`;
  - etapa explícita `git lfs pull` adicionada antes da sincronização de `packs/`.
- Objetivo: garantir que o `rsync` publique texturas/imagens reais no servidor remoto.

## 2026-05-11 14:46:06 UTC-3
- Diagnóstico de falha no CI ao executar `git lfs fetch origin refs/remotes/origin/main` com erro 404 para múltiplos objetos LFS ausentes no endpoint `https://github.com/paulofor/MinecraftAddOn.git/info/lfs`.
- Causa provável registrada: histórico do repositório referencia ponteiros LFS cujos binários não estão mais presentes no storage LFS remoto (objetos órfãos/removidos), impedindo fetch completo em ambientes limpos.
- Diretriz operacional para pipeline: evitar etapa de `git lfs fetch` global do branch enquanto houver objetos ausentes e priorizar checkout/publicação sem dependência de blobs LFS legados não utilizados no deploy atual.
- Próxima ação recomendada: inventariar arquivos LFS referenciados no `origin/main`, restaurar/reenviar os objetos faltantes para o Git LFS remoto (ou remover/regravar referências históricas se a política do projeto permitir).

## 2026-05-11 14:48:18 UTC-3
- Levantamento explícito dos objetos Git LFS não encontrados (erro 404) no fetch de `origin/main`:
  - `2d66414bd0242fbe0cde4ef42ccb2d1b9ff3cb9dc261f483b530070116f17f8b`
  - `fa66f7122c0aa05eaed2039ba0bb5688074373fbcb328308abf9439870233f48`
  - `9cebb9bdeb8981416f974ec5b341581c8fa0abada71c5320f803974d526cff3b`
  - `e1181c3eea0f075e3c79ac81f71af5abb0245580ea5638a06269d4edfffd104c`
  - `7e93fa876b64ad216e887fab72ea2e4f3103c8b6c97c10526037b318b2a0a1c4`
- Registro criado para responder objetivamente ao questionamento sobre quais objetos estavam ausentes no servidor LFS.

## 2026-05-11 14:50:37 UTC-3
- Verificação de correlação entre hashes LFS ausentes e arquivos do Barco 3 Jogadores.
- Resultado: **sim**, há objetos ausentes relacionados ao barco de 3 pessoas no histórico da textura `packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png`.
- Mapeamento identificado:
  - `2d66414bd0242fbe0cde4ef42ccb2d1b9ff3cb9dc261f483b530070116f17f8b` (commit `98c2f2d`);
  - `9cebb9bdeb8981416f974ec5b341581c8fa0abada71c5320f803974d526cff3b` (commit `3195a1b`).
- Os demais hashes ausentes listados anteriormente não foram confirmados nesta verificação como pertencentes ao arquivo do barco 3 jogadores.

## 2026-05-11 14:53:40 UTC-3
- Ação para eliminar erros de objetos LFS ausentes no CI: remoção do rastreamento LFS para imagens (`*.png`, `*.jpg`, `*.jpeg`, `*.webp`) em `.gitattributes`.
- Substituição dos 5 arquivos atualmente quebrados (ponteiros LFS com 404) por PNGs binários válidos versionados diretamente no Git:
  - `packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png`
  - `packs/RP_QuadroIdeias/textures/blocks/quadro_ideias_frente.png`
  - `packs/RP_QuadroIdeias/textures/blocks/quadro_ideias_lateral.png`
  - `packs/RP_QuadroIdeias/textures/blocks/quadro_ideias_topo.png`
  - `packs/RP_QuadroInformacoes/textures/blocks/quadro_informacoes.png`
- Versionamento atualizado por alteração de objetos visuais:
  - `packs/RP_Barco3Jogadores/manifest.json`: `0.1.8` -> `0.1.9`;
  - `packs/RP_QuadroIdeias/manifest.json`: `0.3.0` -> `0.3.1`;
  - `packs/RP_QuadroInformacoes/manifest.json`: `0.1.0` -> `0.1.1`.

## 2026-05-11 15:07:05 UTC-3
- Implementada nova tool MCP `write_png_base64` no serviço `infra/mcp-bedrock-readonly/server.py` para envio de imagens `.png` ao host por JSON-RPC.
- A tool valida escopo de caminho permitido (`ALLOWED_ROOTS`), exige extensão `.png`, valida base64 e assinatura PNG (`\x89PNG\r\n\x1a\n`) e suporta `overwrite` opcional.
- Catálogo de tools (`tools/list`) atualizado para expor `write_png_base64` com schema de entrada (`path`, `png_base64`, `overwrite`).
- Roteamento `tools/call` atualizado para tratar a nova tool, retornando caminho e bytes gravados.
- Versionamento do servidor MCP atualizado de `0.1.0` para `0.2.0` por adição de capacidade de escrita.

## 2026-05-11 15:09:47 UTC-3
- Atualização do `AGENTS.md` com diretriz explícita para assets PNG:
  - arquivos `.png` devem ser enviados sempre via MCP Server (tool de upload);
  - arquivos `.png` não devem ser adicionados/commitados no Git do repositório.
- Incluídas orientações operacionais para evitar PR com diff binário de imagem e manter no Git apenas arquivos texto de definição/configuração.

## 2026-05-11 15:12:43 UTC-3
- Remoção de conteúdo binário dos arquivos `.png` no commit atual, conforme solicitação.
- Os 5 arquivos de textura foram revertidos para formato texto de ponteiro Git LFS (3 linhas `version/oid/size`), eliminando diff binário de PR:
  - `packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png`
  - `packs/RP_QuadroIdeias/textures/blocks/quadro_ideias_frente.png`
  - `packs/RP_QuadroIdeias/textures/blocks/quadro_ideias_lateral.png`
  - `packs/RP_QuadroIdeias/textures/blocks/quadro_ideias_topo.png`
  - `packs/RP_QuadroInformacoes/textures/blocks/quadro_informacoes.png`
- Diretriz preservada: PNG real deve ser publicado via MCP Server (tool de upload), não via commit binário no Git.

## 2026-05-11 15:32:45 UTC-3
- Ajuste no `docker-compose.mcp-bedrock-readonly.yml` para permitir escrita no diretório Bedrock quando necessário para upload de PNG via tool MCP `write_png_base64`.
- Alteração aplicada no mount do Bedrock: `:ro` -> `:${BEDROCK_ROOT_MOUNT_MODE:-rw}` (padrão agora `rw`, configurável por variável de ambiente).
- Mantido o mount do repositório host como somente leitura por padrão, mas parametrizado: `:${HOST_REPO_MOUNT_MODE:-ro}`.
- Objetivo: destravar publicação de texturas `.png` diretamente no host pelo MCP sem perder controle operacional por ambiente.

## 2026-05-11 17:41:23 UTC-3
- Solicitação operacional: envio da textura do `barco_3_jogadores` via MCP Server (sem commit de PNG no Git).
- Tentativa 1 (`write_png_base64` usando o arquivo do repositório) falhou com erro do MCP: `Conteúdo não é PNG válido (assinatura ausente)`.
- Diagnóstico local confirmou que `packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png` está como ponteiro Git LFS (texto), não binário PNG.
- Tentativa 2 com PNG válido baixado de `Mojang/bedrock-samples` (`boat_oak.png`) também foi executada, porém o endpoint `http://186.202.209.206/mcp` retornou `HTTP 503 Service Unavailable` no momento do envio.
- Resultado: envio remoto não concluído por indisponibilidade do MCP remoto.

## 2026-05-11 17:44:31 UTC-3
- Reexecução da solicitação: envio da textura do barco 3 jogadores via MCP Server (`write_png_base64`).
- Healthcheck `tools/list` no endpoint `http://186.202.209.206/mcp` apresentou intermitência (timeouts/503), mas confirmou disponibilidade da tool `write_png_base64` em uma das tentativas.
- Upload realizado com sucesso na 3ª tentativa (após retentativas automáticas) usando PNG válido (`boat_oak.png`, 1574 bytes) para o destino `/root/MinecraftServer/resource_packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png`.
- Resposta MCP de sucesso: `bytes_written: 1574`.

## 2026-05-11 17:56:26 UTC-3
- Atualizado `AGENTS.md` para deixar explícito e permanente o processo obrigatório de tratamento de imagens de textura (`textures/**/*.png`).
- O fluxo foi detalhado em 6 passos mandatórios: proibição de commit binário de PNG, upload exclusivo via MCP (`write_png_base64`), validação de disponibilidade (`tools/list`), validação de sucesso (`bytes_written`), registro obrigatório em `/docs/registros1.md` e versionamento dos objetos texto correlatos.
- Objetivo: remover ambiguidades operacionais e reforçar a regra “sempre via MCP” para texturas.

## 2026-05-11 18:00:41 UTC-3
- Novo ajuste para resolver textura magenta persistente no barco de 3 jogadores sem versionar PNG no Git.
- Alteração em `packs/RP_Barco3Jogadores/entity/barco_3_jogadores.entity.json`: textura do `client_entity` trocada de `textures/entity/barco_3_jogadores` para `textures/entity/boat/boat_oak` (textura vanilla existente no cliente), eliminando dependência de arquivo PNG custom no repositório.
- Versionamento de objeto atualizado em `packs/RP_Barco3Jogadores/manifest.json`: `0.1.9` -> `0.1.10` (header e module) para forçar atualização de pack no cliente/servidor.
- Próximo passo operacional recomendado: aplicar deploy do RP atualizado e reentrar no mundo para invalidar cache local de resource pack.

## 2026-05-11 18:10:19 UTC-3
- Diagnóstico orientado por logs/MCP para o problema de textura do barco ainda magenta.
- Verificação no `bedrock.log` confirmou carregamento do BP (`BP Barco 3 Jogadores v0.1.7`) e spawn da entidade, sem erro de script para o barco, indicando problema de asset/deploy do RP e não de runtime da entidade.
- Ajuste no `client_entity` revertido para usar novamente textura custom `textures/entity/barco_3_jogadores` (agora que o PNG válido já existe no host).
- Ajuste no workflow `.github/workflows/publish-server.yml`: sincronização de `RP_*` para o mundo agora ignora `textures/**/*.png` no `rsync`, evitando sobrescrever no servidor os PNGs publicados via MCP com ponteiros/arquivos do repositório.
- Versionamento atualizado em `packs/RP_Barco3Jogadores/manifest.json`: `0.1.10` -> `0.1.11` (header e module).

## 2026-05-11 18:14:35 UTC-3
- Atendimento ao pedido de observabilidade: adicionado log explícito no workflow de deploy durante a promoção de `RP_Barco3Jogadores` para diagnosticar textura no momento da sincronização.
- No passo `Promover packs para o mundo Bedrock`, após o `rsync` do RP, o workflow agora imprime:
  - caminho da textura no repositório remoto (`$REMOTE_DIR/packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png`), com `ls -lh` e `file`;
  - caminho da textura no mundo Bedrock (`$WORLD_RP_DIR/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png`), com `ls -lh` e `file`.
- Objetivo: permitir identificar no log do GitHub Actions se a textura está ausente, como ponteiro texto ou PNG válido no momento exato do deploy.
