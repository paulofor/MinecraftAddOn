#!/usr/bin/env python3
"""Valida os vínculos de packs de um mundo Bedrock contra manifests do projeto."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_BP_MANIFEST = ROOT / "packs" / "BP_QuadroIdeias" / "manifest.json"
DEFAULT_RP_MANIFEST = ROOT / "packs" / "RP_QuadroIdeias" / "manifest.json"


def load_json(path: Path) -> dict | list:
    if not path.exists():
        raise FileNotFoundError(f"Arquivo não encontrado: {path}")

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"JSON inválido em {path}: {exc}") from exc


def version_to_list(version: object, *, source: str) -> list[int]:
    if not isinstance(version, list) or not version or not all(isinstance(x, int) for x in version):
        raise ValueError(f"Versão inválida em {source}: esperado array de inteiros, recebido {version!r}")
    return version


def get_manifest_values(manifest_path: Path, *, label: str) -> tuple[str, list[int]]:
    manifest = load_json(manifest_path)
    if not isinstance(manifest, dict):
        raise ValueError(f"Manifest {label} inválido em {manifest_path}: esperado objeto JSON")

    header = manifest.get("header")
    if not isinstance(header, dict):
        raise ValueError(f"Manifest {label} sem objeto header em {manifest_path}")

    uuid = header.get("uuid")
    if not isinstance(uuid, str) or not uuid:
        raise ValueError(f"Manifest {label} sem UUID válido em {manifest_path}")

    version = version_to_list(header.get("version"), source=f"{manifest_path} header.version")
    return uuid, version


def find_pack_entry(data: object, *, target_uuid: str, source: Path) -> dict | None:
    if not isinstance(data, list):
        raise ValueError(f"Esperado array JSON em {source}, recebido {type(data).__name__}")

    for item in data:
        if isinstance(item, dict) and item.get("pack_id") == target_uuid:
            return item
    return None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Valida world_behavior_packs.json e world_resource_packs.json "
            "comparando UUID/versão com os manifests atuais."
        )
    )
    parser.add_argument("--world-dir", required=True, help="Diretório do mundo Bedrock")
    parser.add_argument("--bp-manifest", default=str(DEFAULT_BP_MANIFEST), help="Caminho do manifest BP")
    parser.add_argument("--rp-manifest", default=str(DEFAULT_RP_MANIFEST), help="Caminho do manifest RP")
    parser.add_argument(
        "--expected-bp-uuid",
        default="068c529a-0932-4d6b-95ee-da0af9fb8e23",
        help="UUID esperado do Behavior Pack",
    )
    parser.add_argument(
        "--expected-rp-uuid",
        default="99378e84-5b66-408a-b77c-1cc7b33f2b0b",
        help="UUID esperado do Resource Pack",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    world_dir = Path(args.world_dir).expanduser().resolve()
    bp_manifest = Path(args.bp_manifest).expanduser().resolve()
    rp_manifest = Path(args.rp_manifest).expanduser().resolve()

    try:
        bp_manifest_uuid, bp_manifest_version = get_manifest_values(bp_manifest, label="BP")
        rp_manifest_uuid, rp_manifest_version = get_manifest_values(rp_manifest, label="RP")

        if bp_manifest_uuid != args.expected_bp_uuid:
            raise ValueError(
                "UUID do manifest BP não confere com o esperado: "
                f"{bp_manifest_uuid} != {args.expected_bp_uuid}"
            )

        if rp_manifest_uuid != args.expected_rp_uuid:
            raise ValueError(
                "UUID do manifest RP não confere com o esperado: "
                f"{rp_manifest_uuid} != {args.expected_rp_uuid}"
            )

        world_bp_file = world_dir / "world_behavior_packs.json"
        world_rp_file = world_dir / "world_resource_packs.json"

        world_bp = load_json(world_bp_file)
        world_rp = load_json(world_rp_file)

        bp_entry = find_pack_entry(world_bp, target_uuid=args.expected_bp_uuid, source=world_bp_file)
        if bp_entry is None:
            raise ValueError(f"UUID BP {args.expected_bp_uuid} não encontrado em {world_bp_file}")

        rp_entry = find_pack_entry(world_rp, target_uuid=args.expected_rp_uuid, source=world_rp_file)
        if rp_entry is None:
            raise ValueError(f"UUID RP {args.expected_rp_uuid} não encontrado em {world_rp_file}")

        bp_world_version = version_to_list(bp_entry.get("version"), source=f"{world_bp_file} versão do BP")
        rp_world_version = version_to_list(rp_entry.get("version"), source=f"{world_rp_file} versão do RP")

        if bp_world_version != bp_manifest_version:
            raise ValueError(
                f"Versão do BP no mundo ({bp_world_version}) difere do manifest ({bp_manifest_version})"
            )

        if rp_world_version != rp_manifest_version:
            raise ValueError(
                f"Versão do RP no mundo ({rp_world_version}) difere do manifest ({rp_manifest_version})"
            )

    except (FileNotFoundError, ValueError) as exc:
        print(f"[erro] {exc}")
        return 1

    print("[ok] world_behavior_packs.json e world_resource_packs.json estão consistentes com os manifests.")
    print(f"[ok] BP UUID/versão: {args.expected_bp_uuid} {bp_manifest_version}")
    print(f"[ok] RP UUID/versão: {args.expected_rp_uuid} {rp_manifest_version}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
