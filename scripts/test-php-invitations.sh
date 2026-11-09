#!/usr/bin/env bash
# Automated localhost-only PHP invitation acceptance test, NEVER production.
set -eEuo pipefail
trap 'echo "Account integration assertion failed at line $LINENO" >&2' ERR
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
 'mail_transport' => 'local-test',
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
# Asking for another verification link invalidates the original one.
resendStatus="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/resend-verification' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data '{"email":"pilot@example.org"}')"
test "$resendStatus" = 200
newVerifyToken="$(grep -oE 'account=verify&token=[a-f0-9]{64}' /tmp/zm-test-mail.txt | head -1 | cut -d= -f3)"
test "${#newVerifyToken}" = 64
test "$newVerifyToken" != "$verifyToken"
statusOld="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/verify' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data "{\"token\":\"$verifyToken\"}")"
test "$statusOld" = 400
verifyToken="$newVerifyToken"
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
# Invalid JSON shapes should give a controlled 400, never an internal
# PHP type error / 500. This also checks that malformed login data does not
# interfere with the valid existing account and later login.
for malformed in \
 '{"email":[],"password":"ValidLookingPassword2026!"}' \
 '{"email":{"nested":"pilot@example.org"},"password":"ValidLookingPassword2026!"}' \
 '{"email":"pilot@example.org","password":[]}' \
 '{"email":"","password":"ValidLookingPassword2026!"}'; do
  malformed_status="$(curl -sS -o /tmp/zm-malformed-login.json -w '%{http_code}' \
   -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/login' \
   -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' \
   -H 'Content-Type: application/json' --data "$malformed")"
  test "$malformed_status" = 400
done

# Login with reset password, change it while signed in and verify old session is gone.
loginStatus="$(curl -sS -c /tmp/zm-cookies.txt -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/login' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data '{"email":"pilot@example.org","password":"ValamiTeljesenUjJelszo2026!"}')"
test "$loginStatus" = 200
statusMe="$(curl -sS -b /tmp/zm-cookies.txt -o /tmp/zm-response.json -w '%{http_code}' 'http://127.0.0.1:8000/api/index.php?route=auth/me')"
test "$statusMe" = 200
php -r '$j=json_decode(file_get_contents("/tmp/zm-response.json"),true); if(($j["user"]["email"]??null)!=="pilot@example.org") exit(1);'
# A second signed-in device has its own independent cookie.
secondDeviceLogin="$(curl -sS -c /tmp/zm-second-device-cookies -o /tmp/zm-response.json -w '%{http_code}' \
 -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/login' \
 -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' \
 -H 'Content-Type: application/json' \
 --data '{"email":"pilot@example.org","password":"ValamiTeljesenUjJelszo2026!"}')"
test "$secondDeviceLogin" = 200
wrongPasswordChange="$(curl -sS -b /tmp/zm-second-device-cookies -o /tmp/zm-response.json -w '%{http_code}' \
 -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/change-password' \
 -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' \
 -H 'Content-Type: application/json' \
 --data '{"currentPassword":"EgyHelytelenJelszo2026!","newPassword":"Tilthatatlan2026!?"}')"
test "$wrongPasswordChange" = 403
test "$(curl -sS -b /tmp/zm-second-device-cookies -o /tmp/zm-response.json -w '%{http_code}' \
 'http://127.0.0.1:8000/api/index.php?route=auth/me')" = 200
# A reset email already sent before a manual password change must no
# longer authorize a second password rotation.
pendingResetStatus="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' \
 -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/reset-request' \
 -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' \
 -H 'Content-Type: application/json' \
 --data '{"email":"pilot@example.org"}')"
test "$pendingResetStatus" = 200
pendingResetToken="$(grep -oE 'account=reset&token=[a-f0-9]{64}' /tmp/zm-test-mail.txt | tail -1 | cut -d= -f3)"
test "${#pendingResetToken}" = 64
changeStatus="$(curl -sS -b /tmp/zm-cookies.txt -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/change-password' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data '{"currentPassword":"ValamiTeljesenUjJelszo2026!","newPassword":"HarmadikTesztJelszo2026!"}')"
test "$changeStatus" = 200
staleResetStatus="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' \
 -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/reset' \
 -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' \
 -H 'Content-Type: application/json' \
 --data "{\"token\":\"$pendingResetToken\",\"password\":\"IlletektelenVisszaallitas2026!\"}")"
