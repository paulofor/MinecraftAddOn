# Plano de Add-On — Academia Arcana Monumental

## Visão geral
A Academia Arcana Monumental será uma megaconstrução educativa, explorável e expansível, criada como uma cidade-escola fantástica. A estrutura combina castelo, campus, biblioteca, laboratórios, torres temáticas, jardins, anfiteatros e áreas subterrâneas, permitindo que o jogador entre, descubra alas diferentes e resolva desafios curtos ligados a lógica, observação, matemática, programação, memória e tomada de decisão.

## Objetivos de experiência
- Criar uma construção grandiosa em largura, altura e profundidade, com presença visual forte no mundo.
- Transformar a academia em um hub educativo para futuras missões, NPCs, salas de aula interativas e desafios por módulos.
- Oferecer exploração não linear, mas com orientação clara por pátios, torres, cores, símbolos e placas.
- Misturar fantasia arcana com temas de computação e raciocínio lógico sem quebrar a imersão.
- Permitir expansão futura por novas disciplinas, eventos sazonais, salas secretas e progressão de jogador.

## Escala sugerida
- Área horizontal aproximada: 220 x 180 blocos para campus, muralhas, jardins, pátios, alas laterais e anexos.
- Altura acima do solo: 90 a 140 blocos para torre central, torres de disciplinas, cúpulas e observatório.
- Profundidade abaixo do solo: 40 a 80 blocos para arquivos proibidos, salas de máquinas, catacumbas e laboratório de energia.
- Estrutura de navegação: pátio central como hub, quatro torres principais, alas intermediárias, biblioteca vertical e subsolo progressivo.

## Conceito visual
A academia deve parecer uma instituição antiga que cresceu por séculos, com estilos arquitetônicos misturados: fundação de pedra, torres altas, vitrais, cúpulas, pontes suspensas, corredores com arcos, jardins simétricos e áreas subterrâneas mais misteriosas. Cada disciplina pode ter uma identidade visual própria, usando paletas, símbolos e formas arquitetônicas diferentes.

## Zonas principais
1. **Portão dos Aprendizes**: entrada monumental com ponte, muralhas, estátuas, brasões e área de recepção.
2. **Pátio das Casas Arcanas**: grande praça central que funciona como hub de navegação e ponto de encontro.
3. **Biblioteca Infinita**: biblioteca vertical com vários andares, passarelas, salas secretas, mapas e lecterns.
4. **Torre da Lógica**: ala de puzzles de sequência, operadores, portas condicionais e padrões.
5. **Torre dos Algoritmos**: desafios sobre ordem de passos, rotas, repetição, otimização e decomposição de problemas.
6. **Torre dos Elementos**: laboratório visual com água, fogo decorativo, vento simulado, terra, energia e experimentos seguros.
7. **Observatório Celeste**: cúpula alta com telescópios, constelações, calendário, orientação espacial e desafios de alinhamento.
8. **Anfiteatro dos Duelos Didáticos**: arena não destrutiva para desafios, apresentações, testes de conhecimento e eventos.
9. **Jardins de Runas**: área externa ampla com labirintos leves, fontes, árvores, placas de lore e puzzles ambientais.
10. **Arquivo Proibido Subterrâneo**: camada inferior com salas antigas, mecanismos, memória da academia e desafios finais.

## Diretrizes educativas
- Cada desafio deve ensinar uma ideia pequena e testável, sem depender de textos longos.
- A explicação deve aparecer em contexto: placa curta, lectern, NPC futuro ou feedback visual.
- O jogador deve poder errar, entender o erro e tentar novamente sem punição pesada.
- As salas devem ser modulares para permitir troca ou expansão de conteúdos educativos.
- O tom deve ser de descoberta e aventura, não de sala de aula tradicional.

## Sprints

### Sprint 1 — Conceito, mapa mestre e blocagem do campus
**Objetivo:** definir a escala monumental, o layout geral e a navegação principal da academia.

**Entregas:**
- Planta superior do campus com pátio central, torres, biblioteca, jardins, anfiteatro e subsolo.
- Corte vertical indicando torre central, alturas das alas e profundidade do arquivo subterrâneo.
- Paleta inicial de blocos por zona, sem depender de novas texturas PNG.
- Blocagem em mundo de teste com volumes simples e caminhos principais.

**Critérios de aceite:**
- O jogador reconhece a academia como uma megaconstrução ao se aproximar.
- O pátio central funciona como hub claro para as zonas principais.
- Há espaço suficiente para futuras salas, NPCs, scripts e expansões.

**Registro pós-conclusão:**
- O que foi feito: criados packs pareados BP/RP da Academia Arcana Monumental, função de inicialização, função de blocagem Sprint 1, mapa conceitual em vista superior/corte vertical, limites de escala, caminho crítico, paleta inicial de blocos e instruções de execução em mundo de teste. Detalhes em `docs/academia_arcana_monumental/sprint1_blocagem.md`.
- O que ficou faltando: validação visual dentro do jogo em mundo de teste e ajustes finos de escala após feedback de navegação e performance.
- Impedimentos/bloqueios: não houve uso de PNG por regra do projeto; a blocagem foi entregue como função versionada para execução segura em área livre, sem edição direta do mundo ativo.

