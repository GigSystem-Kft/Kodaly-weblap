#!/usr/bin/env python3
"""Create a deterministic A-15 file inventory; NEVER infer copyright permission.

Use after verify-release-assets.py. Output belongs beside the CI ZIP, not
inside the publicly served webroot. No private permission text is included.
"""
import argparse
import csv
import hashlib
import json
from pathlib import Path


def inventory(root: Path):
    rows = []
    def append(category, file):
        if not file.is_file() or file.is_symlink():
            raise ValueError(f"Missing or unsafe media file: {file}")
        rows.append({
            "asset_path": file.relative_to(root).as_posix(),
            "category": category,
            "sha256": hashlib.sha256(file.read_bytes()).hexdigest(),
            "size_bytes": file.stat().st_size,
            "rights_status": "UNVERIFIED",
            "evidence_ref": "",
        })

    for grade, expected in ((1, 72), (2, 69), (3, 80), (4, 81)):
        directory = root / "tankonyvek" / str(grade)
        pages = json.loads((directory / "oldalak.json").read_text(encoding="utf-8"))
        numbers = [p["oldal"] for p in pages]
        if len(numbers) != expected or len(set(numbers)) != expected:
            raise ValueError(f"Textbook {grade}: incorrect indexed page count")
        for number in sorted(numbers):
            if not isinstance(number, int):
                raise ValueError("Invalid textbook page number")
            append(f"textbook-grade-{grade}", directory / f"p{number:03d}.jpg")

    for number in range(1, 14):
        append("rhythm", root / "ritmikai" / f"p{number:03d}.jpg")

    notes = sorted((root / "assets" / "jegyzet").glob("*.jpg"))
    if len(notes) < 64:
        raise ValueError(f"Expected at least 64 note JPGs; found {len(notes)}")
    for file in notes:
        append("note-illustration", file)

    paths = [r["asset_path"] for r in rows]
    if len(paths) != len(set(paths)):
        raise ValueError("Duplicate media path")
    return sorted(rows, key=lambda row: row["asset_path"])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("release_root", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    rows = inventory(args.release_root)
    if args.output.resolve().is_relative_to(args.release_root.resolve()):
        parser.error("Rights inventory must stay outside the public release root")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=[
            "asset_path", "category", "sha256", "size_bytes",
            "rights_status", "evidence_ref"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"A-15 inventory: {len(rows)} media paths and SHA-256 hashes; all rights UNVERIFIED")
    print("Text copyright, embedded images, external links and AI indexing still need independent review")


if __name__ == "__main__":
    main()
