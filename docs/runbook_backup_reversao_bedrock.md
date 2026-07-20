# Runbook — Backup e reversão antes de megaconstruções Bedrock

## Objetivo
Criar um ponto de retorno antes de executar qualquer megaconstrução ou rotina que altere área ampla do mundo Bedrock.

## Quando usar
Antes de chamar `execute_planned_build` com `execute=true`, inclusive para a primeira montagem da `piramide_egito_gigante` e para futuros Add-Ons que reutilizem o mesmo fluxo.

## Checklist obrigatório
1. Confirmar que o MCP publicado lista `plan_build_location` e `execute_planned_build`.
2. Executar `plan_build_location` ou `execute_planned_build` em dry-run (`execute=false`).
3. Confirmar que `approval_required=false` no plano final ou resolver a validação visual pendente.
4. Registrar em `docs/registros1.md`:
   - coordenada central;
   - área afetada X/Y/Z;
   - resultado do precheck;
   - token de confirmação esperado;
   - operador/executor lógico.
5. Criar backup do mundo antes da execução.

## Comando recomendado de backup no host

```bash
cd /root/MinecraftAddOn
bash tools/backup_world_data.sh /root/MinecraftServer/worlds "pre-megaconstrucao-$(date +%Y%m%d-%H%M%S)"
```

Se o script acima não estiver disponível no host, criar um arquivo compactado do mundo ativo antes da execução:

```bash
tar -C /root/MinecraftServer/worlds -czf "/root/Uploads/Bedrock-level-pre-megaconstrucao-$(date +%Y%m%d-%H%M%S).tar.gz" "Bedrock level"
```

## Execução com confirmação explícita
A execução real deve usar o token retornado pelo dry-run:

```text
confirmation_token = EXECUTAR_<build_key>_<x>_<y>_<z>
```

Exemplo para a Pirâmide no centro histórico:

```text
EXECUTAR_piramide_egito_gigante_-194_69_111
```

## Reversão
1. Parar o `bedrock.service`.
2. Restaurar o diretório do mundo a partir do backup validado.
3. Reiniciar `bedrock.service`.
4. Consultar `bedrock.log` e validar visualmente no jogo.
5. Registrar causa raiz, evidências e resultado da reversão em `docs/registros1.md`.

## Limitação conhecida
Este runbook restaura o mundo inteiro, não apenas a área modificada pela megaconstrução. Para reversão granular futura, criar snapshots por região/chunk após a Sprint 6.
