# Publicação com imagens automáticas (Git LFS)

Se você quer configurar **uma vez** e depois só mandar o Codex criar/subir imagens, este é o fluxo.

## 1) Setup único

```bash
./tools/setup_git_lfs.sh
git add .gitattributes
git commit -m "chore: habilita Git LFS"
git push
```

Depois disso, extensões como `.png` e `.mcpack` ficam rastreadas por LFS automaticamente.

## 2) Fluxo recorrente (automático)

Quando novas imagens forem criadas em `packs/`, rode:

```bash
./tools/publish_images.sh "chore: atualiza texturas do quadro"
```

O script:
1. adiciona `packs/` + `.gitattributes`;
2. faz commit;
3. faz push.

## 3) O que o Codex consegue automatizar

- Criar arquivos de imagem no repositório;
- Executar `./tools/publish_images.sh` para commit + push;
- Manter padrão de versionamento e mensagem de commit.

> Pré-requisito: o ambiente onde o Codex roda precisa ter credenciais de `git push` já configuradas (token/SSH).

## 4) Alternativa para distribuição de build

Se preferir não versionar `.mcpack` no histórico, publique o pacote em **GitHub Releases**.
