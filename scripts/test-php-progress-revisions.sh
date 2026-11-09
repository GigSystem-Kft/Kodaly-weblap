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
# A-16: blank IDs should not pollute saved achievements or question history.
invalidBlankChapter="$(php -r '
$p=json_decode($argv[1],true);$p["completedChapters"][]="  ";
echo json_encode($p,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
' "$updated")"
invalidBlankFavorite="$(php -r '
$p=json_decode($argv[1],true);$p["favoriteExpressions"]=[" "];
echo json_encode($p,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
' "$updated")"
invalidBlankWrongQuestion="$(php -r '
$p=json_decode($argv[1],true);$p["quizAttempts"][0]["wrongQuestionIds"]=[""];
echo json_encode($p,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
' "$updated")"
for malformedProgress in "$invalidDay" "$invalidActivity" "$invalidScore" "$invalidQuizString" "$invalidXp" "$invalidBlankChapter" "$invalidBlankFavorite" "$invalidBlankWrongQuestion"; do
  status="$(put_progress "{\"progress\":$malformedProgress,\"revision\":\"$saved\"}")"
  test "$status" = 400
done
get_progress
test "$(revision)" = "$saved"
# A-17: a 15-question practice round may have 15 errors. A 16th
# diagnostic ID must be rejected, but a valid full round must be retained.
allWrong="$(php -r '
 $j=json_decode($argv[1],true);
 $j["quizAttempts"][0]["correct"]=0;
 $j["quizAttempts"][0]["total"]=15;
 $j["quizAttempts"][0]["score"]=0;
 $j["quizAttempts"][0]["wrongQuestionIds"]=[];
 for($i=1;$i<=15;$i++)$j["quizAttempts"][0]["wrongQuestionIds"][]="question-".$i;
 echo json_encode($j,JSON_UNESCAPED_UNICODE);
' "$updated")"
oversizedWrong="$(php -r '
 $j=json_decode($argv[1],true);
 $j["quizAttempts"][0]["wrongQuestionIds"][]="question-16";
 echo json_encode($j,JSON_UNESCAPED_UNICODE);
' "$allWrong")"
test "$(put_progress "{\"progress\":$oversizedWrong,\"revision\":\"$saved\"}")" = 400
test "$(put_progress "{\"progress\":$allWrong,\"revision\":\"$saved\"}")" = 200
saved="$(revision)"
get_progress
php -r '
 $j=json_decode(file_get_contents("/tmp/zm-progress-response.json"),true);
 $a=$j["progress"]["quizAttempts"][0]??null;
 if(!$a||$a["correct"]!==0||$a["total"]!==15||count($a["wrongQuestionIds"]??[])!==15)exit(1);
'
test "$(revision)" = "$saved"
status="$(put_progress "{\"progress\":$updated,\"revision\":\"$saved\"}")"
test "$status" = 200
status="$(put_progress "{\"progress\":$payload,\"revision\":\"$saved\"}")"
test "$status" = 409
php -r '$j=json_decode(file_get_contents("/tmp/zm-progress-response.json"),true);if(($j["progress"]["quizScores"]["ritmus"]??null)!==90)exit(1);'
get_progress
php -r '$j=json_decode(file_get_contents("/tmp/zm-progress-response.json"),true);if(($j["progress"]["xp"]??null)!==50 || count($j["progress"]["quizAttempts"]??[])!==1 || ($j["progress"]["earTrainingDailyXp"]["2026-11-07"]??null)!==75 || ($j["progress"]["favoriteExpressions"][0]??null)!=="favorite-a")exit(1);'
# Large genuine progress must fit, unlike the former generic 64 KiB cap.
# Other JSON endpoints still reject bodies over 64 KiB.
get_progress
largeBase="$(revision)"
php -r '
 $p=json_decode($argv[1],true);
 $p["completedSubchapters"]=[];
 for($i=0;$i<850;$i++)$p["completedSubchapters"][]=sprintf("subchapter-%04d-", $i).str_repeat("s",95);
 $json=json_encode(["progress"=>$p,"revision"=>$argv[2]],JSON_UNESCAPED_UNICODE);
 if(strlen($json)<=65536 || strlen($json)>=1000000)exit(1);
 file_put_contents("/tmp/zm-valid-large-progress.json",$json);
' "$updated" "$largeBase"
largeStatus="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-progress-response.json -w '%{http_code}' \
 -X PUT "$url" -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' \
 -H 'Content-Type: application/json' --data-binary @/tmp/zm-valid-large-progress.json)"
test "$largeStatus" = 200
get_progress
php -r '
 $j=json_decode(file_get_contents("/tmp/zm-progress-response.json"),true);
 if(count($j["progress"]["completedSubchapters"]??[])!==850)exit(1);
'
largeRevision="$(revision)"
php -r '
 $p=json_decode($argv[1],true);
 $p["completedSubchapters"]=array_fill(0,10000,str_repeat("z",115));
 $json=json_encode(["progress"=>$p,"revision"=>$argv[2]],JSON_UNESCAPED_UNICODE);
 if(strlen($json)<=1000256)exit(1);
 file_put_contents("/tmp/zm-rejected-huge-progress.json",$json);
' "$updated" "$largeRevision"
hugeStatus="$(curl -sS -b /tmp/zm-admin-cookies -o /tmp/zm-progress-response.json -w '%{http_code}' \
 -X PUT "$url" -H 'Origin: http://localhost:8000' -H 'X-Requested-With: XMLHttpRequest' \
 -H 'Content-Type: application/json' --data-binary @/tmp/zm-rejected-huge-progress.json)"
test "$hugeStatus" = 413
get_progress
test "$(revision)" = "$largeRevision"
rm -f /tmp/zm-valid-large-progress.json /tmp/zm-rejected-huge-progress.json
echo 'PHP progress revision, large learner history and upload size protection passed'
