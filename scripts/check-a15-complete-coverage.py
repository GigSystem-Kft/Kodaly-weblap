#!/usr/bin/env python3
"""A-15 offline coverage gate for BOTH shipped media and packaged PHP tutor text.

A successful result means review references exist for the exact file/text
digests and one release SHA. It is NOT a finding that permissions are lawful.
Never upload private review CSVs to the webroot or to the Git repository.
Only aggregate counts are printed, not source names or permission references.
"""
import argparse
import csv
import datetime as dt
import hashlib
import importlib.util
from pathlib import Path
import re

SCRIPT = Path(__file__).with_name("check-a15-rights-linkage.py")
spec = importlib.util.spec_from_file_location("a15_media_linkage", SCRIPT)
media = importlib.util.module_from_spec(spec)
spec.loader.exec_module(media)

SOURCE_FIELDS = (
    "release_sha", "source_label", "source_key", "passage_count",
    "content_sha256", "rights_status", "evidence_ref",
)
REVIEW_FIELDS = (
    "source_key", "content_sha256", "decision", "reviewer_role",
    "reviewed_on", "evidence_ref",
)


def source_template(rows):
    return [
        {"source_key": row["source_key"], "content_sha256": row["content_sha256"],
         "decision": "PENDING", "reviewer_role": "", "reviewed_on": "", "evidence_ref": ""}
        for row in rows
    ]


def check_source_linkage(rows, reviews, expected_sha):
    """Fail closed on duplicates, missing/changed source hashes and false approvals."""
    counts = {
        "sources": len(rows), "passages": 0, "approved": 0,
        "pending": 0, "missing": 0, "stale": 0,
        "invalid": 0, "extra": 0,
    }
    expected = {}
    for row in rows:
        key = row.get("source_key")
        label = row.get("source_label")
        digest = row.get("content_sha256")
        sha = row.get("release_sha")
        passages = row.get("passage_count")
        if (not isinstance(label, str) or not label.strip()
                or not isinstance(key, str)
                or not media.SHA256.fullmatch(key)
                or key != hashlib.sha256(label.encode("utf-8")).hexdigest()
                or key in expected
                or not isinstance(digest, str)
                or not media.SHA256.fullmatch(digest)
                or not isinstance(sha, str) or sha != expected_sha
                or not isinstance(passages, str) or not passages.isdecimal()
                or int(passages) < 1):
            counts["invalid"] += 1
            continue
        expected[key] = row
        counts["passages"] += int(passages)

    mapped = {}
    for review in reviews:
        key = review.get("source_key")
        if (not isinstance(key, str)
                or not media.SHA256.fullmatch(key)
                or key in mapped):
            counts["invalid"] += 1
            continue
        mapped[key] = review
    for key, row in expected.items():
        review = mapped.get(key)
        if review is None:
            counts["missing"] += 1
        elif review.get("content_sha256") != row["content_sha256"]:
            counts["stale"] += 1
        elif review.get("decision") != "APPROVED":
            counts["pending"] += 1
        else:
            try:
                date = dt.date.fromisoformat(review.get("reviewed_on") or "")
                date_ok = date <= dt.date.today()
            except ValueError:
                date_ok = False
            if (not date_ok or not (review.get("reviewer_role") or "").strip()
                    or not media.EVIDENCE.fullmatch(review.get("evidence_ref") or "")):
                counts["invalid"] += 1
            else:
                counts["approved"] += 1

    counts["extra"] = len(set(mapped) - set(expected))
    counts["coverage_passed"] = (
        counts["sources"] > 0 and counts["passages"] > 0
        and counts["approved"] == counts["sources"]
        and not any(counts[name] for name in
                    ("pending", "missing", "stale", "invalid", "extra"))
    )
    return counts


def verify_both(media_inventory, media_review, source_inventory, source_review, sha):
    """Reject a stale/mixed ZIP, even if both sets were separately approved."""
    if not isinstance(sha, str) or not media.COMMIT.fullmatch(sha):
        raise ValueError("Invalid candidate SHA")
    consistent = (
        bool(media_inventory) and bool(source_inventory)
        and all(row.get("release_sha") == sha for row in media_inventory)
        and all(row.get("release_sha") == sha for row in source_inventory)
    )
    media_counts = media.check_linkage(media_inventory, media_review)
    source_counts = check_source_linkage(source_inventory, source_review, sha)
    return {
        "release_consistent": consistent,
        "media": media_counts,
        "sources": source_counts,
        "coverage_passed": (
            consistent and media_counts["coverage_passed"]
            and source_counts["coverage_passed"]
        ),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-inventory", required=True, type=Path)
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument("--source-template", type=Path,
                        help="Create the source-review CSV in a private folder")
    action.add_argument("--source-review", type=Path)
    parser.add_argument("--media-inventory", type=Path)
    parser.add_argument("--media-review", type=Path)
    parser.add_argument("--expected-sha", help="Exact Git SHA for both inventories")
    args = parser.parse_args()
    if args.source_review and (not args.media_inventory or not args.media_review
                               or not args.expected_sha):
        parser.error("Review mode requires both media inventories/reviews and an exact SHA")
    if args.expected_sha and not media.COMMIT.fullmatch(args.expected_sha):
        parser.error("Expected SHA must be exactly 40 lowercase hex characters")
    try:
        source_rows = media.read_csv(args.source_inventory, SOURCE_FIELDS)
        if args.source_template:
            if args.source_template.exists():
                parser.error("Refusing to replace a private source review")
            args.source_template.parent.mkdir(parents=True, exist_ok=True)
            with args.source_template.open("x", encoding="utf-8", newline="") as stream:
                writer = csv.DictWriter(stream, fieldnames=REVIEW_FIELDS)
                writer.writeheader()
                writer.writerows(source_template(source_rows))
            print("Created private text-source review template with PENDING decisions")
            return 0
        result = verify_both(
            media.read_csv(args.media_inventory, media.INVENTORY_FIELDS),
            media.read_csv(args.media_review, media.REVIEW_FIELDS),
            source_rows, media.read_csv(args.source_review, REVIEW_FIELDS),
            args.expected_sha,
        )
    except (OSError, ValueError, TypeError, csv.Error):
        print("A-15: invalid or unreadable evidence; no private details printed")
        return 2

    print("A-15 inventory-reference coverage, NOT legal approval:")
    print("Release SHA consistent:", result["release_consistent"])
    for label in ("media", "sources"):
        counts = result[label]
        print(label + ": " + ", ".join(f"{key}={value}" for key, value in counts.items()))
    print("Combined media + tutor-source coverage passed:", result["coverage_passed"])
    return 0 if result["coverage_passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
