# Plano Canônico — Ilha de Lógica e Computação (Pós-Sprint)

## 1) Objetivo canônico
Construir e evoluir, em ciclos curtos, uma **ilha educativa de Lógica e Computação** no Minecraft Bedrock com foco em jovens de 16 a 20 anos, iniciando por **Teoria de Conjuntos** e avançando para Lógica Proposicional e fundamentos de Computação.

Este documento é a referência oficial para:
- planejamento pós-sprint;
- critérios de pronto;
- execução incremental;
- atualização contínua de status.

> [!IMPORTANT]
> **Diretório/arquivo canônico de log do Bedrock (único padrão):**
> `/root/MinecraftServer/logging/bedrock.log`
>
> Toda automação, validação, diagnóstico e observabilidade deste projeto deve usar exclusivamente esse caminho.

---

## 2) Escopo da versão inicial (MVP)

### Incluído no MVP
- Hub inicial da ilha com trilha guiada;
- 4 módulos jogáveis de Teoria de Conjuntos:
  1. pertinência (∈ / ∉);
  2. subconjuntos (⊆);
  3. operações (∪, ∩, \\);
  4. produto cartesiano (A×B);
- sistema básico de progresso (scoreboard/tags);
- validação mínima por fase (acerto/erro);
- documentação operacional de teste em jogo.

### Fora do MVP (backlog)
- interface avançada de UI;
- persistência sofisticada de dados;
- múltiplos perfis por jogador;
- analytics detalhado de aprendizagem;
- integração externa com dashboards.

---

## 3) Princípios de execução
1. **Aprendizado antes de complexidade técnica**: cada fase deve ensinar um conceito mensurável.
2. **Nada concluído sem teste no jogo**.
3. **Entregas pequenas e frequentes**: no máximo 1 a 2 objetivos técnicos por ciclo.
4. **Logs e evidências**: toda validação deve citar comando, resultado e data.
5. **Documentação viva**: este plano deve ser atualizado conforme execução real.

---

## 4) Roadmap pós-sprint (macro)

## Sprint 0 — Preparação e baseline (curta)
**Objetivo:** garantir base técnica e pedagógica para implementação.

**Entregas esperadas:**
- estrutura de pastas definida para BP/RP da ilha;
- definição formal das fases do MVP;
- checklist de comandos de validação;
- critérios de aceite por fase.

**Status atual:** concluido (2026-04-23 UTC).

**Evidências da Sprint 0:**
- `docs/desenvolvimentos/projetos/sprint_0/execucao_sprint_0_ilha_logica.md`;
- `packs/BP_IlhaLogicaComputacao/manifest.json`;
- `packs/RP_IlhaLogicaComputacao/manifest.json`.

---

## Sprint 1 — Núcleo de Teoria de Conjuntos (MVP funcional)
**Objetivo:** disponibilizar a primeira experiência completa da trilha.

**Entregas esperadas:**
- Hub + Fase A + Fase B + Fase C + Fase D;
- desbloqueio final por progresso;
- mensagens educativas curtas por módulo.

**Critério de aceite:**
- jogador completa as 4 fases sem intervenção manual do operador;
- progresso é registrado corretamente;
- sem erro crítico nos logs do servidor.

**Status atual:** concluido (2026-04-23 UTC).

**Evidências da Sprint 1:**
- `docs/desenvolvimentos/projetos/sprint_1/execucao_sprint_1_ilha_logica.md`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/hub.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_a_correta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_b_correta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_c_correta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_d_correta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/finalizar.mcfunction`.

---

## Sprint 2 — Refino pedagógico e usabilidade
**Objetivo:** melhorar clareza didática e experiência de jogo.

**Entregas esperadas:**
- feedback de erro mais explicativo;
- balanceamento de dificuldade;
- melhorias visuais da ilha;
- revisão de textos didáticos.

**Critério de aceite:**
- pelo menos 1 sessão de teste com usuário-alvo (16–20 anos);
- taxa de conclusão do percurso inicial >= 80%.

**Status atual:** em_andamento (2026-04-23 UTC).

**Evidências parciais da Sprint 2:**
- `docs/desenvolvimentos/projetos/sprint_2/execucao_sprint_2_ilha_logica.md`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/hub.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_a_incorreta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_b_incorreta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_c_incorreta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_d_incorreta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/finalizar.mcfunction`.

