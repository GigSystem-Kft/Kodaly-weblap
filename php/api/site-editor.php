<?php
declare(strict_types=1);

/**
 * Small, versioned editor for on-page instructional copy.
 *
 * The PHP/MySQL content overlays do not change curriculum IDs, quiz answers,
 * grading, progress, source attribution, or the AI's separately built index.
 * Never render user-supplied HTML; the React client treats stored copy as text.
 */

function siteEditorValidateEntries(mixed $raw): array {
    if (!is_array($raw) || ($raw !== [] && array_is_list($raw)) || count($raw) > 700) {
        fail(400, 'Érvénytelen vagy túl sok szerkesztett szöveg.');
    }
    $normalized = [];
    $totalBytes = 0;
    foreach ($raw as $key => $entry) {
        if (!is_string($key) || strlen($key) > 105 ||
            preg_match('/^(?:home\.(?:title|intro)|navbar\.(?:chapters|flashcards|matching|quiz|eartraining|dashboard)|chapter\.[a-z0-9-]+\.(?:title|description)|sub\.[a-z0-9-]+\.(?:title|summary|paragraph\.[0-9]{1,3})|module\.(?:creative|musicHistory|musicPedagogy|musicExpressions)\.(?:title|description))$/D', $key) !== 1) {
            fail(400, 'Nem szerkeszthető szövegazonosító.');
        }
        if (!is_array($entry) || !is_string($entry['text'] ?? null) ||
            array_diff(array_keys($entry), ['text','style']) !== []) {
            fail(400, 'Érvénytelen szövegelem.');
        }
        $value = trim($entry['text']);
        if ($value === '' || strlen($value) > 6000 ||
            preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', $value)) {
            fail(400, 'Egy szöveg 1–6000 bájt hosszú lehet, vezérlőkarakterek nélkül.');
        }
        $style = $entry['style'] ?? [];
        if (!is_array($style) || array_diff(array_keys($style), ['color','size','spacing']) !== []) {
            fail(400, 'Érvénytelen formázás.');
        }
        $options = [
            'color' => ['default', 'indigo', 'slate', 'emerald', 'burgundy'],
            'size' => ['default', 'small', 'large'],
            'spacing' => ['default', 'compact', 'relaxed'],
        ];
        foreach ($style as $name => $setting) {
            if (!is_string($setting) || !in_array($setting, $options[$name], true)) {
                fail(400, 'Nem engedélyezett szövegformázás.');
            }
        }
        $normalized[$key] = [
            'text' => $value,
            'style' => [
                'color' => $style['color'] ?? 'default',
                'size' => $style['size'] ?? 'default',
                'spacing' => $style['spacing'] ?? 'default',
            ]
        ];
        $totalBytes += strlen($key) + strlen($value) + 160;
        if ($totalBytes > 375000) fail(413, 'A szövegmódosítások mérete túl nagy.');
    }
    ksort($normalized, SORT_STRING);
    return $normalized;
}

