# Plano — Automação segura para escolher local e executar funções Bedrock pelo Linux/MCP

## Objetivo
Permitir que o operador peça uma construção, o agente escolha/valide um local candidato e execute a função Bedrock correspondente sem depender de digitação manual no chat do jogo.

## Pergunta de causa raiz
**Por que isso ainda não é possível de forma segura hoje?**

Porque os comandos `/function`, `/execute`, `/tp` e similares pertencem ao console do motor Bedrock, não ao shell Linux. No fluxo atual, o servidor pode ser reiniciado por workflow/MCP, mas não há uma ponte administrativa versionada que envie comandos ao stdin/console do `bedrock_server`. Além disso, o fallback do workflow inicia o processo com stdin fechado (`< /dev/null`), impedindo envio posterior de comandos pelo Linux nesse modo.

## Arquitetura proposta

```text
Pedido do operador
  -> agente consulta registros/logs/MCP
  -> seletor de local sugere coordenadas e risco
  -> precheck remoto registra evidências
  -> executor administrativo envia comando Bedrock permitido
  -> validação pós-execução consulta logs/blocos/captura do operador
```

Componentes:

1. **Console Bridge do Bedrock**
   - Rodar o `bedrock_server` com stdin controlado por um FIFO seguro, `screen/tmux`, ou wrapper systemd dedicado.
   - Exemplo conceitual: `/run/minecraft/bedrock-console.in` recebe comandos e encaminha para stdin do servidor.
   - O processo de restart precisa manter o bridge ativo após reinícios.

2. **Tool MCP administrativa com allowlist**
   - Nova tool, por exemplo `run_bedrock_command`, separada de `run_read_command`.
   - Aceitar somente comandos pré-aprovados, sem `/` inicial, como:
     - `function piramide_egito_gigante/montar_centro_historico`;
     - `execute positioned <x> <y> <z> run function piramide_egito_gigante/montar_completa`;
     - `function piramide_egito_gigante/diagnosticar_local` apenas quando houver executor/console compatível.
   - Bloquear comandos destrutivos genéricos (`fill`, `setblock`, `kill`, `op`, `deop`, `stop`) fora de funções versionadas.

3. **Seletor de local com evidências**
   - Reaproveitar `suggest_arena_location` para candidatos iniciais.
   - Complementar com leituras de blocos/LevelDB quando confiáveis.
   - Quando a leitura LevelDB retornar erros conhecidos, exigir validação visual ou diagnóstico in-game antes de executar megaconstruções.

4. **Registro obrigatório**
   - Toda execução deve registrar em `docs/registros1.md`:
     - timestamp;
     - comando enviado;
     - coordenada escolhida;
     - causa raiz/hipótese;
     - evidências de precheck;
     - resultado e próximos passos.

## Sprint 1 — Diagnóstico do modo real de execução do Bedrock

### Objetivo
Descobrir como o `bedrock_server` está sendo executado no host e qual mecanismo de stdin/console é viável.

### Tarefas
- Identificar se o servidor roda por `systemd`, Docker, `nohup`, `screen` ou `tmux`.
- Verificar se há stdin interativo preservado.
- Documentar limitações do modo atual.
- Definir o mecanismo alvo do bridge.

### Critérios de aceite
- Documento com o modo real de execução.
- Decisão registrada: FIFO, systemd wrapper, Docker exec/attach, `screen/tmux`, ou outro.
- Nenhum comando Bedrock destrutivo executado nessa sprint.