---

## Sprint 3 — Ponte para Lógica Proposicional
**Objetivo:** iniciar segundo bloco de conteúdo.

**Entregas esperadas:**
- módulo introdutório de proposições e conectivos;
- puzzle simples de tabela-verdade;
- integração de progresso com trilha anterior.

**Status atual:** concluido (2026-04-23 UTC).

**Evidencias da Sprint 3:**
- `docs/desenvolvimentos/projetos/sprint_3/execucao_sprint_3_ilha_logica.md`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/lp_intro_correta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/lp_intro_incorreta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/lp_tabela_correta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/lp_tabela_incorreta.mcfunction`;
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/{init,reset,hub,finalizar}.mcfunction`.

---

## 5) Plano de implementação detalhado (pós-sprint)

## Fase P1 — Arquitetura técnica da ilha
**Tarefas:**
- definir namespace e nomes canônicos de entidades/blocos/funções;
- criar pacote base do projeto da ilha;
- configurar funções de inicialização (`init`, reset e diagnóstico).

**Saída obrigatória:**
- estrutura de arquivos pronta para evolução incremental.

**Status:** concluido (2026-04-23 UTC).

---

## Fase P2 — Implementação dos módulos de conjuntos
**Tarefas:**
- implementar lógica de validação de cada módulo A–D;
- criar fluxo de desbloqueio por chaves/progresso;
- inserir texto pedagógico por NPC/placas/ação equivalente.

**Saída obrigatória:**
- jornada de ponta a ponta jogável.

**Status:** concluido (2026-04-23 UTC).

---

## Fase P3 — Observabilidade e operação
**Tarefas:**
- padronizar comandos de teste;
- registrar resultados dos testes com data;
- consolidar critérios de falha e rollback.

**Saída obrigatória:**
- rotina reprodutível de validação no servidor.

**Status:** em_andamento (2026-04-23 UTC).

---

## 6) Governança de atualização contínua

## Regra obrigatória de atualização
Sempre que uma tarefa avançar (início, bloqueio, conclusão), atualizar **neste documento**:
1. data (UTC);
2. responsável;
3. item alterado;
4. status;
5. evidência (comando/log/arquivo).

## Status válidos
- `planejado`
- `em_andamento`
- `bloqueado`
- `concluido`
- `cancelado`

## Frequência mínima
- atualização ao final de cada sessão de trabalho;
- atualização imediata em caso de bloqueio.

---

## 7) Quadro canônico de execução (atualizável)

