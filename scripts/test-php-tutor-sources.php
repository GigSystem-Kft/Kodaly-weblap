<?php
declare(strict_types=1);
$dir=sys_get_temp_dir() . '/zm-tutor-sources-test-' . bin2hex(random_bytes(8));
putenv('ZM_TEST_SOURCE_DIR=' . $dir);
require __DIR__ . '/../php/api/tutor-sources.php';
function assertSource(bool $pass,string $label): void {
    if (!$pass) {fwrite(STDERR,"FAILED: $label\n");exit(1);}
}
assertSource(tutorSourceList()===[],'no sources initially');
mkdir($dir,0700);
$id=bin2hex(random_bytes(16));
$text="A C-dúr hármashangzat hangjai: C, E, G.\n\nA dúr hármashangzat nagy terc és kis terc egymásra építése.";
file_put_contents(tutorSourceFile($id),json_encode([
    'title'=>'Tanár által ellenőrzött anyag','text'=>$text,'createdAt'=>gmdate('c')
],JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
$list=tutorSourceList();
assertSource(count($list)===1,'stored source is listed');
assertSource($list[0]['title']==='Tanár által ellenőrzött anyag','source title intact');
$chunks=tutorExtraKnowledge();
assertSource(count($chunks)===2,'private text is split into relevant excerpts');
assertSource(str_contains($chunks[0]['text'],'C-dúr'),'retrieved text accurate');

// Regression: a single long, unbroken Hungarian line used to be truncated at
// 1,400 bytes. A cut could split an 'ő' byte sequence and discard the ending.
$longText=str_repeat('ő',1049).' VÉGE-HEXACHORD';
file_put_contents(tutorSourceFile($id),json_encode([
    'title'=>'Tanár által ellenőrzött anyag','text'=>$longText,'createdAt'=>gmdate('c')
],JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
$longChunks=tutorExtraKnowledge();
assertSource(count($longChunks)>=3,'long Unicode line becomes multiple indexed excerpts');
assertSource(implode('',array_column($longChunks,'text'))===$longText,
    'entire long Hungarian text, including the last concept, remains indexed');
foreach ($longChunks as $longChunk) {
    assertSource(preg_match('//u',$longChunk['text'])===1,'source excerpt remains valid UTF-8');
    assertSource(strlen($longChunk['text'])<=1000,'source excerpt keeps 1000-byte limit');
    assertSource(json_encode($longChunk,JSON_THROW_ON_ERROR)!==false,'source excerpt can be returned as JSON');
}
// A short final piece must not vanish after a very long preceding chunk.
$shortTail=str_repeat('ő',450).'a';
file_put_contents(tutorSourceFile($id),json_encode([
    'title'=>'Tanár által ellenőrzött anyag','text'=>$shortTail,'createdAt'=>gmdate('c')
],JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
$tailChunks=tutorExtraKnowledge();
assertSource(implode('',array_column($tailChunks,'text'))===$shortTail,
    'short tail after 900-byte split must be preserved');
// A-08: the complete teacher-approved text must survive indexing, including
// isolated headings, one-word musical examples and exact paragraph separators.
$privateSource="𝄞 Magyar kottajel\n\nDó–ré\n\nRitmus: \u{0151} és \u{0171}.\r\n \t\r\n" .
    str_repeat("hangköz🎼",145) . "\r\n\nZárás.";
file_put_contents(tutorSourceFile($id),json_encode([
    'title'=>'Unicode pedagógiai jegyzet','text'=>$privateSource,'createdAt'=>gmdate('c')
],JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
$privateChunks=tutorExtraKnowledge();
assertSource(count($privateChunks)>2,'independent private source paragraphs indexed');
assertSource(implode('',array_column($privateChunks,'text'))===$privateSource,
    'every original UTF-8 byte and short paragraph is present after indexing');
assertSource(str_contains($privateChunks[0]['text'],"𝄞 Magyar kottajel"),
    'music notation and source heading preserved');
assertSource(array_reduce($privateChunks,static fn($found,$item)=>
    $found || str_contains($item['text'],"Dó–ré"),false),
    'short music example no longer dropped');
assertSource(array_reduce($privateChunks,static fn($found,$item)=>
    $found || str_contains($item['text'],"Zárás."),false),
    'short source tail no longer dropped');
foreach($privateChunks as $chunk) {
    assertSource(preg_match('//u',$chunk['text'])===1,'private source chunk valid UTF-8');
    assertSource(strlen($chunk['text'])<=1000,'private source chunk within search limit');
}
unlink(tutorSourceFile($id));rmdir($dir);
assertSource(tutorSourceList()===[],'deleted sources excluded');
fwrite(STDOUT,"Private tutor source tests passed\n");
