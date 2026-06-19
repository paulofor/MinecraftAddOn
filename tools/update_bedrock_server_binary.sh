#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<USAGE
Uso:
  $(basename "$0") --archive /root/Uploads/bedrock-server-1.26.30.5.zip [opções]

Descrição:
  Atualiza com segurança o Bedrock Dedicated Server instalado no host.
  O script descompacta o pacote em staging, faz backup dos arquivos críticos,
  preserva mundo/configurações locais, para o serviço, sincroniza os arquivos
  do pacote novo, reinicia o serviço e valida a versão no bedrock.log.

Opções:
  --archive PATH          ZIP oficial do Bedrock Dedicated Server (obrigatório)
  --server-dir PATH       Diretório do servidor (padrão: /root/MinecraftServer)
  --service NAME          Serviço systemd (padrão: bedrock.service)
  --backup-dir PATH       Diretório base de backups (padrão: /root/MinecraftAddOn/backups/bedrock_server_updates)
  --expected-version VER  Versão esperada no bedrock.log após restart (ex.: 1.26.30)
  --backup-worlds         Inclui backup compactado de worlds/ antes da atualização
  --no-restart            Atualiza arquivos, mas não reinicia o serviço
  --dry-run               Mostra plano e valida entradas sem alterar arquivos
  -h, --help              Mostra esta ajuda
USAGE
}

ARCHIVE=""
SERVER_DIR="/root/MinecraftServer"
SERVICE_NAME="bedrock.service"
BACKUP_BASE_DIR="/root/MinecraftAddOn/backups/bedrock_server_updates"
EXPECTED_VERSION=""
BACKUP_WORLDS=0
RESTART_SERVICE=1
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --archive)
      ARCHIVE="$2"
      shift 2
      ;;
    --server-dir)
      SERVER_DIR="$2"
      shift 2
      ;;
    --service)
      SERVICE_NAME="$2"
      shift 2
      ;;
    --backup-dir)
      BACKUP_BASE_DIR="$2"
      shift 2
      ;;
    --expected-version)
      EXPECTED_VERSION="$2"
      shift 2
      ;;
    --backup-worlds)
      BACKUP_WORLDS=1
      shift
      ;;
    --no-restart)
      RESTART_SERVICE=0
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "[erro] Opção inválida: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$ARCHIVE" ]]; then
  echo "[erro] --archive é obrigatório." >&2
  usage
  exit 1
fi

require_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "[erro] Comando obrigatório não encontrado: $command_name" >&2
    exit 1
  fi
}

require_file() {
  local path="$1"
  local label="$2"
  if [[ ! -f "$path" ]]; then
    echo "[erro] $label não encontrado: $path" >&2
    exit 1
  fi
}

require_dir() {
  local path="$1"
  local label="$2"
  if [[ ! -d "$path" ]]; then
    echo "[erro] $label não encontrado: $path" >&2
    exit 1
  fi
}

require_command unzip
require_command rsync
require_command tar
require_command date
require_command stat

if [[ "$RESTART_SERVICE" -eq 1 ]]; then
  require_command systemctl
fi

require_file "$ARCHIVE" "Arquivo ZIP do Bedrock"
require_dir "$SERVER_DIR" "Diretório do servidor Bedrock"

if [[ "${ARCHIVE,,}" != *.zip ]]; then
  echo "[erro] O arquivo informado deve ser um .zip oficial do Bedrock Dedicated Server: $ARCHIVE" >&2
  exit 1
fi

TIMESTAMP="$(date +'%Y%m%d_%H%M%S')"
BACKUP_DIR="$BACKUP_BASE_DIR/$TIMESTAMP"
STAGING_DIR="$(mktemp -d /tmp/bedrock_update_staging.XXXXXX)"
LOG_FILE="$SERVER_DIR/logging/bedrock.log"

cleanup() {
  rm -rf "$STAGING_DIR"
}
trap cleanup EXIT

echo "[info] Arquivo de atualização: $ARCHIVE"
echo "[info] Diretório do servidor: $SERVER_DIR"
echo "[info] Serviço: $SERVICE_NAME"
echo "[info] Backup em: $BACKUP_DIR"
echo "[info] Staging temporário: $STAGING_DIR"

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "[dry-run] Validações iniciais concluídas. Nenhum arquivo será alterado."
  echo "[dry-run] O script descompactaria o pacote, criaria backup, pararia o serviço, sincronizaria arquivos e reiniciaria/validaria."
  exit 0
fi

