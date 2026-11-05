<?php
declare(strict_types=1);

/** Only signed-in database admins may access any admin route. */
function requireAdmin(PDO $pdo): array {
    $user = requireUser($pdo);
    if (($user['role'] ?? '') !== 'admin') fail(403, 'Nincs adminisztrátori jogosultságod.');
    return $user;
}
function adminApi(PDO $pdo, array $config, string $route): never {
    $admin = requireAdmin($pdo);
    if ($route === 'admin/users') {
        method('GET');
        $q = trim((string)($_GET['q'] ?? ''));
        if (strlen($q) > 120) fail(400, 'Túl hosszú keresés.');
        $stmt=$pdo->prepare(
            'SELECT id,email,display_name,role,created_at,email_verified_at FROM zm_users
             WHERE email LIKE ? OR display_name LIKE ? ORDER BY created_at DESC LIMIT 100'
        );
        $needle='%'.str_replace(['%', '_', '\\'], ['\\%', '\\_', '\\\\'], $q).'%';
        $stmt->execute([$needle,$needle]);
        answer(200,['users'=>$stmt->fetchAll()]);
    }
    if ($route === 'admin/invitations') {
        method('GET');
        $rows=$pdo->query(
            "SELECT LEFT(token_hash,12) AS id,email,created_at,expires_at,used_at
             FROM zm_invitations ORDER BY created_at DESC LIMIT 100"
        )->fetchAll();
        answer(200,['invitations'=>$rows]);
    }
    method('POST');
    guardWrite($config);
    throttle('admin-write', 80);
    $body=getPayload();
    if ($route === 'admin/invite') {
        $email=is_string($body['email'] ?? null) ? strtolower(trim($body['email'])) : '';
        if (strlen($email)>254 || !filter_var($email,FILTER_VALIDATE_EMAIL)) fail(400,'Érvénytelen e-mail-cím.');
        if (($config['mail_enabled'] ?? false)!==true) fail(503,'A levelezés nincs engedélyezve.');
        $exists=$pdo->prepare('SELECT id FROM zm_users WHERE email=? LIMIT 1');
        $exists->execute([$email]);
        if ($exists->fetch()) fail(409,'Ehhez az e-mail-címhez már tartozik fiók.');
        $token=bin2hex(random_bytes(32));
        $hash=hash('sha256',$token);
        $pdo->beginTransaction();
        try {
            $delete=$pdo->prepare('DELETE FROM zm_invitations WHERE email=? AND used_at IS NULL');
            $delete->execute([$email]);
            $stmt=$pdo->prepare('INSERT INTO zm_invitations(token_hash,email,expires_at)
                VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 7 DAY))');
            $stmt->execute([$hash,$email]);
            $url=($config['app_origin'] ?? '') . '/';
            sendAccountMail($config,$email,'Zeneelméleti Műhely – Meghívó',
                "Meghívást kaptál a Zeneelméleti Műhelybe.\n\n" .
                "Nyisd meg a weboldalt: " . $url . "\n" .
                "A Profil → Regisztráció lapon add meg ezt az egyszer használható meghívókódot:\n" .
                $token . "\n\nA kód 7 napig érvényes, és kizárólag ehhez az e-mail-címhez tartozik.\n");
            $pdo->commit();
        } catch (Throwable $error) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            throw $error;
        }
        answer(201,['success'=>true,'message'=>'A meghívó e-mail elküldését a levelezőszerver elfogadta.']);
    }
    if ($route === 'admin/revoke-invite') {
        $id=$body['id'] ?? null;
        if (!is_string($id) || !preg_match('/^[a-f0-9]{12}$/D',$id)) fail(400,'Érvénytelen meghívóazonosító.');
        $stmt=$pdo->prepare('DELETE FROM zm_invitations WHERE LEFT(token_hash,12)=? AND used_at IS NULL');
        $stmt->execute([$id]);
        answer(200,['success'=>true,'revoked'=>$stmt->rowCount()>0]);
    }
    if ($route === 'admin/set-role') {
        $userId=$body['userId'] ?? null;
        $role=$body['role'] ?? null;
        if (!is_string($userId) || !preg_match('/^[a-f0-9-]{36}$/D',$userId) ||
            !in_array($role,['student','teacher'],true)) {
            fail(400,'Érvénytelen felhasználó vagy szerepkör.');
        }
        if (hash_equals($admin['id'],$userId)) fail(403,'A saját szerepköröd itt nem módosítható.');
        $stmt=$pdo->prepare("UPDATE zm_users SET role=? WHERE id=? AND role IN ('student','teacher')");
        $stmt->execute([$role,$userId]);
        if ($stmt->rowCount()===0) {
            $check=$pdo->prepare('SELECT role FROM zm_users WHERE id=?');
            $check->execute([$userId]);
            if ($check->fetchColumn()===false) fail(404,'A felhasználó nem található.');
        }
        answer(200,['success'=>true]);
    }
    fail(404,'Ismeretlen adminisztrációs végpont.');
}
