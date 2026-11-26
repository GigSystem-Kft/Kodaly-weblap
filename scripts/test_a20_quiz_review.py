#!/usr/bin/env python3
"""A-20 exact-release quiz review gate regressions with synthetic question text."""
import csv
import datetime as dt
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import unittest

SCRIPT = Path(__file__).with_name("check-a20-quiz-review.py")
spec = importlib.util.spec_from_file_location("a20_quiz_review", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class QuizReviewGateTests(unittest.TestCase):
    def setUp(self):
        self.sha = "a" * 40
        self.rows = []
        self.reviews = []
        for i in range(120):
            item_id = f"synthetic-q{i:03d}"
            q = {
                "id": item_id, "chapterId": "ritmus",
                "question": f"Mi a próbakérdés {i}? ☺",
                "options": ["Két nyolcad", "Három nyolcad", "Egy negyed"],
                "correctIndex": 0,
                "explanation": "A két nyolcad összege egy negyed.",
            }
            digest = hashlib.sha256(json.dumps(
                q, ensure_ascii=False, separators=(",", ":")
            ).encode("utf-8")).hexdigest()
            self.rows.append({
                "release_sha": self.sha, "question_id": item_id,
                "chapter_id": q["chapterId"], "question": q["question"],
                "options_json": json.dumps(q["options"], ensure_ascii=False,
                                            separators=(",", ":")),
                "correct_index": str(q["correctIndex"]),
                "correct_answer": q["options"][0],
                "explanation": q["explanation"], "item_sha256": digest,
                "decision": "PENDING", "reviewer_role": "",
                "reviewed_on": "", "evidence_ref": "",
            })
            self.reviews.append({
                "question_id": item_id, "item_sha256": digest,
                "decision": "APPROVED", "reviewer_role": "independent-music-reviewer",
                "reviewed_on": dt.date.today().isoformat(),
                "evidence_ref": f"private/A20-Q{i:03d}",
            })

    def test_exact_review_refs_can_pass_coverage_but_not_legal_meaning(self):
        result = module.check_review(self.rows, self.reviews, self.sha)
        self.assertTrue(result["coverage_passed"])
        self.assertEqual(result["approved"], 120)

    def test_missing_pending_or_stale_question_blocks(self):
        self.assertFalse(module.check_review(
            self.rows, self.reviews[:-1], self.sha)["coverage_passed"])
        pending = [{**self.reviews[0], "decision": "PENDING"}, *self.reviews[1:]]
        self.assertFalse(module.check_review(
            self.rows, pending, self.sha)["coverage_passed"])
        changed = [{**self.reviews[0], "item_sha256": "f" * 64}, *self.reviews[1:]]
        result = module.check_review(self.rows, changed, self.sha)
        self.assertFalse(result["coverage_passed"])
        self.assertEqual(result["stale"], 1)

    def test_forged_or_old_release_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "release"):
            module.check_review(self.rows, self.reviews, "b" * 40)
        with self.assertRaisesRegex(ValueError, "release"):
            module.check_review(self.rows, self.reviews, "bad-sha")

    def test_changed_question_even_with_same_correct_answer_is_rejected(self):
        changed = {**self.rows[0], "question": "Kicserélt feladat"}
        with self.assertRaisesRegex(ValueError, "contents"):
            module.check_review([changed, *self.rows[1:]], self.reviews, self.sha)

    def test_changed_answer_key_is_rejected(self):
        changed = {**self.rows[0], "correct_index": "1"}
        with self.assertRaisesRegex(ValueError, "key differs"):
            module.check_review([changed, *self.rows[1:]], self.reviews, self.sha)

    def test_duplicate_question_or_fabricated_approval_in_inventory_rejected(self):
        with self.assertRaisesRegex(ValueError, "inventory"):
            module.validate_inventory([*self.rows, self.rows[0]], self.sha)
        changed = {**self.rows[0], "decision": "APPROVED"}
        with self.assertRaisesRegex(ValueError, "inventory"):
            module.validate_inventory([changed, *self.rows[1:]], self.sha)

    def test_missing_or_unverifiable_reviewer_metadata_is_blocked(self):
        for update in (
            {"reviewer_role": ""}, {"evidence_ref": ""},
            {"reviewed_on": (dt.date.today() + dt.timedelta(days=1)).isoformat()},
            {"reviewed_on": "2026-02-30"},
        ):
            with self.subTest(update=update):
                changed = [{**self.reviews[0], **update}, *self.reviews[1:]]
                self.assertFalse(module.check_review(
                    self.rows, changed, self.sha)["coverage_passed"])

    def test_template_starts_pending_and_csv_schema_roundtrips(self):
        items = module.make_template(self.rows)
        self.assertEqual(len(items), 120)
        self.assertTrue(all(x["decision"] == "PENDING" for x in items))
        self.assertFalse(module.check_review(
            self.rows, items, self.sha)["coverage_passed"])
        buffer = io.StringIO(newline="")
        writer = csv.DictWriter(buffer, fieldnames=module.REVIEW_FIELDS)
        writer.writeheader()
        writer.writerows(items)
        buffer.seek(0)
        read = csv.DictReader(buffer)
        self.assertEqual(read.fieldnames, list(module.REVIEW_FIELDS))
        self.assertEqual(len(list(read)), 120)


if __name__ == "__main__":
    unittest.main()
