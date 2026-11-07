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
done
role_sql admin
status="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-role-response.json -w '%{http_code}' "${base}admin/users")"
test "$status" = 200
echo 'PHP role tests passed: student and teacher blocked from admin, admin restored'
