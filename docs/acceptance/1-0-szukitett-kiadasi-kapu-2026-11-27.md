# Zeneelméleti Műhely 1.0 – szűkített kiadási kapu (2026-11-27)

**Projektgazdai döntés:** csak a valóban szükséges tesztek maradjanak; a fejlesztés célja a végleges kiadás, nem a folyamatos ellenőrzésbővítés.

## Innentől az 1.0 kiadási szabálya

A korábbi **24 pontos auditnapló mind a 24 sora megmarad**, de nem jelent 24 külön új tesztkört. A PR #2 emberi kiadási kapuja **hat kritikus pontra** szűkül, mindegyikhez hiteles és biztonságos bizonyíték szükséges:

| Kötelező kapu | Lehető legrövidebb elegendő igazolás | Meglévő bizonyíték / tényleges hiány |
|---|---|---|
| **A-15 – szerzői jog és AI-indexelés** | Projektgazdai/jogosulti, az aktuálisan kiadott művekre érvényes jogalap ellenőrzése és privát bizonyítékazonosító; engedély nélküli mű ne kerüljön a ZIP-be | Jogok rendezését a projektgazda korábban jelezte; a kiadás 403 médiát és 81 PHP-forráscsoportot leltároz. A privát engedély- és indexelési bizonyítékoknak az aktuális csomaghoz való hozzárendelése még nincs igazolva |
| **A-20 – zenei szakmai helyesség** | Már elfogadott hangköz-, moll-, ritmus-, kotta- és Tanársegéd-minták dokumentált összegzése, egy célzott független szakmai jóváhagyás; feltárt lényegi hiba = STOP | Több projektgazdai minta és 439 kérdés technikai válaszkulcs-egyezése ellenőrizve. **Nem kell újra egyenként megoldani mind a 439 kérdést**; a teljes független szakmai jóváhagyás még hiányzik |
| **A-06 – eredménymegőrzés két eszközön** | Korábbi PC–telefon teszt és a szerveres 409 adatütközés-technikai teszt összekötése; új próba csak ténylegesen módosult adatmentés/szinkronkód vagy hiba esetén | Projektgazda visszajelzése és CI-bizonyíték megvan, közös elfogadási rekord még nincs lezárva |
| **A-21 – hozzáférés és e-mail** | Korábbi valós Rackhost-levél, tanári/hallgatói jogosultság és sikeres PHP/MySQL tesztek felhasználása; végső verzión csak egy nem destruktív belépési/jogosultsági ellenőrzés | Az e-mailtesztet és szerepköröket projektgazda sikeresnek jelezte; nem kérünk új tesztfióktörlést vagy ismételt teljes meghívási sorozatot |
| **A-23 – alapvető hozzáférhetőség** | Korábban kipróbált 200% zoom, kontraszt, billentyűzet, képernyőolvasó és mobil visszajelzés elfogadása, amennyiben a releváns felület nem változott | Projektgazda sikeres próbákat jelzett; ha a kiadásjelölt ezekben nem változott, **nem kell újratesztelni** |
| **A-24 – biztonságos, adatmegőrző telepítés** | Már igazolt offsite mentés és helyreállítás; **egyetlen végső kiadásjelölt SHA/ZIP-ellenőrzés, olvasó preflight és admin `scanComplete/buildConsistent/ready`**; meglévő tanulói adatok megmaradnak | Korábbi mentés/helyreállítás projektgazdailag jelzett; 403 média SHA-256 integritás a CI-ben zöld; az aktuális csomag tényleges éles adminellenőrzése és adatmegőrzés még hiányzik |

### További kötelező műszaki feltétel
Az **azonos, befagyasztott forrás SHA**-ra a már meglévő három GitHub-munkafolyamatnak sikeresnek kell lennie: Chromium, PHP/MySQL/ZIP, Linux. A ZIP-nek saját SHA-256 ellenőrzőösszege van. **Nem írunk új teszteket kizárólag a lefedettség növelése érdekében.** Kritikus hibajavítás után csak az érintett ellenpróba és a meglévő végső CI szükséges.

### Mit jelent a 24 pontos napló ezután?
- A **hat kritikus pont PASS-ja** az 1.0 kiadás feltétele. Ezekből egyik sem teljesíthető pusztán zöld CI vagy feltételezett jóváhagyás alapján.
- A többi **18 auditpontnál** a már meglévő technikai/projektgazdai bizonyítékok újrahasználhatók. A `NOT_RUN` státusz **nem jelent automatikus hibát**, és önmagában nem követel ismételt tesztkört.
- **Bármely A-01–A-24 tételnél a valódi `FAIL` továbbra is kiadásblokkoló.** Ismeretlen/hiányzó auditpont és hamis vagy hiányzó `PASS`-bizonyíték szintén hibás napló.
- A régi, részletes **24/24 teljes audit** az opcionális `python3 scripts/check-acceptance-ledger.py --scope full` ellenőrzéssel továbbra is elérhető. A kiadási minimálkapu a `--scope minimum`.
- **Egyetlen PASS-t sem jelöltünk át automatikusan.** A korábbi tulajdonosi „rendben” jelentésekből csak az egyértelműen igazolt részpróbákat használjuk fel; hiányzó dátumot, SHA-t vagy privát jogi bizonyítékot nem találunk ki.

