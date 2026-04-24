#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${1:-auto}"
OUT_FILE="/root/MinecraftServer/logging/bedrock.log"
CANDIDATE_UNITS=(
  "bedrock.service"
  "minecraft-bedrock.service"
  "minecraft.service"
  "mcbedrock.service"
)

unit_exists() {
  local unit="$1"
  if systemctl list-unit-files --type=service --no-legend 2>/dev/null | awk '{print $1}' | grep -Fxq "$unit"; then
    return 0
  fi
  if systemctl list-units --type=service --all --no-legend 2>/dev/null | awk '{print $1}' | grep -Fxq "$unit"; then
    return 0
  fi
  return 1
}

unit_is_active() {
  local unit="$1"
  if [[ "$(systemctl is-active "$unit" 2>/dev/null || true)" == "active" ]]; then
    return 0
  fi
  return 1
}

resolve_service_name() {
  local requested="${1:-auto}"
  if [[ "$requested" != "auto" ]]; then
    if ! unit_exists "$requested"; then
      echo "[erro] serviço informado não existe: $requested" >&2
      return 1
    fi
    echo "$requested"
    return 0
  fi

  local candidate
  for candidate in "${CANDIDATE_UNITS[@]}"; do
    if unit_is_active "$candidate"; then
      echo "$candidate"
      return 0
    fi
  done

  for candidate in "${CANDIDATE_UNITS[@]}"; do
    if unit_exists "$candidate"; then
      echo "$candidate"
      return 0
    fi
  done

  echo "[erro] não foi possível detectar automaticamente o serviço do Bedrock." >&2
  echo "[erro] informe o nome explicitamente, ex.: ./tools/export_bedrock_journal.sh bedrock.service" >&2
  return 1
}

mkdir -p "$(dirname "$OUT_FILE")"
touch "$OUT_FILE"

SERVICE_NAME="$(resolve_service_name "$SERVICE_NAME")"
echo "[export_bedrock_journal] Exportando logs de $SERVICE_NAME para $OUT_FILE"

if ! unit_is_active "$SERVICE_NAME"; then
  echo "[aviso] serviço selecionado não está ativo no momento: $SERVICE_NAME" >&2
fi

action_follow() {
  journalctl -u "$SERVICE_NAME" -f -n 200 --no-pager -o cat >> "$OUT_FILE"
}

if [[ "${2:-}" == "--truncate" ]]; then
  : > "$OUT_FILE"
fi

# Captura um snapshot inicial e inicia o follow.
journalctl -u "$SERVICE_NAME" -n 500 --no-pager -o cat > "$OUT_FILE"
action_follow
