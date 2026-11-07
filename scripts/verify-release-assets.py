#!/usr/bin/env python3
"""Fail a release with incomplete image-backed learning resources."""
from pathlib import Path
import json
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "release")
errors = []
counts = {"textbook_pages": 0, "notes": 0, "rhythm": 0}

def valid_jpeg(path: Path) -> bool:
    """An expected image must be a real JPEG, not an HTML error page or placeholder."""
    if not path.is_file() or path.stat().st_size < 1024:
        return False
    with path.open("rb") as stream:
        if stream.read(3) != b"\\xff\\xd8\\xff":
            return False
        stream.seek(-2, 2)
        return stream.read(2) == b"\\xff\\xd9"

expected_pages = {1: 72, 2: 69, 3: 80, 4: 81}
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
    if len(pages) != expected_pages[book]:
        errors.append(f"Textbook {book}: expected {expected_pages[book]} indexed pages, found {len(pages)}")
    seen = set()
    for page in pages:
        number = page.get("oldal") if isinstance(page, dict) else None
        if not isinstance(number, int):
            errors.append(f"Invalid page entry in {index}: {page!r}")
            continue
        if number in seen:
            errors.append(f"Duplicate textbook {book} page: {number}")
        seen.add(number)
        image = directory / f"p{number:03d}.jpg"
        if not valid_jpeg(image):
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
counts["notes"] = len([p for p in notes if valid_jpeg(p)])
if counts["notes"] < 64:
    errors.append(f"Expected 64 note images, found {counts['notes']}")

print(f"Release media: {counts}")
for error in errors:
    print(f"::error::{error}", file=sys.stderr)
if errors:
    raise SystemExit(f"Release blocked: {len(errors)} incomplete resources")
print("Release media manifest passed")
