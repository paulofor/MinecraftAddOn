#!/usr/bin/env python3
"""Servidor MCP (stdio) com ferramentas somente leitura para host Bedrock."""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any

SERVER_NAME = "bedrock-readonly"
SERVER_VERSION = "0.1.0"
PROTOCOL_VERSION = "2024-11-05"

DEFAULT_ALLOWED_ROOTS = "/opt/bedrock-server,/var/log,/root/MinecraftAddOn"
ALLOWED_ROOTS = [
  Path(part.strip()).resolve()
  for part in os.getenv("ALLOWED_ROOTS", DEFAULT_ALLOWED_ROOTS).split(",")
  if part.strip()
]
DEFAULT_CMD_TIMEOUT = int(os.getenv("READ_CMD_TIMEOUT", "10"))
DEFAULT_MAX_FILE_BYTES = int(os.getenv("MAX_FILE_BYTES", "200000"))

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

  effective_cwd = cwd or "/opt/bedrock-server"
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
      elif name == "run_read_command":
        payload = _run_read_command(
          command=arguments["command"],
          args=arguments.get("args"),
          cwd=arguments.get("cwd"),
          timeout_seconds=arguments.get("timeout_seconds"),
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
