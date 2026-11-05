<?php
// Ezt a mintát töltsd ki CSAK a szerveren, és mentsd ide:
// /home/zeneelmeletadmin/zeneelmelet-private.php
// NEM a webhely htdocs könyvtárába!
// PHP 8.4/8.5 + pdo_mysql szükséges.
return [
    'app_origin' => 'https://zeneelmelet.digitaliskottatar.hu',
    // Csak zárt teszteléshez állítsd true-ra; jelenleg nincs e-mail ellenőrzés.
    'allow_registration' => false,
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'name' => 'zeneelmelet',
        'user' => 'zeneelmelet',
        'password' => 'CSERELD_A_SAJAT_JELSZODRA',
    ],
];
