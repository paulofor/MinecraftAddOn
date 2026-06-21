# Plano de Add-On — Mistério Histórico

## Objetivo educativo
Criar uma aventura investigativa para jovens de 16 a 18 anos em que os jogadores explorem ruínas, coletem pistas, comparem fontes e reconstruam uma narrativa histórica fictícia. O foco pedagógico é desenvolver leitura crítica, pensamento histórico, argumentação, colaboração e tomada de decisão ética.

## Conceito do jogo
Os jogadores chegam a uma ilha com ruínas de uma antiga comunidade. Há versões conflitantes sobre o que aconteceu: alguns registros dizem que a cidade foi abandonada por escassez de água; outros sugerem disputa política, erro técnico ou desastre ambiental. A missão é investigar evidências, montar uma linha do tempo e apresentar uma conclusão final.

## Estrutura de implementação por sprints

### Sprint 0 — Preparação do escopo e critérios de sucesso
**Objetivo:** definir o recorte narrativo e preparar um primeiro roteiro jogável antes de mexer em packs.

**Passo a passo:**
1. Definir o nome provisório da aventura, por exemplo `MisterioHistorico`.
2. Escolher o tema histórico fictício: ruína, vila antiga, expedição arqueológica ou cidade perdida.
3. Escrever uma pergunta central de investigação, por exemplo: “Por que a cidade foi abandonada?”.
4. Definir 3 hipóteses concorrentes para os jogadores avaliarem.
5. Listar 6 a 9 pistas, separando-as por tipo: diário, placa, item, construção, fala de NPC ou local do mapa.
6. Definir o critério de vitória: completar linha do tempo, responder a um quiz final ou entregar relatório a um NPC.

**Como testar:**
1. Fazer uma leitura do roteiro em voz alta com os jogadores ou sozinho.
2. Confirmar se cada hipótese tem ao menos 2 pistas associadas.
3. Confirmar se nenhuma pista entrega a resposta sozinha.
4. Confirmar se o desafio pode ser concluído em 20 a 40 minutos.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 1 — Protótipo sem programação usando mundo e comandos simples
**Objetivo:** validar a diversão e a clareza pedagógica antes de criar scripts ou itens customizados.

**Passo a passo:**
1. Criar uma área pequena no mundo com 4 zonas: acampamento inicial, ruínas, arquivo/templo e sala final.
2. Usar placas, livros ou NPCs para apresentar pistas textuais.
3. Colocar baús com “evidências” usando itens vanilla renomeados, como mapa, bússola, papel, fragmento ou livro.
4. Criar uma sala final com 3 opções de conclusão, uma para cada hipótese.
5. Usar comandos simples, placas ou botões para indicar acerto/erro.

**Como testar:**
1. Entrar no mundo como jogador comum, sem modo criativo.
2. Percorrer a missão sem consultar anotações externas.
3. Verificar se todos os pontos de pista são encontráveis.
4. Pedir para cada jogador explicar qual hipótese escolheu e quais pistas sustentam a decisão.
5. Ajustar textos longos demais, pistas ambíguas demais ou locais difíceis de achar.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 2 — Behavior Pack mínimo para progresso da investigação
**Objetivo:** criar estado de progresso para que o jogo reconheça pistas encontradas e etapas concluídas.

**Passo a passo:**
1. Criar ou adaptar um Behavior Pack do módulo `MisterioHistorico`.
2. Adicionar funções `.mcfunction` para iniciar, resetar, diagnosticar e finalizar a missão.
3. Usar scoreboard ou tags para registrar pistas encontradas.
4. Criar comandos para marcar evidências coletadas, por exemplo `tag @p add mh_pista_agua`.
5. Criar uma função de diagnóstico que mostre quais pistas o jogador já encontrou.
6. Atualizar `manifest.json` do BP e, se houver RP pareado, atualizar também o `manifest.json` do RP no mesmo commit.

