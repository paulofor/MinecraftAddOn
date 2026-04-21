# Plano de Implantação — Quadro de Ideias

## Objetivo
Criar um bloco simples de **Quadro de Ideias** para o servidor principal da família, como primeiro passo de um uso mais educativo do Minecraft.

A ideia é usar o bloco como ponto central para:
- registrar objetivos de construção;
- combinar tarefas entre pai e filhos;
- testar cada avanço antes de seguir para o próximo;
- evoluir aos poucos, sem tentar fazer tudo de uma vez.

---

## Regra principal do projeto
**Nenhum item será considerado concluído sem um plano de teste no jogo.**

Ou seja, para cada etapa técnica, precisamos definir:
1. o que foi implementado;
2. como validar no servidor;
3. quais comandos usar no jogo;
4. qual resultado esperado;
5. se passou ou falhou.

---

## Visão da versão 1
A primeira versão será **simples e direta**.

### O que ela precisa ter
- 1 bloco customizado funcionando;
- nome próprio;
- textura simples, mas diferente do bloco de teste;
- possibilidade de ser colocado no mundo;
- teste por comando;
- documentação mínima do que foi feito.

### O que ela ainda não precisa ter
- interface gráfica;
- formulário para digitar texto;
- banco de dados de ideias;
- scripts complexos;
- múltiplos estados;
- integração com scoreboard.

---

## Nome inicial do recurso
### Bloco
- `digicomo:quadro_ideias`

### Packs
- `BP_QuadroIdeias`
- `RP_QuadroIdeias`

---

## Estratégia de implantação
Vamos usar o que funcionou no servidor de teste como base.

### Etapa 1 — Bloco mínimo funcional
**Objetivo:** confirmar que o bloco customizado carrega no servidor principal.

**Entregas:**
- Behavior Pack criado;
- Resource Pack criado;
- manifest com UUIDs próprios;
- bloco `digicomo:quadro_ideias` carregando sem erro.

**Teste obrigatório no jogo:**
- entrar com permissões de operador;
- rodar:
  - `/setblock ~ ~-1 ~ digicomo:quadro_ideias`
- confirmar que o bloco aparece.

**Resultado esperado:**
- mensagem de bloco colocado;
- bloco visível no mundo;
- sem erro no log do servidor.

**Status:** implementado no repositório (aguardando validação no servidor)

---

### Etapa 2 — Aparência própria
**Objetivo:** deixar de usar textura genérica e dar identidade ao quadro.

**Entregas:**
- textura própria do quadro;
- ajuste de material/geometry;
- revisão do nome exibido.

**Teste obrigatório no jogo:**
- remover o bloco anterior;
- rodar:
  - `/setblock ~ ~-1 ~ air`
  - `/setblock ~ ~-1 ~ digicomo:quadro_ideias`
- verificar se a aparência mudou.

**Resultado esperado:**
- bloco aparece com visual de “quadro”;
- não parece mais pedra comum;
- sem erro de pack.

**Status:** implementado no repositório (aguardando validação no servidor)

---

### Etapa 3 — Item para colocar o bloco
**Objetivo:** permitir obter o quadro com item próprio, em vez de depender só de `/setblock`.

**Entregas:**
- item customizado;
- `minecraft:block_placer` apontando para o bloco;
- nome amigável do item.

**Teste obrigatório no jogo:**
- rodar:
  - `/give @s digicomo:quadro_ideias 1`
- colocar o item no chão.

**Resultado esperado:**
- item aparece no inventário;
- item coloca o bloco correto;
- sem erro no log.

**Status:** implementado no repositório (aguardando validação no servidor)

---

### Etapa 4 — Uso prático como quadro de projetos
**Objetivo:** começar o uso educativo mesmo antes da automação.

**Modo simples inicial:**
- colocar o quadro numa área central da base;
- usar livros e penas, placas ou cartazes próximos ao quadro;
- cada ideia vira um pequeno registro.

**Modelo de registro sugerido:**
- nome do projeto;
- objetivo;
- materiais principais;
- responsável;
- prioridade.

**Teste obrigatório no jogo:**
- criar 3 ideias de exemplo;
- verificar se todos conseguem entender e usar.

**Resultado esperado:**
- o quadro vira ponto real de planejamento;
- cada pessoa consegue propor algo.

**Guia operacional da etapa:**
- `docs/desenvolvimentos/projetos/quadro_ideias_uso_pratico_v1.md`

**Status:** implementado no repositório (aguardando validação no servidor)

---

### Etapa 5 — Interação por script
**Objetivo:** transformar o quadro em ferramenta interativa.

**Entregas futuras:**
- interação ao clicar no bloco;
- menu simples;
- opções como:
  - Nova ideia
  - Ver ideias
  - Em andamento
  - Concluído

**Teste obrigatório no jogo:**
- interagir com o bloco;
- abrir a interface;
- cadastrar uma ideia de teste.

**Resultado esperado:**
- menu funcional;
- ideia registrada sem erro.

**Status:** implementado no repositório (aguardando validação no servidor)

---

## Organização familiar sugerida
### Pai
- coordenação do plano;
- revisão técnica do add-on;
- definição de prioridades;
- validação final dos testes.

