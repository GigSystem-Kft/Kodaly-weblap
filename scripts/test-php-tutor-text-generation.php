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
 ['source'=>'Zeneelméleti Műhely – Tananyag','contextApproved'=>true,'label'=>'02. Hangnevek',
  'text'=>'A magyar H a természetes hang, a B pedig a leszállított H.'],
 ['source'=>'Külön pedagógiai licencelt könyv','label'=>'Bizalmas',
  'text'=>'Titkos, nem továbbítható szerzői jogi forrás.'],
];
// The source title is NOT a trust boundary: teachers can legally choose the
// same title as the first-party curriculum for separately uploaded material.
$injected=$hits;
$injected[]=[
 'source'=>'Zeneelméleti Műhely – Tananyag',
 'sourceId'=>str_repeat('c',32),
 'label'=>'02. Hangnevek / külön feltöltött könyv',
 'text'=>'KÜLSŐ MODELLNEK NEM KÜLDHETŐ SZÖVEG'
];
$injected[]=[
 'source'=>'Zeneelméleti Műhely – Tananyag',
 'label'=>'02. Hangnevek / címhamisított magánforrás',
 'text'=>'LICENCELT FORRÁS NEM HIVATALOS TANANYAG'
];
$injected[]=[
 'source'=>'Zeneelméleti Műhely – Tananyag',
 'sourceId'=>str_repeat('d',32),
 'contextApproved'=>true,
 'label'=>'02. Hangnevek / hibás megbízhatósági jelölés',
 'text'=>'SZERKESZTETT FORRÁS NEM KÜLDHETŐ KI'
];
$filtered=tutorTextContext($injected);
checkTextTutor(count($filtered)===1,
 'only explicitly tagged first-party lesson, never matching private title, is eligible');
$filteredJson=json_encode(tutorTextPayload('Mi a B?', $filtered),JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
checkTextTutor(!str_contains($filteredJson,'KÜLSŐ MODELLNEK') &&
 !str_contains($filteredJson,'LICENCELT FORRÁS') &&
 !str_contains($filteredJson,'SZERKESZTETT FORRÁS'),
 'private, licensed and spoofed sources are absent from optional external payload');

$context=tutorTextContext($hits);
checkTextTutor(count($context)===1,'licensed source excluded');
$payload=tutorTextPayload('Mi a különbség a H és B között?', $context);
$json=json_encode($payload,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
checkTextTutor(!str_contains($json,'Titkos') && str_contains($json,'leszállított H'),'only public lesson context sent');
checkTextTutor(($payload['store']??null)===false,'no optional storage');
checkTextTutor(str_contains($json,'kérdése'),'question included');
// UTF-8 source excerpts and student prompts must never be cut mid-character
// before json_encode forwards an optional grounded request to a provider.
$accent="e\u{0301}";
$emoji="👩‍🎼";
$graphemeExcerpt=str_repeat('a',899).$accent."𝄞";
$lessonContext=tutorTextContext([[
    'source'=>'Zeneelméleti Műhely – Tananyag',
    'contextApproved'=>true,
    'label'=>str_repeat('L',179).$accent,
    'text'=>$graphemeExcerpt
]]);
checkTextTutor(count($lessonContext)===1,'long first-party lesson accepted');
checkTextTutor($lessonContext[0]['excerpt']===str_repeat('a',899),
    '900-byte excerpt does not split a combined Hungarian accent');
checkTextTutor($lessonContext[0]['label']===str_repeat('L',179),
    '180-byte label does not split a combined accent');
$emojiExcerpt=str_repeat('a',898).$emoji;
$emojiContext=tutorTextContext([[
    'source'=>'Zeneelméleti Műhely – Tananyag',
    'contextApproved'=>true,
    'label'=>'Példa – zenei szimbólumok',
    'text'=>$emojiExcerpt
]]);
checkTextTutor($emojiContext[0]['excerpt']===str_repeat('a',898),
    '900-byte excerpt does not split a joined musical emoji');
checkTextTutor(tutorTextSafePrefix('𝄞Á',4)==='𝄞',
    'the four-byte musical symbol is retained intact');
checkTextTutor(tutorTextSafePrefix('Ő',1)==='',
    'a one-byte limit never creates a malformed two-byte accented letter');
$longQuestion=str_repeat('q',999).$accent;
$payloadSafe=tutorTextPayload($longQuestion,$lessonContext);
$jsonSafe=json_encode($payloadSafe,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
checkTextTutor(preg_match('//u',$jsonSafe)===1 && !str_contains($jsonSafe,$accent),
    'student question Unicode remains valid at the 1000-byte cap');
checkTextTutor(tutorTextReply($disabled,'Mi a B?',$hits)===null,'no network when off');
echo "Optional grounded tutor configuration and privacy checks passed\n";
