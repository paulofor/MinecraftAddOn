# Plano de Add-On — Torre Invertida Abissal

## Visão geral
A Torre Invertida Abissal será uma megaconstrução vertical e subterrânea para exploração, mistério e aprendizado por desafios. A estrutura começa como uma torre monumental acima do solo, atravessa uma cratera central e continua invertida em direção ao subsolo, criando uma jornada em camadas: superfície, eixo suspenso, anéis internos, laboratórios perdidos, abismo cristalino e núcleo final.

## Objetivos de experiência
- Criar uma construção grandiosa em largura, altura e profundidade, visível de longe e explorável por dentro.
- Fazer o jogador sentir descoberta constante, com salas, rotas e segredos diferentes a cada nível.
- Integrar desafios educativos leves de lógica, observação, orientação espacial, sequências e causa/consequência.
- Permitir expansão futura por módulos, novas alas, eventos, NPCs, recompensas e puzzles.

## Escala sugerida
- Área horizontal aproximada: 160 x 160 blocos para a cratera, ruínas externas, pontes e acessos.
- Altura acima do solo: 80 a 120 blocos para a torre quebrada, faróis, passarelas e observatório superior.
- Profundidade abaixo do solo: 100 a 160 blocos para anéis invertidos, câmaras técnicas e núcleo abissal.
- Raio de exploração principal: múltiplos anéis circulares conectados por escadas, elevadores de água, quedas controladas, túneis e pontes.

## Conceito visual
A construção deve parecer uma torre antiga que foi puxada para baixo por uma força abissal. A parte superior fica quebrada e inclinada, enquanto a parte subterrânea cresce invertida como uma cidade vertical pendurada no vazio. O contraste visual principal será entre pedra antiga, cobre oxidado, cristais luminosos, corredores escuros, vidro colorido, água em queda e mecanismos de redstone decorativos.

## Zonas principais
1. **Ruínas da Superfície**: entrada larga, muralhas quebradas, acampamentos de exploração, placas narrativas e vista da cratera.
2. **Coroa Partida**: topo da torre acima do solo, com observatório destruído e primeira visão do eixo central.
3. **Anel dos Ecos**: primeiro círculo interno, com salas de orientação, sons, pistas visuais e caminhos alternativos.
4. **Galeria das Pontes Suspensas**: área vertical aberta com pontes quebradas, plataformas, correntes e quedas seguras.
5. **Laboratórios Invertidos**: salas educacionais com puzzles de lógica, energia, ordem de passos e comparação de padrões.
6. **Arquivo Abissal**: biblioteca subterrânea com registros, mapas, lecterns, salas secretas e narrativa ambiental.
7. **Jardim Bioluminescente**: caverna ampla com fungos, cristais, água, vegetação e criaturas/entidades futuras.
8. **Núcleo da Gravidade**: câmara final com grande artefato central, desafio de ativação e recompensa.

## Sprints

### Sprint 1 — Pré-produção e blocagem da escala
**Objetivo:** definir a silhueta da torre, o volume da cratera e o caminho crítico do jogador.

**Entregas:**
- Mapa conceitual simples com vista superior e corte vertical.
- Definição dos limites de largura, altura e profundidade.
- Lista dos materiais base por zona.
- Protótipo de blocagem em mundo de teste, sem detalhes finos.

**Critérios de aceite:**
- O jogador consegue entender de longe que existe uma megatorre/cratera.
- Existe uma rota inicial clara da superfície até o primeiro anel subterrâneo.
- A construção não bloqueia spawn, caminhos importantes ou estruturas já existentes.

**Registro pós-conclusão:**
- O que foi feito: criados os packs pareados `BP_TorreInvertidaAbissal` e `RP_TorreInvertidaAbissal`, com função de inicialização e função de blocagem para mundo de teste; documentados mapa conceitual em vista superior/corte vertical, limites de escala, caminho crítico e materiais base em `docs/torre_invertida_abissal/sprint1_blocagem.md`.
- O que ficou faltando: executar a função em um mundo de teste no Bedrock, observar a escala real em jogo e ajustar medidas/materiais temporários conforme feedback.
- Impedimentos/bloqueios: o MCP remoto disponível é readonly e o histórico recente indica limitação de leitura bloco-a-bloco do mundo ativo; por segurança, a Sprint 1 foi entregue como artefato versionado para execução manual em área livre, sem alterar o mundo ativo.

### Sprint 2 — Construção da superfície e entrada monumental
**Objetivo:** criar impacto inicial e preparar a narrativa de entrada.

**Entregas:**
- Cratera externa com bordas, ruínas, pilares caídos e ponte principal.
- Entrada principal com portal arquitetônico, sinalização e primeira área segura.
- Elementos de escala como torres laterais, correntes, arcos gigantes e mirantes.
- Pontos de retorno para evitar que o jogador fique preso.

