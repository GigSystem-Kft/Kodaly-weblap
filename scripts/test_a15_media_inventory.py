#!/usr/bin/env python3
"""Offline regression tests for A-15 media coverage and release SHA binding."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).with_name("build-a15-media-inventory.py")
spec = importlib.util.spec_from_file_location("a15_media_inventory", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class RightsInventoryTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.sha = "a" * 40
        (self.root / "release-build.json").write_text(
            json.dumps({"schema": 2, "sha": self.sha}), encoding="utf-8"
        )
        for grade, count in ((1, 72), (2, 69), (3, 80), (4, 81)):
            directory = self.root / "tankonyvek" / str(grade)
            directory.mkdir(parents=True)
            (directory / "oldalak.json").write_text(
                json.dumps([{"oldal": i} for i in range(1, count + 1)]),
                encoding="utf-8"
            )
            for i in range(1, count + 1):
                (directory / f"p{i:03d}.jpg").write_bytes(b"fixture-image")
        rhythm = self.root / "ritmikai"
        rhythm.mkdir()
        for i in range(1, 14):
            (rhythm / f"p{i:03d}.jpg").write_bytes(b"fixture-rhythm")
        notes = self.root / "assets" / "jegyzet"
        notes.mkdir(parents=True)
        for i in range(1, 65):
            (notes / f"note-{i:03d}.jpg").write_bytes(b"fixture-note")

    def test_every_known_and_additional_media_is_listed_with_sha(self):
        (self.root / "assets" / "logo.svg").write_text("<svg/>", encoding="utf-8")
        (self.root / "assets" / "sample.mxl").write_bytes(b"mxl")
        (self.root / "assets" / "font.woff2").write_bytes(b"font")
        rows = module.inventory(self.root)
        self.assertEqual(len(rows), 302 + 13 + 64 + 3)
        self.assertEqual(len({row["asset_path"] for row in rows}), len(rows))
        self.assertEqual([row["asset_path"] for row in rows],
                         sorted(row["asset_path"] for row in rows))
        self.assertTrue(all(row["release_sha"] == self.sha for row in rows))
        self.assertTrue(all(row["rights_status"] == "UNVERIFIED" for row in rows))
        self.assertTrue(all(not row["evidence_ref"] for row in rows))
        for relative in ("assets/logo.svg", "assets/sample.mxl", "assets/font.woff2"):
            self.assertEqual(next(row["category"] for row in rows
                                  if row["asset_path"] == relative),
                             "other-shipped-media")

    def test_missing_expected_page_fails_closed(self):
        (self.root / "tankonyvek" / "1" / "p001.jpg").unlink()
        with self.assertRaisesRegex(ValueError, "Missing or unsafe media"):
            module.inventory(self.root)

    def test_unexpected_media_symlink_fails_closed(self):
        target = self.root / "external.txt"
        target.write_text("external file", encoding="utf-8")
        (self.root / "assets" / "logo.png").symlink_to(target)
        with self.assertRaisesRegex(ValueError, "Missing or unsafe media"):
            module.inventory(self.root)

    def test_invalid_release_sha_fails_closed(self):
        (self.root / "release-build.json").write_text(
            json.dumps({"sha": "not-a-commit"}), encoding="utf-8"
        )
        with self.assertRaisesRegex(ValueError, "release SHA"):
            module.inventory(self.root)


if __name__ == "__main__":
    unittest.main()
