# Sprint 4 — Laboratórios, puzzles e conteúdo educativo

## Objetivo
Inserir quatro desafios curtos na Torre Invertida Abissal, combinando exploração, observação e aprendizado leve sem exigir conhecimento externo obrigatório.

## Função criada
Execute depois das Sprints 1, 2 e 3, usando a mesma origem relativa:

```mcfunction
/function torre_invertida_abissal/laboratorios_sprint4
```

> Use somente em mundo de teste/área livre, pois a função cria salas em volumes amplos do Anel 2 e da camada profunda.

## Entregas implementadas

### Hub dos laboratórios
- Galeria central no Anel 2 com lectern de orientação, placas, marcadores coloridos e luzes de leitura.
- Conexão visual com os quatro desafios para o jogador escolher a ordem de exploração.
- Retorno por escada entre o nível dos laboratórios superiores e o nível profundo.

### Sala 1 — Sequência
- Tema: ordem e memória operacional.
- Pista visual: pedestais azul, verde, amarelo e vermelho.
- Feedback: luzes alternadas indicam início/fim da sequência.
- Recompensa: baú simbólico e faixa dourada indicando conclusão.

### Sala 2 — Lógica booleana simples
- Tema: comparação entre entradas verdadeiras/falsas.
- Pista visual: pares de blocos verdes/vermelhos simulam condições simples, como AND/OR.
- Feedback: grades, lâmpadas e luz final mostram qual combinação gera passagem.
- Recompensa: baú simbólico após a leitura correta da sala.

### Sala 3 — Padrão visual
- Tema: repetição, simetria e reconhecimento de padrões.
- Pista visual: matriz com ametista, lanternas e vidros coloridos repetidos.
- Feedback: composição simétrica permite resolver por observação, sem texto longo.
- Recompensa: baú no fim da matriz.

### Sala 4 — Causa e consequência
- Tema: relação entre entrada, transformação e resultado.
- Pista visual: trilha de cobre em estágios, tochas/luzes e porta de resultado.
- Feedback: mudança progressiva de materiais e iluminação comunica cadeia causal.
- Recompensa: baú após a leitura da trilha.

## Conteúdo educativo
Os puzzles foram desenhados para jovens de 16 a 20 anos com foco em raciocínio exploratório:

- **Sequência:** organizar passos e reconhecer ordem.
- **Lógica booleana:** comparar condições simples por cor e resultado.
- **Padrão visual:** identificar repetição/simetria em uma matriz.
- **Causa/consequência:** observar como uma entrada produz uma cadeia de efeitos.

## Critérios de aceite
- O jogador encontra quatro salas distintas a partir do hub dos laboratórios.
- Cada desafio possui pista visual, feedback e recompensa simbólica.
- Nenhuma sala depende de conhecimento externo ou texto longo para ser compreendida.
- O percurso mantém retorno ao eixo/anéis sem bloquear a rota principal.
- Não há PNG, textura customizada ou recurso binário novo nesta sprint.

## Checklist de validação em jogo
1. Executar as funções das Sprints 1, 2, 3 e 4 na mesma origem relativa.
2. Confirmar que o hub dos laboratórios aparece no Anel 2 e não bloqueia passarelas anteriores.
3. Entrar nas quatro salas e verificar leitura visual dos desafios.
4. Confirmar que baús, lecterns, placas e luzes estão visíveis.
5. Validar que o retorno por escada e conexões ao eixo continuam utilizáveis.
6. Ajustar escala/posição em sprint futura se houver colisão com áreas existentes do mundo de teste.

## Pendências operacionais
- Preencher livros/lecterns com textos curtos em uma etapa futura, se o fluxo de publicação do mundo permitir conteúdo NBT/controlado.
- Validar no Bedrock real se todos os blocos escolhidos carregam corretamente na versão do servidor.
- Ajustar recompensas dos baús em uma sprint futura, caso seja adotado script ou loot table específico.
