# AGENTS.md — Lições aprendidas para próximos add-ons Bedrock

Este documento registra **os erros reais que apareceram no desenvolvimento do add-on Quadro de Ideias**, o que tivemos que ajustar e quais regras devem ser seguidas nos próximos projetos de add-ons para Minecraft Bedrock.

Objetivo: evitar repetir os mesmos erros de arquitetura, compatibilidade e debugging.

---


## ⚠️ Estratégia obrigatória de versionamento e `format_version`

> **Tratar versionamento como parte do código, não como detalhe de empacotamento.**
>
> O erro abaixo continuou aparecendo no servidor mesmo depois de o item, bloco e script passarem a funcionar:
>
> `blocks/quadro_ideias_block.json | Unexpected version for the loaded data`
>
> Isso mostra uma lição importante: em Bedrock, **manifest version**, **module version**, **dependency version**, **min_engine_version** e **format_version de cada arquivo JSON** são coisas diferentes. Misturar essas camadas ou “subir tudo junto” costuma deixar warnings persistentes. A documentação oficial separa claramente esses conceitos e recomenda usar versões por tipo de arquivo, com regra geral **N ou N-1** para tipos como blocks e items. citeturn152624view0turn152624view2turn152624view4

### Estratégia padrão para próximos add-ons

1. **Manter uma matriz de versões no repositório**
   Criar uma seção fixa no README ou neste próprio `AGENTS.md` com:
   - versão do servidor Bedrock usada em produção;
   - `manifest.json` `format_version`;
   - `header.version` e `modules[].version` de cada pack;
   - `dependencies[].version` entre BP e RP;
   - `min_engine_version`;
   - `format_version` esperado para cada tipo de arquivo (`blocks/`, `items/`, `recipes/`, etc.).

2. **Não dar bump cego em todos os arquivos**
   - `manifest.json` de BP/RP deve usar `format_version: 2`. citeturn152624view2turn152624view4
   - `header.version` e `modules[].version` servem para substituição/importação do pack e devem subir quando houver release nova. citeturn152624view4
   - `dependencies[].version` deve bater exatamente com a versão do outro pack do qual ele depende. citeturn152624view4
   - `min_engine_version` é compatibilidade mínima do pack e deve seguir a linha de versão alvo do projeto. citeturn152624view2turn152624view4
   - `format_version` de **block JSON** e outros arquivos de conteúdo deve seguir a regra do tipo de arquivo, não a versão do manifesto. A Microsoft diferencia explicitamente esses sistemas de versão. citeturn152624view0turn152624view2

3. **Para arquivos em `blocks/`, `items/`, `recipes/` e semelhantes, usar política N ou N-1 por tipo**
   A orientação oficial atual diz que, para conteúdo novo, se deve mirar a versão retail mais recente, e que vários tipos de arquivo — incluindo **Block Types** e **Item Types** — seguem a política **N ou N-1**. citeturn152624view2

4. **Não confiar em exemplo antigo copiado da documentação**
   A página de estrutura de bloco ainda mostra exemplo com `format_version: "1.19.40"`, mas a própria orientação de plataforma diz para mirar o mais recente/N-1 para block types. Ou seja, exemplo antigo pode servir para estrutura, mas não necessariamente para a versão ideal do seu pack. citeturn152624view1turn152624view2

5. **Criar checklist obrigatório de publicação**
   Antes de subir o pack para o servidor:
   - validar se `manifest.json` está coerente;
   - validar se `header.version`, `modules[].version` e `dependencies[].version` combinam;
   - revisar `min_engine_version`;
   - revisar `format_version` por pasta/tipo de arquivo;
   - reiniciar o servidor e checar se restou algum warning de schema/versionamento no boot.

6. **Tratar warning de schema/version como bug de release**
   Se aparecer algo como `Unexpected version for the loaded data`, considerar a release incompleta mesmo que o conteúdo “pareça funcionar”. A documentação de validação da Microsoft trata `format_version` como algo que deve ser validado por tipo e que pode ser atualizado para o valor correto. citeturn152624view3

### Regra operacional resumida

- **Manifesto não é igual a conteúdo.**
- **Versão do pack não é igual a `format_version` do bloco.**
- **`dependencies[].version` tem que bater exatamente com o pack dependido.**
- **Para blocos e itens, seguir N ou N-1 do tipo de arquivo.**
- **Warning de versionamento no boot bloqueia release.**

---

## 1. Regra principal: não mutar mundo dentro de `beforeEvents`

### Falha observada
Ao tentar colocar o bloco do quadro por script, o servidor gerava repetidamente o erro:

- `ReferenceError: Native function [Block::setPermutation] cannot be used in restricted execution`

Isso acontecia porque o add-on estava tentando executar `Block.setPermutation(...)` dentro de um fluxo de `world.beforeEvents.playerInteractWithBlock`.

### Causa
Em Bedrock Script API, callbacks de **before events** rodam em **restricted execution**. Nesse modo, APIs que modificam o mundo não podem ser chamadas diretamente.

### Ajuste feito
- Removemos a colocação manual do bloco por script.
- Delegamos a colocação ao componente nativo do item: `minecraft:block_placer`.
- Mantivemos o script apenas para o que realmente precisa de script: formulário, persistência, logs e diagnósticos.

### Regra para próximos add-ons
- **Nunca** usar `setPermutation`, `setType` ou outras mutações de mundo dentro de `beforeEvents`.
- Se realmente precisar mutar mundo depois de um `before`, usar `system.run(...)` para adiar a execução.
- Sempre preferir componentes nativos do Bedrock quando eles já resolvem o problema.

---

## 2. Evitar duplicidade entre engine nativa e script

### Falha observada
O item já possuía `minecraft:block_placer`, mas ao mesmo tempo o script tentava colocar o bloco manualmente.

### Problemas gerados
- arquitetura duplicada;
- mais pontos de falha;
- conflito entre fluxo nativo e fluxo customizado;
- debugging mais confuso.

### Ajuste feito
- Escolhemos **uma única fonte de verdade** para colocação: `minecraft:block_placer`.
- O script deixou de competir com a engine nesse fluxo.

### Regra para próximos add-ons
Sempre decidir claramente:
- **ou** a engine coloca o bloco/item via componente nativo;
- **ou** o script faz a lógica customizada.

Não manter os dois ao mesmo tempo sem necessidade real.

---

## 3. Padronizar namespace e IDs desde o início

### Falha observada
Havia mistura de IDs antigos e novos, como:
- `digicom:*`
- `digicomo:*`
- aliases com sufixos como `_item`

### Problemas gerados
- comandos `/give` inconsistentes;
- logs confusos;
- troubleshooting difícil;
- risco de pack antigo continuar mascarando erro.

### Ajuste feito
- Padronizamos tudo para um único namespace oficial:
  - item: `digicomo:quadro_ideias`
  - bloco: `digicomo:quadro_ideias_bloco`
- Removemos aliases legados redundantes.
- Atualizamos logs, diagnósticos e documentação para o ID único.

### Regra para próximos add-ons
- Definir namespace oficial no primeiro commit.
- Não criar aliases “temporários” sem plano claro de remoção.
- Validar todos os arquivos do pack por busca global antes de publicar.

Checklist rápido:
- item JSON
- block JSON
- scripts
- manifests
- README
- comandos de teste
- logs de diagnóstico

---

## 4. Proteger código assíncrono contra jogador desconectado

### Falha observada
Depois que o jogador saía do servidor, surgia erro assíncrono:

- `Unhandled promise rejection: Error: Failed to get property 'name'`

Esse erro aconteceu no fluxo do formulário, porque o script tentava acessar `player.name` depois que a Promise do formulário resolvia, mas o player já não estava mais válido.

### Causa
Em Bedrock, entidades e jogadores podem se tornar inválidos entre o início e o fim de um fluxo assíncrono.

### Ajustes necessários
- capturar valores simples antes do async, por exemplo:
  - `const playerName = player.name`
- verificar validade antes de continuar:
  - `if (!player.isValid) return`
- evitar usar propriedades do player dentro de `catch`/`then` sem guarda.

### Regra para próximos add-ons
Qualquer código com:
- `form.show(player)`
- `runCommandAsync(...)`
- Promises em geral

precisa assumir que o player pode:
- desconectar;
- morrer;
- trocar de estado;
- deixar de ser válido.

