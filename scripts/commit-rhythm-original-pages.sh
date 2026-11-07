#!/usr/bin/env bash
# Import only the exact site-owner-provided original 13-page PDF as image assets.
# Usage: bash scripts/commit-rhythm-original-pages.sh "/path/to/original.pdf"
set -euo pipefail
if [[ $# -ne 1 || ! -f "$1" ]]; then
  echo "Használat: bash $0 /útvonal/az-eredeti-13-oldalas.pdf" >&2
  exit 2
fi
cd "$(dirname "$0")/.."
current="$(git branch --show-current)"
required='fix/audit-p0-search-release-quiz-20261107'
if [[ "$current" != "$required" ]]; then
  echo "Biztonsági védelem: csak a $required fejlesztői ágon futhat; jelenlegi: $current" >&2
  exit 2
fi
if [[ -n "$(git diff --cached --name-only)" ]]; then
  echo "A Git indexben már vannak más változtatások; előbb rendezd azokat." >&2
  exit 2
fi
bash scripts/render-rhythm-research-pages.sh "$1"
for n in $(seq 1 13); do
  file="public/ritmikai/p$(printf '%03d' "$n").jpg"
  [[ -s "$file" ]] || { echo "Hiányzó oldalkép: $file" >&2; exit 1; }
done
git add public/ritmikai/p{001..013}.jpg
git commit -m "assets: include 13 SHA-verified original rhythm research pages"
git push origin "$required"
echo "A 13 eredeti oldalkép a fejlesztési ágra feltöltve. Várd meg a PR összes ellenőrzésének sikerét; main merge még nem történt."