### Registro pós-conclusão
- O que foi feito: em 2026-07-19 15:27 UTC-3, foi executado diagnóstico readonly via MCP (`tools/list`, `run_read_command find/cat/tail`) e inspeção local do workflow de deploy. A investigação perguntou explicitamente: **por que isso aconteceu?** A causa raiz confirmada é arquitetural: o projeto reinicia o Bedrock por `systemd` quando disponível, por Docker quando algum container candidato existe, ou por fallback manual com `nohup ./bedrock_server ... < /dev/null &`; nenhum desses caminhos versionados mantém hoje uma ponte administrativa MCP para o stdin/console do `bedrock_server`. O MCP disponível também roda como serviço readonly em container (`/proc/1/cmdline = python /app/server.py`) e não expõe visão de processos do host suficiente para anexar no console Bedrock.
- Decisão registrada: mecanismo alvo recomendado para as próximas sprints é **systemd wrapper com FIFO seguro** para o `bedrock_server`, porque o workflow já prioriza `bedrock.service` no restart e o fallback atual com `nohup ... < /dev/null` deve ser substituído por um mecanismo persistente e auditável. `screen/tmux` fica apenas como alternativa manual de contingência; Docker attach não foi escolhido porque o Bedrock principal observado é tratado pelo workflow como processo/serviço do host, enquanto Docker é usado de forma clara para Log Viewer e MCP readonly.
- O que ficou faltando: confirmar no host, durante a Sprint 2, a existência/conteúdo real de `bedrock.service` fora do escopo readonly do MCP atual; criar o wrapper; ajustar o workflow para não cair mais no fallback com stdin fechado; e validar um comando inofensivo (`say`) somente depois de existir allowlist/bridge.
- Impedimentos/bloqueios: o MCP atual não permite `ps`, `systemctl`, `docker` nem leitura de `/etc/systemd`; a consulta `journalctl -u bedrock.service` falhou porque `journalctl` não está instalado dentro do container MCP. Portanto, a decisão usa evidências do workflow versionado, do log Bedrock ativo e da limitação observada do container MCP, sem executar comando Bedrock destrutivo.

## Sprint 2 — Wrapper seguro do console Bedrock

### Objetivo
Criar um wrapper versionado que mantenha um canal controlado para enviar comandos ao servidor.

### Tarefas
- Criar script de inicialização com FIFO ou mecanismo equivalente.
- Ajustar workflow/restart para usar o wrapper.
- Garantir logs do comando enviado e do resultado observável.
- Proteger permissões do canal de escrita.

### Critérios de aceite
- Servidor reinicia mantendo canal de comando operacional.
- Um comando inofensivo, como `say`, pode ser enviado e aparece no log/chat.
- Restart não deixa processos órfãos.

### Registro pós-conclusão
- O que foi feito: em 2026-07-19 15:33 UTC-3, foi criado um wrapper versionado para executar `bedrock_server` com stdin ligado ao FIFO seguro `/run/minecraft/bedrock-console.in`, registrar inicialização em `bedrock-console-commands.log` e preservar o descritor do FIFO vivo entre comandos. Também foi criado um instalador systemd (`bedrock.service`) e um emissor temporário restrito a `say <mensagem>` para validar o bridge sem liberar comandos destrutivos antes da Sprint 3.
- Causa raiz registrada: **por que isso aconteceu?** Porque o fallback anterior do workflow usava `nohup ./bedrock_server ... < /dev/null &`, fechando stdin e criando risco de processo órfão sem canal administrativo; a correção ataca a causa ao transformar o restart em um serviço systemd versionado, com FIFO persistente e sem fallback manual com stdin fechado e com limpeza pré-start de processos legados do Bedrock.
- O que ficou faltando: validar no próximo deploy remoto que `systemctl restart bedrock.service` sobe com o FIFO, que o comando inofensivo `say MinecraftAddOn bridge FIFO operacional` aparece no log/chat e que não sobram processos antigos. A allowlist administrativa completa ainda fica para a Sprint 3.
- Impedimentos/bloqueios: a execução local não possui `systemd` nem o binário Bedrock real em operação, então a validação completa depende do workflow/host. Nenhum comando Bedrock destrutivo foi adicionado ou executado; o emissor desta sprint aceita somente `say`.

## Sprint 3 — Tool MCP administrativa com allowlist

### Objetivo
Expor uma tool MCP controlada para enviar apenas comandos Bedrock permitidos.

