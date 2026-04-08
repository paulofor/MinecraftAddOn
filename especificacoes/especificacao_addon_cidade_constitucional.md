# Especificação do Add-on — Cidade Constitucional

## 1. Resumo executivo

**Cidade Constitucional** é um add-on para **Minecraft Bedrock Dedicated Server** que transforma um mundo survival em uma experiência cooperativa de **governo local, orçamento, projetos, população e obras públicas**.

O add-on deve apoiar três jogadores gestores (papéis iniciais: **Construtor**, **Minerador** e **Fazendeiro**) na administração de uma cidade jogável. A proposta parte do documento-base do projeto, que já define como objetivos principais: instituições, regras, projetos, economia local, orçamento, votação, contratos simples, histórico de decisões e eventos semanais. Nesta nova versão, a **casa já existe** e fica **fora do escopo do add-on**; o foco passa a ser a **cidade**, sua **população** e a expansão para um **bairro novo planejado**.

O add-on deve ser **multiplayer-safe**, operar em **Bedrock Dedicated Server em Linux**, usar preferencialmente a **Script API estável** e funcionar sem depender de serviços externos.

---

## 2. Contexto do mundo

### 2.1 Situação atual

- A casa/base dos jogadores **já está construída**.
- O servidor roda em **Minecraft Bedrock Dedicated Server** em uma VPS Linux.
- O mundo deve evoluir de survival cooperativo para uma **cidade governável**.
- A ideia pedagógica original inclui **ciências sociais, direito, economia e gestão de projetos**.

### 2.2 Cenário de jogo desejado

O add-on deve suportar **dois cenários válidos**:

#### Cenário A — Vila existente + bairro novo (preferencial)

- Existe uma vila já formada no mundo.
- Essa vila passa a ser o **núcleo histórico** da cidade.
- Os jogadores constroem e administram um **bairro novo planejado**, conectado à vila por **obra pública de acesso** (ponte, cais, estrada ou outra rota).

#### Cenário B — Sem vila encontrada + fundação assistida

- Não foi encontrada uma vila funcional com população suficiente.
- O add-on deve permitir um fluxo de **fundação assistida** em modo admin, com criação controlada dos primeiros habitantes, para não travar o projeto.
- Esse fluxo deve ser **opcional** e separado do modo survival puro.

### 2.3 Regra de produto

O add-on **não deve reescrever a lógica vanilla de vilas**.

Ele deve:
- **apoiar** a cidade;
- **medir** estado, progresso e necessidades;
- **registrar** regras, propostas e histórico;
- **assistir** a gestão da população;
- oferecer **ferramentas administrativas opcionais** quando o cenário do mundo não estiver pronto.

---

## 3. Objetivos do add-on

## 3.1 Objetivos funcionais

O add-on deve permitir:

1. criar um ponto de entrada único para a cidade (`/cidade` ou interface equivalente);
2. registrar a cidade, seus distritos e seus marcos públicos;
3. acompanhar a população, incluindo citizens/villagers e os três jogadores;
4. registrar papéis oficiais dos jogadores;
5. manter backlog, projetos, obras públicas e critérios de pronto;
6. registrar constituição, leis curtas e decisões importantes;
7. controlar moeda simbólica, orçamento e tesouro comum;
8. permitir propostas, votação e aprovação de obras/regras;
9. registrar contribuições individuais e coletivas;
10. criar eventos semanais/crises/demandas sociais;
11. mostrar o estado atual da cidade em UI simples e rápida;
12. oferecer um modo admin opcional para fundação assistida, seed de população e correções de estado.

## 3.2 Objetivos pedagógicos apoiados pelo add-on

O add-on deve reforçar:

- cooperação;
- divisão de trabalho;
- bens públicos vs. bens privados;
- orçamento e trade-offs;
- legitimidade, maioria e consenso;
- priorização de necessidades da população;
- gestão de projeto com briefing, backlog, sprint e retrospectiva.

---

## 4. Escopo

## 4.1 Escopo do MVP

O MVP deve incluir:

