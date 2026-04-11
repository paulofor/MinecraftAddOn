#!/usr/bin/env python3
"""Valida compatibilidade de versões do add-on com uma versão de Bedrock informada.

Regra: toda `format_version` e `min_engine_version` deve ser <= versão do servidor.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


VERSION_RE = re.compile(r"^(\d+)\.(\d+)\.(\d+)$")


def parse_triplet(value: str) -> tuple[int, int, int]:
    m = VERSION_RE.match(value.strip())
    if not m:
        raise ValueError(f"versão inválida: {value!r}; esperado X.Y.Z")
    return tuple(int(part) for part in m.groups())


def parse_manifest_min_engine(path: Path) -> tuple[int, int, int] | None:
    data = json.loads(path.read_text(encoding="utf-8"))
    mev = data.get("header", {}).get("min_engine_version")
    if isinstance(mev, list) and len(mev) == 3 and all(isinstance(x, int) for x in mev):
        return tuple(mev)
    return None


def iter_format_versions(root: Path):
    for json_path in root.rglob("*.json"):
        try:
            data = json.loads(json_path.read_text(encoding="utf-8"))
        except Exception:
            continue
        fv = data.get("format_version")
        if isinstance(fv, str) and VERSION_RE.match(fv):
            yield json_path, parse_triplet(fv)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--server-version", required=True, help="Versão Bedrock no formato X.Y.Z")
    parser.add_argument("--repo-dir", default=".", help="Raiz do repositório")
    args = parser.parse_args()

    repo = Path(args.repo_dir).resolve()
    server_version = parse_triplet(args.server_version)

    errors: list[str] = []

    for manifest in [
        repo / "packs/BP_QuadroIdeias/manifest.json",
        repo / "packs/RP_QuadroIdeias/manifest.json",
    ]:
        mev = parse_manifest_min_engine(manifest)
        if mev and mev > server_version:
            errors.append(
                f"{manifest.relative_to(repo)} min_engine_version={mev} > server={server_version}"
            )

    for json_path, fv in iter_format_versions(repo / "packs/BP_QuadroIdeias"):
        if fv > server_version:
            errors.append(f"{json_path.relative_to(repo)} format_version={fv} > server={server_version}")

    if errors:
        print("INCOMPATÍVEL: versões acima da versão do servidor detectadas:")
        for err in errors:
            print(f" - {err}")
        return 1

    print("OK: todas as versões declaradas são <= versão do servidor.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
