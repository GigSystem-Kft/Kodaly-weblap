<?php
// Ezt a mintát töltsd ki CSAK a szerveren, és mentsd ide:
// /home/zeneelmeletadmin/zeneelmelet-private.php
// NEM a webhely htdocs könyvtárába!
// PHP 8.4/8.5 + pdo_mysql szükséges.
return [
    'app_origin' => 'https://zeneelmelet.digitaliskottatar.hu',
    // A regisztrációhoz adatbázisban tárolt, e-mailhez kötött, egyszeri meghívó kell.
    // Csak a V002 SQL migráció importálása után engedélyezd.
    'invite_registration' => false,
    // Csak akkor aktiváld, ha az admin igazolta a hitelesített SMTP kézbesítését.
    'mail_enabled' => false,
    'mail_from' => 'noreply@digitaliskottatar.hu',
    'mail_transport' => 'smtp',
    'smtp' => [
        'host' => 'smtp.rackhost.hu',
        'port' => 465,
        'user' => 'noreply@digitaliskottatar.hu',
        'password' => 'MAILBOX_PASSWORD_HERE',
    ],
    // Opcionális, külön fizetős képgenerálás: csak akkor kapcsold be,
    // ha a Google AI Studio API-számlázás és a havi költségkeret be van állítva.
    // Az API-kulcs sosem kerül a nyilvános webgyökérbe.
    'tutor_image_generation' => [
        'enabled' => false,
        'model' => 'gemini-2.5-flash-image',
        'api_key' => 'IDE_IRD_A_GEMINI_API_KULCSOT',
    ],
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'name' => 'zeneelmelet',
        'user' => 'zeneelmelet',
        'password' => 'CSERELD_A_SAJAT_JELSZODRA',
    ],
];
