# Academia Arcana Monumental — Sprint 4: Torres educativas

## Objetivo
Inserir a primeira leva de desafios educativos jogáveis na Academia Arcana Monumental, usando apenas blocos vanilla e funções versionadas. A entrega foca em três torres disciplinares: Lógica, Algoritmos e Elementos.

## Arquivo de construção
- Função principal: `packs/BP_AcademiaArcanaMonumental/functions/academia_arcana_monumental/torres_educativas_sprint4.mcfunction`
- Montagem completa atualizada: `function academia_arcana_monumental/montar_completa`
- Execução isolada: `function academia_arcana_monumental/torres_educativas_sprint4`

> Execute a função a partir do mesmo centro do Pátio das Casas Arcanas usado nas Sprints 1, 2 e 3.

## Entregas implementadas

### Torre da Lógica
Local: quadrante noroeste, torre azul.

Desafios curtos:
1. **Padrão alternado** — sequência visual com blocos azuis e brancos para o jogador identificar continuidade e anomalia.
2. **Verdadeiro/falso** — alternância de redstone/emerald como leitura binária, com porta e pressão como feedback seguro.
3. **Condição visual** — sala superior com lâmpadas e sea lantern para representar condição satisfeita/insatisfeita.

Feedback usado:
- lecterns para instruções curtas;
- sea lantern e redstone lamp para indicar resposta/estado;
- porta e pressão para reforçar tentativa e erro sem perda permanente;
- sino no topo para conclusão simbólica.

### Torre dos Algoritmos
Local: quadrante nordeste, torre laranja.

Desafios curtos:
1. **Passos ordenados** — sequência linear de blocos dourados até o bloco de conclusão.
2. **Caminho eficiente** — três rotas de carpetes com comprimentos diferentes e destino marcado, estimulando comparação de custo.
3. **Repetição** — note blocks e redstone lamps alinhados para representar um loop de ações repetidas.

Feedback usado:
- blocos de destino e luzes;
- note blocks como referência sonora;
- lecterns para enunciados curtos;
- sino no topo para fechamento da torre.

### Torre dos Elementos
Local: quadrante sudoeste, torre verde.

Desafios curtos:
1. **Água versus calor** — comparação visual entre água, magma e iluminação segura.
2. **Energia causa efeito** — redstone, redstone lamp e sea lantern em sequência causal.
3. **Estados da água** — ice, packed ice, blue ice e water para reconhecer variação de estado/material.

Feedback usado:
- luzes e materiais contrastantes;
- lecterns com instruções breves;
- sino e beacon para conclusão visual;
- nenhum componente destrutivo ou perda permanente.

## Orientação no pátio
Foram adicionados marcadores de feedback próximos às rotas principais:
- rota azul da Lógica com lâmpadas e sea lantern;
- rota laranja dos Algoritmos com note blocks e iluminação;
- rota verde dos Elementos com água, sea lantern e magma;
- sala de síntese com as três cores/disciplinas e lectern de fechamento.

## Critérios de aceite atendidos
- Cada torre possui pelo menos dois desafios curtos e compreensíveis.
- As atividades usam tentativa e erro seguros, sem dano obrigatório nem perda permanente.
- O conteúdo mantém foco educativo para jovens de 16 a 20 anos, com leitura rápida por padrões, sequência, custo, repetição e causa/consequência.
- Não foram criadas ou alteradas texturas PNG.

## Versionamento
Como o módulo possui BP/RP pareados, ambos os manifests foram incrementados para `0.1.5`:
- `packs/BP_AcademiaArcanaMonumental/manifest.json`
- `packs/RP_AcademiaArcanaMonumental/manifest.json`

## Validação recomendada em jogo
1. Entrar em mundo de teste com os packs da Academia ativados.
2. Executar `function academia_arcana_monumental/montar_completa` em área livre.
3. Percorrer o pátio e validar as rotas para as torres azul, laranja e verde.
4. Confirmar que cada torre apresenta ao menos dois desafios legíveis.
5. Ajustar escala/densidade caso o playtest indique excesso visual ou confusão de rota.

## Registro pós-conclusão da Sprint 4
- O que foi feito: criada a função `torres_educativas_sprint4.mcfunction` com Torre da Lógica, Torre dos Algoritmos, Torre dos Elementos, pelo menos dois desafios por torre, feedback por luzes/portas/sinos/sons/blocos indicadores e sala de síntese no pátio. A montagem completa foi atualizada para executar as Sprints 1, 2, 3 e 4 em sequência.
- O que ficou faltando: validação visual dentro do jogo, ajuste fino de textos em lecterns após playtest e possível evolução futura para interações com scripts/scoreboards.
- Impedimentos/bloqueios: não houve uso de PNG por regra do projeto; a entrega usa apenas blocos vanilla e funções versionadas para execução em mundo de teste.
