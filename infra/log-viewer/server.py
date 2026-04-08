#!/usr/bin/env python3
"""Servidor HTTP simples para visualizar logs do Minecraft com destaque de erros."""

from __future__ import annotations

import html
import os
import re
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

LOG_PATH = Path(os.getenv("LOG_PATH", "/logs/bedrock.log"))
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8080"))
DEFAULT_LINES = int(os.getenv("DEFAULT_LINES", "300"))
MAX_LINES = int(os.getenv("MAX_LINES", "3000"))

ERROR_RE = re.compile(r"(error|exception|fail(ed)?|traceback)", re.IGNORECASE)
WARN_RE = re.compile(r"(warn(ing)?|deprecated)", re.IGNORECASE)

CSS = """
:root {
  color-scheme: dark;
  --bg: #0f172a;
  --card: #111827;
  --text: #e5e7eb;
  --muted: #93a3b8;
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
  border-bottom: 1px solid #263041;
  background: #0b1220;
}
main { padding: 1rem 1.25rem 2rem; }
.card {
  background: var(--card);
  border: 1px solid #263041;
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
  border: 1px solid #36465e;
  background: #0b1220;
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
  background: #0b1220;
  border-radius: 8px;
  padding: 0.75rem;
}
.line { display: block; white-space: pre-wrap; word-break: break-word; }
.line.error { color: var(--error); }
.line.warn { color: var(--warn); }
.tag { color: var(--ok); font-weight: 600; }
"""


def read_last_lines(path: Path, num_lines: int) -> list[str]:
  if not path.exists():
    return [f"Arquivo de log não encontrado: {path}"]

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

    html_doc = f"""<!doctype html>
<html lang=\"pt-BR\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <meta http-equiv=\"refresh\" content=\"10\" />
  <title>Minecraft Bedrock Logs</title>
  <style>{CSS}</style>
</head>
<body>
  <header>
    <div class=\"tag\">Minecraft Log Viewer</div>
    <div class=\"meta\">Atualiza a cada 10s. Use um proxy/reverse proxy para expor em URL pública com TLS.</div>
  </header>
  <main>
    <div class=\"card\">
      <form class=\"controls\" method=\"GET\">
        <label>Linhas <input type=\"number\" name=\"lines\" min=\"20\" max=\"{MAX_LINES}\" value=\"{requested_lines}\" /></label>
        <label>Filtro <input type=\"text\" name=\"q\" value=\"{html.escape(query)}\" placeholder=\"error, failed, player name...\" /></label>
        <button type=\"submit\">Atualizar</button>
      </form>
      <div class=\"meta\">Arquivo: {LOG_PATH} | exibindo {len(filtered)} linha(s) | snapshot: {now}</div>
      <pre>{''.join(body_lines) if body_lines else '<span class="line">Nenhuma linha para exibir.</span>'}</pre>
    </div>
  </main>
</body>
</html>"""

    payload = html_doc.encode("utf-8")
    self.send_response(HTTPStatus.OK)
    self.send_header("Content-Type", "text/html; charset=utf-8")
    self.send_header("Content-Length", str(len(payload)))
    self.end_headers()
    self.wfile.write(payload)

  def log_message(self, fmt: str, *args) -> None:  # noqa: A003
    return


def main() -> None:
  server = ThreadingHTTPServer((HOST, PORT), LogHandler)
  print(f"Log viewer em http://{HOST}:{PORT} lendo {LOG_PATH}")
  server.serve_forever()


if __name__ == "__main__":
  main()