| ID | Item | Responsável | Início (UTC) | Fim (UTC) | Status | Evidência |
|---|---|---|---|---|---|---|
| P1.1 | Estrutura base BP/RP da ilha | Codex | 2026-04-23 18:48 | 2026-04-23 18:48 | concluido | packs/BP_IlhaLogicaComputacao + packs/RP_IlhaLogicaComputacao |
| P1.2 | Funções de init/reset | Codex | 2026-04-23 18:48 | 2026-04-23 18:48 | concluido | functions/ilha_logica/{init,reset,diagnostico}.mcfunction |
| P2.1 | Módulo A (Pertinência) | Codex | 2026-04-23 18:54 | 2026-04-23 18:54 | concluido | functions/ilha_logica/modulos/fase_a_{correta,incorreta}.mcfunction |
| P2.2 | Módulo B (Subconjuntos) | Codex | 2026-04-23 18:54 | 2026-04-23 18:54 | concluido | functions/ilha_logica/modulos/fase_b_{correta,incorreta}.mcfunction |
| P2.3 | Módulo C (Operações) | Codex | 2026-04-23 18:54 | 2026-04-23 18:54 | concluido | functions/ilha_logica/modulos/fase_c_{correta,incorreta}.mcfunction |
| P2.4 | Módulo D (Produto cartesiano) | Codex | 2026-04-23 18:54 | 2026-04-23 18:54 | concluido | functions/ilha_logica/modulos/fase_d_{correta,incorreta}.mcfunction |
| P2.5 | Unlock final + avaliação | Codex | 2026-04-23 18:54 | 2026-04-23 18:54 | concluido | functions/ilha_logica/{hub,finalizar}.mcfunction |
| P3.1 | Suite de testes in-game | Codex | 2026-04-23 18:54 | 2026-04-23 18:55 | concluido | docs/desenvolvimentos/projetos/sprint_1/execucao_sprint_1_ilha_logica.md |
| P3.2 | Validação em servidor e logs | Codex | 2026-04-23 18:55 | - | em_andamento | aguardando execução no host Bedrock (186.202.209.206) |
| S2.1 | Feedback explicativo nas respostas incorretas | Codex | 2026-04-23 19:05 | 2026-04-23 19:10 | concluido | modulos/fase_{a,b,c,d}_incorreta.mcfunction (refino didático) |
| S2.2 | Balanceamento por meta de >= 80% | Codex | 2026-04-23 19:10 | 2026-04-23 19:12 | concluido | hub.mcfunction + finalizar.mcfunction (mensagem por desempenho) |
| S2.3 | Sessão piloto com usuário-alvo (16–20) | Codex | 2026-04-23 19:12 | - | em_andamento | pendente execução em ambiente de jogo com evidência operacional |
| S2.4 | Protocolo da sessão piloto + formulário de observação | Codex | 2026-04-23 19:20 | 2026-04-23 19:24 | concluido | docs/desenvolvimentos/projetos/sprint_2/execucao_sprint_2_ilha_logica.md (suite + critérios) |
| S2.5 | Execução da sessão piloto em servidor Bedrock | Codex | 2026-04-23 19:24 | - | em_andamento | dependente de janela com usuário-alvo no host 186.202.209.206 |
| S2.6 | Consolidação da taxa de conclusão (>= 80%) | Codex | 2026-04-23 19:24 | - | em_andamento | pendente evidência quantitativa da sessão piloto |
| S2.7 | Encerramento formal da Sprint 2 | Codex | - | - | planejado | atualizar status macro da Sprint 2 para concluido após S2.5/S2.6 |
| S3.1 | Modulo introdutorio de proposicoes e conectivos | Codex | 2026-04-23 19:30 | 2026-04-23 19:36 | concluido | modulos/lp_intro_{correta,incorreta}.mcfunction |
| S3.2 | Puzzle de tabela-verdade (basico) | Codex | 2026-04-23 19:36 | 2026-04-23 19:40 | concluido | modulos/lp_tabela_{correta,incorreta}.mcfunction |
| S3.3 | Integracao de progresso com trilha anterior | Codex | 2026-04-23 19:40 | 2026-04-23 19:44 | concluido | functions/ilha_logica/{init,reset,hub,finalizar}.mcfunction |
| S3.4 | Documentacao operacional da Sprint 3 | Codex | 2026-04-23 19:44 | 2026-04-23 19:47 | concluido | docs/desenvolvimentos/projetos/sprint_3/execucao_sprint_3_ilha_logica.md |

---

## 8) Continuação operacional da Sprint 2 (próxima sessão)

### Objetivo da continuação
Fechar os itens pendentes de validação com usuário real e transformar os resultados em decisão objetiva de conclusão da sprint.

### Plano de execução (checklist)
1. **Preparação de ambiente (10 min):**
   - resetar trilha e validar placar inicial (`ilhlog_progresso`, `ilhlog_erros`);
   - confirmar disponibilidade de logs em `/root/MinecraftServer/logging/bedrock.log`.
