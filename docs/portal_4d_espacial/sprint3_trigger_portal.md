# Portal 4D Espacial — Sprint 3: trigger do portal por Script API

## Objetivo implementado
A Sprint 3 transforma o portal físico em uma interação jogável. O script assina `world.afterEvents.playerInteractWithBlock`, identifica a `sea_lantern` central da moldura e teleporta o jogador para o destino seguro preparado na Sprint 2.

## Validação do portal
Para evitar falso positivo em `sea_lantern` comum, a interação só é aceita quando o bloco possui assinatura estrutural do portal:

- bloco interagido é `minecraft:sea_lantern`;
- existe `minecraft:lodestone` dois blocos abaixo;
- existe `minecraft:purple_stained_glass` logo abaixo;
- a moldura próxima contém `minecraft:crying_obsidian` nas laterais/topo esperados.

## Fluxo de entrada
1. Jogador interage com a `sea_lantern` central do portal.
2. O script salva a dimensão e coordenada de origem do jogador para retorno na mesma sessão.
3. O destino preferencial é `portal4d:espaco_4d`, quando registrado e acessível.
4. Se a dimensão customizada não estiver disponível, o destino é a arena fallback no Overworld em `4096 96 4096`.
5. O jogador recebe mensagem curta reforçando que a experiência é uma simulação educativa de ideias 4D em um espaço 3D.

## Fluxo de retorno
Na arena 4D, o jogador pode interagir com o `lodestone` ou a `sea_lantern` de referência próximos ao centro para retornar ao ponto de origem salvo. Se a origem não existir na sessão atual, o script usa um retorno fallback seguro no Overworld.

## Diagnóstico
Todos os eventos relevantes usam prefixo `[Portal4D]` no log:

- registro do trigger;
- interação válida no portal;
- destino usado;
- falha de dimensão/teleporte;
- uso de fallback.

## Limites desta sprint
A Sprint 3 implementa entrada/saída e mensagens curtas. As salas educativas com projeção, fatias, rotação e coordenada `W` continuam planejadas para as próximas sprints.

## PNG/texturas
Nenhum arquivo `.png` foi criado ou alterado. O módulo segue usando blocos vanilla e arquivos texto versionáveis.
