# Sprint 6 — Polimento, validação e preparação para expansão

## Objetivo
Revisar a jogabilidade da Torre Invertida Abissal, reforçando orientação, segurança, iluminação, retorno sem comandos administrativos e pontos de expansão para trabalhos futuros.

## Função entregue
- `/function torre_invertida_abissal/polimento_sprint6`

A função deve ser executada no mesmo centro relativo usado nas Sprints 1 a 5, depois das funções anteriores:

1. `/function torre_invertida_abissal/blocagem_sprint1`
2. `/function torre_invertida_abissal/superficie_sprint2`
3. `/function torre_invertida_abissal/eixo_aneis_sprint3`
4. `/function torre_invertida_abissal/laboratorios_sprint4`
5. `/function torre_invertida_abissal/bioma_arquivo_nucleo_sprint5`
6. `/function torre_invertida_abissal/polimento_sprint6`

## O que foi polido

### Orientação do percurso
- Trilha azul na entrada norte e no portal principal.
- Trilha ciano no Jardim Bioluminescente para leitura dos eixos norte/sul/leste/oeste.
- Placas em pontos de decisão: entrada, portal, anéis, laboratórios, arquivo, núcleo e elevador final.
- Luzes de waypoint em intervalos regulares para indicar o caminho crítico.

### Segurança e quedas
- Guard rails nos três anéis principais, usando muros vanilla para reduzir quedas acidentais sem bloquear a vista vertical.
- Piscina central reforçada no fundo do eixo vertical.
- Luzes de checkpoint próximas às rotas verticais.
- Escadas adicionais no retorno dos laboratórios ao eixo.

### Iluminação e mob spawning indesejado
- Lanternas e sea lanterns em bordas de cratera, passarelas, anéis, laboratórios, jardim, arquivo e retorno.
- Iluminação distribuída como orientação, sem transformar a torre em ambiente totalmente claro.

### Ritmo, atalhos e recompensas
- Entradas dos laboratórios marcadas por concreto amarelo e iluminação.
- Retorno final destacado com moldura de esmeralda, mantendo o elevador de água como saída sem comandos.
- Baús/recompensas simbólicas das sprints anteriores permanecem como marcos de progresso.

### Preparação para expansão
Foram adicionados quatro pontos de expansão futura, todos com marcadores visuais e lecterns:

| Ponto | Coordenada relativa aproximada | Uso futuro sugerido |
| --- | --- | --- |
| Superfície oeste/sul | `~-82 ~3 ~78` | NPC guia, missão de entrada ou diário de explorador |
| Superfície leste/sul | `~82 ~3 ~78` | Nova ponte, rota alternativa ou área de tutorial |
| Profundidade oeste/sul | `~-82 ~-75 ~78` | Nova ala de puzzle avançado |
| Profundidade leste/sul | `~82 ~-75 ~78` | Laboratório de scripts, entidades ou desafio cooperativo |

## Checklist de validação em jogo

- Entrar pela ponte norte e confirmar se a rota azul leva ao portal.
- Descer pelo eixo sem usar comandos administrativos.
- Visitar os três anéis e confirmar que há sempre uma pista visual de saída.
- Testar quedas controladas no eixo e confirmar recuperação por água/plataformas.
- Entrar nos laboratórios e confirmar retorno ao eixo.
- Seguir a rota ciano do Jardim Bioluminescente até Arquivo e Núcleo.
- Completar o Núcleo da Gravidade e retornar à superfície pelo elevador de água.
- Confirmar que os quatro pontos de expansão estão livres para novas salas, NPCs, scripts ou entidades.

## Observações
- Não foram criadas nem alteradas texturas PNG.
- A sprint usa apenas arquivos texto e blocos vanilla.
- Como nas sprints anteriores, a função deve ser validada em mundo Bedrock de teste antes de qualquer aplicação próxima a estruturas permanentes.
