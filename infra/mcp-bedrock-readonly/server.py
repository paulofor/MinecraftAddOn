#!/usr/bin/env python3
"""Servidor MCP (stdio) com ferramentas somente leitura para host Bedrock."""

from __future__ import annotations

import base64
import json
import math
import os
import re
import shutil
import struct
import subprocess
import tempfile
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

SERVER_NAME = "bedrock-readonly"
SERVER_VERSION = "0.5.0"
PROTOCOL_VERSION = "2024-11-05"

DEFAULT_ALLOWED_ROOTS = (
  "/root/MinecraftServer,/root/MinecraftServer/logging,"
  "/root/MinecraftServer/logging/bedrock.log,/root/MinecraftAddOn,/root/Uploads"
)
ALLOWED_ROOTS = [
  Path(part.strip()).resolve()
  for part in os.getenv("ALLOWED_ROOTS", DEFAULT_ALLOWED_ROOTS).split(",")
  if part.strip()
]
DEFAULT_CMD_TIMEOUT = int(os.getenv("READ_CMD_TIMEOUT", "10"))
DEFAULT_MAX_FILE_BYTES = int(os.getenv("MAX_FILE_BYTES", "200000"))
TRANSPORT = os.getenv("MCP_TRANSPORT", "stdio").strip().lower()
HTTP_HOST = os.getenv("MCP_HTTP_HOST", "0.0.0.0")
HTTP_PORT = int(os.getenv("MCP_HTTP_PORT", "8765"))
MAX_BLOCK_REGION_VOLUME = int(os.getenv("MAX_BLOCK_REGION_VOLUME", "4096"))

BEDROCK_RESTART_CMD = [part for part in os.getenv("BEDROCK_RESTART_CMD", "").split() if part]

SAFE_COMMANDS = {
  "cat",
  "head",
  "tail",
  "ls",
  "find",
  "stat",
  "du",
  "df",
  "wc",
  "journalctl",
}


def _error(code: int, message: str, *, data: Any | None = None) -> dict[str, Any]:
  payload = {"code": code, "message": message}
  if data is not None:
    payload["data"] = data
  return payload


def _is_path_allowed(path_value: str) -> tuple[bool, Path]:
  path = Path(path_value).expanduser().resolve()
  for allowed in ALLOWED_ROOTS:
    if path == allowed or allowed in path.parents:
      return True, path
  return False, path


def _list_directory(path: str) -> dict[str, Any]:
  ok, resolved = _is_path_allowed(path)
  if not ok:
    raise ValueError(f"Caminho fora do escopo permitido: {resolved}")
  if not resolved.exists() or not resolved.is_dir():
    raise ValueError(f"Diretório inexistente: {resolved}")

  entries = []
  for item in sorted(resolved.iterdir(), key=lambda p: p.name.lower()):
    entries.append(
      {
        "name": item.name,
        "type": "dir" if item.is_dir() else "file",
        "size": item.stat().st_size if item.is_file() else None,
      }
    )
  return {"path": str(resolved), "entries": entries}


def _read_file(path: str, max_bytes: int | None = None) -> dict[str, Any]:
  limit = max_bytes if isinstance(max_bytes, int) and max_bytes > 0 else DEFAULT_MAX_FILE_BYTES
  ok, resolved = _is_path_allowed(path)
  if not ok:
    raise ValueError(f"Caminho fora do escopo permitido: {resolved}")
  if not resolved.exists() or not resolved.is_file():
    raise ValueError(f"Arquivo inexistente: {resolved}")

  raw = resolved.read_bytes()[:limit]
  text = raw.decode("utf-8", errors="replace")
  return {
    "path": str(resolved),
    "bytes_returned": len(raw),
    "truncated": resolved.stat().st_size > len(raw),
    "content": text,
  }


def _run_read_command(
  command: str,
  args: list[str] | None = None,
  cwd: str | None = None,
  timeout_seconds: int | None = None,
) -> dict[str, Any]:
  if command not in SAFE_COMMANDS:
    raise ValueError(f"Comando não permitido: {command}")

  argv = [command] + [str(arg) for arg in (args or [])]
  timeout = timeout_seconds if isinstance(timeout_seconds, int) and timeout_seconds > 0 else DEFAULT_CMD_TIMEOUT

  effective_cwd = cwd or "/root/MinecraftServer"
  ok, resolved_cwd = _is_path_allowed(effective_cwd)
  if not ok:
    raise ValueError(f"cwd fora do escopo permitido: {resolved_cwd}")

  completed = subprocess.run(
    argv,
    cwd=str(resolved_cwd),
    capture_output=True,
    text=True,
    timeout=timeout,
    check=False,
  )

  return {
    "command": argv,
    "cwd": str(resolved_cwd),
    "exit_code": completed.returncode,
    "stdout": completed.stdout,
    "stderr": completed.stderr,
  }