- comando principal `/cidade`;
- menu principal da cidade por UI;
- cadastro dos três papéis iniciais;
- registro do tipo de cenário (A: vila existente / B: fundação assistida);
- registro de distritos;
- estado da cidade;
- backlog de obras;
- votação simples;
- orçamento básico;
- tesouro comum;
- constituição inicial;
- histórico de decisões;
- eventos simples;
- modo admin opcional para povoamento inicial.

## 4.2 Fora do escopo do MVP

Não é prioridade do MVP:

- interface gráfica customizada com resource pack;
- áudio, modelos ou texturas novas;
- economia complexa com inflação real, mercado automatizado ou IA;
- sincronização com site externo;
- banco de dados externo;
- substituição completa das mecânicas vanilla de villagers;
- pathfinding customizado;
- sistema judicial complexo com múltiplas fases processuais;
- mapas, scoreboard sidebar sempre visível ou HUD excessivo por padrão.

---

## 5. Premissas de design

1. **Stable-first**: usar APIs estáveis sempre que possível.
2. **Behavior Pack first**: o MVP deve funcionar apenas com Behavior Pack e script; Resource Pack é opcional para uma fase futura.
3. **Server authoritative**: o estado da cidade deve viver no mundo/servidor, não no cliente.
4. **Multiplayer-safe**: evitar dupla escrita, corrida de eventos e inconsistência entre jogadores.
5. **Low friction**: jogadores precisam conseguir usar as funções centrais sem ler documentação longa durante a sessão.
6. **Admin tools are optional**: funcionalidades de povoamento inicial e correção de estado devem existir, mas separadas do fluxo survival normal.
7. **Lore-friendly**: o add-on deve parecer uma “prefeitura” ou “governo local” do mundo, não um painel técnico desconectado da fantasia do jogo.

---

## 6. Plataforma alvo e base técnica

## 6.1 Plataforma alvo

- **Minecraft Bedrock Dedicated Server**
- servidor Linux
- multiplayer
- Script API estável

A documentação oficial confirma que o BDS suporta **JavaScript APIs** para experiências altamente customizadas em servidor dedicado.[1]

## 6.2 Formato do pack

Usar **Behavior Pack** com `manifest.json` em **format_version 2** no MVP.

Motivo:
- `format_version 2` continua sendo o formato estável padrão para Behavior Packs;
- `format_version 3` e custom pack settings aparecem como evolução mais nova, mas devem ficar como **opcional futuro**, não requisito do MVP.[2][3]

## 6.3 Dependências recomendadas

No `manifest.json`, usar no mínimo:

- `@minecraft/server` `2.6.0`
- `@minecraft/server-ui` `2.0.0`

Essas são as versões estáveis mais recentes mostradas na documentação atual consultada.[4][5]

## 6.4 Comandos customizados

O add-on deve usar **custom commands** para o comando `/cidade` e seus subcomandos, porque a documentação oficial diz que scripts podem implementar comandos próprios com toda a capacidade da Script API e lógica customizada.[6]

## 6.5 UI

A UI deve usar:

- `ActionFormData` para menus e navegação rápida;
- `MessageFormData` para confirmações;
- `ModalFormData` para formulários de criação/edição.

Esses tipos são explicitamente suportados em `@minecraft/server-ui`.[5]

## 6.6 Persistência

Persistir o estado da cidade com **dynamic properties no world scope**.

A API oficial fornece `world.getDynamicProperty`, `world.setDynamicProperty` e `world.setDynamicProperties` para guardar dados do mundo.[7]

## 6.7 Multiplayer

O add-on deve seguir um desenho **multiplayer-aware**: travas leves, validação de autor, anti-dupla submissão e consistência de estado entre jogadores, pois a documentação oficial destaca que multiplayer exige cuidado com gerenciamento de jogadores, eventos e consistência compartilhada.[8]

---

## 7. Conceito de produto

O add-on funciona como uma **Prefeitura da Cidade**.

Ele deve oferecer uma camada institucional sobre o mundo:

- cadastro da cidade;
- leitura do estado atual;
- backlog de obras;
- decisões coletivas;
- orçamento;
- papéis e responsabilidades;
- demandas da população;
- eventos e crises;
- histórico institucional.

