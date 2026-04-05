#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups}"
SOURCE_DIR="${SOURCE_DIR:-$ROOT_DIR}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
CRON_LOG="${CRON_LOG:-$BACKUP_DIR/backup.log}"

usage() {
  cat <<USAGE
Uso:
  $(basename "$0")                 # cria backup imediato do ambiente
  $(basename "$0") --install-cron  # agenda execução diária às 04:00

Variáveis opcionais:
  BACKUP_DIR      Diretório onde os backups serão salvos (padrão: $ROOT_DIR/backups)
  SOURCE_DIR      Diretório a ser salvo (padrão: $ROOT_DIR)
  RETENTION_DAYS  Dias para manter backups (padrão: 7)
  CRON_LOG        Arquivo de log do cron (padrão: $BACKUP_DIR/backup.log)
USAGE
}

create_backup() {
  mkdir -p "$BACKUP_DIR"

  local timestamp archive_name archive_path
  timestamp="$(date +'%Y%m%d_%H%M%S')"
  archive_name="environment_backup_${timestamp}.tar.gz"
  archive_path="$BACKUP_DIR/$archive_name"

  echo "[info] Salvando ambiente de: $SOURCE_DIR"
  tar -czf "$archive_path" \
    --exclude="$BACKUP_DIR" \
    --exclude='*.log' \
    -C "$(dirname "$SOURCE_DIR")" \
    "$(basename "$SOURCE_DIR")"

  echo "[ok] Backup criado em: $archive_path"

  if [[ "$RETENTION_DAYS" =~ ^[0-9]+$ ]]; then
    find "$BACKUP_DIR" -maxdepth 1 -type f -name 'environment_backup_*.tar.gz' -mtime +"$RETENTION_DAYS" -delete
    echo "[info] Limpeza concluída (retenção: $RETENTION_DAYS dias)."
  else
    echo "[warn] RETENTION_DAYS inválido ($RETENTION_DAYS). Limpeza ignorada."
  fi
}

install_cron() {
  mkdir -p "$BACKUP_DIR"

  local cron_cmd cron_line current_cron tmp_cron
  cron_cmd="/usr/bin/env bash '$SCRIPT_PATH'"
  cron_line="0 4 * * * BACKUP_DIR='$BACKUP_DIR' SOURCE_DIR='$SOURCE_DIR' RETENTION_DAYS='$RETENTION_DAYS' CRON_LOG='$CRON_LOG' $cron_cmd >> '$CRON_LOG' 2>&1"

  current_cron="$(mktemp)"
  tmp_cron="$(mktemp)"

  crontab -l > "$current_cron" 2>/dev/null || true

  if grep -Fq "$cron_cmd" "$current_cron"; then
    echo "[info] Rotina já existe no crontab. Nada para fazer."
    rm -f "$current_cron" "$tmp_cron"
    return
  fi

  cat "$current_cron" > "$tmp_cron"
  echo "$cron_line" >> "$tmp_cron"
  crontab "$tmp_cron"

  rm -f "$current_cron" "$tmp_cron"

  echo "[ok] Rotina agendada para todos os dias às 04:00."
  echo "[info] Logs: $CRON_LOG"
}

case "${1:-}" in
  --install-cron)
    install_cron
    ;;
  -h|--help)
    usage
    ;;
  "")
    create_backup
    ;;
  *)
    echo "[erro] Opção inválida: $1"
    usage
    exit 1
    ;;
esac
