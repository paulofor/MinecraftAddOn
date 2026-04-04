#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

MESSAGE="${1:-chore: atualiza imagens do add-on}"
BRANCH="${2:-}"

if ! git lfs version >/dev/null 2>&1; then
  echo "[erro] Git LFS não está disponível. Rode ./tools/setup_git_lfs.sh primeiro."
  exit 1
fi

if [[ -n "$BRANCH" ]]; then
  git checkout "$BRANCH"
fi

git add packs/ .gitattributes

if git diff --cached --quiet; then
  echo "[info] Nenhuma mudança para publicar."
  exit 0
fi

git commit -m "$MESSAGE"
git push

echo "[ok] Mudanças de imagens publicadas com Git LFS."
