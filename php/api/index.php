<?php
declare(strict_types=1);
/**
 * Zeneelméleti Műhely – CloudPanel PHP 8.4+ API.
 * This is the only public PHP entry point. Database credentials live OUTSIDE htdocs.
 * Request: /api/index.php?route=auth/login
 */
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');

function answer(int $status, array $payload): never {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}
function fail(int $status, string $message): never { answer($status, ['error' => $message]); }
function method(string $expected): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $expected) {
        header('Allow: ' . $expected);
        fail(405, 'Nem támogatott kérés.');
    }
}
function configuration(): array {
    // api/index.php → domain/api/index.php: three levels above = webhely-felhasználó home.
    $path = dirname(__DIR__, 3) . '/zeneelmelet-private.php';
    if (!is_file($path) || !is_readable($path)) {
        fail(503, 'A fiókszolgáltatás még nincs beállítva.');
    }
    $config = require $path;
    if (!is_array($config)) fail(503, 'Érvénytelen szerverkonfiguráció.');
    return $config;
}
function database(array $config): PDO {
    $db = $config['db'] ?? [];
    if (empty($db['host']) || empty($db['name']) || empty($db['user']) || !isset($db['password'])) {
        throw new RuntimeException('Missing database settings');
    }
    return new PDO(
        'mysql:host=' . $db['host'] . ';port=' . (int)($db['port'] ?? 3306) .
        ';dbname=' . $db['name'] . ';charset=utf8mb4',
        $db['user'],
        $db['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 5,
        ]
    );
}
function getPayload(): array {
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
        fail(415, 'JSON adatokat vár a szerver.');
    }
    $raw = file_get_contents('php://input', false, null, 0, 65537);
    if (!is_string($raw) || strlen($raw) > 65536) fail(413, 'Túl nagy kérés.');
    try { $data = json_decode($raw, true, 24, JSON_THROW_ON_ERROR); }
    catch (JsonException) { fail(400, 'Érvénytelen JSON.'); }
    if (!is_array($data) || array_is_list($data)) fail(400, 'Érvénytelen adatok.');
    return $data;
}
function guardWrite(array $config): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $expected = $config['app_origin'] ?? '';
    if ($expected !== 'https://zeneelmelet.digitaliskottatar.hu' &&
        $expected !== 'http://localhost:8000') {
        fail(503, 'Érvénytelen alkalmazáskonfiguráció.');
    }
    if ($origin !== '' && !hash_equals($expected, $origin)) fail(403, 'Érvénytelen kérésforrás.');
    if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'XMLHttpRequest') {
        fail(403, 'Hiányzó kérésazonosító.');
    }
    if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? 'same-origin') === 'cross-site') {
        fail(403, 'Külső webhelyről érkező kérés.');
    }
}
function throttle(string $action, int $max = 16): void {
    // Single-server pilot throttle; deploy a shared store or edge limits if horizontally scaling.
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = sys_get_temp_dir() . '/zm_limit_' . hash('sha256', $action . '|' . $ip);
    $f = @fopen($file, 'c+');
    if (!$f || !flock($f, LOCK_EX)) fail(503, 'Nem érhető el a bejelentkezési védelem.');
    $raw = stream_get_contents($f);
    $state = json_decode($raw ?: '{}', true);
    $now = time();
    if (!is_array($state) || ($state['expires'] ?? 0) <= $now) {
        $state = ['count' => 0, 'expires' => $now + 900];
    }
    ++$state['count'];
    rewind($f); ftruncate($f, 0);
    fwrite($f, json_encode($state)); fflush($f); flock($f, LOCK_UN); fclose($f);
    if ($state['count'] > $max) fail(429, 'Túl sok próbálkozás. Próbáld újra 15 perc múlva.');
}
const COOKIE_NAME = 'zm_session';
function tokenCookie(string $token, int $expires): void {
    setcookie(COOKIE_NAME, $token, [
        'expires' => $expires, 'path' => '/', 'secure' => true,
        'httponly' => true, 'samesite' => 'Lax'
    ]);
}
function currentUser(PDO $pdo): ?array {
    $token = $_COOKIE[COOKIE_NAME] ?? '';
    if (!is_string($token) || !preg_match('/^[a-f0-9]{64}$/D', $token)) return null;
    $s = $pdo->prepare(
        'SELECT u.id,u.email,u.display_name,u.role
         FROM zm_sessions s JOIN zm_users u ON u.id=s.user_id
         WHERE s.token_hash=? AND s.expires_at > UTC_TIMESTAMP() LIMIT 1'
    );
    $s->execute([hash('sha256', $token)]);
    $u = $s->fetch();
    return $u ? [
        'id' => $u['id'], 'email' => $u['email'],
        'displayName' => $u['display_name'], 'role' => $u['role']
    ] : null;
}
function requireUser(PDO $pdo): array {
    return currentUser($pdo) ?? fail(401, 'Bejelentkezés szükséges.');
}
function newSession(PDO $pdo, array $user): never {
    $token = bin2hex(random_bytes(32));
    $s = $pdo->prepare(
        'INSERT INTO zm_sessions(token_hash,user_id,expires_at)
         VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 7 DAY))'
    );
    $s->execute([hash('sha256', $token), $user['id']]);
    tokenCookie($token, time() + 7 * 86400);
    answer(200, ['user' => $user]);
}
function tokenToUuid(string $hex): string {
    return substr($hex,0,8) . '-' . substr($hex,8,4) . '-' .
           substr($hex,12,4) . '-' . substr($hex,16,4) . '-' . substr($hex,20,12);
}
function progressOk(mixed $p): bool {
    if (!is_array($p) || array_is_list($p)) return false;
    foreach (['completedChapters','completedSubchapters','flashcardsMastered','matchingCompleted','activityDays'] as $key) {
        if (!isset($p[$key]) || !is_array($p[$key]) || !array_is_list($p[$key]) ||
            count($p[$key]) > 10000) return false;
        foreach ($p[$key] as $v) if (!is_string($v) || strlen($v) > 120) return false;
    }
    if (!isset($p['quizScores']) || !is_array($p['quizScores']) ||
        count($p['quizScores']) > 500) return false;
    foreach ($p['quizScores'] as $key => $score) {
        if (strlen((string)$key) > 120 || !is_numeric($score) || $score < 0 || $score > 100) return false;
    }
    return isset($p['xp']) && is_numeric($p['xp']) &&
        $p['xp'] >= 0 && $p['xp'] <= 100000000;
}

