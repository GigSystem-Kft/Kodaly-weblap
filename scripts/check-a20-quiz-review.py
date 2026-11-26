#!/usr/bin/env python3
"""A-20: validate exact-release quiz inventory and private expert decisions.

Passing this is a traceability/coverage check, NOT independent proof that the
music-theory answer is correct. Keep signed review evidence in private storage.
No question text, reviewer details or evidence references are printed.
"""
import argparse
import csv
import datetime as dt
import hashlib
import json
from pathlib import Path
import re

INVENTORY_FIELDS = (
    "release_sha", "question_id", "chapter_id", "question", "options_json",
    "correct_index", "correct_answer", "explanation", "item_sha256",
    "decision", "reviewer_role", "reviewed_on", "evidence_ref",
)
REVIEW_FIELDS = (
    "question_id", "item_sha256", "decision", "reviewer_role",
    "reviewed_on", "evidence_ref",
)
SHA = re.compile(r"[0-9a-f]{40}\Z")
HASH = re.compile(r"[0-9a-f]{64}\Z")
EVIDENCE = re.compile(r"[A-Za-z0-9._:/#-]{1,128}\Z")


def read_csv(path, fields):
    with Path(path).open(encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream, strict=True)
        if reader.fieldnames != list(fields):
            raise ValueError("Invalid A-20 CSV column schema")
        rows = list(reader)
    return rows


def validate_inventory(rows, expected_sha):
    if not SHA.fullmatch(expected_sha or "") or len(rows) < 100:
        raise ValueError("Missing complete release/quiz bank")
    seen = set()
    for row in rows:
        id_ = row.get("question_id")
        if (row.get("release_sha") != expected_sha
                or not id_ or not id_.strip() or id_ in seen
                or not row.get("chapter_id") or not row.get("question")
                or not row.get("explanation")
                or row.get("decision") != "PENDING"
                or row.get("reviewer_role") or row.get("reviewed_on")
                or row.get("evidence_ref")
                or not HASH.fullmatch(row.get("item_sha256") or "")):
            raise ValueError("Invalid or mixed-release quiz inventory")
        seen.add(id_)
        try:
            options = json.loads(row["options_json"])
            index = int(row["correct_index"])
        except (ValueError, TypeError):
            raise ValueError("Invalid quiz answers") from None
        if (not isinstance(options, list) or len(options) < 2
                or any(not isinstance(x, str) or not x.strip() for x in options)
                or str(index) != row["correct_index"]
                or not 0 <= index < len(options)
                or options[index] != row["correct_answer"]):
            raise ValueError("Quiz key differs from options")
        canonical = {
            "id": id_, "chapterId": row["chapter_id"],
            "question": row["question"], "options": options,
            "correctIndex": index, "explanation": row["explanation"],
        }
        digest = hashlib.sha256(json.dumps(
            canonical, ensure_ascii=False, separators=(",", ":")
        ).encode("utf-8")).hexdigest()
        if digest != row["item_sha256"]:
            raise ValueError("Quiz contents differ from release item SHA")
    return seen


def make_template(rows):
    return [
        {"question_id": row["question_id"], "item_sha256": row["item_sha256"],
         "decision": "PENDING", "reviewer_role": "",
         "reviewed_on": "", "evidence_ref": ""}
        for row in rows
    ]


def check_review(inventory_rows, review_rows, expected_sha):
    validate_inventory(inventory_rows, expected_sha)
    counts = {
        "questions": len(inventory_rows), "approved": 0, "pending": 0,
        "missing": 0, "stale": 0, "invalid": 0, "extra": 0,
    }
    mapped = {}
    for row in review_rows:
        id_ = row.get("question_id")
        if not id_ or not id_.strip() or id_ in mapped:
            counts["invalid"] += 1
        else:
            mapped[id_] = row
    ids = {row["question_id"] for row in inventory_rows}
    for row in inventory_rows:
        review = mapped.get(row["question_id"])
        if review is None:
            counts["missing"] += 1
        elif review.get("item_sha256") != row["item_sha256"]:
            counts["stale"] += 1
        elif review.get("decision") != "APPROVED":
            counts["pending"] += 1
        else:
            try:
                date = dt.date.fromisoformat(review.get("reviewed_on") or "")
                valid_date = date <= dt.date.today()
            except ValueError:
                valid_date = False
            if (not valid_date or not (review.get("reviewer_role") or "").strip()
                    or not EVIDENCE.fullmatch(review.get("evidence_ref") or "")):
                counts["invalid"] += 1
            else:
                counts["approved"] += 1
    counts["extra"] = len(set(mapped) - ids)
    counts["coverage_passed"] = (
        counts["approved"] == counts["questions"]
        and not any(counts[x] for x in ("pending", "missing", "stale", "invalid", "extra"))
    )
    return counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inventory", type=Path, required=True)
    parser.add_argument("--expected-sha", required=True)
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument("--template", type=Path, help="Local private reviewer decision sheet")
    action.add_argument("--review", type=Path, help="Previously reviewed private decision CSV")
    args = parser.parse_args()
    try:
        rows = read_csv(args.inventory, INVENTORY_FIELDS)
        validate_inventory(rows, args.expected_sha)
        if args.template:
            if args.template.exists():
                raise ValueError("Refusing to overwrite previous reviewer decisions")
            target = args.template.resolve()
            for dirname in ("release", "dist", "public"):
                root = Path(dirname).resolve()
                if target == root or root in target.parents:
                    raise ValueError("Review sheet cannot be placed inside public files")
            args.template.parent.mkdir(parents=True, exist_ok=True)
            with args.template.open("x", encoding="utf-8", newline="") as stream:
                writer = csv.DictWriter(stream, fieldnames=REVIEW_FIELDS)
                writer.writeheader()
                writer.writerows(make_template(rows))
            print("Created private A-20 decision template; all questions PENDING")
            return 0
        counts = check_review(
            rows, read_csv(args.review, REVIEW_FIELDS), args.expected_sha
        )
    except (OSError, ValueError, csv.Error):
        print("A-20 review: invalid input or missing evidence; no private data shown")
        return 2
    print("A-20 evidence linkage (NOT independent expert approval): " +
          ", ".join(f"{key}={value}" for key, value in counts.items()))
    return 0 if counts["coverage_passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
