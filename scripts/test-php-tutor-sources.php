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
unlink(tutorSourceFile($id));rmdir($dir);
assertSource(tutorSourceList()===[],'deleted sources excluded');
fwrite(STDOUT,"Private tutor source tests passed\n");