Ele **não substitui** o jogo base. Ele organiza e dá visibilidade a decisões, prioridades, recursos e impactos sociais.

---

## 8. Perfis de usuário

## 8.1 Jogadores gestores

### Construtor

Responsável por:
- habitação;
- praças;
- caminhos;
- prédios públicos;
- estética e urbanismo.

### Minerador

Responsável por:
- materiais;
- iluminação;
- defesa;
- ferramentas;
- infraestrutura pesada.

### Fazendeiro

Responsável por:
- comida;
- abastecimento;
- produção recorrente;
- estabilidade do estoque.

## 8.2 Administrador do servidor

Responsável por:
- instalar o pack;
- ajustar permissões e modo admin;
- corrigir estado quando o mundo não oferecer população suficiente;
- usar ferramentas administrativas opcionais.

---

## 9. Fluxos principais

## 9.1 Fluxo 1 — Inicialização do sistema

Ao rodar o pack pela primeira vez:

1. o administrador executa `/cidade`;
2. o sistema detecta que a cidade ainda não foi inicializada;
3. abre um fluxo de setup;
4. o admin escolhe o cenário:
   - vila existente;
   - fundação assistida;
5. define nome da cidade;
6. define local do centro administrativo;
7. registra os três jogadores e seus papéis iniciais;
8. cria estrutura de dados inicial.

## 9.2 Fluxo 2 — Abrir menu principal

Com `/cidade`, o jogador autorizado vê:

- Estado da cidade
- Distritos
- População
- Obras e backlog
- Constituição e regras
- Tesouro e orçamento
- Votação
- Eventos
- Histórico
- Administração (somente admin)

## 9.3 Fluxo 3 — Registrar distrito

Permite criar distritos como:

- Núcleo Histórico
- Bairro Novo
- Zona Agrícola
- Praça Central
- Porto / Cais / Ponte
- Sala de Planejamento

Cada distrito deve ter:
- nome;
- tipo;
- coordenada central;
- raio/área lógica;
- descrição;
- status;
- responsável opcional.

## 9.4 Fluxo 4 — Criar obra pública

Permite abrir um projeto/obra com:
- nome;
- objetivo;
- distrito;
- necessidade que resolve;
- materiais previstos;
- responsável principal;
- critérios de pronto;
- prioridade;
- custo estimado;
- status.

Exemplo de primeiras obras:
- rota pública para a vila/ilha;
- ponte;
- cais;
- praça;
- mercado;
- iluminação do perímetro;
- armazém;
- núcleo dos habitantes.

## 9.5 Fluxo 5 — Votação

O sistema deve permitir:
- criar proposta;
- mostrar descrição resumida;
- abrir janela de voto;
- registrar voto por jogador;
- impedir voto duplicado;
- encerrar proposta;
- computar maioria simples;
- registrar resultado no histórico.

## 9.6 Fluxo 6 — Evento semanal

O sistema sorteia ou agenda uma demanda/evento e registra algo como:
- falta de comida;
- área escura perigosa;
- pedido por mercado;
- pedido por moradia;
- obra pública atrasada;
- caixa insuficiente;
- tensão por uso de recurso comum.

## 9.7 Fluxo 7 — Fundação assistida (admin)

Se o mundo não tiver vila funcional:

1. o admin entra em Administração;
2. escolhe “Fundação assistida”;
3. define o distrito-alvo;
4. o sistema oferece ações administrativas controladas, como:
   - registrar ponto cívico inicial;
   - marcar bairro como assentamento em formação;
   - criar dois cidadãos iniciais (configurável, opcional);
   - registrar modo “bootstrap”.

Importante: este fluxo deve ser **claramente rotulado como administrativo**.

---

## 10. Requisitos funcionais

## RF-01 — Comando principal

O add-on deve expor `/cidade` como entrada principal.

Subcomandos desejáveis:

- `/cidade`
- `/cidade status`
- `/cidade distrito`
- `/cidade obra`
- `/cidade voto`
- `/cidade tesouro`
- `/cidade evento`
- `/cidade admin`