SUBCHUNK_PREFIX_TAG = 47
OVERWORLD_DIMENSION_ID = 0


def _read_unsigned_varint(data: bytes, offset: int) -> tuple[int, int]:
  value = 0
  shift = 0
  while True:
    if offset >= len(data):
      raise ValueError("Varint incompleto no subchunk")
    byte = data[offset]
    offset += 1
    value |= (byte & 0x7F) << shift
    if (byte & 0x80) == 0:
      return value, offset
    shift += 7
    if shift > 35:
      raise ValueError("Varint muito longo no subchunk")


class _LittleEndianNbtReader:
  def __init__(self, data: bytes, offset: int = 0) -> None:
    self.data = data
    self.offset = offset

  def read_u8(self) -> int:
    if self.offset >= len(self.data):
      raise ValueError("NBT truncado")
    value = self.data[self.offset]
    self.offset += 1
    return value

  def read_i8(self) -> int:
    value = struct.unpack_from("<b", self.data, self.offset)[0]
    self.offset += 1
    return value

  def read_i16(self) -> int:
    value = struct.unpack_from("<h", self.data, self.offset)[0]
    self.offset += 2
    return value

  def read_i32(self) -> int:
    value = struct.unpack_from("<i", self.data, self.offset)[0]
    self.offset += 4
    return value

  def read_i64(self) -> int:
    value = struct.unpack_from("<q", self.data, self.offset)[0]
    self.offset += 8
    return value

  def read_f32(self) -> float:
    value = struct.unpack_from("<f", self.data, self.offset)[0]
    self.offset += 4
    return value

  def read_f64(self) -> float:
    value = struct.unpack_from("<d", self.data, self.offset)[0]
    self.offset += 8
    return value

  def read_string(self) -> str:
    length = struct.unpack_from("<H", self.data, self.offset)[0]
    self.offset += 2
    raw = self.data[self.offset:self.offset + length]
    self.offset += length
    return raw.decode("utf-8", errors="replace")

  def read_payload(self, tag_type: int) -> Any:
    if tag_type == 1:  # TAG_Byte
      return self.read_i8()
    if tag_type == 2:  # TAG_Short
      return self.read_i16()
    if tag_type == 3:  # TAG_Int
      return self.read_i32()
    if tag_type == 4:  # TAG_Long
      return self.read_i64()
    if tag_type == 5:  # TAG_Float
      return self.read_f32()
    if tag_type == 6:  # TAG_Double
      return self.read_f64()
    if tag_type == 7:  # TAG_Byte_Array
      length = self.read_i32()
      raw = self.data[self.offset:self.offset + length]
      self.offset += length
      return list(raw)
    if tag_type == 8:  # TAG_String
      return self.read_string()
    if tag_type == 9:  # TAG_List
      child_type = self.read_u8()
      length = self.read_i32()
      return [self.read_payload(child_type) for _ in range(max(0, length))]
    if tag_type == 10:  # TAG_Compound
      return self.read_compound_payload()
    if tag_type == 11:  # TAG_Int_Array
      length = self.read_i32()
      values = []
      for _ in range(max(0, length)):
        values.append(self.read_i32())
      return values
    if tag_type == 12:  # TAG_Long_Array
      length = self.read_i32()
      values = []
      for _ in range(max(0, length)):
        values.append(self.read_i64())
      return values
    raise ValueError(f"Tipo NBT não suportado: {tag_type}")

  def read_compound_payload(self) -> dict[str, Any]:
    payload: dict[str, Any] = {}
    while True:
      tag_type = self.read_u8()
      if tag_type == 0:
        return payload
      name = self.read_string()
      payload[name] = self.read_payload(tag_type)

  def read_root_compound(self) -> dict[str, Any]:
    tag_type = self.read_u8()
    if tag_type != 10:
      raise ValueError(f"NBT raiz não é compound: {tag_type}")
    # Nome da raiz costuma ser vazio nas paletas Bedrock, mas ainda precisa ser consumido.
    self.read_string()
    return self.read_compound_payload()


