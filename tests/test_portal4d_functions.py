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

  def test_portal_manifests_are_paired_at_0_1_29(self) -> None:
    bp = json.loads((ROOT / "packs" / "BP_Portal4DEspacial" / "manifest.json").read_text(encoding="utf-8"))
    rp = json.loads((ROOT / "packs" / "RP_Portal4DEspacial" / "manifest.json").read_text(encoding="utf-8"))

    self.assertEqual([0, 1, 29], bp["header"]["version"])
    self.assertEqual(bp["header"]["version"], rp["header"]["version"])
    self.assertTrue(all(module["version"] == [0, 1, 29] for module in bp["modules"] + rp["modules"]))
    self.assertEqual([0, 1, 29], bp["dependencies"][0]["version"])


if __name__ == "__main__":
  unittest.main()
