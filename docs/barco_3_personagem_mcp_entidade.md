# Guia prático — Barco 3 Personagem + envio de PNG via MCP (textura de entidade)

Este documento mostra como criar um **objeto com textura de entidade** usando o exemplo do **Barco 3 Jogadores** e como publicar o `.png` **direto no mundo** via MCP Server.

---

## 1) Conceito rápido: entidade vs item

## Item (RP)
- Normalmente usa mapeamento em `textures/item_texture.json`.
- O item aponta para uma textura 2D (ícone/inventário) via chave, por exemplo `"textures": "textures/items/goo"`.
- Fluxo principal: `item_texture.json` + PNG em `textures/items/...`.

## Entidade (RP)
- Não usa `item_texture.json` para textura principal do modelo.
- A textura vem do `client_entity` em `entity/*.entity.json`, no bloco `description.textures`.
- O modelo 3D (geometria) e render controller definem como essa textura é aplicada no mesh.
- Fluxo principal: `entity/*.entity.json` + `models/entity/*.geo.json` + `render_controllers/*.json` + PNG em `textures/entity/...`.

**Resumo da diferença:**
- **Item** = textura 2D por atlas de item.
- **Entidade** = textura 2D aplicada em modelo 3D via client entity + geometry/render controller.

---

## 2) Exemplo real do Barco 3 Jogadores (entidade)

Referências no projeto:
- RP client entity: `packs/RP_Barco3Jogadores/entity/barco_3_jogadores.entity.json`
- RP geometry: `packs/RP_Barco3Jogadores/models/entity/barco_3_jogadores.geo.json`
- RP render controller: `packs/RP_Barco3Jogadores/render_controllers/barco_3_jogadores.render_controllers.json`
- PNG (origem local): `packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png`
- BP entidade: `packs/BP_Barco3Jogadores/entities/barco_3_jogadores.json`

Lookup de textura de entidade (conceito):
- No `client_entity`, usar algo como:
  - `"textures": { "default": "textures/entity/barco_3_jogadores" }`
- Esse caminho **não inclui extensão** `.png`.
- O arquivo esperado é `textures/entity/barco_3_jogadores.png` no pack ativo do mundo.

---

## 3) Forma correta de montar as texturas de entidade

## Estrutura recomendada
- `textures/entity/nome_da_entidade.png`
- Dimensões comuns: `64x64`, `128x64` ou conforme UV do `.geo.json`.
- O UV do modelo (`.geo.json`) deve casar com o layout da imagem.

## Checklist de montagem
1. Defina o layout UV no `.geo.json` (faces, offsets, dimensões).
2. Monte o PNG respeitando exatamente esse UV.
3. No `client_entity`, aponte `description.textures.default` para o caminho relativo sem `.png`.
4. No render controller, garanta que `Array.skins[0]`/slot de textura usa a textura default.
5. Teste no mundo; se aparecer preto/roxo, validar caminho, nome do arquivo e presença do PNG no pack **do mundo**.

## Dica prática
- Se você reutilizar textura vanilla como base (ex.: `boat_oak`), mantenha as mesmas proporções UV para evitar distorções.

---

## 4) Envio do PNG direto para o mundo via MCP Server (obrigatório)

> Regra do projeto: não commitar PNG no Git. Publicar textura por MCP `write_png_base64`.

## 4.1 Validar ferramentas MCP
```bash
curl -sS -X POST 'http://186.202.209.206/mcp' \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## 4.2 Converter PNG local para base64
```bash
base64 -w 0 packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png > /tmp/barco3.b64
```

## 4.3 Upload para o pack do mundo (prioritário)
Exemplo de destino (mundo ativo):
`/root/MinecraftServer/worlds/Bedrock level/resource_packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png`

```bash
B64=$(cat /tmp/barco3.b64)
curl -sS -X POST 'http://186.202.209.206/mcp' \
  -H 'Content-Type: application/json' \
  --data "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"tools/call\",\"params\":{\"name\":\"write_png_base64\",\"arguments\":{\"path\":\"/root/MinecraftServer/worlds/Bedrock level/resource_packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png\",\"png_base64\":\"$B64\",\"overwrite\":true}}}"
