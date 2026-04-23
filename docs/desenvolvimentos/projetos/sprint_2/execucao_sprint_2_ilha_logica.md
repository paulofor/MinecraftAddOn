# Execução da Sprint 2 — Ilha de Lógica e Computação

## Status
- Status geral: `em_andamento`
- Data de atualização (UTC): 2026-04-23
- Responsável: Codex (GPT-5.3-Codex)

## Entrega 1 — Feedback de erro mais explicativo

Foram revisados os fluxos de resposta incorreta das fases A–D para incluir:
- explicação objetiva do conceito;
- exemplos rápidos em linguagem direta;
- orientação de próxima tentativa.

Também foi ajustado o público-alvo do incremento de erros para evitar penalizar jogadores fora da fase correspondente.

**Arquivos:**
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_a_incorreta.mcfunction`
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_b_incorreta.mcfunction`
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_c_incorreta.mcfunction`
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/modulos/fase_d_incorreta.mcfunction`

## Entrega 2 — Balanceamento de dificuldade

Foi incluída sinalização explícita de desempenho esperado no hub e no encerramento da trilha:
- meta pedagógica de >= 80% de acertos (até 1 erro em 4 fases);
- feedback final diferenciado para desempenho recomendado e para necessidade de revisão.

**Arquivos:**
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/hub.mcfunction`
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/finalizar.mcfunction`

## Entrega 3 — Melhoria visual e clareza de navegação

Foram adicionadas mensagens em `title/subtitle/actionbar` para reforçar:
- início da trilha;
- foco didático por fase;
- status de conclusão com orientação de continuidade.

Também foi adicionada a função `visual_hub` para criar uma ilha-hub visível ao redor do jogador ativo (base, praça central, iluminação e pontos de interesse didático), executada automaticamente no `init` e disponível para reconstrução manual.

**Arquivos:**
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/visual_hub.mcfunction`
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/init.mcfunction`
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/hub.mcfunction`

## Entrega 4 — Revisão de textos didáticos

Mensagens revisadas para uma linguagem mais direta, com microexemplos alinhados ao público de 16–20 anos.

## Critério de aceite da Sprint 2

### Parcialmente atendido
- [ ] sessão com usuário-alvo (16–20 anos) executada e registrada.
- [x] mecanismo de avaliação de taxa de conclusão (meta >= 80%) incorporado ao fluxo final.

## Suite de testes in-game (operador)

1. `/function ilha_logica/reset`
2. `/function ilha_logica/init`
3. `/function ilha_logica/hub`
4. Confirmar presença do hub visual ao redor do jogador.
5. Simular trajetória com 0 ou 1 erro total:
   - executar uma função `*_incorreta` opcional;
   - concluir fases com `fase_a_correta` → `fase_d_correta`.
6. `/function ilha_logica/finalizar`
7. Validar:
   - `/scoreboard players list @s`
   - `/tag @s list`

### Resultado esperado
- Com `ilhlog_erros <= 1`: mensagem de desempenho recomendado (>=80%).
- Com `ilhlog_erros >= 2`: mensagem de revisão antes do próximo bloco.

## Próximo passo

Executar a sessão piloto com pelo menos 1 usuário do público-alvo e atualizar o status da Sprint 2 para `concluido` após evidência de taxa de conclusão >= 80%.