**Critérios de aceite:**
- A entrada é visível e convidativa.
- A área tem pelo menos três pontos de interesse antes da descida.
- O jogador consegue sair da estrutura sem depender de comandos.

**Registro pós-conclusão:**
- O que foi feito: criada a função `/function torre_invertida_abissal/superficie_sprint2` para detalhar a superfície, com cratera externa, bordas reforçadas, ponte principal iluminada, portal arquitetônico, pátio seguro, mirante oeste, acampamento leste, arco rachado sul, torres laterais, correntes, sinalização e pontos de retorno; documentada a execução em `docs/torre_invertida_abissal/sprint2_superficie_entrada.md`; atualizados os manifests pareados BP/RP para `0.2.0`.
- O que ficou faltando: executar a função em mundo Bedrock de teste após a Sprint 1, validar escala real, legibilidade das placas, largura da ponte e segurança das rotas de retorno.
- Impedimentos/bloqueios: a validação bloco-a-bloco no mundo ativo não foi usada devido às limitações já registradas do MCP remoto/LevelDB; por segurança, a Sprint 2 foi entregue como artefato versionado para execução manual em área livre.

### Sprint 3 — Eixo vertical e anéis de exploração
**Objetivo:** transformar a torre em uma experiência vertical memorável.

**Entregas:**
- Eixo central aberto ligando topo, superfície e subsolo.
- Dois ou três anéis exploráveis com corredores, salas laterais e variações visuais.
- Conexões por escadas, água, plataformas, túneis e passarelas.
- Áreas de descanso com checkpoints visuais e orientação por cores.

**Critérios de aceite:**
- O jogador percebe profundidade real ao olhar para baixo ou para cima.
- Há rotas alternativas sem tornar o caminho principal confuso.
- Quedas acidentais têm mitigação por água, plataformas intermediárias ou barreiras naturais.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 4 — Laboratórios, puzzles e conteúdo educativo
**Objetivo:** inserir desafios que combinem exploração com aprendizado.

**Entregas:**
- Pelo menos quatro salas de desafio: sequência, lógica booleana simples, padrão visual e causa/consequência.
- Feedback claro ao jogador usando luzes, sons, portas, mensagens ou blocos indicadores.
- Recompensas pequenas por sala, como acesso a atalhos, lore ou itens simbólicos.
- Textos curtos em placas/lecterns explicando a ideia sem virar aula longa.

**Critérios de aceite:**
- Cada puzzle pode ser entendido por observação e tentativa.
- Nenhum desafio exige conhecimento externo obrigatório.
- O conteúdo respeita o foco educativo para jovens de 16 a 20 anos.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 5 — Bioma abissal, arquivo e núcleo final
**Objetivo:** construir o clímax visual e narrativo da torre.

**Entregas:**
- Jardim bioluminescente amplo com cavernas, água, cristais e iluminação dramática.
- Arquivo Abissal com salas de lore, mapas e pistas sobre a origem da torre.
- Núcleo da Gravidade com artefato central e desafio final de ativação.
- Saída final ou elevador de retorno para a superfície.

**Critérios de aceite:**
- A parte final parece diferente das áreas anteriores.
- O jogador encontra uma conclusão clara para a exploração.
- Existe retorno seguro ao exterior após completar o núcleo.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 6 — Polimento, validação e preparação para expansão
**Objetivo:** revisar jogabilidade, performance, orientação e documentação.

**Entregas:**
- Revisão de iluminação, mob spawning indesejado, quedas perigosas e travamentos.
- Teste completo do percurso do início ao fim.
- Ajuste de sinalização, atalhos, recompensas e ritmo de exploração.
- Registro de coordenadas importantes e pontos planejados para expansões futuras.

**Critérios de aceite:**
- O percurso completo é jogável sem comandos administrativos.
- O jogador sempre tem ao menos uma pista de para onde ir.
- A estrutura fica pronta para receber scripts, NPCs, entidades ou novas salas em PRs futuros.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

## Riscos e cuidados
- Evitar espaços grandes vazios demais; cada camada precisa ter pontos de interesse.
- Controlar iluminação para preservar atmosfera sem prejudicar navegação.
- Evitar excesso de blocos com comportamento pesado ou mecanismos complexos próximos demais.
- Garantir rotas de saída e recuperação para jogadores que caírem ou se perderem.
- Não adicionar nem commitar texturas PNG; qualquer textura futura deve seguir o fluxo MCP definido no projeto.

## Próximo passo recomendado
Criar primeiro a blocagem da Sprint 1 em mundo de teste, usando materiais simples e cores temporárias para validar escala, caminho principal e sensação de profundidade antes de detalhar a construção.