/** Mail transport must be explicitly approved/configured by the server administrator.
 * PHP mail() requires a working local MTA; absent configuration fails closed.
 */
function sendAccountMail(array $config, string $email, string $subject, string $message): void {
    $from = $config['mail_from'] ?? '';
    if (($config['mail_enabled'] ?? false) !== true ||
        !is_string($from) || !filter_var($from, FILTER_VALIDATE_EMAIL) ||
        preg_match('/[\r\n]/', $from)) {
        fail(503, 'Az e-mailes fiókszolgáltatás még nincs beállítva.');
    }
    $headers = [
        'From: Zeneelmeleti Muhely <' . $from . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'MIME-Version: 1.0'
    ];
    if (!mail($email, $subject, $message, implode("\r\n", $headers))) {
        throw new RuntimeException('Mail delivery submission failed');
    }
}
function issueAccountToken(PDO $pdo, string $userId, string $purpose, int $minutes): string {
    $token = bin2hex(random_bytes(32));
    $delete = $pdo->prepare('DELETE FROM zm_account_tokens WHERE user_id=? AND purpose=?');
    $delete->execute([$userId, $purpose]);
    $stmt=$pdo->prepare('INSERT INTO zm_account_tokens(token_hash,user_id,purpose,expires_at)
        VALUES(?,?,?,DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? MINUTE))');
    $stmt->execute([hash('sha256',$token), $userId, $purpose, $minutes]);
    return $token;
}
function deliverAccountLink(array $config, string $email, string $kind, string $token): void {
    $action = $kind === 'verify' ? 'E-mail-cim megerositese' : 'Jelszo visszaallitasa';
    $url = ($config['app_origin'] ?? '') . '/#account=' . $kind . '&token=' . rawurlencode($token);
    sendAccountMail($config, $email, 'Zeneelmeleti Muhely - ' . $action,
        "Zeneelmeleti Muhely\n\n" . $action . "\n\n" .
        "Nyisd meg az alabbi hivatkozast:\n" . $url . "\n\n" .
        "Ha nem te kerted, hagyd figyelmen kivul az uzenetet.\n");
}
function redeemToken(PDO $pdo, string $token, string $purpose): ?array {
    if (!preg_match('/^[a-f0-9]{64}$/D', $token)) return null;
    $stmt = $pdo->prepare('SELECT user_id,used_at,expires_at FROM zm_account_tokens
        WHERE token_hash=? AND purpose=? FOR UPDATE');
    $stmt->execute([hash('sha256',$token), $purpose]);
    $row=$stmt->fetch();
    if (!$row || $row['used_at'] !== null ||
        strtotime($row['expires_at'] . ' UTC') <= time()) return null;
    $consume=$pdo->prepare('UPDATE zm_account_tokens SET used_at=UTC_TIMESTAMP()
        WHERE token_hash=? AND used_at IS NULL');
    $consume->execute([hash('sha256',$token)]);
    return $consume->rowCount() === 1 ? $row : null;
}
function validateNewPassword(mixed $pass): void {
    if (!is_string($pass) || strlen($pass)<12 || strlen($pass)>128) {
        fail(400, 'Legalább 12, legfeljebb 128 karakteres jelszó szükséges.');
    }
}

/** Accent-insensitive keyword search over packaged lesson and source excerpts. */
function searchTerms(string $value): array {
    $chars = ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ö'=>'o','ő'=>'o',
        'ú'=>'u','ü'=>'u','ű'=>'u','Á'=>'a','É'=>'e','Í'=>'i','Ó'=>'o',
        'Ö'=>'o','Ő'=>'o','Ú'=>'u','Ü'=>'u','Ű'=>'u'];
    $text = strtolower(strtr($value, $chars));
    $words = preg_split('/[^a-z0-9]+/', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];
    return array_values(array_unique(array_filter($words,
        static fn(string $w): bool => strlen($w)>2 && !in_array($w,
        ['hogy','milyen','ennek','annak','vagy','amit','ezek','azok','egy','van','nem','kerlek'],true)
    )));
}
function knowledgeEntries(): array {
    $file=__DIR__ . '/knowledge.php';
    if (!is_file($file)) return [];
    $list=require $file;
    return is_array($list) ? $list : [];
}
function searchLessons(string $question, int $limit=4): array {
    $tokens=searchTerms($question);
    if (!$tokens) return [];
    $hits=[];
    foreach (knowledgeEntries() as $entry) {
        if (!is_array($entry) || !isset($entry['text'],$entry['source'],$entry['label'])) continue;
        $haystack=searchTerms($entry['text'] . ' ' . $entry['label']);
        $labelWords=searchTerms($entry['label']);
        $matched=array_intersect($tokens,$haystack);
        $score=count($matched) + count(array_intersect($tokens,$labelWords))*2;
        if ($score>0) $hits[]=['score'=>$score,'entry'=>$entry];
    }
    usort($hits,static fn($a,$b)=>$b['score'] <=> $a['score']);
    return array_slice(array_map(static fn($v)=>$v['entry'],$hits),0,$limit);
}
function lessonReply(array $hits): string {
    $pieces=['**A tananyagban található kapcsolódó részletek:**'];
    foreach ($hits as $hit) {
        $excerpt=preg_replace('/\\s+/u',' ',(string)$hit['text']) ?? (string)$hit['text'];
        if (strlen($excerpt)>600) $excerpt=substr($excerpt,0,600) . '…';
        $pieces[]='**' . $hit['source'] . ' – ' . $hit['label'] . "**\n" . $excerpt;
    }
    $pieces[]='_Ez a PHP-s helyi kereső a betöltött forrásokból idéz. Nem helyettesíti a tanári ellenőrzést._';
    return implode("\n\n",$pieces);
}

try {
    $route = $_GET['route'] ?? '';
    if (!is_string($route) || strlen($route) > 70) fail(404, 'Ismeretlen útvonal.');

    if ($route === 'health') { method('GET'); answer(200, ['status'=>'ok','service'=>'zeneelmeleti-muhely-php']); }
    $config = configuration();

    if ($route === 'auth/status') {
        method('GET');
        try { database($config)->query('SELECT 1'); $available = true; }
        catch (Throwable) { $available = false; }
        answer(200, [
            'available'=>$available,
            'registrationEnabled'=>($config['invite_registration'] ?? false) === true && ($config['mail_enabled'] ?? false) === true,
            'invitationRequired'=>true
        ]);
    }
    if (in_array($route, ['auth/login','auth/register','auth/logout','auth/verify','auth/resend-verification','auth/reset-request','auth/reset','auth/change-password'], true)) {
        method('POST');
        guardWrite($config);
    } elseif ($route === 'progress' && ($_SERVER['REQUEST_METHOD'] ?? '') === 'PUT') {
        guardWrite($config);
    }
    $pdo = database($config);

    switch ($route) {
        case 'auth/me':
            method('GET');
            answer(200, ['user'=>currentUser($pdo)]);
        case 'auth/register':
            if (($config['invite_registration'] ?? false) !== true) {
                fail(403, 'A meghívásos regisztráció még nincs engedélyezve.');
            }
            throttle('register', 8);
            $data = getPayload();
            $email = is_string($data['email'] ?? null)
                ? strtolower(trim($data['email'])) : '';
            $name = is_string($data['displayName'] ?? null)
                ? trim($data['displayName']) : '';
            $pass = $data['password'] ?? null;
            $invite = is_string($data['invitationCode'] ?? null)
                ? strtolower(trim($data['invitationCode'])) : '';
            if (!preg_match('/^[a-f0-9]{64}$/D', $invite)) {
                fail(400, 'Érvénytelen vagy hiányzó meghívókód.');
            }
            if (!is_string($email) || strlen($email)>254 ||
                filter_var($email,FILTER_VALIDATE_EMAIL) === false ||
                !is_string($name) || strlen($name)<2 || strlen($name)>120 ||
                !is_string($pass) || strlen($pass)<12 || strlen($pass)>128) {
                fail(400,'Érvényes e-mail-cím, név és legalább 12 karakteres jelszó szükséges.');
            }
            // A meghívót és a fiók létrehozását egy adatbázis-tranzakció védi:
            // egyetlen kód egyszerre érkező kérések között sem használható fel kétszer.
            if (($config['mail_enabled'] ?? false) !== true) fail(503, 'Az e-mail-küldés még nincs beállítva.');
            $uuid = tokenToUuid(bin2hex(random_bytes(16)));
            $hash = password_hash($pass, PASSWORD_ARGON2ID);
            $pdo->beginTransaction();
            try {
                $lock = $pdo->prepare(
                    'SELECT email, expires_at, used_at FROM zm_invitations
                     WHERE token_hash = ? FOR UPDATE'
                );
                $lock->execute([hash('sha256', $invite)]);
                $invitation = $lock->fetch();
                if (!$invitation ||
                    $invitation['used_at'] !== null ||
                    strtotime($invitation['expires_at'] . ' UTC') <= time() ||
                    !hash_equals(strtolower((string)$invitation['email']), $email)) {
                    $pdo->rollBack();
                    fail(403, 'Érvénytelen, lejárt vagy már felhasznált meghívókód, illetve eltérő e-mail-cím.');
                }
                $stmt = $pdo->prepare(
                    "INSERT INTO zm_users(id,email,display_name,password_hash,role)
                     VALUES(?,?,?,?,'student')"
                );
                $stmt->execute([$uuid,$email,$name,$hash]);
                $consume = $pdo->prepare(
                    'UPDATE zm_invitations SET used_at=UTC_TIMESTAMP(),used_by=?
                     WHERE token_hash=? AND used_at IS NULL'
                );
                $consume->execute([$uuid, hash('sha256', $invite)]);
                if ($consume->rowCount() !== 1) {
                    throw new RuntimeException('Invitation already consumed');
                }
                $token = issueAccountToken($pdo, $uuid, 'verify', 1440);
                deliverAccountLink($config, $email, 'verify', $token);
                $pdo->commit();
            } catch (PDOException $e) {
                if ($pdo->inTransaction()) $pdo->rollBack();
                if ($e->getCode() === '23000') {
                    fail(409, 'Ezzel az e-mail-címmel már létezik fiók.');
                }
                throw $e;
            } catch (Throwable $e) {
                if ($pdo->inTransaction()) $pdo->rollBack();
                throw $e;
            }
            answer(201, ['verificationPending'=>true, 'message'=>'Elküldtük a megerősítő levelet. A belépéshez kattints a levélben található hivatkozásra.']);

        case 'auth/login':
            throttle('login', 20);
            $data = getPayload();
            $email = strtolower(trim($data['email'] ?? ''));
            $pass = $data['password'] ?? null;
            if (!is_string($email) || strlen($email)>254 || !is_string($pass) || strlen($pass)>128) {
                fail(400, 'Érvénytelen adatok.');
            }
            $stmt=$pdo->prepare('SELECT id,email,display_name,role,password_hash,email_verified_at FROM zm_users WHERE email=? LIMIT 1');
            $stmt->execute([$email]);
            $row=$stmt->fetch();
            if (!$row || !password_verify($pass, $row['password_hash'])) {
                fail(401,'Hibás e-mail-cím vagy jelszó.');
            }
            if ($row['email_verified_at'] === null) {
                fail(403, 'A belépés előtt erősítsd meg az e-mail-címedet.');
            }
            newSession($pdo, ['id'=>$row['id'],'email'=>$row['email'],
                'displayName'=>$row['display_name'],'role'=>$row['role']]);

        case 'auth/verify':
            throttle('verify', 30);
            $body = getPayload();
            $token = is_string($body['token'] ?? null) ? strtolower(trim($body['token'])) : '';
            $pdo->beginTransaction();
            try {
                $row=redeemToken($pdo, $token, 'verify');
                if (!$row) { $pdo->rollBack(); fail(400, 'A megerősítő hivatkozás lejárt vagy már felhasználták.'); }
                $stmt=$pdo->prepare('UPDATE zm_users SET email_verified_at=UTC_TIMESTAMP() WHERE id=?');
                $stmt->execute([$row['user_id']]);
                $pdo->commit();
            } catch (Throwable $e) {
                if ($pdo->inTransaction()) $pdo->rollBack();
                throw $e;
            }
            answer(200, ['success'=>true]);

        case 'auth/resend-verification':
            throttle('resend-verification', 5);
            $body=getPayload();
            $email=is_string($body['email'] ?? null) ? strtolower(trim($body['email'])) : '';
            if (strlen($email)>254 || filter_var($email,FILTER_VALIDATE_EMAIL) === false) fail(400,'Érvénytelen e-mail-cím.');
            if (($config['mail_enabled'] ?? false) !== true) fail(503, 'Az e-mailes fiókszolgáltatás még nincs beállítva.');
            $stmt=$pdo->prepare('SELECT id FROM zm_users WHERE email=? AND email_verified_at IS NULL LIMIT 1');
            $stmt->execute([$email]);
            $user=$stmt->fetch();
            if ($user) {
                $pdo->beginTransaction();
                try {
                    $token=issueAccountToken($pdo, $user['id'], 'verify', 1440);
                    deliverAccountLink($config, $email, 'verify', $token);
                    $pdo->commit();
                } catch (Throwable $e) {
                    if ($pdo->inTransaction()) $pdo->rollBack();
                    throw $e;
                }
            }
            answer(200,['message'=>'Ha a fiók megerősítésre vár, új levelet küldtünk.']);

        case 'auth/reset-request':
            throttle('reset-request', 8);
            $body = getPayload();
            $email = is_string($body['email'] ?? null) ? strtolower(trim($body['email'])) : '';
            if (strlen($email)>254 || filter_var($email,FILTER_VALIDATE_EMAIL) === false) fail(400,'Érvénytelen e-mail-cím.');
            if (($config['mail_enabled'] ?? false) !== true) fail(503, 'Az e-mailes helyreállítás még nincs beállítva.');
            $stmt=$pdo->prepare('SELECT id FROM zm_users WHERE email=? LIMIT 1');
            $stmt->execute([$email]);
            $user=$stmt->fetch();
            if ($user) {
                $pdo->beginTransaction();
                try {
                    $token=issueAccountToken($pdo, $user['id'], 'reset', 30);
                    deliverAccountLink($config, $email, 'reset', $token);
                    $pdo->commit();
                } catch (Throwable $e) {
                    if ($pdo->inTransaction()) $pdo->rollBack();
                    throw $e;
                }
            }
            answer(200,['message'=>'Ha létezik ilyen fiók, elküldtük a helyreállítási hivatkozást.']);

        case 'auth/reset':
            throttle('reset', 15);
            $body=getPayload();
            $token=is_string($body['token'] ?? null) ? strtolower(trim($body['token'])) : '';
            validateNewPassword($body['password'] ?? null);
            $pdo->beginTransaction();
            try {
                $row=redeemToken($pdo, $token, 'reset');
                if (!$row) { $pdo->rollBack(); fail(400, 'Érvénytelen, lejárt vagy már felhasznált helyreállítási hivatkozás.'); }
                $stmt=$pdo->prepare('UPDATE zm_users SET password_hash=? WHERE id=?');
                $stmt->execute([password_hash($body['password'], PASSWORD_ARGON2ID), $row['user_id']]);
                $stmt=$pdo->prepare('DELETE FROM zm_sessions WHERE user_id=?');
                $stmt->execute([$row['user_id']]);
                $pdo->commit();
            } catch (Throwable $e) {
                if ($pdo->inTransaction()) $pdo->rollBack();
                throw $e;
            }
            tokenCookie('', time()-3600);
            answer(200,['success'=>true]);

        case 'auth/change-password':
            throttle('password-change', 15);
            $user=requireUser($pdo);
            $body=getPayload();
            $previous=$body['currentPassword'] ?? null;
            validateNewPassword($body['newPassword'] ?? null);
            if (!is_string($previous)) fail(400,'A jelenlegi jelszó megadása kötelező.');
            $stmt=$pdo->prepare('SELECT password_hash FROM zm_users WHERE id=?');
            $stmt->execute([$user['id']]);
            $stored=$stmt->fetchColumn();
            if (!$stored || !password_verify($previous, (string)$stored)) fail(403, 'A jelenlegi jelszó helytelen.');
            $pdo->beginTransaction();
            try {
                $stmt=$pdo->prepare('UPDATE zm_users SET password_hash=? WHERE id=?');
                $stmt->execute([password_hash($body['newPassword'], PASSWORD_ARGON2ID),$user['id']]);
                $stmt=$pdo->prepare('DELETE FROM zm_sessions WHERE user_id=?');
                $stmt->execute([$user['id']]);
                $pdo->commit();
            } catch (Throwable $e) {
                if ($pdo->inTransaction()) $pdo->rollBack();
                throw $e;
            }
            tokenCookie('', time()-3600);
            answer(200,['success'=>true]);

        case 'auth/logout':
            $token=$_COOKIE[COOKIE_NAME] ?? '';
            if (is_string($token) && preg_match('/^[a-f0-9]{64}$/D',$token)) {
                $stmt=$pdo->prepare('DELETE FROM zm_sessions WHERE token_hash=?');
                $stmt->execute([hash('sha256',$token)]);
            }
            tokenCookie('', time()-3600);
            answer(200,['success'=>true]);

        case 'progress':
            $user=requireUser($pdo);
            $httpMethod=$_SERVER['REQUEST_METHOD'] ?? '';
            if ($httpMethod === 'GET') {
                $stmt=$pdo->prepare('SELECT progress_json FROM zm_progress WHERE user_id=?');
                $stmt->execute([$user['id']]);
                $value=$stmt->fetchColumn();
                answer(200,['progress'=>$value===false?null:json_decode((string)$value,true)]);
            }
            if ($httpMethod !== 'PUT') { header('Allow: GET, PUT'); fail(405,'Nem támogatott kérés.'); }
            $body=getPayload();
            $progress=$body['progress'] ?? null;
            if (!progressOk($progress)) fail(400,'Érvénytelen tanulási adatok.');
            $text=json_encode($progress,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
            if (strlen($text)>64000) fail(413,'Túl nagy tanulási napló.');
            $stmt=$pdo->prepare(
                'INSERT INTO zm_progress(user_id,progress_json) VALUES(?,?)
                 ON DUPLICATE KEY UPDATE progress_json=VALUES(progress_json)'
            );
            $stmt->execute([$user['id'],$text]);
            answer(200,['success'=>true]);

        case 'chat/status':
            method('GET');
            $entries=knowledgeEntries();
            $sources=[];
            $lessons=0;
            foreach ($entries as $entry) {
                if (($entry['source'] ?? '')==='Zeneelméleti Műhely – Tananyag') $lessons++;
                else $sources[$entry['source'] ?? ''] = true;
            }
            answer(200,['mode'=>'fallback',
                'knowledge'=>['indexedSources'=>count($sources),
                    'lessonChunks'=>$lessons,'indexedChunks'=>count($entries)]]);
        case 'chat':
            method('POST'); guardWrite($config); throttle('chat', 60);
            $data=getPayload();
            $question=trim($data['message'] ?? '');
            if (!is_string($question) || !$question || strlen($question)>1000) fail(400,'Írj egy rövid zeneelméleti kérdést.');
            $hits=searchLessons($question);
            if (!$hits) answer(200, ['mode'=>'fallback',
                'reply'=>'A jelenleg betöltött tananyagban nem találtam biztos forrásrészletet ehhez a kérdéshez. Próbálj pontosabb zeneelméleti fogalmat megadni.']);
            answer(200,['mode'=>'fallback','reply'=>lessonReply($hits)]);
        default:
            fail(404,'Ismeretlen API-végpont.');
    }
} catch (Throwable $error) {
    error_log('Zeneelméleti Műhely PHP API error: ' . $error->getMessage());
    fail(503, 'A szerveroldali szolgáltatás átmenetileg nem érhető el.');
}
