#!/usr/bin/env bash
# Two independent HTTP sessions against the disposable MySQL/PHP pilot server.
# Shows stale-write rejection and lossless retry; not a production browser E2E.
set -euo pipefail
url='http://127.0.0.1:8000/api/index.php?route='
jar_a=/tmp/zm-admin-cookies
jar_b=/tmp/zm-device-b-cookies
login_status="$(curl -sS -c "$jar_b" -o /tmp/zm-device-login.json -w '%{http_code}' \
  -X POST "${url}auth/login" \
  -H 'Origin: http://localhost:8000' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'Content-Type: application/json' \
  --data '{"email":"pilot@example.org","password":"HarmadikTesztJelszo2026!"}')"
test "$login_status" = 200
curl -fsS -b "$jar_a" "${url}progress" > /tmp/zm-device-a-initial.json
curl -fsS -b "$jar_b" "${url}progress" > /tmp/zm-device-b-initial.json
php -r '
$a=json_decode(file_get_contents("/tmp/zm-device-a-initial.json"),true);
$b=json_decode(file_get_contents("/tmp/zm-device-b-initial.json"),true);
if(($a["revision"]??null)!==($b["revision"]??null))exit(1);
'
# Device A adds a favorite while B is offline with the older revision.
php -r '
$d=json_decode(file_get_contents("/tmp/zm-device-a-initial.json"),true);
$p=$d["progress"];
$p["favoriteExpressions"]=array_values(array_unique(array_merge($p["favoriteExpressions"]??[],["device-a"])));
file_put_contents("/tmp/zm-device-a-write.json",json_encode(["progress"=>$p,"revision"=>$d["revision"]],JSON_UNESCAPED_UNICODE));
'
put() {
  local jar="$1" source="$2" dest="$3"
  curl -sS -b "$jar" -o "$dest" -w '%{http_code}' -X PUT "${url}progress" \
    -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' \
    -H 'Content-Type: application/json' --data-binary "@$source"
}
test "$(put "$jar_a" /tmp/zm-device-a-write.json /tmp/zm-device-a-saved.json)" = 200
# B attempts a conflicting write without refreshing.
php -r '
$d=json_decode(file_get_contents("/tmp/zm-device-b-initial.json"),true);
$p=$d["progress"];
$p["favoriteExpressions"]=array_values(array_unique(array_merge($p["favoriteExpressions"]??[],["device-b"])));
file_put_contents("/tmp/zm-device-b-stale.json",json_encode(["progress"=>$p,"revision"=>$d["revision"]],JSON_UNESCAPED_UNICODE));
'
test "$(put "$jar_b" /tmp/zm-device-b-stale.json /tmp/zm-device-b-conflict.json)" = 409
# Application-level conflict reconciliation preserves both devices' new data.
php -r '
$c=json_decode(file_get_contents("/tmp/zm-device-b-conflict.json"),true);
if(!is_array($c["progress"]??null)||!is_string($c["revision"]??null))exit(1);
$p=$c["progress"];
$p["favoriteExpressions"]=array_values(array_unique(array_merge($p["favoriteExpressions"]??[],["device-b"])));
file_put_contents("/tmp/zm-device-b-retry.json",json_encode(["progress"=>$p,"revision"=>$c["revision"]],JSON_UNESCAPED_UNICODE));
'
test "$(put "$jar_b" /tmp/zm-device-b-retry.json /tmp/zm-device-b-saved.json)" = 200
curl -fsS -b "$jar_a" "${url}progress" > /tmp/zm-device-a-final.json
curl -fsS -b "$jar_b" "${url}progress" > /tmp/zm-device-b-final.json
php -r '
$a=json_decode(file_get_contents("/tmp/zm-device-a-final.json"),true);
$b=json_decode(file_get_contents("/tmp/zm-device-b-final.json"),true);
if(($a["revision"]??null)!==($b["revision"]??null))exit(1);
$f=$a["progress"]["favoriteExpressions"]??[];
foreach(["favorite-a","device-a","device-b"] as $term)if(!in_array($term,$f,true))exit(1);
if(($a["progress"]["quizScores"]["ritmus"]??null)!==90)exit(1);
if(count($a["progress"]["quizAttempts"]??[])!==1)exit(1);
'
echo 'PHP two-session concurrent progress reconciliation passed'
