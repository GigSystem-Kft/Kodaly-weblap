#!/usr/bin/env python3
"""Fail-closed A-15 media evidence-linkage regressions (no real license files)."""
import importlib.util
from pathlib import Path
import unittest

SCRIPT = Path(__file__).with_name("check-a15-rights-linkage.py")
spec = importlib.util.spec_from_file_location("a15_rights_linkage", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class RightsLinkageTests(unittest.TestCase):
    def setUp(self):
        self.item = {
            "asset_path": "tankonyvek/1/p001.jpg",
            "release_sha": "a" * 40, "category": "textbook-grade-1",
            "sha256": "b" * 64, "size_bytes": "1200",
            "rights_status": "UNVERIFIED", "evidence_ref": "",
        }
        self.review = {
            "asset_path": self.item["asset_path"],
            "sha256": self.item["sha256"], "decision": "APPROVED",
            "reviewer_role": "rights-reviewer", "reviewed_on": "2026-11-24",
            "evidence_ref": "private-registry/R-001",
        }

    def assert_blocked(self, items, reviews, reason):
        result = module.check_linkage(items, reviews)
        self.assertFalse(result["coverage_passed"])
        self.assertGreater(result[reason], 0)

    def test_exact_asset_sha_and_traceable_review_can_link(self):
        result = module.check_linkage([self.item], [self.review])
        self.assertEqual(result["approved"], 1)
        self.assertTrue(result["coverage_passed"])

    def test_changed_media_requires_new_review(self):
        changed = {**self.item, "sha256": "c" * 64}
        self.assert_blocked([changed], [self.review], "stale")

    def test_missing_and_extra_reviews_fail(self):
        self.assert_blocked([self.item], [], "missing")
        other = {**self.review, "asset_path": "unknown.jpg"}
        self.assert_blocked([self.item], [self.review, other], "extra")

    def test_pending_and_rejected_remain_blocked(self):
        for decision in ("PENDING", "REJECTED"):
            with self.subTest(decision=decision):
                self.assert_blocked(
                    [self.item], [{**self.review, "decision": decision}], "pending"
                )

    def test_missing_review_metadata_and_unsafe_reference_fail(self):
        for field, bad in (
            ("reviewed_on", "2026-02-30"),
            ("reviewer_role", ""),
            ("evidence_ref", "private@example.org"),
        ):
            with self.subTest(field=field):
                self.assert_blocked(
                    [self.item], [{**self.review, field: bad}], "invalid"
                )

    def test_duplicate_review_and_unsafe_asset_path_fail(self):
        self.assert_blocked([self.item], [self.review, self.review], "invalid")
        bad = {**self.item, "asset_path": "../private/file.jpg"}
        self.assert_blocked([bad], [self.review], "invalid")

    def test_template_defaults_to_unverified_without_false_claims(self):
        rows = module.create_template([self.item])
        self.assertEqual(rows[0]["decision"], "PENDING")
        self.assertEqual(rows[0]["evidence_ref"], "")
        self.assertEqual(rows[0]["sha256"], self.item["sha256"])
        self.assertFalse(module.check_linkage([self.item], rows)["coverage_passed"])


if __name__ == "__main__":
    unittest.main()