def _open_leveldb(world_path: str, use_snapshot: bool = True):
  try:
    import plyvel  # type: ignore[import-not-found]
  except Exception as exc:  # noqa: BLE001
    raise RuntimeError(
      "Leitura bloco-a-bloco requer o pacote Python 'plyvel'. Recrie a imagem do MCP para instalar a dependência."
    ) from exc

  ok, resolved_world = _is_path_allowed(world_path)
  if not ok:
    raise ValueError(f"world_path fora do escopo permitido: {resolved_world}")
  db_path = resolved_world / "db"
  if not db_path.exists() or not db_path.is_dir():
    raise ValueError(f"LevelDB do mundo não encontrado: {db_path}")

  cleanup_path: Path | None = None
  open_path = db_path
  if use_snapshot:
    cleanup_path = Path(tempfile.mkdtemp(prefix="bedrock-leveldb-snapshot-"))
    snapshot_db_path = cleanup_path / "db"
    shutil.copytree(db_path, snapshot_db_path)
    open_path = snapshot_db_path

  return plyvel.DB(str(open_path), create_if_missing=False), resolved_world, cleanup_path


def _dimension_prefix(chunk_x: int, chunk_z: int, dimension: int) -> bytes:
  if dimension == OVERWORLD_DIMENSION_ID:
    return struct.pack("<ii", chunk_x, chunk_z)
  return struct.pack("<iii", chunk_x, chunk_z, dimension)


def _subchunk_key(chunk_x: int, chunk_z: int, subchunk_y: int, dimension: int) -> bytes:
  signed_subchunk_y = subchunk_y if subchunk_y < 128 else subchunk_y - 256
  return _dimension_prefix(chunk_x, chunk_z, dimension) + bytes([SUBCHUNK_PREFIX_TAG]) + struct.pack("<b", signed_subchunk_y)


def _palette_name(entry: Any) -> str:
  if isinstance(entry, dict):
    name = entry.get("name") or entry.get("Name")
    if isinstance(name, str):
      return name
  return str(entry)


