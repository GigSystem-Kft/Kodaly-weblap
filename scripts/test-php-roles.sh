#!/usr/bin/env bash
# Disposable test server only. Validate role changes against an existing session.
set -euo pipefail
role_sql() {
  local role="$1"
  ROLE_TO_SET="$role" php -r '
    $p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet;charset=utf8mb4","root","test-only-password",
      [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
    $stmt=$p->prepare("UPDATE zm_users SET role=? WHERE email=?");
    $stmt->execute([getenv("ROLE_TO_SET"),"pilot@example.org"]);
  '
}
base='http://127.0.0.1:8000/api/index.php?route='
for role in teacher student; do
  role_sql "$role"
  me="$(curl -sS -b /tmp/zm-admin-cookies "${base}auth/me")"
  printf '%s' "$me" | ROLE_EXPECTED="$role" php -r '
    $j=json_decode(stream_get_contents(STDIN),true);
    if(($j["user"]["role"]??null)!==getenv("ROLE_EXPECTED"))exit(1);
  '
  status="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-role-response.json -w '%{http_code}' "${base}admin/users")"
  test "$status" = 403
  test "$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-role-response.json -w '%{http_code}' "${base}auth/deployment-check")" = 403
done
role_sql admin
status="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-role-response.json -w '%{http_code}' "${base}admin/users")"
test "$status" = 200
# Deployment diagnosis is read-only and excludes private filesystem paths.
check_status="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-deployment-check.json -w '%{http_code}' "${base}auth/deployment-check")"
test "$check_status" = 200
php -r '
$j=json_decode(file_get_contents("/tmp/zm-deployment-check.json"),true);
if(!is_bool($j["ready"]??null) || !is_array($j["missing"]??null) ||
 !is_array($j["publicArchives"]??null) || !isset($j["checkedAt"]))exit(1);
if(str_contains(json_encode($j),"/home/") || str_contains(json_encode($j),"password"))exit(1);
'
printf 'non-sensitive diagnostic fixture' > php/api/zm-deployment-check-test.zip
curl -fsS -b /tmp/zm-admin-cookies "${base}auth/deployment-check" > /tmp/zm-deployment-with-archive.json
rm -f php/api/zm-deployment-check-test.zip
php -r '
$j=json_decode(file_get_contents("/tmp/zm-deployment-with-archive.json"),true);
if(($j["ready"]??null)!==false || !in_array("api/zm-deployment-check-test.zip",$j["publicArchives"]??[],true))exit(1);
'
# A second independently logged-in real user validates privilege changes and
# account data isolation with the disposable MySQL/PHP server.
php -r '
$p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet;charset=utf8mb4","root","test-only-password",
 [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$hex=bin2hex(random_bytes(16));
$id=substr($hex,0,8)."-".substr($hex,8,4)."-".substr($hex,12,4)."-".substr($hex,16,4)."-".substr($hex,20,12);
$s=$p->prepare("INSERT INTO zm_users (id,email,display_name,password_hash,role,email_verified_at) VALUES(?,?,?,?,?,UTC_TIMESTAMP())");
$s->execute([$id,"role-student@example.org","Szerepkör-próbafiók",password_hash("RoleTestPassword2026!",PASSWORD_ARGON2ID),"student"]);
'
second_id="$(php -r '$p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet","root","test-only-password"); echo $p->query("SELECT id FROM zm_users WHERE email=\x27role-student@example.org\x27")->fetchColumn();')"
test "${#second_id}" = 36
student_jar=/tmp/zm-role-student-cookies
login_status="$(curl -sS -c "$student_jar" -o /tmp/zm-role-student-login.json -w '%{http_code}' \
 -X POST "${base}auth/login" -H 'Origin: http://localhost:8000' \
 -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' \
 --data '{"email":"role-student@example.org","password":"RoleTestPassword2026!"}')"
test "$login_status" = 200

# A logged-in student cannot see any of the four real administrator endpoints.
for endpoint in admin/users admin/invitations admin/sources admin/source-coverage; do
 status="$(curl -sS -b "$student_jar" -o /tmp/zm-role-response.json -w '%{http_code}' "${base}$endpoint")"
 test "$status" = 403
done
# Nor can this student elevate their own role, even with a forged HTTP request.
student_escalation="$(curl -sS -b "$student_jar" -o /tmp/zm-role-response.json -w '%{http_code}' \
 -X POST "${base}admin/set-role" -H 'Origin: http://localhost:8000' \
 -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' \
 --data "{\"userId\":\"$second_id\",\"role\":\"teacher\"}")"
test "$student_escalation" = 403

# Record the administrator's progress revision; a second user's changes must
# not affect it, even though both accounts share a single tenant/database.
curl -fsS -b /tmp/zm-admin-cookies "${base}progress" > /tmp/zm-role-admin-before.json
curl -fsS -b "$student_jar" "${base}progress" > /tmp/zm-role-student-before.json
php -r '$j=json_decode(file_get_contents("/tmp/zm-role-student-before.json"),true); if(!is_array($j) || !array_key_exists("progress",$j) || $j["progress"]!==null) exit(1);'
student_revision="$(php -r '$j=json_decode(file_get_contents("/tmp/zm-role-student-before.json"),true);echo $j["revision"];')"
test "${#student_revision}" = 64
student_progress='{"completedChapters":["szolfézs"],"completedSubchapters":[],"quizScores":{"ritmus":77},"flashcardsMastered":[],"matchingCompleted":[],"xp":10,"streak":0,"lastActiveDate":"","activityDays":[]}'
student_save="$(curl -sS -b "$student_jar" -o /tmp/zm-role-student-save.json -w '%{http_code}' \
 -X PUT "${base}progress" -H 'Origin: http://localhost:8000' \
 -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' \
 --data "{\"progress\":$student_progress,\"revision\":\"$student_revision\"}")"
test "$student_save" = 200
curl -fsS -b /tmp/zm-admin-cookies "${base}progress" > /tmp/zm-role-admin-after.json
curl -fsS -b "$student_jar" "${base}progress" > /tmp/zm-role-student-after.json
php -r '
$a=json_decode(file_get_contents("/tmp/zm-role-admin-before.json"),true);
$b=json_decode(file_get_contents("/tmp/zm-role-admin-after.json"),true);
$c=json_decode(file_get_contents("/tmp/zm-role-student-after.json"),true);
if(($a["revision"]??null)!==($b["revision"]??null)) exit(1);
if(($c["progress"]["completedChapters"][0]??null)!=="szolfézs") exit(1);
if(($c["progress"]["xp"]??null)!==10) exit(1);
'

# Only an administrator may promote a student to teacher or reverse it.
# Even the administrator cannot grant another administrator via the UI.
set_role() {
 local jar="$1" role="$2"
 curl -sS -b "$jar" -o /tmp/zm-role-response.json -w '%{http_code}' \
  -X POST "${base}admin/set-role" -H 'Origin: http://localhost:8000' \
  -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' \
  --data "{\"userId\":\"$second_id\",\"role\":\"$role\"}"
}
test "$(set_role /tmp/zm-admin-cookies admin)" = 400
test "$(set_role /tmp/zm-admin-cookies teacher)" = 200
curl -fsS -b "$student_jar" "${base}auth/me" > /tmp/zm-role-student-me.json
php -r '$j=json_decode(file_get_contents("/tmp/zm-role-student-me.json"),true); if(($j["user"]["role"]??null)!=="teacher")exit(1);'
test "$(curl -sS -b "$student_jar" -o /tmp/zm-role-response.json -w '%{http_code}' "${base}admin/users")" = 403
test "$(set_role /tmp/zm-admin-cookies student)" = 200
curl -fsS -b "$student_jar" "${base}auth/me" > /tmp/zm-role-student-me.json
php -r '$j=json_decode(file_get_contents("/tmp/zm-role-student-me.json"),true); if(($j["user"]["role"]??null)!=="student")exit(1);'
# Logging out affects only this session, not the administrator's session.
logout_status="$(curl -sS -b "$student_jar" -o /tmp/zm-role-response.json -w '%{http_code}' \
 -X POST "${base}auth/logout" -H 'Origin: http://localhost:8000' \
 -H 'X-Requested-With: XMLHttpRequest')"
test "$logout_status" = 200
test "$(curl -sS -b "$student_jar" -o /tmp/zm-role-response.json -w '%{http_code}' "${base}progress")" = 401
test "$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-role-response.json -w '%{http_code}' "${base}admin/users")" = 200

# The administrator must remain protected from self-service erasure.
admin_delete="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-role-response.json -w '%{http_code}' \
 -X POST "${base}auth/delete-account" -H 'Origin: http://localhost:8000' \
 -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' \
 --data '{"currentPassword":"HarmadikTesztJelszo2026!","confirmation":"FIÓKOM TÖRLÉSE"}')"
test "$admin_delete" = 403
# Sign in the second user again after the explicit logout test.
second_login="$(curl -sS -c "$student_jar" -o /tmp/zm-role-response.json -w '%{http_code}' \
 -X POST "${base}auth/login" -H 'Origin: http://localhost:8000' \
 -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' \
 --data '{"email":"role-student@example.org","password":"RoleTestPassword2026!"}')"
test "$second_login" = 200
# Private data portability: only the authenticated learner's own profile and
# progress may appear in the export. No hashes or session secrets.
test "$(curl -sS -o /tmp/zm-role-export-anonymous.json -w '%{http_code}' "${base}auth/export-data")" = 401
test "$(curl -sS -b "$student_jar" -o /tmp/zm-role-export.json -w '%{http_code}' "${base}auth/export-data")" = 200
php -r '
$j=json_decode(file_get_contents("/tmp/zm-role-export.json"),true);
if(($j["format"]??null)!=="zeneelmeleti-muhely-personal-data-v1")exit(1);
if(($j["profile"]["email"]??null)!=="role-student@example.org")exit(1);
if(($j["profile"]["id"]??null)!==$argv[1])exit(1);
if(($j["progress"]["completedChapters"][0]??null)!=="szolfézs")exit(1);
if(($j["progress"]["xp"]??null)!==10)exit(1);
if(str_contains(json_encode($j),"pilot@example.org"))exit(1);
foreach(["password_hash","token_hash","currentPassword","session"] as $secret)
 if(array_key_exists($secret,$j["profile"]))exit(1);
' "$second_id"
# Wrong confirmation and wrong password must not delete any database rows.
for request in \
 '{"currentPassword":"RoleTestPassword2026!","confirmation":"nem"}' \
 '{"currentPassword":"NotTheCorrectPassword","confirmation":"FIÓKOM TÖRLÉSE"}'; do
  result="$(curl -sS -b "$student_jar" -o /tmp/zm-role-response.json -w '%{http_code}' \
   -X POST "${base}auth/delete-account" -H 'Origin: http://localhost:8000' \
   -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' \
   --data "$request")"
  if [[ "$request" == *'"confirmation":"nem"'* ]]; then test "$result" = 400
  else test "$result" = 403; fi
done
# Create an invitation tied to this user; both the invited email and its
# persistent progress/session must disappear when the user confirms deletion.
php -r '
$p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet;charset=utf8mb4","root","test-only-password",[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$stmt=$p->prepare("INSERT INTO zm_invitations(token_hash,email,expires_at,used_at,used_by) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 7 DAY),UTC_TIMESTAMP(),?)");
$stmt->execute([hash("sha256","delete-account-private-invitation"),"role-student@example.org",$argv[1]]);
' "$second_id"
before_deletion="$(php -r '$p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet","root","test-only-password");$s=$p->prepare("SELECT COUNT(*) FROM zm_users WHERE id=?");$s->execute([$argv[1]]);echo $s->fetchColumn();' "$second_id")"
test "$before_deletion" = 1
delete_status="$(curl -sS -b "$student_jar" -o /tmp/zm-role-response.json -w '%{http_code}' \
 -X POST "${base}auth/delete-account" -H 'Origin: http://localhost:8000' \
 -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/json' \
 --data '{"currentPassword":"RoleTestPassword2026!","confirmation":"FIÓKOM TÖRLÉSE"}')"
