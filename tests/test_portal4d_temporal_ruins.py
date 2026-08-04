import json
from pathlib import Path


ROOT = Path(__file__).parents[1]
SCRIPT = ROOT / "packs/BP_Portal4DEspacial/scripts/main.js"
BP_MANIFEST = ROOT / "packs/BP_Portal4DEspacial/manifest.json"
RP_MANIFEST = ROOT / "packs/RP_Portal4DEspacial/manifest.json"


def test_temporal_ruins_are_absolute_safe_interactive_and_reversible():
  script = SCRIPT.read_text()
  for expected in (
    '"portal4d:construir_ruinas_temporais"',
    '"portal4d:remover_ruinas_temporais"',
    "parseAbsoluteCenter",
    "precheckRuinsTemporal",
    "absoluteCenterMatches",
    "apoios_invalidos",
    "tickingarea add circle",
    "tickingarea remove",
    "ruinsTemporalRollbackCommands",
    "handleRuinsTemporalInteraction",
    "ORIGEM",
    "ASCENSÃO",
    "APOGEU",
    "QUEDA",
  ):
    assert expected in script


def test_temporal_ruins_do_not_rebuild_the_whole_world_on_restart():
  script = SCRIPT.read_text()
  assert "ensureWorld(false);" in script
  assert "ensureWorld(true);" not in script
  assert 'blockId(dimension, { x: 0, y: 96, z: 18 }) === "minecraft:black_concrete"' in script


def test_portal4d_paired_manifests_are_bumped():
  bp = json.loads(BP_MANIFEST.read_text())
  rp = json.loads(RP_MANIFEST.read_text())
  expected = [0, 1, 38]
  assert bp["header"]["version"] == expected
  assert rp["header"]["version"] == expected
  assert all(module["version"] == expected for module in bp["modules"])
  assert all(module["version"] == expected for module in rp["modules"])
  assert bp["dependencies"][0]["version"] == expected
