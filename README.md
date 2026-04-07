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

### Validação dos vínculos do mundo (UUID + versão)

Para validar no servidor se os arquivos `world_behavior_packs.json` e
`world_resource_packs.json` estão apontando para os UUIDs corretos e a mesma versão
do `manifest.json` atual:

```bash
python3 tools/validate_world_bindings.py --world-dir "/opt/bedrock-server/worlds/Bedrock level"
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
  --world-dir "/opt/bedrock-server/worlds/Bedrock level"
```

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
./tools/backup_world_data.sh --world-dir /opt/bedrock-server/worlds/Bedrock level --install-cron
```

Backups são salvos por padrão em `backups/worlds/` e a retenção padrão é de 14 dias.

### Publicação automática no servidor (GitHub Actions)

Foi adicionado o workflow `.github/workflows/publish-server.yml` para publicar a pasta `packs/` no servidor:

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
