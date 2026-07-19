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
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

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
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

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
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

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
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

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
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

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
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:
