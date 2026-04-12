# AGENTS_VERSIONING.md

## REGRA OBRIGATÓRIA: NÃO INVENTAR VERSÕES

Ao editar add-ons Bedrock, **NUNCA** trocar versões “no chute”, “para ficar mais moderno”, “para combinar com outro arquivo” ou “porque parece antigo”.

Se a versão atual do arquivo não foi confirmada pela documentação oficial da Mojang/Microsoft para aquele **tipo exato de arquivo**, **não altere**.

---

## 1) MANIFEST NÃO É A MESMA COISA QUE JSON DE BLOCO/ITEM

Estas versões são diferentes e **não podem ser misturadas**:

- `manifest.json -> format_version`
- `manifest.json -> header.version`
- `manifest.json -> modules[].version`
- `manifest.json -> dependencies[].version`
- `manifest.json -> min_engine_version`
- `blocks/*.json -> format_version`
- `items/*.json -> format_version`
- `recipes/*.json -> format_version`
- `spawn_rules/*.json -> format_version`

**Proibido** copiar a versão de um lugar para outro sem confirmar a regra oficial.

---

## 2) REGRA FIXA PARA MANIFEST

Para packs modernos, usar:

```json
"format_version": 2
```

Não trocar para 1, 3 ou outro valor sem necessidade documentada.

---

## 3) REGRA FIXA PARA ARQUIVOS DE CONTEÚDO DA BEHAVIOR PACK

Para estes diretórios da Behavior Pack:

- `blocks/`
- `items/`
- `recipes/`
- `spawn_rules/`

seguir a política oficial **N-1**.

Isso significa:

- usar `format_version` **recente**;
- não usar versão herdada de tutorial antigo sem validar;
- não deixar arquivo de bloco/item preso em versão antiga só porque “funciona”.

---

## 4) REGRA OPERACIONAL PARA O MODELO

Antes de alterar qualquer versão, faça nesta ordem:

1. Identifique o tipo exato do arquivo.
2. Consulte a documentação oficial daquele tipo.
3. Confirme se existe regra específica de versão mínima.
4. Só então altere a versão.

Se não houver confirmação oficial, **mantenha a versão atual e reporte dúvida**.

---

## 5) PROIBIÇÕES EXPLÍCITAS

O modelo **NÃO PODE**:

- inventar `format_version` “mais nova” sem fonte;
- alinhar todos os JSONs para a mesma versão por estética;
- copiar a versão do `manifest.json` para `blocks/*.json`;
- copiar a versão de `blocks/*.json` para `items/*.json` sem checar;
- trocar `header.version` porque mudou `format_version`;
- trocar `min_engine_version` sem motivo técnico claro;
- alterar `dependencies[].version` sem necessidade real de vínculo entre packs.

---

## 6) REGRA PRÁTICA PARA ESTE PROJETO

Se aparecer erro como:

```text
Unexpected version for the loaded data
```

faça isto:

1. localizar o arquivo exato do erro;
2. verificar o `format_version` daquele arquivo;
3. conferir a regra oficial para aquele tipo de arquivo;
4. ajustar **somente** o arquivo afetado;
5. não sair alterando todos os outros JSONs.

---

## 7) REGRA DE RELEASE

Se houver warning ou error de versão/schema no boot do servidor, o release fica bloqueado até corrigir.

Exemplos:

- `Unexpected version for the loaded data`
- erro de schema de bloco, item ou recipe
- incompatibilidade entre manifest e min_engine_version

---

## 8) PADRÃO DE RESPOSTA ESPERADO DO MODELO

Quando precisar mexer em versão, responda assim:

- qual arquivo será alterado;
- qual campo será alterado;
- por que a documentação permite essa alteração;
- por que os outros arquivos **não** serão alterados.

Se não conseguir justificar os 4 pontos acima, **não altere versões**.

---

## 9) RESUMO CURTO

- `manifest.json` moderno: `format_version = 2`
- `blocks/items/recipes/spawn_rules`: seguir regra oficial **N-1**
- nunca padronizar versões “na mão”
- nunca alterar vários arquivos sem necessidade
- warning de versão no boot bloqueia release

