#!/usr/bin/env python3
"""Fail-closed, evidence-based acceptance ledger gate for release 1.0."""
import argparse
import csv
import datetime as dt
from pathlib import Path
import re
import sys

FIELDS = ("audit_id", "status", "reviewer_role", "checked_on",
          "candidate_sha", "evidence_ref", "notes")
EXPECTED = {f"A-{i:02d}" for i in range(1, 25)}
STATES = {"NOT_RUN", "BLOCKED", "FAIL", "PASS"}


def check_ledger(path, expected_sha=None):
    errors = []
    try:
        with Path(path).open("r", encoding="utf-8-sig", newline="") as stream:
            reader = csv.DictReader(stream, strict=True)
            if reader.fieldnames != list(FIELDS):
                return ["Ledger: unexpected column structure"]
            records = list(reader)
    except (OSError, UnicodeError, csv.Error) as exc:
        return [f"Ledger: unreadable ({type(exc).__name__})"]

    found = set()
    for index, record in enumerate(records, 2):
        code = record["audit_id"]
        if code not in EXPECTED:
            errors.append(f"Row {index}: invalid audit ID {code!r}")
            continue
        if code in found:
            errors.append(f"Row {index}: duplicate {code}")
        found.add(code)
        status = record["status"]
        if status not in STATES:
            errors.append(f"{code}: invalid status {status!r}")
            continue
        if status != "PASS":
            errors.append(f"{code}: not approved ({status})")
            continue
        for field in ("reviewer_role", "checked_on", "candidate_sha", "evidence_ref"):
            if not record[field] or not record[field].strip():
                errors.append(f"{code}: PASS requires {field}")
        date = record["checked_on"]
        try:
            actual_date = dt.date.fromisoformat(date)
            if actual_date > dt.date.today():
                errors.append(f"{code}: future review date")
        except (TypeError, ValueError):
            errors.append(f"{code}: invalid review date")
        sha = record["candidate_sha"]
        if not re.fullmatch(r"[0-9a-f]{40}", sha or ""):
            errors.append(f"{code}: invalid 40-character candidate SHA")
        elif expected_sha and sha != expected_sha:
            errors.append(f"{code}: evidence tied to another source SHA")
        evidence = record["evidence_ref"]
        if evidence and (len(evidence) > 256 or
                         not re.fullmatch(r"[A-Za-z0-9._:/#-]+", evidence)):
            errors.append(f"{code}: evidence_ref must be a safe non-secret reference")
    for missing in sorted(EXPECTED - found):
        errors.append(f"Missing {missing}")
    if len(records) != 24:
        errors.append(f"Expected exactly 24 rows, received {len(records)}")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ledger", default="docs/acceptance/acceptance-1.0.csv")
    parser.add_argument("--expected-sha", help="Optional exact SHA for an immutable, pre-recorded evidence snapshot")
    args = parser.parse_args()
    if args.expected_sha and not re.fullmatch(r"[0-9a-f]{40}", args.expected_sha):
        parser.error("--expected-sha requires an exact Git commit SHA")
    errors = check_ledger(args.ledger, args.expected_sha)
    if errors:
        print(f"ACCEPTANCE BLOCKED ({len(errors)} checks):")
        for error in errors:
            print(" -", error)
        return 1
    print("24/24 evidence ledger rows recorded with reviewer, date, tested SHA and reference.")
    print("This ledger does not replace independent review of the evidence.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
