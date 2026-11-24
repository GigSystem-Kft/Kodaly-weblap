#!/usr/bin/env python3
"""Create a deterministic A-15 file inventory; NEVER infer copyright permission.

Use after verify-release-assets.py. Output belongs beside the CI ZIP, not
inside the publicly served webroot. No private permission text is included.
"""
import argparse
import csv
import hashlib
import json
import re
from pathlib import Path

# Track ALL shipped asset formats, not just the 379 known textbook/rhythm/note
# JPG files. External embeds and text/AI source rights are audited separately.
MEDIA_SUFFIXES = frozenset({
    ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg", ".ico",
    ".pdf", ".mp3", ".wav", ".ogg", ".opus", ".flac", ".m4a",
    ".mp4", ".webm", ".mid", ".midi", ".mxl", ".musicxml",
    ".woff", ".woff2", ".ttf", ".otf", ".eot",
})


def inventory(root: Path):
    manifest = json.loads((root / "release-build.json").read_text(encoding="utf-8"))
    sha = manifest.get("sha") if isinstance(manifest, dict) else None
    if not isinstance(sha, str) or re.fullmatch(r"[0-9a-f]{40}", sha) is None:
        raise ValueError("Missing or invalid release SHA")
    rows = []
    seen = set()
    def append(category, file):
        if not file.is_file() or file.is_symlink():
            raise ValueError(f"Missing or unsafe media file: {file}")
        relative = file.relative_to(root).as_posix()
        if relative in seen:
            raise ValueError(f"Duplicate media path: {relative}")
        seen.add(relative)
        rows.append({
            "asset_path": relative,
            "release_sha": sha,
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

    # A-15: catch the other local illustrations, logos, diagrams, externalized
    # fonts, notation/audio and documents actually included in this release.
    # They must not silently fall outside the rights review.
    for file in sorted(root.rglob("*")):
        if file.suffix.lower() in MEDIA_SUFFIXES:
            relative = file.relative_to(root).as_posix()
            if relative not in seen:
                append("other-shipped-media", file)
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
            "asset_path", "release_sha", "category", "sha256",
            "size_bytes", "rights_status", "evidence_ref"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"A-15 inventory: {len(rows)} media paths and SHA-256 hashes; all rights UNVERIFIED")
    print("Text copyright, embedded images, external links and AI indexing still need independent review")


if __name__ == "__main__":
    main()
