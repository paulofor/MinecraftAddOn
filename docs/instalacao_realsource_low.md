# Diagnóstico de instalação — RealSource LOW 1.8

## Estado verificado em 3 de agosto de 2026

O pacote mostrado na captura foi descompactado como
`/root/MinecraftServer/resource_packs/RealSource_LOW`. O `manifest.json` é
legível e declara o resource pack **Realistic Visuals 1.8 / LOW**, UUID
`e84ff511-bab3-4a4a-ad92-64ab325f8aaf`, versão `1.8.0` e capacidade `pbr`.

O mundo ativo é `/root/MinecraftServer/worlds/Bedrock level`. A inspeção
remota encontrou duas pendências:

1. inicialmente não existia `RealSource_LOW` em
   `worlds/Bedrock level/resource_packs`;
2. inicialmente `world_resource_packs.json` não continha o UUID do RealSource.

Após o deploy do MCP `0.16.0`, essas duas pendências foram corrigidas em
`2026-08-03`: `3.069` arquivos (`1.916` PNGs, `35.922.671` bytes) foram
instalados no pack do mundo, e o binding recebeu o UUID/versão `1.8.0`.

O log consultado termina somente com mensagens periódicas de
`AutoCompaction` e não mostra uma reinicialização posterior à cópia do pack.

Uma segunda inspeção confirmou que o pack global ocupa `43M`, há `24G` livres
no volume do servidor e `texturepack-required=true` já está ativo. A propriedade
`disable-client-vibrant-visuals=true` aparece apenas como comentário, portanto
o servidor não está configurado para bloquear o Vibrant Visuals.

O arquivo `README-USAGE_NOTICE.txt` incluído no próprio pack informa que o
autor não autoriza o uso das texturas, código ou configurações sem permissão e
fornece `martin@realsourcepack.com` como contato. Em `2026-08-03`, o operador
confirmou que possui a licença; portanto, essa condição está atendida.

## Por que isso aconteceu?

Copiar ou extrair um resource pack no diretório global apenas disponibiliza
seus arquivos ao servidor; isso não o associa automaticamente ao mundo já
existente. O Bedrock decide quais packs o mundo usa por meio de
`world_resource_packs.json`. Além disso, neste servidor os assets do mundo
ativo devem existir no pack localizado dentro do próprio mundo. Portanto, o
pack está **presente, mas ainda não instalado/ativado no mundo**. Reiniciar sem
corrigir essas duas pendências trataria somente o sintoma e não faria o mundo
selecionar o UUID.

## Procedimento seguro para concluir

1. Confirmar que a origem do arquivo é legítima e que a licença do RealSource
   permite seu uso no servidor. Não versionar o pack ou seus PNGs neste
   repositório.
2. Fazer backup de `/root/MinecraftServer/worlds/Bedrock level` antes de
   alterar a associação de packs. Este passo já foi realizado em
   `2026-08-03T17:35:34Z`; o arquivo está em
   `/root/MinecraftServer/backups/Bedrock-level-pre-realsource-low-1.8.tar.gz`
   e possui SHA-256
   `e7d22c685fadc62d0ac4ebfcc739250a9eff987fe10f308c1493be32a9ecb9e0`.
3. Publicar os PNGs exclusivamente pela tool MCP `write_png_base64`, mantendo
   exatamente a árvore relativa sob:

   ```text
   /root/MinecraftServer/worlds/Bedrock level/resource_packs/RealSource_LOW/
   ```

   Os arquivos texto do pack também precisam estar nesse diretório. Não usar
   workflow GitHub para copiar, validar ou diagnosticar os PNGs.
4. Acrescentar ao array de `world_resource_packs.json`, preservando todas as
   entradas atuais:

   ```json
   {
     "pack_id": "e84ff511-bab3-4a4a-ad92-64ab325f8aaf",
     "version": [1, 8, 0]
   }
   ```

5. Validar o JSON antes de reiniciar. Essa validação apenas confirma que o
   arquivo está bem formatado; ela não instala o pack:

   ```bash
   python3 -m json.tool '/root/MinecraftServer/worlds/Bedrock level/world_resource_packs.json' >/dev/null
   ```

6. Depois que o pack estiver copiado e associado ao mundo, reiniciar o Bedrock
   uma única vez e procurar no início do novo
   `logging/bedrock.log` o nome/UUID do pack e mensagens `ERROR` ou `WARN` de
   resource pack.
7. Entrar no mundo com um dispositivo em que a opção **Vibrant Visuals** esteja
   disponível e ligada. `PBR` é o conjunto de texturas que permite efeitos de
   material, como relevo, brilho e reflexão. O servidor seleciona/distribui o
   pack, mas é o Minecraft do jogador que desenha esses efeitos; em um aparelho
   sem suporte, o pack pode carregar sem apresentar o visual esperado.

