#!/usr/bin/env bash
# Az eredeti MTA–SZTE PDF pontos oldalainak megőrzése webes JPG-képként.
# Futtatás: bash scripts/render-rhythm-research-pages.sh /útvonal/az-eredeti.pdf
# Poppler pdftoppm és pdfinfo szükséges. A szöveg külön, a rhythmResearchPages.ts-ben indexelődik.
set -euo pipefail
if [[ $# -ne 1 || ! -f "$1" ]]; then
  echo "Használat: bash $0 /útvonal/ritmikai-fejleszto.pdf" >&2
  exit 2
fi
command -v pdfinfo >/dev/null || { echo "Hiányzik: pdfinfo (poppler-utils)" >&2; exit 2; }
command -v pdftoppm >/dev/null || { echo "Hiányzik: pdftoppm (poppler-utils)" >&2; exit 2; }
COUNT="$(pdfinfo "$1" | awk '/^Pages:/{print $2}')"
if [[ "$COUNT" != "13" ]]; then
  echo "Az eredeti dokumentumnak pontosan 13 oldalasnak kell lennie, kapott: $COUNT" >&2
  exit 1
fi
OUT="public/ritmikai"
mkdir -p "$OUT"
TEMP="$(mktemp -d)"
trap 'rm -rf "$TEMP"' EXIT
pdftoppm -r 140 -jpeg -jpegopt quality=82,optimize=y "$1" "$TEMP/p"
for n in $(seq 1 13); do
  src="$TEMP/p-$(printf '%02d' "$n").jpg"
  if [[ ! -s "$src" ]]; then echo "Hiányzik az eredeti $n. oldal" >&2; exit 1; fi
  cp "$src" "$OUT/p$(printf '%03d' "$n").jpg"
done
echo "Elkészült a 13 eredeti oldalkép: $OUT/p001.jpg–p013.jpg"