test "$staleResetStatus" = 400
# Password rotation revokes the other device, not just the current browser.
curl -fsS -b /tmp/zm-second-device-cookies \
 'http://127.0.0.1:8000/api/index.php?route=auth/me' > /tmp/zm-second-device-me.json
php -r '$j=json_decode(file_get_contents("/tmp/zm-second-device-me.json"),true); if(!array_key_exists("user",$j)||$j["user"]!==null)exit(1);'
staleChange="$(curl -sS -b /tmp/zm-second-device-cookies -o /tmp/zm-response.json -w '%{http_code}' \
 -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/change-password' \
 -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' \
 -H 'Content-Type: application/json' \
 --data '{"currentPassword":"ValamiTeljesenUjJelszo2026!","newPassword":"HelytelenNegyedik2026!"}')"
test "$staleChange" = 401
curl -fsS -b /tmp/zm-cookies.txt 'http://127.0.0.1:8000/api/index.php?route=auth/me' > /tmp/zm-response.json
php -r '$j=json_decode(file_get_contents("/tmp/zm-response.json"),true); if(!array_key_exists("user",$j) || $j["user"]!==null) exit(1);'
loginStatus="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/login' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data '{"email":"pilot@example.org","password":"ValamiTeljesenUjJelszo2026!"}')"
test "$loginStatus" = 401
loginStatus="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/login' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data '{"email":"pilot@example.org","password":"HarmadikTesztJelszo2026!"}')"
test "$loginStatus" = 200
# Admin role activation is an explicit one-time database operation, never a public endpoint.
php -r '
$p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet","root","test-only-password",[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$p->exec("ALTER TABLE zm_users MODIFY COLUMN role ENUM(\x27student\x27,\x27teacher\x27,\x27admin\x27) NOT NULL DEFAULT \x27student\x27");
$p->exec("UPDATE zm_users SET role=\x27admin\x27 WHERE email=\x27pilot@example.org\x27");
'
# Admin APIs reject unauthenticated users.
anonymous="$(curl -sS -o /tmp/zm-response.json -w '%{http_code}' 'http://127.0.0.1:8000/api/index.php?route=admin/users')"
test "$anonymous" = 401
# Admin logs in with the final password from earlier tests.
adminLogin="$(curl -sS -c /tmp/zm-admin-cookies -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=auth/login' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data '{"email":"pilot@example.org","password":"HarmadikTesztJelszo2026!"}')"
test "$adminLogin" = 200
adminList="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-response.json -w '%{http_code}' 'http://127.0.0.1:8000/api/index.php?route=admin/users')"
test "$adminList" = 200

# A-24: authenticate as an actual administrator, then prove that the live
# read-only CloudPanel diagnostic catches a confidential file buried beneath
# an innocuous public asset directory (the old shallow glob missed it).
AUDIT_DIR="php/assets/zeneelmelet-ci-audit/nested"
mkdir -p "$AUDIT_DIR"
printf 'disposable test-only SQL dump' > "$AUDIT_DIR/backup.SQL.GZ"
diagnosticStatus="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-deployment-diagnostic.json -w '%{http_code}' \
 'http://127.0.0.1:8000/api/index.php?route=auth/deployment-check')"
test "$diagnosticStatus" = 200
php -r '
$j=json_decode(file_get_contents("/tmp/zm-deployment-diagnostic.json"), true);
if (($j["scanComplete"]??null)!==true || ($j["ready"]??null)!==false ||
    ($j["scannedItems"]??0)<1 ||
    !in_array("assets/zeneelmelet-ci-audit/nested/backup.SQL.GZ", $j["publicArchives"]??[], true)) {
    fwrite(STDERR,"Admin diagnostic did not flag nested public archive\n");exit(1);
}
'
rm -rf "php/assets/zeneelmelet-ci-audit"
diagnosticStatus="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-deployment-diagnostic.json -w '%{http_code}' \
 'http://127.0.0.1:8000/api/index.php?route=auth/deployment-check')"