## RF-02 — Sistema de papéis

O sistema deve registrar e consultar:
- construtor;
- minerador;
- fazendeiro;
- prefeito (cargo temporário);
- tesoureiro (cargo temporário);
- conselho/juiz (cargo temporário).

## RF-03 — Estado da cidade

O add-on deve calcular e exibir um resumo com:
- nome da cidade;
- cenário atual (vila existente / fundação assistida);
- número de distritos;
- população registrada;
- número de obras abertas;
- moeda atual/tesouro;
- evento ativo;
- nível geral de saúde da cidade.

## RF-04 — Distritos

O add-on deve permitir:
- criar distrito;
- listar distrito;
- editar distrito;
- arquivar distrito;
- ver resumo por distrito.

## RF-05 — População

O add-on deve permitir:
- registrar população alvo;
- ler contagem de habitantes relevantes da área, quando viável;
- armazenar status de moradores/cidadãos;
- diferenciar jogadores e habitantes da cidade.

### Observação

A implementação de leitura “automática” da população pode começar simples no MVP:
- primeiro com contagem registrada pelo sistema;
- depois evoluir para detecção por entidade/zona.

## RF-06 — Constituição

Deve existir uma área de regras com:
- constituição inicial;
- lista de leis/decisões;
- data de criação;
- autor/proponente;
- status (ativa, revogada, proposta).

## RF-07 — Obras e backlog

Deve existir uma estrutura de backlog/projetos com:
- prioridade;
- status (`backlog`, `aprovada`, `em_execucao`, `bloqueada`, `concluida`, `cancelada`);
- responsável;
- critério de pronto;
- registro de revisão.

## RF-08 — Tesouro e orçamento

Deve existir um tesouro comum com:
- moeda definida;
- saldo atual;
- receita;
- despesa;
- reserva;
- histórico de movimentação.

## RF-09 — Scoreboards

O sistema deve usar scoreboards para elementos numéricos simples e consultáveis, como:
- contribuição;
- reputação;
- orçamento;
- votos;
- dívida/crédito;
- prioridade.

A documentação oficial mostra que scoreboards armazenam e exibem informação do mundo e aceitam objetivos `dummy`, além de operações matemáticas úteis para lógica de saldo e agregação.[9]

## RF-10 — Votação

O sistema deve:
- criar proposta;
- registrar `sim`, `não`, `abstenção`;
- impedir voto repetido;
- definir prazo ou encerramento manual;
- salvar resultado no histórico.

## RF-11 — Eventos

O sistema deve permitir:
- sortear evento;
- registrar evento manualmente;
- marcar impacto esperado;
- marcar evento como resolvido.

## RF-12 — Histórico

Todo item importante deve ir para o histórico:
- criação da cidade;
- criação de distrito;
- mudança de cargo;
- proposta aberta;
- resultado de votação;
- início/fim de obra;
- ajuste de orçamento;
- evento semanal;
- ação admin.

## RF-13 — Administração

Somente admins devem ter acesso a:
- reset parcial da cidade;
- seed inicial de população;
- edição direta de saldo;
- correção de distrito;
- reindexação/reconstrução de dados;
- import/export lógico do estado.

---

## 11. Requisitos não funcionais

## RNF-01 — Persistência

Os dados devem sobreviver a reinício do servidor.

## RNF-02 — Segurança lógica

Jogadores comuns não devem acessar rotinas administrativas.

## RNF-03 — Robustez multiplayer

O sistema deve:
- evitar dupla submissão de voto;
- evitar que dois jogadores sobrescrevam a mesma proposta sem aviso;
- validar permissões no servidor;
- usar lock simples para telas de edição quando necessário.

## RNF-04 — Performance

- evitar scans pesados contínuos a cada tick;
- preferir atualização por evento e recalculo sob demanda;
- usar agendamentos leves para tarefas periódicas.

## RNF-05 — Legibilidade

O texto em UI deve ser curto, claro e em português.

## RNF-06 — Observabilidade

O add-on deve ter logs claros para Linux/content log, com prefixo único, por exemplo:
- `[CIDADE] init`
- `[CIDADE] vote_saved`
- `[CIDADE] budget_updated`
- `[CIDADE] admin_seed_population`

