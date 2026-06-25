# Portal 4D Espacial — Sprint 1: mapa conceitual e fallback

## Mapa conceitual
- **Portal físico:** moldura vanilla em `crying_obsidian`, vidro roxo e `sea_lantern` central como bloco-chave futuro.
- **Entrada pedagógica:** o portal não promete uma quarta coordenada real; ele prepara uma transição para uma simulação em 3D com estados, fatias e projeções.
- **Quatro ideias educativas:** projeção do hipercubo, fatias 3D, rotação 4D simulada e coordenada `W` representada por mudanças de estado.
- **Operação inicial:** operadores usam `/function portal_4d/init` e `/function portal_4d/construir_portal` em área plana de teste.

## Decisão de fallback
- **Caminho preferencial:** usar Custom Dimension API para `portal4d:espaco_4d` quando o mundo/servidor estiver com versão compatível e Beta APIs habilitadas.
- **Fallback obrigatório:** se a API de dimensão customizada não estiver disponível, usar uma arena isolada no Overworld com as mesmas mensagens e checkpoints.
- **Segurança:** todo destino futuro deve ter plataforma sólida, iluminação, retorno ao ponto de origem e logs com prefixo `[Portal4D]`.

## Escopo da Sprint 1
- Foram criados BP/RP pareados e versionados em `0.1.0`.
- A função de construção usa apenas blocos vanilla e não depende de texturas PNG.
- O script inicial apenas registra carregamento e instruções; teleporte e interação ficam para sprints posteriores.
