#!/usr/bin/env python3
"""Valida o contrato operacional mínimo dos pipelines Bedrock.

Este verificador é propositalmente estático: ele não acessa o VPS nem o
GitHub. A intenção é falhar cedo quando uma mudança em workflow, compose ou
script quebrar os invariantes de deploy documentados para este repositório.
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CANONICAL_HOST = "186.202.209.206"
CANONICAL_WORLD_DIR = "/root/MinecraftServer/worlds/Bedrock level"
CANONICAL_LOG_DIR = "/root/MinecraftServer/logging"
CANONICAL_LOG_FILE = "/root/MinecraftServer/logging/bedrock.log"
CANONICAL_MCP_URL = "http://186.202.209.206/mcp"


@dataclass(frozen=True)
class RequiredText:
    path: str
    text: str
    reason: str


REQUIRED_TEXTS = (
    RequiredText(
        ".github/workflows/publish-server.yml",
        f"VPS_HOST: {CANONICAL_HOST}",
        "o deploy principal deve apontar para o host remoto canônico",
    ),
    RequiredText(
        ".github/workflows/publish-server.yml",
        "REMOTE_DIR: ${{ vars.VPS_DESTINO || '/root/MinecraftAddOn' }}",
        "o diretório remoto deve manter fallback operacional conhecido",
    ),
    RequiredText(
        ".github/workflows/publish-server.yml",
        f"WORLD_DIR: ${{{{ vars.BEDROCK_WORLD_DIR || '{CANONICAL_WORLD_DIR}' }}}}",
        "o mundo padrão do workflow deve ser o mundo Bedrock ativo esperado",
    ),
    RequiredText(
        ".github/workflows/publish-server.yml",
        "--exclude='*.png'",
        "PNGs não podem ser publicados pelo workflow GitHub",
    ),
    RequiredText(
        ".github/workflows/publish-server.yml",
        "write_png_base64",
        "o workflow deve preservar a orientação de PNG via MCP nos comentários operacionais",
    ),
    RequiredText(
        ".github/workflows/publish-server.yml",
        f"LOG_FILE='{CANONICAL_LOG_FILE}'",
        "validação de runtime deve ler o log canônico do Bedrock",
    ),
    RequiredText(
        ".github/workflows/publish-server.yml",
        "artifacts/bedrock_diag_pre.txt",
        "diagnósticos pré-restart devem ser baixados como artefato",
    ),
    RequiredText(
        ".github/workflows/publish-server.yml",
        "artifacts/bedrock_diag_post.txt",
        "diagnósticos pós-restart devem ser baixados como artefato",
    ),
    RequiredText(
        ".github/workflows/publish-mcp-server.yml",
        f"VPS_HOST: {CANONICAL_HOST}",
        "o deploy dedicado do MCP deve apontar para o host remoto canônico",
    ),
    RequiredText(
        ".github/workflows/publish-mcp-server.yml",
        f"HOST_LOG_DIR='{CANONICAL_LOG_DIR}'",
        "o MCP deve ser publicado com o diretório canônico de logs",
    ),
    RequiredText(
        "docker-compose.mcp-bedrock-readonly.yml",
        f"{CANONICAL_LOG_DIR}",
        "o compose do MCP deve expor o diretório canônico de logs",
    ),
    RequiredText(
        "docker-compose.mcp-bedrock-readonly.yml",
        "${MCP_HOST_PORT:-80}:${MCP_HTTP_PORT:-8765}",
        "o MCP readonly deve manter o mapeamento HTTP externo atual",
    ),
    RequiredText(
        "docker-compose.log-viewer.yml",
        f"{CANONICAL_LOG_FILE}:{CANONICAL_LOG_FILE}:ro",
        "o Log Viewer deve montar somente o arquivo canônico de log",
    ),
    RequiredText(
        "AGENTS.md",
        CANONICAL_MCP_URL,
        "o playbook operacional deve documentar a URL externa canônica do MCP",
    ),
    RequiredText(
        "AGENTS.md",
        "Arquivos `.png` devem **sempre** ser enviados para o host usando o MCP Server",
        "a regra operacional de PNG fora do Git precisa permanecer documentada",
    ),
)


SCRIPT_PATHS = (
    "tools/update_world_bindings_remote.sh",
    "tools/validate_world_bindings_remote.sh",
    "tools/diagnosticar_log_bedrock.sh",
)


WORKFLOW_PATHS = (
    ".github/workflows/publish-server.yml",
    ".github/workflows/publish-mcp-server.yml",
    ".github/workflows/validate-world-bindings.yml",
    ".github/workflows/validate-pipeline-contract.yml",
)


PLAN_PATH = "docs/implementacao/backend/plano-pipelines-contrato-operacional.md"
REGISTRY_PATH = "docs/registros1.md"


class ContractError(Exception):
    """Erro acumulável de contrato operacional."""


def read_text(relative_path: str) -> str:
    path = ROOT / relative_path
    if not path.exists():
        raise ContractError(f"arquivo obrigatório ausente: {relative_path}")
    return path.read_text(encoding="utf-8")


def require_text(check: RequiredText) -> None:
    content = read_text(check.path)
    if check.text not in content:
        raise ContractError(f"{check.path}: texto obrigatório ausente ({check.reason}): {check.text!r}")


def validate_shell_contract(relative_path: str) -> None:
    content = read_text(relative_path)
    lines = content.splitlines()
    if not lines or lines[0] != "#!/usr/bin/env bash":
        raise ContractError(f"{relative_path}: scripts operacionais devem iniciar com '#!/usr/bin/env bash'")
    if "set -euo pipefail" not in content:
        raise ContractError(f"{relative_path}: scripts operacionais devem usar 'set -euo pipefail'")


def validate_workflow(relative_path: str) -> None:
    content = read_text(relative_path)
    if "uses: actions/checkout@v4" not in content:
        raise ContractError(f"{relative_path}: workflow deve fazer checkout explícito com actions/checkout@v4")
    if "workflow_dispatch:" not in content:
        raise ContractError(f"{relative_path}: workflow deve permitir execução manual por workflow_dispatch")


def validate_plan() -> None:
    content = read_text(PLAN_PATH)
    required_fragments = (
        "## Fase 1",
        "Registro pós-conclusão",
        "o que foi feito",
        "o que ficou faltando",
        "impedimentos/bloqueios",
    )
    for fragment in required_fragments:
        if fragment not in content:
            raise ContractError(f"{PLAN_PATH}: fragmento obrigatório ausente: {fragment!r}")


def validate_registry() -> None:
    content = read_text(REGISTRY_PATH)
    if "Contrato operacional de pipelines" not in content:
        raise ContractError(f"{REGISTRY_PATH}: registro desta execução não foi encontrado")


def collect_errors() -> list[str]:
    errors: list[str] = []

    checks = [lambda check=check: require_text(check) for check in REQUIRED_TEXTS]
    checks.extend(lambda path=path: validate_shell_contract(path) for path in SCRIPT_PATHS)
    checks.extend(lambda path=path: validate_workflow(path) for path in WORKFLOW_PATHS)
    checks.extend((validate_plan, validate_registry))

    for check in checks:
        try:
            check()
        except ContractError as exc:
            errors.append(str(exc))

    return errors


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Valida contrato operacional estático dos pipelines Bedrock.")
    parser.add_argument("--quiet", action="store_true", help="Exibe somente erros.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    errors = collect_errors()

    if errors:
        for error in errors:
            print(f"[erro] {error}", file=sys.stderr)
        return 1

    if not args.quiet:
        print("[ok] Contrato operacional de pipelines validado.")
        print(f"[ok] Host canônico: {CANONICAL_HOST}")
        print(f"[ok] Mundo canônico: {CANONICAL_WORLD_DIR}")
        print(f"[ok] Log canônico: {CANONICAL_LOG_FILE}")
        print("[ok] Regra PNG fora do workflow confirmada por checks estáticos.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
