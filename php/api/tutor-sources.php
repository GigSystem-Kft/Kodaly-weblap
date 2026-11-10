<?php
declare(strict_types=1);

/**
 * Additional teacher-approved plain-text sources, stored outside the webroot.
 * Deliberately rejects PDFs/OCR: those must be proofread before ingestion.
 */
function tutorSourceDirectory(): string {
    if (PHP_SAPI === 'cli' && ($override = getenv('ZM_TEST_SOURCE_DIR')) !== false && $override !== '') return $override;
    return dirname(__DIR__, 3) . '/zeneelmelet-ai-sources';
}
function tutorSourceFile(string $id): string {
    if (!preg_match('/^[a-f0-9]{32}$/D', $id)) {
        fail(400, 'Érvénytelen forrásazonosító.');
    }
    return tutorSourceDirectory() . '/' . $id . '.json';
}
/**
 * Read only a regular, well-formed source record from the private store.
 * Never accept a second read whose content differs from the source inventory:
 * an upload replaced between listing and indexing must not be silently mixed.
 */
/**
 * Publish a complete source record with owner-only permissions. A direct
 * file_put_contents(LOCK_EX) is not atomic for readers that do not acquire a
 * shared lock: an indexing request may see a partial JSON file. Write the
 * entire payload to a private temporary file and rename only on success.
 */
function tutorStoreSourceRecord(string $id, string $payload): void {
    $dir=tutorSourceDirectory();
    if (is_link($dir)) throw new RuntimeException('Private source directory cannot be a symlink');
    if (!is_dir($dir) && !mkdir($dir,0700,true) && !is_dir($dir)) {
        throw new RuntimeException('Cannot create private source directory');
    }
    $target=tutorSourceFile($id);
    $temporary=$dir.'/.'.bin2hex(random_bytes(16)).'.tmp';
    $handle=@fopen($temporary,'x+b');
    if ($handle===false) throw new RuntimeException('Cannot create private source staging file');
    try {
        if (!chmod($temporary,0600)) throw new RuntimeException('Cannot secure private source staging file');
        $size=strlen($payload);
        $offset=0;
        while ($offset<$size) {
            $count=fwrite($handle,substr($payload,$offset));
            if ($count===false || $count===0) throw new RuntimeException('Incomplete private source write');
            $offset+=$count;
        }
        if (!fflush($handle)) throw new RuntimeException('Cannot flush private source');
    } catch (Throwable $error) {
        fclose($handle);
        @unlink($temporary);
        throw $error;
    }
    fclose($handle);
    if (file_exists($target) || is_link($target) || !@rename($temporary,$target)) {
        @unlink($temporary);
        throw new RuntimeException('Cannot publish private source record');
    }
}
function tutorReadSourceRecord(string $id, ?string $expectedSha256 = null): ?array {
    if (!preg_match('/^[a-f0-9]{32}$/D', $id)) return null;
    $file=tutorSourceFile($id);
    if (is_link($file) || !is_file($file)) return null;
    $size=@filesize($file);
    if ($size===false || $size<=0 || $size>330000) return null;
    $raw=@file_get_contents($file);
    // The second link check protects the common replace-during-read case.
    // The directory must still be owner-only (0700) on the production server.
    if (is_link($file) || !is_string($raw) ||
        strlen($raw)>330000 || strlen($raw)===0) return null;
    $entry=json_decode($raw,true);
    if (!is_array($entry) ||
        !is_string($entry['title'] ?? null) ||
        !is_string($entry['text'] ?? null) ||
        preg_match('//u',$entry['title'])!==1 ||
        preg_match('//u',$entry['text'])!==1 ||
        str_contains($entry['title'],"\0") ||
        str_contains($entry['text'],"\0") ||
        str_contains($entry['text'],"\u{FFFD}")) return null;
    $digest=hash('sha256',$entry['text']);
    if ($expectedSha256!==null && !hash_equals($expectedSha256,$digest)) return null;
    return [
        'title'=>$entry['title'],
        'text'=>$entry['text'],
        'createdAt'=>is_string($entry['createdAt'] ?? null) ? $entry['createdAt'] : '',
        'sha256'=>$digest
    ];
}
function tutorSourceList(): array {
    $dir = tutorSourceDirectory();
    if (is_link($dir) || !is_dir($dir)) return [];
    $result=[];
    foreach (glob($dir.'/*.json') ?: [] as $file) {
        $id=basename($file, '.json');
        $entry=tutorReadSourceRecord($id);
        if ($entry===null) continue;
        $result[]=[
            'id'=>$id,'title'=>$entry['title'],
            'createdAt'=>$entry['createdAt'],
            'size'=>strlen($entry['text']),
            // The original teacher-approved text is the checksum baseline.
            // Expose it only to authenticated administrators via admin/sources.
            'sha256'=>$entry['sha256'],
        ];
    }
    usort($result,static fn($a,$b)=>strcmp($b['createdAt'],$a['createdAt']));
    return $result;
}
/**
 * Split long teacher-approved UTF-8 lines into intact, byte-limited pieces.
 * The former substr(..., 0, 1400) dropped the remaining text and could
 * corrupt accented Hungarian characters. No mbstring extension is required.
 */