---

## 12. Modelo de dados proposto

## 12.1 Convenções

Usar namespace fixo, por exemplo:

- `cidade:*`

## 12.2 Dynamic properties do mundo

### `cidade:meta`

```json
{
  "initialized": true,
  "cityName": "Cidade Constitucional",
  "scenario": "existing_village" | "assisted_foundation",
  "version": 1,
  "createdAt": 0,
  "adminModeEnabled": true,
  "currency": "emerald"
}
```

### `cidade:players`

```json
{
  "playerId1": { "name": "Jogador A", "role": "construtor" },
  "playerId2": { "name": "Jogador B", "role": "minerador" },
  "playerId3": { "name": "Jogador C", "role": "fazendeiro" }
}
```

### `cidade:districts`

```json
[
  {
    "id": "distrito_001",
    "name": "Núcleo Histórico",
    "type": "historic_core",
    "dimension": "minecraft:overworld",
    "center": { "x": 0, "y": 64, "z": 0 },
    "radius": 32,
    "status": "active"
  }
]
```

### `cidade:projects`

```json
[
  {
    "id": "obra_001",
    "name": "Rota Pública para a Vila",
    "districtId": "distrito_002",
    "needType": "mobility",
    "priority": "alta",
    "status": "backlog",
    "ownerRole": "construtor",
    "acceptance": ["ligação concluída", "acesso seguro à noite"]
  }
]
```

### `cidade:laws`

```json
[
  {
    "id": "law_001",
    "title": "Toda obra pública precisa de maioria",
    "status": "active",
    "createdBy": "playerId1",
    "createdAt": 0
  }
]
```

### `cidade:votes`

```json
[
  {
    "id": "vote_001",
    "proposalType": "project",
    "proposalRef": "obra_001",
    "status": "open",
    "votes": {
      "playerId1": "yes",
      "playerId2": "no"
    }
  }
]
```

### `cidade:treasury`

```json
{
  "balance": 0,
  "reserve": 0,
  "lastUpdated": 0
}
```

### `cidade:ledger`

```json
[
  {
    "id": "txn_001",
    "type": "income",
    "amount": 10,
    "reason": "contribuição da sessão",
    "createdAt": 0
  }
]
```

### `cidade:events`

```json
[
  {
    "id": "evt_001",
    "kind": "food_shortage",
    "status": "active",
    "description": "Os habitantes reclamam da falta de alimento estável."
  }
]
```

### `cidade:history`

Lista append-only com eventos institucionais.

## 12.3 Scoreboards sugeridos

- `cidade.contribuicao`
- `cidade.reputacao`
- `cidade.orcamento`
- `cidade.voto`
- `cidade.prioridade`

---

## 13. Arquitetura lógica

## 13.1 Módulos sugeridos

### `bootstrap`

- carrega manifest/runtime;
- valida dados;
- migra schema;
- registra comandos;
- registra eventos.

### `permissions`

- define quem é admin;
- define quem pode propor, votar, editar ou administrar.

### `storage`

- wrapper para dynamic properties;
- serialização/deserialização;
- versionamento de schema;
- locks simples.

### `ui`

- menus;
- formulários;
- confirmações;
- mensagens rápidas.

### `city`

- metadados da cidade;
- status geral;
- diagnóstico.

### `districts`

- CRUD de distritos;
- classificação;
- leitura de estado.

### `population`

- estado da população;
- assistência para fundação;
- validação de habitantes.

### `projects`

- backlog;
- obra pública;
- critérios de pronto;
- progresso;
- revisão.

### `laws`

- constituição;
- leis;
- revogações;
- histórico.

### `treasury`

- caixa;
- movimentações;
- orçamento;
- contribuição.

### `voting`

- propostas;
- votos;
- apuração;
- resultado.

### `events`

- geração e resolução de eventos;
- catálogo de crises e demandas.

### `admin`

- seed de cidadãos;
- reparo de dados;
- reset parcial;
- ferramentas de diagnóstico.

### `logging`