def _decode_subchunk_palette(value: bytes) -> list[str]:
  if not value:
    raise ValueError("Subchunk vazio")

  offset = 0
  version = value[offset]
  offset += 1

  if version in (8, 9):
    if offset >= len(value):
      raise ValueError("Subchunk sem contador de storages")
    storage_count = value[offset]
    offset += 1
  else:
    storage_count = 1

  decoded_layers: list[list[str]] = []
  for _ in range(storage_count):
    if offset >= len(value):
      break
    header = value[offset]
    offset += 1
    bits_per_block = header >> 1

    if bits_per_block == 0:
      words_count = 0
    else:
      values_per_word = max(1, 32 // bits_per_block)
      words_count = math.ceil(4096 / values_per_word)

    words = []
    for _word_index in range(words_count):
      if offset + 4 > len(value):
        raise ValueError("Subchunk truncado ao ler índices de blocos")
      words.append(struct.unpack_from("<I", value, offset)[0])
      offset += 4

    palette_size, offset = _read_unsigned_varint(value, offset)
    palette = []
    for _palette_index in range(palette_size):
      reader = _LittleEndianNbtReader(value, offset)
      palette.append(_palette_name(reader.read_root_compound()))
      offset = reader.offset

    layer = []
    if bits_per_block == 0:
      block_name = palette[0] if palette else "minecraft:air"
      layer = [block_name] * 4096
    else:
      mask = (1 << bits_per_block) - 1
      values_per_word = max(1, 32 // bits_per_block)
      for block_index in range(4096):
        word = words[block_index // values_per_word]
        shift = (block_index % values_per_word) * bits_per_block
        palette_index = (word >> shift) & mask
        layer.append(palette[palette_index] if palette_index < len(palette) else "minecraft:unknown")
    decoded_layers.append(layer)

  if not decoded_layers:
    return ["minecraft:air"] * 4096
  return decoded_layers[0]


def _block_index(local_x: int, local_y: int, local_z: int) -> int:
  return (local_y << 8) | (local_z << 4) | local_x


def _get_block_from_db(db: Any, x: int, y: int, z: int, dimension: int) -> dict[str, Any]:
  chunk_x = x >> 4
  chunk_z = z >> 4
  local_x = x & 15
  local_y = y & 15
  local_z = z & 15
  subchunk_y = y >> 4
  key = _subchunk_key(chunk_x, chunk_z, subchunk_y, dimension)
  value = db.get(key)
  if value is None:
    return {
      "x": x,
      "y": y,
      "z": z,
      "dimension": dimension,
      "chunk": {"x": chunk_x, "z": chunk_z, "subchunk_y": subchunk_y},
      "block": "minecraft:air",
      "source": "missing_subchunk",
    }

  blocks = _decode_subchunk_palette(value)
  return {
    "x": x,
    "y": y,
    "z": z,
    "dimension": dimension,
    "chunk": {"x": chunk_x, "z": chunk_z, "subchunk_y": subchunk_y},
    "block": blocks[_block_index(local_x, local_y, local_z)],
    "source": "leveldb_subchunk",
  }


def _get_block(
  world_path: str = "/root/MinecraftServer/worlds/Bedrock level",
  x: int = 0,
  y: int = 64,
  z: int = 0,
  dimension: int = OVERWORLD_DIMENSION_ID,
  use_snapshot: bool = True,
) -> dict[str, Any]:
  db, resolved_world, cleanup_path = _open_leveldb(world_path, use_snapshot=use_snapshot)
  try:
    result = _get_block_from_db(db, x, y, z, dimension)
    result["world_path"] = str(resolved_world)
    result["snapshot_used"] = use_snapshot
    return result
  finally:
    db.close()
    if cleanup_path is not None:
      shutil.rmtree(cleanup_path, ignore_errors=True)


def _get_block_region(
  world_path: str = "/root/MinecraftServer/worlds/Bedrock level",
  x1: int = 0,
  y1: int = 64,
  z1: int = 0,
  x2: int = 0,
  y2: int = 64,
  z2: int = 0,
  dimension: int = OVERWORLD_DIMENSION_ID,
  include_air: bool = True,
  use_snapshot: bool = True,
) -> dict[str, Any]:
  min_x, max_x = sorted((x1, x2))
  min_y, max_y = sorted((y1, y2))
  min_z, max_z = sorted((z1, z2))
  volume = (max_x - min_x + 1) * (max_y - min_y + 1) * (max_z - min_z + 1)
  if volume > MAX_BLOCK_REGION_VOLUME:
    raise ValueError(f"Região solicitada tem {volume} blocos; limite atual: {MAX_BLOCK_REGION_VOLUME}")

  db, resolved_world, cleanup_path = _open_leveldb(world_path, use_snapshot=use_snapshot)
  try:
    blocks = []
    for y in range(min_y, max_y + 1):
      for z in range(min_z, max_z + 1):
        for x in range(min_x, max_x + 1):
          block = _get_block_from_db(db, x, y, z, dimension)
          if include_air or block["block"] != "minecraft:air":
            blocks.append(block)
    return {
      "world_path": str(resolved_world),
      "dimension": dimension,
      "bounds": {"x": [min_x, max_x], "y": [min_y, max_y], "z": [min_z, max_z]},
      "volume": volume,
      "returned_blocks": len(blocks),
      "include_air": include_air,
      "snapshot_used": use_snapshot,
      "blocks": blocks,
    }
  finally:
    db.close()
    if cleanup_path is not None:
      shutil.rmtree(cleanup_path, ignore_errors=True)


_COORD_RE = re.compile(
  r"(?:pos|ultima_pos)=\(\s*"
  r"(?P<x>-?\d+(?:\.\d+)?)\s*,\s*"
  r"(?P<y>-?\d+(?:\.\d+)?)\s*,\s*"
  r"(?P<z>-?\d+(?:\.\d+)?)\s*\)"
)


def _read_tail_bytes(path: Path, max_bytes: int) -> str:
  size = path.stat().st_size
  with path.open("rb") as handle:
    if size > max_bytes:
      handle.seek(size - max_bytes)
    raw = handle.read(max_bytes)
  return raw.decode("utf-8", errors="replace")


def _extract_log_points(log_text: str, max_points: int) -> list[dict[str, float]]:
  points: list[dict[str, float]] = []
  for match in _COORD_RE.finditer(log_text):
    points.append(
      {
        "x": float(match.group("x")),
        "y": float(match.group("y")),
        "z": float(match.group("z")),
      }
    )
  return points[-max_points:]


def _distance_2d(candidate: tuple[float, float], point: dict[str, float]) -> float:
  return math.hypot(candidate[0] - point["x"], candidate[1] - point["z"])


def _score_candidate(
  candidate: tuple[float, float],
  points: list[dict[str, float]],
  center: tuple[float, float],
  minimum_distance: float,
  preferred_distance: float,
) -> tuple[float, float]:
  nearest = min((_distance_2d(candidate, point) for point in points), default=preferred_distance)
  distance_to_activity_center = math.hypot(candidate[0] - center[0], candidate[1] - center[1])

  if nearest < minimum_distance:
    return (-10000.0 - (minimum_distance - nearest), nearest)

  # Prefere ficar fora da área recente, mas ainda perto o bastante para os jogadores chegarem.
  near_preference = -abs(nearest - preferred_distance)
  access_penalty = distance_to_activity_center * 0.08
  return (near_preference - access_penalty, nearest)


def _suggest_arena_location(
  world_path: str = "/root/MinecraftServer/worlds/Bedrock level",
  log_path: str = "/root/MinecraftServer/logging/bedrock.log",
  size_x: int = 19,
  size_y: int = 10,
  size_z: int = 19,
  preferred_y: int = 64,
  margin: int = 48,
  max_log_bytes: int = 300000,
  max_points: int = 250,
) -> dict[str, Any]:
  ok_world, resolved_world = _is_path_allowed(world_path)
  if not ok_world:
    raise ValueError(f"world_path fora do escopo permitido: {resolved_world}")
  if not resolved_world.exists() or not resolved_world.is_dir():
    raise ValueError(f"Diretório de mundo inexistente: {resolved_world}")

  ok_log, resolved_log = _is_path_allowed(log_path)
  if not ok_log:
    raise ValueError(f"log_path fora do escopo permitido: {resolved_log}")
  if not resolved_log.exists() or not resolved_log.is_file():
    raise ValueError(f"Arquivo de log inexistente: {resolved_log}")

  if size_x <= 0 or size_y <= 0 or size_z <= 0:
    raise ValueError("size_x, size_y e size_z devem ser positivos")
  if margin < 0:
    raise ValueError("margin deve ser maior ou igual a zero")

  log_text = _read_tail_bytes(resolved_log, max_log_bytes)
  points = _extract_log_points(log_text, max_points)

  half_x = size_x // 2
  half_z = size_z // 2
  half_y_down = max(1, size_y // 3)
  half_y_up = max(1, size_y - half_y_down - 1)

  if not points:
    center_x = 0
    center_z = 0
    confidence = "low"
    reasons = [
      "Nenhuma coordenada recente foi encontrada no log; retornando origem como fallback operacional.",
    ]
    warnings = [
      "Confirme visualmente no jogo antes de montar: não houve evidência de atividade recente para orientar a escolha.",
    ]
  else:
    min_x = min(point["x"] for point in points)
    max_x = max(point["x"] for point in points)
    min_z = min(point["z"] for point in points)
    max_z = max(point["z"] for point in points)
    activity_center = ((min_x + max_x) / 2, (min_z + max_z) / 2)
    minimum_distance = max(size_x, size_z) + margin
    preferred_distance = minimum_distance + 32

    candidate_margin = margin + max(half_x, half_z)
    candidates = [
      (max_x + candidate_margin, max_z + candidate_margin),
      (max_x + candidate_margin, min_z - candidate_margin),
      (min_x - candidate_margin, max_z + candidate_margin),
      (min_x - candidate_margin, min_z - candidate_margin),
      (activity_center[0] + preferred_distance, activity_center[1]),
      (activity_center[0] - preferred_distance, activity_center[1]),
      (activity_center[0], activity_center[1] + preferred_distance),
      (activity_center[0], activity_center[1] - preferred_distance),
    ]
    scored = [(_score_candidate(candidate, points, activity_center, minimum_distance, preferred_distance), candidate) for candidate in candidates]
    scored.sort(key=lambda item: item[0][0], reverse=True)
    (_, nearest_distance), best_candidate = scored[0]
    center_x = int(round(best_candidate[0]))
    center_z = int(round(best_candidate[1]))
    confidence = "medium" if nearest_distance >= minimum_distance else "low"
    reasons = [
      f"Foram encontradas {len(points)} coordenadas recentes no log.",
      f"Área recente observada: x={min_x:.1f}..{max_x:.1f}, z={min_z:.1f}..{max_z:.1f}.",
      f"O centro sugerido fica a aproximadamente {nearest_distance:.1f} blocos da coordenada recente mais próxima.",
      "A escolha prioriza ficar fora da faixa recente, mas ainda próxima o bastante para acesso dos jogadores.",
    ]
    warnings = [
      "A ferramenta usa logs e heurística; ela não faz varredura visual/bloco-a-bloco do terreno.",
      "Confirme no jogo se não há construção importante antes de executar a função de montagem.",
    ]

  affected_area = {
    "x": [center_x - half_x, center_x + half_x],
    "y": [preferred_y - half_y_down, preferred_y + half_y_up],
    "z": [center_z - half_z, center_z + half_z],
  }

  return {
    "world_path": str(resolved_world),
    "log_path": str(resolved_log),
    "recommended_center": {"x": center_x, "y": preferred_y, "z": center_z},
    "affected_area": affected_area,
    "arena_size": {"x": size_x, "y": size_y, "z": size_z},
    "confidence": confidence,
    "evidence_points": len(points),
    "reasons": reasons,
    "warnings": warnings,
    "operator_commands": [
      f"/tp @s {center_x} {preferred_y} {center_z}",
      "/function misterio_historico/montar_area_interativa",
    ],
  }

def _write_png_base64(path: str, png_base64: str, overwrite: bool = False) -> dict[str, Any]:
  ok, resolved = _is_path_allowed(path)
  if not ok:
    raise ValueError(f"Caminho fora do escopo permitido: {resolved}")

  if resolved.exists() and resolved.is_dir():
    raise ValueError(f"O caminho informado é diretório: {resolved}")
  if resolved.suffix.lower() != ".png":
    raise ValueError("A ferramenta aceita somente arquivos .png")
  existed_before = resolved.exists()
  if existed_before and not overwrite:
    raise ValueError(f"Arquivo já existe (use overwrite=true): {resolved}")

  parent = resolved.parent
  if not parent.exists():
    parent.mkdir(parents=True, exist_ok=True)

  try:
    raw = base64.b64decode(png_base64, validate=True)
  except Exception as exc:  # noqa: BLE001
    raise ValueError("png_base64 inválido") from exc

  if len(raw) < 8 or raw[:8] != b"\x89PNG\r\n\x1a\n":
    raise ValueError("Conteúdo não é PNG válido (assinatura ausente)")

  resolved.write_bytes(raw)
  return {
    "path": str(resolved),
    "bytes_written": len(raw),
    "overwrote": existed_before,
  }

def _restart_bedrock() -> dict[str, Any]:
  if not BEDROCK_RESTART_CMD:
    raise ValueError("Reinício não configurado: defina BEDROCK_RESTART_CMD no ambiente do MCP")

  completed = subprocess.run(
    BEDROCK_RESTART_CMD,
    capture_output=True,
    text=True,
    timeout=DEFAULT_CMD_TIMEOUT,
    check=False,
  )

  if completed.returncode != 0:
    raise RuntimeError(
      f"Falha no restart (exit_code={completed.returncode}): {completed.stderr.strip() or completed.stdout.strip()}"
    )

  return {
    "command": BEDROCK_RESTART_CMD,
    "exit_code": completed.returncode,
    "stdout": completed.stdout,
    "stderr": completed.stderr,
    "status": "restarted",
  }


def _tools_list_result() -> dict[str, Any]:
  return {
    "tools": [
      {
        "name": "list_directory",
        "description": "Lista arquivos e diretórios permitidos no host Bedrock.",
        "inputSchema": {
          "type": "object",
          "properties": {"path": {"type": "string"}},
          "required": ["path"],
        },
      },
      {
        "name": "read_file",
        "description": "Lê um arquivo texto dentro dos diretórios permitidos.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "path": {"type": "string"},
            "max_bytes": {"type": "integer", "minimum": 1},
          },
          "required": ["path"],
        },
      },
      {
        "name": "write_png_base64",
        "description": "Escreve arquivo PNG a partir de conteúdo base64 em diretório permitido.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "path": {"type": "string"},
            "png_base64": {"type": "string"},
            "overwrite": {"type": "boolean"}
          },
          "required": ["path", "png_base64"]
        },
      },
      {
        "name": "restart_bedrock",
        "description": "Reinicia o servidor Bedrock via comando configurado em BEDROCK_RESTART_CMD.",
        "inputSchema": {
          "type": "object",
          "properties": {},
        },
      },
      {
        "name": "run_read_command",
        "description": "Executa comandos Linux somente leitura a partir de uma allowlist.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "command": {"type": "string"},
            "args": {"type": "array", "items": {"type": "string"}},
            "cwd": {"type": "string"},
            "timeout_seconds": {"type": "integer", "minimum": 1},
          },
          "required": ["command"],
        },
      },
      {
        "name": "get_block",
        "description": "Lê um bloco específico do LevelDB do mundo Bedrock por coordenada absoluta.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "world_path": {"type": "string"},
            "x": {"type": "integer"},
            "y": {"type": "integer"},
            "z": {"type": "integer"},
            "dimension": {"type": "integer"},
            "use_snapshot": {"type": "boolean"},
          },
          "required": ["x", "y", "z"],
        },
      },
      {
        "name": "get_block_region",
        "description": "Lê uma região limitada de blocos do LevelDB do mundo Bedrock por coordenadas absolutas.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "world_path": {"type": "string"},
            "x1": {"type": "integer"},
            "y1": {"type": "integer"},
            "z1": {"type": "integer"},
            "x2": {"type": "integer"},
            "y2": {"type": "integer"},
            "z2": {"type": "integer"},
            "dimension": {"type": "integer"},
            "include_air": {"type": "boolean"},
            "use_snapshot": {"type": "boolean"},
          },
          "required": ["x1", "y1", "z1", "x2", "y2", "z2"],
        },
      },
      {
        "name": "suggest_arena_location",
        "description": "Sugere um centro seguro para montar uma arena no mundo Bedrock usando logs recentes e heurística de afastamento.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "world_path": {"type": "string"},
            "log_path": {"type": "string"},
            "size_x": {"type": "integer", "minimum": 1},
            "size_y": {"type": "integer", "minimum": 1},
            "size_z": {"type": "integer", "minimum": 1},
            "preferred_y": {"type": "integer"},
            "margin": {"type": "integer", "minimum": 0},
            "max_log_bytes": {"type": "integer", "minimum": 1},
            "max_points": {"type": "integer", "minimum": 1},
          },
        },
      },
    ]
  }


