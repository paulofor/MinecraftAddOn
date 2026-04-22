#!/usr/bin/env python3
"""Servidor HTTP simples para visualizar logs do Minecraft com destaque de erros."""

from __future__ import annotations

import html
import json
import os
import re
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

LOG_PATH = Path(os.getenv("LOG_PATH", "/logs/bedrock.log"))
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8081"))
DEFAULT_LINES = int(os.getenv("DEFAULT_LINES", "300"))
MAX_LINES = int(os.getenv("MAX_LINES", "3000"))
VIEWER_VERSION = os.getenv("VIEWER_VERSION", "semversao-local")
BP_DIR = Path(os.getenv("BEHAVIOR_PACKS_DIR", "/data/behavior_packs"))
RP_DIR = Path(os.getenv("RESOURCE_PACKS_DIR", "/data/resource_packs"))
WORLD_BP_BINDINGS = Path(
  os.getenv("WORLD_BEHAVIOR_BINDINGS_PATH", "/data/world_behavior_packs.json")
)
WORLD_RP_BINDINGS = Path(
  os.getenv("WORLD_RESOURCE_BINDINGS_PATH", "/data/world_resource_packs.json")
)

ERROR_RE = re.compile(r"(error|exception|fail(ed)?|traceback)", re.IGNORECASE)
WARN_RE = re.compile(r"(warn(ing)?|deprecated)", re.IGNORECASE)

CSS = """
:root {
  color-scheme: dark;
  --bg: #1c2a3d;
  --card: #1f314a;
  --text: #f2f6ff;
  --muted: #c1cfe3;
  --error: #ff7b7b;
  --warn: #ffd166;
  --ok: #9be37a;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
}
header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #3c4f69;
  background: #162338;
}
main { padding: 1rem 1.25rem 2rem; }
.card {
  background: var(--card);
  border: 1px solid #3c4f69;
  border-radius: 10px;
  padding: 0.75rem;
}
.controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}
input, button {
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #526787;
  background: #162338;
  color: var(--text);
}
button { cursor: pointer; }
.meta {
  color: var(--muted);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
pre {
  margin: 0;
  overflow: auto;
  max-height: calc(100vh - 210px);
  line-height: 1.4;
  font-size: 0.86rem;
  background: #162338;
  border-radius: 8px;
  padding: 0.75rem;
}
.line { display: block; white-space: pre-wrap; word-break: break-word; }
.line.error { color: var(--error); }
.line.warn { color: var(--warn); }
.tag { color: var(--ok); font-weight: 600; }
.addons {
  margin-top: 0.75rem;
  background: #162338;
  border: 1px solid #3c4f69;
  border-radius: 8px;
  padding: 0.75rem;
}
.addons ul { margin: 0.35rem 0 0; padding-left: 1.2rem; }
.addons li { margin: 0.2rem 0; }
.item-cmd {
  margin-top: 0.2rem;
  font-size: 0.85rem;
  color: var(--muted);
}
code {
  background: #223651;
  border: 1px solid #526787;
  border-radius: 6px;
  padding: 0.1rem 0.35rem;
  color: #c5d9ff;
}
.cmd-row {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.copy-btn {
  padding: 0.15rem 0.45rem;
  font-size: 0.75rem;
  line-height: 1.2;
}
.copy-status {
  font-size: 0.75rem;
  color: var(--ok);
  min-height: 1em;
}
"""


def read_last_lines(path: Path, num_lines: int) -> list[str]:
  if not path.exists():
    return [f"Arquivo de log não encontrado: {path}"]
  if path.is_dir():
    return [
      f"LOG_PATH aponta para diretório, não arquivo: {path}",
      "Defina LOG_PATH para o arquivo completo (ex.: /logs/bedrock.log).",
    ]

  with path.open("rb") as fp:
    fp.seek(0, os.SEEK_END)
    pos = fp.tell()
    chunk = bytearray()
    lines_found = 0

    while pos > 0 and lines_found <= num_lines:
      step = min(4096, pos)
      pos -= step
      fp.seek(pos)
      data = fp.read(step)
      chunk[:0] = data
      lines_found = chunk.count(b"\n")

    text = chunk.decode("utf-8", errors="replace")
    lines = text.splitlines()
    return lines[-num_lines:]


def _fmt_version(version: list[int] | str | None) -> str:
  if isinstance(version, list):
    return ".".join(str(v) for v in version)
  if isinstance(version, str):
    return version
  return "n/d"


def _safe_read_json(path: Path) -> dict | list | None:
  if not path.exists() or not path.is_file():
    return None
  try:
    return json.loads(path.read_text(encoding="utf-8"))
  except (OSError, json.JSONDecodeError):
    return None


