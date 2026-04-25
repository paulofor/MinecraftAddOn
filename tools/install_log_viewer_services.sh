#!/usr/bin/env bash
set -euo pipefail

REMOTE_DIR="${1:-/root/MinecraftAddOn}"
SERVICE_NAME="${2:-auto}"
LOG_FILE="/root/MinecraftServer/logging/bedrock.log"
VIEWER_PORT="${3:-8081}"
ENABLE_VIEWER="${4:-yes}"

if [[ $EUID -ne 0 ]]; then
  echo "[erro] execute como root" >&2
  exit 1
fi

mkdir -p "$(dirname "$LOG_FILE")"

cat >/etc/systemd/system/bedrock-log-export.service <<EOF
[Unit]
Description=Exporta logs do ${SERVICE_NAME} para arquivo
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=${REMOTE_DIR}
ExecStart=/bin/bash -lc '${REMOTE_DIR}/tools/export_bedrock_journal.sh ${SERVICE_NAME}'
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

if [[ "${ENABLE_VIEWER}" == "yes" ]]; then
cat >/etc/systemd/system/bedrock-log-viewer.service <<EOF
[Unit]
Description=Servidor web para visualização dos logs Bedrock
After=network-online.target bedrock-log-export.service
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=${REMOTE_DIR}
Environment=LOG_PATH=${LOG_FILE}
Environment=HOST=0.0.0.0
Environment=PORT=${VIEWER_PORT}
Environment=DEFAULT_LINES=400
Environment=MAX_LINES=5000
ExecStart=/usr/bin/python3 ${REMOTE_DIR}/infra/log-viewer/server.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF
fi

systemctl daemon-reload
systemctl enable --now bedrock-log-export.service
if [[ "${ENABLE_VIEWER}" == "yes" ]]; then
  systemctl enable --now bedrock-log-viewer.service
else
  systemctl disable --now bedrock-log-viewer.service >/dev/null 2>&1 || true
fi

echo "[ok] serviços instalados e iniciados"
systemctl --no-pager --full status bedrock-log-export.service | sed -n '1,15p'
if [[ "${ENABLE_VIEWER}" == "yes" ]]; then
  systemctl --no-pager --full status bedrock-log-viewer.service | sed -n '1,15p'
else
  echo "[ok] bedrock-log-viewer.service desabilitado (modo export-only)"
fi