def _success_response(request_id: Any, result: dict[str, Any]) -> dict[str, Any]:
  return {"jsonrpc": "2.0", "id": request_id, "result": result}


def _error_response(request_id: Any, code: int, message: str, *, data: Any | None = None) -> dict[str, Any]:
  return {"jsonrpc": "2.0", "id": request_id, "error": _error(code, message, data=data)}


def _handle_rpc(message: dict[str, Any]) -> dict[str, Any] | None:
  method = message.get("method")
  request_id = message.get("id")
  params = message.get("params") or {}

  if request_id is None:
    return None

  if method == "initialize":
    return _success_response(
      request_id,
      {
        "protocolVersion": PROTOCOL_VERSION,
        "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION},
        "capabilities": {"tools": {}},
      },
    )

  if method == "tools/list":
    return _success_response(request_id, _tools_list_result())

  if method == "tools/call":
    name = params.get("name")
    arguments = params.get("arguments") or {}

    try:
      if name == "list_directory":
        payload = _list_directory(arguments["path"])
      elif name == "read_file":
        payload = _read_file(arguments["path"], arguments.get("max_bytes"))
      elif name == "write_png_base64":
        payload = _write_png_base64(
          path=arguments["path"],
          png_base64=arguments["png_base64"],
          overwrite=bool(arguments.get("overwrite", False)),
        )
      elif name == "restart_bedrock":
        payload = _restart_bedrock()
      elif name == "run_read_command":
        payload = _run_read_command(
          command=arguments["command"],
          args=arguments.get("args"),
          cwd=arguments.get("cwd"),
          timeout_seconds=arguments.get("timeout_seconds"),
        )
      elif name == "get_block":
        payload = _get_block(
          world_path=arguments.get("world_path", "/root/MinecraftServer/worlds/Bedrock level"),
          x=int(arguments["x"]),
          y=int(arguments["y"]),
          z=int(arguments["z"]),
          dimension=int(arguments.get("dimension", OVERWORLD_DIMENSION_ID)),
          use_snapshot=bool(arguments.get("use_snapshot", True)),
        )
      elif name == "get_block_region":
        payload = _get_block_region(
          world_path=arguments.get("world_path", "/root/MinecraftServer/worlds/Bedrock level"),
          x1=int(arguments["x1"]),
          y1=int(arguments["y1"]),
          z1=int(arguments["z1"]),
          x2=int(arguments["x2"]),
          y2=int(arguments["y2"]),
          z2=int(arguments["z2"]),
          dimension=int(arguments.get("dimension", OVERWORLD_DIMENSION_ID)),
          include_air=bool(arguments.get("include_air", True)),
          use_snapshot=bool(arguments.get("use_snapshot", True)),
        )
      elif name == "suggest_arena_location":
        payload = _suggest_arena_location(
          world_path=arguments.get("world_path", "/root/MinecraftServer/worlds/Bedrock level"),
          log_path=arguments.get("log_path", "/root/MinecraftServer/logging/bedrock.log"),
          size_x=int(arguments.get("size_x", 19)),
          size_y=int(arguments.get("size_y", 10)),
          size_z=int(arguments.get("size_z", 19)),
          preferred_y=int(arguments.get("preferred_y", 64)),
          margin=int(arguments.get("margin", 48)),
          max_log_bytes=int(arguments.get("max_log_bytes", 300000)),
          max_points=int(arguments.get("max_points", 250)),
        )
      else:
        return _error_response(request_id, -32601, f"Ferramenta não encontrada: {name}")
    except KeyError as exc:
      return _error_response(request_id, -32602, f"Parâmetro obrigatório ausente: {exc}")
    except subprocess.TimeoutExpired as exc:
      return _error_response(request_id, -32000, "Timeout ao executar comando", data=str(exc))
    except Exception as exc:  # noqa: BLE001
      return _error_response(request_id, -32000, "Falha na execução", data=str(exc))

    return _success_response(request_id, {"content": [{"type": "text", "text": json.dumps(payload, ensure_ascii=False, indent=2)}]})

  return _error_response(request_id, -32601, f"Método não suportado: {method}")


