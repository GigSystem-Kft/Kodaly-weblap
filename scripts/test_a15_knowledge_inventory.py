#!/usr/bin/env python3
"""A-15 PHP tutor source inventory regressions without protected source text."""
import base64
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).with_name("build-a15-knowledge-inventory.py")
spec = importlib.util.spec_from_file_location("a15_knowledge_inventory", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class KnowledgeRightsInventoryTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        (self.root / "api").mkdir()
        (self.root / "release-build.json").write_text(
            json.dumps({"sha": "a" * 40}), encoding="utf-8"
        )
        self.entries = [
            {"source": "Hungarian glossary", "label": "Ritmus", "text": "Időértékek"},
            {"source": "Hungarian glossary", "label": "Kvint", "text": "Hét félhang"},
            {"source": "First-party lesson", "label": "01. Tananyag",
             "text": "Saját szöveg", "contextApproved": True},
        ]
        self.write_index()

    def write_index(self):
        encoded = base64.b64encode(json.dumps(
            self.entries, ensure_ascii=False).encode("utf-8")).decode("ascii")
        (self.root / "api" / "knowledge.php").write_text(
            "<?php\nreturn json_decode(base64_decode('" + encoded +
            "'), true, 512, JSON_THROW_ON_ERROR);\n", encoding="utf-8"
        )

    def test_all_packaged_source_groups_covered_without_original_text(self):
        rows = module.inventory(self.root)
        self.assertEqual(len(rows), 2)
        self.assertEqual(sum(x["passage_count"] for x in rows), 3)
        self.assertTrue(all(x["release_sha"] == "a" * 40 for x in rows))
        self.assertTrue(all(x["rights_status"] == "UNVERIFIED" for x in rows))
        self.assertTrue(all(not x["evidence_ref"] for x in rows))
        self.assertFalse(any("Időértékek" in str(x) for x in rows))
        self.assertEqual({x["source_label"] for x in rows},
                         {"Hungarian glossary", "First-party lesson"})

    def test_changed_source_passage_changes_group_digest(self):
        before = {x["source_label"]: x["content_sha256"]
                  for x in module.inventory(self.root)}
        self.entries[0]["text"] = "Változtatott szöveg"
        self.write_index()
        after = {x["source_label"]: x["content_sha256"]
                 for x in module.inventory(self.root)}
        self.assertNotEqual(before["Hungarian glossary"],
                            after["Hungarian glossary"])
        self.assertEqual(before["First-party lesson"], after["First-party lesson"])

    def test_blank_text_is_inventory_data_not_an_implicit_drop(self):
        self.entries[0]["text"] = ""
        self.write_index()
        rows = module.inventory(self.root)
        self.assertEqual(sum(row["passage_count"] for row in rows), 3)
        self.assertEqual(len(rows), 2)

    def test_missing_source_attribution_fails_closed(self):
        del self.entries[0]["source"]
        self.write_index()
        with self.assertRaisesRegex(ValueError, "Missing passage attribution"):
            module.inventory(self.root)

    def test_invalid_release_sha_fails_closed(self):
        (self.root / "release-build.json").write_text(
            '{"sha":"unverified"}', encoding="utf-8"
        )
        with self.assertRaisesRegex(ValueError, "release SHA"):
            module.inventory(self.root)

    def test_malformed_payload_fails_closed(self):
        (self.root / "api" / "knowledge.php").write_text(
            "<?php return json_decode(base64_decode('!!!'), true, 512, JSON_THROW_ON_ERROR);",
            encoding="utf-8"
        )
        with self.assertRaisesRegex(ValueError, "Invalid PHP knowledge payload"):
            module.inventory(self.root)


if __name__ == "__main__":
    unittest.main()
