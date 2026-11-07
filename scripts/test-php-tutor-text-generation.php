<?php
declare(strict_types=1);
require __DIR__ . '/../php/api/tutor-text-generation.php';
function checkTextTutor(bool $ok, string $case): void {
    if (!$ok) { fwrite(STDERR, "FAIL: " . $case . "\n"); exit(1); }
}
$disabled=['tutor_text_generation'=>[
    'enabled'=>false, 'model'=>'gemini-2.5-flash-lite', 'api_key'=>'a-very-long-fake-key'
]];
checkTextTutor(!tutorTextEnabled($disabled),'disabled by default');
checkTextTutor(!tutorTextEnabled(['tutor_text_generation'=>[
    'enabled'=>true,'model'=>'unexpected-model','api_key'=>'a-very-long-fake-key'
]]),'allowlisted model');
$enabled=$disabled;
$enabled['tutor_text_generation']['enabled']=true;
checkTextTutor(tutorTextEnabled($enabled),'only explicit opt in activates');
$hits=[
 ['source'=>'Zeneelméleti Műhely – Tananyag','label'=>'02. Hangnevek',
  'text'=>'A magyar H a természetes hang, a B pedig a leszállított H.'],
 ['source'=>'Külön pedagógiai licencelt könyv','label'=>'Bizalmas',
  'text'=>'Titkos, nem továbbítható szerzői jogi forrás.'],
];
$context=tutorTextContext($hits);
checkTextTutor(count($context)===1,'licensed source excluded');
$payload=tutorTextPayload('Mi a különbség a H és B között?', $context);
$json=json_encode($payload,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
checkTextTutor(!str_contains($json,'Titkos') && str_contains($json,'leszállított H'),'only public lesson context sent');
checkTextTutor(($payload['store']??null)===false,'no optional storage');
checkTextTutor(str_contains($json,'kérdése'),'question included');
checkTextTutor(tutorTextReply($disabled,'Mi a B?',$hits)===null,'no network when off');
echo "Optional grounded tutor configuration and privacy checks passed\n";
