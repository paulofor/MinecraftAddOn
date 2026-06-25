# Sprint 5 — Rotação, perspectiva e coordenada W simulada

## Pergunta de causa raiz
Antes de implementar, a pergunta obrigatória foi: **por que isso aconteceu?**

A Sprint 5 ainda não estava executada porque o plano do projeto descrevia as entregas de rotação 4D, corredor W, progresso e feedback, mas o código existente terminava na Sprint 3: havia portal, fallback e retorno, sem controles interativos para mudar a arena depois da entrada. A evidência usada foi a ausência de lógica para `lapis_block`, `emerald_block`, tags de progresso e construção das alas 3/4 no script e na função de arena.

## Decisão de implementação

A implementação mantém a proposta pedagógica sem exigir matemática avançada:

- **Ala 3 — rotação 4D simulada:** um `lapis_block` funciona como controle. Cada interação alterna o layout visual da sala entre duas projeções, reforçando que o jogador observa mudanças de perspectiva/fatia, não uma quarta dimensão física real no motor.
- **Ala 4 — coordenada W simulada:** um `emerald_block` avança o estado `W` de 0 até 4. O corredor muda iluminação e piso já percorrido para representar fatias sucessivas do mesmo espaço.
- **Progresso:** tags (`portal4d_rotacao_4d`, `portal4d_w_N`) são usadas como mecanismo compatível. Dynamic properties são tentadas apenas quando disponíveis, sem quebrar o fluxo caso não estejam configuradas no servidor.
- **Feedback:** cada interação emite mensagem curta, título, som e partícula por comandos seguros, com logs prefixados por `[Portal4D]`.

## Coordenadas na arena fallback

Considerando o centro fallback em `4096 96 4096`:

- Rotação 4D: centro em `4120 96 4096`.
- Corredor W: início em `4096 96 4120` e avanço no eixo X até `4112 96 4120`.

## Critérios de aceite cobertos

- O jogador percebe mudança de estado visual ao interagir com a sala de rotação.
- A coordenada W é apresentada como sequência de estados simples e observáveis.
- Falhas têm recuperação simples: o retorno da arena continua disponível pelos blocos já existentes, e as interações só avançam estados seguros.
- Não foram adicionados PNGs ao Git.