### Sprint 2 — Portão, muralhas, pátio central e identidade visual
**Objetivo:** construir a primeira impressão e a área de orientação do jogador.

**Entregas:**
- Portão dos Aprendizes com ponte, arco monumental, brasões e estátuas.
- Muralhas externas e caminhos de chegada.
- Pátio das Casas Arcanas com fontes, sinalização e rotas para as torres.
- Sistema visual de orientação por cores, símbolos ou materiais para cada ala.

**Critérios de aceite:**
- A entrada é imponente e comunica que a academia é o destino principal.
- O jogador consegue identificar as rotas principais sem mapa externo.
- O pátio central tem pelo menos quatro pontos de interesse exploráveis.

**Registro pós-conclusão:**
- O que foi feito: criada função de detalhamento da Sprint 2 com Portão dos Aprendizes, ponte cerimonial, arco monumental, brasões em banners, estátuas, muralhas externas, torres de canto, pátio central ampliado, fonte, quatro pontos de interesse exploráveis e sistema de orientação por cores/materiais vanilla. A montagem completa foi atualizada para executar Sprint 1 e Sprint 2 em sequência. Detalhes em `docs/academia_arcana_monumental/sprint2_portao_patio_identidade.md`.
- O que ficou faltando: validação visual dentro do jogo, ajuste fino de escala do portão/muralhas após teste de navegação e textos finais de lecterns/placas em etapa futura.
- Impedimentos/bloqueios: não houve uso de PNG por regra do projeto; a entrega usa apenas blocos vanilla e funções versionadas para execução em mundo de teste.

### Sprint 3 — Biblioteca Infinita e Arquivo de Conhecimento
**Objetivo:** criar o coração narrativo e informacional da academia.

**Entregas:**
- Biblioteca vertical com múltiplos andares, passarelas, escadas, varandas e salas de leitura.
- Lecterns, placas e áreas de lore para explicar a história da academia e suas disciplinas.
- Salas secretas acessíveis por observação, sequência ou pequenos puzzles ambientais.
- Conexão para o Arquivo Proibido Subterrâneo, inicialmente fechada ou sinalizada para sprint futura.

**Critérios de aceite:**
- A biblioteca parece grande por dentro e por fora.
- O jogador encontra informações úteis sem precisar ler textos longos demais.
- Existem segredos opcionais que recompensam exploração cuidadosa.

**Registro pós-conclusão:**
- O que foi feito: criada função de construção da Biblioteca Infinita com fachada vertical, cúpula, átrio interno, múltiplos andares, passarelas, varandas, nichos de lore por disciplina, lecterns, iluminação orientadora, sala secreta por observação, sequência ambiental colorida e conexão subterrânea inicialmente bloqueada para o Arquivo Proibido. A montagem completa foi atualizada para executar Sprints 1, 2 e 3 em sequência. Detalhes em `docs/academia_arcana_monumental/sprint3_biblioteca_arquivo.md`.
- O que ficou faltando: validação visual dentro do jogo, textos finais para lecterns, ajuste fino das pistas secretas após playtest e abertura funcional do Arquivo Proibido em sprint futura.
- Impedimentos/bloqueios: não houve uso de PNG por regra do projeto; a entrega usa apenas blocos vanilla e funções versionadas para execução em mundo de teste.

### Sprint 4 — Torres educativas: Lógica, Algoritmos e Elementos
**Objetivo:** inserir a primeira leva de desafios educativos jogáveis.

**Entregas:**
- Torre da Lógica com desafios de padrões, verdadeiro/falso, sequência e condição.
- Torre dos Algoritmos com desafios de passos ordenados, caminho eficiente e repetição.
- Torre dos Elementos com experimentos visuais e puzzles de causa/consequência.
- Feedback claro por portas, luzes, sons, mensagens ou blocos indicadores.

**Critérios de aceite:**
- Cada torre possui pelo menos dois desafios curtos e compreensíveis.
- Os desafios têm tentativa e erro seguros, sem perda permanente para o jogador.
- O conteúdo mantém o foco educativo para jovens de 16 a 20 anos.

**Registro pós-conclusão:**
- O que foi feito: criada função de construção da Sprint 4 com Torre da Lógica, Torre dos Algoritmos e Torre dos Elementos, incluindo desafios curtos de padrões, verdadeiro/falso, condição, passos ordenados, caminho eficiente, repetição, causa/consequência e estados de materiais. A montagem completa foi atualizada para executar Sprints 1, 2, 3 e 4 em sequência. Detalhes em `docs/academia_arcana_monumental/sprint4_torres_educativas.md`.
- O que ficou faltando: validação visual dentro do jogo, ajuste fino de textos em lecterns após playtest e possível evolução futura para interações com scripts/scoreboards.
- Impedimentos/bloqueios: não houve uso de PNG por regra do projeto; a entrega usa apenas blocos vanilla, feedback visual/sonoro seguro e funções versionadas para execução em mundo de teste.