Padrão recomendado:

```js
const playerName = player.name;
form.show(player)
  .then((response) => {
    if (!player.isValid) return;
    // continuar
  })
  .catch((error) => {
    logError(`Erro para ${playerName}`, error);
  });
```

---

## 5. Adicionar trava para evitar múltiplas aberturas do mesmo formulário

### Falha observada
O log mostrou o mesmo formulário abrindo várias vezes para a mesma interação, e a mesma ideia sendo adicionada mais de uma vez.

### Causa provável
- múltiplos callbacks respondendo à mesma interação;
- falta de trava por jogador/quadro;
- possível interferência de outro behavior pack ativo.

### Ajustes necessários
Criar trava por combinação de jogador + quadro, por exemplo:
- `formsOpen.add(key + ':' + playerName)` na abertura;
- `formsOpen.delete(...)` no `finally`.

### Regra para próximos add-ons
Toda UI que pode ser disparada por interação em bloco deve ter proteção contra reentrada.

Padrão recomendado:
- impedir abertura duplicada enquanto o formulário já estiver aberto;
- usar `finally` para liberar a trava;
- logar reentradas bloqueadas quando estiver em modo diagnóstico.

---

## 6. Sempre tratar compatibilidade de API por detecção de recurso

### Falha observada
No boot apareceram avisos como:
- `Evento scriptEventReceive indisponível nesta versão da API`
- `Evento chatSend indisponível nesta versão da API`

### O que isso ensina
Nem toda API está disponível em toda combinação de:
- versão do Bedrock Dedicated Server;
- versão do `@minecraft/server`;
- modo stable vs experimental;
- ambiente do mundo/servidor.

### Ajuste feito
O script passou a verificar se o evento existe antes de chamar `subscribe`.

### Regra para próximos add-ons
Sempre fazer feature detection:

```js
const scriptEventReceive = world.afterEvents?.scriptEventReceive;
if (scriptEventReceive?.subscribe) {
  scriptEventReceive.subscribe(...);
}
```

Nunca assumir que um evento/documentado vai existir no ambiente real de produção.

---

## 7. Validar `format_version` e schema dos arquivos JSON de conteúdo

### Falha observada
No boot do servidor apareceu:

- `blocks/quadro_ideias_block.json | Unexpected version for the loaded data`

Mesmo com o bloco sendo resolvido pelo script, isso indica problema de schema/versão do JSON do bloco.

### O que isso significa na prática
O conteúdo pode até parecer “funcionar”, mas o pack está sendo carregado com warning estrutural. Isso é sinal de que:
- o `format_version` pode estar inadequado para aquele tipo de arquivo;
- algum campo está legado ou fora do schema esperado;
- haverá risco de quebra em atualização futura.

### Regra para próximos add-ons
Antes de publicar:
- validar item JSON;
- validar block JSON;
- revisar componentes legados;
- revisar `format_version` de cada arquivo individualmente.

### Observação prática
Não basta o pack “subir”. Se há warning de schema, o correto é tratar como bug de release.

---

## 8. Usar logs de diagnóstico úteis e orientados à ação

### O que funcionou bem
O addon passou a logar mensagens úteis como:
- item registrado com sucesso;
- bloco registrado com sucesso;
- comando correto de `/give`;
- abertura de formulário;
- persistência de ideias;
- cancelamento de formulário;
- falha de permissão em comando.

### Regra para próximos add-ons
Logs devem responder rapidamente:
- o item foi registrado?
- o bloco foi registrado?
- o evento disparou?
- o jogador tinha permissão?
- o JSON persistido gravou?
- a UI foi aberta mais de uma vez?

Evitar log genérico. Sempre preferir:
- contexto;
- ID do conteúdo;
- jogador;
- chave do objeto persistido;
- ação que estava sendo executada.

---

## 9. Persistência precisa de chave estável e JSON tolerante a erro

### O que foi feito corretamente
O quadro usa uma chave estável baseada em dimensão + coordenadas do bloco e grava tudo numa dynamic property JSON.

### Regra para próximos add-ons
Ao persistir dados:
- usar chave previsível e reprodutível;
- tratar JSON inválido com reset seguro;
- limitar tamanho das coleções;
- validar comprimento de texto antes de gravar;
- nunca confiar em dado vindo direto da UI sem saneamento.

