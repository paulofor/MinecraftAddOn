import json
from pathlib import Path


ROOT = Path(__file__).parents[1]
SCRIPT = ROOT / "packs/BP_PiramideEgitoGigante/scripts/main.js"
BP_MANIFEST = ROOT / "packs/BP_PiramideEgitoGigante/manifest.json"
RP_MANIFEST = ROOT / "packs/RP_PiramideEgitoGigante/manifest.json"


def test_interior_prototype_is_absolute_safe_and_reversible():
  script = SCRIPT.read_text()
  for expected in (
    '"piramide:refazer_interior"',
    '"piramide:restaurar_interior"',
    "parseAbsoluteCenter",
    "precheckExistingPyramid",
    "tickingarea add circle",
    "tickingarea remove",
    "rollbackInteriorCommands",
    "shell_invalido",
    "CONCLUÍDO centro=",
  ):
    assert expected in script
  assert "event.sourceEntity.location" not in script


def test_interior_prototype_has_spatial_variety_and_reward():
  script = SCRIPT.read_text()
  for expected in (
    "soul_lantern",
    "black_glazed_terracotta",
    "orange_glazed_terracotta",
    "red_sandstone",
    "chest",
    "diamond 3",
    "golden_apple 1",
    "beacon",
  ):
    assert expected in script


def test_four_seals_expansion_is_parametric_interactive_and_reversible():
  script = SCRIPT.read_text()
  for expected in (
    '"piramide:construir_quatro_selos"',
    '"piramide:remover_quatro_selos"',
    "sealsExpansionCommands",
    "sealsRollbackCommands",
    "precheckRichInterior",
    "playerInteractWithBlock",
    "CÂMARA DO FARAÓ",
    "SOL",
    "NILO",
    "CÉU",
    "VIDA",
  ):
    assert expected in script


def test_paired_manifests_are_bumped_together():
  bp = json.loads(BP_MANIFEST.read_text())
  rp = json.loads(RP_MANIFEST.read_text())
  expected = [0, 1, 31]
  assert bp["header"]["version"] == expected
  assert rp["header"]["version"] == expected
  assert all(module["version"] == expected for module in bp["modules"])
  assert all(module["version"] == expected for module in rp["modules"])
  assert bp["dependencies"][0]["version"] == expected
