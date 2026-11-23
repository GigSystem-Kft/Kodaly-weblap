<?php
declare(strict_types=1);
require __DIR__ . '/../php/api/music-answers.php';

function ensure(bool $ok, string $why): void {
    if (!$ok) { fwrite(STDERR, "HIBA: " . $why . "\n"); exit(1); }
}
$short='Röviden mondanál valamit a kvintkörről röviden, lényegretörően?';
$result=musicKnownAnswer($short);
ensure($result !== null, 'kvintkör felismerése ragozva');
ensure(str_contains($result, 'kvintkör'), 'kvintkör relevancia');
ensure(str_contains($result, 'kereszt') && str_contains($result, 'bé'), 'szakmai tartalom');
ensure(strlen($result)<500, 'kifejezetten rövid válasz');
ensure(!str_contains($result, 'furulya') && !str_contains($result,'egyetemi jegyzet'),
    'irreleváns szöveg kizárása');
ensure(musicBriefRequested($short), 'tömör válasz kérése');
ensure(musicKnownAnswer('Mi a tiszta kvint?') !== null, 'hangköz');
ensure(musicKnownAnswer('Mi az előjegyzés?') !== null, 'előjegyzés');

// A specific G-major question must never be consumed by the generic
// "előjegyzés" definition. Keep the unqualified glossary query intact.
foreach ([
    'de G-dúrban mi az előjegyzés',
    'Mi az előjegyzés G-dúrban?',
    'G dúrban hány kereszt van?',
] as $question) {
    $signature=musicKnownAnswer($question);
    ensure(is_string($signature) && str_contains($signature,'egy kereszt')
        && str_contains($signature,'F♯') && str_contains($signature,'G–A–H'),
        'G-dúr specific key signature answer: '.$question);
}
$genericSignature=musicKnownAnswer('Mi az előjegyzés?');
ensure(is_string($genericSignature) && str_contains($genericSignature,'kulcs'),
    'Unqualified question still gives the glossary explanation');

// A-20: exact live tutor questions must each receive a complete reviewed
// comparison, not a generic kvint definition or a clipped glossary entry.
foreach ([
    'Mi a különbség a tiszta kvint és a szűkített kvint között?',
    'Miben különbözik a szűkített kvint a tiszta kvinttől?'
] as $question) {
    $answer=musicKnownAnswer($question);
    ensure(is_string($answer) && str_contains($answer,'7 félhang') &&
        str_contains($answer,'6 félhang') && str_contains($answer,'C–Gesz'),
        'A-20 complete perfect/diminished fifth comparison: '.$question);
}
foreach ([
    'Miben különbözik a természetes, harmonikus és dallamos a-moll hangsor?',
    'Hasonlítsd össze a természetes, harmonikus és dallamos moll hangsort!'
] as $question) {
    $answer=musicKnownAnswer($question);
    ensure(is_string($answer) && str_contains($answer,'természetes a-moll') &&
        str_contains($answer,'harmonikus a-moll') &&
        str_contains($answer,'dallamos a-moll') &&
        str_contains($answer,'Fisz') && str_contains($answer,'Gisz') &&
        !str_contains($answer,'823. sor'),
        'A-20 complete three forms of A minor: '.$question);
}
ensure(musicKnownAnswer('Mi a szolmizáció?') !== null, 'szolmizáció');
ensure(musicKnownAnswer('Hogyan kell árnyékolni a hangszereket?') === null,
    'ismeretlen kérdésre nem költ választ');
// Regression for the exact question reported in the human AI test.
foreach (['Mi a különbség a 3/4-es és a 6/8-os ütem között?',
          'Miben tér el a 6/8 a 3/4 ütemtől?'] as $question) {
    $answer = musicKnownAnswer($question);
    ensure(is_string($answer) && str_contains($answer,'3+3 nyolcadra') &&
        str_contains($answer,'három negyedből'), '3/4 versus 6/8 reviewed comparison');
}
ensure(musicKnownAnswer('Mi az a zorbafonikus hetedik kvantumhangzat?') === null,
    'nonsensical question cannot get a fabricated reviewed answer');
fwrite(STDOUT, "Offline music answers tests passed\n");