- logs padronizados;
- níveis de severidade;
- rastreabilidade.

---

## 14. Interface do jogador

## 14.1 Menu principal `/cidade`

Opções do MVP:

1. Estado da Cidade
2. Distritos
3. Obras Públicas
4. Constituição e Regras
5. Tesouro e Orçamento
6. Votações
7. Eventos
8. Histórico
9. Administração

## 14.2 Estado da Cidade

Tela-resumo com:
- nome;
- cenário;
- papéis ativos;
- população registrada;
- tesouro;
- obra prioritária;
- evento ativo;
- alertas.

## 14.3 Distritos

- listar distritos;
- criar novo;
- ver detalhes;
- editar;
- arquivar.

## 14.4 Obras Públicas

- backlog;
- criar obra;
- aprovar por voto;
- iniciar;
- marcar concluída;
- registrar revisão.

## 14.5 Constituição e Regras

- ver constituição inicial;
- adicionar regra;
- propor revogação;
- consultar histórico.

## 14.6 Tesouro e Orçamento

- ver saldo;
- ver ledger;
- registrar contribuição;
- reservar verba;
- aprovar despesa.

## 14.7 Eventos

- ver evento ativo;
- sortear novo evento;
- encerrar evento;
- registrar impacto.

## 14.8 Administração

Apenas para admin:
- modo bootstrap;
- seed de população;
- ajuste de saldo;
- reset parcial;
- debug/diagnóstico.

---

## 15. Integrações in-world opcionais

Além do comando `/cidade`, o add-on pode expor interações físicas no mundo.

## 15.1 Lectern da prefeitura

Usar interação em bloco para abrir painel institucional a partir de um lectern específico.

A API `PlayerInteractWithBlockBeforeEvent` permite interceptar a interação com bloco antes da ação vanilla e até cancelar a interação quando necessário.[10]

## 15.2 Placas da cidade

Placas podem ser usadas como painéis rápidos, mas a implementação deve lembrar que o comportamento de leitura/escrita de signs via script é específico do `BlockSignComponent`, e a documentação distingue `getText`, `getRawText` e `setText`.[11]

## 15.3 Sala de Planejamento

No futuro, o add-on pode sincronizar:
- lectern;
- mural de backlog;
- registro da sessão;
- quadro de prioridade.

---

## 16. Regras de autorização

## 16.1 Perfis

### Jogador comum

Pode:
- consultar estado;
- votar;
- registrar contribuição;
- ver backlog;
- ver regras.

### Jogador gestor

Pode, além do comum:
- abrir propostas;
- criar obra;
- editar obra própria;
- registrar revisão.

### Admin

Pode tudo, incluindo:
- seed de população;
- ajuste de dados;
- reset;
- migração;
- debug.

## 16.2 Estratégia mínima de implementação

- whitelist por player id ou tag;
- fallback por op/admin do servidor;
- logs para toda ação administrativa.

---

## 17. Regras de consistência e concorrência

1. toda proposta tem `id` único;
2. todo voto é por `playerId`;
3. voto duplicado sobrescreve somente se explicitamente permitido;
4. formulários críticos devem revalidar estado ao salvar;
5. telas de edição devem validar se a proposta continua aberta;
6. escritas importantes devem registrar timestamp;
7. ações admin devem ser sempre auditadas no histórico.

---

## 18. Telemetria e logs

## 18.1 Prefixo

Usar prefixo único:

- `[CIDADE]`

## 18.2 Eventos mínimos de log

- script_loaded
- city_initialized
- district_created
- project_created
- vote_opened
- vote_saved
- vote_closed
- budget_updated
- event_spawned
- admin_seed_population
- admin_reset_partial
- storage_migration
- error

## 18.3 Política

- logs informativos curtos por padrão;
- logs detalhados apenas em debug;
- nunca vazar estado excessivo em chat do jogador.

---

## 19. Estrutura sugerida de arquivos

```text
behavior_packs/
  cidade_constitucional/
    manifest.json
    scripts/
      main.js
      bootstrap/
      commands/
      ui/
      storage/
      city/
      districts/
      population/
      projects/
      laws/
      treasury/
      voting/
      events/
      admin/
      util/
```

