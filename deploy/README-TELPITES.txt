ZENEELMÉLETI MŰHELY – FIGYELMEZTETÉS: EZ NEM AZ 1.0 ÉLES TELEPÍTŐJE
====================================================================

Ez a szöveg a Linux / Node.js 24-alapú FEJLESZTŐI, ALTERNATÍV csomaghoz tartozik.
A 2026. novemberi Zeneelméleti Műhely 1.0 kiadás CloudPanel-célkörnyezete:
statikus Vite frontend + PHP 8.4/8.5 API + MySQL/Percona.

AZ ÉLES zeneelmelet.digitaliskottatar.hu WEBHELYRE NE EZT A NODE-CSOMAGOT
TELEPÍTSD. NE indítsd a "node server.mjs" parancsot az éles PHP-telepítés
helyett, és NE állítsd át a CloudPanelt a régi 3100-as Node.js alkalmazásra.

A helyes 1.0 kiadási út:
1. GitHub Actions -> "Zeneelméleti Műhely – PHP telepítő ZIP".
2. A csak teljes elfogadás után jóváhagyott, egyetlen main commitból épített
   zeneelmeleti-muhely-php.zip és annak .sha256 ellenőrzőfájlja.
3. Az SHA-256 ellenőrzőösszeg egyezésének ellenőrzése telepítés előtt.
4. Az adatbázis, teljes webhely, privát PHP-konfiguráció és magánforrások
   WEBGYÖKÉREN ÉS SZERVEREN KÍVÜLI mentése; visszaállítás kipróbálása.
5. A telepítés előtt az éles adatbázis migrációinak felmérése; a hallgatói
   eredmények és a .well-known/ mappa megőrzése.
6. Telepítés kizárólag a deploy/php-telepites.md és
   docs/cloudpanel-telepites.md aktuális leírása alapján.
7. Valós HTTPS, PHP/MySQL, SMTP, jogosultságok, szerepkörök, két fizikai
   eszköz, szakmai/jogi és akadálymentességi A-01–A-24 elfogadás.

Az 1.0 publikálása jelenleg NEM JÓVÁHAGYOTT:
- PR #2: https://github.com/GigSystem-Kft/Kodaly-weblap/pull/2
- Éles elfogadási stopkapu: https://github.com/GigSystem-Kft/Kodaly-weblap/issues/3
- 24 pontos audit: docs/kiadas-elotti-elfogadas-24-pont-2026-11-09.md

A Linux Node.js csomag kizárólag izolált fejlesztői teszthez tartható meg.
A fejlesztői futtatás nem bizonyítja az éles PHP-kiadás alkalmasságát.
Ne helyezz titkokat, környezeti változókat vagy valódi adatbázismentést
publikus webgyökérbe, ZIP-be vagy a GitHub-repositoryba.
