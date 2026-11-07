<?php
declare(strict_types=1);
require __DIR__ . '/../php/api/tutor-visuals.php';
function checkVisual(bool $ok, string $why): void {
    if (!$ok) {fwrite(STDERR,"FAIL: ".$why."\n");exit(1);}
}
$answer=tutorImageReply('Tudsz képet mutatni?', 'Mondj valamit a kvintkörről.');
checkVisual(($answer['visuals']??[])===['kvintkor'],'Kvintkör from previous topic');
checkVisual(($answer['mode']??'')==='visual','Visual response type');
checkVisual(tutorImageReply('Mutass egy hangközábrát', '')['visuals']===['hangkoz'],'Explicit visual topic');
checkVisual(tutorImageReply('Tudsz képet mutatni?', 'Most az előjegyzésről beszéltünk.')['visuals']===['elojegyzes'],'Previous topic image');
checkVisual(tutorImageReply('Mi a tiszta kvint?', 'kvintkör')===null,'Do not override ordinary theory answers');
checkVisual(tutorImageReply('Tudsz képet mutatni?', '')['visuals']===[],'No fabricated unrelated image');
checkVisual(tutorImageReply('Mutass képet a kvintkörről!', '')['visuals']===['kvintkor'],'Explicit circle image');
checkVisual(tutorImageReply('mutatnál egy ilyen akkordról képet?', 'mondj valamit a Dúr akkordról')['visuals']===['dur_akkord'],'Contextual major chord');
checkVisual(tutorImageReply('mutass képet a dúr hármashangzatról','')['visuals']===['dur_akkord'],'Explicit major triad image');
fwrite(STDOUT,"Tutor visual regression checks passed\n");
