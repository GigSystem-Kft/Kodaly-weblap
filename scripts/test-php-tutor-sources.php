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
// A-24: real upload writes are staged with 0600 permissions and only the
// complete payload is published atomically. Never replace an existing ID.
$atomicId=bin2hex(random_bytes(16));
$atomicText="Ritmusképletek: tá, ti-ti.\n\n𝄞 Helyes szolmizáció és felosztás.";
$atomicPayload=json_encode([
    'title'=>'Atomikus tanári forrás',
    'text'=>$atomicText,
    'createdAt'=>gmdate('c')
],JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
tutorStoreSourceRecord($atomicId,$atomicPayload);
$atomicFile=tutorSourceFile($atomicId);
assertSource(file_get_contents($atomicFile)===$atomicPayload,
    'complete JSON bytes published without partial output');
assertSource((fileperms($atomicFile) & 0777)===0600,
    'private source file has owner-only permissions');
assertSource((tutorReadSourceRecord($atomicId)['text']??null)===$atomicText,
    'published file is readable as a verified teacher source');
assertSource(glob($dir.'/.'.'*.tmp')===[],
    'successful upload leaves no staging files');
$duplicateFailed=false;
try {tutorStoreSourceRecord($atomicId,'{"title":"Hamis csere","text":"NEM"}');}
catch (RuntimeException $e) {$duplicateFailed=true;}
assertSource($duplicateFailed && file_get_contents($atomicFile)===$atomicPayload,
    'duplicate ID cannot overwrite an already approved source');
assertSource(glob($dir.'/.'.'*.tmp')===[],
    'rejected duplicate upload removes its staging file');
$oldDigest=hash('sha256',$atomicText);
assertSource(tutorReadSourceRecord($atomicId,$oldDigest)!==null,
    'original inventory hash accepts original uploaded source');
file_put_contents($atomicFile,str_replace('Ritmusképletek','RitmusképletAk',$atomicPayload));
assertSource(tutorReadSourceRecord($atomicId,$oldDigest)===null,
    'changed source cannot be trusted under its old inventory checksum');
file_put_contents($atomicFile,$atomicPayload);
assertSource(tutorReadSourceRecord($atomicId,$oldDigest)!==null,
    'restored content passes its original checksum');
unlink($atomicFile);

// A source directory itself may not be a symlink into a public location.
$fakeDir=sys_get_temp_dir().'/zm-source-directory-link-'.bin2hex(random_bytes(8));
assertSource(symlink($dir,$fakeDir),'test directory symlink created');
putenv('ZM_TEST_SOURCE_DIR='.$fakeDir);
assertSource(tutorSourceList()===[],'symlinked private source directory is ignored');
$rejectedDirectory=false;
try {tutorStoreSourceRecord(bin2hex(random_bytes(16)),$atomicPayload);}
catch (RuntimeException $e) {$rejectedDirectory=true;}
assertSource($rejectedDirectory,'upload refuses a symlinked private directory');
putenv('ZM_TEST_SOURCE_DIR='.$dir);
unlink($fakeDir);

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
// Chunk boundaries must never separate an 'e' from its combining acute
// accent, or the components of a joined musical emoji. This matters for
// source relevance and text-to-speech even when byte-level reconstruction
// happens to work.
$combining=str_repeat('a',898)."e\u{0301}z";
$pieces=tutorSourceUtf8Pieces($combining,900);
assertSource(implode('',$pieces)===$combining,'combining-accent source text intact');
assertSource($pieces[0]===str_repeat('a',898),
    'split must occur before complete combining-accent grapheme');
assertSource(str_starts_with($pieces[1],"e\u{0301}"),
    'accent stays adjacent to its base after chunking');
$emoji=str_repeat('a',896).'👩‍🎼z';
$emojiPieces=tutorSourceUtf8Pieces($emoji,900);
assertSource(implode('',$emojiPieces)===$emoji,'joined musical emoji source intact');
assertSource($emojiPieces[0]===str_repeat('a',896),
    'split must occur before complete emoji grapheme');
assertSource(str_starts_with($emojiPieces[1],'👩‍🎼'),
    'complete musical emoji stays in one indexed chunk');
assertSource(count(tutorSourceUtf8Pieces("Dó–ré",900))===1,
    'short musical example must be indexed');
// A-24: a private JSON source is never allowed to point through a symlink
// outside the dedicated (non-public) teacher source directory.
$outsideFile=sys_get_temp_dir().'/zm-external-test-'.bin2hex(random_bytes(8)).'.json';
$outsideRecord=json_encode([
    'title'=>'NEM INDEXELHETŐ KÜLSŐ FORRÁS',
    'text'=>str_repeat('Egy idegen fájl zenei állománynak álcázva. ',4),
    'createdAt'=>gmdate('c')
],JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
file_put_contents($outsideFile,$outsideRecord);
$symlinkId=bin2hex(random_bytes(16));
$symlinkPath=tutorSourceFile($symlinkId);
assertSource(symlink($outsideFile,$symlinkPath),'symlink fixture could be created');
assertSource(count(tutorSourceList())===1,'external symlink never listed as approved source');
assertSource(count(array_filter(tutorExtraKnowledge(), static fn($entry)=>
    str_contains($entry['source'],'KÜLSŐ FORRÁS')))===0,
    'external symlink never indexed by the tutor');
unlink($symlinkPath);
unlink($outsideFile);
// Malformed JSON records must also fail closed, not trigger array-to-string
// warnings or expose private values in the administrator's inventory.
$badId=bin2hex(random_bytes(16));
$badPath=tutorSourceFile($badId);
file_put_contents($badPath,'{"title":[],"text":[],"createdAt":3}');
assertSource(count(tutorSourceList())===1,'invalid source payload is ignored');
unlink($badPath);
// A-08: identical titles are legal (e.g. different editions), but they
// must never collapse into one source in the administrator's coverage report.
require __DIR__ . '/../php/api/tutor-search.php';
$duplicateId=bin2hex(random_bytes(16));
$secondText="Második feltöltött példatár.\n\nRitmus: tá–ti.";
file_put_contents(tutorSourceFile($duplicateId),json_encode([
    'title'=>'Unicode pedagógiai jegyzet',
    'text'=>$secondText,
    'createdAt'=>gmdate('c')
],JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
$allChunks=tutorExtraKnowledge();
$receipts=tutorPrivateSourceIntegrity($allChunks);
assertSource(count($receipts)===2,'two same-title sources have two integrity receipts');
$byId=array_column($receipts,null,'id');
assertSource(($byId[$id]['complete']??false)===true,
    'original UTF-8 source reconstructed independently');
assertSource(($byId[$duplicateId]['complete']??false)===true,
    'same-title second source independently reconstructed');
assertSource($byId[$id]['sourceBytes']===strlen($privateSource) &&
    $byId[$id]['indexedBytes']===strlen($privateSource) &&
    $byId[$id]['sha256']===hash('sha256',$privateSource),
    'original source length and SHA-256 match the indexed text');
$coverage=tutorDetailedCoverage($allChunks);
assertSource(count(array_filter($coverage['sources'],static fn($g)=>
    ($g['kind']??'')==='teacher-upload'))===2,
    'coverage keeps two distinct same-title sources');
assertSource(count($coverage['privateSourceIntegrity'])===2 &&
    count(array_filter($coverage['privateSourceIntegrity'],static fn($v)=>$v['complete']))===2,
    'admin coverage confirms both complete private uploads');

// Corrupt a same-length indexed character: a byte-count-only check would
// remain green; a real content hash must turn the receipt red.
$mutated=$allChunks;
foreach ($mutated as &$chunk) {
    if (($chunk['sourceId']??null)===$id) {
        $chunk['text']='X'.substr($chunk['text'],1);
        break;
    }
}
unset($chunk);
$badReceipts=array_column(tutorPrivateSourceIntegrity($mutated),null,'id');
assertSource(($badReceipts[$id]['complete']??true)===false &&
    ($badReceipts[$duplicateId]['complete']??false)===true,
    'same-length text corruption detected without affecting the other upload');
$brokenCoverage=tutorDetailedCoverage($mutated);
assertSource(count(array_filter($brokenCoverage['missing'],static fn($v)=>
    str_contains($v,'Tanári forrás hiányosan indexelve: ')))===1,
    'admin coverage explicitly reports private text mismatch');

// A source's admin-supplied title must not impersonate a genuine built-in
// required practice bank in the public AI source inventory.
$fakeId=bin2hex(random_bytes(16));
file_put_contents(tutorSourceFile($fakeId),json_encode([
    'title'=>'Zeneelméleti Műhely – Szókártyák',
    'text'=>'Kitalált forrás, nem az eredeti szókártyabank.',
    'createdAt'=>gmdate('c')
],JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
$spoofCoverage=tutorDetailedCoverage(tutorExtraKnowledge());
assertSource(in_array('Hiányzik a PHP Tanársegédből: Zeneelméleti Műhely – Szókártyák',
    $spoofCoverage['missing'],true),
    'an uploaded title cannot falsify the required flashcard-bank status');
unlink(tutorSourceFile($fakeId));
unlink(tutorSourceFile($duplicateId));
unlink(tutorSourceFile($id));
unlink($dir.'/.source-writes.lock');
rmdir($dir);
assertSource(tutorSourceList()===[],'deleted sources excluded');

// A-24: the upload limit must be checked while holding the same exclusive
// lock as atomic publication, not once before another admin writes a file.
$limitDir=sys_get_temp_dir().'/zm-tutor-limit-'.bin2hex(random_bytes(8));
putenv('ZM_TEST_SOURCE_DIR='.$limitDir);
$limitPayload=json_encode([
    'title'=>'Próba – 25 forrásos határ',
    'text'=>'Zeneelméleti magyar tananyag és hangszeres példa.',
    'createdAt'=>gmdate('c')
],JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
for ($i=0; $i<25; $i++) {
    tutorStoreSourceRecord(bin2hex(random_bytes(16)),$limitPayload);
}
assertSource(count(tutorSourceList())===25,
    'exactly 25 owner-only documents may be published');
$extraId=bin2hex(random_bytes(16));
$overLimit=false;
try {tutorStoreSourceRecord($extraId,$limitPayload);}
catch (OverflowException $e) {$overLimit=true;}
assertSource($overLimit && count(tutorSourceList())===25 &&
    !file_exists(tutorSourceFile($extraId)),
    'the 26th private source is refused before any file publication');
assertSource(glob($limitDir.'/.'.'*.tmp')===[],
    'capacity rejection leaves no partial staging files');
foreach (glob($limitDir.'/*.json') ?: [] as $file) unlink($file);
unlink($limitDir.'/.source-writes.lock');
rmdir($limitDir);
putenv('ZM_TEST_SOURCE_DIR='.$dir);
assertSource(tutorSourceList()===[],'capacity test left no private sources');

fwrite(STDOUT,"Private tutor source tests passed\n");
