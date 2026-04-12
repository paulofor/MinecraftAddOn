# 🚀 Inicialização de Projeto: Add-ons para Minecraft Bedrock

Este repositório foi preparado como ponto de partida para desenvolver **add-ons de Minecraft Bedrock Edition** (Behavior Pack + Resource Pack) e publicar versões de forma organizada.

---

## 1) Objetivo do repositório

Criar uma base simples e profissional para:
- desenvolver add-ons com estrutura padronizada;
- versionar alterações com Git;
- validar packs antes de copiar para o servidor/mundo;
- facilitar colaboração (futuro CI/CD, releases e documentação).
- orientar a criação de add-ons com objetivo **educativo**, focados em jovens na faixa de **16 a 20 anos**.

---

## 2) Pré-requisitos

Antes de começar, garanta que você tenha:

- **Minecraft Bedrock Edition** (cliente para testes locais);
- **Acesso ao servidor/mundo Bedrock** (como no print enviado);
- **Node.js LTS** (recomendado para scripts/utilitários);
- **Git**;
- Editor como **VS Code**.

Opcional, mas recomendado:
- `zip`/`unzip` para empacotar versões;
- extensão do VS Code para JSON;
- ambiente Linux no servidor para deploy por script.

---

## 3) Estrutura inicial sugerida

```text
MinecraftAddOn/
├─ packs/
│  ├─ BP_NomeDoAddon/                  # Behavior Pack
│  │  ├─ manifest.json
│  │  ├─ scripts/
│  │  └─ ...
│  └─ RP_NomeDoAddon/                  # Resource Pack
│     ├─ manifest.json
│     ├─ textures/
│     ├─ sounds/
│     └─ ...
├─ worlds/
│  └─ BedrockLevelRefs/                # referências de config do mundo (sem dados sensíveis)
├─ tools/
│  ├─ validate.sh                      # valida JSON e estrutura
│  ├─ package.sh                       # gera .mcpack/.zip
│  ├─ deploy.sh                        # copia para servidor (opcional)
│  └─ backup_environment.sh            # backup do ambiente + agendamento no cron
├─ docs/
│  ├─ roadmap.md
│  ├─ conventions.md
│  └─ changelog.md
├─ .gitignore
└─ README.md
```

> **Importante:** nunca commitar segredos, IPs privados, senhas, tokens ou arquivos gigantes do mundo.

---

## 4) Checklist técnico para iniciar

### 4.1 Behavior Pack (BP)
- Criar `manifest.json` com UUIDs únicos;
- Definir módulos corretos (`data` e/ou `script`);
- Separar entidades, itens, blocos e regras por pastas;
- Nomear arquivos com padrão consistente.

### 4.2 Resource Pack (RP)
- Criar `manifest.json` com UUIDs únicos (diferentes do BP);
- Mapear texturas e animações;
- Garantir compatibilidade de caminhos e namespaces;
- Manter organização por domínio (itens, blocos, entidades).

### 4.3 Versionamento
- Usar versionamento semântico inicial: `0.1.0`;
- Subir versão no `manifest.json` a cada release;
- Registrar mudanças em `docs/changelog.md`.

---

## 5) Padrões recomendados

- **Nome do namespace**: curto e único (ex.: `digicomo`);
- **Convenção de arquivos**: `snake_case`;
- **Uma feature por pasta** para facilitar manutenção;
- **Commits pequenos e descritivos**;
- **Validação local antes de deploy**.

Exemplos de mensagens de commit:
- `feat: adiciona item martelo de cobre`
- `fix: corrige textura ausente do bloco basalto_polido`
- `chore: atualiza versão para 0.2.0`

---

## 6) Fluxo de trabalho sugerido

1. Criar/editar arquivos em `packs/`;
2. Validar JSON e estrutura;
3. Testar no cliente Bedrock;
4. Empacotar versão (`tools/package.sh`);
5. Deploy no servidor/mundo (`tools/deploy.sh`);
6. Commit + tag da versão.

---

## 7) Integração com seu servidor (com base no print)

No print, aparece a pasta de mundo com diretórios como `behavior_packs` e JSON de referência do mundo. Em um cenário típico:

- copiar BP para pasta de behavior packs do mundo/servidor;
- copiar RP para pasta de resource packs do mundo/servidor;
- atualizar os arquivos de vínculo do mundo quando necessário;
- reiniciar mundo/servidor para validar carregamento.