## Como ligar o Vibrant Visuals

O **Vibrant Visuals não é colocado na pasta do servidor**. Ele é um modo
gráfico do Minecraft Bedrock no aparelho de cada jogador. Depois de instalar e
ativar o RealSource no mundo:

1. atualizar o Minecraft Bedrock pela loja do aparelho;
2. abrir o Minecraft e entrar em **Configurações**;
3. abrir **Vídeo**;
4. em **Modo gráfico**, selecionar **Vibrant Visuals**;
5. entrar no servidor e aceitar o download do resource pack, caso o Minecraft
   faça essa pergunta.

Os nomes podem aparecer em inglês como **Settings → Video → Graphics Mode →
Vibrant Visuals**. Se a opção não aparecer, não há outro arquivo para copiar no
servidor que possa criá-la: é necessário verificar atualização, suporte do
aparelho/placa de vídeo e disponibilidade desse modo na edição Bedrock usada
pelo jogador. O RealSource fornece os materiais PBR, mas não adiciona o modo
Vibrant Visuals ao cliente.

Para diagnosticar, registrar separadamente:

- plataforma do jogador (Windows, Android, iPhone/iPad, Xbox ou PlayStation);
- versão exibida na tela inicial do Minecraft;
- se **Vibrant Visuals** aparece em **Configurações → Vídeo**;
- se o servidor pediu para baixar o resource pack ao conectar.

## O que já foi feito e o que ainda não foi feito

- **Já foi feito:** leitura do manifesto, conferência das pastas/log/configuração,
  backup do mundo, simulação, cópia integral para o pack do mundo e associação
  em `world_resource_packs.json`.
- **Ainda não foi feito:** aceitar/baixar o pack ao conectar e validar o visual
  dentro do jogo.
- **Licença confirmada:** o operador declarou possuir licença para usar o pack
  no servidor.
- A expressão “reinício único” significa apenas que, **depois de concluir a
  instalação**, basta reiniciar uma vez para o Bedrock recarregar a lista de
  packs. Ela não afirma que o servidor já foi reiniciado.

## Limitações e próximo passo

O MCP disponível expõe upload de **um PNG em base64 por chamada**, mas não
oferece leitura binária do pack global, importação de diretório nem escrita
genérica de JSON. Embora os `43M` do pack já estejam no servidor, a sessão
atual consegue apenas lê-los como texto, o que não preserva PNGs. Copiar por
SSH também não é possível nesta sessão e mover os PNGs fora do MCP violaria a
regra do projeto. O backup e a licença estão prontos; agora é necessário
publicar uma operação MCP específica que importe o pack global para o mundo,
grave cada PNG pela mesma validação de `write_png_base64` e atualize o binding
de forma atômica. Só depois devem ocorrer reinício e validação.

Essa operação foi implementada no código como
`install_global_resource_pack`, com simulação obrigatória disponível por
`execute=false`, confirmação de licença, exigência de backup, validação do
manifesto, instalação por staging e atualização atômica do binding. Ela só
foi publicada no MCP `0.16.0` e concluiu a importação. A tool não pôde reiniciar
porque `BEDROCK_RESTART_CMD` não está configurado, mas o operador executou
`systemctl restart bedrock.service` diretamente no host. O serviço voltou
`active`, abriu `Bedrock level` e registrou `Server started` em
`2026-08-03 14:55:33`.

O log pós-restart não contém erro que cite `RealSource`, seu UUID ou resource
pack ausente. Ele mostra somente a pilha de Behavior Packs; portanto, esse
recorte não fornece confirmação positiva do carregamento do Resource Pack.
Como o diretório e o binding permanecem corretos após o restart, a confirmação
final agora é o cliente receber o download e exibir as texturas no mundo.

## Confirmação no cliente

Em `2026-08-03`, uma captura do cliente Windows confirmou a mensagem
**“Importação de ‘Realistic Visuals 1.8 / LOW’ bem-sucedida”** e o botão
**Visuais Vibrantes** selecionado em verde. Isso confirma que o cliente
reconheceu o pack e que o modo gráfico correto está ativo.

A preferência **Desempenho** permanece selecionada na captura. Ela é válida e
prioriza a taxa de quadros; para comparar a qualidade máxima, o operador pode
selecionar **Visuais** e voltar ao mundo. A etapa final é apenas observar blocos
vanilla no servidor e comparar relevo, brilho, água e iluminação. Se a taxa de
quadros cair, retornar para **Desempenho** sem reinstalar o pack.