### Tarefas
- Implementar `run_bedrock_command` ou nome equivalente.
- Validar comando contra allowlist rígida.
- Recusar comandos com `fill`/`setblock` diretos fora de funções versionadas.
- Registrar comando, executor lógico e timestamp.

### Critérios de aceite
- Comandos fora da allowlist são recusados.
- Comandos permitidos chegam ao console Bedrock.
- O MCP diferencia comandos readonly Linux de comandos administrativos Bedrock.

### Registro pós-conclusão
- O que foi feito: em 2026-07-19 15:45 UTC-3, foi implementada a tool MCP administrativa `run_bedrock_command`, separada de `run_read_command`, com allowlist rígida para comandos Bedrock versionados da Pirâmide e um `say` fixo de validação operacional. A tool normaliza comandos, recusa `/` inicial, caracteres de controle, comandos acima de 240 caracteres, comandos destrutivos diretos (`fill`, `setblock`, `kill`, `op`, `deop`, `stop`) e qualquer comando fora dos padrões permitidos.
- Causa raiz registrada: **por que isso aconteceu?** Porque, mesmo com o FIFO da Sprint 2, o MCP ainda não distinguia leitura Linux de ação administrativa Bedrock; sem uma tool dedicada, seria fácil tentar reaproveitar `run_read_command` ou escrever no FIFO sem auditoria/allowlist, contornando a causa de segurança em vez de resolvê-la.
- O que ficou faltando: validar no próximo deploy que o MCP `0.6.0` lista `run_bedrock_command`, que o container enxerga `/run/minecraft/bedrock-console.in`, que o `say MinecraftAddOn MCP run_bedrock_command operacional` chega ao console e que comandos recusados ficam auditados como `rejected`.
- Impedimentos/bloqueios: o MCP remoto consultado antes do deploy ainda lista apenas as ferramentas antigas, portanto a validação end-to-end depende da publicação da nova imagem. Localmente foram validados sintaxe Python, testes unitários da allowlist e escrita em FIFO temporário.

## Sprint 4 — Fluxo de escolha de local e precheck

### Objetivo
Permitir que o agente escolha um local candidato com evidências antes de executar a função.

### Tarefas
- Integrar `suggest_arena_location` como heurística inicial.
- Executar amostragens de blocos quando o parser LevelDB for confiável.
- Registrar riscos: água/lava, colisão, terreno inclinado, construções próximas e Y incorreto.
- Para a Pirâmide, gerar comando final `execute positioned <x> <y> <z> run function piramide_egito_gigante/montar_completa` somente após aprovação.

### Critérios de aceite
- Toda execução tem coordenada justificada.
- Se houver incerteza de terreno, o fluxo para e pede validação visual.
- Área afetada X/Y/Z é documentada antes da montagem.

### Registro pós-conclusão
- O que foi feito: em 2026-07-19 16:08 UTC-3, foi implementado o fluxo reutilizável `plan_build_location` no MCP para escolher local candidato antes da execução. A Pirâmide é o primeiro perfil (`piramide_egito_gigante`), mas a estrutura aceita `build_key`, `function_path`, dimensões, margem e Y preferido para reaproveitamento por outros Add-Ons.
- Causa raiz registrada: **por que isso aconteceu?** Porque o projeto já tinha heurística de arena e uma tool de comando, mas ainda faltava uma etapa intermediária que conectasse evidências de local, área afetada e precheck antes de gerar comando executável; sem essa etapa, a Pirâmide poderia funcionar como caso isolado e não como padrão seguro reutilizável.
- O que ficou faltando: validar no próximo deploy que o MCP `0.7.0` lista `plan_build_location`; executar o plano remoto para a Pirâmide; comparar as amostras LevelDB com validação visual do operador; e só gerar/enviar o comando final quando `approval_confirmed=true` e não houver incerteza de água/lava/colisão.
- Impedimentos/bloqueios: o MCP remoto atual ainda está na versão anterior e não lista `plan_build_location`; a amostragem é limitada a centro/cantos e Y de base/topo, não varredura completa. Por isso, se houver erro LevelDB ou bloco de risco, a montagem deve parar e exigir validação visual.

