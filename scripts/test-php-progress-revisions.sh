#!/usr/bin/env bash
# Invoked by test-php-invitations.sh with test PHP server and admin cookies running.
set -euo pipefail
url='http://127.0.0.1:8000/api/index.php?route=progress'
get_progress() { curl -fsS -b /tmp/zm-admin-cookies "$url" > /tmp/zm-progress-response.json; }
revision() { php -r '$j=json_decode(file_get_contents("/tmp/zm-progress-response.json"),true);echo $j["revision"]??"";'; }
put_progress() {
  curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-progress-response.json -w '%{http_code}' -X PUT "$url" \
    -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' \
    -H 'Content-Type: application/json' --data "$1"
}
get_progress
old="$(revision)"
test "${#old}" = 64
payload='{"completedChapters":["ritmus"],"completedSubchapters":[],"quizScores":{"ritmus":80},"flashcardsMastered":[],"matchingCompleted":[],"xp":30,"streak":0,"lastActiveDate":"","activityDays":[]}'
status="$(put_progress "{\"progress\":$payload}")"
test "$status" = 428
status="$(put_progress "{\"progress\":$payload,\"revision\":\"$old\"}")"
test "$status" = 200
saved="$(revision)"
get_progress
test "$(revision)" = "$saved"
updated='{"completedChapters":["ritmus","hangok-kulcsok"],"completedSubchapters":["hangok-1"],"quizScores":{"ritmus":90},"favoriteExpressions":["favorite-a"],"earTrainingDailyXp":{"2026-11-07":75},"quizAttempts":[{"id":"attempt-1","chapterId":"ritmus","score":90,"correct":9,"total":10,"at":"2026-11-07T12:00:00Z"}],"flashcardsMastered":[],"matchingCompleted":[],"xp":50,"streak":0,"lastActiveDate":"","activityDays":[]}'
# Reject forged practice rewards before applying any database update.
invalidLedger="${updated/\"2026-11-07\":75/\"2026-11-07\":101}"
invalidStatus="$(put_progress "{\"progress\":$invalidLedger,\"revision\":\"$saved\"}")"
test "$invalidStatus" = 400
# A-11/A-17: a server must reject impossible calendar dates, textual XP and
# contradictory quiz metrics before it mutates the saved learning diary.
invalidDay="${updated/\"2026-11-07\":75/\"2026-02-30\":75}"
invalidActivity="${updated/\"activityDays\":\[\]/\"activityDays\":[\"2026-02-30\"]}"
invalidScore="${updated/\"score\":90,\"correct\":9/\"score\":100,\"correct\":9}"
invalidQuizString="${updated/\"ritmus\":90/\"ritmus\":\"90\"}"
invalidXp="${updated/\"xp\":50/\"xp\":\"50\"}"
for malformedProgress in "$invalidDay" "$invalidActivity" "$invalidScore" "$invalidQuizString" "$invalidXp"; do
  status="$(put_progress "{\"progress\":$malformedProgress,\"revision\":\"$saved\"}")"
  test "$status" = 400
done
get_progress
test "$(revision)" = "$saved"
status="$(put_progress "{\"progress\":$updated,\"revision\":\"$saved\"}")"
test "$status" = 200
status="$(put_progress "{\"progress\":$payload,\"revision\":\"$saved\"}")"
test "$status" = 409
php -r '$j=json_decode(file_get_contents("/tmp/zm-progress-response.json"),true);if(($j["progress"]["quizScores"]["ritmus"]??null)!==90)exit(1);'
get_progress
php -r '$j=json_decode(file_get_contents("/tmp/zm-progress-response.json"),true);if(($j["progress"]["xp"]??null)!==50 || count($j["progress"]["quizAttempts"]??[])!==1 || ($j["progress"]["earTrainingDailyXp"]["2026-11-07"]??null)!==75 || ($j["progress"]["favoriteExpressions"][0]??null)!=="favorite-a")exit(1);'
echo 'PHP progress revision and stale-write protection passed'
