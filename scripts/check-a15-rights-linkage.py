#!/usr/bin/env python3
"""A-15: verify local, private media-rights references against the exact ZIP inventory.

This is a COVERAGE check only, not a determination that a license is valid.
The review CSV must be kept outside the public website and the Git repository.
Never print file names, evidence references or the review CSV itself in CI.
"""
import argparse
import csv
import datetime as dt
import re
from pathlib import Path

INVENTORY_FIELDS = (
    "asset_path", "release_sha", "category", "sha256", "size_bytes",
    "rights_status", "evidence_ref",
)
REVIEW_FIELDS = (
    "asset_path", "sha256", "decision", "reviewer_role",
    "reviewed_on", "evidence_ref",
)
SHA256 = re.compile(r"[a-f0-9]{64}\Z")
COMMIT = re.compile(r"[a-f0-9]{40}\Z")
EVIDENCE = re.compile(r"[A-Za-z0-9._:/#-]{1,128}\Z")


def read_csv(path, fields):
    with Path(path).open(encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream, strict=True)
        if reader.fieldnames != list(fields):
            raise ValueError("CSV column schema mismatch")
        return list(reader)


def safe_asset_path(value):
    parts = value.split("/") if isinstance(value, str) else []
    return bool(parts) and all(p and p not in {".", ".."} for p in parts) and (
        not value.startswith("/") and "\\" not in value and "\x00" not in value
    )


def create_template(inventory_rows):
    """A private fillable table; no permission assertions or secret data."""
    return [
        {"asset_path": x["asset_path"], "sha256": x["sha256"],
         "decision": "PENDING", "reviewer_role": "",
         "reviewed_on": "", "evidence_ref": ""}
        for x in inventory_rows
    ]


def check_linkage(inventory_rows, review_rows):
    """Return only safe numeric counts; exact path/hash equality prevents stale approvals."""
    counts = {
        "assets": len(inventory_rows), "approved": 0, "pending": 0,
        "missing": 0, "stale": 0, "invalid": 0, "extra": 0,
    }
    inventory = {}
    for row in inventory_rows:
        path = row.get("asset_path")
        if (not safe_asset_path(path) or path in inventory
                or not SHA256.fullmatch(row.get("sha256") or "")
                or not COMMIT.fullmatch(row.get("release_sha") or "")
                or not str(row.get("size_bytes") or "").isdigit()):
            counts["invalid"] += 1
            continue
        inventory[path] = row
    reviews = {}
    for row in review_rows:
        path = row.get("asset_path")
        if not safe_asset_path(path) or path in reviews:
            counts["invalid"] += 1
            continue
        reviews[path] = row

    for path, item in inventory.items():
        review = reviews.get(path)
        if review is None:
            counts["missing"] += 1
            continue
        if review.get("sha256") != item["sha256"]:
            counts["stale"] += 1
            continue
        if review.get("decision") != "APPROVED":
            counts["pending"] += 1
            continue
        date = review.get("reviewed_on") or ""
        try:
            reviewed = dt.date.fromisoformat(date)
            date_valid = reviewed <= dt.date.today()
        except ValueError:
            date_valid = False
        if (not date_valid or not (review.get("reviewer_role") or "").strip()
                or not EVIDENCE.fullmatch(review.get("evidence_ref") or "")):
            counts["invalid"] += 1
            continue
        counts["approved"] += 1
    counts["extra"] = len(set(reviews) - set(inventory))
    counts["coverage_passed"] = (
        counts["assets"] > 0
        and counts["approved"] == counts["assets"]
        and not any(counts[k] for k in ("pending", "missing", "stale", "invalid", "extra"))
    )
    return counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inventory", type=Path, required=True)
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument("--template", type=Path,
                        help="Create a PRIVATE review template; never upload to public GitHub")
    action.add_argument("--review", type=Path, help="Existing private review table")
    args = parser.parse_args()
    try:
        original = read_csv(args.inventory, INVENTORY_FIELDS)
        if args.template:
            if args.template.exists():
                parser.error("Refusing to overwrite an existing private review")
            args.template.parent.mkdir(parents=True, exist_ok=True)
            with args.template.open("x", encoding="utf-8", newline="") as stream:
                writer = csv.DictWriter(stream, fieldnames=REVIEW_FIELDS)
                writer.writeheader()
                writer.writerows(create_template(original))
            print("Private A-15 review template created; all decisions PENDING")
            return 0
        result = check_linkage(original, read_csv(args.review, REVIEW_FIELDS))
    except (OSError, ValueError, csv.Error):
        print("A-15 linkage: invalid CSV or unreadable file; private data not printed")
        return 2
    print("A-15 link coverage (not a legal approval): " +
          ", ".join(f"{key}={value}" for key, value in result.items()))
    return 0 if result["coverage_passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
