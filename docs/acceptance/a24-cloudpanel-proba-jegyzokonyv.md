# A-24 – CloudPanel elfogadási próba jegyzőkönyve

**Állapot: NEM FUTTATOTT. Ez egy kitöltendő sablon, nem szerverellenőrzési jelentés.**

A vizsgált rendszer: `https://zeneelmelet.digitaliskottatar.hu` (PHP + MySQL). A jelen dokumentumot csak az üzemeltető töltheti ki valós, biztonságosan elvégzett próbák alapján. Bizalmas adatok és mentések nem kerülhetnek a GitHubra.

## 1. Vizsgálati adatok (kitöltendő)

| Mező | Kitöltendő |
|---|---|
| Vizsgálat időpontja | NINCS MÉG |
| Üzemeltető / ellenőrző szerepe | NINCS MÉG |
| Környezet | Próbaszerver / éles, jelöld |
| Git teljes 40 karakteres SHA | NINCS MÉG |
| ZIP SHA-256 ellenőrzés | NOT RUN |
| Előzetes adatmegőrzési jóváhagyás | NOT RUN |
| Záró döntés | BLOCKED |

## 2. STOP: mentés és helyreállíthatóság

- [ ] Azonosították a **valós**, aktuális webgyökeret, az adatbázist, a PHP-verziót és az alkalmazott migrációkat; nem hagyatkoztak csupán az útmutatóban szereplő példaútvonalra.
- [ ] A webhely minden állománya mentve van a webgyökéren kívül, különösen az `index.html`, `api/`, `assets/`, `.well-known/` megőrzésével.
- [ ] A MySQL-t teljes és visszaolvasható mentés rögzíti (a tanulói eredményekkel együtt).
- [ ] A privát PHP-konfiguráció és az esetleges privát AI-források külön mentése is megvan.
- [ ] A teljes mentésből szerveren kívüli másolat készült; **a helyét és hozzáférését nem tesszük nyilvánossá**.
- [ ] Elkülönített próbakörnyezetben a visszaállítás **ténylegesen sikerült**, adat- és alkalmazáskonzisztencia ellenőrzéssel.
- [ ] A rollback lépései és felelősei dokumentáltak; a próba nem írt felül éles adatokat.

**Ha bármelyik mentési elem hiányzik: STOP. Ne telepíts, ne indíts migrációt.**

## 3. Verzió és kiszolgáló-ellenőrzés (csak mentés után)

- [ ] A vizsgált ZIP-et és `.sha256` társát ugyanahhoz a Git-commit SHA-hoz kötötték.
- [ ] A telepítő sértetlensége ellenőrzött, teljes, és nem keveredik korábbi feltöltéssel.
- [ ] A `release-build.json`, az `index.html` és az `api/release-build.php` buildazonosítója egyezik.
- [ ] A próbakörnyezet `/api/index.php?route=health` válasza megfelelő, `auth/status` pedig helyesen jelzi a meghívásos belépést és az adatbázist.
- [ ] Megbízható kliensről lefutott a **csak olvasó** előellenőrzés: `python3 scripts/check-live-php-release.py --expected-sha TELJES_40_KARAKTERES_SHA`.
- [ ] Az előellenőrzésben a kezdőoldal, a nyilvánosan betöltött JS/CSS fájlok SHA-256 és MIME-típus ellenőrzése megfelelő.
- [ ] Bejelentkezett admin `auth/deployment-check` eredménye: `scanComplete=true`, `buildConsistent=true`, `ready=true`.
- [ ] Privát konfiguráció, mentések és privát források nem elérhetők URL-lel; jogosultságuk minimális.
- [ ] A TLS/HTTPS helyes, az átirányítások és biztonsági beállítások a próbán megfelelnek.
- [ ] A tényleges `admin/source-coverage` indexlefedettség és az admin-forrásállapot meg lett vizsgálva.

**Figyelem:** a nyilvános előellenőrzés nem képes a privát PHP-fájlok tényleges bytejait, az adatmegőrzést, az SMTP-t vagy a felhasználói jogokat igazolni. Az adminvizsgálat és a külön kézi teszt szükséges.

## 4. SMTP / fiók / regresszió (csak eldobható tesztfiókokkal)

- [ ] Meghívó, tényleges Rackhost címzetti levél, belépés, jelszó-visszaállítás sikeres.
- [ ] Tanár/hallgató/admin jogosultságok és tiltott hozzáférések tesztelve.
- [ ] Két külön fizikai eszközön azonos fiók, offline/online és 409 ütközéses próba sikeres.
- [ ] Meglévő tanulói eredmények próba előtt és után megmaradtak.
- [ ] Fióktörlés csak ideiglenes, célzott tesztfiókon történt.

## 5. Nem titkos elfogadási napló (kitöltendő)

| Próba | Állapot | Dátum | Ellenőrző szerepe | Bizonyítékazonosító |
|---|---|---|---|---|
| Teljes mentés és offsite | NOT RUN | – | – | – |
| Elkülönített helyreállítás | NOT RUN | – | – | – |
| ZIP/hash és verzióazonosság | NOT RUN | – | – | – |
| Nyilvános PHP/HTML/JS/CSS preflight | NOT RUN | – | – | – |
| Auth admin deployment-check | NOT RUN | – | – | – |
| SMTP és szerepkörök | NOT RUN | – | – | – |
| Két valódi eszköz, adatmegőrzés | NOT RUN | – | – | – |

**PASS csak** ténylegesen elvégzett, dátummal és biztonságos bizonyítékazonosítóval ellátott vizsgálat után adható. A #3 issue A-24 jelölőnégyzete addig nem változhat. Bármilyen hibás próbához külön hibajegy és megismételt ellenőrzés kell.

A végleges kiadás további feltétele: A-15 jogok, A-20 szakmai lektorálás, A-23 hozzáférhetőség és minden további A-01–A-24 pont igazolása.