> Faça sempre backup antes de substituir packs em produção.

### Serviço do Minecraft Server (systemd)

Para iniciar o serviço do servidor Minecraft Bedrock:

```bash
systemctl start bedrock.service
```

### Visualizar add-ons instalados na página do log viewer (porta 8081)

O `infra/log-viewer/server.py` agora também mostra, na própria página `http://<host>:8081`,
os add-ons encontrados em `behavior_packs` e `resource_packs`, incluindo status de vínculo
com o mundo (ativo/não vinculado).

No `docker-compose.log-viewer.yml`, já estão mapeados:

- `.../worlds/Bedrock level/behavior_packs`
- `.../worlds/Bedrock level/resource_packs`
- `.../worlds/Bedrock level/world_behavior_packs.json`
- `.../worlds/Bedrock level/world_resource_packs.json`

Ao subir o container, o servidor também imprime no log a lista de add-ons detectados.

### Validação dos vínculos do mundo (UUID + versão)

Para validar no servidor se os arquivos `world_behavior_packs.json` e
`world_resource_packs.json` estão apontando para os UUIDs corretos e a mesma versão
do `manifest.json` atual:

```bash
python3 tools/validate_world_bindings.py --world-dir "/root/MinecraftServer/worlds/Bedrock level"
```

Regras validadas automaticamente:
- BP UUID: `068c529a-0932-4d6b-95ee-da0af9fb8e23`;
- RP UUID: `99378e84-5b66-408a-b77c-1cc7b33f2b0b`;
- versão em `world_*_packs.json` igual à versão dos manifests (ex.: `[0,1,0]`).

Para executar essa checagem remotamente via SSH (sem login interativo):

```bash
./tools/validate_world_bindings_remote.sh \
  --host 186.202.209.206 \
  --user root \
  --world-dir "/root/MinecraftServer/worlds/Bedrock level"
```

Para **atualizar automaticamente** os vínculos do mundo com os UUIDs/versões dos manifests (sem heredoc inline):

```bash
./tools/update_world_bindings_remote.sh \
  --host 186.202.209.206 \
  --user root \
  --identity ~/.ssh/id_ed25519 \
  --world-dir "/root/MinecraftServer/worlds/Bedrock level"
```

### Deploy completo dos packs para o mundo remoto (cópia + vínculos + restart)

Quando você altera arquivos dentro de `packs/`, use este script para copiar tudo para as
pastas corretas do mundo (`behavior_packs/` e `resource_packs/`), atualizar
`world_behavior_packs.json`/`world_resource_packs.json`, validar e reiniciar o serviço:

```bash
./tools/deploy_world_remote.sh \
  --host 186.202.209.206 \
  --user root \
  --identity ~/.ssh/id_ed25519 \
  --world-dir "/root/MinecraftServer/worlds/Bedrock level"
```

Opções úteis:
- `--dry-run`: mostra os arquivos que seriam copiados sem alterar nada;
- `--no-restart`: publica sem reiniciar o `bedrock.service`;
- `--bp-name` / `--rp-name`: troca o nome das pastas dos packs, se necessário;
- `--repo-dir`: caminho do repositório no servidor remoto (padrão: `/root/MinecraftAddOn`).

### Checklist de runtime do mundo (Script API / Experimentos)

Antes de validar em produção, confirme no mundo/servidor Bedrock que os requisitos de runtime estão habilitados para a **mesma versão do servidor em uso**:

- [ ] O pack possui módulo `script` no `manifest.json` (quando houver scripts em `BP_*/scripts`).
- [ ] Dependências de Script API declaradas no `manifest.json` (ex.: `@minecraft/server`) com versão compatível com o binário do Bedrock Server.
- [ ] Experimentos exigidos pelo add-on habilitados no mundo (por exemplo, recursos beta/experimental quando necessário na versão instalada).
- [ ] `world_behavior_packs.json` e `world_resource_packs.json` vinculados aos UUIDs/versões atuais dos manifests.
- [ ] O servidor foi reiniciado/recarregado após atualização dos packs, quando a versão/plataforma exigir.

> Dica: se houver divergência entre versão do módulo Script API e versão do servidor, o mundo pode abrir sem os comportamentos de script.

