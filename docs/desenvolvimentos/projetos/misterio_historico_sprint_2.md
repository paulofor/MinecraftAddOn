# Mistério Histórico — Sprint 2

## Status
Sprint 2 implementada com um Behavior Pack mínimo e um Resource Pack pareado, sem scripts JavaScript e sem texturas PNG.

## Objetivo da Sprint 2
Transformar o protótipo vanilla da Sprint 1 em um Add-On mínimo capaz de registrar progresso de investigação, pistas encontradas, diagnóstico e conclusão argumentativa.

## Arquivos criados

### Behavior Pack
- `packs/BP_MisterioHistorico/manifest.json`
- `packs/BP_MisterioHistorico/functions/misterio_historico/init.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/reset.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/diagnostico.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/finalizar.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/pistas/p1_diario_moradora.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/pistas/p2_cisternas_secas.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/pistas/p3_assembleia.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/pistas/p4_ata_conselho.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/pistas/p5_chave_comporta.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/pistas/p6_canal_bloqueado.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/pistas/p7_registro_chuva.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/pistas/p8_rotas_migracao.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/pistas/p9_mural_sintese.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/conclusoes/hipotese_a.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/conclusoes/hipotese_b.mcfunction`
- `packs/BP_MisterioHistorico/functions/misterio_historico/conclusoes/hipotese_c.mcfunction`

### Resource Pack pareado
- `packs/RP_MisterioHistorico/manifest.json`
- `packs/RP_MisterioHistorico/texts/en_US.lang`

## Como testar no jogo

1. Ativar o BP `BP Misterio Historico` e o RP `RP Misterio Historico` no mundo de teste.
2. Executar `/function misterio_historico/init`.
3. Executar `/function misterio_historico/reset` para garantir estado limpo.
4. Ao posicionar cada pista no mundo, vincular a interação a uma função de pista, por exemplo:
   - `/function misterio_historico/pistas/p1_diario_moradora`
   - `/function misterio_historico/pistas/p2_cisternas_secas`
   - `/function misterio_historico/pistas/p3_assembleia`
5. Executar `/function misterio_historico/diagnostico` após algumas pistas para verificar progresso.
6. Com menos de 6 pistas, executar `/function misterio_historico/finalizar` e confirmar que o final fica bloqueado.
7. Registrar pelo menos 6 pistas.
8. Escolher uma hipótese:
   - `/function misterio_historico/conclusoes/hipotese_a`
   - `/function misterio_historico/conclusoes/hipotese_b`
   - `/function misterio_historico/conclusoes/hipotese_c`
9. Executar `/function misterio_historico/finalizar` e conduzir o debate final com 3 evidências.

## Registro pós-conclusão da Sprint 2
- O que foi feito: criado BP mínimo, RP pareado, manifests versionados em `0.1.0`, funções de inicialização, reset, diagnóstico, finalização, registro das 9 pistas e seleção de 3 hipóteses.
- O que ficou faltando: publicar no servidor Bedrock, conectar as funções aos pontos físicos do protótipo e validar o `bedrock.log` após ativação no mundo.
- Impedimentos/bloqueios: nenhum. Não houve criação ou alteração de arquivos PNG; portanto, não foi necessário upload via MCP.

## Ajuste de autonomia por jogador — versão 0.1.1
Após a primeira publicação, as funções foram ajustadas para evitar progresso compartilhado quando jogadores entram em horários diferentes.

### Mudança aplicada
- As funções de estado passaram a operar sobre `@s` em vez de `@a`.
- Com isso, pistas, conclusões, reset, diagnóstico e finalização afetam somente o jogador executor.
- Para command blocks no mundo, usar sempre o padrão `execute as @p[...] run function ...`, garantindo que `@s` seja o jogador mais próximo/interagente.

### Exemplo de command block por pista
```mcfunction
execute as @p[r=3] run function misterio_historico/pistas/p1_diario_moradora
```

### Exemplo de command block para diagnóstico
```mcfunction
execute as @p[r=3] run function misterio_historico/diagnostico
```

### Exemplo de uso direto no chat
Se o jogador executar diretamente no chat, também funciona de forma individual:

```mcfunction
/function misterio_historico/init
/function misterio_historico/pistas/p1_diario_moradora
/function misterio_historico/diagnostico
```
