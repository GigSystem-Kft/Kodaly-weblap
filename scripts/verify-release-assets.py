#!/usr/bin/env python3
"""Fail a release with incomplete image-backed learning resources."""
from pathlib import Path
import json
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "release")
errors = []
counts = {"textbook_pages": 0, "notes": 0, "rhythm": 0}

for book in range(1, 5):
    directory = root / "tankonyvek" / str(book)
    index = directory / "oldalak.json"
    if not index.is_file():
        errors.append(f"Missing textbook index: {index}")
        continue
    try:
        pages = json.loads(index.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        errors.append(f"Unreadable textbook index: {index}: {exc}")
        continue
    if not isinstance(pages, list) or not pages:
        errors.append(f"Empty textbook index: {index}")
        continue
    for page in pages:
        number = page.get("oldal") if isinstance(page, dict) else None
        if not isinstance(number, int):
            errors.append(f"Invalid page entry in {index}: {page!r}")
            continue
        image = directory / f"p{number:03d}.jpg"
        if not image.is_file() or image.stat().st_size == 0:
            errors.append(f"Missing or empty textbook image: {image}")
        else:
            counts["textbook_pages"] += 1

for number in range(1, 14):
    image = root / "ritmikai" / f"p{number:03d}.jpg"
    if not image.is_file() or image.stat().st_size == 0:
        errors.append(f"Missing or empty rhythm image: {image}")
    else:
        counts["rhythm"] += 1

notes = list((root / "assets" / "jegyzet").glob("*.jpg"))
counts["notes"] = len([p for p in notes if p.stat().st_size > 0])
if counts["notes"] < 64:
    errors.append(f"Expected 64 note images, found {counts['notes']}")

print(f"Release media: {counts}")
for error in errors:
    print(f"::error::{error}", file=sys.stderr)
if errors:
    raise SystemExit(f"Release blocked: {len(errors)} incomplete resources")
print("Release media manifest passed")