def read_world_bindings(path: Path) -> dict[str, str]:
  data = _safe_read_json(path)
  if not isinstance(data, list):
    return {}

  bindings: dict[str, str] = {}
  for item in data:
    if not isinstance(item, dict):
      continue
    pack_id = item.get("pack_id")
    version = item.get("version")
    if isinstance(pack_id, str):
      bindings[pack_id] = _fmt_version(version)
  return bindings


def read_installed_packs(base_dir: Path, pack_type: str, bindings: dict[str, str]) -> list[dict[str, str]]:
  packs: list[dict[str, str]] = []
  if not base_dir.exists() or not base_dir.is_dir():
    return packs

  for pack_dir in sorted([p for p in base_dir.iterdir() if p.is_dir()], key=lambda p: p.name.lower()):
    manifest = _safe_read_json(pack_dir / "manifest.json")
    if not isinstance(manifest, dict):
      continue

    header = manifest.get("header", {})
    if not isinstance(header, dict):
      header = {}

    pack_uuid = header.get("uuid") if isinstance(header.get("uuid"), str) else ""
    name = header.get("name") if isinstance(header.get("name"), str) else pack_dir.name
    version = _fmt_version(header.get("version"))
    enabled = bool(pack_uuid and pack_uuid in bindings)

    packs.append(
      {
        "type": pack_type,
        "name": name,
        "uuid": pack_uuid or "sem-uuid",
        "version": version,
        "status": "ativo no mundo" if enabled else "instalado (não vinculado)",
        "folder": pack_dir.name,
      }
    )
  return packs


def read_pack_items(pack_dir: Path) -> list[str]:
  items_dir = pack_dir / "items"
  if not items_dir.exists() or not items_dir.is_dir():
    return []

  identifiers: list[str] = []
  for item_file in sorted(items_dir.glob("*.json"), key=lambda p: p.name.lower()):
    item_data = _safe_read_json(item_file)
    if not isinstance(item_data, dict):
      continue
    minecraft_item = item_data.get("minecraft:item")
    if not isinstance(minecraft_item, dict):
      continue
    description = minecraft_item.get("description")
    if not isinstance(description, dict):
      continue
    identifier = description.get("identifier")
    if isinstance(identifier, str) and identifier.strip():
      identifiers.append(identifier.strip())

  return sorted(set(identifiers), key=str.lower)


def get_addons_snapshot() -> list[dict[str, str]]:
  bp_bindings = read_world_bindings(WORLD_BP_BINDINGS)
  rp_bindings = read_world_bindings(WORLD_RP_BINDINGS)

  packs = []
  packs.extend(read_installed_packs(BP_DIR, "Behavior Pack", bp_bindings))
  packs.extend(read_installed_packs(RP_DIR, "Resource Pack", rp_bindings))

  for pack in packs:
    if pack["type"] != "Behavior Pack":
      pack["items"] = []
      continue
    pack["items"] = read_pack_items(BP_DIR / pack["folder"])

  return packs


def _item_with_give_command(identifier: str) -> str:
  safe_identifier = html.escape(identifier)
  cmd = f"/give @s {identifier}"
  safe_cmd = html.escape(cmd)
  return (
    "<li>"
    f"<div><strong>{safe_identifier}</strong></div>"
    '<div class="item-cmd">Comando: '
    '<span class="cmd-row">'
    f"<code>{safe_cmd}</code>"
    f'<button type="button" class="copy-btn" data-cmd="{safe_cmd}">copy</button>'
    '<span class="copy-status" aria-live="polite"></span>'
    "</span></div>"
    "</li>"
  )


