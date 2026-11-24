#!/usr/bin/env python3
"""A-15: inventory *actual packaged PHP tutor knowledge*, without copying its text.

Group passages by their source attribution. Content SHA-256 covers every
source item label and text, in packaged order. This is rights evidence
traceability, NOT a license or an approval. No private permissions are read.
"""
import argparse
import base64
import csv
import hashlib
import json
from pathlib import Path
import re

PHP_INDEX = re.compile(
    rb"return json_decode\(base64_decode\('([A-Za-z0-9+/=]+)'\), true, 512, JSON_THROW_ON_ERROR\);"
)
COMMIT = re.compile(r"[a-f0-9]{40}\Z")
MAX_PHP_BYTES = 24 * 1024 * 1024


def inventory(root: Path):
    manifest = json.loads((root / "release-build.json").read_text(encoding="utf-8"))
    release_sha = manifest.get("sha") if isinstance(manifest, dict) else None
    if not isinstance(release_sha, str) or not COMMIT.fullmatch(release_sha):
        raise ValueError("Missing or invalid release SHA")
    file = root / "api" / "knowledge.php"
    if not file.is_file() or file.is_symlink() or file.stat().st_size > MAX_PHP_BYTES:
        raise ValueError("Missing, unsafe or oversized PHP knowledge index")
    raw = file.read_bytes()
    matches = PHP_INDEX.findall(raw)
    if len(matches) != 1:
        raise ValueError("Invalid PHP knowledge payload")
    try:
        passages = json.loads(base64.b64decode(matches[0], validate=True))
    except (ValueError, UnicodeDecodeError) as exc:
        raise ValueError("Invalid PHP knowledge JSON") from exc
    if not isinstance(passages, list) or not passages:
        raise ValueError("Empty PHP knowledge index")
    groups = {}
    for entry in passages:
        if not isinstance(entry, dict):
            raise ValueError("Malformed knowledge passage")
        source, label, text = (entry.get(k) for k in ("source", "label", "text"))
        if not isinstance(source, str) or not source.strip():
            raise ValueError("Missing passage attribution")
        if not isinstance(label, str) or not label.strip():
            raise ValueError("Missing passage label")
        if not isinstance(text, str):
            raise ValueError("Missing passage text")
        # A generated bank may legitimately contain a blank string; retain it
        # in the content hash so that the audit inventories the *exact* PHP
        # payload without inventing text or silently filtering records.
        groups.setdefault(source, []).append(entry)
    rows = []
    for source, items in groups.items():
        canonical = json.dumps(items, ensure_ascii=False, separators=(",", ":"))
        rows.append({
            "release_sha": release_sha,
            "source_label": source,
            "source_key": hashlib.sha256(source.encode("utf-8")).hexdigest(),
            "passage_count": len(items),
            "content_sha256": hashlib.sha256(canonical.encode("utf-8")).hexdigest(),
            "rights_status": "UNVERIFIED",
            "evidence_ref": "",
        })
    return sorted(rows, key=lambda row: row["source_key"])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("release_root", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    if args.output.resolve().is_relative_to(args.release_root.resolve()):
        parser.error("Never write a rights inventory into the public release root")
    rows = inventory(args.release_root)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=[
            "release_sha", "source_label", "source_key", "passage_count",
            "content_sha256", "rights_status", "evidence_ref"
        ])
        writer.writeheader()
        writer.writerows(rows)
    print(f"A-15 tutor inventory: {len(rows)} attributed source groups; rights UNVERIFIED")
    print("This CSV contains source names and hashes but NO source texts or permission letters")


if __name__ == "__main__":
    main()
