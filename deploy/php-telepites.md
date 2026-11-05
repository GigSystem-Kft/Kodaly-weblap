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
Linux-felhasználó olvashassa. A mintában az `invite_registration=false`;
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
5. Zárt pilothoz `invite_registration=true`, miután a meghívó- és e-mail-migrációt telepítettük.

**Az előző Node.js kód által scrypt-tel készített jelszóhash-eket a PHP password_verify
nem tudja ellenőrizni.** Ha ilyen korábbi felhasználói fiókok vannak, élesítés
előtt migráció vagy biztonságos jelszó-visszaállítás szükséges.

## Korlátok

- A PHP API támogatja a regisztrációt, bejelentkezést, kijelentkezést és a profil eredménymentését.
- A Tanársegéd PHP-kiadása a telepítőcsomagban található, lecke- és forrásrészletekből álló **helyi keresőmóddal** működik. Nem használ külső Gemini API-t és nem fogalmaz önálló AI-magyarázatot.
- E-mail-megerősítés, jelszó-visszaállítás és jelszócsere megvalósult, de valós e-mail-kézbesítéssel és éles használattal még ellenőrizni kell. Fióktörlés és végleges adatvédelmi tájékoztató még hiányzik.
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

## V003 – E-mail-cím ellenőrzése és jelszó-helyreállítás

**Telepítés előtt készíts biztonsági mentést a `zeneelmelet` adatbázisról.**
A V003 nem törli a meglévő tanulási eredményeket. A már regisztrált pilotfiókokat migrációkor ellenőrzöttnek jelöli; az ezután létrejövő új fiókok csak megerősítés után léphetnek be.

1. A `zeneelmelet` adatbázisban egyszer importáld:
   `database/V003__account_email_verification_reset.sql`.
   A script a `zm_users.email_verified_at` oszlopot és a `zm_account_tokens` táblát hozza létre.
   **Ne importáld másodszor**, mert az oszlop már létezik.
2. Töltsd fel a legújabb GitHub Actions **PHP telepítő ZIP** tartalmát a webhely gyökérkönyvtárába, felülírva a régi API-t, React indexet és a megfelelő asseteket.
3. A webhely nyilvános könyvtárán kívüli `/home/zeneelmeletadmin/zeneelmelet-private.php` fájlban a meglévő `db` és `app_origin` mellé szükséges:

   ```php
   'invite_registration' => true,
   'mail_enabled' => false,
   'mail_from' => 'noreply@zeneelmelet.digitaliskottatar.hu',
   ```

   **Először maradjon `mail_enabled=false`!** Ekkor a rendszer nem vesz fel új felhasználókat, ha nem tud megerősítő levelet küldeni.

4. A szerveradminnal egyeztesd a kimenő levelezést. A PHP API a `mail()` függvényt használja; ehhez a PHP-folyamatnak működő, megbízható és helyesen hitelesített helyi mail transport (MTA/SMTP relay) szükséges. A `mail()` sikeres visszatérése **nem bizonyítja a címzetthez történő kézbesítést**. Be kell állítani a feladó-domain SPF, DKIM és DMARC rekordjait és ellenőrizni a levél sikeres megérkezését.
5. A rendszergazda által **tesztelt** e-mail-küldés után állítsd `mail_enabled=true` értékre. Ne oszd meg a mail-/DB-jelszavakat és a tokeneket.
6. Zárt meghívós próba: új meghívó + fiók → levélben érkező megerősítés (24 óra) → bejelentkezés → „Elfelejtetted a jelszavad?” → e-mailben küldött 30 perces visszaállító link → új jelszó → bejelentkezés. A jelszócsere minden meglévő munkamenetet érvénytelenít.

**Fontos:** a meghívó továbbra is egyszer használható, az e-mail megerősítő és jelszó-visszaállító tokeneket az adatbázis csak SHA-256 lenyomatként tárolja, a linkek egyszer használhatók. A nyilvános, meghívó nélküli regisztráció továbbra sincs bekapcsolva.

A PHP CI valós MySQL 8 tesztadatbázissal és teszt e-mail-átvevővel ellenőrzi a folyamatot. Ez nem helyettesíti a valódi CloudPaneles kézbesítési próbát, a biztonsági auditot és az adatvédelmi dokumentáció elkészítését.
