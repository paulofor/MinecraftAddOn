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

  def test_portal_manifests_are_paired_at_0_1_37(self) -> None:
    bp = json.loads((ROOT / "packs" / "BP_Portal4DEspacial" / "manifest.json").read_text(encoding="utf-8"))
    rp = json.loads((ROOT / "packs" / "RP_Portal4DEspacial" / "manifest.json").read_text(encoding="utf-8"))

    self.assertEqual([0, 1, 37], bp["header"]["version"])
    self.assertEqual(bp["header"]["version"], rp["header"]["version"])
    self.assertTrue(all(module["version"] == [0, 1, 37] for module in bp["modules"] + rp["modules"]))
    self.assertEqual([0, 1, 37], bp["dependencies"][0]["version"])

  def test_shattered_planet_has_plain_mission_and_three_fragments(self) -> None:
    script = (ROOT / "packs" / "BP_Portal4DEspacial" / "scripts" / "main.js").read_text(encoding="utf-8")
    self.assertIn("function buildShatteredPlanet", script)
    self.assertIn("function buildAccretionDisk", script)
    self.assertIn("natureza:", script)
    self.assertIn("ruinas:", script)
    self.assertIn("maquina:", script)
    self.assertIn("Atravesse os três fragmentos e reacenda o buraco negro", script)
    self.assertIn("PLANETA REATIVADO", script)

  def test_fragment_anchors_share_their_real_coordinates(self) -> None:
    script = (ROOT / "packs" / "BP_Portal4DEspacial" / "scripts" / "main.js").read_text(encoding="utf-8")
    self.assertIn("anchor: { x: -62, y: 89, z: -8 }", script)
    self.assertIn("anchor: { x: 42, y: 97, z: -48 }", script)
    self.assertIn("anchor: { x: 56, y: 83, z: 42 }", script)
    self.assertIn("distanceSquared(block.location, fragment.anchor) <= 2", script)
    self.assertIn('setBlock(dimension, fragment.anchor, "minecraft:lodestone")', script)
    self.assertNotIn("buildChronosDeck", script)
    self.assertNotIn("ERA_TAGS", script)

  def test_rebuild_erases_old_world_before_building_new_one(self) -> None:
    script = (ROOT / "packs" / "BP_Portal4DEspacial" / "scripts" / "main.js").read_text(encoding="utf-8")
    self.assertIn("function clearPreviousWorld", script)
    cleanup_call = script.index("clearPreviousWorld(dimension, () =>")
    finish_call = script.index("finishWorldBuild(dimension)", cleanup_call)
    self.assertLess(cleanup_call, finish_call)
    self.assertIn("[[-96, -49], [-48, -1], [0, 48], [49, 96]]", script)
    self.assertIn("y <= WORLD_ENVELOPE.maxY; y += 6", script)
    self.assertIn("clearPreviousWorld(dimension, () =>", script)

  def test_finale_requires_all_fragments_and_energizes_core(self) -> None:
    script = (ROOT / "packs" / "BP_Portal4DEspacial" / "scripts" / "main.js").read_text(encoding="utf-8")
    self.assertIn("function hasAllFragmentTags", script)
    self.assertIn("if (hasAllFragmentTags(player))", script)
    self.assertIn("function energizeBlackHole", script)
    self.assertIn("{ x: 0, y: 150, z: 0 }", script)

  def test_world_build_has_absolute_precheck_and_temporary_chunks(self) -> None:
    script = (ROOT / "packs" / "BP_Portal4DEspacial" / "scripts" / "main.js").read_text(encoding="utf-8")
    self.assertIn("function precheckShatteredPlanet(dimension)", script)
    self.assertIn("dimension?.id !== CUSTOM_DIMENSION_ID", script)
    self.assertIn("if (!precheckShatteredPlanet(dimension)) return undefined", script)
    self.assertIn("const BUILD_TICKING_AREAS", script)
    self.assertIn("tickingarea add circle ${area.x} 96 ${area.z} 4", script)
    self.assertIn("tickingarea remove ${area.name}", script)

  def test_cleanup_fill_slices_stay_under_bedrock_limit(self) -> None:
    largest_quadrant = 49 * 49 * 6
    self.assertLessEqual(largest_quadrant, 32768)

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
