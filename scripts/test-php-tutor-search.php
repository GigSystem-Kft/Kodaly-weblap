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
fwrite(STDOUT,"Hungarian tutor search regression tests passed\n");
