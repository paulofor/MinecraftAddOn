#!/usr/bin/env bash
set -euo pipefail

REMOTE_DIR="${1:-/root/MinecraftAddOn}"
BEDROCK_ROOT="${2:-/root/MinecraftServer}"
BEDROCK_FIFO="${3:-/run/minecraft/bedrock-console.in}"
BEDROCK_LOG_FILE="${4:-${BEDROCK_ROOT}/logging/bedrock.log}"
BEDROCK_COMMAND_LOG="${5:-${BEDROCK_ROOT}/logging/bedrock-console-commands.log}"

if [[ $EUID -ne 0 ]]; then
  echo "[erro] execute como root" >&2
  exit 1
fi

if ! command -v systemctl >/dev/null 2>&1; then
  echo "[erro] systemctl não disponível; Sprint 2 exige systemd wrapper versionado" >&2
  exit 1
fi

if [[ ! -x "${REMOTE_DIR}/tools/bedrock_console_wrapper.sh" ]]; then
  echo "[erro] wrapper não encontrado em ${REMOTE_DIR}/tools/bedrock_console_wrapper.sh" >&2
  exit 1
fi

if [[ ! -x "${BEDROCK_ROOT}/bedrock_server" ]]; then
  echo "[erro] bedrock_server não executável em ${BEDROCK_ROOT}/bedrock_server" >&2
  exit 1
fi

install -d -m 0750 "$(dirname "${BEDROCK_FIFO}")" "$(dirname "${BEDROCK_LOG_FILE}")"
install -m 0755 "${REMOTE_DIR}/tools/bedrock_console_wrapper.sh" /usr/local/bin/bedrock_console_wrapper.sh
install -m 0755 "${REMOTE_DIR}/tools/send_bedrock_console_command.sh" /usr/local/bin/send_bedrock_console_command.sh

cat >/etc/systemd/system/bedrock.service <<EOF_UNIT
[Unit]
Description=Minecraft Bedrock Dedicated Server with console FIFO bridge
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=${BEDROCK_ROOT}
Environment=BEDROCK_ROOT=${BEDROCK_ROOT}
Environment=BEDROCK_BINARY=${BEDROCK_ROOT}/bedrock_server
Environment=BEDROCK_FIFO=${BEDROCK_FIFO}
Environment=BEDROCK_LOG_FILE=${BEDROCK_LOG_FILE}
Environment=BEDROCK_COMMAND_LOG=${BEDROCK_COMMAND_LOG}
ExecStartPre=-/bin/bash -lc 'pkill -f ${BEDROCK_ROOT}/bedrock_server || true'
ExecStart=/usr/local/bin/bedrock_console_wrapper.sh
Restart=always
RestartSec=5
KillSignal=SIGTERM
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target
EOF_UNIT

systemctl daemon-reload
systemctl enable bedrock.service >/dev/null

echo "[ok] bedrock.service instalado com bridge FIFO em ${BEDROCK_FIFO}"
systemctl --no-pager --full cat bedrock.service | sed -n '1,80p'
