#!/usr/bin/env python3
"""Atualiza os vínculos de packs de um mundo Bedrock com base nos manifests do projeto."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_BP_MANIFEST = ROOT / "packs" / "BP_IlhaLogicaComputacao" / "manifest.json"
DEFAULT_RP_MANIFEST = ROOT / "packs" / "RP_IlhaLogicaComputacao" / "manifest.json"


def load_manifest(path: Path, *, label: str) -> tuple[str, list[int]]:
    if not path.exists():
        raise FileNotFoundError(f"Manifest {label} não encontrado: {path}")

    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"Manifest {label} inválido em {path}: esperado objeto JSON")

    header = data.get("header", {})
    if not isinstance(header, dict):
        raise ValueError(f"Manifest {label} inválido em {path}: header ausente")

    pack_id = header.get("uuid")
    version = header.get("version")

    if not isinstance(pack_id, str) or not pack_id:
        raise ValueError(f"Manifest {label} inválido em {path}: uuid ausente")

    if not isinstance(version, list) or not all(isinstance(v, int) for v in version):
        raise ValueError(f"Manifest {label} inválido em {path}: version deve ser array de inteiros")

    return pack_id, version


def load_world_bindings(path: Path) -> list[dict]:
    if not path.exists():
        return []

    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError(f"Arquivo inválido (esperado array JSON): {path}")

    return [item for item in data if isinstance(item, dict)]


def upsert_binding(bindings: list[dict], pack_id: str, version: list[int]) -> list[dict]:
    next_bindings = [entry for entry in bindings if entry.get("pack_id") != pack_id]
    next_bindings.append({"pack_id": pack_id, "version": version})
    return next_bindings


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Atualiza world_behavior_packs.json e world_resource_packs.json com versões dos manifests."
    )
    parser.add_argument("--world-dir", required=True, help="Diretório do mundo Bedrock")
    parser.add_argument("--bp-manifest", default=str(DEFAULT_BP_MANIFEST), help="Caminho do manifest BP")
    parser.add_argument("--rp-manifest", default=str(DEFAULT_RP_MANIFEST), help="Caminho do manifest RP")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    world_dir = Path(args.world_dir).expanduser().resolve()
    bp_manifest = Path(args.bp_manifest).expanduser().resolve()
    rp_manifest = Path(args.rp_manifest).expanduser().resolve()

    try:
        bp_id, bp_version = load_manifest(bp_manifest, label="BP")
        rp_id, rp_version = load_manifest(rp_manifest, label="RP")

        world_bp_file = world_dir / "world_behavior_packs.json"
        world_rp_file = world_dir / "world_resource_packs.json"

        world_bp = upsert_binding(load_world_bindings(world_bp_file), bp_id, bp_version)
        world_rp = upsert_binding(load_world_bindings(world_rp_file), rp_id, rp_version)

        world_bp_file.write_text(json.dumps(world_bp, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        world_rp_file.write_text(json.dumps(world_rp, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    except (FileNotFoundError, ValueError, json.JSONDecodeError) as exc:
        print(f"[erro] {exc}")
        return 1

    print("[ok] world_behavior_packs.json atualizado.")
    print("[ok] world_resource_packs.json atualizado.")
    print(f"[ok] BP: {bp_id} {bp_version}")
    print(f"[ok] RP: {rp_id} {rp_version}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