test "$diagnosticStatus" = 200
php -r '
$j=json_decode(file_get_contents("/tmp/zm-deployment-diagnostic.json"), true);
if (($j["scanComplete"]??null)!==true ||
    in_array("assets/zeneelmelet-ci-audit/nested/backup.SQL.GZ", $j["publicArchives"]??[], true)) {
    fwrite(STDERR,"Deleted audit fixture remains in deployment report\n");exit(1);
}
'
echo 'Live authenticated deployment diagnostic flags nested public archives'

# A-24: the real authenticated endpoint also verifies a three-layer release
# fingerprint. An incomplete upload of old frontend/new PHP must be rejected.
REVISION="$(printf 'a%.0s' {1..40})"
MIXED_REVISION="$(printf 'b%.0s' {1..40})"
cat > php/index.html <<HTML
<html><head><meta name="zeneelmelet-build-sha" content="$REVISION"></head><body>Test</body></html>
HTML
printf '{"schema":1,"sha":"%s"}\n' "$REVISION" > php/release-build.json
printf "<?php\n// Public, non-secret checked-out release revision.\nreturn '%s';\n" "$REVISION" > php/api/release-build.php
fingerprintStatus="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-deployment-diagnostic.json -w '%{http_code}' \
 'http://127.0.0.1:8000/api/index.php?route=auth/deployment-check')"
test "$fingerprintStatus" = 200
php -r '
$j=json_decode(file_get_contents("/tmp/zm-deployment-diagnostic.json"),true);
if (($j["buildConsistent"]??null)!==true ||
    ($j["releaseRevision"]??null)!==str_repeat("a",40)) {
    fwrite(STDERR,"Matching build stamps rejected by admin endpoint\n");exit(1);
}
'
printf '{"schema":1,"sha":"%s"}\n' "$MIXED_REVISION" > php/release-build.json
mixedStatus="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-deployment-diagnostic.json -w '%{http_code}' \
 'http://127.0.0.1:8000/api/index.php?route=auth/deployment-check')"
test "$mixedStatus" = 200
php -r '
$j=json_decode(file_get_contents("/tmp/zm-deployment-diagnostic.json"),true);
if (($j["buildConsistent"]??null)!==false || ($j["ready"]??null)!==false ||
    !in_array("Verzióütközés: index.html / release-build.json / api/release-build.php", $j["missing"]??[],true)) {
    fwrite(STDERR,"Mixed build stamps did not block admin deployment readiness\n");exit(1);
}
'
rm -f php/index.html php/release-build.json php/api/release-build.php
echo 'Live admin diagnostic blocks mixed frontend/PHP source revisions'


# Invite is sent by mail; server stores only the hash.
inviteStatus="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=admin/invite' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data '{"email":"second@example.org"}')"
test "$inviteStatus" = 201
invitesStatus="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-response.json -w '%{http_code}' 'http://127.0.0.1:8000/api/index.php?route=admin/invitations')"
test "$invitesStatus" = 200
php -r '$j=json_decode(file_get_contents("/tmp/zm-response.json"),true);if(count($j["invitations"]??[])<2)exit(1);'
# Self-demotion and elevation through admin API are forbidden.
adminId="$(php -r '$p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet","root","test-only-password");echo $p->query("SELECT id FROM zm_users WHERE email=\x27pilot@example.org\x27")->fetchColumn();')"
selfRole="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-response.json -w '%{http_code}' -X POST 'http://127.0.0.1:8000/api/index.php?route=admin/set-role' -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' --data "{\"userId\":\"$adminId\",\"role\":\"student\"}")"
test "$selfRole" = 403
echo 'PHP admin: guarded endpoints, invitation, listing and privilege restrictions passed'
echo 'PHP account pilot: invitation, email verification, one-use reset and password change passed'

# Exercise optimistic revision checks against the same disposable MySQL database.
bash scripts/test-php-progress-revisions.sh

# Independent login cookies emulate two concurrent devices on real PHP/MySQL.
bash scripts/test-php-two-device-sync.sh

# The account must not retain administrator permissions after a role downgrade.
bash scripts/test-php-roles.sh

# A real SQL row lock overlaps a PHP HTTP login: the retired password may
# never create a session after the password has been replaced.
bash scripts/test-php-login-revocation-race.sh
