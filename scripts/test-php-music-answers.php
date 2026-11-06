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
ensure(musicKnownAnswer('Mi a szolmizáció?') !== null, 'szolmizáció');
ensure(musicKnownAnswer('Hogyan kell árnyékolni a hangszereket?') === null,
    'ismeretlen kérdésre nem költ választ');
fwrite(STDOUT, "Offline music answers tests passed\n");
