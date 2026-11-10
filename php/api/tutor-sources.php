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
function tutorSourceList(): array {
    $dir = tutorSourceDirectory();
    if (!is_dir($dir)) return [];
    $result=[];
    foreach (glob($dir.'/*.json') ?: [] as $file) {
        $id=basename($file, '.json');
        if (!preg_match('/^[a-f0-9]{32}$/D', $id)) continue;
        $raw=@file_get_contents($file);
        if (!is_string($raw) || strlen($raw)>330000) continue;
        $entry=json_decode($raw,true);
        if (!is_array($entry) || !isset($entry['title'],$entry['text'])) continue;
        $result[]=[
            'id'=>$id,'title'=>(string)$entry['title'],
            'createdAt'=>(string)($entry['createdAt'] ?? ''),
            'size'=>strlen((string)$entry['text']),
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
    $remaining = $line;
    $pieces = [];
    while (strlen($remaining) > $byteLimit) {
        $cut = $byteLimit;
        while ($cut > 0 && preg_match('//u', substr($remaining, 0, $cut)) !== 1) --$cut;
        if ($cut === 0) return [];
        $prefix = substr($remaining, 0, $cut);
        $space = strrpos($prefix, ' ');
        if ($space !== false && $space >= intdiv($byteLimit, 2)) $cut = $space + 1;
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
        $raw=@file_get_contents(tutorSourceFile($source['id']));
        if (!is_string($raw)) continue;
        $payload=json_decode($raw,true);
        $text=$payload['text'] ?? null;
        if (!is_string($text) || preg_match('//u',$text)!==1) continue;
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
                    'label'=>(++$part).'. szövegrész',
                    'text'=>$piece
                ];
            }
        }
    }
    return $entries;
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
        $dir=tutorSourceDirectory();
        if (!is_dir($dir) && !mkdir($dir,0700,true) && !is_dir($dir)) {
            throw new RuntimeException('Cannot create private source directory');
        }
        $id=bin2hex(random_bytes(16));
        $payload=json_encode([
            'title'=>$title,
            'text'=>$text,
            'createdAt'=>gmdate('c'),
        ],JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR);
        if (file_put_contents(tutorSourceFile($id),$payload,LOCK_EX)===false) {
            throw new RuntimeException('Private source write failed');
        }
        chmod(tutorSourceFile($id),0600);
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