class _McpHttpHandler(BaseHTTPRequestHandler):
  def do_GET(self) -> None:
    if self.path.rstrip("/") == "/health":
      payload = {"status": "ok", "transport": "http", "server": SERVER_NAME, "version": SERVER_VERSION}
      body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
      self.send_response(200)
      self.send_header("Content-Type", "application/json; charset=utf-8")
      self.send_header("Content-Length", str(len(body)))
      self.end_headers()
      self.wfile.write(body)
      return

    self.send_error(404, "Use POST /mcp para JSON-RPC.")

  def do_POST(self) -> None:
    if self.path.rstrip("/") != "/mcp":
      self.send_error(404, "Endpoint MCP inválido.")
      return

    raw = self._read_request_body()
    if not raw:
      self._send_json(_error_response(None, -32600, "Body ausente"), status=400)
      return

    try:
      message = json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError as exc:
      self._send_json(_error_response(None, -32700, "JSON inválido", data=str(exc)), status=400)
      return

    if not isinstance(message, dict):
      self._send_json(_error_response(None, -32600, "Mensagem JSON-RPC inválida"), status=400)
      return

    response = _handle_rpc(message)
    if response is None:
      self.send_response(204)
      self.end_headers()
      return

    self._send_json(response)

  def log_message(self, fmt: str, *args: Any) -> None:
    sys.stderr.write(f"[mcp-http] {self.client_address[0]} - {fmt % args}\n")

  def _send_json(self, payload: dict[str, Any], *, status: int = 200) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    self.send_response(status)
    self.send_header("Content-Type", "application/json; charset=utf-8")
    self.send_header("Content-Length", str(len(body)))
    self.end_headers()
    self.wfile.write(body)

  def _read_request_body(self) -> bytes:
    content_length = self.headers.get("Content-Length")
    if content_length:
      try:
        length = int(content_length)
      except ValueError:
        return b""
      if length <= 0:
        return b""
      return self.rfile.read(length)

    transfer_encoding = self.headers.get("Transfer-Encoding", "")
    if "chunked" in transfer_encoding.lower():
      chunks: list[bytes] = []
      while True:
        size_line = self.rfile.readline().strip()
        if not size_line:
          return b""
        try:
          chunk_size = int(size_line.split(b";", 1)[0], 16)
        except ValueError:
          return b""
        if chunk_size == 0:
          # Consome o CRLF final após o chunk terminador.
          self.rfile.readline()
          break
        chunk = self.rfile.read(chunk_size)
        chunks.append(chunk)
        # Consome o CRLF após cada chunk.
        self.rfile.read(2)
      return b"".join(chunks)

    return b""