### Kiadási sorrend – további funkcióbővítés nélkül
1. PR #2 kód befagyasztása, célzott hibák rendezése, három meglévő technikai CI ellenőrzése **ugyanazon SHA-n**.
2. A-15/A-20 meglévő igazolások rövid, hiteles összerendezése; A-06/A-21/A-23 projektgazdai sikeres próbák elfogadási rekordba emelése, újrapróba nélkül, amennyiben az érintett kód nem változott.
3. A-24 biztonságos telepítési művelet **csak megfelelő mentéssel**, az aktuális kiadás SHA-jának és admin `ready=true` jelzésének ellenőrzése, adatok változatlansága.
4. Ha mind a hat kritikus pont PASS, nincs ismert FAIL, a három CI zöld, és a PR már nem Draft: review, `main` merge, végső build és kiadási csomag.

**Mostani döntés:** STOP a végleges kiadásra; a meglévő éles oldal és `main` változatlan. A jelen dokumentum a 2026-11-27-i scope-módosításban felülírja a 2026-11-09/12-i elvárást, hogy **minden** auditponthoz új, önálló 1.0-s manuális tesztet kelljen elvégezni. A jogi, szakmai, biztonsági és adatvédelmi feltételeket viszont nem lazítja.

## 2026-11-27 – kétlépcsős kiadási kapu: ne kelljen kétszer élesíteni

**Miért kell?** A GitHub pull request ellenőrzésekor a PHP ZIP egy ideiglenes `refs/pull/2/merge` Git-commitból készül; ez **nem azonos** a PR fejlesztési ágának SHA-jával, és a végleges `main` összevonás commitja is különbözhet. Így a PR ZIP-nek az éles szerverre töltése csak a korai kiadási kapu megkerülése vagy a későbbi második telepítés árán működne. A megoldás egyetlen, **végleges main-verzió** feltöltése.

1. **PR előtti emberi és műszaki kapu:** `python3 scripts/check-acceptance-ledger.py --scope premerge`. Az A-06/A-15/A-20/A-21/A-23 öt kötelező sorának tényleges `PASS` státuszú, biztonságos bizonyítéka kell, és A-24-nek `READY_TO_DEPLOY` státuszban kell igazolnia, hogy **a jelenlegi valós MySQL + teljes webhely + privát beállítások + privát tanársegéd-források ellenőrzött mentése, offsite példánya, helyreállíthatósága, adatmegőrző telepítési és visszagörgetési terve** megvan. A nem kritikus 18 sort megtartjuk, bármely valódi `FAIL` megállítja a folyamatot. A-24 `READY_TO_DEPLOY` csak ellenőrző szereppel, dátummal, teljes 40 karakteres jelölt SHA-val, privát bizonyíték azonosítójával és megjegyzéssel engedhető át. **Nem jelenti, hogy az éles kiadás megtörtént.**
2. A PR #2 akkor vehető ki a Draft állapotból, ha a fenti előzetes kapu, a GitHub issue hat emberi jóváhagyási jelölése, a kódreview és a három műszaki CI rendben van. Ezután a jóváhagyott PR összevonható `main`-be; **még nem publikáljuk késznek**.
3. **Végső csomag:** a `main` új, pontos Git SHA-jához tartozó sikeres `php-release.yml` workflow teljes ZIP-jét és ugyanabból a munkafolyamatból származó `.zip.sha256` társát kell használni; a PR alatti ideiglenes merge-verzió ZIP-je nem éles telepítő. A Linux/Node csomag nem az éles PHP-célkörnyezethez való. Újabb kódfagyasztás után három egyező teszteredmény kell.
4. **Egyetlen fődomaines, adatmegőrző feltöltés:** csak a valódi üzemeltető, az ellenőrzött backup mellett. Sem MySQL-adatbázist, sem tanulói eredményt, sem privát konfigurációt nem szabad felülírni vagy újratelepíteni; a webgyökér és `.well-known/` megtartandó. Hiba esetén STOP, azonosított visszaállítási terv.
5. **Éles utóellenőrzés:** a végső teljes `main` SHA a publikus release manifestben és HTML-ben egyezik; a belépett admin `scanComplete=true`, `buildConsistent=true`, `ready=true` eredményt ad; meglévő tanulói adatok megmaradnak; egyszeri nem destruktív belépés- és 200%-os/mobil/billentyűzetes használhatósági szemle. Ezután A-24 **PRODUCTION PASS**, és a végleges publikus kiadás jóváhagyható.
6. **Kiadás utáni formális jegyzőkönyv:** a telepített `main` SHA-jával összerendelt tényleges A-24 és az öt másik kritikus igazolás külön biztonságos, dátumozott zárórekordban, például `python3 scripts/check-acceptance-ledger.py --ledger PRIVAT_ZARO_CSV --scope minimum --expected-sha VEGLEGES_MAIN_SHA` útján. A privát zárórekordot **nem kell Git-commitként hozzáadni** a már telepített kiadáshoz: egy utólagos dokumentáció-commit ismét megváltoztatná a Git SHA-t. A nyilvános issue-ba csak a nem titkos bizonyítékazonosító és a végső döntés kerül.

A két fázis `premerge` és `minimum` azonos kiadási biztonsági célhoz tartozik; egyik sem írja felül a tényleges jogtulajdonosi jóváhagyás, szakmai minőség vagy személyes adatok védelmének követelményét. **A-24 nem kaphat végső PASS-t pusztán a Github ZIP-en, a korábbi backup-visszajelzésen vagy egy tesztaldomainen végzett próbán.** A projektgazda kérése szerint tesztaldomain kihagyva.