### Validação de compatibilidade de versão (sem chute)

Para evitar “chutar” `format_version`, valide contra a versão real do Bedrock Server.
A regra usada é objetiva: `format_version` e `min_engine_version` devem ser **menores ou iguais** à versão do servidor.

Descubra a versão em execução no host (exemplo):

```bash
strings bedrock_server | rg -m1 -o '([0-9]+\.){3}[0-9]+'
```

Depois valide no repositório (exemplo para servidor `1.21.0`):

```bash
python3 tools/validate_engine_compat.py --server-version 1.21.0 --repo-dir .
```

Se o script falhar, ajuste os arquivos para uma versão suportada pelo servidor em produção.

### Confirmação pós-publicação (logs do Bedrock)

Após copiar/publicar os packs no servidor, valide imediatamente os logs para detectar erro de import/script:

```bash
journalctl -u bedrock.service -n 200 --no-pager
```

Procure por mensagens de erro relacionadas a:
- falha de carregamento de módulo de script;
- import inválido/não encontrado;
- dependência com versão incompatível;
- API/experimento desabilitado no mundo.

Se necessário, acompanhe em tempo real durante o boot:

```bash
journalctl -u bedrock.service -f
```

### Troubleshooting rápido

| Sintoma nos logs | Causa provável | Ação recomendada |
| --- | --- | --- |
| `Failed to load module` / `Cannot find module` | Caminho de import incorreto, arquivo ausente ou módulo não suportado na versão atual | Revisar imports no `scripts/`, confirmar arquivo publicado e compatibilidade da versão da Script API no `manifest.json`. |
| `Invalid dependency` / `Dependency version mismatch` | Dependência declarada com versão diferente da suportada pelo Bedrock Server | Ajustar versão da dependência no `manifest.json` para a versão suportada pela build do servidor e republicar. |
| `Script API disabled` / recursos experimentais desativados | Mundo sem APIs/experimentos necessários habilitados | Habilitar os experimentos/APIs requeridos na configuração do mundo e reiniciar o servidor. |
| Pack aparece, mas comportamento não executa | Vinculação do mundo com UUID/versão antiga | Executar `tools/validate_world_bindings.py`, corrigir `world_*_packs.json` e reiniciar/recarregar. |
| `/give @s digicomo:quadro_ideias 1` falha com `item not found` | Mundo carregou pack antigo ou incompleto | Rodar `/scriptevent digicomo:diagnostico`, confirmar se o BP/RP corretos estão vinculados e reiniciar/recarregar o mundo. |

#### Erro de sintaxe no `/give` (caso comum)

Se aparecer no chat algo como **"Erro de sintaxe ... inesperado em `/give @s %digicomo...`"**, normalmente é um erro de digitação:

- não use `%` antes do namespace;
- mantenha o `:` entre namespace e id do item;
- exemplo correto: `/give @s digicomo:quadro_ideias 1`.

Comandos auxiliares do add-on (via chat, sem usar `/give`):

- `!quadro` → tenta entregar 1 item do Quadro de Ideias direto no inventário;
- `!quadrodiag` → roda diagnóstico e escreve logs detalhados no servidor.

Pontos frágeis conhecidos em produção:

- packs atualizados sem reiniciar/recarregar o mundo (ids podem não carregar);
- namespace/item digitado diferente do padrão (`digicomo:quadro_ideias`);
- jogador sem permissão de comando (mesmo com id correto no `/give`);
- inventário cheio ao entregar item via fluxo alternativo.

### Reinício/reload do serviço após publicação (opcional)

Em ambientes com deploy automatizado, pode ser necessário forçar reload do serviço após atualizar `packs/`:

```bash
systemctl restart bedrock.service
```

Você pode incluir essa etapa no workflow de publicação (ex.: GitHub Actions via SSH) quando o servidor não aplicar hot-reload de packs de forma confiável.

### Backup automático diário às 04:00

#### Backup do ambiente do repositório

Para salvar todo o ambiente do repositório em `.tar.gz`:

```bash
./tools/backup_environment.sh
```

Para agendar o backup diário às **04:00** no `crontab`:

```bash
./tools/backup_environment.sh --install-cron
```

Os arquivos serão salvos em `backups/` (padrão) e backups antigos serão removidos após 7 dias.

#### Backup dos dados do mundo (hora local do servidor)

