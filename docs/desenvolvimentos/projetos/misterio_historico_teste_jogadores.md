# Mistério Histórico — Sprint 4: roteiro de teste com jogadores

## Objetivo do teste
Validar se a missão gera investigação colaborativa, comparação de fontes e defesa de hipótese com evidências, sem depender de revelar a solução ao grupo.

## Preparação antes da sessão
1. Iniciar a missão com `/function misterio_historico/init`.
2. Reiniciar progresso individual com `/function misterio_historico/reset` para cada jogador participante.
3. Não explicar qual hipótese é esperada; apenas apresentar a pergunta central: **por que Arandu foi abandonada?**
4. Definir uma pessoa observadora para anotar dúvidas, hipóteses e tentativas de burlar a missão.

## Métricas obrigatórias
- Tempo total da missão, do início até a defesa final.
- Quantidade de pistas encontradas por jogador ou grupo.
- Hipóteses consideradas antes da conclusão final.
- Evidências citadas durante a defesa.
- Pontos de confusão, empolgação ou tentativa de atalho.

## Rubrica de observação pedagógica
| Critério | Evidência desejada | Sinal de ajuste necessário |
| --- | --- | --- |
| Leitura crítica | Jogadores comparam pistas contraditórias. | Jogadores escolhem hipótese sem citar fonte. |
| Pensamento histórico | Jogadores diferenciam causa única e múltiplas causas. | Jogadores procuram apenas uma resposta binária. |
| Argumentação | Defesa final cita ao menos 3 evidências. | Defesa final vira apenas clique ou chute. |
| Colaboração | Jogadores dividem pistas e negociam conclusão. | Um jogador resolve tudo sozinho sem debate. |
| Ética da interpretação | Jogadores reconhecem incertezas e limites das fontes. | Jogadores tratam qualquer pista isolada como prova absoluta. |

## Perguntas para entrevista rápida pós-teste
1. Qual evidência mais mudou sua opinião? Por quê?
2. Qual pista ficou mais confusa ou ambígua?
3. Em que momento sua hipótese mudou?
4. Quais 3 evidências você usaria para defender sua conclusão?
5. Que informação adicional você gostaria de encontrar nas ruínas?

## Ajustes recomendados após a observação
- Se o grupo concluir em menos de 15 minutos, aumentar a distância entre pistas ou exigir mais comparação na sala final.
- Se o grupo passar de 40 minutos, reduzir texto, melhorar sinalização ou diminuir o número mínimo de pistas.
- Se todos escolherem a mesma hipótese cedo demais, reforçar pistas que sustentam hipóteses concorrentes.
- Se a defesa final não citar evidências, usar a função `/function misterio_historico/reflexao_final` antes da finalização.

## Atualização — teste com interações no mundo
Na versão `0.1.4`, o teste com jogadores deve priorizar cliques/interações nos blocos do cenário, não comandos digitados no chat. A área de teste pode ser criada com `/function misterio_historico/montar_area_interativa`.

Checklist adicional de observação:
1. Confirmar se os jogadores entendem que o `lectern` inicia a investigação.
2. Confirmar se os blocos-pista parecem parte da narrativa, e não apenas botões escondidos.
3. Observar se os jogadores descobrem naturalmente o `lodestone` como mesa de diagnóstico.
4. Verificar se a sala final com `emerald_block`, `lapis_block`, `redstone_block` e `diamond_block` comunica bem escolha de hipótese e validação final.
5. Anotar quais elementos do mundo geraram mais curiosidade, conversa ou confusão.

6. Confirmar que um segundo jogador consegue iniciar sessão própria clicando no `lectern`, sem herdar pistas/conclusões do primeiro jogador.
