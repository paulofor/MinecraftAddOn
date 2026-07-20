#!/usr/bin/env bash
set -euo pipefail

BEDROCK_FIFO="${BEDROCK_FIFO:-/run/minecraft/bedrock-console.in}"
BEDROCK_COMMAND_LOG="${BEDROCK_COMMAND_LOG:-/root/MinecraftServer/logging/bedrock-console-commands.log}"
COMMAND="${*:-}"

if [[ -z "${COMMAND}" ]]; then
  echo "uso: $0 'say mensagem inofensiva'" >&2
  exit 2
fi

if [[ "${COMMAND}" == /* ]]; then
  echo "[erro] envie comandos sem '/' inicial" >&2
  exit 2
fi

if [[ ! "${COMMAND}" =~ ^say[[:space:]][^[:cntrl:]]{1,200}$ ]]; then
  echo "[erro] Sprint 2 permite somente comando inofensivo: say <mensagem>" >&2
  exit 2
fi

if [[ ! -p "${BEDROCK_FIFO}" ]]; then
  echo "[erro] FIFO Bedrock ausente: ${BEDROCK_FIFO}" >&2
  exit 1
fi

mkdir -p "$(dirname "${BEDROCK_COMMAND_LOG}")"
touch "${BEDROCK_COMMAND_LOG}"
chmod 0640 "${BEDROCK_COMMAND_LOG}"
printf '[%s] [bridge] comando inofensivo enviado: %s\n' "$(date -Is)" "${COMMAND}" >>"${BEDROCK_COMMAND_LOG}"
printf '%s\n' "${COMMAND}" >"${BEDROCK_FIFO}"
