#!/usr/bin/env bash
set -euo pipefail

BEDROCK_ROOT="${BEDROCK_ROOT:-/root/MinecraftServer}"
BEDROCK_BINARY="${BEDROCK_BINARY:-${BEDROCK_ROOT}/bedrock_server}"
BEDROCK_FIFO="${BEDROCK_FIFO:-/run/minecraft/bedrock-console.in}"
BEDROCK_LOG_FILE="${BEDROCK_LOG_FILE:-${BEDROCK_ROOT}/logging/bedrock.log}"
BEDROCK_COMMAND_LOG="${BEDROCK_COMMAND_LOG:-${BEDROCK_ROOT}/logging/bedrock-console-commands.log}"
export LD_LIBRARY_PATH="${LD_LIBRARY_PATH:-${BEDROCK_ROOT}}"

if [[ ! -x "${BEDROCK_BINARY}" ]]; then
  echo "[erro] bedrock_server não executável em ${BEDROCK_BINARY}" >&2
  exit 1
fi

mkdir -p "$(dirname "${BEDROCK_FIFO}")" "$(dirname "${BEDROCK_LOG_FILE}")" "$(dirname "${BEDROCK_COMMAND_LOG}")"

if [[ -e "${BEDROCK_FIFO}" && ! -p "${BEDROCK_FIFO}" ]]; then
  echo "[erro] ${BEDROCK_FIFO} existe, mas não é FIFO" >&2
  exit 1
fi

if [[ ! -p "${BEDROCK_FIFO}" ]]; then
  mkfifo "${BEDROCK_FIFO}"
fi

chmod 0620 "${BEDROCK_FIFO}"
chmod 0750 "$(dirname "${BEDROCK_FIFO}")"
touch "${BEDROCK_LOG_FILE}" "${BEDROCK_COMMAND_LOG}"
chmod 0640 "${BEDROCK_LOG_FILE}" "${BEDROCK_COMMAND_LOG}"

{
  printf '[%s] [bridge] iniciando bedrock_server com FIFO=%s LOG=%s LD_LIBRARY_PATH=%s\n' \
    "$(date -Is)" "${BEDROCK_FIFO}" "${BEDROCK_LOG_FILE}" "${LD_LIBRARY_PATH}"
} >>"${BEDROCK_COMMAND_LOG}"

cd "${BEDROCK_ROOT}"

# Abre o FIFO em modo leitura/escrita para manter o descritor vivo mesmo quando não há
# escritor conectado. Assim, o servidor não recebe EOF após cada comando individual.
exec 3<>"${BEDROCK_FIFO}"
exec "${BEDROCK_BINARY}" <&3 >>"${BEDROCK_LOG_FILE}" 2>&1
