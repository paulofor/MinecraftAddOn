# Sprint 8 — Guia final para professores, mediadores e playtest

## Pergunta obrigatória de causa raiz
**Por que isso aconteceu?**

A Sprint 8 estava planejada como etapa de polimento e expansão, mas a experiência ainda precisava de um roteiro final para aula/oficina, checklist de playtest por perfis e pontos visíveis de expansão. A causa raiz da pendência era pedagógica e operacional: as sprints anteriores já entregavam mecânicas jogáveis, mas não consolidavam tempo de sessão, papéis de mediação, sinais de sucesso e arquitetura para novas salas sem reescrever o portal.

## Objetivo de uso em aula/oficina
- Duração sugerida: 10 a 15 minutos por grupo.
- Público-alvo: jovens de 16 a 20 anos.
- Formato recomendado: 1 mediador, 1 jogador principal e observadores que alternam a cada rodada.
- Conceito central: o Minecraft continua 3D; a experiência mostra projeções, fatias e estados para criar intuição sobre ideias 4D.

## Roteiro de mediação
1. **Abertura (2 min):** pergunte como uma sombra 2D pode representar um objeto 3D.
2. **Entrada no portal (2 min):** use a `sea_lantern` do portal e peça ao grupo para observar a mudança de contexto.
3. **Projeção/rotação (3 min):** interaja com o `lapis_block` e compare os dois layouts como projeções do mesmo conceito.
4. **Fatia/W simulado (3 min):** interaja com o `emerald_block` e peça que o grupo descreva o que muda a cada etapa.
5. **Síntese (2-5 min):** retorne pelo `lodestone`/`sea_lantern` e peça uma explicação curta: “por que isso não é 4D real do motor?”

## Checklist de playtest

### Perfil iniciante
- Consegue identificar o bloco de entrada sem ajuda depois da primeira instrução?
- Entende que `lectern` repete a explicação?
- Consegue retornar sem ficar preso?
- Consegue explicar que viu uma simulação, não uma dimensão física real?

### Perfil intermediário
- Compara os dois estados do `lapis_block` usando as palavras “projeção” ou “perspectiva”?
- Descreve o corredor W como sequência de fatias/estados?
- Completa a experiência em até 15 minutos?
- Sugere ao menos uma melhoria de legibilidade, ritmo ou iluminação?

### Perfil avançado
- Relaciona os pontos de expansão a matrizes, projeções, topologia, grafos ou coordenadas?
- Identifica onde novas salas poderiam ser adicionadas sem reescrever o portal?
- Testa retorno, repetição de explicação e cooldown sem gerar soft lock?
- Registra qualquer erro com horário, ação executada e trecho relevante do `bedrock.log`.

## Pontos de expansão preparados
- **Matrizes:** marcador em `gold_block` para futura sala de transformação linear.
- **Projeções:** marcador em `diamond_block` para comparar projeções 3D de objetos 4D.
- **Topologia:** marcador em `copper_block` para desafios de conectividade e deformação.
- **Grafos:** marcador em `emerald_block` para caminhos, nós e coordenadas discretas.

## Comandos úteis para operadores
- `/function portal_4d/montar_completa` — remonta portal, arena, polimento e pontos de expansão.
- `/function portal_4d/recuperar` — leva o operador à arena fallback.
- Após deploy/restart, verificar `/root/MinecraftServer/logging/bedrock.log` por `[Portal4D]`, `[Scripting]`, `TypeError` e `SyntaxError`.

## Critérios de sucesso da Sprint 8
- A experiência cabe em uma oficina curta de 10 a 15 minutos.
- O jogador sai com uma explicação básica sobre projeções/fatias 4D simuladas em 3D.
- O módulo tem marcadores de expansão sem exigir reescrita do fluxo de portal/teleporte.
- Nenhum PNG customizado foi criado ou necessário para o polimento.