2. **Sessão piloto monitorada (20–30 min):**
   - 1 participante de 16–20 anos percorre a trilha sem intervenção técnica direta;
   - operador só registra dúvidas, erros recorrentes e tempo de conclusão.
3. **Fechamento quantitativo (10 min):**
   - contabilizar conclusão total, erros por fase e taxa de conclusão da rota principal;
   - classificar resultado como `aprovado` (>=80%) ou `ajuste_necessario` (<80%).
4. **Atualização documental (10 min):**
   - atualizar quadro canônico (Seção 7) para S2.5/S2.6/S2.7;
   - registrar evidências (comandos + trechos de log + data UTC).

### Evidências mínimas obrigatórias para fechar Sprint 2
- comando de preparação executado (`/function ilha_logica/reset` + `/function ilha_logica/init`);
- comando de encerramento executado (`/function ilha_logica/finalizar`);
- verificação de placar (`/scoreboard players list @s`) com estado final do participante;
- referência ao arquivo de log do servidor (`/root/MinecraftServer/logging/bedrock.log`) com timestamp da sessão.

### Condição de encerramento da Sprint 2
A Sprint 2 muda de `em_andamento` para `concluido` quando **todos** os itens abaixo forem verdadeiros:
- S2.5 concluído com sessão piloto registrada;
- S2.6 concluído com taxa de conclusão >= 80%;
- nenhum erro crítico novo em log durante a sessão;
- histórico de revisões atualizado com data UTC da conclusão.

---

## 9) Template de atualização (copiar e preencher)

```text
### Atualização de execução
- Data (UTC): YYYY-MM-DD HH:MM
- Responsável: <nome>
- Item: <ID + descrição>
- Status anterior: <status>
- Novo status: <status>
- Mudanças realizadas:
  - ...
- Evidências:
  - Comando(s): ...
  - Arquivo(s): ...
  - Log(s): ...
- Próximo passo:
  - ...
- Bloqueios (se houver):
  - ...
```

---

## 10) Critérios de pronto (Definition of Done)
Um item só pode ser marcado como `concluido` quando houver:
1. implementação registrada no repositório;
2. teste executado com comando explícito;
3. resultado esperado observado no jogo;
4. ausência de erro crítico em log relevante;
5. atualização do quadro canônico (seção 7).

---

## 11) Riscos e mitigação
- **Risco:** escopo crescer cedo demais.
  - **Mitigação:** manter foco no MVP de conjuntos até fechamento da Sprint 1.
- **Risco:** validações manuais inconsistentes.
  - **Mitigação:** checklist fixo de testes e evidências.
- **Risco:** dificuldade pedagógica acima do público.
  - **Mitigação:** ajustar linguagem e puzzles com sessão piloto.

---

## 12) Próximos passos imediatos
1. agendar e executar S2.5 no host Bedrock `186.202.209.206` com roteiro da seção 8;
2. consolidar S2.6 com taxa de conclusão observada e classificação (`aprovado`/`ajuste_necessario`);
3. concluir P3.2 com inspeção de `/root/MinecraftServer/logging/bedrock.log`;
4. fechar S2.7 e atualizar status macro da Sprint 2 para `concluido` quando critérios forem atendidos;
5. iniciar Sprint 3 (módulo introdutório de Lógica Proposicional) após encerramento formal da Sprint 2.

---

## 13) Histórico de revisões
- **2026-04-23 (UTC)** — criação da versão inicial canônica deste plano pós-sprint.
- **2026-04-23 (UTC)** — Sprint 0 executada e concluída com baseline BP/RP, funções operacionais e checklist formal de validação.
- **2026-04-23 (UTC)** — Sprint 2 iniciada com refino pedagógico, feedback explicativo, ajuste de usabilidade e critérios de desempenho (>= 80%).
- **2026-04-23 (UTC)** — continuação da Sprint 2 formalizada com plano operacional (seção 8), novos itens S2.4–S2.7 e critérios de encerramento.
