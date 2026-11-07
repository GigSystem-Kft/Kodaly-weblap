<?php
declare(strict_types=1);
/** Search and source loading kept separate for deterministic regression testing. */
function searchTerms(string $value): array {
    $chars = ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ö'=>'o','ő'=>'o',
        'ú'=>'u','ü'=>'u','ű'=>'u','Á'=>'a','É'=>'e','Í'=>'i','Ó'=>'o',
        'Ö'=>'o','Ő'=>'o','Ú'=>'u','Ü'=>'u','Ű'=>'u'];
    $text = strtolower(strtr($value, $chars));
    // Keep concepts, not the grammar surrounding a question.
    $stop = ['hogy','milyen','ennek','annak','vagy','amit','ezek','azok','egy',
        'van','nem','kerlek','roviden','tomoren','lenyegretoro','mondanal',
        'mondj','valamit','szeretnek','tudnal','par','mondatban','mit',
        'jelent','jelentese','azt','az','hogy','es','ha','mi','ki','miert',
        'hogyan','mikor','van-e','tudsz','mondani','meselj','szolj','arra',
        'nevezunk','nevezik','fogalma','definicio','fogalmat','nekem',
        'legyszi','magyarazd','magyarazat','kicsit','lehet','keresek'];
    $words = preg_split('/[^a-z0-9]+/', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];
    $terms=[];
    foreach($words as $word) {
        if (strlen($word)<=2 || in_array($word,$stop,true)) continue;
        // Equivalent historical and Hungarian spellings.
        if (in_array($word,['hexachord','hexachordum','hexachordok','hexachordot',
            'hexakord','hexakordok','hexakordot'],true)) $word='hexachord';
        if (in_array($word,['guidoni','guidofele'],true)) $word='guido';
        $terms[$word]=true;
    }
    return array_keys($terms);
}
function knowledgeEntries(): array {
    $file=__DIR__ . '/knowledge.php';
    $list=is_file($file) ? require $file : [];
    $entries = is_array($list) ? $list : [];
    $entries = array_values(array_filter($entries, static fn($e) => !str_contains(strtolower((string)($e['source'] ?? '')), 'kesztler')));
    // Licensed full-text pedagogical book is a separate, server-side PHP data file.
    // The release builder deliberately does not bundle copyrighted full source text;
    // the site owner installs it only when their publication/AI indexing permission applies.
    $pedagogyFile = __DIR__ . '/knowledge-pedagogy.php';
    if (is_file($pedagogyFile)) {
        $pedagogyEntries = require $pedagogyFile;
        if (is_array($pedagogyEntries)) {
            foreach ($pedagogyEntries as $item) {
                if (is_array($item) && isset($item['source'], $item['label'], $item['text'])) {
                    $entries[] = $item;
                }
            }
        }
    }
    require_once __DIR__ . '/tutor-sources.php';
    return array_merge($entries, tutorExtraKnowledge());
}
function searchLessons(string $question, int $limit=4): array {
    return rankLessons($question, knowledgeEntries(), $limit);
}
function rankLessons(string $question, array $entries, int $limit=4): array {
    $tokens=searchTerms($question);
    if (!$tokens) return [];
    $hits=[];
    foreach ($entries as $entry) {
        if (!is_array($entry) || !isset($entry['text'],$entry['source'],$entry['label'])) continue;
        $labelWords=searchTerms((string)$entry['label']);
        $bodyWords=searchTerms((string)$entry['text']);
        $labelSet=array_fill_keys($labelWords,true);
        $bodySet=array_fill_keys($bodyWords,true);
        $matched=0; $labelMatched=0;
        foreach($tokens as $token) {
            $isMatch=false;
            foreach ($labelWords as $word) {
                if ($token===$word || (strlen($token)>=5 && str_starts_with($word,$token))) {
                    $labelMatched++; $isMatch=true; break;
                }
            }
            if (!$isMatch) foreach($bodyWords as $word) {
                if ($token===$word || (strlen($token)>=5 && str_starts_with($word,$token))) {
                    $isMatch=true; break;
                }
            }
            if ($isMatch) $matched++;
        }
        if ($matched===0) continue;
        // One concrete concept is enough. Multi-concept questions need broad coverage.
        if (count($tokens)>1 && $matched/count($tokens)<0.6) continue;
        $score=$matched*3 + $labelMatched*7;
        if (($entry['source']??'')==='Zeneelméleti Műhely – Tananyag') $score+=2;
        // Penalize long source passages that only incidentally mention a term.
        if ($labelMatched===0 && strlen((string)$entry['text'])>1600) $score-=2;
        $hits[]=['score'=>$score,'entry'=>$entry];
    }
    usort($hits,static fn($a,$b)=>$b['score'] <=> $a['score']);
    return array_slice(array_map(static fn($v)=>$v['entry'],$hits),0,$limit);
}
function lessonReply(array $hits, string $question, bool $short=false): string {
    $tokens=searchTerms($question);
    $pieces=[];
    foreach ($hits as $hit) {
        $raw=(string)$hit['text'];
        $sentences=preg_split('/(?<=[.!?])\\s+/u', preg_replace('/\\s+/u',' ',$raw) ?? $raw) ?: [$raw];
        // Extract only the relevant explanation, not the beginning of unrelated pages.
        $ranked=[];
        foreach ($sentences as $index=>$sentence) {
            $terms=searchTerms($sentence);
            $matches=0;
            foreach ($tokens as $token) {
                foreach ($terms as $term) {
                    if (str_starts_with($term,$token) || str_starts_with($token,$term)) {
                        $matches++; break;
                    }
                }
            }
            if ($matches>0) $ranked[]=['matches'=>$matches,'index'=>$index,'sentence'=>$sentence];
        }
        usort($ranked,static fn($a,$b)=>$b['matches']<=>$a['matches']);
        if (!$ranked) continue;
        $answer=trim($ranked[0]['sentence']);
        if (mbSafeLength($answer)>($short ? 200 : 320)) {
            $answer=trim(mbSafeCut($answer,$short ? 200 : 320)) . '…';
        }
        $pieces[]=$answer . "\n" . '_Forrás: ' . $hit['source'] . ' – ' . $hit['label'] . '_';
        if ($short) break;
    }
    return $pieces ? implode("\n\n",$pieces) :
        'Nem találtam eléggé releváns, rövid választ a helyi forrásokban.';
}
function mbSafeLength(string $text): int { return strlen($text); }
function mbSafeCut(string $text,int $max): string {
    $s=substr($text,0,$max);
    return preg_replace('/[^\\x00-\\x7F][\\x80-\\xBF]*$/','',$s) ?? $s;
}

