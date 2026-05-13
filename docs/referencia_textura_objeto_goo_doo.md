# Referência prática — como construir as referências de textura de um objeto (exemplo `goo_doo`/`digicomo:goo`)

Este documento usa o exemplo do item **Goo** (`digicomo:goo`) para mostrar, de forma detalhada, como montar corretamente as referências de textura de um objeto em Add-On Bedrock.

## 1) Visão geral do encadeamento de referência

Para um item customizado funcionar com textura, três peças precisam se conectar:

1. **Definição do item (BP)** define o ícone lógico (`minecraft:icon`).
2. **Atlas de textura (RP)** mapeia esse ícone para um caminho (`textures/...`).
3. **Arquivo PNG final** deve existir exatamente no caminho físico esperado.

No exemplo Goo:

- item: `digicomo:goo`
- ícone lógico: `goo_item`
- mapeamento: `goo_item -> textures/items/goo`
- arquivo esperado: `textures/items/goo.png`

---

## 2) Passo a passo com os arquivos reais do projeto

### 2.1 Definir o item no Behavior Pack (BP)

Arquivo:

- `packs/BP_GooDemo/items/goo.json`

Campos essenciais:

- `description.identifier`: nome completo do item (ex.: `digicomo:goo`)
- `components.minecraft:icon`: chave do ícone (ex.: `goo_item`)

> Regra prática: o valor de `minecraft:icon` **não é caminho de arquivo**; ele é uma **chave** que será resolvida no `item_texture.json`.

### 2.2 Mapear a chave no Resource Pack (RP)

Arquivo:

- `packs/RP_GooDemo/textures/item_texture.json`

Estrutura esperada:

- seção `texture_data`
- entrada com a mesma chave usada no BP (`goo_item`)
- propriedade `textures` apontando para caminho sem extensão (`textures/items/goo`)

> Regra prática: o caminho em `textures` deve ser relativo à pasta `textures/` do RP e normalmente sem `.png`.

### 2.3 Garantir o arquivo PNG no caminho físico correto

Arquivo esperado pela referência acima:

- `textures/items/goo.png`

No contexto deste projeto, para mundos ativos, o arquivo deve existir no pack do mundo:

- `/root/MinecraftServer/worlds/Bedrock level/resource_packs/RP_GooDemo/textures/items/goo.png`

> Importante: ter o PNG apenas no caminho global (`/root/MinecraftServer/resource_packs/...`) pode não resolver para o mundo ativo.

---

## 3) Checklist de validação rápida (anti preto/roxo)

Quando a textura falhar, valide nesta ordem:

1. O item usa `minecraft:icon` com a chave correta? (`goo_item`)
2. O `item_texture.json` contém exatamente essa mesma chave?
3. O `textures` aponta para o path correto? (`textures/items/goo`)
4. O PNG existe no caminho final correspondente? (`.../textures/items/goo.png`)
5. O nome do arquivo (maiúsculas/minúsculas) bate exatamente com a referência?
6. O RP/BP ativo no mundo é o mesmo que você editou?

---

## 4) Padrão para criar novas texturas de objetos

Use este modelo para qualquer item novo:

1. Criar item no BP com `minecraft:icon: "<chave_icone>"`.
2. Em `item_texture.json`, criar:
   - `"<chave_icone>": { "textures": "textures/items/<nome_textura>" }`
3. Publicar o PNG como:
   - `.../textures/items/<nome_textura>.png`
4. Manter consistência de nomes entre BP, RP e arquivo físico.

Exemplo genérico:

- `minecraft:icon = "energia_item"`
- `item_texture.json -> "energia_item": { "textures": "textures/items/energia" }`
- arquivo: `textures/items/energia.png`

---

## 5) Regra operacional deste repositório (PNG)

Conforme diretriz do projeto:

- arquivos `.png` **não devem ser commitados** no Git;
- publicação de PNG deve ocorrer via MCP (upload para o host);
- no Git ficam apenas arquivos texto (JSON, scripts, manifests, etc.).

Por isso, neste caso Goo, o código versionado define a referência (`goo_item` e `textures/items/goo`) e o PNG é tratado no fluxo de publicação via MCP.
