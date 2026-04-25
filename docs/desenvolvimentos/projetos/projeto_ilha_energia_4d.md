# Projeto — Add-On Ilha 4D (x, y, z, e)

**Data de criação:** 2026-04-25 (UTC)
**Status inicial:** planejado
**Público-alvo:** jovens de 16 a 20 anos

---

## 1) Visão do projeto
Criar um Add-On educativo para Minecraft Bedrock que simula uma "quarta dimensão" chamada **energia (`e`)**.

No mundo do jogo, a dimensão física permanece 3D (`x`, `y`, `z`), mas o comportamento da ilha muda de acordo com o estado energético (`e`) de regiões, desafios e interações do jogador.

---

## 2) Objetivo pedagógico
Ensinar raciocínio lógico, causa e efeito e pensamento sistêmico por meio de mecânicas que relacionam:
- ações do jogador;
- variação de energia;
- transformação dinâmica do ambiente.

Resultados esperados:
- o jogador compreende que um mesmo espaço pode ter estados diferentes;
- o jogador aprende a otimizar ações para atingir metas energéticas;
- o jogador desenvolve noções de planejamento e experimentação.

---

## 3) Conceito técnico da quarta dimensão (`e`)
A dimensão `e` será representada por um **scoreboard** e/ou tags no Behavior Pack.

### Modelo inicial de energia
- faixa global por ilha: `0` a `100`;
- zonas locais: `0` a `20` por setor;
- limiares de estado:
  - `e <= 25`: estado **frio** (hostil/escasso);
  - `26 <= e <= 70`: estado **estável**;
  - `e > 70`: estado **radiante** (bônus/atalhos/eventos especiais).

### Ações que alteram `e`
- resolver puzzle: `+10`;
- plantar/recuperar área: `+2`;
- ativar mecanismo incorreto: `-5`;
- tempo sem manutenção: `-1` por ciclo.

---

## 4) Escopo do MVP

### Incluído
1. Hub da Ilha 4D com painel de energia.
2. 3 desafios iniciais (Entrada, Núcleo e Torre).
3. Sistema de estados visuais por energia (texto, partículas e iluminação básica).
4. Condição de vitória: manter `e >= 70` por período definido.
5. Documentação de execução e validação local.

### Não incluído no MVP
- multiplayer competitivo com ranking;
- persistência avançada entre múltiplos mundos;
- narrativa cinematográfica completa.

---

## 5) Arquitetura proposta

## 5.1 Behavior Pack (BP_IlhaEnergia4D)
Estrutura inicial sugerida:

```text
packs/BP_IlhaEnergia4D/
├── manifest.json
├── functions/ilha_energia/
│   ├── init.mcfunction
│   ├── reset.mcfunction
│   ├── tick.mcfunction
│   ├── status.mcfunction
│   └── modulos/
│       ├── entrada_ok.mcfunction
│       ├── entrada_fail.mcfunction
│       ├── nucleo_ok.mcfunction
│       ├── nucleo_fail.mcfunction
│       ├── torre_ok.mcfunction
│       └── torre_fail.mcfunction
└── scripts/
    └── main.js
```

## 5.2 Resource Pack (RP_IlhaEnergia4D)
Estrutura inicial sugerida:

```text
packs/RP_IlhaEnergia4D/
├── manifest.json
├── texts/en_US.lang
├── textures/
│   ├── blocks/
│   └── ui/
└── blocks.json
```

---

## 6) Plano de execução por sprint

## Sprint 0 — Fundação
- criar manifests BP/RP;
- criar scoreboards base (`energia_global`, `energia_zona`);
- implementar `init`, `reset`, `status`.

**Critério de aceite:** comandos executam sem erro e scoreboards aparecem corretamente.

**Registro pós-conclusão (preencher ao finalizar):**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

## Sprint 1 — Loop de energia
- implementar cálculo de energia por eventos;
- criar feedback visual mínimo por estado;
- disponibilizar comando de diagnóstico para equipe.

**Critério de aceite:** transição consistente entre estados frio/estável/radiante.

**Registro pós-conclusão (preencher ao finalizar):**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

## Sprint 2 — Conteúdo educativo
- adicionar 3 desafios com acerto/erro;
- ajustar balanceamento de ganho/perda de energia;
- validar experiência com sessão guiada.

**Critério de aceite:** jogador conclui trilha completa com objetivo pedagógico claro.

**Registro pós-conclusão (preencher ao finalizar):**
- O que foi feito:
- O que ficou faltando:
- Impedimentos/bloqueios:

---

## 7) Definição de pronto (DoD)
Uma entrega será considerada pronta quando:
1. funcionar no Bedrock sem erro crítico em log;
2. tiver validação básica em jogo;
3. tiver documentação atualizada;
4. mantiver consistência com objetivo educativo (16–20 anos).

---

## 8) Riscos e mitigação
- **Risco:** energia ficar confusa para o jogador.  
  **Mitigação:** painéis visuais e mensagens curtas por estado.
- **Risco:** dificuldade muito alta no início.  
  **Mitigação:** progressão gradual e tutoriais contextuais.
- **Risco:** excesso de comandos por tick.  
  **Mitigação:** otimizar funções e limitar verificações por zona.

---

## 9) Próximos passos imediatos
1. Criar packs `BP_IlhaEnergia4D` e `RP_IlhaEnergia4D` com `manifest.json` inicial.
2. Implementar `init.mcfunction`, `reset.mcfunction` e `status.mcfunction`.
3. Definir tabela canônica de variação de `e` por ação.
4. Rodar validação local dos manifests e estrutura.

---

## 10) Registro de data
Este projeto foi aberto em **2026-04-25 (UTC)**, correspondente à data atual desta sessão.