```

## 4.4 Validar persistência no host
```bash
curl -sS -X POST 'http://186.202.209.206/mcp' \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_directory","arguments":{"path":"/root/MinecraftServer/worlds/Bedrock level/resource_packs/RP_Barco3Jogadores/textures/entity"}}}'
```

Esperado:
- resposta de sucesso com `bytes_written` no upload;
- arquivo presente no diretório remoto do mundo.

---

## 5) Erros comuns e como evitar

- **Preto/roxo (missing texture):**
  - caminho incorreto em `description.textures`;
  - PNG ausente no pack do **mundo**;
  - nome do arquivo diferente do lookup.

- **Textura torta/desalinhada:**
  - UV do `.geo.json` não bate com layout do PNG.

- **Deploy sobrescrevendo textura:**
  - processo externo copiando arquivo errado para o mundo.
  - manter PNG como ciclo MCP-only.

---

## 6) Passo a passo mínimo para criar novo objeto com textura de entidade

1. Criar BP da entidade (`BP_.../entities/...json`).
2. Criar RP do client entity (`RP_.../entity/...entity.json`).
3. Criar geometry (`RP_.../models/entity/...geo.json`).
4. Criar render controller (`RP_.../render_controllers/...json`).
5. Criar PNG da entidade em `textures/entity/...png` (local de trabalho).
6. Fazer upload do PNG via MCP para `worlds/<mundo>/resource_packs/<RP>/textures/entity/...png`.
7. Validar no jogo e no log, ajustando UV/render se necessário.

---

## 7) Diretriz canônica atualizada — Barco de 3 lugares não deve ser tratado como “ser vivo”

Com base na documentação oficial da Microsoft Learn (consultada via biblioteca/MCP), o uso de `minecraft:rideable` existe no ecossistema de **entidades** para tornar um objeto montável, mas isso **não obriga** que o design pedagógico trate o barco como “ser vivo”.

Para este projeto, a decisão canônica é:
- o **barco de 3 lugares é um veículo/objeto interativo**;
- a entidade deve ser usada apenas como **suporte técnico de montaria/física**, sem IA/atributos de criatura;
- a experiência do jogador deve começar por **item de invocação/colocação** (inventário) usando componente de item apropriado para colocar a entidade no mundo.

### Fundamentos oficiais usados na decisão
- `minecraft:rideable` adiciona capacidade de montar uma entidade e controlar assento (`controlling_seat`) — isso descreve mecânica de montaria, não classificação pedagógica como ser vivo.
- Em itens, `minecraft:entity_placer` é o componente oficial para um item colocar entidade no mundo.

### Padrão recomendado para o módulo Barco 3 Lugares
1. Manter a entidade técnica do barco (sem comportamentos de mob vivo desnecessários).
2. Expor ao jogador um item de colocação (spawn/placer) com nomenclatura de veículo.
3. Documentar o barco como **objeto de mobilidade** em todos os materiais didáticos e técnicos.
4. Evitar linguagem de “criatura”, “mob vivo”, “animal” ou similares para esse módulo.

### Critérios de revisão (checklist)
- [ ] O item de inventário do barco usa componente de colocação de entidade.
- [ ] A entidade não possui metas/IA de ser vivo que não sejam necessárias ao veículo.
- [ ] Textos de UI/documentação classificam o barco como veículo/objeto.
- [ ] Assento de controle (`controlling_seat`) permanece explícito e validado.

---

## 8) Navegabilidade — além de `max_turn`, o que mais influencia a pilotagem

Para o barco de 3 lugares (entidade montável), a pilotagem depende de um conjunto de componentes e propriedades, não apenas de `max_turn`.

### Atributos principais de controle de movimento (`minecraft:input_ground_controlled`)
- `move_speed`: velocidade base de deslocamento do veículo.
- `forward_movement_modifier`: multiplicador da velocidade ao avançar.
- `backward_movement_modifier`: multiplicador da velocidade em ré.
- `side_movement_modifier`: intensidade de movimento lateral (strafe) quando houver input lateral.
- `max_turn`: limite de curva/rotação durante o controle.

### Atributos de montaria que impactam controle (`minecraft:rideable`)
- `controlling_seat`: define qual assento controla o veículo.
- `seat_count` e `seats[]`: distribuição de assentos pode afetar percepção de controle e ocupação.
- `pull_in_entities`: influencia facilidade de embarque no assento.
- `passenger_max_width`: restringe quais passageiros conseguem montar.

### Atributos físicos que alteram “sensação” de pilotagem
- `minecraft:buoyant.base_buoyancy`, `apply_gravity`, `simulate_waves`: alteram resposta na água.
- `minecraft:physics.has_gravity` e `has_collision`: alteram interação com terreno/obstáculos.
- `minecraft:collision_box` (largura/altura): muda colisão, passagem e percepção de estabilidade.

### Diretriz prática para tuning do barco
1. Ajustar primeiro `controlling_seat` e `seats` (garantir piloto correto).
2. Em seguida calibrar `max_turn` + `move_speed` (curva vs resposta).
3. Só depois ajustar `forward/backward/side_movement_modifier`.
4. Finalizar com ajustes de flutuação (`buoyant`) para comportamento em água.
