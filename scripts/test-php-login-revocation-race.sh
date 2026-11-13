#!/usr/bin/env bash
# Deterministic concurrent login/password-rotation regression against a disposable
# MySQL database and PHP HTTP server. Never run against production.
set -euo pipefail
base='http://127.0.0.1:8000/api/index.php?route='
ready='/tmp/zm-login-race-locked'
rm -f "$ready"
race_id="$(php -r 'echo substr(($h=bin2hex(random_bytes(16))),0,8)."-".substr($h,8,4)."-".substr($h,12,4)."-".substr($h,16,4)."-".substr($h,20,12);')"
php -r '
$p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet;charset=utf8mb4","root","test-only-password",[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$s=$p->prepare("INSERT INTO zm_users (id,email,display_name,password_hash,role,email_verified_at) VALUES(?,?,?,?,?,UTC_TIMESTAMP())");
$s->execute([$argv[1],"login-race@example.org","Login race test",password_hash("OldRacePassword2026!",PASSWORD_ARGON2ID),"student"]);
' "$race_id"

# The writer obtains the exclusive user lock, then changes the stored hash
# while a POST /auth/login tries to authenticate with the now-obsolete password.
php -r '
$p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet;charset=utf8mb4","root","test-only-password",[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$p->beginTransaction();
$s=$p->prepare("SELECT id FROM zm_users WHERE id=? FOR UPDATE");
$s->execute([$argv[1]]);
if($s->fetchColumn()===false)exit(2);
file_put_contents("/tmp/zm-login-race-locked","locked");
usleep(1300000);
$s=$p->prepare("UPDATE zm_users SET password_hash=? WHERE id=?");
$s->execute([password_hash("NewRacePassword2026!",PASSWORD_ARGON2ID),$argv[1]]);
$p->commit();
' "$race_id" &
writer_pid=$!

for attempt in $(seq 1 60); do
  if test -f "$ready"; then break; fi
  sleep 0.05
done
if ! test -f "$ready"; then
  wait "$writer_pid" || true
  echo 'Concurrent login test writer never acquired the row lock' >&2
  exit 1
fi

stale_login="$(curl --max-time 12 -sS -o /tmp/zm-login-race-response.json -w '%{http_code}' \
 -X POST "${base}auth/login" -H 'Origin: http://localhost:8000' \
 -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' \
 --data '{"email":"login-race@example.org","password":"OldRacePassword2026!"}')"
wait "$writer_pid"
test "$stale_login" = 401

php -r '
$p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet;charset=utf8mb4","root","test-only-password");
$s=$p->prepare("SELECT COUNT(*) FROM zm_sessions WHERE user_id=?");
$s->execute([$argv[1]]);
if((int)$s->fetchColumn()!==0)exit(1);
' "$race_id"
new_login="$(curl -sS -c /tmp/zm-login-race-cookies -o /tmp/zm-login-race-response.json -w '%{http_code}' \
 -X POST "${base}auth/login" -H 'Origin: http://localhost:8000' \
 -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' \
 --data '{"email":"login-race@example.org","password":"NewRacePassword2026!"}')"
test "$new_login" = 200
test "$(curl -sS -b /tmp/zm-login-race-cookies -o /tmp/zm-login-race-response.json -w '%{http_code}' "${base}auth/me")" = 200
php -r '$j=json_decode(file_get_contents("/tmp/zm-login-race-response.json"),true);if(($j["user"]["email"]??null)!=="login-race@example.org")exit(1);'
echo 'PHP concurrent login and password rotation: no obsolete-password session issued'
