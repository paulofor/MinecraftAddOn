# Execução da Sprint 0 — Ilha de Lógica e Computação

## Status
- Status geral: `concluido`
- Data de fechamento (UTC): 2026-04-23
- Responsável: Codex (GPT-5.3-Codex)

## Entrega 1 — Estrutura de pastas canônica (BP/RP)

### Behavior Pack (BP)
```text
packs/BP_IlhaLogicaComputacao/
├── manifest.json
├── functions/
│   └── ilha_logica/
│       ├── init.mcfunction
│       ├── reset.mcfunction
│       └── diagnostico.mcfunction
├── scripts/
├── entities/
├── items/
└── blocks/
```

### Resource Pack (RP)
```text
packs/RP_IlhaLogicaComputacao/
├── manifest.json
├── textures/
└── texts/
    └── en_US.lang
```

## Entrega 2 — Definição formal das fases do MVP

| Fase | Nome didático | Conceito principal | Critério de sucesso | Evidência de progresso |
|---|---|---|---|---|
| Hub | Boas-vindas e orientação | Navegação da trilha | Jogador recebe instrução inicial | `ilhlog_progresso=0` |
| A | Pertinência (`∈` / `∉`) | Identificar elemento pertencente | >= 1 acerto na tarefa de pertinência | tag `ilhlog_fase_a` |
| B | Subconjuntos (`⊆`) | Comparar relação entre conjuntos | Resolver comparação entre 2 conjuntos | tag `ilhlog_fase_b` |
| C | Operações (`∪`, `∩`, `\\`) | Compor união/interseção/diferença | Resolver 1 puzzle por operação | tag `ilhlog_fase_c` |
| D | Produto cartesiano (`A×B`) | Formar pares ordenados | Completar grade de pares válidos | tag `ilhlog_fase_d` |
| Final | Desbloqueio e revisão | Consolidação dos conceitos | 4 fases concluídas e checkpoint final | `ilhlog_progresso=4` |

## Entrega 3 — Checklist canônico de validação

### Checklist de pré-teste
- [ ] BP e RP presentes no mundo alvo.
- [ ] Vínculos `world_behavior_packs.json` e `world_resource_packs.json` atualizados.
- [ ] Servidor reiniciado após publicação dos packs.

### Comandos mínimos de validação in-game (operador)
1. Inicializar trilha:
   - `/function ilha_logica/init`
2. Diagnóstico:
   - `/function ilha_logica/diagnostico`
3. Reset de sessão:
   - `/function ilha_logica/reset`
4. Verificar objetivos:
   - `/scoreboard objectives list`
5. Verificar progresso de um jogador:
   - `/scoreboard players list @s`

## Entrega 4 — Critérios de aceite por fase (Sprint 1 ready)

### Critério transversal (todas as fases)
- instrução didática exibida;
- validação de acerto/erro executada;
- registro de progresso em scoreboard/tag;
- ausência de erro crítico em log de servidor.

### Critérios por fase
- **Hub:** jogador entende rota e entra na Fase A sem intervenção administrativa.
- **Fase A:** identifica pertinência com feedback correto de acerto/erro.
- **Fase B:** diferencia subconjunto válido e inválido.
- **Fase C:** resolve ao menos um cenário de união, interseção e diferença.
- **Fase D:** monta pares ordenados corretos de `A×B`.
- **Final:** desbloqueio liberado somente com fases A–D completas.

## Evidências de execução (repositório)
- `packs/BP_IlhaLogicaComputacao/manifest.json`
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/init.mcfunction`
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/reset.mcfunction`
- `packs/BP_IlhaLogicaComputacao/functions/ilha_logica/diagnostico.mcfunction`
- `packs/RP_IlhaLogicaComputacao/manifest.json`
- `docs/desenvolvimentos/projetos/plano_canonico_ilha_logica_computacao_pos_sprint.md`
