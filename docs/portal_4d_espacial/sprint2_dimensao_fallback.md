# Portal 4D Espacial — Sprint 2: dimensão customizada e fallback seguro

## Objetivo implementado
A Sprint 2 adiciona a infraestrutura de destino do módulo. O script tenta registrar a dimensão customizada `portal4d:espaco_4d` durante `system.beforeEvents.startup`, conforme a orientação oficial da Custom Dimension API, e mantém uma arena fallback segura no Overworld para ambientes sem Beta APIs.

## Decisão técnica
- **Caminho preferencial:** quando `event.dimensionRegistry.registerCustomDimension` estiver disponível, o script registra `portal4d:espaco_4d` no startup.
- **Fallback seguro:** quando a API não existir, não estiver habilitada ou lançar erro, o módulo continua carregando e usa a arena em `minecraft:overworld` nas coordenadas `4096 96 4096`.
- **Segurança do destino:** a rotina de script e a função `portal_4d/construir_arena_4d` constroem uma plataforma com base sólida, borda iluminada, espaço livre para o jogador, lectern/lodestone/sea_lantern de referência e logs de diagnóstico.

## Operação para teste
1. Ativar o BP/RP do módulo em um mundo de teste.
2. Executar `/function portal_4d/init` para ver instruções da Sprint 2.
3. Executar `/function portal_4d/construir_arena_4d` para reforçar a arena fallback no Overworld.
4. Conferir `bedrock.log` buscando mensagens com prefixo `[Portal4D]`.
5. Se o mundo estiver com Beta APIs e versão compatível, conferir se aparece o registro de `portal4d:espaco_4d`; caso contrário, confirmar a mensagem de fallback.

## Limite desta sprint
A Sprint 2 prepara e valida destinos seguros. A interação com o portal e o teleporte do jogador continuam reservados para a Sprint 3.

## PNG/texturas
Nenhum arquivo `.png` foi criado ou alterado. A entrega usa apenas blocos vanilla e arquivos texto versionáveis.