def _read_message() -> dict[str, Any] | None:
  headers: dict[str, str] = {}
  while True:
    line = sys.stdin.buffer.readline()
    if not line:
      return None
    if line in (b"\r\n", b"\n"):
      break
    decoded = line.decode("utf-8", errors="replace").strip()
    if ":" in decoded:
      key, value = decoded.split(":", 1)
      headers[key.strip().lower()] = value.strip()

  length = int(headers.get("content-length", "0"))
  if length <= 0:
    return None
  body = sys.stdin.buffer.read(length)
  if not body:
    return None
  return json.loads(body.decode("utf-8"))


def _send_message(payload: dict[str, Any]) -> None:
  raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
  sys.stdout.buffer.write(f"Content-Length: {len(raw)}\r\n\r\n".encode("ascii"))
  sys.stdout.buffer.write(raw)
  sys.stdout.buffer.flush()


def main() -> int:
  if TRANSPORT == "http":
    server = ThreadingHTTPServer((HTTP_HOST, HTTP_PORT), _McpHttpHandler)
    print(f"MCP HTTP ativo em http://{HTTP_HOST}:{HTTP_PORT}/mcp", file=sys.stderr)
    server.serve_forever()
    return 0

  while True:
    try:
      message = _read_message()
      if message is None:
        return 0
      response = _handle_rpc(message)
      if response is not None:
        _send_message(response)
    except json.JSONDecodeError as exc:
      _send_message(_error_response(None, -32700, "JSON inválido", data=str(exc)))
    except Exception as exc:  # noqa: BLE001
      _send_message(_error_response(None, -32603, "Erro interno", data=str(exc)))


if __name__ == "__main__":
  raise SystemExit(main())
