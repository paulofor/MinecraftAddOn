#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<USAGE
Uso:
  $(basename "$0") --host HOST --user USER --world-dir "/opt/bedrock-server/worlds/Bedrock level"

Descrição:
  Executa remotamente a validação de world_behavior_packs.json e
  world_resource_packs.json contra os manifests do repositório.

Opções:
  --host HOST          Host/IP do servidor
  --user USER          Usuário SSH
  --world-dir PATH     Caminho da pasta do mundo remoto
  --repo-dir PATH      Caminho do repositório remoto (padrão: /root/MinecraftAddOn)
  --port N             Porta SSH (padrão: 22)
  -h, --help           Mostra esta ajuda
USAGE
}

HOST=""
USER_NAME=""
WORLD_DIR=""
REPO_DIR="/root/MinecraftAddOn"
PORT="22"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host)
      HOST="$2"
      shift 2
      ;;
    --user)
      USER_NAME="$2"
      shift 2
      ;;
    --world-dir)
      WORLD_DIR="$2"
      shift 2
      ;;
    --repo-dir)
      REPO_DIR="$2"
      shift 2
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "[erro] Opção inválida: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$HOST" || -z "$USER_NAME" || -z "$WORLD_DIR" ]]; then
  echo "[erro] --host, --user e --world-dir são obrigatórios."
  usage
  exit 1
fi

ssh -p "$PORT" "$USER_NAME@$HOST" \
  "cd '$REPO_DIR' && python3 tools/validate_world_bindings.py --world-dir '$WORLD_DIR'"
