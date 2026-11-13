#!/usr/bin/env python3
"""Offline checks for the A-01–A-24 sign-off ledger validator."""
import csv
import importlib.util
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

SCRIPT = Path(__file__).with_name("check-acceptance-ledger.py")
spec = importlib.util.spec_from_file_location("acceptance_ledger", SCRIPT)
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)
SHA = "a" * 40


def records():
    return [
        {"audit_id": f"A-{n:02d}", "status": "PASS",
         "reviewer_role": "independent-reviewer", "checked_on": "2026-01-10",
         "candidate_sha": SHA, "evidence_ref": f"private-ledger/A-{n:02d}",
         "notes": "Reviewed"}
        for n in range(1, 25)
    ]


def run_validation(rows, expected_sha=None):
    with TemporaryDirectory() as directory:
        path = Path(directory) / "acceptance.csv"
        with path.open("w", encoding="utf-8", newline="") as stream:
            writer = csv.DictWriter(stream, fieldnames=checker.FIELDS)
            writer.writeheader()
            writer.writerows(rows)
        return checker.check_ledger(path, expected_sha)


class AcceptanceLedgerTests(unittest.TestCase):
    def test_valid_snapshot(self):
        self.assertEqual(run_validation(records(), SHA), [])

    def test_initial_state_blocks_release(self):
        rows = records()
        rows[0]["status"] = "NOT_RUN"
        self.assertTrue(any("A-01: not approved" in x for x in run_validation(rows)))

    def test_missing_evidence_blocks_release(self):
        rows = records()
        rows[1]["evidence_ref"] = ""
        self.assertTrue(any("A-02: PASS requires evidence_ref" in x for x in run_validation(rows)))

    def test_unexpected_candidate_blocks_explicit_sha_check(self):
        rows = records()
        rows[0]["candidate_sha"] = "b" * 40
        self.assertTrue(any("another source SHA" in x for x in run_validation(rows, SHA)))

    def test_duplicate_id_detected(self):
        rows = records()
        rows[1]["audit_id"] = "A-01"
        errors = run_validation(rows)
        self.assertTrue(any("duplicate A-01" in x for x in errors))
        self.assertTrue(any("Missing A-02" in x for x in errors))

    def test_future_date_detected(self):
        rows = records()
        rows[0]["checked_on"] = "2999-01-01"
        self.assertTrue(any("future review date" in x for x in run_validation(rows)))


if __name__ == "__main__":
    unittest.main()
