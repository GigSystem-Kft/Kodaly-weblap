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
STATES = {"NOT_RUN", "BLOCKED", "FAIL", "PASS", "READY_TO_DEPLOY"}
# Owner-approved lean 1.0 gate: the complete 24-item audit is retained, but
# only these six independent safety/sign-off categories block a release.
# Any explicit FAIL anywhere still blocks; unknown/missing rows also block.
CRITICAL = {"A-06", "A-15", "A-20", "A-21", "A-23", "A-24"}


def check_ledger(path, expected_sha=None, scope="full"):
    if scope not in {"full", "minimum", "premerge"}:
        return ["Ledger: invalid acceptance scope"]
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
        # Merging is not the same as production deployment. Only A-24 may be
        # READY_TO_DEPLOY before merging: backup/restore and a non-destructive
        # deployment plan must be reviewed, but production must NOT be claimed
        # complete before the final main artifact exists.
        premerge_a24 = scope == "premerge" and code == "A-24" and status == "READY_TO_DEPLOY"
        if status == "READY_TO_DEPLOY" and code != "A-24":
            errors.append(f"{code}: READY_TO_DEPLOY is allowed only for A-24")
            continue
        if status != "PASS" and not premerge_a24:
            if scope == "full" or code in CRITICAL or status == "FAIL":
                errors.append(f"{code}: not approved ({status})")
            continue
        required_state = "READY_TO_DEPLOY" if premerge_a24 else "PASS"
        fields = ("reviewer_role", "checked_on", "candidate_sha", "evidence_ref")
        if premerge_a24:
            fields += ("notes",)
        for field in fields:
            if not record[field] or not record[field].strip():
                errors.append(f"{code}: {required_state} requires {field}")
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
    parser.add_argument("--scope", choices=("full", "minimum", "premerge"), default="full",
                        help="full=24/24; minimum=all six critical production approvals; premerge=five critical PASS plus A-24 READY_TO_DEPLOY; any FAIL blocks")
    args = parser.parse_args()
    if args.expected_sha and not re.fullmatch(r"[0-9a-f]{40}", args.expected_sha):
        parser.error("--expected-sha requires an exact Git commit SHA")
    errors = check_ledger(args.ledger, args.expected_sha, args.scope)
    if errors:
        print(f"ACCEPTANCE BLOCKED ({len(errors)} checks):")
        for error in errors:
            print(" -", error)
        return 1
    if args.scope == "premerge":
        print("1.0 PRE-MERGE gate: five critical PASS plus A-24 deployment preflight (READY_TO_DEPLOY or PASS).")
        print("PRODUCTION IS NOT APPROVED. Verify a separate post-deploy A-24 PASS against the actual main artifact before distribution.")
    elif args.scope == "minimum":
        print("1.0 production gate: six mandatory safety sign-offs approved; other audit rows retained.")
    else:
        print("24/24 evidence ledger rows recorded with reviewer, date, tested SHA and reference.")
    print("This ledger does not replace independent review of the evidence.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
