# Auditoria de qualidade — Pirâmide e Mundo Perdido

## Veredito do operador

- A Pirâmide é interessante externamente, mas muito pobre por dentro.
- O Mundo Perdido tem o mesmo problema: boa ideia/silhueta, pouco conteúdo
  explorável.

## Por que isso aconteceu?

Os dois projetos foram otimizados para produzir um marco visual grande com
segurança operacional. O trabalho concentrou-se em coordenadas, envelopes,
`fill`, limpeza, carregamento, binding, logs e prevenção de dano. A densidade de
experiência por metro percorrido não foi tratada como requisito principal.

### Pirâmide

A função atualmente montada chama o próprio interior de “simples”. Ela abre
uma galeria e uma única câmara retangular, coloca dois atris, duas luzes
centrais e seis tochas. A aventura mais elaborada não complementa essa versão:
`aventura/montar_interior.mcfunction` continua bloqueada e apenas exibe uma
mensagem.

Assim, a fachada cria expectativa de tumba monumental, mas o interior entrega
um volume quase vazio, sem sequência espacial, segredo, risco, recompensa,
variação vertical ou descoberta.

### Mundo Perdido

O script constrói três ilhas como superfícies elípticas com profundidade
procedural. A decoração é composta principalmente por:

- quatro árvores e uma linha de água na Natureza;
- três colunas, uma viga e uma esfera nas Ruínas;
- quatro torres e três esferas na Máquina;
- uma pedra-ímã por ilha e pontes lineares.

O objetivo consiste em tocar três âncoras. Não existem interiores, cavernas,
rotas alternativas, encontros, micro-histórias ou recompensas intermediárias.
O mundo é grande em distância, mas pequeno em quantidade de decisões e
descobertas.

## Causa raiz sistêmica

1. Silhueta externa foi usada como substituto de conteúdo.
2. Escala foi medida em blocos ocupados, não em momentos interessantes.
3. Testes verificaram presença de estruturas/âncoras e conclusão da missão,
   não densidade, surpresa ou exploração.
4. A segurança da construção dominou o design, mas não foi acompanhada por um
   protótipo jogável pequeno aprovado antes da expansão.
5. Os nomes e mensagens prometem “aventura”, “fragmentos” e “mundo”, enquanto
   a implementação oferece poucas peças repetidas.

## Decisão imediata

Não adicionar mais salas, ilhas ou decoração por remendo. Isso repetiria o
padrão que já falhou. Ambos os módulos ficam congelados até existir uma decisão
do operador entre:

1. manter somente as fachadas como monumentos decorativos;
2. substituir por conteúdo pronto testado visualmente;
3. refazer apenas **um** pequeno percurso de 5–10 minutos, primeiro como
   protótipo e sem reconstruir o restante.

Qualquer retomada deve começar por uma captura/layout do percurso e um playtest
manual, não por novas funções de `fill` ou por uma lista extensa de sprints.

## Diretriz aprovada: correção automatizada

O operador autorizou corrigir os projetos desde que não precise editar o mundo
manualmente. Isso é viável: montagem, substituição e reversão podem ser feitas
por funções/scripts publicados no servidor. “Playtest manual” significa apenas
jogar e avaliar o resultado; não significa colocar ou remover blocos à mão.

Toda correção deverá:

- receber coordenadas absolutas explícitas e nunca depender da posição do
  jogador;
- fazer backup anterior à primeira execução;
- declarar envelope X/Y/Z, subsolo e altura máxima;
- carregar chunks temporariamente e remover a tickingarea no sucesso/falha;
- executar precheck de dimensão, apoio, líquidos e colisões;
- separar função pública segura da rotina interna de construção;
- alterar somente o envelope conhecido do próprio projeto;
- possuir rotina automatizada de rollback/restauração da versão anterior;
- emitir logs do início, progresso, conclusão e falha;
- exigir somente que o operador entre no jogo, percorra e envie a avaliação
  visual.

### Ordem recomendada

1. **Pirâmide primeiro:** o exterior já agrada e o problema está limitado ao
   interior; é o melhor candidato para um protótipo automatizado curto.
2. Criar um único percurso interno de 5–10 minutos, sem ampliar a fachada.
3. Somente após aprovação visual, aplicar o mesmo método a uma única ilha do
   Mundo Perdido.
4. Não reconstruir simultaneamente os dois projetos.

O primeiro protótipo da Pirâmide deve caber no volume interno já existente e
entregar variedade espacial real: descida, bifurcação curta, câmara marcante,
segredo e recompensa visível. A automação constrói tudo; o operador apenas
testa.

## Próxima expansão recomendada para o Mundo 4D

### Anomalia das Três Linhas do Tempo

O melhor próximo passo é transformar os três fragmentos existentes em três
experiências diferentes, em vez de adicionar outra ilha grande:

1. **Natureza — passado:** recuperar uma sequência de vida observando a ordem
   em que árvores, água e luz reagem;
2. **Ruínas — presente:** alinhar quatro símbolos ou pilares para reconstruir
   uma memória do planeta;
3. **Máquina — futuro:** estabilizar um circuito sob limite de tempo, com
   feedback visual e tentativa segura sem perda de inventário;
4. **Núcleo — convergência:** depois das três soluções, o observatório revela
   uma plataforma que alterna entre passado, presente e futuro e apresenta uma
   decisão narrativa final.

**Por que isso é mais interessante?** Atualmente os três ambientes possuem
identidade visual, mas compartilham essencialmente a mesma ação: chegar à
pedra-ímã e ativá-la. A causa da repetição não é falta de área construída; é a
ausência de verbos e regras diferentes em cada fragmento. A expansão temporal
reaproveita o mundo já montado, adiciona observação, lógica e pressão leve e
mantém o foco educativo para jovens de 16 a 20 anos.

### Alternativas menores

- **Gravidade instável:** zonas com levitação lenta, queda segura e rotas que
  mudam conforme o jogador carrega uma âncora;
- **Ecos do explorador:** hologramas/mensagens em pontos fixos contam uma
  micro-história e liberam um final secreto;
- **Buraco negro reativo:** o disco muda de cor e abre passagens conforme cada
  fragmento é concluído;
- **Expedição cooperativa:** dois jogadores mantêm mecanismos ativos em ilhas
  diferentes, mas com alternativa solo para não bloquear o conteúdo;
- **Observatório astronômico:** alinhar constelações para descobrir coordenadas
  e conceitos de orientação espacial.

### Segurança e espaço

Essas ideias cabem no envelope atual X/Z=`-96..96`, Y=`45..150` porque alteram
principalmente interação, estado e pequenos elementos internos. Uma eventual
construção deve continuar recebendo coordenadas absolutas, usar tickingareas
temporárias, validar colisões e líquidos, possuir rollback e não reconstruir o
Planeta Partido inteiro a cada reinício. A primeira entrega recomendada é um
protótipo apenas no fragmento das Ruínas; após validação visual e de jogabilidade,
o mesmo padrão pode ser expandido aos outros dois fragmentos.