## Sprint 5 — Execução assistida da Pirâmide

### Objetivo
Permitir que o agente execute a montagem da Pirâmide em local escolhido/validado.

### Tarefas
- Criar allowlist específica para:
  - `function piramide_egito_gigante/montar_centro_historico`;
  - `execute positioned <x> <y> <z> run function piramide_egito_gigante/montar_completa`.
- Rodar precheck e montagem em etapas.
- Validar logs pós-execução.
- Orientar o operador a enviar captura se o log não registrar o resultado visual.

### Critérios de aceite
- O agente consegue disparar a montagem sem o operador digitar no jogo.
- Logs mostram comando enviado e evidência de carregamento/execução.
- Falhas são registradas com causa raiz provável e próximo passo.

### Registro pós-conclusão
- O que foi feito: em 2026-07-19 16:23 UTC-3, foi implementada a tool MCP `execute_planned_build`, que reaproveita `plan_build_location`, exige aprovação/precheck limpo para obter `command_after_approval` e só envia ao FIFO quando `execute=true`. O fluxo nasce com a Pirâmide como primeiro perfil, mas aceita parâmetros genéricos para outros Add-Ons.
- Causa raiz registrada: **por que isso aconteceu?** Porque a Sprint 4 conseguia planejar o local, mas ainda não havia um orquestrador único que encadeasse planejamento, aprovação, comando allowlisted, envio e coleta de evidências pós-execução; sem isso, a execução assistida poderia voltar a depender de passos manuais e específicos da Pirâmide.
- O que ficou faltando: após deploy do MCP `0.8.0`, executar primeiro em modo dry-run/blocked sem aprovação, depois planejar local real aprovado, e somente então chamar `execute_planned_build` com `execute=true` para a Pirâmide. A confirmação visual/captura do operador continua necessária se logs não provarem resultado visual.
- Impedimentos/bloqueios: o MCP remoto atual ainda não lista `run_bedrock_command`, `plan_build_location` nem `execute_planned_build`; portanto nenhuma montagem real foi disparada nesta sprint. A execução real deve aguardar deploy, precheck sem incerteza e aprovação explícita do local.

## Sprint 6 — Auditoria e segurança operacional

### Objetivo
Reduzir risco de comandos acidentais ou destrutivos em produção.

### Tarefas
- Adicionar confirmação explícita para megaconstruções.
- Registrar trilha de auditoria por comando.
- Criar testes unitários para allowlist.
- Criar runbook de reversão/backup antes de comandos grandes.

### Critérios de aceite
- Comandos perigosos não versionados são bloqueados.
- Toda execução gera registro rastreável.
- Há instrução de backup/reversão antes de megaconstruções.

### Registro pós-conclusão
- O que foi feito: em 2026-07-19 20:23 UTC-3, foi adicionada confirmação explícita por `confirmation_token` em `execute_planned_build`, auditoria de dry-run/rejeição por confirmação, testes unitários de segurança e o runbook `docs/runbook_backup_reversao_bedrock.md` para backup/reversão antes de megaconstruções.
- Causa raiz registrada: **por que isso aconteceu?** Porque o fluxo já conseguia planejar e executar, mas ainda dependia apenas de `approval_confirmed=true`; isso não reduz suficientemente o risco de clique/chamada acidental em produção, nem documenta backup/reversão antes de comandos grandes. O token derivado de `build_key` e coordenada força confirmação consciente do local aprovado.
- O que ficou faltando: após deploy do MCP `0.9.0`, validar o token em dry-run remoto, registrar backup real e executar apenas quando operador confirmar o token esperado. Para próximos Add-Ons, manter o padrão `planejar -> backup -> confirmar token -> executar -> validar logs/captura`.
- Impedimentos/bloqueios: o MCP remoto atual ainda não lista as tools novas, então não houve execução real. Reversão granular por região/chunk ainda não foi implementada; o runbook atual orienta backup/reversão do mundo inteiro.
