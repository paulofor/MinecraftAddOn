# Plano de Add-On — Portal para o Mundo 4D Espacial

## Visão geral
O Portal para o Mundo 4D Espacial será um Add-On educativo para Minecraft Bedrock que usa APIs de script para simular a experiência de entrar em um espaço de quarta dimensão. A proposta não é alterar o motor do jogo para ter uma quarta coordenada espacial real, mas criar uma dimensão/arena controlada em 3D que represente conceitos de 4D por projeções, fatias, salas paralelas, mudanças de estado e teleportes guiados.

A experiência deve ser voltada a jovens de 16 a 20 anos e transformar ideias abstratas — hipercubo/tesseract, projeção, rotação, seção transversal, coordenadas e perspectiva — em desafios curtos e visuais dentro do Minecraft.

## Decisão técnica: usar APIs
A implementação deve usar as APIs oficiais de Minecraft Bedrock sempre que o ambiente permitir:

- **Custom Dimension API** para registrar uma dimensão customizada do módulo, como `portal4d:espaco_4d`, durante `system.beforeEvents.startup`.
- **Script API `@minecraft/server`** para detectar interação com o portal, teletransportar jogadores, aplicar efeitos, controlar estado de progresso e emitir mensagens educativas.
- **Eventos `world.afterEvents.playerInteractWithBlock` e/ou detecção por região** para acionar o portal sem depender apenas de comandos manuais.
- **`Entity.teleport(location, { dimension })` / `TeleportOptions.dimension`** para mover o jogador para a dimensão/arena 4D simulada.
- **Fallback sem dimensão customizada** caso o servidor de produção não esteja com Beta APIs habilitado: usar área isolada no Overworld como arena 4D, mantendo a mesma lógica de portal e progresso.

## Fontes oficiais de referência
- Microsoft Learn — Custom Dimension API: `https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/custom-dimension-api-tutorial?view=minecraft-bedrock-stable`
- Microsoft Learn — TeleportOptions: `https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/teleportoptions?view=minecraft-bedrock-stable`
- Microsoft Learn — WorldAfterEvents / `playerInteractWithBlock`: `https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/worldafterevents?view=minecraft-bedrock-stable`
- Microsoft Learn — `PlayerInteractWithBlockAfterEvent`: `https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playerinteractwithblockafterevent?view=minecraft-bedrock-stable`
- Microsoft Learn — Script Module Versioning / Beta APIs: `https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/versioning?view=minecraft-bedrock-stable`

## Premissas e limitações
- O Minecraft Bedrock continua operando em coordenadas 3D (`x`, `y`, `z`). A quarta dimensão será uma simulação pedagógica, não uma geometria física real do motor.
- Custom Dimensions exigem versão compatível do Bedrock e Beta APIs habilitadas no mundo. Se isso não estiver disponível no servidor, a Sprint 2 deve implementar a arena 4D em uma área isolada do mundo ativo.
- Nenhum arquivo `.png` deve ser commitado no Git. Caso texturas customizadas sejam necessárias depois, elas devem seguir o fluxo obrigatório via MCP e registro em `docs/registros1.md`.
- Por regra do projeto, se forem criados BP/RP pareados para o módulo, qualquer alteração posterior no módulo deve incrementar os manifests dos dois packs no mesmo commit.

## Objetivos de experiência
- Criar um portal memorável que pareça abrir acesso a um espaço impossível.
- Ensinar conceitos de 4D por analogias jogáveis em vez de textos longos.
- Usar feedback claro: partículas, sons, títulos, mensagens, blocos luminosos, portas e checkpoints.
- Permitir retorno seguro ao Overworld/Hub em qualquer etapa.
- Manter puzzles resolvíveis por observação, comparação e experimentação.

## Estrutura proposta do módulo

```text
packs/
├── BP_Portal4DEspacial/
│   ├── manifest.json
│   ├── scripts/
│   │   └── main.js
│   └── functions/
│       └── portal_4d/
│           ├── init.mcfunction
│           ├── construir_portal.mcfunction
│           ├── construir_arena_4d.mcfunction
│           └── montar_completa.mcfunction
└── RP_Portal4DEspacial/
    └── manifest.json
```

Arquivos textuais complementares podem ser adicionados em `docs/portal_4d_espacial/` para registrar decisões, validações e roteiros educativos.

