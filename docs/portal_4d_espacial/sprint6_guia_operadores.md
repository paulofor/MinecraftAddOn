# Sprint 6 — UI, narrativa e orientação educativa

## Pergunta de causa raiz
Antes de implementar, a pergunta obrigatória foi: **por que isso aconteceu?**

A Sprint 6 ainda não estava executada porque o módulo já possuía portal, retorno e desafios de rotação/W, mas a orientação estava espalhada em mensagens técnicas. Faltava um roteiro curto para jovens de 16 a 20 anos, uma forma simples de repetir a explicação dentro da arena e comandos de recuperação para operadores.

## Escolhas implementadas sem UI modal
Para manter compatibilidade com o módulo atual, a Sprint 6 usa mensagens, títulos e blocos interativos em vez de adicionar dependência nova de UI modal:

- **Entrar:** interagir com a `sea_lantern` central do portal.
- **Voltar:** interagir com `lodestone` ou `sea_lantern` de referência na arena.
- **Repetir explicação:** interagir com qualquer `lectern` guia da arena.
- **Desafios:** `lapis_block` alterna a rotação 4D simulada; `emerald_block` avança a coordenada W simulada.

## Roteiro educativo

1. **Início:** o portal explica a analogia “sombra 2D de um cubo 3D”.
2. **Meio:** o jogador compara projeções/fatias e muda perspectiva na sala de rotação.
3. **Coordenada W:** o corredor mostra estados sucessivos do mesmo espaço.
4. **Conclusão:** o retorno reforça que não houve quarta dimensão real no motor Bedrock; houve uma simulação 3D para construir intuição.

## Guia de operadores

- Montar tudo: `/function portal_4d/montar_completa`.
- Recriar apenas a arena fallback: `/function portal_4d/construir_arena_4d`.
- Recuperar operador/jogador de teste para a arena fallback: `/function portal_4d/recuperar`.
- Consultar orientação em jogo: `/function portal_4d/init`.
- Diagnóstico pós-deploy: buscar `[Portal4D]`, `[Scripting]`, `TypeError` e `SyntaxError` no `bedrock.log`.

## Critérios de aceite cobertos

- A experiência explica a diferença entre simulação 4D e 4D real do motor.
- O jogador tem escolhas visíveis por blocos estáveis e mensagens curtas.
- O retorno e a recuperação operacional permanecem disponíveis.
- Nenhum PNG foi criado ou alterado.