Se o time preferir TypeScript no fluxo de desenvolvimento, pode usar compilação para JavaScript antes da entrega ao servidor.

A documentação oficial recomenda ferramentas de desenvolvimento em VS Code, type definitions para os módulos Minecraft e o Bedrock Debugger para depuração.[12]

---

## 20. Manifesto recomendado (diretriz)

### MVP

- `format_version: 2`
- header com UUIDs próprios
- módulo `data`
- módulo `script`
- dependências estáveis

### Exemplo conceitual

```json
{
  "format_version": 2,
  "header": {
    "name": "Cidade Constitucional",
    "description": "Prefeitura, orçamento, votação e obras públicas para Bedrock",
    "uuid": "<uuid-header>",
    "version": [1, 0, 0],
    "min_engine_version": [1, 21, 130]
  },
  "modules": [
    {
      "type": "data",
      "uuid": "<uuid-data>",
      "version": [1, 0, 0]
    },
    {
      "type": "script",
      "language": "javascript",
      "uuid": "<uuid-script>",
      "version": [1, 0, 0],
      "entry": "scripts/main.js"
    }
  ],
  "dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "2.6.0"
    },
    {
      "module_name": "@minecraft/server-ui",
      "version": "2.0.0"
    }
  ]
}
```

### Observação

`manifest` v3 com **custom pack settings** pode ser avaliado depois para toggles como:
- admin mode;
- verbose logs;
- economia habilitada;
- eventos automáticos.

Mas isso deve ficar para fase posterior, porque o MVP precisa priorizar compatibilidade estável.[2][3]

---

## 21. Roadmap de implementação

## Fase 1 — Fundação institucional (MVP mínimo)

Entregar:
- `/cidade`;
- setup inicial;
- papéis;
- estado da cidade;
- storage base;
- histórico base;
- logs base.

## Fase 2 — Cidade jogável

Entregar:
- distritos;
- backlog e obras;
- constituição;
- votação;
- tesouro.

## Fase 3 — Cidade viva

Entregar:
- eventos;
- alertas;
- estado da população;
- modo bootstrap admin.

## Fase 4 — Polimento

Entregar:
- integração com lectern/pontos físicos;
- mensagens diegéticas;
- export lógico;
- scripts de manutenção;
- UX melhorada.

---

## 22. Critérios de aceite

## CA-01 — Setup

Dado um mundo sem inicialização,
quando um admin executa `/cidade`,
então o sistema abre setup e cria o estado inicial persistente.

## CA-02 — Papéis

Dado o setup concluído,
quando os três jogadores são registrados,
então o sistema salva papéis e os exibe no estado da cidade.

## CA-03 — Distrito

Dado o sistema ativo,
quando um gestor cria o distrito “Bairro Novo”,
então o distrito aparece na listagem e persiste após reinício do servidor.

## CA-04 — Obra pública

Dado um distrito ativo,
quando um gestor cria a obra “Rota Pública para a Vila”,
então a obra entra em backlog com prioridade e critérios de pronto.

## CA-05 — Votação

Dada uma proposta aberta,
quando cada jogador vota uma vez,
então o sistema impede duplicidade, apura o resultado e registra no histórico.

## CA-06 — Tesouro

Dado o tesouro ativo,
quando uma contribuição é registrada,
então saldo e ledger são atualizados de forma persistente.

## CA-07 — Evento

Dado o modo de eventos ativo,
quando um evento semanal é disparado,
então ele aparece em “Estado da Cidade” e no histórico.

## CA-08 — Administração

Dado o cenário sem vila funcional,
quando um admin usa “Fundação assistida”,
então o sistema registra esse modo e executa apenas ações administrativas autorizadas.

## CA-09 — Persistência

Dado qualquer estado da cidade,
quando o servidor reinicia,
então dados essenciais permanecem válidos.

## CA-10 — Logs

Dado qualquer ação importante,
quando ela ocorre,
então o servidor emite log com prefixo `[CIDADE]`.

---

## 23. Riscos e decisões abertas

## 23.1 Riscos