test "$delete_status" = 200
# Two independent signed-in sessions: deleted learner sees 401 while the
# original admin remains authorized. FK cascades remove all user data/tokens.
test "$(curl -sS -b "$student_jar" -o /tmp/zm-role-response.json -w '%{http_code}' "${base}progress")" = 401
test "$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-role-response.json -w '%{http_code}' "${base}admin/users")" = 200
php -r '
$p=new PDO("mysql:host=127.0.0.1;dbname=zeneelmelet;charset=utf8mb4","root","test-only-password",[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
$id=$argv[1];
foreach (["zm_users"=>"id","zm_sessions"=>"user_id","zm_progress"=>"user_id","zm_account_tokens"=>"user_id"] as $table=>$column) {
 $s=$p->prepare("SELECT COUNT(*) FROM $table WHERE $column=?");$s->execute([$id]);if((int)$s->fetchColumn()!==0) exit(1);
}
$s=$p->prepare("SELECT COUNT(*) FROM zm_invitations WHERE email=? OR used_by=?");
$s->execute(["role-student@example.org",$id]);if((int)$s->fetchColumn()!==0)exit(1);
if((int)$p->query("SELECT COUNT(*) FROM zm_users WHERE role=\x27admin\x27")->fetchColumn()!==1)exit(1);
' "$second_id"
echo 'PHP self-service erasure tests passed: password confirmation, FK cascades, admin protection'

echo 'PHP two-user role transitions and isolated learning progress passed'

echo 'PHP role tests passed: student and teacher blocked from admin, admin restored'
