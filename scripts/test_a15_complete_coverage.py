#!/usr/bin/env python3
"""Synthetic A-15 media+knowledge private-rights gate regressions."""
import datetime as dt
import hashlib
import importlib.util
from pathlib import Path
import unittest

SCRIPT = Path(__file__).with_name("check-a15-complete-coverage.py")
spec = importlib.util.spec_from_file_location("a15_combined_coverage", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class CombinedA15Tests(unittest.TestCase):
    def setUp(self):
        self.sha = "a" * 40
        today = dt.date.today().isoformat()
        self.media_item = {
            "asset_path": "tankonyvek/1/p001.jpg", "release_sha": self.sha,
            "category": "textbook-grade-1", "sha256": "b" * 64,
            "size_bytes": "2400", "rights_status": "UNVERIFIED",
            "evidence_ref": "",
        }
        self.media_review = {
            "asset_path": self.media_item["asset_path"], "sha256": "b" * 64,
            "decision": "APPROVED", "reviewer_role": "rights-reviewer",
            "reviewed_on": today, "evidence_ref": "private-archive/T-01",
        }
        self.source_label = "Hungarian tutor source"
        self.source_item = {
            "release_sha": self.sha, "source_label": self.source_label,
            "source_key": hashlib.sha256(self.source_label.encode()).hexdigest(),
            "passage_count": "1793", "content_sha256": "c" * 64,
            "rights_status": "UNVERIFIED", "evidence_ref": "",
        }
        self.source_review = {
            "source_key": self.source_item["source_key"],
            "content_sha256": "c" * 64, "decision": "APPROVED",
            "reviewer_role": "rights-reviewer", "reviewed_on": today,
            "evidence_ref": "private-archive/S-02",
        }

    def check(self, media_items=None, media_reviews=None,
              sources=None, source_reviews=None, sha=None):
        return module.verify_both(
            [self.media_item] if media_items is None else media_items,
            [self.media_review] if media_reviews is None else media_reviews,
            [self.source_item] if sources is None else sources,
            [self.source_review] if source_reviews is None else source_reviews,
            self.sha if sha is None else sha,
        )

    def test_exact_release_and_both_approved_references(self):
        outcome = self.check()
        self.assertTrue(outcome["coverage_passed"])
        self.assertEqual(outcome["sources"]["passages"], 1793)
        self.assertEqual(outcome["media"]["approved"], 1)

    def test_text_approval_cannot_substitute_for_media_approval(self):
        self.assertFalse(self.check(media_reviews=[])["coverage_passed"])
        self.assertFalse(self.check(source_reviews=[])["coverage_passed"])

    def test_changed_text_hash_requires_new_review(self):
        updated = {**self.source_item, "content_sha256": "d" * 64}
        outcome = self.check(sources=[updated])
        self.assertFalse(outcome["coverage_passed"])
        self.assertEqual(outcome["sources"]["stale"], 1)

    def test_mixed_release_shas_block_even_with_unchanged_file_hashes(self):
        swapped = {**self.source_item, "release_sha": "e" * 40}
        outcome = self.check(sources=[swapped])
        self.assertFalse(outcome["coverage_passed"])
        self.assertFalse(outcome["release_consistent"])
        self.assertFalse(self.check(
            media_items=[{**self.media_item, "release_sha": "e" * 40}]
        )["coverage_passed"])

    def test_wrong_candidate_sha_blocks_both_approved_inventories(self):
        outcome = self.check(sha="f" * 40)
        self.assertFalse(outcome["coverage_passed"])
        self.assertFalse(outcome["release_consistent"])

    def test_duplicate_or_mislabelled_source_fails_closed(self):
        duplicate = self.check(sources=[self.source_item, self.source_item])
        self.assertFalse(duplicate["coverage_passed"])
        self.assertGreater(duplicate["sources"]["invalid"], 0)
        bad_key = {**self.source_item, "source_label": "Another named source"}
        self.assertFalse(self.check(sources=[bad_key])["coverage_passed"])

    def test_rejected_future_or_missing_evidence_blocks(self):
        for changed in (
            {"decision": "PENDING"},
            {"reviewed_on": (dt.date.today() + dt.timedelta(days=1)).isoformat()},
            {"evidence_ref": ""},
        ):
            with self.subTest(changed=changed):
                review = {**self.source_review, **changed}
                self.assertFalse(self.check(source_reviews=[review])["coverage_passed"])

    def test_extra_review_and_empty_source_fail(self):
        extra = {**self.source_review, "source_key": "f" * 64}
        self.assertFalse(self.check(
            source_reviews=[self.source_review, extra]
        )["coverage_passed"])
        self.assertFalse(self.check(
            sources=[{**self.source_item, "passage_count": "0"}]
        )["coverage_passed"])

    def test_template_is_not_a_license_approval(self):
        template = module.source_template([self.source_item])
        self.assertEqual(template[0]["decision"], "PENDING")
        self.assertEqual(template[0]["evidence_ref"], "")
        self.assertFalse(self.check(source_reviews=template)["coverage_passed"])


if __name__ == "__main__":
    unittest.main()
