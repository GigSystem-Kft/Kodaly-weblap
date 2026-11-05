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
try {
    $route = $_GET['route'] ?? '';
    if (!is_string($route) || strlen($route) > 70) fail(404, 'Ismeretlen útvonal.');

    if ($route === 'health') { method('GET'); answer(200, ['status'=>'ok','service'=>'zeneelmeleti-muhely-php']); }
    $config = configuration();

    if ($route === 'auth/status') {
        method('GET');
        try { database($config)->query('SELECT 1'); $available = true; }
        catch (Throwable) { $available = false; }
        answer(200, ['available'=>$available, 'registrationEnabled'=>($config['allow_registration'] ?? false) === true]);
    }
    if (in_array($route, ['auth/login','auth/register','auth/logout'], true)) {
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
            if (($config['allow_registration'] ?? false) !== true) fail(403, 'A regisztráció még nincs megnyitva.');
            throttle('register', 8);
            $data = getPayload();
            $email = strtolower(trim($data['email'] ?? ''));
            $name = trim($data['displayName'] ?? '');
            $pass = $data['password'] ?? null;
            if (!is_string($email) || strlen($email)>254 ||
                filter_var($email,FILTER_VALIDATE_EMAIL) === false ||
                !is_string($name) || strlen($name)<2 || strlen($name)>120 ||
                !is_string($pass) || strlen($pass)<12 || strlen($pass)>128) {
                fail(400,'Érvényes e-mail-cím, név és legalább 12 karakteres jelszó szükséges.');
            }
            $uuid = tokenToUuid(bin2hex(random_bytes(16)));
            $hash = password_hash($pass, defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_DEFAULT);
            $stmt = $pdo->prepare(
                "INSERT INTO zm_users(id,email,display_name,password_hash,role)
                 VALUES(?,?,?,?,'student')"
            );
            try { $stmt->execute([$uuid,$email,$name,$hash]); }
            catch (PDOException $e) {
                if ($e->getCode() === '23000') fail(409, 'Ezzel az e-mail-címmel már létezik fiók.');
                throw $e;
            }
            newSession($pdo, ['id'=>$uuid,'email'=>$email,'displayName'=>$name,'role'=>'student']);

        case 'auth/login':
            throttle('login', 20);
            $data = getPayload();
            $email = strtolower(trim($data['email'] ?? ''));
            $pass = $data['password'] ?? null;
            if (!is_string($email) || strlen($email)>254 || !is_string($pass) || strlen($pass)>128) {
                fail(400, 'Érvénytelen adatok.');
            }
            $stmt=$pdo->prepare('SELECT id,email,display_name,role,password_hash FROM zm_users WHERE email=? LIMIT 1');
            $stmt->execute([$email]);
            $row=$stmt->fetch();
            if (!$row || !password_verify($pass, $row['password_hash'])) {
                fail(401,'Hibás e-mail-cím vagy jelszó.');
            }
            newSession($pdo, ['id'=>$row['id'],'email'=>$row['email'],
                'displayName'=>$row['display_name'],'role'=>$row['role']]);

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
            answer(200,['mode'=>'fallback',
                'knowledge'=>['indexedSources'=>0,'lessonChunks'=>0,'indexedChunks'=>0]]);
        case 'chat':
            method('POST'); guardWrite($config); throttle('chat', 60);
            fail(503, 'A Zeneelmélet Tanársegéd PHP-változatának forráskeresője még nincs aktiválva.');
        default:
            fail(404,'Ismeretlen API-végpont.');
    }
} catch (Throwable $error) {
    error_log('Zeneelméleti Műhely PHP API error: ' . $error->getMessage());
    fail(503, 'A szerveroldali szolgáltatás átmenetileg nem érhető el.');
}