function tutorSourceUtf8Pieces(string $line, int $byteLimit = 900): array {
    // Keep the exact teacher-approved text: trimming stripped paragraph
    // indentation and trailing newlines from the searchable index.
    if ($byteLimit < 4) throw new InvalidArgumentException('UTF-8 chunk limit must be at least 4 bytes');
    $remaining = $line;
    $pieces = [];
    while (strlen($remaining) > $byteLimit) {
        $cut = $byteLimit;
        while ($cut > 0 && preg_match('//u', substr($remaining, 0, $cut)) !== 1) --$cut;
        if ($cut === 0) return [];
        $prefix = substr($remaining, 0, $cut);
        $space = strrpos($prefix, ' ');
        if ($space !== false && $space >= intdiv($byteLimit, 2)) $cut = $space + 1;
        // The final code point might only be the base of a combining-accent
        // grapheme or one emoji in a ZWJ sequence. Inspect the entire
        // grapheme in the original string, not just the truncated prefix.
        // This costs at most one small regex scan per 900-byte chunk.
        $prefix = substr($remaining, 0, $cut);
        if (preg_match_all('/\\X/u', $prefix, $graphemes, PREG_OFFSET_CAPTURE) > 0) {
            $last = $graphemes[0][count($graphemes[0])-1];
            $lastStart = $last[1];
            if ($lastStart > 0 && preg_match('/\\X/u', $remaining, $full, 0, $lastStart) === 1 &&
                $lastStart + strlen($full[0]) > $cut) {
                $cut = $lastStart;
            }
        }
        $piece = substr($remaining, 0, $cut);
        if ($piece !== '') $pieces[] = $piece;
        $remaining = substr($remaining, $cut);
    }
    if ($remaining !== '') $pieces[] = $remaining;
    return $pieces;
}

function tutorExtraKnowledge(): array {
    $entries=[];
    foreach (tutorSourceList() as $source) {
        // Recheck after the inventory read: no stale, partial, swapped, or
        // newly symlinked source may enter the live tutor index.
        $record=tutorReadSourceRecord($source['id'],$source['sha256']);
        if ($record===null) continue;
        $text=$record['text'];
        // Preserve every character from the teacher-reviewed upload, not only
        // paragraphs longer than 40 bytes. The previous short-tail/heading
        // threshold silently removed short musical terms such as "Dó–ré".
        // Retain the exact paragraph delimiter with the preceding paragraph
        // so joining every indexed piece reconstructs the source byte-for-byte.
        $segments=preg_split('/(\r?\n[ \t]*\r?\n)/u', $text,-1,PREG_SPLIT_DELIM_CAPTURE);
        if (!is_array($segments)) continue;
        $part=0;
        for ($i=0;$i<count($segments);$i+=2) {
            $paragraph=$segments[$i] . ($segments[$i+1] ?? '');
            foreach (tutorSourceUtf8Pieces($paragraph) as $piece) {
                if ($piece==='') continue;
                $entries[]=[
                    'source'=>$source['title'],
                    // Two uploads may share the same title; a stable ID is
                    // necessary for independent audit and reconciliation.
                    'sourceId'=>$source['id'],
                    'label'=>(++$part).'. szövegrész',
                    'text'=>$piece
                ];
            }
        }
    }
    return $entries;
}
/**
 * Check every private teacher upload byte-for-byte against what the tutor
 * actually indexes. Called only by the authenticated source-coverage route.
 * Identical titles remain separate because sourceId, not source title, is key.
 *
 * This checks text completeness, NOT legal permission or factual correctness.
 * The original text is never returned to the admin inventory response.
 */
