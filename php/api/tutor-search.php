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
        'tanulunk','tanulhatunk','tanulhatok','tanulni','tanits','szeretnem',
        'legyszi','magyarazd','magyarazat','kicsit','lehet','keresek'];
    $words = preg_split('/[^a-z0-9]+/', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];
    $terms=[];
    foreach($words as $word) {
        if (strlen($word)<=2 || in_array($word,$stop,true)) continue;
        // Equivalent historical and Hungarian spellings.
        if (in_array($word,['hexachord','hexachordum','hexachordok','hexachordot',
            'hexachordokrol','hexachordrol','hexakord','hexakordok','hexakordot',
            'hexakordokrol','hexakordrol'],true)) $word='hexachord';
        if (in_array($word,['guidoni','guidofele'],true)) $word='guido';
        $terms[$word]=true;
    }
    return array_keys($terms);
}
/**
 * A short Hungarian case suffix may follow a complete indexed concept.
 * Avoid unrestricted fuzzy substring matches: "kvintkör" should match
 * "kvintkörről", but unrelated words sharing a few letters must not.
 */
function tutorTermMatch(string $query, string $indexed): bool {
    if ($query === $indexed) return true;
    if (strlen($query) >= 5 && str_starts_with($indexed, $query)) return true;
    if (strlen($indexed) < 5 || !str_starts_with($query, $indexed)) return false;
    $suffix = substr($query, strlen($indexed));
    return in_array($suffix, [
        't','at','et','ot','ok','ek','ak','okrol','ekrol','akrol',
        'rol','tol','hoz','hez','hon','on','en','an',
        'ban','ben','bol','nal','nel','nak','nek','ra','re',
        'ig','kent','val','vel','ert','roluk','okon','eken','akat','eket'
    ], true);
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
                if (tutorTermMatch($token,$word)) {
                    $labelMatched++; $isMatch=true; break;
                }
            }
            if (!$isMatch) foreach($bodyWords as $word) {
                if (tutorTermMatch($token,$word)) {
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
                    if (tutorTermMatch($token,$term)) {
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


/** Only aggregate status: do not reveal private uploaded source titles to anonymous visitors. */
function tutorSourceAudit(array $entries): array {
    $coverage=[];
    for($n=1;$n<=9;$n++) $coverage[(string)$n]=0;
    $visual=0; $glossary=0;
    foreach($entries as $entry) {
        if(!is_array($entry)) continue;
        $label=(string)($entry['label']??'');
        $source=(string)($entry['source']??'');
        foreach($coverage as $n=>$count) {
            if(preg_match('/^0?'.preg_quote((string)$n,'/').'\\./u',$label)) {
                $coverage[$n]++;
                break;
            }
            if($n===6 && str_contains($label,'Kreatív zenei nevelés')) { $coverage[$n]++; break; }
            if($n===7 && str_contains($label,'Zenetörténet')) { $coverage[$n]++; break; }
            if($n===8 && str_contains($label,'Ének-zene tantárgy-pedagógia')) { $coverage[$n]++; break; }
        }
        if(str_contains($source,'szemléltetőanyag-katalógus')) $visual++;
        if(str_contains($source,'fogalomtár') || str_contains($label,'fogalomtár')) $glossary++;
    }
    require_once __DIR__ . '/tutor-sources.php';
    return [
      'generatedIndexPresent'=>is_file(__DIR__.'/knowledge.php'),
      'licensedBookIndexPresent'=>is_file(__DIR__.'/knowledge-pedagogy.php'),
      'supplementarySourceCount'=>count(tutorSourceList()),
      'chapters'=>$coverage,
      'mediaMetadataChunks'=>$visual,
      'verifiedGlossaryChunks'=>$glossary,
      'notIndexedAutomatically'=>['PDF képi tartalom és kottaképek','Videók hang- és képtartalma','Nem feltöltött külső oldalak teljes szövege']
    ];
}

/** Detailed inventory for authenticated admins; never expose titles of private sources publicly. */
function tutorDetailedCoverage(array $entries): array {
    $groups = []; $totalCharacters = 0; $glossaryEntries = 0;
    foreach ($entries as $entry) {
        if (!is_array($entry) || !is_string($entry['source'] ?? null)) continue;
        $name = $entry['source'];
        if (str_starts_with((string)($entry['label'] ?? ''), '09. Zenei kifejezések / ')) {
            ++$glossaryEntries;
        }
        $characters = strlen((string)($entry['text'] ?? ''));
        if (!isset($groups[$name])) {
            $groups[$name] = ['source'=>$name,'chunks'=>0,'characters'=>0,'kind'=>'indexed'];
        }
        $groups[$name]['chunks']++;
        $groups[$name]['characters'] += $characters;
        $totalCharacters += $characters;
    }
    ksort($groups);
    $missing = [];
    if (!is_file(__DIR__.'/knowledge.php')) $missing[]='knowledge.php (beépített tudásbázis)';
    // Each PHP release should index the complete 09. glossary; a partial
    // manual upload must be visible to the administrator.
    if ($glossaryEntries !== 1793) $missing[]='09. Zenei kifejezések – PHP keresőindex: ' . $glossaryEntries . '/1793 tétel';
    $omitted = [
        ['file'=>'Kesztler – ellenőrizetlen OCR-átirat',
         'reason'=>'A gépi szöveg szakmai ellenőrzéséig a PHP tudásbázisból kizárva']
    ];
    return [
        'generatedAt'=>gmdate('c'),
        'indexChunks'=>count($entries),
        'chapter09GlossaryEntries'=>$glossaryEntries,
        'indexedCharacters'=>$totalCharacters,
        'sources'=>array_values($groups),
        'missing'=>$missing,
        'omitted'=>$omitted,
        'limitations'=>[
            'Az index valóban felhasznált PHP-szövegrészleteit mutatja; a források teljes fájlmérete eltérhet.',
            'A PDF-ek ábrái és a külső videók hangja nem automatikusan részei a keresőindexnek.',
            'A knowledge-pedagogy.php csak jogszerű, külön engedélyezett telepítés esetén kerül a szerverre.',
            'A forrás elérhetősége önmagában nem igazolja a generált AI-válasz tartalmi helyességét.'
        ],
        'liveSources'=>count(tutorSourceList())
    ];
}
