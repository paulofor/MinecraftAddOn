# Academia Arcana Monumental — Sprint 6: Arquivo Proibido Subterrâneo e desafio final

## Objetivo
Adicionar a camada subterrânea da Academia Arcana Monumental, criando uma mudança clara de clima, uma síntese jogável dos conceitos apresentados nas torres e uma conclusão segura para a primeira versão da construção.

## Arquivos alterados
- `packs/BP_AcademiaArcanaMonumental/functions/academia_arcana_monumental/arquivo_proibido_sprint6.mcfunction`
- `packs/BP_AcademiaArcanaMonumental/functions/academia_arcana_monumental/montar_completa.mcfunction`
- `packs/BP_AcademiaArcanaMonumental/manifest.json`
- `packs/RP_AcademiaArcanaMonumental/manifest.json`
- `docs/academia_arcana_monumental_plano.md`
- `docs/registros1.md`

## Entregas realizadas

### 1. Entrada subterrânea
A entrada do Arquivo Proibido foi posicionada como uma transição entre o pátio central e a Biblioteca Infinita, com corredor de deepslate, lectern de orientação, iluminação e escada vertical por ladder.

### 2. Galeria de descida
A galeria usa tuff, polished deepslate, soul lanterns e chiseled deepslate para mudar gradualmente o clima da academia para uma área mais antiga e misteriosa, sem parecer desconectada do campus.

### 3. Sala dos Arquivos Perdidos
A sala apresenta prateleiras, mesas, lecterns, blocos coloridos e lâmpadas para reforçar narrativa ambiental e recuperar visualmente os conceitos das torres anteriores: sequência, observação, lógica e estados.

### 4. Corredor dos Mecanismos Antigos
O corredor cria uma leitura de causa/consequência com materiais de energia, cobre, lapis, emerald, target, lightning rod, cauldron e porta simbólica com lever.

### 5. Desafio Final — Câmara do Selo
A câmara final combina:
- sequência por blocos coloridos;
- lógica por ordem de lecterns e indicadores;
- observação por alinhamento espacial;
- causa/consequência por progressão até beacon e bell.

O desafio foi planejado para ser compreensível sem conhecimento externo e sem script obrigatório nesta etapa.

### 6. Câmara de conclusão e retorno
A área final inclui beacon, lectern, baús simbólicos, ender chest, gancho visual para expansão futura e um atalho vertical por ladder até a superfície, garantindo retorno seguro ao campus.

## Como executar
No centro escolhido para o Pátio das Casas Arcanas, em área livre de mundo de teste:

```mcfunction
/function academia_arcana_monumental/arquivo_proibido_sprint6
```

Para montar a academia completa até a Sprint 6:

```mcfunction
/function academia_arcana_monumental/montar_completa
```

## Critérios de aceite cobertos
- O subsolo muda o clima da academia com blocos escuros, iluminação baixa e salas antigas.
- O desafio final reaproveita conceitos das torres sem exigir conhecimento externo.
- O jogador recebe uma câmara de conclusão e um atalho de retorno por ladder para voltar ao campus com segurança.

## Validação recomendada em jogo
1. Executar a montagem em mundo de teste e confirmar que a entrada subterrânea está acessível.
2. Percorrer a galeria, a sala dos arquivos, o corredor de mecanismos e a câmara final.
3. Conferir se a navegação é legível sem comandos administrativos após a montagem.
4. Validar se o atalho de retorno não prende o jogador e retorna próximo ao campus.
5. Ajustar escala e iluminação após playtest, se necessário.

## Observações técnicas
- Nenhuma textura PNG foi criada ou alterada.
- A entrega usa apenas blocos vanilla e função `.mcfunction` versionada.
- Como o módulo possui BP/RP pareados, os dois manifests foram incrementados para `0.1.8`.
