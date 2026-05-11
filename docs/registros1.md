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
