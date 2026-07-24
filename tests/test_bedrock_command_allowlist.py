#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import json
import os
import tempfile
import threading
import unittest
from unittest import mock
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SERVER_PATH = REPO_ROOT / "infra" / "mcp-bedrock-readonly" / "server.py"

spec = importlib.util.spec_from_file_location("mcp_bedrock_readonly_server", SERVER_PATH)
server = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(server)


class BedrockCommandAllowlistTest(unittest.TestCase):
  def test_allows_versioned_pyramid_commands(self) -> None:
    allowed = [
      "function piramide_egito_gigante/diagnosticar_local",
      "function piramide_egito_gigante/diagnostico_marcador_centro",
      "function piramide_egito_gigante/diagnostico_marcador_operador",
      "function piramide_egito_gigante/limpar_ceu_centro_historico",
      "execute as @a at @s run function piramide_egito_gigante/prototipo/precheck_chao",
      "execute as @a at @s run function piramide_egito_gigante/prototipo/fixar_ancora",
      "function piramide_egito_gigante/prototipo/montar_base_ponto_operador",
      "function piramide_egito_gigante/prototipo/montar_piramide_completa_segura",
      "execute as @a at @s run function piramide_egito_gigante/prototipo/limpar_base_chao",
      "function piramide_egito_gigante/prototipo/limpar_base_ponto_operador",
      "say MinecraftAddOn MCP run_bedrock_command operacional",
    ]
    for command in allowed:
      with self.subTest(command=command):
        self.assertEqual(server._validate_bedrock_command(command), command)


  def test_allows_exact_direct_player_marker_diagnostics(self) -> None:
    for command in [
      "execute as @a at @s run setblock ~ ~3 ~ minecraft:diamond_block",
      "execute as @a at @s run setblock ~ ~4 ~ minecraft:sea_lantern",
    ]:
      with self.subTest(command=command):
        self.assertEqual(server._validate_bedrock_command(command), command)

  def test_rejects_other_direct_setblock_commands(self) -> None:
    with self.assertRaisesRegex(ValueError, "destrutivos diretos"):
      server._validate_bedrock_command("setblock -195 72 114 minecraft:diamond_block")

  def test_rejects_dangerous_or_unknown_commands(self) -> None:
    rejected = [
      "/function piramide_egito_gigante/montar_centro_historico",
      "fill 0 0 0 1 1 1 air",
      "execute positioned 0 64 0 run setblock ~ ~ ~ air",
      "kill @e",
      "function outro_modulo/montar",
      "function piramide_egito_gigante/montar_centro_historico",
      "function piramide_egito_gigante/prototipo/montar_base_chao",
      "function piramide_egito_gigante/prototipo/fixar_ancora",
      "function piramide_egito_gigante/prototipo/montar_base_ancora",
      "execute as @a at @s run function piramide_egito_gigante/prototipo/montar_base_chao",
      "execute positioned 0 64 0 run function piramide_egito_gigante/prototipo/montar_base_chao",
      "function piramide_egito_gigante/reforcar_fundacao_centro_historico",
      "function piramide_egito_gigante/aventura/montar_interior",
      "execute positioned -194 69 111 run function piramide_egito_gigante/montar_completa",
      "execute positioned 1 2 3 run function piramide_egito_gigante/sprint1_base_fundacao",
    ]
    for command in rejected:
      with self.subTest(command=command):
        with self.assertRaises(ValueError):
          server._validate_bedrock_command(command)

  def test_tools_list_exposes_admin_tool_separately_from_readonly_tool(self) -> None:
    tools = {tool["name"] for tool in server._tools_list_result()["tools"]}
    self.assertIn("run_bedrock_command", tools)
    self.assertIn("run_read_command", tools)

  def test_run_bedrock_command_writes_to_fifo_and_audit_log(self) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
      tmp = Path(tmpdir)
      fifo = tmp / "bedrock-console.in"
      audit = tmp / "bedrock-console-commands.log"
      os.mkfifo(fifo)
      server.BEDROCK_CONSOLE_FIFO = fifo
      server.BEDROCK_COMMAND_LOG = audit

      received: list[str] = []

      def reader() -> None:
        with fifo.open("r", encoding="utf-8") as handle:
          received.append(handle.readline().rstrip("\n"))

      thread = threading.Thread(target=reader)
      thread.start()
      result = server._run_bedrock_command(
        "say MinecraftAddOn MCP run_bedrock_command operacional",
        executor="unit-test",
      )
      thread.join(timeout=2)

      self.assertFalse(thread.is_alive())
      self.assertEqual(received, ["say MinecraftAddOn MCP run_bedrock_command operacional"])
      self.assertEqual(result["status"], "sent")
      audit_lines = audit.read_text(encoding="utf-8").splitlines()
      self.assertEqual(len(audit_lines), 1)
      payload = json.loads(audit_lines[0])
      self.assertEqual(payload["status"], "sent")
      self.assertEqual(payload["executor"], "unit-test")

  def test_plan_build_location_blocks_default_pyramid_before_command_generation(self) -> None:
    plan = server._plan_build_location(approval_confirmed=False)

    self.assertTrue(plan["approval_required"])
    self.assertIsNone(plan["command_after_approval"])
    self.assertIsNone(plan["recommended_center"])
    self.assertEqual(plan["size"], {"x": 129, "y": 68, "z": 129})
    self.assertEqual(plan["confidence"], "blocked")

  def test_plan_build_location_blocks_default_pyramid_after_floating_incident(self) -> None:
    plan = server._plan_build_location(approval_confirmed=True)

    self.assertTrue(plan["approval_required"])
    self.assertTrue(plan["requires_visual_validation"])
    self.assertEqual(plan["confidence"], "blocked")
    self.assertIsNone(plan["command_after_approval"])
    self.assertIn("estrutura flutuante", plan["reasons"][0])

  def test_plan_build_location_blocks_command_when_sampling_is_uncertain(self) -> None:
    suggestion = {
      "recommended_center": {"x": 10, "y": 64, "z": 20},
      "affected_area": {"x": [1, 19], "y": [61, 70], "z": [11, 29]},
      "confidence": "medium",
      "reasons": ["teste"],
      "warnings": [],
    }
    with mock.patch.object(server, "_suggest_arena_location", return_value=suggestion), \
      mock.patch.object(server, "_sample_build_blocks", return_value={"samples": [], "errors": [{"error": "LevelDB"}], "risky_blocks": []}):
      plan = server._plan_build_location(
        build_key="custom",
        function_path="custom_mod/montar",
        approval_confirmed=True,
      )

    self.assertTrue(plan["approval_required"])
    self.assertTrue(plan["requires_visual_validation"])
    self.assertIsNone(plan["command_after_approval"])

  def test_execute_planned_build_blocks_without_approval(self) -> None:
    plan = {
      "approval_required": True,
      "command_after_approval": None,
    }
    with mock.patch.object(server, "_plan_build_location", return_value=plan):
      result = server._execute_planned_build(approval_confirmed=False, execute=False)

    self.assertEqual(result["status"], "blocked_by_precheck_or_missing_approval")
    self.assertIsNone(result["execution"])

  def test_execute_planned_build_blocks_pyramid_megabuild_without_command(self) -> None:
    plan = {
      "approval_required": True,
      "recommended_center": None,
      "command_after_approval": None,
    }
    with mock.patch.object(server, "_plan_build_location", return_value=plan), \
      mock.patch.object(server, "_run_bedrock_command") as run_command:
      result = server._execute_planned_build(
        approval_confirmed=True,
        execute=True,
        executor="unit-test",
        confirmation_token="EXECUTAR_piramide_egito_gigante_-194_69_111",
      )

    self.assertEqual(result["status"], "blocked_by_precheck_or_missing_approval")
    run_command.assert_not_called()

  def test_backup_world_creates_tarball_with_hash(self) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
      tmp = Path(tmpdir)
      world = tmp / "worlds" / "Bedrock level"
      db = world / "db"
      db.mkdir(parents=True)
      (db / "CURRENT").write_text("MANIFEST-000001\n", encoding="utf-8")
      output = tmp / "uploads"

      original_roots = server.ALLOWED_ROOTS
      server.ALLOWED_ROOTS = [tmp.resolve()]
      try:
        result = server._backup_world(str(world), str(output), label="pre piramide")
      finally:
        server.ALLOWED_ROOTS = original_roots

      archive = Path(result["archive_path"])
      self.assertEqual(result["status"], "created")
      self.assertTrue(archive.exists())
      self.assertGreater(result["bytes"], 0)
      self.assertRegex(result["sha256"], r"^[0-9a-f]{64}$")
      self.assertIn("pre-piramide", archive.name)

  def test_tools_list_exposes_backup_world(self) -> None:
    tools = {tool["name"] for tool in server._tools_list_result()["tools"]}
    self.assertIn("backup_world", tools)

  def test_blocks_function_commands_when_allow_cheats_false(self) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
      props = Path(tmpdir) / "server.properties"
      props.write_text("allow-cheats=false\n", encoding="utf-8")
      with mock.patch.object(server, "BEDROCK_SERVER_PROPERTIES", props), \
        mock.patch.object(server, "BEDROCK_CONSOLE_FIFO", Path(tmpdir) / "missing.fifo"), \
        mock.patch.object(server, "BEDROCK_COMMAND_LOG", Path(tmpdir) / "commands.log"):
        with self.assertRaisesRegex(RuntimeError, "allow-cheats=true"):
          server._run_bedrock_command("function piramide_egito_gigante/diagnostico_marcador_operador")

        audit = (Path(tmpdir) / "commands.log").read_text(encoding="utf-8")
        self.assertIn('"status": "blocked"', audit)

  def test_allows_say_when_allow_cheats_false(self) -> None:
    with tempfile.TemporaryDirectory() as tmpdir:
      props = Path(tmpdir) / "server.properties"
      props.write_text("allow-cheats=false\n", encoding="utf-8")
      fifo = Path(tmpdir) / "console.in"
      os.mkfifo(fifo)
      received: list[str] = []

      def reader() -> None:
        with fifo.open("r", encoding="utf-8") as handle:
          received.append(handle.readline().strip())

      thread = threading.Thread(target=reader)
      thread.start()
      with mock.patch.object(server, "BEDROCK_SERVER_PROPERTIES", props), \
        mock.patch.object(server, "BEDROCK_CONSOLE_FIFO", fifo), \
        mock.patch.object(server, "BEDROCK_COMMAND_LOG", Path(tmpdir) / "commands.log"):
        result = server._run_bedrock_command("say MinecraftAddOn MCP run_bedrock_command operacional")

      thread.join(timeout=2)
      self.assertEqual(result["status"], "sent")
      self.assertEqual(received, ["say MinecraftAddOn MCP run_bedrock_command operacional"])


if __name__ == "__main__":
  unittest.main()
