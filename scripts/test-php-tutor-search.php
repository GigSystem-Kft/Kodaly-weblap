<?php
declare(strict_types=1);
require __DIR__ . '/../php/api/tutor-search.php';
require __DIR__ . '/../php/api/music-answers.php';
function ensureTutorSearch(bool $yes,string $label): void {
 if (!$yes) {fwrite(STDERR,"FAIL: $label\n");exit(1);}
}
$terms=searchTerms('Mit jelent az, hogy hexachord?');
ensureTutorSearch($terms===['hexachord'],'ignore Hungarian filler words');
ensureTutorSearch(searchTerms('Mi az a hexakord?')===['hexachord'],'Hungarian spelling');
ensureTutorSearch(searchTerms('Hexachordum és hexachord')===['hexachord'],'Latin form');
$entries=[
 ['source'=>'Magyar kézikönyv','label'=>'Hexachord – középkori szolmizáció',
  'text'=>'A hexachord a középkori szolmizáció hat hangú egysége: ut, re, mi, fa, sol, la.'],
 ['source'=>'Zenetörténeti adat','label'=>'Középkori hangszerek',
  'text'=>'A középkori hangszeres gyakorlat több évszázados és igen sokféle volt.'],
 ['source'=>'Hangszertan','label'=>'A furulya története','text'=>str_repeat('Furulyajáték, ábrák, történet. ',150)]
];
$hits=rankLessons('mit jelent az hogy hexachord?', $entries,2);
ensureTutorSearch(count($hits)>=1,'hexachord has search hit');
ensureTutorSearch(str_contains($hits[0]['label'],'Hexachord'),'specific glossary first');
$reply=lessonReply($hits,'mit jelent az hogy hexachord?',true);
ensureTutorSearch(str_contains($reply,'hat hangú'),'concrete definition survives fallback reply');
ensureTutorSearch(str_contains($reply,'Forrás'),'source attribution present');
ensureTutorSearch(rankLessons('Hogyan készül a tritónusz?', $entries)===[],'no unrelated fake answer');
// Natural inflected Hungarian queries must find the same teaching facts as
// dictionary forms without introducing broad unrelated substring matches.
$inflectedEntries=[
 ['source'=>'Tananyag','label'=>'Kvintkör', 'text'=>'A kvintkör a hangnemek előjegyzéseit és rokonságát szemlélteti.'],
 ['source'=>'Tananyag','label'=>'Szinkópa', 'text'=>'A szinkópa hangsúlyeltolódást eredményez.'],
 ['source'=>'Történeti szótár','label'=>'Hexachord', 'text'=>'A hexachord hat diatonikus hangból áll.'],
 ['source'=>'Egyéb','label'=>'Más jelenség', 'text'=>'Az orgona egy billentyűs hangszer.']
];
foreach ([
 'Mi a kvintkör?' => 'Kvintkör',
 'Mesélj a kvintkörről!' => 'Kvintkör',
 'Mit tanulunk a szinkópáról?' => 'Szinkópa',
 'Mesélj a hexachordokról!' => 'Hexachord',
 'Mesélj a hexakordokról!' => 'Hexachord'
] as $question=>$expected) {
 $found=rankLessons($question,$inflectedEntries,2);
 ensureTutorSearch(count($found)>0 && $found[0]['label']===$expected,
   'Hungarian concept inflection: '.$question);
 $answer=lessonReply($found,$question,true);
 ensureTutorSearch(str_contains($answer,'_Forrás:'),'Inflected reply includes attribution: '.$question);
}
ensureTutorSearch(!tutorTermMatch('kvintkorhajo','kvintkor'),
 'Reject an unrelated longer word with the same prefix');
ensureTutorSearch(rankLessons('Mi a kvintkorhajo?', $inflectedEntries)===[],
 'Unrelated compound is not treated as a kvintkör search hit');
// Shared-hosting PHP may omit mbstring: never truncate Hungarian answers
// in the middle of an accented UTF-8 code point or count bytes as letters.
ensureTutorSearch(mbSafeLength('Őő')===2,'UTF-8 character count, not bytes');
ensureTutorSearch(mbSafeCut('Őszinte',2)==='Ős','UTF-8 character-safe truncation');
$trimmed=mbSafeCut(str_repeat('ő',240),200);
ensureTutorSearch(mbSafeLength($trimmed)===200 && preg_match('//u',$trimmed)===1,
 '200 visible accented letters without malformed UTF-8');
$coverage=tutorSourceAudit([
 ['source'=>'Fogalomtár', 'label'=>'09. Zenei kifejezések', 'text'=>'Allegro'],
 ['source'=>'Tananyag', 'label'=>'08. Ének-zene tantárgy-pedagógia', 'text'=>'Kodály'],
]);
ensureTutorSearch(count($coverage['chapters'])===9,'all nine curriculum chapters audited');
ensureTutorSearch(($coverage['chapters']['9']??0)===1,'ninth chapter coverage counted');
ensureTutorSearch(($coverage['chapters']['8']??0)===1,'eighth chapter coverage counted');
$coverageDetail=tutorDetailedCoverage([
 ['source'=>'Zenei fogalomtár','label'=>'09. Zenei kifejezések / ritmus / andante', 'text'=>'Mérsékelten lassú tempó'],
 ['source'=>'Tananyag','label'=>'01. Ritmus és hangértékek', 'text'=>'Ütem, szinkópa']
]);
ensureTutorSearch($coverageDetail['chapter09GlossaryEntries']===1,
 'live PHP report counts chapter 09 glossary entries explicitly');
ensureTutorSearch(count(array_filter($coverageDetail['missing'], static fn($v) =>
 str_contains($v,'09. Zenei kifejezések') && str_contains($v,'1/1793')))===1,
 'live report flags incomplete chapter 09 glossary');
ensureTutorSearch($coverageDetail['indexedCharacters']===mbSafeLength('Mérsékelten lassú tempó')+mbSafeLength('Ütem, szinkópa'),
 'A-08 live source report counts Hungarian Unicode characters, not UTF-8 bytes');
$missingBanks=array_values(array_filter($coverageDetail['missing'],
 static fn($message)=>str_starts_with($message,'Hiányzik a PHP Tanársegédből: ')));
ensureTutorSearch(count($missingBanks)===6,
 'A-08 partial deployments flag all six missing student-facing practice banks');
fwrite(STDOUT,"Hungarian tutor search regression tests passed\n");
