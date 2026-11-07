#!/usr/bin/env bash
# Regression: the read-only tutor remains available if the account MySQL is offline.
set -euo pipefail
ROOT="$(mktemp -d)"
trap '[[ -n "${SERVER_PID:-}" ]] && kill "$SERVER_PID" 2>/dev/null || true; rm -rf "$ROOT"' EXIT
trap 'echo "PHP offline-chat test failed; sanitized local server log:" >&2; tail -n 50 "$ROOT/php-server.log" >&2 || true' ERR
SITE="$ROOT/owner/htdocs/example.test"
mkdir -p "$SITE/api"
cp php/api/{index.php,tutor-search.php,tutor-sources.php,tutor-visuals.php,creative-answers.php,music-answers.php,tutor-image-generation.php,tutor-text-generation.php} "$SITE/api/"
cat > "$ROOT/owner/zeneelmelet-private.php" <<'PHP'
<?php
return [
  'app_origin' => 'http://localhost:8000',
  // Port 1 deliberately does not host MySQL.
  'db' => ['host'=>'127.0.0.1','port'=>1,'name'=>'offline','user'=>'test','password'=>'invalid'],
];
PHP
cat > "$SITE/api/knowledge.php" <<'PHP'
<?php
return [[
  'source'=>'Próba zeneelméleti tananyag',
  'label'=>'Príma vista – kottaolvasás',
  'text'=>'A príma vista első látásra történő kottaolvasás vagy lapról játszás, előzetes gyakorlás nélkül.'
]];
PHP
php -S 127.0.0.1:8000 -t "$SITE" >"$ROOT/php-server.log" 2>&1 &
SERVER_PID=$!
for i in $(seq 1 40); do
  if curl -fsS 'http://127.0.0.1:8000/api/index.php?route=health' >/dev/null 2>&1; then break; fi
  sleep .2
done
BASE='http://127.0.0.1:8000/api/index.php?route='
echo 'Checking auth/status with unreachable MySQL'; curl -fsS "${BASE}auth/status" | php -r '$x=json_decode(stream_get_contents(STDIN),true); if(!is_array($x) || $x["available"]!==false)exit(1);'
echo 'Checking chat/status with unreachable MySQL'; curl -fsS "${BASE}chat/status" | php -r '$x=json_decode(stream_get_contents(STDIN),true); if(($x["mode"]??null)!=="fallback" || ($x["knowledge"]["indexedChunks"]??0)<1)exit(1);'
echo 'Checking chat reply with unreachable MySQL'; curl -fsS -X POST "${BASE}chat" \
  -H 'Content-Type: application/json' \
  -H 'X-Requested-With: XMLHttpRequest' \
  --data '{"message":"Mit jelent a príma vista?"}' \
  | php -r '$x=json_decode(stream_get_contents(STDIN),true); if(($x["mode"]??null)!=="fallback" || stripos($x["reply"]??"","príma vista")===false) {fwrite(STDERR, json_encode($x));exit(1);}'
printf 'Offline database: tutor status and prima vista answers are operational.\n'
