#!/usr/bin/env bash
# Called by test-php-invitations.sh while its disposable MySQL and PHP server run.
set -eEuo pipefail
BASE='http://127.0.0.1:8000/api/index.php?route='
ADMIN='/tmp/zm-admin-cookies'
OUT='/tmp/zm-site-editor-response.json'
test "$(curl -sS -o "$OUT" -w '%{http_code}' "$BASE"content/published)" = 200
php -r '$j=json_decode(file_get_contents("/tmp/zm-site-editor-response.json"),true);if(($j["entries"]??null)!==[])exit(1);'
test "$(curl -sS -o "$OUT" -w '%{http_code}' "$BASE"admin/site-content)" = 401
test "$(curl -sS -b "$ADMIN" -o "$OUT" -w '%{http_code}' "$BASE"admin/site-content)" = 200
php -r '$j=json_decode(file_get_contents("/tmp/zm-site-editor-response.json"),true);if(($j["revision"]??null)!==0)exit(1);'
# Reject forged writes: exact same-origin custom header remains mandatory.
test "$(curl -sS -b "$ADMIN" -o "$OUT" -w '%{http_code}' -X POST "$BASE"admin/site-content \
 -H 'Content-Type: application/json' --data '{"action":"save","revision":0,"draft":{}}')" = 403
editorPost() {
  local data="$1"
  curl -sS -b "$ADMIN" -o "$OUT" -w '%{http_code}' -X POST "$BASE"admin/site-content \
   -H 'Origin: http://localhost:8000' \
   -H 'X-Requested-With: XMLHttpRequest' \
   -H 'Content-Type: application/json' --data "$data"
}
test "$(editorPost '{"action":"save","revision":0,"draft":{"home.intro":{"text":"A **próba** szöveg","style":{"color":"indigo"}}}}')" = 200
curl -fsS "$BASE"content/published > "$OUT"
php -r '$j=json_decode(file_get_contents("/tmp/zm-site-editor-response.json"),true);if(($j["entries"]??null)!==[])exit(1);'
test "$(editorPost '{"action":"publish","revision":1}')" = 200
curl -fsS "$BASE"content/published > "$OUT"
php -r '$j=json_decode(file_get_contents("/tmp/zm-site-editor-response.json"),true);if(($j["entries"]["home.intro"]["text"]??null)!=="A **próba** szöveg")exit(1);'
test "$(editorPost '{"action":"publish","revision":1}')" = 409
test "$(editorPost '{"action":"save","revision":2,"draft":{"home.intro":{"text":"Második szöveg"}}}')" = 200
curl -fsS "$BASE"content/published > "$OUT"
php -r '$j=json_decode(file_get_contents("/tmp/zm-site-editor-response.json"),true);if(($j["entries"]["home.intro"]["text"]??null)!=="A **próba** szöveg")exit(1);'
test "$(editorPost '{"action":"rollback","revision":3,"rollbackRevision":1}')" = 200
curl -fsS "$BASE"content/published > "$OUT"
php -r '$j=json_decode(file_get_contents("/tmp/zm-site-editor-response.json"),true);if(($j["entries"]??null)!==[])exit(1);'
echo 'PHP content editor: guest/admin, draft isolation, publish, rollback, CSRF and version-lock passed'
