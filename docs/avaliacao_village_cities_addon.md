# Avaliação — Village Cities Add-On 1.2

## Veredito

**Vale considerar como substituto prático da camada de cidade que nossos
projetos não conseguiram entregar, mas primeiro em uma cópia de teste.** Não é
correto usar uma especificação extensa como argumento a favor do código próprio
quando o resultado jogável foi rejeitado pelo operador.

## Por que surgiu a dúvida?

O nome “Village Cities” parece coincidir com o tema do projeto, mas tema não é
o mesmo que função. A Cidade Constitucional precisa de governo local,
orçamento, votação, população, obras públicas, histórico de decisões e estado
autoritativo no servidor. Um add-on de cidades só atende ao projeto se também
for compatível com Bedrock Dedicated Server, mundo existente, demais BP/RP e
persistência dessas mecânicas.

## Compatibilidade conceitual

Pode ajudar em:

- ambientação e variedade arquitetônica;
- geração ou exploração de vilas/cidades;
- criação de um núcleo urbano para atividades educativas.

Não há evidência suficiente na página pública consultada para afirmar que ele
oferece:

- orçamento, votação, leis ou contratos;
- integração com `/cidade` e propriedades dinâmicas;
- coordenadas parametrizadas e prechecks do projeto;
- compatibilidade com o RealSource/Vibrant Visuals e os packs atuais;
- exportação autorizada para o Bedrock Dedicated Server Linux.

## Risco técnico principal

Conteúdo adquirido no Marketplace é associado à conta do Minecraft e pode ter
um fluxo de instalação/entitlement diferente dos packs em arquivo que
publicamos no host. A página identifica o produto como Add-On, mas o HTML
público é carregado dinamicamente e não expôs, nesta consulta sem sessão, a
documentação técnica, preço, dependências, permissões de exportação ou suporte
explícito a servidor dedicado.

Também não está confirmado se o add-on altera geração, vilas vanilla, entidades
ou estruturas. Qualquer uma dessas alterações pode colidir com o mundo ativo e
com a diretriz da Cidade Constitucional de não reescrever a lógica vanilla de
vilas.

## Decisão recomendada

1. **Não usar o mundo principal como teste.**
2. Se o operador já possui o produto ou aceita comprar para avaliação, ativá-lo
   primeiro em uma cópia local descartável do mundo.
3. Confirmar se o Marketplace permite aplicá-lo a um mundo existente e se os
   arquivos/licença permitem publicação no BDS Linux.
4. Inventariar BP/RP, UUIDs, versões, scripts, dependências e alterações de
   geração antes de qualquer deploy.
5. Testar em cópia do servidor junto com RealSource e os packs atuais.
6. Somente considerar integração se o mundo abrir sem erro, jogadores
   receberem o conteúdo, cidades surgirem como esperado e nenhuma construção
   existente for modificada.

Até essas respostas existirem, a recomendação é **não instalar diretamente no
mundo principal**. Porém, considerando o histórico de falhas dos projetos
próprios, comprar para uma avaliação controlada pode ser uma decisão razoável
se o preço for aceitável. O critério não deve ser quantidade de funções no
papel, e sim: fica bonito, é compreensível, funciona em multiplayer e pode ser
levado legalmente ao BDS?

## Revisão após feedback do operador

O operador informou que **todos os projetos próprios falharam e não ficaram
bons**. Os registros corroboram um padrão: Portal 4D foi redesenhado várias
vezes, continuou confuso, acumulou migrações destrutivas e teve validações que
confirmavam comandos/logs, mas não a qualidade da experiência.

### Causa raiz sistêmica

- especificação e automação foram tratadas como evidência de qualidade;
- testes verificaram strings, coordenadas, comandos e carregamento, mas não
  diversão, legibilidade visual ou desejo de continuar jogando;
- construções procedurais grandes foram evoluídas por remendos sucessivos;
- o feedback visual humano entrou tarde, depois de muito código e deploy;
- insistimos em preservar a solução própria porque era controlável, mesmo sem
  evidência de que ela era boa.

Portanto, a decisão anterior precisa ser ajustada: o Village Cities não deve
ser descartado por oferecer menos mecânicas educativas. Se ele entregar uma
cidade pronta e agradável, pode ser uma base melhor; as atividades educativas
podem acontecer por regras de jogo simples, sem novo sistema grande de scripts.

### Novo critério de decisão

1. Ver vídeo, descrição completa, avaliações e preço no cliente autenticado.
2. Se a proposta visual agradar, comprar apenas para teste controlado.
3. Testar por 30–60 minutos em mundo novo, sem nossos add-ons.
4. Responder somente três perguntas: é bonito, é fácil de entender e dá vontade
   de continuar?
5. Só então verificar exportação/BDS e coexistência técnica.
6. Se não puder ir para BDS, considerar Realm/mundo hospedado como alternativa,
   em vez de imediatamente voltar a construir outro sistema próprio.