Para gerar backup manual de um mundo específico:

```bash
./tools/backup_world_data.sh --world-dir /caminho/do/mundo
```

Para publicar o agendamento diário às **04:00** no `crontab` (hora local do servidor):

```bash
./tools/backup_world_data.sh --world-dir /caminho/do/mundo --install-cron
```

Exemplo realista para Bedrock:

```bash
./tools/backup_world_data.sh --world-dir /root/MinecraftServer/worlds/Bedrock level --install-cron
```

Backups são salvos por padrão em `backups/worlds/` e a retenção padrão é de 14 dias.

### Publicação automática no servidor (GitHub Actions)

Foi adicionado o workflow `.github/workflows/publish-server.yml` para publicar a pasta `packs/` no servidor.

Além dos packs, o workflow também publica e atualiza automaticamente o log viewer (`infra/log-viewer/server.py`) e sobe/reinicia o container `bedrock-log-viewer` via `docker compose`, deixando a URL `http://SEU_IP:8081` ativa sem setup manual no host.

- Host: `186.202.209.206`
- Usuário: `root`
- Senha: secret `VPS_SENHA`

Configuração recomendada no GitHub:

1. Criar o secret **`VPS_SENHA`** em *Settings > Secrets and variables > Actions*;
2. (Opcional) Criar a variável **`VPS_DESTINO`** com o diretório remoto desejado (padrão: `/root/MinecraftAddOn`);
3. Fazer push na branch `work` ou `main`, ou rodar manualmente via `workflow_dispatch`.

Também foi adicionado o workflow `.github/workflows/validate-world-bindings.yml` para
rodar a validação de vínculos diretamente no servidor via `workflow_dispatch`.

---

## 8) Próximos passos imediatos

- guia de publicação sem binários no repositório: `docs/publicacao_sem_binarios.md`.

- [ ] Criar pasta `packs/` com BP e RP base;
- [ ] Adicionar `manifest.json` para cada pack com UUIDs válidos;
- [ ] Definir namespace do projeto;
- [ ] Criar `docs/roadmap.md` com primeiras 3 features;
- [ ] Criar scripts de validação e deploy em `tools/`.

---

## 9) Definição inicial de escopo (MVP)

Para começar com risco baixo:
1. 1 item custom;
2. 1 bloco custom com textura;
3. 1 receita;
4. 1 regra simples de gameplay.

Quando isso estiver estável, evoluir para entidades, UI e mecânicas mais avançadas.

---

Se quiser, no próximo passo eu já posso gerar automaticamente a **estrutura de pastas + manifests base + scripts `validate/package/deploy`** neste repositório.

---

## 8) Publicar logs do Bedrock em URL externa (container web)

Para facilitar diagnóstico rápido de erros, este repositório inclui um **log viewer HTTP** em container, com:
- atualização manual (sem auto-refresh no navegador);
- destaque visual de linhas com `error/failed/exception` e `warning`;
- filtro por texto e quantidade de linhas.

### 8.1 Arquivos adicionados

- `infra/log-viewer/server.py` (servidor web de logs);
- `infra/log-viewer/Dockerfile`;
- `docker-compose.log-viewer.yml`;
- `tools/export_bedrock_journal.sh` (exporta `journalctl` para arquivo consumido pelo container).

### 8.2 Passo a passo no servidor

1. Exporte o journal do serviço Bedrock para um arquivo contínuo:

```bash
./tools/export_bedrock_journal.sh bedrock.service /root/MinecraftServer/logs/bedrock.log
```

> Dica: rode esse comando via `systemd`/`screen`/`tmux`, pois ele fica em modo contínuo (`-f`).

2. Suba o container do visualizador:

```bash
docker compose -f docker-compose.log-viewer.yml up -d --build
```

3. Acesse localmente:

```text
http://SEU_IP:8081
```

4. Para publicar em URL externa (recomendado), coloque atrás de um reverse proxy com TLS (Nginx, Traefik ou Caddy), por exemplo:

```text
https://logs.seu-dominio.com
```

### 8.3 Segurança recomendada

Como logs podem conter informações sensíveis, **não exponha a porta 8081 diretamente na internet** sem proteção. Recomenda-se:

- HTTPS obrigatório;
- autenticação básica/OAuth no proxy;
- allowlist de IP quando possível;
- rotação e retenção de logs.
