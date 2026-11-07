<?php
declare(strict_types=1);

/**
 * Exact, source-grounded teaching suggestions from curated Creative practices.
 * The assistant must never improvise a book citation or pretend to quote a book.
 */
function creativeNormalize(string $value): string {
    return strtolower(strtr($value, [
        'á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ö'=>'o','ő'=>'o','ú'=>'u','ü'=>'u','ű'=>'u',
        'Á'=>'a','É'=>'e','Í'=>'i','Ó'=>'o','Ö'=>'o','Ő'=>'o','Ú'=>'u','Ü'=>'u','Ű'=>'u'
    ]));
}

function creativeMethodQuestion(string $question): bool {
    $q = creativeNormalize($question);
    $pedagogy = preg_match('/ajanl|otlet|jatekos|jatek|gyakorlat|modsz|fejleszt|tanits|foglalkoz|nevel|mozgasos|testritmus/', $q)===1;
    $music = preg_match('/ritmus|mero|metrum|utem|szinkop|szunet|dallam|enek|zene|hangkoz|forma|szolam|hallgat|gyermek|kisiskol/', $q)===1;
    return $pedagogy && $music;
}

function creativeTopicScore(string $question, array $practice): int {
    $q=creativeNormalize($question);
    $stemGroups=[
        'ritmus'=>['ritmus','testritmus','szinkop','szunet','mero','metrum','utem'],
        'mero'=>['mero','luktet','egyenletes'],
        'metrum'=>['metrum','utem','hangsuly'],
        'forma'=>['forma','motivum','ismetles'],
        'szinkop'=>['szinkop'],
        'szunet'=>['szunet'],
        'test'=>['testritmus','test'],
        'dallam'=>['dallam','hangmagassag','relacio'],
        'szolam'=>['szolam','tobbszolam'],
        'hallgat'=>['hallgat','zenehallgatas']
    ];
    $topic = creativeNormalize(implode(' ',[
        $practice['title'] ?? '',$practice['theme'] ?? '',$practice['goal'] ?? ''
    ]));
    $score=0;
    foreach ($stemGroups as $stem=>$related) {
        if (!str_contains($q,$stem)) continue;
        foreach ($related as $index=>$word) {
            if (str_contains($topic,$word)) {
                $score += $index===0 ? 8 : 3;
                break;
            }
        }
    }
    if (str_contains($q,'ritmus') && preg_match('/mero|luktet|ritmus/', $topic)) $score += 3;
    if (str_contains($q,'jatekos') && preg_match('/enek|mozgas|jatek/', $topic)) $score += 1;
    return $score;
}

function creativePracticeAnswer(string $question, array $knowledge): ?string {
    if (!creativeMethodQuestion($question)) return null;
    $options=[];
    foreach ($knowledge as $entry) {
        if (!is_array($entry) || !is_array($entry['creativePractice'] ?? null)) continue;
        $practice=$entry['creativePractice'];
        if (!isset($practice['title'],$practice['goal'],$practice['steps'],$practice['page'])) continue;
        if (!is_array($practice['steps']) || !$practice['steps']) continue;
        $score=creativeTopicScore($question,$practice);
        if ($score>0) $options[]=['score'=>$score,'entry'=>$entry,'practice'=>$practice];
    }
    usort($options,static fn($a,$b)=>$b['score']<=>$a['score']);
    if (!$options) return null;
    $chosen=$options[0];
    $p=$chosen['practice'];
    $steps=array_slice($p['steps'],0,4);
    $reply='**' . $p['title'] . "**\n\n" .
        '**Cél:** ' . $p['goal'] . "\n\n";
    foreach ($steps as $i=>$step) {
        if (is_string($step) && trim($step)!=='') $reply.=($i+1).'. '.$step."\n";
    }
    if (is_string($p['observation'] ?? null) && $p['observation']!=='') {
        $reply.="\n**Megfigyelési szempont:** ".$p['observation']."\n";
    }
    $reply.="\n**Forrás:** Szirányi Borbála (2021): *Kreatív énekes-játékok ritmikus mozgással*, ".
        $p['page']." oldal (módszertani feldolgozás).";
    return $reply;
}