### Filho de 18
- execução técnica maior;
- testes de servidor e comandos;
- parte de automação e estrutura.

### Filha de 16
- design do quadro;
- organização das ideias;
- nomes, categorias e estética do projeto.

---

## Regra de avanço
Só passamos para a próxima etapa quando houver:
- teste executado no jogo;
- confirmação visual;
- log sem erro crítico;
- registro do que funcionou.

---

## Plano obrigatório de comandos de teste
Este projeto **precisa sempre manter um plano de comandos no jogo**.

### Comandos-base de teste
- dar permissão de operador ao jogador no servidor:
  - `op <gamertag>`
- colocar o bloco manualmente:
  - `/setblock ~ ~-1 ~ digicomo:quadro_ideias`
- verificar se o bloco está presente:
  - `/testforblock ~ ~-1 ~ digicomo:quadro_ideias`
- limpar a posição para novo teste:
  - `/setblock ~ ~-1 ~ air`
- obter o item quando existir:
  - `/give @s digicomo:quadro_ideias 1`

### Regra prática
Toda etapa nova deve adicionar ao documento:
- comando para instalar/testar;
- resultado esperado;
- resultado obtido.

---

## Primeira meta imediata
**Começar com um bloco apenas.**

### Definição da primeira entrega
- bloco `digicomo:quadro_ideias` carregando no servidor principal;
- aparência simples;
- teste por `/setblock` funcionando;
- sem item ainda, se isso acelerar a implantação.

### Critério de sucesso
O primeiro marco será considerado concluído quando:
- o bloco existir no servidor principal;
- puder ser colocado por comando;
- puder ser verificado por comando;
- não gerar erro crítico no log.

---

## Registro de execução
### Etapa atual
- foco: **Etapa 5 — Interação por script**

### Próxima ação
- publicar atualização do `BP_QuadroIdeias` no servidor principal com Script API habilitada;
- rodar `/give @s digicomo:quadro_ideias 1` para obter o item do quadro;
- colocar o item no chão e interagir com o bloco para abrir o menu;
- cadastrar uma ideia de teste e avançar status até concluída;
- registrar o resultado obtido no log de execução abaixo.

### Log de execução da Etapa 1 (repositório)
- behavior pack `BP_QuadroIdeias` criado com UUIDs novos;
- resource pack `RP_QuadroIdeias` criado com UUIDs novos;
- bloco `digicomo:quadro_ideias` definido e mapeado em BP/RP;
- textura mínima inicial reaproveitada para garantir carregamento do bloco;
- pendente: validação em jogo no servidor principal usando comandos previstos.

### Log de execução da Etapa 2 (repositório)
- texturas dedicadas (`frente`, `lateral`, `topo`) publicadas no `RP_QuadroIdeias`;
- `blocks.json` e `terrain_texture.json` revisados para usar o novo visual;
- nome exibido no jogo ajustado para “Quadro de Ideias Familiar”;
- pendente: validação em jogo no servidor principal usando comandos previstos.

### Log de execução da Etapa 3 (repositório)
- item customizado `digicomo:quadro_ideias` criado em `BP_QuadroIdeias/items`;
- componente `minecraft:block_placer` configurado para colocar o bloco do quadro;
- textura de item adicionada em `RP_QuadroIdeias/textures/item_texture.json`;
- nome amigável do item registrado em `texts/en_US.lang`;
- pendente: validação em jogo no servidor principal usando comandos previstos.

### Log de execução da Etapa 5 (repositório)
- módulo `script` adicionado ao `manifest.json` do `BP_QuadroIdeias`;
- dependências `@minecraft/server` e `@minecraft/server-ui` configuradas;
- script `packs/BP_QuadroIdeias/scripts/main.js` implementado com menu interativo ao clicar no bloco;
- fluxo entregue: **Nova ideia**, **Ver ideias**, **Em andamento** e **Concluído**;
- persistência inicial implementada com dynamic properties no mundo;
- pendente: validação em jogo no servidor principal usando comandos previstos.

### Comandos previstos para o próximo teste
- `/give @s digicomo:quadro_ideias 1`
- colocar o item no chão
- interagir (clique) no bloco do quadro para abrir menu
- criar ideia de teste via opção **Nova ideia**
- abrir a ideia e usar **Avançar status** para mover até **Concluído**
- `/testforblock ~ ~-1 ~ digicomo:quadro_ideias`

### Diagnóstico rápido quando aparecer “o bloco não pode ser colocado”
No Bedrock, `~ ~ ~` costuma apontar para o bloco ocupado pelo próprio jogador.
Nesse caso, o jogo pode recusar a alteração e mostrar a mensagem de bloqueio, até com `air`.

**Use sempre o bloco abaixo do jogador para testes rápidos:**
- `/setblock ~ ~-1 ~ air`
- `/setblock ~ ~-1 ~ digicomo:quadro_ideias`
- `/testforblock ~ ~-1 ~ digicomo:quadro_ideias`

---

## Observação final
Este projeto não precisa nascer completo.

A melhor estratégia é:
1. fazer pequeno;
2. testar no jogo;
3. corrigir;
4. documentar;
5. só então evoluir.

Esse será o padrão do nosso trabalho.
