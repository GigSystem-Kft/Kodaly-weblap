#!/usr/bin/env python3
"""Stamp one built CloudPanel ZIP with the checked-out Git revision and core file hashes.

Git revision labels alone cannot detect an overwritten JS bundle or PHP handler.
The manifest therefore hashes the frontend entrypoints and runtime PHP modules.
The public manifest contains only filenames and checksums, never runtime secrets.
"""
import hashlib
import json
from pathlib import Path
import re
import sys

CORE_PHP = (
    "api/index.php",
    "api/admin.php",
    "api/deployment-audit.php",
    "api/tutor-text-generation.php",
    "api/tutor-image-generation.php",
    "api/tutor-visuals.php",
    "api/creative-answers.php",
    "api/music-answers.php",
    "api/vendor/autoload.php",
    "api/tutor-search.php",
    "api/tutor-sources.php",
    "api/knowledge.php",
)

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

entrypoints = set(re.findall(
    r"""(?:src|href)=["']/(assets/[A-Za-z0-9._-]+\.(?:js|css))["']""",
    markup,
))
if not any(name.endswith(".js") for name in entrypoints):
    raise SystemExit("Build has no JavaScript entrypoint to fingerprint")

# The HTML lists only entrypoints; Vite can also emit lazy-loaded JS/CSS.
# Hash every shipped script/style, including nested chunks, so a partial
# CloudPanel upload cannot pass with a stale dynamically imported module.
assets_dir = root / "assets"
if not assets_dir.is_dir() or assets_dir.is_symlink():
    raise SystemExit("Missing or unsafe frontend assets directory")
assets = {
    path.relative_to(root).as_posix()
    for path in assets_dir.rglob("*")
    if path.suffix.lower() in (".js", ".css") and
       (path.is_file() or path.is_symlink())
}
if not entrypoints.issubset(assets):
    raise SystemExit("HTML references a missing Vite entrypoint")
files = sorted(set(CORE_PHP) | assets)
digests = {}
for name in files:
    path = root / name
    if not path.is_file() or path.is_symlink():
        raise SystemExit(f"Required release fingerprint file missing or unsafe: {name}")
    digests[name] = hashlib.sha256(path.read_bytes()).hexdigest()

(root / "release-build.json").write_text(
    json.dumps({"schema": 2, "sha": revision, "files": digests},
               ensure_ascii=False, separators=(",", ":")) + "\n",
    encoding="utf-8"
)
(api / "release-build.php").write_text(
    "<?php\n// Public, non-secret checked-out release revision.\nreturn '" + revision + "';\n",
    encoding="utf-8"
)
print(f"Release fingerprint embedded in HTML, JSON and PHP: {revision}; {len(files)} file hashes")