- contar população automaticamente pode exigir heurísticas por zona e entidade;
- excesso de scans pode pesar no servidor;
- UI excessiva pode atrapalhar o flow do survival;
- mistura de survival puro com admin tools precisa ser bem sinalizada.

## 23.2 Decisões abertas para o desenvolvedor

1. `/cidade` será somente custom command ou também item/bloco físico?
2. cargos temporários serão scoreboards, tags ou storage puro?
3. votos terão prazo por tempo real, por sessão ou encerramento manual?
4. eventos serão aleatórios, roteirizados ou mistos?
5. bootstrap de população usará apenas comandos administrativos ou também NPCs auxiliares?
6. haverá import/export do estado em JSON legível?

---

## 24. Recomendação explícita para o desenvolvedor

### Fazer primeiro

- storage confiável;
- `/cidade`;
- setup inicial;
- UI base;
- papéis;
- distritos;
- backlog/obras;
- votação simples;
- histórico.

### Deixar para depois

- automações complexas de população;
- integração física com muitos blocos;
- custom pack settings;
- resource pack;
- features cosméticas.

### Regra de ouro

O sucesso do add-on não é “automatizar tudo”, e sim **criar uma camada institucional leve, clara e divertida** sobre o survival, para que a cidade funcione como laboratório de regras, orçamento, população e obras públicas.

---

## 25. Relação com o documento-base do projeto

Esta especificação deriva do conceito já definido para a Cidade Constitucional, especialmente destes eixos:

- três jogadores gestores com papéis distintos;
- villagers/NPCs como população;
- projetos, backlog e critérios de pronto;
- constituição curta;
- economia local;
- governo e orçamento;
- eventos e demandas sociais;
- automação futura via menu `/cidade`, orçamento, votação, estado da vila, contratos, histórico e eventos.

Nesta versão, porém:

- a **casa inicial não faz mais parte do problema**;
- o add-on começa a partir de uma fase mais avançada do mundo;
- o cenário preferencial é **usar uma vila existente como núcleo histórico e construir um bairro novo planejado**;
- quando isso não for viável, o add-on deve suportar **fundação assistida** em modo admin.

---

## 26. Referências técnicas oficiais

1. Bedrock Dedicated Server Scripting — Microsoft Learn  
   https://learn.microsoft.com/en-us/minecraft/creator/documents/bedrockserver/scripting?view=minecraft-bedrock-stable

2. Add-Ons Reference: manifest.json — Microsoft Learn  
   https://learn.microsoft.com/en-us/minecraft/creator/reference/content/addonsreference/packmanifest?view=minecraft-bedrock-stable

3. Create a Pack With Custom Settings — Microsoft Learn  
   https://learn.microsoft.com/en-us/minecraft/creator/documents/addons/custompacksettings?view=minecraft-bedrock-stable

4. `@minecraft/server` Module — Microsoft Learn  
   https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/minecraft-server?view=minecraft-bedrock-stable

5. `@minecraft/server-ui` Module — Microsoft Learn  
   https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-ui/minecraft-server-ui?view=minecraft-bedrock-stable

6. Scripting Custom Commands — Microsoft Learn  
   https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/custom-commands?view=minecraft-bedrock-stable

7. `World` Class / Dynamic Properties — Microsoft Learn  
   https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/world?view=minecraft-bedrock-stable

8. Building Multiplayer-Aware Scripts — Microsoft Learn  
   https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/multiplayer-scripts?view=minecraft-bedrock-stable

9. Introduction to Scoreboards — Microsoft Learn  
   https://learn.microsoft.com/en-us/minecraft/creator/documents/scoreboardintroduction?view=minecraft-bedrock-stable

10. `PlayerInteractWithBlockBeforeEvent` — Microsoft Learn  
    https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playerinteractwithblockbeforeevent?view=minecraft-bedrock-stable

11. `BlockSignComponent` — Microsoft Learn  
    https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/blocksigncomponent?view=minecraft-bedrock-stable

12. Developer Tools for Minecraft — Microsoft Learn  
    https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/developer-tools?view=minecraft-bedrock-stable
