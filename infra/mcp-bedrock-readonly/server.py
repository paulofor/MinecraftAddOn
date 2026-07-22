#!/usr/bin/env python3
"""Servidor MCP (stdio) com ferramentas somente leitura para host Bedrock."""

from __future__ import annotations

import base64
import datetime as dt
import errno
import hashlib
import json
import math
import os
import re
import shutil
import struct
import subprocess
import tempfile
import sys
import tarfile
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

SERVER_NAME = "bedrock-readonly"
SERVER_VERSION = "0.15.0"
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
BEDROCK_CONSOLE_FIFO = Path(os.getenv("BEDROCK_CONSOLE_FIFO", "/run/minecraft/bedrock-console.in"))
BEDROCK_COMMAND_LOG = Path(os.getenv("BEDROCK_COMMAND_LOG", "/root/MinecraftServer/logging/bedrock-console-commands.log"))
BEDROCK_LOG_PATH = Path(os.getenv("BEDROCK_LOG_PATH", "/root/MinecraftServer/logging/bedrock.log"))
BEDROCK_SERVER_PROPERTIES = Path(os.getenv("BEDROCK_SERVER_PROPERTIES", "/root/MinecraftServer/server.properties"))

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


def _safe_backup_label(label: str | None) -> str:
  raw = (label or f"manual-{dt.datetime.now(dt.UTC).strftime('%Y%m%d-%H%M%S')}").strip()
  safe = re.sub(r"[^A-Za-z0-9_.-]+", "-", raw).strip(".-_")
  if not safe:
    safe = f"manual-{dt.datetime.now(dt.UTC).strftime('%Y%m%d-%H%M%S')}"
  return safe[:80]