function tutorPrivateSourceIntegrity(array $entries): array {
    $indexed=[];
    foreach ($entries as $entry) {
        if (!is_array($entry) || !is_string($entry['sourceId'] ?? null) ||
            !is_string($entry['text'] ?? null)) continue;
        $id=$entry['sourceId'];
        if (!isset($indexed[$id])) $indexed[$id]=['bytes'=>0,'parts'=>0,'text'=>''];
        $indexed[$id]['text'].=$entry['text'];
        $indexed[$id]['bytes']+=strlen($entry['text']);
        $indexed[$id]['parts']++;
    }
    $results=[];
    foreach (tutorSourceList() as $source) {
        $id=$source['id'];
        $entry=$indexed[$id] ?? ['bytes'=>0,'parts'=>0,'text'=>''];
        $complete=$entry['parts']>0 &&
            $entry['bytes']===$source['size'] &&
            hash_equals($source['sha256'],hash('sha256',$entry['text']));
        $results[]=[
            'id'=>$id,
            'title'=>$source['title'],
            'sourceBytes'=>$source['size'],
            'indexedBytes'=>$entry['bytes'],
            'indexedChunks'=>$entry['parts'],
            'sha256'=>$source['sha256'],
            'complete'=>$complete,
        ];
    }
    return $results;
}

function tutorSourcesAdminRoute(array $config, string $route): never {
    if ($route === 'admin/sources') {
        method('GET');
        answer(200,['sources'=>tutorSourceList()]);
    }
    method('POST');
    guardWrite($config);
    throttle('admin-source-write',30);
    if ($route === 'admin/source-upload') {
        if (!isset($_FILES['file']) || !is_array($_FILES['file']) ||
            ($_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE)!==UPLOAD_ERR_OK) {
            fail(400,'Hiányzó vagy hibás forrásfájl.');
        }
        $upload=$_FILES['file'];
        $name=$upload['name'] ?? '';
        if (!is_string($name) || strlen($name)>160 || !preg_match('/\.(txt|md)$/iD',$name)) {
            fail(400,'Csak UTF-8 kódolású .txt és .md forrásokat lehet feltölteni.');
        }
        $size=(int)($upload['size'] ?? 0);
        if ($size<30 || $size>300000) fail(413,'A feltölthető forrás mérete 30 bájt és 300 KB között lehet.');
        $tmp=$upload['tmp_name'] ?? '';
        if (!is_string($tmp) || !is_uploaded_file($tmp)) fail(400,'Érvénytelen feltöltés.');
        $text=@file_get_contents($tmp);
        if (!is_string($text) || strlen($text)>300000 ||
            preg_match('//u',$text)!==1 ||
            str_contains($text,"\0") ||
            preg_match('/[\x{FFFD}]/u',$text)) {
            fail(400,'Nem megfelelő UTF-8 szöveg vagy hibás karakterfelismerés. Ellenőrizd a fájlt.');
        }
        $sources=tutorSourceList();
        if (count($sources)>=25) fail(409,'Legfeljebb 25 további forrás tölthető fel.');
        $title=trim((string)($_POST['title'] ?? ''));
        if ($title==='' || strlen($title)>120 || preg_match('/[\x00-\x1F]/',$title)) {
            fail(400,'Adj meg egy legfeljebb 120 karakteres forráscímet.');
        }
        $id=bin2hex(random_bytes(16));
        $payload=json_encode([
            'title'=>$title,
            'text'=>$text,
            'createdAt'=>gmdate('c'),
        ],JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR);
        tutorStoreSourceRecord($id,$payload);
        answer(201,['success'=>true,'source'=>['id'=>$id,'title'=>$title]]);
    }
    if ($route === 'admin/source-delete') {
        $payload=getPayload();
        $id=$payload['id'] ?? null;
        if (!is_string($id)) fail(400,'Érvénytelen azonosító.');
        $file=tutorSourceFile($id);
        if (!is_file($file)) fail(404,'A forrás már nem létezik.');
        if (!unlink($file)) throw new RuntimeException('Cannot delete private source');
        answer(200,['success'=>true]);
    }
    fail(404,'Ismeretlen forráskezelő végpont.');
}