class LogHandler(BaseHTTPRequestHandler):
  def do_GET(self) -> None:
    parsed = urlparse(self.path)
    if parsed.path != "/":
      self.send_error(HTTPStatus.NOT_FOUND)
      return

    params = parse_qs(parsed.query)
    query = params.get("q", [""])[0].strip()

    try:
      requested_lines = int(params.get("lines", [str(DEFAULT_LINES)])[0])
    except ValueError:
      requested_lines = DEFAULT_LINES

    requested_lines = max(20, min(requested_lines, MAX_LINES))

    lines = read_last_lines(LOG_PATH, requested_lines)
    addons = get_addons_snapshot()
    if query:
      filtered = [ln for ln in lines if query.lower() in ln.lower()]
    else:
      filtered = lines

    now = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
    body_lines = []
    for ln in filtered:
      css_class = "line"
      if ERROR_RE.search(ln):
        css_class += " error"
      elif WARN_RE.search(ln):
        css_class += " warn"
      safe_ln = html.escape(ln)
      body_lines.append(f'<span class="{css_class}">{safe_ln}</span>')

    if addons:
      addon_items = []
      for addon in addons:
        available_items = addon.get("items", [])
        items_html = ""
        if available_items:
          items_list = "".join(_item_with_give_command(item) for item in available_items)
          items_html = (
            "<div>itens disponíveis pelo Add On:</div>"
            "<ul>"
            f"{items_list}"
            "</ul>"
          )

        addon_items.append(
          "<li>"
          f"<strong>{html.escape(addon['name'])}</strong> "
          f"({html.escape(addon['type'])}) • versão {html.escape(addon['version'])} • "
          f"status: {html.escape(addon['status'])} • pasta: {html.escape(addon['folder'])}"
          f"{items_html}"
          "</li>"
        )
      addons_html = (
        '<div class="addons"><strong>Add-ons instalados/disponíveis</strong>'
        "<ul>"
        + "".join(addon_items)
        + "</ul></div>"
      )
    else:
      addons_html = (
        '<div class="addons"><strong>Add-ons instalados/disponíveis</strong>'
        '<div class="meta">Nenhum pack encontrado nos caminhos configurados.</div></div>'
      )

    html_doc = f"""<!doctype html>
<html lang=\"pt-BR\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>Minecraft Bedrock Logs</title>
  <style>{CSS}</style>
</head>
<body>
  <header>
    <div class=\"tag\">Minecraft Log Viewer</div>
    <div class=\"meta\">
      Log estático na tela. Atualize manualmente quando quiser carregar um novo snapshot.
      Use um proxy/reverse proxy para expor em URL pública com TLS.
    </div>
  </header>
  <main>
    <div class=\"card\">
      <form class=\"controls\" method=\"GET\">
        <label>Linhas <input type=\"number\" name=\"lines\" min=\"20\" max=\"{MAX_LINES}\" value=\"{requested_lines}\" /></label>
        <label>Filtro <input type=\"text\" name=\"q\" value=\"{html.escape(query)}\" placeholder=\"error, failed, player name...\" /></label>
        <button type=\"submit\">Atualizar</button>
      </form>
      <div class=\"meta\">
        Arquivo: {LOG_PATH} | exibindo {len(filtered)} linha(s) | snapshot: {now} |
        atualização automática: desativada | versão do viewer: {VIEWER_VERSION}
      </div>
      {addons_html}
      <pre>{''.join(body_lines) if body_lines else '<span class="line">Nenhuma linha para exibir.</span>'}</pre>
    </div>
  </main>
<script>
function copyWithExecCommand(text) {{
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '-9999px';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  let copied = false;
  try {{
    copied = document.execCommand('copy');
  }} catch (err) {{
    copied = false;
  }}
  document.body.removeChild(ta);
  return copied;
}}

document.querySelectorAll('.copy-btn').forEach((btn) => {{
  btn.addEventListener('click', async () => {{
    const cmd = btn.dataset.cmd || '';
    const statusEl = btn.parentElement?.querySelector('.copy-status');
    if (!cmd) {{
      return;
    }}
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {{
      try {{
        await navigator.clipboard.writeText(cmd);
        copied = true;
      }} catch (err) {{
        copied = false;
      }}
    }}
    if (!copied) {{
      copied = copyWithExecCommand(cmd);
    }}
    if (statusEl) statusEl.textContent = copied ? 'copiado!' : 'falhou ao copiar';
    setTimeout(() => {{
      if (statusEl) statusEl.textContent = '';
    }}, 1200);
  }});
}});
</script>
</body>
</html>"""

    payload = html_doc.encode("utf-8")
    self.send_response(HTTPStatus.OK)
    self.send_header("Content-Type", "text/html; charset=utf-8")
    self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
    self.send_header("Pragma", "no-cache")
    self.send_header("Expires", "0")
    self.send_header("Content-Length", str(len(payload)))
    self.end_headers()
    self.wfile.write(payload)

  def log_message(self, fmt: str, *args) -> None:  # noqa: A003
    return


def main() -> None:
  addons = get_addons_snapshot()
  print("Add-ons detectados:")
  if addons:
    for addon in addons:
      print(
        f" - {addon['name']} [{addon['type']}] "
        f"v{addon['version']} | {addon['status']} | pasta={addon['folder']}"
      )
  else:
    print(
      " - nenhum pack encontrado. "
      f"Verifique BEHAVIOR_PACKS_DIR={BP_DIR} e RESOURCE_PACKS_DIR={RP_DIR}"
    )

  server = ThreadingHTTPServer((HOST, PORT), LogHandler)
  print(f"Log viewer em http://{HOST}:{PORT} lendo {LOG_PATH}")
  server.serve_forever()


if __name__ == "__main__":
  main()