def _backup_world(
  world_path: str = "/root/MinecraftServer/worlds/Bedrock level",
  output_dir: str = "/root/Uploads",
  label: str | None = None,
) -> dict[str, Any]:
  ok_world, resolved_world = _is_path_allowed(world_path)
  if not ok_world:
    raise ValueError(f"world_path fora do escopo permitido: {resolved_world}")
  if not resolved_world.is_dir():
    raise FileNotFoundError(f"world_path não é diretório: {resolved_world}")

  ok_output, resolved_output = _is_path_allowed(output_dir)
  if not ok_output:
    raise ValueError(f"output_dir fora do escopo permitido: {resolved_output}")
  resolved_output.mkdir(parents=True, exist_ok=True)

  backup_label = _safe_backup_label(label)
  world_slug = re.sub(r"[^A-Za-z0-9_.-]+", "-", resolved_world.name).strip(".-_") or "world"
  archive_path = (resolved_output / f"{world_slug}-{backup_label}.tar.gz").resolve()
  ok_archive, resolved_archive = _is_path_allowed(str(archive_path))
  if not ok_archive:
    raise ValueError(f"archive_path fora do escopo permitido: {resolved_archive}")
  if resolved_archive.exists():
    raise FileExistsError(f"backup já existe: {resolved_archive}")

  with tarfile.open(resolved_archive, "w:gz") as archive:
    archive.add(resolved_world, arcname=resolved_world.name, recursive=True)

  digest = hashlib.sha256()
  with resolved_archive.open("rb") as handle:
    for chunk in iter(lambda: handle.read(1024 * 1024), b""):
      digest.update(chunk)

  return {
    "status": "created",
    "world_path": str(resolved_world),
    "archive_path": str(resolved_archive),
    "bytes": resolved_archive.stat().st_size,
    "sha256": digest.hexdigest(),
    "created_at": dt.datetime.now(dt.UTC).isoformat(),
    "warning": "Backup criado com o servidor possivelmente ativo; para restauração crítica, prefira parar o Bedrock ou validar integridade visualmente após restore.",
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
    import leveldb  # type: ignore[import-not-found]
  except Exception:  # noqa: BLE001
    try:
      import plyvel  # type: ignore[import-not-found]
    except Exception as plyvel_exc:  # noqa: BLE001
      raise RuntimeError(
        "Leitura bloco-a-bloco requer 'amulet-leveldb' (preferencial, compatível com LevelDB zlib do Bedrock) "
        "ou 'plyvel' como fallback. Recrie a imagem do MCP para instalar a dependência."
      ) from plyvel_exc
    leveldb_module = None
    plyvel_module = plyvel
  else:
    leveldb_module = leveldb
    plyvel_module = None

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

  try:
    if leveldb_module is not None:
      return leveldb_module.LevelDB(str(open_path), create_if_missing=False), resolved_world, cleanup_path
    return plyvel_module.DB(str(open_path), create_if_missing=False), resolved_world, cleanup_path
  except Exception as exc:  # noqa: BLE001
    if cleanup_path is not None:
      shutil.rmtree(cleanup_path, ignore_errors=True)
    raise RuntimeError(
      "Falha ao abrir LevelDB do Bedrock. Garanta que a imagem use amulet-leveldb/leveldb-mcpe, "
      "pois o LevelDB vanilla/plyvel pode falhar com 'Corruption: bad block type' em mundos Bedrock."
    ) from exc


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
    # Subchunk v9 (1.17.30+) adiciona um byte com o índice Y do subchunk antes dos storages.
    if version == 9:
      if offset >= len(value):
        raise ValueError("Subchunk v9 sem índice Y")
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
  try:
    value = db.get(key)
  except KeyError:
    value = None
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



BUILD_PROFILES: dict[str, dict[str, Any]] = {
  "piramide_egito_gigante": {
    "function_path": "piramide_egito_gigante/montar_completa",
    "size_x": 129,
    "size_y": 68,
    "size_z": 129,
    "preferred_y": 69,
    "margin": 65,
    "risk_notes": [
      "Megaconstrução larga; exige centro bem afastado de água, lava, árvores, bases e obras existentes.",
      "O precheck usa amostragem e não substitui validação visual no jogo.",
    ],
  },
}


def _validate_function_path(function_path: str) -> str:
  normalized = function_path.strip().removeprefix("/")
  if not re.fullmatch(r"[a-z0-9_./-]+", normalized):
    raise ValueError("function_path contém caracteres não permitidos")
  if ".." in normalized or normalized.startswith("/"):
    raise ValueError("function_path inválido")
  return normalized


def _build_sampling_points(center: dict[str, int], affected_area: dict[str, list[int]]) -> list[dict[str, int]]:
  min_x, max_x = affected_area["x"]
  min_y, max_y = affected_area["y"]
  min_z, max_z = affected_area["z"]
  base_y = center["y"]
  y_values = sorted({max(min_y, base_y - 1), base_y, max_y})
  xz_points = [
    (center["x"], center["z"]),
    (min_x, min_z),
    (min_x, max_z),
    (max_x, min_z),
    (max_x, max_z),
  ]
  points = []
  for y in y_values:
    for x, z in xz_points:
      points.append({"x": x, "y": y, "z": z})
  return points


def _sample_build_blocks(world_path: str, points: list[dict[str, int]], dimension: int) -> dict[str, Any]:
  samples = []
  errors = []
  risky_blocks = []
  try:
    db, resolved_world, cleanup_path = _open_leveldb(world_path, use_snapshot=True)
  except Exception as exc:  # noqa: BLE001
    return {
      "samples": samples,
      "errors": [{"point": point, "error": str(exc)} for point in points],
      "risky_blocks": risky_blocks,
    }

  try:
    for point in points:
      try:
        sample = _get_block_from_db(db, point["x"], point["y"], point["z"], dimension)
        sample["world_path"] = str(resolved_world)
        sample["snapshot_used"] = True
        samples.append(sample)
        block = str(sample.get("block", ""))
        if block.endswith(":water") or block.endswith(":lava") or block in {"minecraft:water", "minecraft:lava"}:
          risky_blocks.append(sample)
      except Exception as exc:  # noqa: BLE001
        errors.append({"point": point, "error": str(exc)})
  finally:
    db.close()
    if cleanup_path is not None:
      shutil.rmtree(cleanup_path, ignore_errors=True)
  return {"samples": samples, "errors": errors, "risky_blocks": risky_blocks}


def _plan_build_location(
  build_key: str = "piramide_egito_gigante",
  world_path: str = "/root/MinecraftServer/worlds/Bedrock level",
  log_path: str = "/root/MinecraftServer/logging/bedrock.log",
  function_path: str | None = None,
  size_x: int | None = None,
  size_y: int | None = None,
  size_z: int | None = None,
  preferred_y: int | None = None,
  margin: int | None = None,
  approval_confirmed: bool = False,
  dimension: int = OVERWORLD_DIMENSION_ID,
) -> dict[str, Any]:
  profile = BUILD_PROFILES.get(build_key, {})
  resolved_function = _validate_function_path(function_path or str(profile.get("function_path", "")))
  resolved_size_x = int(size_x or profile.get("size_x", 19))
  resolved_size_y = int(size_y or profile.get("size_y", 10))
  resolved_size_z = int(size_z or profile.get("size_z", 19))
  resolved_preferred_y = int(preferred_y if preferred_y is not None else profile.get("preferred_y", 64))
  resolved_margin = int(margin if margin is not None else profile.get("margin", 48))

  suggestion = _suggest_arena_location(
    world_path=world_path,
    log_path=log_path,
    size_x=resolved_size_x,
    size_y=resolved_size_y,
    size_z=resolved_size_z,
    preferred_y=resolved_preferred_y,
    margin=resolved_margin,
  )
  center = {key: int(value) for key, value in suggestion["recommended_center"].items()}
  affected_area = suggestion["affected_area"]
  sampling_points = _build_sampling_points(center, affected_area)
  precheck = _sample_build_blocks(world_path, sampling_points, dimension)

  warnings = list(suggestion.get("warnings", []))
  warnings.extend(profile.get("risk_notes", []))
  if precheck["errors"]:
    warnings.append("Amostragem LevelDB falhou em pelo menos um ponto; exigir validação visual antes de montar.")
  if precheck["risky_blocks"]:
    warnings.append("Amostragem encontrou água/lava; não executar montagem sem escolher outro local ou preparar terreno.")

  requires_visual_validation = bool(precheck["errors"] or precheck["risky_blocks"] or suggestion.get("confidence") == "low")
  approval_required = requires_visual_validation or not approval_confirmed
  command = None
  if approval_confirmed and not requires_visual_validation:
    command = f"execute positioned {center['x']} {center['y']} {center['z']} run function {resolved_function}"

  return {
    "build_key": build_key,
    "function_path": resolved_function,
    "recommended_center": center,
    "affected_area": affected_area,
    "size": {"x": resolved_size_x, "y": resolved_size_y, "z": resolved_size_z},
    "margin": resolved_margin,
    "confidence": suggestion.get("confidence"),
    "reasons": suggestion.get("reasons", []),
    "warnings": warnings,
    "precheck": {
      "strategy": "sampled_center_and_corners",
      "limitation": "Amostragem de centro/cantos em Y de base/topo; não é varredura completa da área.",
      "points_checked": len(sampling_points),
      "samples_returned": len(precheck["samples"]),
      "errors": precheck["errors"],
      "risky_blocks": precheck["risky_blocks"],
    },
    "approval_required": approval_required,
    "requires_visual_validation": requires_visual_validation,
    "command_after_approval": command,
    "next_step": (
      "Validar visualmente no jogo e repetir com approval_confirmed=true após aprovação formal."
      if approval_required else
      "Comando final gerado; enviar via run_bedrock_command somente se a Sprint 5 autorizar execução."
    ),
    "reusable_structure_note": "Perfil inicial é Pirâmide, mas build_key/function_path/size/margin permitem reutilizar o fluxo para outros Add-Ons.",
  }




def _read_file_from_offset(path: Path, offset: int, max_bytes: int = 8000) -> dict[str, Any]:
  if not path.exists() or not path.is_file():
    return {"path": str(path), "available": False, "offset": offset, "content": ""}
  current_size = path.stat().st_size
  start = max(0, min(offset, current_size))
  with path.open("rb") as handle:
    handle.seek(start)
    data = handle.read(max_bytes)
  return {
    "path": str(path),
    "available": True,
    "offset": start,
    "bytes_read": len(data),
    "truncated": current_size - start > max_bytes,
    "content": data.decode("utf-8", errors="replace"),
  }

def _read_optional_tail(path: Path, max_bytes: int = 4000) -> dict[str, Any]:
  if not path.exists() or not path.is_file():
    return {"path": str(path), "available": False, "content": ""}
  return {"path": str(path), "available": True, "content": _read_tail_bytes(path, max_bytes)}


def _expected_confirmation_token(build_key: str, center: dict[str, int]) -> str:
  return f"EXECUTAR_{build_key}_{center['x']}_{center['y']}_{center['z']}"


def _execute_planned_build(
  build_key: str = "piramide_egito_gigante",
  executor: str = "mcp",
  approval_confirmed: bool = False,
  execute: bool = False,
  confirmation_token: str | None = None,
  world_path: str = "/root/MinecraftServer/worlds/Bedrock level",
  log_path: str = "/root/MinecraftServer/logging/bedrock.log",
  function_path: str | None = None,
  size_x: int | None = None,
  size_y: int | None = None,
  size_z: int | None = None,
  preferred_y: int | None = None,
  margin: int | None = None,
  dimension: int = OVERWORLD_DIMENSION_ID,
) -> dict[str, Any]:
  plan = _plan_build_location(
    build_key=build_key,
    world_path=world_path,
    log_path=log_path,
    function_path=function_path,
    size_x=size_x,
    size_y=size_y,
    size_z=size_z,
    preferred_y=preferred_y,
    margin=margin,
    approval_confirmed=approval_confirmed,
    dimension=dimension,
  )

  command = plan.get("command_after_approval")
  if not command:
    return {
      "status": "blocked_by_precheck_or_missing_approval",
      "build_key": build_key,
      "plan": plan,
      "execution": None,
      "next_step": "Corrigir incertezas/precheck ou repetir com approval_confirmed=true após aprovação formal.",
    }

  normalized_command = _validate_bedrock_command(str(command))
  expected_token = _expected_confirmation_token(build_key, plan["recommended_center"])
  if not execute:
    _append_bedrock_command_audit("dry_run", executor, normalized_command, f"expected_confirmation_token={expected_token}")
    return {
      "status": "dry_run_ready",
      "build_key": build_key,
      "plan": plan,
      "execution": {
        "would_send": normalized_command,
        "executor": executor,
        "expected_confirmation_token": expected_token,
      },
      "next_step": "Para executar, repetir com execute=true e confirmation_token igual ao token esperado após backup e validação visual.",
    }

  if confirmation_token != expected_token:
    _append_bedrock_command_audit("rejected_confirmation", executor, normalized_command, "confirmation_token ausente ou divergente")
    return {
      "status": "blocked_by_confirmation",
      "build_key": build_key,
      "plan": plan,
      "execution": {
        "would_send": normalized_command,
        "executor": executor,
        "expected_confirmation_token": expected_token,
      },
      "next_step": "Confirmar backup/precheck e reenviar com o confirmation_token esperado exatamente igual.",
    }

  execution = _run_bedrock_command(normalized_command, executor=executor)
  return {
    "status": "sent",
    "build_key": build_key,
    "plan": plan,
    "execution": execution,
    "post_execution_observation": {
      "command_audit_tail": _read_optional_tail(BEDROCK_COMMAND_LOG),
      "bedrock_log_tail": _read_optional_tail(Path(log_path)),
      "operator_guidance": "Se o log/chat não evidenciar resultado visual, peça captura do operador no local antes de repetir a montagem.",
    },
  }


DANGEROUS_BEDROCK_COMMAND_RE = re.compile(r"(^|\s)(fill|setblock|kill|op|deop|stop)\b", re.IGNORECASE)
ALLOWED_DIRECT_BEDROCK_DIAGNOSTIC_COMMANDS = {
  "execute as @a at @s run setblock ~ ~3 ~ minecraft:diamond_block",
  "execute as @a at @s run setblock ~ ~4 ~ minecraft:sea_lantern",
}
ALLOWED_BEDROCK_COMMAND_PATTERNS = (
  re.compile(r"^say \[MinecraftAddOn\] MCP run_bedrock_command operacional$"),
  re.compile(r"^function piramide_egito_gigante/montar_centro_historico$"),
  re.compile(r"^function piramide_egito_gigante/diagnosticar_local$"),
  re.compile(r"^function piramide_egito_gigante/diagnostico_marcador_centro$"),
  re.compile(r"^function piramide_egito_gigante/diagnostico_marcador_operador$"),
  re.compile(
    r"^execute positioned -?\d+ -?\d+ -?\d+ run function piramide_egito_gigante/montar_completa$"
  ),
)


def _normalize_bedrock_command(command: str) -> str:
  normalized = " ".join(command.strip().split())
  if not normalized:
    raise ValueError("Comando Bedrock vazio")
  if normalized.startswith("/"):
    raise ValueError("Envie comandos Bedrock sem '/' inicial")
  if any(ord(char) < 32 for char in normalized):
    raise ValueError("Comando Bedrock contém caractere de controle")
  if len(normalized) > 240:
    raise ValueError("Comando Bedrock excede 240 caracteres")
  return normalized


def _validate_bedrock_command(command: str) -> str:
  normalized = _normalize_bedrock_command(command)
  if normalized in ALLOWED_DIRECT_BEDROCK_DIAGNOSTIC_COMMANDS:
    return normalized
  if DANGEROUS_BEDROCK_COMMAND_RE.search(normalized):
    raise ValueError("Comando Bedrock recusado: comandos destrutivos diretos exigem função versionada allowlisted")
  if not any(pattern.fullmatch(normalized) for pattern in ALLOWED_BEDROCK_COMMAND_PATTERNS):
    raise ValueError("Comando Bedrock fora da allowlist administrativa")
  return normalized


def _bedrock_allows_cheats() -> tuple[bool | None, str]:
  try:
    content = BEDROCK_SERVER_PROPERTIES.read_text(encoding="utf-8")
  except FileNotFoundError:
    return None, f"server.properties ausente: {BEDROCK_SERVER_PROPERTIES}"
  except OSError as exc:
    return None, f"falha ao ler server.properties: {exc}"

  for raw_line in content.splitlines():
    line = raw_line.strip()
    if not line or line.startswith("#") or "=" not in line:
      continue
    key, value = line.split("=", 1)
    if key.strip() == "allow-cheats":
      return value.strip().lower() == "true", f"allow-cheats={value.strip().lower()}"
  return None, "allow-cheats ausente em server.properties"


def _requires_cheats_enabled(command: str) -> bool:
  return not command.startswith("say ")


def _append_bedrock_command_audit(status: str, executor: str, command: str, detail: str = "") -> None:
  BEDROCK_COMMAND_LOG.parent.mkdir(parents=True, exist_ok=True)
  payload = {
    "timestamp": dt.datetime.now(dt.UTC).isoformat(),
    "status": status,
    "executor": executor,
    "command": command,
  }
  if detail:
    payload["detail"] = detail
  with BEDROCK_COMMAND_LOG.open("a", encoding="utf-8") as handle:
    handle.write(json.dumps(payload, ensure_ascii=False, sort_keys=True) + "\n")


def _run_bedrock_command(command: str, executor: str = "mcp") -> dict[str, Any]:
  try:
    normalized = _validate_bedrock_command(command)
  except Exception as exc:  # noqa: BLE001
    safe_command = str(command).strip().replace("\n", " ").replace("\r", " ")[:240]
    _append_bedrock_command_audit("rejected", executor, safe_command, str(exc))
    raise

  if _requires_cheats_enabled(normalized):
    cheats_enabled, detail = _bedrock_allows_cheats()
    if cheats_enabled is False:
      message = f"Comando Bedrock bloqueado: server.properties está com {detail}; comandos de bloco/função exigem allow-cheats=true e restart do Bedrock"
      _append_bedrock_command_audit("blocked", executor, normalized, message)
      raise RuntimeError(message)
    if cheats_enabled is None:
      _append_bedrock_command_audit("warning", executor, normalized, detail)

  if not BEDROCK_CONSOLE_FIFO.exists() or not BEDROCK_CONSOLE_FIFO.is_fifo():
    _append_bedrock_command_audit("failed", executor, normalized, f"FIFO ausente: {BEDROCK_CONSOLE_FIFO}")
    raise ValueError(f"FIFO do console Bedrock ausente ou inválido: {BEDROCK_CONSOLE_FIFO}")

  bedrock_log_offset = BEDROCK_LOG_PATH.stat().st_size if BEDROCK_LOG_PATH.exists() else 0

  try:
    fd = os.open(BEDROCK_CONSOLE_FIFO, os.O_WRONLY | os.O_NONBLOCK)
  except OSError as exc:
    detail = f"Falha ao abrir FIFO: {exc}"
    _append_bedrock_command_audit("failed", executor, normalized, detail)
    if exc.errno == errno.ENXIO:
      raise RuntimeError("FIFO do console Bedrock não possui leitor ativo; verifique bedrock.service") from exc
    raise RuntimeError(detail) from exc

  try:
    os.write(fd, f"{normalized}\n".encode("utf-8"))
  finally:
    os.close(fd)

  _append_bedrock_command_audit("sent", executor, normalized)
  time.sleep(0.5)
  bedrock_log_after_send = _read_file_from_offset(BEDROCK_LOG_PATH, bedrock_log_offset, max_bytes=8000)
  bedrock_tail_content = bedrock_log_after_send.get("content", "")
  detected_errors = [
    pattern
    for pattern in (
      "No targets matched selector",
      "Syntax error",
      "Unknown command",
      "commands.generic",
    )
    if pattern in bedrock_tail_content
  ]
  status = "sent_with_log_warnings" if detected_errors else "sent"
  if detected_errors:
    _append_bedrock_command_audit(
      "sent_with_log_warnings",
      executor,
      normalized,
      f"Possíveis erros no bedrock.log após envio: {', '.join(detected_errors)}",
    )
  return {
    "status": status,
    "command": normalized,
    "executor": executor,
    "fifo": str(BEDROCK_CONSOLE_FIFO),
    "audit_log": str(BEDROCK_COMMAND_LOG),
    "post_send_observation": {
      "bedrock_log_after_send": bedrock_log_after_send,
      "detected_error_markers": detected_errors,
      "limitation": "A leitura é por cauda do log logo após o envio; mensagens concorrentes de outros scripts podem aparecer e a confirmação visual/LevelDB ainda pode ser necessária.",
    },
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
        "name": "backup_world",
        "description": "Cria um backup tar.gz do mundo Bedrock em /root/Uploads com hash SHA-256.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "world_path": {"type": "string"},
            "output_dir": {"type": "string"},
            "label": {"type": "string"},
          },
        },
      },
      {
        "name": "run_bedrock_command",
        "description": "Envia comando administrativo allowlisted ao console Bedrock via FIFO seguro.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "command": {"type": "string"},
            "executor": {"type": "string"},
          },
          "required": ["command"],
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
        "name": "execute_planned_build",
        "description": "Executa ou simula a execução de uma construção planejada após precheck e aprovação explícita.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "build_key": {"type": "string"},
            "executor": {"type": "string"},
            "approval_confirmed": {"type": "boolean"},
            "execute": {"type": "boolean"},
            "confirmation_token": {"type": "string"},
            "world_path": {"type": "string"},
            "log_path": {"type": "string"},
            "function_path": {"type": "string"},
            "size_x": {"type": "integer", "minimum": 1},
            "size_y": {"type": "integer", "minimum": 1},
            "size_z": {"type": "integer", "minimum": 1},
            "preferred_y": {"type": "integer"},
            "margin": {"type": "integer", "minimum": 0},
            "dimension": {"type": "integer"},
          },
        },
      },
      {
        "name": "plan_build_location",
        "description": "Planeja local de construção com heurística, área afetada, amostragem e comando pendente de aprovação.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "build_key": {"type": "string"},
            "world_path": {"type": "string"},
            "log_path": {"type": "string"},
            "function_path": {"type": "string"},
            "size_x": {"type": "integer", "minimum": 1},
            "size_y": {"type": "integer", "minimum": 1},
            "size_z": {"type": "integer", "minimum": 1},
            "preferred_y": {"type": "integer"},
            "margin": {"type": "integer", "minimum": 0},
            "approval_confirmed": {"type": "boolean"},
            "dimension": {"type": "integer"},
          },
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
      elif name == "backup_world":
        payload = _backup_world(
          world_path=arguments.get("world_path", "/root/MinecraftServer/worlds/Bedrock level"),
          output_dir=arguments.get("output_dir", "/root/Uploads"),
          label=arguments.get("label"),
        )
      elif name == "run_bedrock_command":
        payload = _run_bedrock_command(
          command=arguments["command"],
          executor=arguments.get("executor", "mcp"),
        )
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
      elif name == "execute_planned_build":
        payload = _execute_planned_build(
          build_key=arguments.get("build_key", "piramide_egito_gigante"),
          executor=arguments.get("executor", "mcp"),
          approval_confirmed=bool(arguments.get("approval_confirmed", False)),
          execute=bool(arguments.get("execute", False)),
          confirmation_token=arguments.get("confirmation_token"),
          world_path=arguments.get("world_path", "/root/MinecraftServer/worlds/Bedrock level"),
          log_path=arguments.get("log_path", "/root/MinecraftServer/logging/bedrock.log"),
          function_path=arguments.get("function_path"),
          size_x=arguments.get("size_x"),
          size_y=arguments.get("size_y"),
          size_z=arguments.get("size_z"),
          preferred_y=arguments.get("preferred_y"),
          margin=arguments.get("margin"),
          dimension=int(arguments.get("dimension", OVERWORLD_DIMENSION_ID)),
        )
      elif name == "plan_build_location":
        payload = _plan_build_location(
          build_key=arguments.get("build_key", "piramide_egito_gigante"),
          world_path=arguments.get("world_path", "/root/MinecraftServer/worlds/Bedrock level"),
          log_path=arguments.get("log_path", "/root/MinecraftServer/logging/bedrock.log"),
          function_path=arguments.get("function_path"),
          size_x=arguments.get("size_x"),
          size_y=arguments.get("size_y"),
          size_z=arguments.get("size_z"),
          preferred_y=arguments.get("preferred_y"),
          margin=arguments.get("margin"),
          approval_confirmed=bool(arguments.get("approval_confirmed", False)),
          dimension=int(arguments.get("dimension", OVERWORLD_DIMENSION_ID)),
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
