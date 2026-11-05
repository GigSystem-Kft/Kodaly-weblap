# Zeneelméleti Műhely – PHP telepítés CloudPanelben

## Elkészült kiszolgáló

- React + Vite frontend, kizárólag statikus fájlként publikálva
- PHP 8.4/8.5 backend a `/api/index.php?route=...` címen
- Percona/MySQL 8, meglévő `zm_users`, `zm_sessions`, `zm_progress` táblák
- CloudPanel generikus PHP webhely: `zeneelmelet.digitaliskottatar.hu`
- Éles gépen **nem kell Node.js / Docker / SSH** a futtatáshoz
- Regisztráció alapesetben zárva; a meghívásos pilotot külön kell aktiválni.

## 1. GitHub Actions ZIP

A `php-release.yml` GitHub Actions workflow Ubuntu alatt építi meg a weboldalt:
`npm install`, `npm test`, `npm run lint`, `VITE_PHP_API=1 npm run build`;
majd a lefordított `dist/` tartalmát és a `php/api/index.php` fájlt egy ZIP-be gyűjti.

Az eredmény neve: `zeneelmeleti-muhely-php.zip`. GitHub Actions Artifacts alatt
a ZIP külön ZIP csomagolásban is megjelenhet: előbb csomagold ki a letöltött
Actions csomagot, majd a benne lévő telepítési ZIP-et töltsd fel.

## 2. Feltöltés

CloudPanel → Webhelyek → `zeneelmelet.digitaliskottatar.hu` → Fájlkezelő.

Cél: **a webhely gyökérkönyvtára**, amelyben a `.well-known/` mappa van.

A ZIP felépítése:
```
index.html
assets/
api/index.php
api/knowledge.php
...```

A ZIP-et ebbe a gyökérkönyvtárba bontsd ki. **NE** egy új `zeneelmeleti-muhely-php/`
alkönyvtárban hagyd. A `.well-known/` mappát és a SSL-tanúsítványt őrizd meg.

## 3. Bizalmas adatbázis-konfiguráció

A webhely-felhasználó a képernyőképek szerint `zeneelmeletadmin`.
Hozd létre a config fájlt a felhasználó saját mappájában, **nem a htdocs alatt**:

```
/home/zeneelmeletadmin/zeneelmelet-private.php
```

A mintát a `deploy/zeneelmelet-private.example.php` fájl tartalmazza.
Állítsd be a valódi DB jelszót, és ügyelj arra, hogy csak a megfelelő
Linux-felhasználó olvashassa. A mintában a `allow_registration=false`;
így a webhely az első telepítéskor nem vesz fel nyilvános hallgatókat.

A PHP `pdo_mysql`, `json`, `openssl` és `password_hash` funkciókat
használja; PHP 8.4/8.5 alatt ellenőrizendők. A webhelynek a valódi DB eléréséhez
jogosultságokkal kell rendelkeznie.

**NE** töltsd a valós konfigurációt a webhely gyökerébe, GitHubra vagy csevegésbe.

## 4. Tesztelés

1. `https://zeneelmelet.digitaliskottatar.hu/` – tananyag és teljes UI
2. `https://zeneelmelet.digitaliskottatar.hu/api/index.php?route=health` – egészségellenőrzés
3. `https://zeneelmelet.digitaliskottatar.hu/api/index.php?route=auth/status` – elérhető adatbázis; `available: true`
4. Profil oldal: zárt regisztráció; bejelentkezés csak már létező fiókkal.
5. Zárt pilotban `allow_registration=true`, próbafiók és különböző eszközök közti haladás tesztje, majd visszaállítás false-ra.

**Az előző Node.js kód által scrypt-tel készített jelszóhash-eket a PHP password_verify
nem tudja ellenőrizni.** Ha ilyen korábbi felhasználói fiókok vannak, élesítés
előtt migráció vagy biztonságos jelszó-visszaállítás szükséges.

## Korlátok

- A PHP API támogatja a regisztrációt, bejelentkezést, kijelentkezést és a profil eredménymentését.
- A Tanársegéd PHP-kiadása a telepítőcsomagban található, lecke- és forrásrészletekből álló **helyi keresőmóddal** működik. Nem használ külső Gemini API-t és nem fogalmaz önálló AI-magyarázatot.
- Nincs még tényleges e-mail-cím ellenőrzés (a meghívó megadott e-mail-címhez kötődik, de nem bizonyítja annak birtoklását), jelszó-visszaállítás, fiókadat-törlés, adatvédelmi tájékoztató.
- Az IP-alapú belépésvédelem a PHP szerver ideiglenes könyvtárát használja, nagy forgalomnál nem helyettesíti a központi rate limitet.
- **Nyilvános regisztráció ne induljon az üzemeltetési és adatvédelmi ellenőrzésekig.**

## Meghívásos regisztráció (új kiadás)

A már működő `zeneelmelet` adatbázist **nem kell törölni vagy újratelepíteni**.

1. phpMyAdmin → `zeneelmelet` adatbázis → Importálás: `database/V002__one_time_invitations.sql`. Ezzel létrejön a `zm_invitations` tábla, a korábbi három tábla változatlan marad.
2. A Macen, a projekt könyvtárában egyetlen címzettnek generálj meghívót:

   ```bash
   node scripts/create-invitation.mjs cimzett@pelda.hu
   ```

   A parancs megjelenít egy **titkos kódot** és egy **SQL INSERT** utasítást. Az utóbbit futtasd a megfelelő adatbázis phpMyAdmin SQL lapján. A kódot biztonságos csatornán add át a címzettnek, és ne küldd ide a beszélgetésbe.
3. A privát `/home/zeneelmeletadmin/zeneelmelet-private.php` konfigurációba írd be:

   ```php
   'invite_registration' => true,
   ```

   A régi `allow_registration` opciót a PHP API már **nem használja**; ezt törölheted.
4. Töltsd fel a **legfrissebb PHP telepítő ZIP** tartalmát a webhely gyökérkönyvtárába; őrizd meg a `.well-known` mappát. Ne töltsd fel a privát konfigurációt a webhely alá.
5. A Profil oldalon megjelenik a **Meghívókód** mező. Az új hallgatónak ugyanazt az e-mail-címet kell megadnia, amelyhez a meghívót létrehoztad.
6. Ellenőrizd, hogy ugyanaz a kód második regisztrációra már nem használható. Próbáld ki a bejelentkezést, a kvízeredmény szerveroldali mentését és az újra bejelentkezés utáni visszatöltést.

**Biztonság:** csak a kód SHA-256 hash-e szerepel a MySQL-ben; a nyers meghívó nem. A kód 32 bájt kriptográfiai véletlenből készül, 64 hexadecimális karakter hosszú; 7 napig érvényes, és adatbázis-tranzakcióban pontosan egyszer használható. A meghívó nem helyettesíti a tényleges e-mail megerősítését. Nyilvános regisztráció továbbra sincs.

**Régi jelszavak:** a korábbi Node.js scrypt-hash nem kompatibilis a PHP Argon2id ellenőrzésével. A régi fiókokhoz külön migráció/jelszó-visszaállítás szükséges.
