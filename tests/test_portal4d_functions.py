import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FUNCTIONS = ROOT / "packs" / "BP_Portal4DEspacial" / "functions" / "portal_4d"


class Portal4DFunctionTests(unittest.TestCase):
  def test_score_conditions_use_executor_selector(self) -> None:
    paths = [
      FUNCTIONS / "precheck_local_10_72_92.mcfunction",
      FUNCTIONS / "montar_portal_local_10_72_92.mcfunction",
      FUNCTIONS / "ir_para_portal.mcfunction",
    ]

    for path in paths:
      content = path.read_text(encoding="utf-8")
      self.assertNotIn("execute if score #", content, path)
      for line in content.splitlines():
        if line.startswith("execute if score "):
          self.assertTrue(line.startswith("execute if score @s p4d_local_ok "), line)

  def test_public_mount_keeps_precheck_before_build(self) -> None:
    content = (FUNCTIONS / "montar_portal_local_10_72_92.mcfunction").read_text(encoding="utf-8")
    self.assertLess(
      content.index("function portal_4d/precheck_local_10_72_92"),
      content.index("run function portal_4d/construir_portal_local_10_72_92"),
    )

  def test_support_samples_match_actual_base_footprint(self) -> None:
    content = (FUNCTIONS / "precheck_local_10_72_92.mcfunction").read_text(encoding="utf-8")
    self.assertNotIn(" 71 85 ", content)
    self.assertIn("5 71 88 air", content)
    self.assertIn("15 71 88 air", content)
    self.assertIn("execute if score @s p4d_local_ok matches 0 run function portal_4d/diagnosticar_precheck_local_10_72_92", content)

  def test_parameterized_nearby_mount_uses_player_scriptevent(self) -> None:
    function = (FUNCTIONS / "montar_portal_proximo.mcfunction").read_text(encoding="utf-8")
    script = (ROOT / "packs" / "BP_Portal4DEspacial" / "scripts" / "main.js").read_text(encoding="utf-8")
    self.assertIn("scriptevent portal4d:montar_proximo 16", function)
    self.assertIn('const NEARBY_PORTAL_SCRIPT_EVENT_ID = "portal4d:montar_proximo"', script)
    self.assertIn("function findNearbyPortalSite(dimension, origin, requestedRadius)", script)
    self.assertIn('player.dimension.id !== "minecraft:overworld"', script)

  def test_coordinate_mount_loads_chunks_without_player_position(self) -> None:
    script = (ROOT / "packs" / "BP_Portal4DEspacial" / "scripts" / "main.js").read_text(encoding="utf-8")
    self.assertIn('const COORDINATE_PORTAL_SCRIPT_EVENT_ID = "portal4d:montar_coordenada"', script)
    self.assertIn("function mountPortalFromCoordinates(message)", script)
    self.assertIn("tickingarea add circle", script)
    self.assertIn("findNearbyPortalSite(dimension, { x, y, z }, rawRadius)", script)

  def test_portal_manifests_are_paired_at_0_1_35(self) -> None:
    bp = json.loads((ROOT / "packs" / "BP_Portal4DEspacial" / "manifest.json").read_text(encoding="utf-8"))
    rp = json.loads((ROOT / "packs" / "RP_Portal4DEspacial" / "manifest.json").read_text(encoding="utf-8"))

    self.assertEqual([0, 1, 35], bp["header"]["version"])
    self.assertEqual(bp["header"]["version"], rp["header"]["version"])
    self.assertTrue(all(module["version"] == [0, 1, 35] for module in bp["modules"] + rp["modules"]))
    self.assertEqual([0, 1, 35], bp["dependencies"][0]["version"])

  def test_chronos_mission_uses_plain_language_and_three_eras(self) -> None:
    script = (ROOT / "packs" / "BP_Portal4DEspacial" / "scripts" / "main.js").read_text(encoding="utf-8")
    self.assertIn('id: "origem"', script)
    self.assertIn('id: "agora"', script)
    self.assertIn('id: "amanha"', script)
    self.assertIn("X, Y e Z dizem ONDE; o momento diz QUANDO", script)
    self.assertIn("LINHA DO TEMPO COMPLETA", script)

  def test_chronos_controls_share_their_real_coordinates(self) -> None:
    script = (ROOT / "packs" / "BP_Portal4DEspacial" / "scripts" / "main.js").read_text(encoding="utf-8")
    self.assertIn("function buildChronosDeck", script)
    self.assertIn("origem: { x: -7, y: 80, z: -1 }", script)
    self.assertIn("agora: { x: 0, y: 80, z: 3 }", script)
    self.assertIn("amanha: { x: 7, y: 80, z: -1 }", script)
    self.assertIn("distanceSquared(block.location, ERA_CONTROLS[era.id]) <= 2", script)
    self.assertNotIn("buildThreeStepLearningLab", script)
    self.assertNotIn("buildTesseractProjection", script)

  def test_rebuild_erases_old_world_before_building_new_one(self) -> None:
    script = (ROOT / "packs" / "BP_Portal4DEspacial" / "scripts" / "main.js").read_text(encoding="utf-8")
    self.assertIn("function clearPreviousWorld", script)
    self.assertLess(script.index("clearPreviousWorld(dimension)"), script.index("system.runTimeout(() => buildChronosDeck(dimension)"))
    self.assertIn("X/Z=-30..30, Y=76..104", script)

  def test_obsolete_overworld_arena_functions_are_removed(self) -> None:
    self.assertFalse((FUNCTIONS / "construir_arena_4d.mcfunction").exists())
    self.assertFalse((FUNCTIONS / "polimento_sprint8.mcfunction").exists())
    self.assertFalse((ROOT / "packs" / "BP_Portal4DEspacial" / "scripts" / "controller_patch.js").exists())

  def test_manifest_loads_new_world_directly(self) -> None:
    bp = json.loads((ROOT / "packs" / "BP_Portal4DEspacial" / "manifest.json").read_text(encoding="utf-8"))
    script_module = next(module for module in bp["modules"] if module["type"] == "script")
    self.assertEqual("scripts/main.js", script_module["entry"])


if __name__ == "__main__":
  unittest.main()
