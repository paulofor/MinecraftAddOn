import base64
import importlib.util
import json
from pathlib import Path


SERVER_PATH = Path(__file__).parents[1] / "infra/mcp-bedrock-readonly/server.py"
SPEC = importlib.util.spec_from_file_location("mcp_server_resource_pack_test", SERVER_PATH)
SERVER = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(SERVER)


def test_install_global_resource_pack_uses_png_validation_and_updates_binding(tmp_path, monkeypatch):
  server_root = tmp_path / "MinecraftServer"
  source = server_root / "resource_packs" / "RealSource_LOW"
  world = server_root / "worlds" / "Bedrock level"
  backup = server_root / "backups" / "world-pre-pack.tar.gz"
  source.mkdir(parents=True)
  world.mkdir(parents=True)
  backup.parent.mkdir(parents=True)
  backup.write_bytes(b"backup")
  (world / "world_resource_packs.json").write_text("[]\n")
  (source / "manifest.json").write_text(json.dumps({
    "header": {
      "uuid": "e84ff511-bab3-4a4a-ad92-64ab325f8aaf",
      "version": [1, 8, 0],
    }
  }))
  png = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=")
  (source / "textures").mkdir()
  (source / "textures" / "sample.png").write_bytes(png)
  (source / "textures" / "terrain_texture.json").write_text("{}\n")

  monkeypatch.setattr(SERVER, "ALLOWED_ROOTS", [server_root.resolve()])
  monkeypatch.setattr(SERVER, "Path", Path)
  original_path = SERVER.Path

  class RootMappingPath(type(Path())):
    def __new__(cls, value="."):
      if str(value).startswith("/root/MinecraftServer"):
        value = str(value).replace("/root/MinecraftServer", str(server_root), 1)
      return original_path(value)

  monkeypatch.setattr(SERVER, "Path", RootMappingPath)
  planned = SERVER._install_global_resource_pack(
    str(source), str(world), str(backup), authorization_confirmed=True, execute=False
  )
  assert planned["status"] == "planned"
  assert planned["png_files"] == 1

  installed = SERVER._install_global_resource_pack(
    str(source), str(world), str(backup), authorization_confirmed=True, execute=True
  )
  assert installed["status"] == "installed"
  assert (world / "resource_packs/RealSource_LOW/textures/sample.png").read_bytes() == png
  bindings = json.loads((world / "world_resource_packs.json").read_text())
  assert bindings[-1] == {
    "pack_id": "e84ff511-bab3-4a4a-ad92-64ab325f8aaf",
    "version": [1, 8, 0],
  }


def test_install_global_resource_pack_requires_authorization():
  try:
    SERVER._install_global_resource_pack("/x", "/y", "/z", authorization_confirmed=False)
  except ValueError as exc:
    assert "authorization_confirmed=true" in str(exc)
  else:
    raise AssertionError("A instalação sem autorização deveria falhar")
