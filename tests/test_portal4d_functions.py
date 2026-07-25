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
    self.assertIn("findNearbyPortalSite(dimension, origin, radius)", script)

  def test_portal_manifests_are_paired_at_0_1_32(self) -> None:
    bp = json.loads((ROOT / "packs" / "BP_Portal4DEspacial" / "manifest.json").read_text(encoding="utf-8"))
    rp = json.loads((ROOT / "packs" / "RP_Portal4DEspacial" / "manifest.json").read_text(encoding="utf-8"))

    self.assertEqual([0, 1, 32], bp["header"]["version"])
    self.assertEqual(bp["header"]["version"], rp["header"]["version"])
    self.assertTrue(all(module["version"] == [0, 1, 32] for module in bp["modules"] + rp["modules"]))
    self.assertEqual([0, 1, 32], bp["dependencies"][0]["version"])


if __name__ == "__main__":
  unittest.main()
