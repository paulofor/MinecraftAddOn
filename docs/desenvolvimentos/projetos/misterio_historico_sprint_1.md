# Mistério Histórico — Sprint 1

## Status
Sprint 1 implementada como protótipo jogável de baixo risco, sem programação obrigatória. Esta etapa define como montar a missão no mundo usando blocos vanilla, placas, livros, baús, botões/alavancas e comandos simples opcionais em command blocks.

## Objetivo da Sprint 1
Validar se a aventura é divertida, compreensível e educativa antes de criar Behavior Pack, scripts, itens customizados ou texturas.

## Entrega da Sprint 1
Um protótipo físico da aventura **Mistério Histórico: A Cidade das Três Versões** com:

1. acampamento inicial;
2. praça central;
3. cisternas e canais;
4. arquivo/templo;
5. casa de manutenção;
6. câmara do conselho;
7. sala final de argumentação;
8. 9 pistas distribuídas no mundo;
9. teste manual completo para validar percurso, tempo e debate.

## Mapa mínimo recomendado

### Área 1 — Acampamento dos Investigadores
**Função:** apresentar a missão e orientar os jogadores.

**Elementos:**
- 1 placa de boas-vindas;
- 1 baú com livros vazios ou papel para anotações;
- 1 placa com a pergunta central;
- 1 caminho visível para a praça central.

**Texto sugerido da placa principal:**

```text
Mistério Histórico:
Por que Arandu foi abandonada?
Explore as ruínas, compare pistas e defenda sua conclusão.
```

### Área 2 — Praça Central
**Função:** apresentar o conflito social e político.

**Elementos:**
- fonte seca ou parcialmente quebrada;
- mural de avisos;
- placa pública com convocação de assembleia;
- acesso para arquivo/templo e cisternas.

**Pista instalada:** P3 — Placa pública.

### Área 3 — Cisternas e Canais
**Função:** apresentar indícios ambientais e técnicos.

**Elementos:**
- 3 reservatórios vazios;
- canal bloqueado por cascalho, pedra ou escombros;
- água acumulada de um lado do canal;
- sinais visuais de reparo recente, como andaimes, escadas ou blocos diferentes.

**Pistas instaladas:** P2 e P6.

### Área 4 — Arquivo/Templo
**Função:** concentrar fontes escritas que exigem interpretação.

**Elementos:**
- estantes;
- púlpito ou baús com livros;
- sala silenciosa para leitura;
- uma placa pedindo que jogadores comparem documentos.

**Pistas instaladas:** P4 e P7.

### Área 5 — Casa de Manutenção
**Função:** apresentar a suspeita de falha técnica.

**Elementos:**
- bancada de trabalho;
- alavanca em uma moldura ou baú;
- corredor para canais;
- placa com alerta de manutenção incompleta.

**Pista instalada:** P5.

### Área 6 — Câmara do Conselho
**Função:** revelar que houve evacuação planejada e decisões coletivas.

**Elementos:**
- mesa central;
- mapas em molduras ou baú;
- três rotas representadas com blocos coloridos;
- placa com pergunta: “Eles fugiram, migraram ou foram obrigados a sair?”.

**Pista instalada:** P8.

### Área 7 — Sala das Três Versões
**Função:** encerrar a missão por argumentação.

**Elementos:**
- 3 espaços marcados para hipóteses A, B e C;
- mural de síntese;
- placas com perguntas finais;
- botões ou alavancas opcionais para indicar a escolha dos jogadores.

**Pista instalada:** P9.

## Distribuição das pistas

| ID | Área | Implementação vanilla | Texto/ação sugerida |
| --- | --- | --- | --- |
| P1 | Acampamento inicial | Livro em baú | Diário relata racionamento de água e medo de abandonar Arandu. |
| P2 | Cisternas | Construção visual | Três cisternas vazias com blocos de reparo recente. |
| P3 | Praça central | Placa pública | Assembleia sobre uso das reservas e prioridades da cidade. |
| P4 | Arquivo/templo | Livro em púlpito | Ata incompleta com votos divergentes sobre mineração e irrigação. |
| P5 | Casa de manutenção | Alavanca renomeada ou em moldura | “Chave de comporta quebrada”. |
| P6 | Canal subterrâneo | Cenário | Canal bloqueado, água represada e lado seco. |
| P7 | Torre/arquivo | Livro ou placa | Registro menciona chuva suficiente apesar das cisternas vazias. |
| P8 | Câmara do conselho | Mapas em baú/moldura | Rotas de migração planejadas. |
| P9 | Sala final | Mural | Espaço para comparar evidências e defender conclusão. |