function siteEditorJson(mixed $value): string {
    return json_encode($value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
}

function siteEditorEnsureTable(PDO $pdo): void {
    // Bootstrap only from the admin-only editor endpoint, never from public GET.
    // Independent from every existing student / score / account table.
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS zm_site_editor (
            id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
            revision BIGINT UNSIGNED NOT NULL DEFAULT 0,
            draft_json MEDIUMTEXT NOT NULL,
            published_json MEDIUMTEXT NOT NULL,
            history_json MEDIUMTEXT NOT NULL,
            published_at DATETIME NULL,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
    $stmt = $pdo->prepare(
        'INSERT IGNORE INTO zm_site_editor
           (id,revision,draft_json,published_json,history_json)
         VALUES (1,0,?,?,?)'
    );
    $stmt->execute(['{}','{}','[]']);
}

function siteEditorRow(PDO $pdo, bool $lock=false): array {
    $query = 'SELECT revision,draft_json,published_json,history_json,published_at,updated_at
              FROM zm_site_editor WHERE id=1' . ($lock ? ' FOR UPDATE' : '');
    $row = $pdo->query($query)->fetch();
    if (!$row) throw new RuntimeException('Editor row missing');
    $row['revision'] = (int) $row['revision'];
    foreach (['draft_json','published_json','history_json'] as $name) {
        $row[$name] = json_decode((string) $row[$name], true, 16, JSON_THROW_ON_ERROR);
        if (!is_array($row[$name])) throw new RuntimeException('Editor data invalid');
    }
    return $row;
}

function siteEditorPublic(PDO $pdo): never {
    method('GET');
    try {
        $stmt = $pdo->query('SELECT revision,published_json FROM zm_site_editor WHERE id=1');
        $row = $stmt->fetch();
    } catch (PDOException $error) {
        // Fresh installations keep their bundled curriculum unchanged until an
        // admin opens the editor and creates its separate table.
        if ($error->getCode() === '42S02') {
            answer(200, ['revision'=>0, 'entries'=>(object) []]);
        }
        throw $error;
    }
    if (!$row) answer(200, ['revision'=>0,'entries'=>(object) []]);
    $entries = json_decode((string) $row['published_json'], true, 16, JSON_THROW_ON_ERROR);
    answer(200, ['revision'=>(int)$row['revision'],'entries'=>(object)$entries]);
}

function siteEditorAdmin(PDO $pdo, array $config, array $admin): never {
    siteEditorEnsureTable($pdo);
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
        $row = siteEditorRow($pdo);
        answer(200, [
            'revision'=>$row['revision'],
            'draft'=>(object)$row['draft_json'],
            'published'=>(object)$row['published_json'],
            'history'=>$row['history_json'],
            'updatedAt'=>$row['updated_at'],
            'publishedAt'=>$row['published_at'],
        ]);
    }

    method('POST');
    guardWrite($config);
    throttle('admin-content-write', 40);
    $input = getPayload(524288);
    $action = $input['action'] ?? null;
    $expected = $input['revision'] ?? null;
    if (!is_int($expected) || $expected < 0 ||
        !in_array($action, ['save','publish','rollback'], true)) {
        fail(400, 'Érvénytelen szerkesztési művelet vagy verzió.');
    }
    $entries = $action === 'save' ? siteEditorValidateEntries($input['draft'] ?? null) : null;
    $rollbackRevision = $input['rollbackRevision'] ?? null;
    if ($action === 'rollback' && (!is_int($rollbackRevision) || $rollbackRevision < 0)) {
        fail(400, 'Érvénytelen visszaállítási verzió.');
    }
    $pdo->beginTransaction();
    try {
        $row = siteEditorRow($pdo, true);
        if ($row['revision'] !== $expected) {
            $pdo->rollBack();
            fail(409, 'Egy másik szerkesztő időközben mentett. Frissítsd az adatokat.');
        }
        $draft = $row['draft_json'];
        $published = $row['published_json'];
        $history = $row['history_json'];
        $publishedAt = $row['published_at'];
        $newAt = null;
        if ($action === 'save') {
            $draft = $entries;
        } else {
            if ($action === 'rollback') {
                $match = null;
                foreach ($history as $item) {
                    if (($item['revision'] ?? null) === $rollbackRevision) {
                        $match = $item['entries'] ?? null;
                        break;
                    }
                }
                if (!is_array($match)) {
                    $pdo->rollBack();
                    fail(404, 'A választott korábbi verzió nem található.');
                }
                $draft = $match;
            }
            $history[] = [
                'revision'=>$row['revision'],
                'at'=>$publishedAt,
                'entries'=>$published,
                'by'=>$admin['id'],
            ];
            $history = array_slice($history, -10);
            $published = $draft;
            $newAt = gmdate('Y-m-d H:i:s');
        }
        $stmt = $pdo->prepare(
            'UPDATE zm_site_editor
             SET revision=?,draft_json=?,published_json=?,history_json=?,published_at=?
             WHERE id=1 AND revision=?'
        );
        $stmt->execute([
            $row['revision']+1,
            siteEditorJson((object)$draft),
            siteEditorJson((object)$published),
            siteEditorJson($history),
            $newAt ?? $publishedAt,
            $row['revision']
        ]);
        if ($stmt->rowCount() !== 1) throw new RuntimeException('Revision update was lost');
        $pdo->commit();
        answer(200, [
            'message'=>$action === 'save' ? 'A vázlat mentve. A hallgatók még a közzétett változatot látják.' :
                ($action === 'rollback' ? 'A korábbi tartalom sikeresen visszaállítva és közzétéve.' : 'A módosítások közzétéve.'),
            'revision'=>$row['revision']+1,
        ]);
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $error;
    }
}