## Mecânica principal
1. O jogador encontra ou monta o portal com `/function portal_4d/montar_completa`.
2. O script monitora interação com o bloco-chave do portal, por exemplo `sea_lantern`, `lodestone`, `lectern` ou outro bloco estável.
3. Ao interagir, o script valida se o jogador está perto do portal e dispara a transição.
4. Se Custom Dimension API estiver disponível, o jogador é enviado para `portal4d:espaco_4d`.
5. Se não estiver disponível, o jogador é enviado para uma arena isolada no Overworld.
6. A arena apresenta quatro alas educativas: Projeção, Fatias, Rotação e Coordenadas.
7. Ao concluir os desafios, o jogador retorna ao portal original com uma mensagem de síntese.

## Sprints

### Sprint 1 — Pesquisa técnica, arquitetura e blocagem do portal
**Objetivo:** definir a base técnica e criar a primeira versão do portal físico e do plano de execução.

**Entregas:**
- Criação dos packs pareados `BP_Portal4DEspacial` e `RP_Portal4DEspacial`.
- Manifests iniciais com dependência BP → RP e módulo de script `@minecraft/server`.
- Função `portal_4d/init` com instruções para operadores.
- Função `portal_4d/construir_portal` com uma estrutura vanilla sem PNG custom.
- Documento curto com mapa conceitual do portal e decisão de fallback.

**Critérios de aceite:**
- Os packs carregam sem erro de manifesto.
- O portal pode ser construído por função em mundo de teste.
- Não há textura PNG versionada no Git.
- O plano indica claramente quando usar dimensão custom e quando usar arena fallback.

**Registro pós-conclusão:**
- O que foi feito: criados os packs pareados `BP_Portal4DEspacial` e `RP_Portal4DEspacial` em versão `0.1.0`, com dependência BP → RP, módulo de script `@minecraft/server`, funções `portal_4d/init`, `portal_4d/construir_portal` e `portal_4d/montar_completa`, além do documento `docs/portal_4d_espacial/sprint1_mapa_conceitual.md` com mapa conceitual e decisão de fallback.
- O que ficou faltando: validar carregamento dos packs e executar `/function portal_4d/construir_portal` em um mundo Bedrock de teste; a interação/teleporte do portal fica para sprints posteriores.
- Impedimentos/bloqueios: nenhum bloqueio local; validação visual em jogo não foi executada neste ambiente.

### Sprint 2 — Registro de dimensão customizada e fallback seguro
**Objetivo:** implementar a infraestrutura de destino usando APIs, com tolerância a ambiente sem Beta APIs.

**Entregas:**
- Script `main.js` registrando a dimensão `portal4d:espaco_4d` em `system.beforeEvents.startup`, quando a API estiver disponível.
- Função/rotina de criação de plataforma segura no destino.
- Fallback documentado e implementado para teleporte a uma arena 4D no Overworld.
- Logs prefixados com `[Portal4D]` para facilitar depuração em `bedrock.log`.

**Critérios de aceite:**
- Em ambiente com Beta APIs, a dimensão customizada é registrada no startup.
- Em ambiente sem Beta APIs, o script não quebra a experiência básica e orienta o uso da arena fallback.
- O jogador nunca é teleportado para queda livre ou bloco perigoso.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 3 — Trigger do portal por Script API
**Objetivo:** transformar o portal em uma interação jogável, evitando dependência de múltiplos comandos manuais.

**Entregas:**
- Assinatura de `world.afterEvents.playerInteractWithBlock` para detectar interação com o bloco-chave do portal.
- Validação de distância/posição para evitar falso positivo em blocos iguais fora do portal.
- Teleporte com `player.teleport(destino, { dimension })` quando a dimensão custom estiver disponível.
- Teleporte fallback para coordenadas seguras no Overworld quando necessário.
- Mensagens educativas curtas antes e depois da transição.

**Critérios de aceite:**
- Interagir com o portal envia o jogador para o destino correto.
- Interagir com blocos iguais fora da área do portal não dispara o fluxo.
- O script registra eventos úteis para diagnóstico.
- O jogador consegue retornar ao ponto de origem.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 4 — Arena 4D: Projeção e fatias 3D
**Objetivo:** construir os primeiros desafios educativos dentro do Mundo 4D simulado.

