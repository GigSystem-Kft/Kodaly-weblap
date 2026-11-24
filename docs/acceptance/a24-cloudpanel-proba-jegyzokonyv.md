# A-24 – CloudPanel elfogadási próba jegyzőkönyve

**Állapot: RÉSZBEN TULAJDONOS ÁLTAL VISSZAIGAZOLT, TELJES A-24: BLOCKED.** Ez a próbalap nem hitelesített éles szerverellenőrzési jelentés; a korábbi 2026-11-23-i tulajdonosi mentési és próbavisszaállítási eredményeket külön, tényleges bizonyítékként kezeli, a hiányzó metaadatokat nem találja ki.

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
| Teljes mentés | TULAJDONOSI VISSZAIGAZOLÁS – részpróba; offsite nem bizonyított | 2026-11-23 | projektgazda | docs/acceptance/a24-cache-http-proba-2026-11-23.md |
| Próbavisszaállítás | TULAJDONOSI VISSZAIGAZOLÁS – részpróba; elkülönített tesztkörnyezet és konzisztencia metaadata hiányzik | 2026-11-23 | projektgazda | docs/acceptance/a24-cache-http-proba-2026-11-23.md |
| ZIP/hash és verzióazonosság | NOT RUN | – | – | – |
| Nyilvános PHP/HTML/JS/CSS preflight | NOT RUN | – | – | – |
| Auth admin deployment-check | NOT RUN | – | – | – |
| SMTP és szerepkörök | NOT RUN | – | – | – |
| Két valódi eszköz, adatmegőrzés | TULAJDONOSI PASS részpróba – két külön kedvenc megmaradt; HTTP 409 és SHA hiányzik | 2026-11-23 | projektgazda | docs/acceptance/a06-keteszkoz-konfliktus-proba-2026-11-23.md |

**A részpróba visszaigazolása nem formális PASS.** A teljes A-24-hez továbbra is a végső SHA, az admin `scanComplete/buildConsistent/ready` értékei, a ZIP-hash, a helyreállítási metaadat és a többi kiadási kapu ellenőrzése szükséges. **PASS csak** ténylegesen elvégzett, dátummal és biztonságos bizonyítékazonosítóval ellátott teljes vizsgálat után adható. A #3 issue A-24 jelölőnégyzete addig nem változhat. Bármilyen hibás próbához külön hibajegy és megismételt ellenőrzés kell.

A végleges kiadás további feltétele: A-15 jogok, A-20 szakmai lektorálás, A-23 hozzáférhetőség és minden további A-01–A-24 pont igazolása.

## 2026-11-24 – adminisztrátori képernyőkép: a jelenlegi éles verzió ellenőrzése

A projektgazda a `https://zeneelmelet.digitaliskottatar.hu/` weboldal **Felhasználók és meghívók → Telepítés és fájlok ellenőrzése** részéről Chrome-képernyőképet küldött. Az abban ténylegesen látható, **jelenleg telepített** változat adatai:

| Képernyőképen látható mező | Megfigyelés |
|---|---|
| Ellenőrzött közös Git-verzió | `644914afdfae` (12 karakteres megjelenítés; a teljes 40 karaktert a kép önmagában nem igazolja) |
| Fájlok és belépési állományok | Zöld: jelen vannak; a nyilvános fájlfák ellenőrzése teljes |
| Átvizsgált fájl- és mappabejegyzések | 529 |
| Kizárt könyvtár | `.cache` – narancssárga figyelmeztetés; a tartalma nem került átvizsgálásra |
| SMTP-konfiguráció | Beállítva, de a képernyő maga kimondja: kézbesítés nincs itt tesztelve |
| Megjelenített ellenőrzési időpont | `2026-11-24T08:30:53+00:00` |
| Bizonyíték | Projektgazda által a 2026-11-24-i projektbeszélgetésben beküldött admin-képernyőkép; a képet nem tölthetjük automatikusan GitHubra |

**Következtetés kizárólag a kép alapján:** a régebbi, éles `644914afdfae` verzióban a nyilvános fájlvizsgálat sikeresnek látszik, és a buildazonosítót közösnek jelzi; a `.cache` kizárást külön figyelmeztetésként mutatja. Az adminfelület zöld mondatából **nem következik** automatikusan a `ready=true` nyers JSON-mező vagy a tényleges e-mail-kézbesítés igazolása. Az új fejlesztési kiadásjelölt **nem került éles telepítésre** ebben a munkaszakaszban; nem állítjuk, hogy `1911cd158c754df76ce3c6e6ec253b8e8f12ca63` éles tesztje megtörtént.

**Kiadási döntés:** régi éles verzió adminfelületi **részpróbája megfigyelve**; új kiadásjelölt A-24 formális státusza továbbra is **BLOCKED**. Nem kell újra kérni ugyanezt a képernyőképet, és nincs indok az éles szerver, a `.cache` vagy a felhasználói adatok változtatására.

## 2026-11-24 – szerveren kívüli mentés projektgazdai megerősítése

A projektgazda a kifejezetten feltett kérdésre: **„A weboldal és az adatbázis korábban elkészített biztonsági mentéséből van szerveren kívül is megőrzött példány?”** ezt válaszolta: **„Igen, van szerveren kívüli biztonsági mentésem. Folytasd a kiadási ellenőrzést.”**

**Eredmény:** a weboldal- és adatbázis-mentés **léte**, a korábban elvégzett **próbavisszaállítás**, valamint a **szerveren kívüli példány megléte projektgazdai közlés alapján visszaigazolt**. Ezek újabb megismétlése a puszta dokumentáció kedvéért nem szükséges; mentési helyet, jogosultságot, tartalmat vagy személyes adatot nem rögzítünk nyilvánosan.

**Amit ez nem igazol önmagában:** a legutolsó mentés keletkezési időpontja, teljes állomány-/adatbázis-lefedettsége, a külön tárolt PHP-privát konfiguráció és AI-forrásállományok tényleges leltára, a próbavisszaállítás célkörnyezete és adatintegritási kontrollja, valamint az új `b9aa5f3c5cdf07d89bb15781d2f3f35ef27ec5ad` build feltöltési hash-egyezése. Ezeket nem találjuk ki, és a fenti tulajdonosi tényeket nem változtatjuk teljes A-24 `PASS`-ra.

**Kiadási műszaki CI:** a `b9aa5f3c5cdf07d89bb15781d2f3f35ef27ec5ad` commit Chromium `45394378012`, PHP ZIP `45394377971` és Linux `45394377868` workflow-ja sikeres. A PHP ZIP-folyamatban az archívum megépítése, kibontási/fájlútvonal-/SHA-ellenőrzése és a külön SHA-256 checksum publikálása sikeres. Ez **GitHub CI-bizonyíték**, nem új éles telepítés.

**Következő A-24 zárási kapu:** a végső csomag pontos Git SHA-ja és tényleges telepítési ellenőrzése (`scanComplete`, `buildConsistent`, `ready`) csak a kiadási felhatalmazás és a teljes elfogadási kapu lezárása után. A projektgazda kérésére a régi `teszt.zeneelmelet.digitaliskottatar.hu` tesztaldomain újbóli ellenőrzése **nem része a teendőknek**. Formális A-24: **BLOCKED**.
