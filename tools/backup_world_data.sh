#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORLD_DIR="${WORLD_DIR:-}"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups/worlds}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
CRON_HOUR="${CRON_HOUR:-4}"
CRON_MINUTE="${CRON_MINUTE:-0}"
CRON_LOG="${CRON_LOG:-$BACKUP_DIR/backup_world_data.log}"
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"

usage() {
  cat <<USAGE
Uso:
  $(basename "$0") --world-dir /caminho/do/mundo
  $(basename "$0") --world-dir /caminho/do/mundo --install-cron

Descrição:
  Cria backup compactado dos dados do mundo Minecraft Bedrock.
  O agendamento via --install-cron usa o fuso horário local do servidor
  (o cron executa no horário local configurado no sistema).

Opções:
  --world-dir PATH    Caminho da pasta do mundo (obrigatório)
  --install-cron      Instala rotina diária no crontab
  -h, --help          Mostra esta ajuda

Variáveis opcionais:
  BACKUP_DIR          Destino dos backups (padrão: $ROOT_DIR/backups/worlds)
  RETENTION_DAYS      Dias de retenção (padrão: 14)
  CRON_HOUR           Hora da rotina (padrão: 4)
  CRON_MINUTE         Minuto da rotina (padrão: 0)
  CRON_LOG            Arquivo de log do cron (padrão: $BACKUP_DIR/backup_world_data.log)
USAGE
}

require_world_dir() {
  if [[ -z "$WORLD_DIR" ]]; then
    echo "[erro] Informe --world-dir ou a variável WORLD_DIR."
    usage
    exit 1
  fi

  if [[ ! -d "$WORLD_DIR" ]]; then
    echo "[erro] WORLD_DIR não existe: $WORLD_DIR"
    exit 1
  fi
}

validate_cron_time() {
  if ! [[ "$CRON_HOUR" =~ ^([01]?[0-9]|2[0-3])$ ]]; then
    echo "[erro] CRON_HOUR inválido: $CRON_HOUR"
    exit 1
  fi

  if ! [[ "$CRON_MINUTE" =~ ^([0-5]?[0-9])$ ]]; then
    echo "[erro] CRON_MINUTE inválido: $CRON_MINUTE"
    exit 1
  fi
}

create_backup() {
  require_world_dir
  mkdir -p "$BACKUP_DIR"

  local world_name timestamp archive_name archive_path
  world_name="$(basename "$WORLD_DIR")"
  timestamp="$(date +'%Y%m%d_%H%M%S')"
  archive_name="world_backup_${world_name}_${timestamp}.tar.gz"
  archive_path="$BACKUP_DIR/$archive_name"

  echo "[info] Fazendo backup de: $WORLD_DIR"
  tar -czf "$archive_path" \
    -C "$(dirname "$WORLD_DIR")" \
    "$world_name"

  echo "[ok] Backup criado em: $archive_path"

  if [[ "$RETENTION_DAYS" =~ ^[0-9]+$ ]]; then
    find "$BACKUP_DIR" -maxdepth 1 -type f -name "world_backup_${world_name}_*.tar.gz" -mtime +"$RETENTION_DAYS" -delete
    echo "[info] Limpeza concluída (retenção: $RETENTION_DAYS dias)."
  else
    echo "[warn] RETENTION_DAYS inválido ($RETENTION_DAYS). Limpeza ignorada."
  fi
}

install_cron() {
  require_world_dir
  validate_cron_time
  mkdir -p "$BACKUP_DIR"

  local cron_cmd cron_line current_cron tmp_cron
  cron_cmd="/usr/bin/env bash '$SCRIPT_PATH' --world-dir '$WORLD_DIR'"
  cron_line="$CRON_MINUTE $CRON_HOUR * * * BACKUP_DIR='$BACKUP_DIR' RETENTION_DAYS='$RETENTION_DAYS' CRON_LOG='$CRON_LOG' $cron_cmd >> '$CRON_LOG' 2>&1"

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

  echo "[ok] Rotina agendada para todos os dias às $(printf '%02d:%02d' "$CRON_HOUR" "$CRON_MINUTE") (hora local do servidor)."
  echo "[info] Logs: $CRON_LOG"
}

INSTALL_CRON=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --world-dir)
      if [[ $# -lt 2 ]]; then
        echo "[erro] --world-dir exige um caminho."
        exit 1
      fi
      WORLD_DIR="$2"
      shift 2
      ;;
    --install-cron)
      INSTALL_CRON=1
      shift
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

if [[ "$INSTALL_CRON" -eq 1 ]]; then
  install_cron
else
  create_backup
fi