**Como testar:**
1. Executar validação local dos JSON alterados, por exemplo `python3 -m json.tool packs/BP_MisterioHistorico/manifest.json`.
2. Rodar a função de reset no mundo.
3. Interagir com cada pista e validar se a tag ou scoreboard correspondente foi aplicado.
4. Rodar a função de diagnóstico e comparar o resultado com as pistas coletadas.
5. Testar a finalização com pistas insuficientes e depois com pistas suficientes.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 3 — Resource Pack e experiência narrativa
**Objetivo:** melhorar imersão com nomes, textos, sons e, se necessário, texturas publicadas pelo fluxo correto.

**Passo a passo:**
1. Criar nomes localizados em `texts/en_US.lang` para pistas, locais e mensagens.
2. Adicionar arquivos JSON de textura ou item apenas se forem necessários para a experiência.
3. Evitar commitar arquivos `.png`; publicar texturas somente via MCP quando houver imagem customizada.
4. Se houver textura customizada, publicar também no pack do mundo ativo, respeitando o caminho referenciado no JSON.
5. Atualizar sempre os manifests pareados BP/RP do módulo.

**Como testar:**
1. Validar todos os JSON alterados com `python3 -m json.tool`.
2. Confirmar que os nomes aparecem corretamente no jogo.
3. Se houver PNG, listar o diretório remoto via MCP e confirmar presença/tamanho do arquivo no pack do mundo.
4. Reentrar no mundo para validar se não há textura preto/roxo.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 4 — Teste com jogadores e ajustes pedagógicos
**Objetivo:** medir se a missão realmente gera investigação, conversa e aprendizagem.

**Passo a passo:**
1. Convidar os jogadores para testar sem explicar a solução.
2. Observar onde eles ficam confusos, onde se empolgam e onde tentam burlar a missão.
3. Anotar frases ditas por eles que revelem raciocínio, dúvida ou hipótese.
4. Ajustar pistas, tempos, recompensas e feedbacks.
5. Criar uma pergunta final de reflexão, por exemplo: “Qual evidência mais mudou sua opinião?”.

**Como testar:**
1. Cronometrar o tempo total da missão.
2. Verificar se os jogadores chegaram a hipóteses diferentes antes da conclusão.
3. Confirmar se eles conseguem citar ao menos 3 evidências ao defender a resposta.
4. Confirmar se o final recompensa argumentação, não apenas clique correto.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

### Sprint 5 — Publicação, diagnóstico e manutenção
**Objetivo:** publicar a versão jogável e criar rotina de validação para evitar regressões.

**Passo a passo:**
1. Publicar os packs atualizados no servidor Bedrock.
2. Reiniciar ou recarregar o ambiente conforme o fluxo operacional usado no projeto.
3. Validar o `bedrock.log` para confirmar ausência de erros de JSON, script ou dependência.
4. Criar uma checklist de regressão com início, coleta de pistas, diagnóstico e finalização.
5. Registrar evidências em `docs/registros1.md`.

**Como testar:**
1. Executar validações locais de JSON e, se houver script, `node --check`.
2. Validar o log remoto via MCP readonly procurando por `[Scripting]`, `TypeError`, `SyntaxError` e nomes dos arquivos alterados.
3. Fazer um teste completo do início ao fim no mundo ativo.
4. Confirmar que resetar a missão permite jogá-la novamente.

**Registro pós-conclusão:**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

## Primeira versão recomendada
Para começar com baixo risco, implemente primeiro uma versão sem texturas customizadas e com poucos elementos:

1. 1 acampamento inicial.
2. 1 ruína principal.
3. 6 pistas.
4. 3 hipóteses.
5. 1 sala final.
6. 1 função de reset.
7. 1 função de diagnóstico.
8. 1 função de finalização.

Depois que a missão estiver divertida, vale investir em itens customizados, NPCs mais elaborados e texturas.
