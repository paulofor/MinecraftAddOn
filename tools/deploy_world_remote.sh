#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<USAGE
Uso:
  $(basename "$0") --host HOST --user USER --world-dir "/root/MinecraftServer/worlds/Bedrock level"

Descrição:
  Publica os packs do repositório para as pastas do mundo Bedrock remoto,
  atualiza world_behavior_packs.json/world_resource_packs.json e, opcionalmente,
  reinicia o serviço do servidor.

Opções:
  --host HOST             Host/IP do servidor
  --user USER             Usuário SSH
  --world-dir PATH        Caminho da pasta do mundo remoto
  --repo-dir PATH         Caminho do repositório remoto (padrão: /root/MinecraftAddOn)
  --bp-name NOME          Nome da pasta do BP em packs/ (padrão: BP_QuadroIdeias)
  --rp-name NOME          Nome da pasta do RP em packs/ (padrão: RP_QuadroIdeias)
  --service NAME          Serviço systemd para reinício (padrão: bedrock.service)
  --no-restart            Não reinicia o serviço após deploy
  --dry-run               Mostra o que seria copiado, sem alterar arquivos
  --port N                Porta SSH (padrão: 22)
  --identity PATH         Chave privada SSH (opcional)
  -h, --help              Mostra esta ajuda
USAGE
}

HOST=""
USER_NAME=""
WORLD_DIR=""
REPO_DIR="/root/MinecraftAddOn"
BP_NAME="BP_QuadroIdeias"
RP_NAME="RP_QuadroIdeias"
SERVICE_NAME="bedrock.service"
PORT="22"
IDENTITY=""
RESTART_SERVICE=1
DRY_RUN=0

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
    --bp-name)
      BP_NAME="$2"
      shift 2
      ;;
    --rp-name)
      RP_NAME="$2"
      shift 2
      ;;
    --service)
      SERVICE_NAME="$2"
      shift 2
      ;;
    --no-restart)
      RESTART_SERVICE=0
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    --identity)
      IDENTITY="$2"
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

SSH_ARGS=(-p "$PORT")
if [[ -n "$IDENTITY" ]]; then
  SSH_ARGS+=(-i "$IDENTITY")
fi

REMOTE_CMD=$(cat <<'BASH'
set -euo pipefail

repo_dir="$1"
world_dir="$2"
bp_name="$3"
rp_name="$4"
service_name="$5"
restart_service="$6"
dry_run="$7"

bp_src="$repo_dir/packs/$bp_name"
rp_src="$repo_dir/packs/$rp_name"
bp_dst="$world_dir/behavior_packs/$bp_name"
rp_dst="$world_dir/resource_packs/$rp_name"

if [[ ! -d "$bp_src" ]]; then
  echo "[erro] BP não encontrado: $bp_src"
  exit 1
fi

if [[ ! -d "$rp_src" ]]; then
  echo "[erro] RP não encontrado: $rp_src"
  exit 1
fi

mkdir -p "$world_dir/behavior_packs" "$world_dir/resource_packs"
mkdir -p "$bp_dst" "$rp_dst"

rsync_flags=(-a --delete)
if [[ "$dry_run" == "1" ]]; then
  rsync_flags+=(--dry-run)
fi

echo "[info] Copiando BP: $bp_src -> $bp_dst"
rsync "${rsync_flags[@]}" "$bp_src/" "$bp_dst/"

echo "[info] Copiando RP: $rp_src -> $rp_dst"
rsync "${rsync_flags[@]}" "$rp_src/" "$rp_dst/"

if [[ "$dry_run" == "1" ]]; then
  echo "[ok] Dry-run concluído. Nenhum arquivo foi alterado."
  exit 0
fi

cd "$repo_dir"
python3 tools/update_world_bindings.py --world-dir "$world_dir"
python3 tools/validate_world_bindings.py --world-dir "$world_dir"

if [[ "$restart_service" == "1" ]]; then
  echo "[info] Reiniciando serviço: $service_name"
  systemctl restart "$service_name"
  echo "[ok] Serviço reiniciado: $service_name"
else
  echo "[info] Reinício do serviço desativado (--no-restart)."
fi
BASH
)

ssh "${SSH_ARGS[@]}" "$USER_NAME@$HOST" \
  "bash -s -- '$REPO_DIR' '$WORLD_DIR' '$BP_NAME' '$RP_NAME' '$SERVICE_NAME' '$RESTART_SERVICE' '$DRY_RUN'" <<EOF
$REMOTE_CMD
EOF