Checklist:
- `readIdeasDB()` com try/catch;
- `writeIdeasDB()` com try/catch;
- limite por entidade/bloco;
- saneamento de string;
- fallback para objeto vazio.

---

## 10. Testar sempre com ambiente real de servidor, não só em teoria

### O que aconteceu
Vários problemas só apareceram no servidor real:
- restricted execution ao colocar bloco;
- evento de API indisponível;
- warning de block JSON;
- promise falhando após disconnect;
- abertura duplicada de formulário.

### Regra para próximos add-ons
Todo add-on deve ter ciclo mínimo de validação:
1. subir no servidor real;
2. reiniciar serviço;
3. conferir pack stack no boot;
4. ler warnings/errors completos;
5. testar com jogador real conectado;
6. testar desconexão durante fluxo assíncrono;
7. testar persistência após restart.

---

## 11. Regras práticas que devem virar padrão do time

### Padrão obrigatório
- Não mutar mundo em `beforeEvents`.
- Preferir componente nativo do Bedrock quando existir.
- Feature-detect em APIs opcionais.
- Padronizar namespace único.
- Não usar aliases legados sem prazo de remoção.
- Proteger fluxo assíncrono contra entidade inválida.
- Colocar trava contra formulário duplicado.
- Tratar warning de schema como bug real.
- Sempre testar em servidor real.

### Padrão recomendado de arquitetura
- **Engine nativa**: colocação, componentes declarativos, comportamento simples.
- **Script**: UI, persistência, validação, diagnóstico.
- **Logs**: claros, curtos, acionáveis.

---

## 12. Template de revisão para novos add-ons

Antes de publicar qualquer novo add-on, revisar:

### Conteúdo
- [ ] item IDs padronizados
- [ ] block IDs padronizados
- [ ] sem aliases temporários esquecidos
- [ ] manifests coerentes entre BP/RP
- [ ] `format_version` revisado em todos os JSONs

### Script
- [ ] sem mutação de mundo em `beforeEvents`
- [ ] `system.run(...)` usado apenas quando necessário
- [ ] guards para APIs opcionais
- [ ] guards para `player.isValid`
- [ ] `catch` sem acessar entidade inválida
- [ ] trava anti-dupla-abertura em formulários

### Diagnóstico
- [ ] logs de item/bloco registrado
- [ ] logs de evento disparado
- [ ] logs de erro com contexto suficiente
- [ ] comando de teste documentado (`/give`, etc.)

### Testes
- [ ] boot limpo no servidor
- [ ] sem warnings inesperados de schema
- [ ] item obtido com sucesso
- [ ] bloco colocado com sucesso
- [ ] interação funciona
- [ ] persistência funciona
- [ ] restart do servidor preserva comportamento
- [ ] disconnect durante async não quebra script

---

## 13. Resumo executivo

Os principais pontos em que o sistema falhou e exigiram ajuste foram:

1. tentativa de mutar bloco em `beforeEvents`;
2. duplicidade entre colocação nativa e script;
3. inconsistência de namespace e IDs;
4. falta de proteção contra jogador inválido em Promise;
5. ausência de trava contra formulário duplicado;
6. dependência rígida de APIs que nem sempre existem;
7. warning de schema/versão em block JSON;
8. necessidade de testes reais em servidor dedicado.

Se estas regras forem seguidas desde o começo, os próximos add-ons terão:
- menos retrabalho;
- menos bugs de runtime;
- debugging mais rápido;
- deploy mais previsível;
- compatibilidade melhor com Bedrock Dedicated Server.

---

## Referências oficiais úteis

- Scripting Execution Privilege
  - https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/execution-privilege?view=minecraft-bedrock-stable
- system.run Guide
  - https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/system-run-guide?view=minecraft-bedrock-stable
- Block Class (`setPermutation`)
  - https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/block?view=minecraft-bedrock-stable
- Entity Class (`isValid` / `InvalidEntityError`)
  - https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity?view=minecraft-bedrock-stable
- Block JSON File Structure
  - https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockjsonfilestructure?view=minecraft-bedrock-stable
- Block JSON Documentation
  - https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/?view=minecraft-bedrock-stable

