# Mistério Histórico — Sprint 5: checklist de regressão e manutenção

## Objetivo
Manter uma rotina repetível para publicar, diagnosticar e validar o Add-On **Mistério Histórico** no mundo ativo do servidor Bedrock.

## Escopo validado nesta Sprint 5
- Pack local preparado para publicação: `BP_MisterioHistorico` e `RP_MisterioHistorico` em versão `0.1.2`.
- Mundo ativo esperado no host: `/root/MinecraftServer/worlds/Bedrock level`.
- Diretório remoto de logs: `/root/MinecraftServer/logging/bedrock.log`.
- Endpoint MCP readonly usado para diagnóstico: `http://186.202.209.206/mcp`.

## Checklist de publicação
1. Confirmar que os manifests locais estão válidos:
   - `python3 -m json.tool packs/BP_MisterioHistorico/manifest.json`
   - `python3 -m json.tool packs/RP_MisterioHistorico/manifest.json`
2. Publicar os packs de texto pelo fluxo oficial de deploy do repositório.
3. Confirmar que o mundo ativo recebeu os manifests `0.1.2`:
   - `/root/MinecraftServer/worlds/Bedrock level/behavior_packs/BP_MisterioHistorico/manifest.json`
   - `/root/MinecraftServer/worlds/Bedrock level/resource_packs/RP_MisterioHistorico/manifest.json`
4. Reiniciar/recarregar o servidor Bedrock somente depois de confirmar que o conteúdo publicado está no mundo ativo.
5. Validar `bedrock.log` após restart procurando erros críticos de pack, JSON, função ou dependência.

## Checklist funcional no mundo
1. Executar `/function misterio_historico/init`.
2. Executar `/function misterio_historico/reset` e confirmar que pistas, conclusões e `mh_finalizado` foram limpos.
3. Coletar pelo menos 6 pistas usando as funções `misterio_historico/pistas/p1_*` até `p9_*`.
4. Executar `/function misterio_historico/diagnostico` e confirmar o contador de pistas.
5. Tentar `/function misterio_historico/finalizar` sem hipótese e confirmar orientação para escolher A, B ou C.
6. Escolher uma hipótese em `misterio_historico/conclusoes/hipotese_a`, `hipotese_b` ou `hipotese_c`.
7. Executar `/function misterio_historico/finalizar` e confirmar que a função `misterio_historico/reflexao_final` pergunta qual evidência mais mudou a opinião e solicita 3 evidências.
8. Executar novo `/function misterio_historico/reset` e confirmar que a missão pode ser jogada novamente.

## Diagnóstico MCP obrigatório
Use o MCP readonly para registrar evidências antes e depois da publicação:

```bash
curl -sS -X POST 'http://186.202.209.206/mcp' \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

```bash
curl -sS -X POST 'http://186.202.209.206/mcp' \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"read_file","arguments":{"path":"/root/MinecraftServer/worlds/Bedrock level/behavior_packs/BP_MisterioHistorico/manifest.json","max_bytes":4000}}}'
```

```bash
curl -sS -X POST 'http://186.202.209.206/mcp' \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"run_read_command","arguments":{"command":"tail","args":["-n","220","/root/MinecraftServer/logging/bedrock.log"],"timeout_seconds":10}}}'
```

## Evidência coletada nesta execução
- MCP readonly disponível e expondo `list_directory`, `read_file`, `write_png_base64`, `restart_bedrock` e `run_read_command`.
- Manifests no mundo ativo ainda estão em `0.1.1`, enquanto a versão local preparada está em `0.1.2`.
- `bedrock.log` confirmou carregamento do `BP Misterio Historico` versão `0.1.1` no mundo ativo, sem evidência de carregamento da versão `0.1.2`.
- Publicação efetiva dos arquivos de texto não foi concluída por este ambiente porque o MCP disponível é readonly para arquivos texto e não há remote Git/SSH configurado neste checkout local.

## Próximo passo operacional
Executar o deploy oficial que sincroniza `packs/**` para o host e promove `BP_MisterioHistorico`/`RP_MisterioHistorico` para o mundo ativo. Depois disso, repetir esta checklist e reiniciar o Bedrock para confirmar a versão `0.1.2` no `bedrock.log`.
