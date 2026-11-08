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
    // A shared /tmp file can be owned by a previous PHP-FPM site user after
    // a CloudPanel site restore. Keep the throttle store privately under
    // this site's home, outside the public htdocs directory.
    $directory = dirname(__DIR__, 3) . '/.zeneelmelet-rate-limits';
    if (!is_dir($directory) && !@mkdir($directory, 0700) && !is_dir($directory)) {
        error_log('Zeneelmelet: cannot create private login rate-limit directory');
        fail(503, 'Nem érhető el a bejelentkezési védelem.');
    }
    $file = $directory . '/zm_limit_' . hash('sha256', $action . '|' . $ip);
    $f = @fopen($file, 'c+');
    if (!$f || !flock($f, LOCK_EX)) {
        error_log('Zeneelmelet: cannot lock private login rate-limit file');
        fail(503, 'Nem érhető el a bejelentkezési védelem.');
    }
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
    if (array_key_exists('earTrainingDailyXp', $p)) {
        if (!is_array($p['earTrainingDailyXp']) ||
            count($p['earTrainingDailyXp']) > 366) return false;
        foreach ($p['earTrainingDailyXp'] as $day => $points) {
            if (!is_string($day) || !preg_match('/^\d{4}-\d{2}-\d{2}$/D', $day) ||
                !is_int($points) || $points < 0 || $points > 100) return false;
        }
    }
    if (array_key_exists('favoriteExpressions', $p)) {
        if (!is_array($p['favoriteExpressions']) || !array_is_list($p['favoriteExpressions']) ||
            count($p['favoriteExpressions']) > 1800) return false;
        foreach ($p['favoriteExpressions'] as $id)
            if (!is_string($id) || strlen($id) > 120) return false;
    }
    if (!isset($p['quizScores']) || !is_array($p['quizScores']) ||
        count($p['quizScores']) > 500) return false;
    foreach ($p['quizScores'] as $key => $score) {
        if (strlen((string)$key) > 120 || !is_numeric($score) || $score < 0 || $score > 100) return false;
    }
    if (array_key_exists('quizAttempts',$p)) {
        if (!is_array($p['quizAttempts']) || !array_is_list($p['quizAttempts']) ||
            count($p['quizAttempts']) > 100) return false;
        foreach ($p['quizAttempts'] as $a) {
            if (!is_array($a) || array_is_list($a) ||
                !isset($a['id'],$a['chapterId'],$a['score'],$a['correct'],$a['total'],$a['at']) ||
                !is_string($a['id']) || strlen($a['id']) > 120 ||
                !is_string($a['chapterId']) || strlen($a['chapterId']) > 120 ||
                !is_numeric($a['score']) || $a['score'] < 0 || $a['score'] > 100 ||
                !is_int($a['correct']) || !is_int($a['total']) ||
                $a['total'] < 1 || $a['total'] > 1000 ||
                $a['correct'] < 0 || $a['correct'] > $a['total'] ||
                !is_string($a['at']) || strlen($a['at']) > 40 ||
                strtotime($a['at']) === false) return false;
            if (array_key_exists('durationSeconds', $a) &&
                (!is_int($a['durationSeconds']) || $a['durationSeconds'] < 0 || $a['durationSeconds'] > 36000)) {
                return false;
            }
            if (array_key_exists('wrongQuestionIds', $a)) {
                if (!is_array($a['wrongQuestionIds']) || !array_is_list($a['wrongQuestionIds']) ||
                    count($a['wrongQuestionIds']) > 12) return false;
                foreach ($a['wrongQuestionIds'] as $id) {
                    if (!is_string($id) || strlen($id) > 120) return false;
                }
            }
        }
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

    // Explicit local-only test transport. Never permit mail() fallback on production.
    if (($config['mail_transport'] ?? '') === 'local-test' &&
        ($config['app_origin'] ?? '') === 'http://localhost:8000') {
        if (!mail($email, $subject, $message, 'From: ' . $from)) {
            throw new RuntimeException('Test mail failed');
        }
        return;
    }
    if (($config['mail_transport'] ?? '') !== 'smtp') {
        fail(503, 'Nincs beállítva a hitelesített SMTP-küldés.');
    }
    $smtp = $config['smtp'] ?? [];
    if (!is_array($smtp) ||
        empty($smtp['host']) || empty($smtp['user']) || empty($smtp['password']) ||
        !is_string($smtp['host']) || !is_string($smtp['user']) ||
        !is_string($smtp['password']) ||
        (int)($smtp['port'] ?? 0) !== 465) {
        fail(503, 'Hiányos SMTP-beállítások.');
    }
    $autoload=__DIR__ . '/vendor/autoload.php';
    if (!is_readable($autoload)) {
        throw new RuntimeException('PHPMailer dependency is not deployed');
    }
    require_once $autoload;
    $mailer = new \PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mailer->isSMTP();
        $mailer->Host = $smtp['host'];
        $mailer->Port = 465;
        $mailer->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mailer->SMTPAuth = true;
        $mailer->Username = $smtp['user'];
        $mailer->Password = $smtp['password'];
        $mailer->Timeout = 12;
        $mailer->SMTPDebug = 0;
        $mailer->CharSet = 'UTF-8';
        $mailer->setFrom($from, 'Zeneelméleti Műhely');
        $mailer->addAddress($email);
        $mailer->Subject = $subject;
        $mailer->Body = $message;
        $mailer->isHTML(false);
        $mailer->send();
    } catch (\PHPMailer\PHPMailer\Exception $error) {
        throw new RuntimeException('SMTP delivery failed', 0, $error);
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
require_once __DIR__ . '/tutor-search.php';

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
    // The publicly accessible lesson search does not use student accounts or progress.
    // Do not make tutor chat/status depend on MySQL availability: an outage of the
    // separate student database must not take down the read-only learning assistant.
    $pdo = in_array($route, ['chat', 'chat/status'], true) ? null : database($config);

    if (str_starts_with($route, 'admin/')) {
        require_once __DIR__ . '/admin.php';
        adminApi($pdo, $config, $route);
    }

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
            // Never pass arbitrary JSON values to string functions: malformed
            // requests must return 400, not an uncaught TypeError/HTTP 500.
            $rawEmail = $data['email'] ?? null;
            $email = is_string($rawEmail) ? strtolower(trim($rawEmail)) : null;
            $pass = $data['password'] ?? null;
            if ($email === null || $email === '' || strlen($email)>254 ||
                !is_string($pass) || $pass === '' || strlen($pass)>128) {
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
                answer(200,[
                    'progress'=>$value===false?null:json_decode((string)$value,true),
                    'revision'=>hash('sha256',$value===false?'':(string)$value)
                ]);
            }
            if ($httpMethod !== 'PUT') { header('Allow: GET, PUT'); fail(405,'Nem támogatott kérés.'); }
            $body=getPayload();
            $progress=$body['progress'] ?? null;
            if (!progressOk($progress)) fail(400,'Érvénytelen tanulási adatok.');
            $expected=$body['revision'] ?? null;
            if (!is_string($expected) || !preg_match('/^[a-f0-9]{64}$/D',$expected)) {
                fail(428,'Az eredménymentéshez előzetes szerververzió szükséges.');
            }
            $text=json_encode($progress,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
            if (strlen($text)>64000) fail(413,'Túl nagy tanulási napló.');
            $pdo->beginTransaction();
            try {
                // Serialize first-time writes too, when no progress row exists yet.
                $lock=$pdo->prepare('SELECT id FROM zm_users WHERE id=? FOR UPDATE');
                $lock->execute([$user['id']]);
                $stmt=$pdo->prepare('SELECT progress_json FROM zm_progress WHERE user_id=? FOR UPDATE');
                $stmt->execute([$user['id']]);
                $current=$stmt->fetchColumn();
                $currentRevision=hash('sha256',$current===false?'':(string)$current);
                if (!hash_equals($currentRevision,$expected)) {
                    $pdo->rollBack();
                    answer(409,[
                        'error'=>'Másik eszközön frissebb tanulási eredmény található.',
                        'progress'=>$current===false?null:json_decode((string)$current,true),
                        'revision'=>$currentRevision
                    ]);
                }
                if ($current===false) {
                    $stmt=$pdo->prepare('INSERT INTO zm_progress(user_id,progress_json) VALUES(?,?)');
                } else {
                    $stmt=$pdo->prepare('UPDATE zm_progress SET progress_json=? WHERE user_id=?');
                }
                $stmt->execute($current===false?[$user['id'],$text]:[$text,$user['id']]);
                // MySQL JSON columns may canonicalize key order and whitespace. Always
                // hash the stored representation, not the incoming request string.
                $storedStmt=$pdo->prepare('SELECT progress_json FROM zm_progress WHERE user_id=?');
                $storedStmt->execute([$user['id']]);
                $stored=(string)$storedStmt->fetchColumn();
                $storedRevision=hash('sha256',$stored);
                $pdo->commit();
            } catch (Throwable $e) {
                if ($pdo->inTransaction()) $pdo->rollBack();
                throw $e;
            }
            answer(200,['success'=>true,'revision'=>$storedRevision]);

        case 'chat/status':
            method('GET');
            require_once __DIR__ . '/tutor-text-generation.php';
            $entries=knowledgeEntries();
            $sources=[];
            $lessons=0;
            foreach ($entries as $entry) {
                if (($entry['source'] ?? '')==='Zeneelméleti Műhely – Tananyag') $lessons++;
                else $sources[$entry['source'] ?? ''] = true;
            }
            answer(200,['mode'=>tutorTextEnabled($config) ? 'gemini' : 'fallback',
                'requiresLogin'=>tutorTextEnabled($config),
                'knowledge'=>['indexedSources'=>count($sources),
                    'lessonChunks'=>$lessons,'indexedChunks'=>count($entries),
                    'coverage'=>tutorSourceAudit($entries)]]);
        case 'chat':
            method('POST'); guardWrite($config); throttle('chat', 60);
            $data=getPayload();
            $question=$data['message'] ?? null;
            if (!is_string($question) || !trim($question) || strlen($question)>1000) fail(400,'Írj egy rövid zeneelméleti kérdést.');
            $question=trim($question);
            require_once __DIR__ . '/tutor-visuals.php';
            $previousTopic=is_string($data['previousTopic'] ?? null) ? substr($data['previousTopic'],0,1000) : '';
            // Paid image creation is never automatic for ordinary theory questions.
            // Only an explicit illustration request may invoke the external provider.
            if (tutorImageRequested($question)) {
                require_once __DIR__ . '/tutor-image-generation.php';
                if (tutorImageGenerationEnabled($config)) {
                    // Image generation remains restricted to authenticated users.
                    // Open the database only for this separate privileged feature.
                    $imageUser = requireUser(database($config));
                    throttle('tutor-image-' . $imageUser['id'], 3);
                    answer(200, generateTutorImage($config, $question, $previousTopic));
                }
                $visual = tutorImageReply($question, $previousTopic);
                if ($visual !== null && !empty($visual['visuals'])) {
                    $visual['reply'] = 'Az önálló képgenerálás még nincs bekapcsolva. Addig egy meglévő, ellenőrzött tananyagábrát mutatok, nem újonnan generált képet.';
                    answer(200,$visual);
                }
                answer(200, generateTutorImage($config, $question, $previousTopic));
            }
            require_once __DIR__ . '/creative-answers.php';
            $creativeAnswer=creativePracticeAnswer($question,knowledgeEntries());
            if ($creativeAnswer!==null) answer(200,['mode'=>'reviewed','reply'=>$creativeAnswer]);
            require_once __DIR__ . '/music-answers.php';
            $direct=musicKnownAnswer($question);
            if ($direct!==null) answer(200, ['mode'=>'reviewed','reply'=>$direct]);
            $hits=searchLessons($question, musicBriefRequested($question) ? 1 : 3);
            require_once __DIR__ . '/tutor-text-generation.php';
            if ($hits && tutorTextEnabled($config)) {
                // Paid text generation is available only to authenticated users.
                // Anonymous visitors retain the local source search without external calls.
                $tutorUser = currentUser(database($config));
                if ($tutorUser !== null) {
                    throttle('tutor-text-' . $tutorUser['id'], 15);
                    $generated = tutorTextReply($config, $question, $hits);
                    if ($generated !== null) answer(200, $generated);
                }
            }
            if (!$hits) answer(200, ['mode'=>'fallback',
                'reply'=>'Erre a kérdésre most nem találtam elég pontos magyarázatot a helyi tananyagban. Próbálj megadni egy konkrét zeneelméleti fogalmat.']);
            answer(200,['mode'=>'fallback','reply'=>lessonReply($hits, $question, musicBriefRequested($question))]);
        default:
            fail(404,'Ismeretlen API-végpont.');
    }
} catch (Throwable $error) {
    error_log('Zeneelméleti Műhely PHP API error: ' . $error->getMessage());
    fail(503, 'A szerveroldali szolgáltatás átmenetileg nem érhető el.');
}