**Entregas:**
- Ala 1: projeção de um hipercubo/tesseract usando blocos vanilla, vidros e luzes.
- Ala 2: sequência de “fatias 3D” de um objeto 4D, mostrando como uma dimensão superior pode aparecer por cortes sucessivos.
- Lecterns/placas com explicações curtas e perguntas de observação.
- Checkpoints por blocos ou marcadores para acompanhar progresso.

**Critérios de aceite:**
- O jogador entende que está vendo projeções/fatias, não uma dimensão real do motor.
- Cada sala ensina uma ideia por vez.
- O caminho é seguro, iluminado e reversível.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 5 — Arena 4D: rotação, mudança de perspectiva e coordenada W simulada
**Objetivo:** criar interações que representem a quarta coordenada de forma jogável.

**Entregas:**
- Ala 3: sala de “rotação 4D” com mudanças de layout após interação.
- Ala 4: corredor de coordenada `W` simulada, onde cada avanço muda o estado visual do mesmo espaço.
- Sistema de progresso por tags/dynamic properties, se adequado ao servidor.
- Feedback por som, partículas, títulos e iluminação.

**Critérios de aceite:**
- O jogador percebe que a sala muda de estado como se estivesse vendo outra fatia/projeção.
- A mecânica não depende de precisão matemática avançada para ser compreendida.
- Falhas do jogador têm recuperação simples e sem soft lock.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 6 — UI, narrativa e orientação educativa
**Objetivo:** tornar a experiência clara para o público-alvo e reduzir confusão conceitual.

**Entregas:**
- Mensagens curtas explicando 2D → 3D → 4D por analogia.
- UI simples ou mensagens/títulos com escolhas: “Entrar”, “Voltar”, “Repetir explicação”.
- Roteiro educativo com início, meio e conclusão.
- Guia de operadores com comandos de recuperação.

**Critérios de aceite:**
- Jogadores de 16 a 20 anos conseguem completar a experiência sem leitura externa.
- A diferença entre “simulação de 4D” e “4D real do motor” fica explícita.
- O retorno ao Overworld é sempre acessível.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 7 — Validação no servidor, logs e hardening
**Objetivo:** validar o Add-On no ambiente Bedrock real e estabilizar erros de API.

**Entregas:**
- Execução do checklist local: parsing JSON, `node --check` em scripts e inspeção de diff.
- Deploy em mundo de teste.
- Revalidação do `bedrock.log` via MCP readonly, buscando `[Portal4D]`, `[Scripting]`, `TypeError` e `SyntaxError`.
- Ajustes de compatibilidade conforme versão efetiva do servidor.

**Critérios de aceite:**
- Sem erros de parse/carregamento no log.
- Portal funcional para entrada e saída.
- Fallback documentado caso Custom Dimension API não esteja habilitada.
- Registros de evidência atualizados em `docs/registros1.md`.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 8 — Polimento, playtest e expansão
**Objetivo:** melhorar estética, ritmo e potencial de expansão do Mundo 4D.

**Entregas:**
- Ajuste de escala, luz, som, tempo de transição e legibilidade dos puzzles.
- Pontos de expansão para novos conceitos: matrizes, projeções, topologia, grafos e coordenadas.
- Checklist de playtest com pelo menos três perfis: iniciante, intermediário e avançado.
- Documento final de uso para professores/mediadores.

**Critérios de aceite:**
- A experiência completa dura tempo adequado para aula/oficina curta.
- O jogador sai com uma explicação básica de projeção e fatias 4D.
- A arquitetura permite novas salas sem reescrever o portal.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

## Checklist inicial de implementação
- Confirmar versão do Bedrock Server e se Beta APIs podem ser habilitadas no mundo de teste.
- Criar BP/RP pareados do módulo `Portal4DEspacial`.
- Definir coordenadas seguras do portal no mundo ativo ou de teste.
- Implementar primeiro o fallback em Overworld para garantir experiência mínima.
- Em seguida, ativar Custom Dimension API em ambiente controlado.
- Validar `bedrock.log` após cada sprint técnica.

## Próximo passo recomendado
Executar a Sprint 1 criando a estrutura de packs, manifests, função de montagem do portal e script inicial com logs `[Portal4D]`. A integração com Custom Dimension API deve entrar na Sprint 2, depois que o portal físico e o fallback estiverem validados.