### Sprint 5 — Observatório, jardins e anfiteatro de eventos
**Objetivo:** ampliar a sensação de campus vivo e criar espaços para atividades futuras.

**Entregas:**
- Observatório Celeste com cúpula, telescópios, vitrais, mapas estelares e desafio de alinhamento.
- Jardins de Runas com trilhas, fontes, labirintos leves, bancos e puzzles ambientais.
- Anfiteatro dos Duelos Didáticos para eventos, apresentações ou desafios guiados.
- Rotas panorâmicas ligando torres por pontes suspensas e varandas.

**Critérios de aceite:**
- As áreas externas têm escala suficiente para exploração e encontros.
- O observatório oferece uma recompensa visual forte no topo da academia.
- O anfiteatro pode receber eventos futuros sem grande reconstrução.

**Registro pós-conclusão:**
- O que foi feito: criada função de construção da Sprint 5 com Observatório Celeste, cúpula, telescópios simbólicos, mapas estelares, desafio de alinhamento, Jardins de Runas com trilhas, fontes, labirintos leves, bancos e puzzles ambientais, Anfiteatro dos Duelos Didáticos preparado para eventos futuros e rotas panorâmicas por pontes suspensas/varandas. A montagem completa foi atualizada para executar Sprints 1, 2, 3, 4 e 5 em sequência. Detalhes em `docs/academia_arcana_monumental/sprint5_observatorio_jardins_anfiteatro.md`.
- O que ficou faltando: validação visual dentro do jogo, ajuste fino da escala das pontes e arquibancadas após playtest, e textos finais de lecterns em etapa futura.
- Impedimentos/bloqueios: não houve uso de PNG por regra do projeto; a entrega usa apenas blocos vanilla e funções versionadas para execução em mundo de teste.

### Sprint 6 — Arquivo Proibido Subterrâneo e desafio final
**Objetivo:** adicionar profundidade, mistério e uma conclusão para a primeira versão da academia.

**Entregas:**
- Entrada subterrânea a partir da biblioteca ou pátio central.
- Salas antigas com mecanismos, arquivos perdidos, símbolos e narrativa ambiental.
- Desafio final combinando conceitos aprendidos nas torres: sequência, lógica, observação e causa/consequência.
- Câmara de conclusão com recompensa, atalho de retorno e gancho para expansão futura.

**Critérios de aceite:**
- O subsolo muda o clima da academia sem parecer desconectado.
- O desafio final reaproveita ideias vistas antes, sem exigir conhecimento externo.
- O jogador consegue retornar ao campus com segurança após concluir a área.

**Registro pós-conclusão:**
- O que foi feito: criada função de construção da Sprint 6 com entrada subterrânea conectada à biblioteca/pátio, galeria de descida, Sala dos Arquivos Perdidos, Corredor dos Mecanismos Antigos, desafio final na Câmara do Selo, Câmara de Conclusão, recompensa simbólica, atalho de retorno seguro e gancho visual para expansão futura. A montagem completa foi atualizada para executar Sprints 1, 2, 3, 4, 5 e 6 em sequência. Detalhes em `docs/academia_arcana_monumental/sprint6_arquivo_proibido_desafio_final.md`.
- O que ficou faltando: validação visual dentro do jogo, ajuste fino da iluminação/escala do subsolo após playtest, textos finais de lecterns e eventual automação futura com scripts/scoreboards para validar respostas do desafio final.
- Impedimentos/bloqueios: não houve uso de PNG por regra do projeto; a entrega usa apenas blocos vanilla e funções versionadas para execução em mundo de teste.

### Sprint 7 — Polimento, validação e preparação para implementação técnica
**Objetivo:** garantir que a construção está jogável, compreensível e pronta para receber scripts ou entidades futuras.

**Entregas:**
- Revisão completa de rotas, sinalização, iluminação, quedas, mob spawning indesejado e pontos de travamento.
- Teste do fluxo do jogador desde a entrada até o arquivo subterrâneo.
- Lista de coordenadas importantes para futuras automações, NPCs, triggers e interações.
- Checklist de arquivos que precisariam de versionamento caso sejam adicionados packs, scripts, entidades ou definições.

**Critérios de aceite:**
- A academia pode ser explorada sem comandos administrativos.
- O jogador sempre tem pistas visuais para continuar a exploração.
- O documento fornece base suficiente para transformar a construção em módulo jogável no futuro.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

## Riscos e cuidados
- Evitar escala grande sem conteúdo; cada ala deve ter função, rota ou descoberta.
- Controlar quantidade de detalhes para não prejudicar performance em áreas muito densas.
- Não usar PNGs novos no Git; qualquer textura futura deve seguir o fluxo MCP do projeto.
- Evitar puzzles longos demais ou dependentes de conhecimento externo.
- Planejar rotas de retorno para telhados, torres altas e subsolo.
- Separar claramente o que é construção puramente arquitetônica do que exigirá script, entidade, item ou definição futura.

## Próximo passo recomendado
Executar a Sprint 1 com blocagem simples do campus, priorizando o pátio central, a torre principal, a biblioteca e o posicionamento das quatro rotas principais. Só depois da escala validada deve começar o detalhamento visual das alas.
