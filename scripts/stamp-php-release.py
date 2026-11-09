#!/usr/bin/env python3
"""Stamp one checked-out Git revision into all layers of a CloudPanel PHP ZIP.

Public metadata contains only the source revision, never runtime secrets.
The PHP deployment diagnostic compares these stamps to catch partial
frontend/backend uploads that can silently break student progress syncing.
"""
import json
from pathlib import Path
import re
import sys

if len(sys.argv) != 3:
    raise SystemExit("Usage: stamp-php-release.py <assembled release directory> <40-char checked-out commit SHA>")
root = Path(sys.argv[1])
revision = sys.argv[2]
if re.fullmatch(r"[0-9a-f]{40}", revision) is None:
    raise SystemExit("Refusing to stamp an invalid Git revision")
html = root / "index.html"
api = root / "api"
if not html.is_file() or not api.is_dir():
    raise SystemExit("Frontend index or PHP API directory missing")
markup = html.read_text(encoding="utf-8")
if markup.count("</head>") != 1 or "zeneelmelet-build-sha" in markup:
    raise SystemExit("Missing HTML head or duplicate release revision stamp")
meta = f'<meta name="zeneelmelet-build-sha" content="{revision}">'
html.write_text(markup.replace("</head>", meta + "</head>", 1), encoding="utf-8")
(root / "release-build.json").write_text(
    json.dumps({"schema": 1, "sha": revision}, ensure_ascii=False, separators=(",", ":")) + "\n",
    encoding="utf-8"
)
(api / "release-build.php").write_text(
    "<?php\n// Public, non-secret checked-out release revision.\nreturn '" + revision + "';\n",
    encoding="utf-8"
)
print("Release fingerprint embedded in HTML, JSON and PHP: " + revision)