## Textos prontos para livros e placas

### Livro P1 — Diário da Moradora
```text
Dia 18 da estação seca.
A praça discutiu racionamento novamente.
Alguns dizem que as cisternas secaram por desperdício.
Outros juram que a água nunca chegou aos reservatórios.
Não sei em quem acreditar.
```

### Placa P3 — Aviso da Assembleia
```text
Assembleia urgente:
reservas, mineração ou migração?
Todos devem votar antes do próximo ciclo.
```

### Livro P4 — Ata Incompleta
```text
Ata do conselho de Arandu.
Três propostas foram registradas:
1. preservar reservas;
2. expandir mineração;
3. abrir novas rotas.
A votação terminou sem consenso.
```

### Item P5 — Nome sugerido
```text
Chave de Comporta Quebrada
```

### Placa P7 — Registro da Torre
```text
Registro climático:
chuvas dentro do esperado.
Problema pode estar no caminho da água,
não apenas na quantidade de chuva.
```

### Placa final — Mural de Síntese
```text
Escolha uma versão,
mas defenda com 3 evidências.
O melhor historiador não apenas escolhe:
ele explica por quê.
```

## Comandos simples opcionais
Estes comandos são opcionais e podem ser usados em command blocks ou manualmente no chat para dar feedback sem criar scripts.

### Mensagem inicial
```mcfunction
title @a title Mistério Histórico
title @a subtitle Descubram por que Arandu foi abandonada
```

### Feedback ao entrar na sala final
```mcfunction
say Cada jogador deve defender uma hipótese com 3 evidências encontradas.
```

### Feedback de conclusão
```mcfunction
title @a title Investigação concluída
title @a subtitle Conversem sobre qual evidência mudou a opinião de vocês
```

## Roteiro de teste da Sprint 1

### Teste 1.1 — Percurso sem explicação externa
**Procedimento:** um jogador começa no acampamento e tenta encontrar as áreas sem ajuda do construtor.

**Resultado esperado:** o jogador encontra praça, cisternas/canais, arquivo/templo e sala final sem ficar perdido por mais de 3 minutos.

### Teste 1.2 — Pistas encontráveis
**Procedimento:** pedir para os jogadores encontrarem o máximo de pistas em até 20 minutos.

**Resultado esperado:** pelo menos 6 das 9 pistas devem ser encontradas sem intervenção externa.

### Teste 1.3 — Pistas não óbvias demais
**Procedimento:** após encontrar cada pista, perguntar qual hipótese ela favorece.

**Resultado esperado:** algumas pistas devem gerar dúvida entre hipóteses, especialmente P2, P7 e P8.

### Teste 1.4 — Debate final
**Procedimento:** cada jogador escolhe uma hipótese na sala final e cita 3 evidências.

**Resultado esperado:** os jogadores devem conseguir argumentar sem depender de uma resposta única decorada.

### Teste 1.5 — Tempo de sessão
**Procedimento:** cronometrar o tempo desde o acampamento até a discussão final.

**Resultado esperado:** a experiência completa deve durar entre 20 e 40 minutos.

## Checklist de conclusão da Sprint 1
- [ ] Acampamento inicial montado.
- [ ] Praça central montada.
- [ ] Cisternas e canais montados.
- [ ] Arquivo/templo montado.
- [ ] Casa de manutenção montada.
- [ ] Câmara do conselho montada.
- [ ] Sala final montada.
- [ ] 9 pistas posicionadas.
- [ ] Textos de placas/livros revisados.
- [ ] Teste de percurso executado.
- [ ] Teste de debate final executado.
- [ ] Ajustes anotados para Sprint 2.

## Critérios para avançar para a Sprint 2
Avançar para Behavior Pack mínimo somente se:

1. os jogadores encontrarem pelo menos 6 pistas sem ajuda direta;
2. a sessão couber em 20 a 40 minutos;
3. os jogadores conseguirem defender hipóteses com evidências;
4. ficar claro quais interações precisam ser automatizadas por tags, scoreboard ou funções;
5. não houver necessidade urgente de textura customizada para entender a missão.

## Registro pós-conclusão da Sprint 1
- O que foi feito: definido protótipo vanilla completo, com áreas, distribuição de pistas, textos prontos, comandos opcionais, roteiro de teste e critérios de avanço para Sprint 2.
- O que ficou faltando: construir ou ajustar o protótipo no mundo ativo e coletar feedback real dos jogadores durante uma sessão.
- Impedimentos/bloqueios: nenhum. Não houve necessidade de criar ou enviar arquivos PNG via MCP nesta sprint.