echo "[info] Descompactando pacote em staging..."
unzip -q "$ARCHIVE" -d "$STAGING_DIR"

require_file "$STAGING_DIR/bedrock_server" "bedrock_server dentro do ZIP"
chmod +x "$STAGING_DIR/bedrock_server"

mkdir -p "$BACKUP_DIR"

echo "[info] Salvando manifesto de backup..."
{
  echo "timestamp=$TIMESTAMP"
  echo "archive=$ARCHIVE"
  echo "server_dir=$SERVER_DIR"
  echo "service=$SERVICE_NAME"
  echo "expected_version=$EXPECTED_VERSION"
  stat "$ARCHIVE" || true
} > "$BACKUP_DIR/manifest.txt"

echo "[info] Fazendo backup de arquivos críticos..."
mkdir -p "$BACKUP_DIR/root_files"
for path in \
  "$SERVER_DIR/bedrock_server" \
  "$SERVER_DIR/server.properties" \
  "$SERVER_DIR/allowlist.json" \
  "$SERVER_DIR/permissions.json" \
  "$SERVER_DIR/packetlimiting.json" \
  "$SERVER_DIR/packetlimitconfig.json" \
  "$SERVER_DIR/profanity_filter.wlist"; do
  if [[ -e "$path" ]]; then
    cp -a "$path" "$BACKUP_DIR/root_files/"
  fi
done

shopt -s nullglob
for lib in "$SERVER_DIR"/*.so; do
  cp -a "$lib" "$BACKUP_DIR/root_files/"
done
shopt -u nullglob

if [[ -d "$SERVER_DIR/config" ]]; then
  tar -czf "$BACKUP_DIR/config.tar.gz" -C "$SERVER_DIR" config
fi

if [[ -d "$SERVER_DIR/minecraftpe" ]]; then
  tar -czf "$BACKUP_DIR/minecraftpe.tar.gz" -C "$SERVER_DIR" minecraftpe
fi

if [[ "$BACKUP_WORLDS" -eq 1 && -d "$SERVER_DIR/worlds" ]]; then
  echo "[info] Fazendo backup compactado de worlds/ (pode demorar)..."
  tar -czf "$BACKUP_DIR/worlds.tar.gz" -C "$SERVER_DIR" worlds
else
  echo "[info] Backup completo de worlds/ não solicitado; diretório será preservado pelo rsync."
fi

if [[ "$RESTART_SERVICE" -eq 1 ]]; then
  echo "[info] Parando serviço: $SERVICE_NAME"
  systemctl stop "$SERVICE_NAME"
else
  echo "[info] --no-restart ativo; serviço não será parado pelo script."
fi

echo "[info] Sincronizando pacote novo preservando mundo e configurações locais..."
rsync -a --delete \
  --exclude='worlds/' \
  --exclude='logging/' \
  --exclude='server.properties' \
  --exclude='allowlist.json' \
  --exclude='permissions.json' \
  --exclude='packetlimiting.json' \
  --exclude='packetlimitconfig.json' \
  --exclude='profanity_filter.wlist' \
  "$STAGING_DIR/" "$SERVER_DIR/"

chmod +x "$SERVER_DIR/bedrock_server"

if [[ "$RESTART_SERVICE" -eq 1 ]]; then
  echo "[info] Iniciando serviço: $SERVICE_NAME"
  systemctl start "$SERVICE_NAME"
  systemctl is-active --quiet "$SERVICE_NAME"
  echo "[ok] Serviço ativo: $SERVICE_NAME"

  if [[ -f "$LOG_FILE" ]]; then
    echo "[info] Aguardando log registrar a inicialização..."
    sleep 5
    tail -n 120 "$LOG_FILE" | tee "$BACKUP_DIR/bedrock_tail_after_update.log"

    if [[ -n "$EXPECTED_VERSION" ]]; then
      if tail -n 300 "$LOG_FILE" | grep -F "Version: $EXPECTED_VERSION" >/dev/null 2>&1; then
        echo "[ok] Versão esperada encontrada no log: $EXPECTED_VERSION"
      else
        echo "[erro] Versão esperada não encontrada no log: $EXPECTED_VERSION" >&2
        echo "[erro] Consulte: $BACKUP_DIR/bedrock_tail_after_update.log" >&2
        exit 1
      fi
    fi
  else
    echo "[warn] Log não encontrado para validação: $LOG_FILE" >&2
  fi
else
  echo "[ok] Arquivos atualizados sem restart. Reinicie manualmente para aplicar."
fi

echo "[ok] Atualização concluída. Backup: $BACKUP_DIR"
