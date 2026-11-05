#!/usr/bin/env bash
# Automated localhost-only PHP invitation acceptance test, NEVER production.
set -euo pipefail
ROOT="$(pwd)"
CONFIG="$(dirname "$ROOT")/zeneelmelet-private.php"
cleanup() {
  kill "${PHP_PID:-}" 2>/dev/null || true
  rm -f "$CONFIG"
}
trap cleanup EXIT

cat > "$CONFIG" <<'PHP'
<?php
return [
 'app_origin' => 'http://localhost:8000',
 'invite_registration' => true,
 'mail_enabled' => true,
 'mail_from' => 'test@example.org',
 'db' => ['host'=>'127.0.0.1','port'=>3306,'name'=>'zeneelmelet',
          'user'=>'root','password'=>'test-only-password']
];
PHP

# Run existing schema plus invitation migration with test-only MySQL service.
php -r '
$pdo=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet;charset=utf8mb4","root","test-only-password",
 [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
foreach (["database/schema.sql","database/V002__one_time_invitations.sql"] as $file) {
 $sql=file_get_contents($file);
 $sql=preg_replace("/^--.*$/m","",$sql);
 foreach (explode(";",$sql) as $statement) {
  if (trim($statement)!=="") $pdo->exec($statement);
 }
}
$code=str_repeat("ab",32);
$insert=$pdo->prepare("INSERT INTO zm_invitations(token_hash,email,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 7 DAY))");
$insert->execute([hash("sha256",$code),"pilot@example.org"]);
'

# Backfill old accounts first, then new users require verification.
php -r '
$pdo=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet;charset=utf8mb4","root","test-only-password",
 [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$sql=file_get_contents("database/V003__account_email_verification_reset.sql");
$sql=preg_replace("/^--.*$/m","",$sql);
foreach (explode(";",$sql) as $stmt) if(trim($stmt)!=="") $pdo->exec($stmt);
'
cat > /tmp/zm-test-sendmail <<'SH'
#!/bin/sh
cat > /tmp/zm-test-mail.txt
exit 0
SH
chmod +x /tmp/zm-test-sendmail
php -d sendmail_path=/tmp/zm-test-sendmail -S 127.0.0.1:8000 -t php > /tmp/zeneelmelet-php-test.log 2>&1 &
PHP_PID=$!
for i in $(seq 1 30); do
  if curl -fsS 'http://127.0.0.1:8000/api/index.php?route=health' >/dev/null; then break; fi
  sleep 1
done

URL='http://127.0.0.1:8000/api/index.php?route=auth/register'
body() {
  printf '{"email":"%s","displayName":"Teszt Hallgató","password":"EzEgyErősTesztJelszó2026!","invitationCode":"%s"}' "$1" "$2"
}
post() {
  local json="$1"
  curl -sS -o /tmp/zm-response.json -w '%{http_code}' -X POST "$URL" \
    -H 'Origin: http://localhost:8000' \
    -H 'X-Requested-With: XMLHttpRequest' \
    -H 'Content-Type: application/json' \
    --data "$json"
}
code="$(printf 'ab%.0s' {1..32})"
invalid="$(printf 'cd%.0s' {1..32})"
status="$(post "$(body 'pilot@example.org' "$invalid")")"
test "$status" = '403'
status="$(post "$(body 'other@example.org' "$code")")"
test "$status" = '403'
status="$(post "$(body 'pilot@example.org' "$code")")"
test "$status" = '201'
php -r '$j=json_decode(file_get_contents("/tmp/zm-response.json"),true); if(($j["verificationPending"]??false)!==true) exit(1);'
# Confirm account ownership through delivered verification link.
verifyToken="$(grep -oE 'account=verify&token=[a-f0-9]{64}' /tmp/zm-test-mail.txt | head -1 | cut -d= -f3)"
test "${#verifyToken}" = 64
verifyStatus="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/verify' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data "{\"token\":\"$verifyToken\"}")"
test "$verifyStatus" = '200'
verifyStatus="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/verify' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data "{\"token\":\"$verifyToken\"}")"
test "$verifyStatus" = '400'
status="$(post "$(body 'pilot@example.org' "$code")")"
test "$status" = '403'
php -r '
$p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet","root","test-only-password");
if ((int)$p->query("SELECT COUNT(*) FROM zm_users")->fetchColumn()!==1) exit(1);
if ((int)$p->query("SELECT COUNT(*) FROM zm_invitations WHERE used_at IS NOT NULL")->fetchColumn()!==1) exit(1);
'
# Lost-password flow: returns a one-time link and invalidates existing sessions.
resetStatus="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/reset-request' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data '{"email":"pilot@example.org"}')"
test "$resetStatus" = 200
resetToken="$(grep -oE 'account=reset&token=[a-f0-9]{64}' /tmp/zm-test-mail.txt | head -1 | cut -d= -f3)"
test "${#resetToken}" = 64
resetStatus="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/reset' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data "{\"token\":\"$resetToken\",\"password\":\"ValamiTeljesenUjJelszo2026!\"}")"
test "$resetStatus" = 200
resetStatus="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/reset' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data "{\"token\":\"$resetToken\",\"password\":\"UjabbJelszo2026!\"}")"
test "$resetStatus" = 400
echo 'PHP account pilot: invitation, verified email, replay prevention, password reset passed'
