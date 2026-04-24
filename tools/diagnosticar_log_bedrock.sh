#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${1:-auto}"
LOG_FILE="${2:-/root/MinecraftServer/logging/bedrock.log}"
CANDIDATE_UNITS=(
  "bedrock.service"
  "minecraft-bedrock.service"
  "minecraft.service"
  "mcbedrock.service"
)

resolve_service_name() {
  local requested="${1:-auto}"
  if [[ "$requested" != "auto" ]]; then
    echo "$requested"
    return 0
  fi

  local candidate
  for candidate in "${CANDIDATE_UNITS[@]}"; do
    if systemctl list-units --type=service --all --no-legend 2>/dev/null | awk '{print $1}' | grep -Fxq "$candidate"; then
      echo "$candidate"
      return 0
    fi
  done

  echo "[erro] não foi possível detectar o serviço Bedrock automaticamente." >&2
  return 1
}

SERVICE_NAME="$(resolve_service_name "$SERVICE_NAME")"

echo "=== Diagnóstico Bedrock Log ==="
echo "Serviço alvo: $SERVICE_NAME"
echo "Arquivo de log: $LOG_FILE"
echo

echo "--- status do serviço do jogo ---"
systemctl --no-pager --full status "$SERVICE_NAME" | sed -n '1,20p' || true
echo

echo "--- status do exportador de logs ---"
systemctl --no-pager --full status bedrock-log-export.service | sed -n '1,20p' || true
echo

echo "--- permissões do arquivo de log ---"
if [[ -e "$LOG_FILE" ]]; then
  stat "$LOG_FILE"
else
  echo "arquivo inexistente"
fi
echo

echo "--- últimas linhas no arquivo de log ---"
tail -n 20 "$LOG_FILE" 2>/dev/null || true
echo

echo "--- últimas linhas do journal do Bedrock ---"
journalctl -u "$SERVICE_NAME" -n 20 --no-pager -o short-iso || true
echo

echo "--- últimas linhas do journal do exportador ---"
journalctl -u bedrock-log-export.service -n 20 --no-pager -o short-iso || true
echo

echo "=== Fim do diagnóstico ==="
