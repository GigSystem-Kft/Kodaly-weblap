<?php
declare(strict_types=1);
require __DIR__ . '/../php/api/creative-answers.php';
function checkCreative(bool $ok,string $why): void {
    if (!$ok) { fwrite(STDERR,"FAIL: $why\n"); exit(1); }
}
$sample=[
    ['source'=>'Szirányi Borbála (2021) – Kreatív énekes-játékok ritmikus mozgással',
     'creativePractice'=>[
        'title'=>'Éneklés és lüktetés térben','theme'=>'Mérőérzék',
        'goal'=>'Az egyenletes mérő tartása és mozgással való megélése.',
        'steps'=>['Énekeljetek közösen.','Lépjetek a lüktetésre.','Váltsatok irányt, a lüktetést megtartva.'],
        'observation'=>'Megmarad-e a lüktetés?','page'=>'31–32.']],
    ['source'=>'Szirányi Borbála (2021) – Kreatív énekes-játékok ritmikus mozgással',
     'creativePractice'=>[
        'title'=>'Labdagurítás szinkópára','theme'=>'Ritmusképletek',
        'goal'=>'A szinkópa tudatosítása ritmikus játékkal.',
        'steps'=>['Üljetek körbe.','A labdát csak a szinkópánál gurítsátok.'],
        'observation'=>'Időben érkezik-e a labda?','page'=>'10.']]
];
$q='Ajánlj játékos módszert a ritmusérzék fejlesztésére!';
$a=creativePracticeAnswer($q,$sample);
checkCreative(is_string($a),'natural method question recognized');
checkCreative(str_contains($a,'**Cél:**') && str_contains($a,'**Forrás:**'),'clear method structure');
checkCreative(str_contains($a,'Szirányi Borbála (2021)'),'author citation');
checkCreative(str_contains($a,'oldal'),'page citation');
checkCreative(!str_contains($a,'nem találtam'),'no fallback for available practices');
$sync=creativePracticeAnswer('Hogyan tanítsam a szinkópát játékosan?',$sample);
checkCreative(is_string($sync) && str_contains($sync,'Labdagurítás szinkópára'),'select topic-specific practice');
checkCreative(creativePracticeAnswer('Mi a tiszta kvint?',$sample)===null,'ordinary music-theory answer unaffected');
checkCreative(creativePracticeAnswer('Ajánlj ritmusgyakorlatot!',[])===null,'do not invent uncited practice');
fwrite(STDOUT,"Creative pedagogical chat regression tests passed\n");
