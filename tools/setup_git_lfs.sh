#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v git >/dev/null 2>&1; then
  echo "[erro] git não encontrado."
  exit 1
fi

if ! command -v git-lfs >/dev/null 2>&1 && ! git lfs version >/dev/null 2>&1; then
  echo "[erro] Git LFS não está instalado."
  echo "Instale em: https://git-lfs.com/"
  exit 1
fi

echo "[info] Instalando hooks do Git LFS..."
git lfs install

echo "[info] Garantindo rastreamento de padrões LFS..."
git lfs track "*.png" "*.jpg" "*.jpeg" "*.webp" "*.mcpack" "*.zip"

echo "[info] Estado atual de rastreamento:"
git lfs track

echo "[ok] Configuração concluída. Faça commit do .gitattributes se houver mudanças."
