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
    // Csak akkor aktiváld, ha az admin igazolta a PHP mail() kézbesítését.
    'mail_enabled' => false,
    'mail_from' => 'noreply@zeneelmelet.digitaliskottatar.hu',
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'name' => 'zeneelmelet',
        'user' => 'zeneelmelet',
        'password' => 'CSERELD_A_SAJAT_JELSZODRA',
    ],
];
