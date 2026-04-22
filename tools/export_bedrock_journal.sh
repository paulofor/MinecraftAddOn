#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${1:-bedrock.service}"
OUT_FILE="${2:-/root/MinecraftServer/bedrock.log}"

mkdir -p "$(dirname "$OUT_FILE")"
touch "$OUT_FILE"

echo "[export_bedrock_journal] Exportando logs de $SERVICE_NAME para $OUT_FILE"

action_follow() {
  journalctl -u "$SERVICE_NAME" -f -n 200 --no-pager >> "$OUT_FILE"
}

if [[ "${3:-}" == "--truncate" ]]; then
  : > "$OUT_FILE"
fi

# Captura um snapshot inicial e inicia o follow.
journalctl -u "$SERVICE_NAME" -n 500 --no-pager > "$OUT_FILE"
action_follow
