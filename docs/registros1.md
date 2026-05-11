# Registros 

> Orientação: todos os registros deste documento devem sempre incluir **data e hora no fuso UTC-3**.
> Neste documento segue política de **append-only** (não pode ter nenhuma linha apagada; apenas inserções).

> Regra obrigatória de timestamp:
> Antes de adicionar qualquer novo registro, execute obrigatoriamente:
>
> ```bash
> TZ=America/Sao_Paulo date '+%Y-%m-%d %H:%M:%S UTC-3'
> ```
>
> Use exatamente a saída desse comando no título do novo registro.
> É proibido inventar, estimar, inferir ou reaproveitar data/hora a partir de:
> - contexto da conversa;
> - data do commit;
> - data do CI/build;
> - metadados do arquivo;
> - relógio UTC sem conversão explícita;
> - registros anteriores deste documento.
>
> O formato obrigatório do título é:
>
> ```md
> ## YYYY-MM-DD HH:mm:ss UTC-3
> ```
>
> Cada novo registro deve ser adicionado no final do arquivo.
> Se for necessário registrar mais de uma entrada, execute novamente o comando de data/hora para cada entrada.
> Nunca crie registro com timestamp futuro em relação ao horário atual de `America/Sao_Paulo`.
> Em caso de timestamp incorreto já registrado, não apague nem edite o registro antigo; adicione um novo registro de correção explicando o erro.
> Neste documento segue política de **append-only** (não pode ter nenhuma linha apagada; apenas inserções).


## 2026-05-11 11:40:30 UTC-3
- Investigação do barco de 3 lugares com textura rosa/magenta.
- Consulta à documentação oficial da Microsoft Learn (MCP Server Microsoft) para validar configuração correta de textura em `minecraft:client_entity` (uso de `description.textures` com caminho relativo sem extensão e correspondência com `render_controllers`).
- Correção aplicada: arquivo `packs/RP_Barco3Jogadores/textures/entity/barco_3_jogadores.png` estava como ponteiro Git LFS (texto) e não PNG válido; foi substituído por PNG válido para eliminar fallback magenta.
- Versionamento atualizado no `manifest.json` do RP Barco 3 Jogadores de `0.1.4` para `0.1.5` para rastreabilidade de objeto visual.

## 2026-05-11 11:45:27 UTC-3
- Ajuste complementar após revisão: substituição da textura temporária por textura oficial de referência (`boat_oak.png`) do repositório oficial Mojang Bedrock Samples (Microsoft/Mojang).
- Objetivo: garantir UV/layout fiel ao modelo de barco e evitar desalinhamentos visuais.
- Versionamento do RP Barco 3 Jogadores atualizado de `0.1.5` para `0.1.6` (header e module) por alteração de objeto visual.
