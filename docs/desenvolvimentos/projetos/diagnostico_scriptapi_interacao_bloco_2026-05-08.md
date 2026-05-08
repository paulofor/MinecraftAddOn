# Diagnóstico Script API (interação com bloco)

Data: 2026-05-08

## Contexto
Jogador relatou que ao usar picareta em `minecraft:sea_lantern` "nada acontece".

## Verificação em referência oficial (Microsoft Learn)
- `PlayerInteractWithBlockAfterEvent`: dispara **após interação bem-sucedida** com bloco (uso/interação).  
  https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playerinteractwithblockafterevent?view=minecraft-bedrock-stable
- `PlayerBreakBlockAfterEvent`: evento para **quebra de bloco** (mineração).  
  https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playerbreakblockafterevent?view=minecraft-bedrock-stable
- `@minecraft/server-ui` (`ActionFormData`) pode falhar se o jogador estiver com outra UI aberta; tratar erro ajuda no diagnóstico em runtime.  
  https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-ui/actionformdata?view=minecraft-bedrock-stable

## Conclusão
Estávamos escutando apenas `playerInteractWithBlock`. Se o fluxo esperado for acionar também quando o jogador **quebra** o bloco-alvo, é necessário assinar `playerBreakBlock`.

## Ajuste aplicado
1. Mantido `playerInteractWithBlock`.
2. Adicionada assinatura de `playerBreakBlock` para os mesmos blocos gatilho (`sea_lantern` e `lectern`).
3. Adicionado `try/catch` em `form.show(player)` com log e mensagem amigável para facilitar investigação de falhas de UI.
