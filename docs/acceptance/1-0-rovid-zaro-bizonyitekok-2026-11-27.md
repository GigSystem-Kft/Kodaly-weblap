# Zeneelméleti Műhely 1.0 – célzott bizonyíték-átvezetés és egyetlen zárópróba

**Dátum:** 2026-11-27  
**Scope:** a projektgazda kifejezett kérése szerinti legszükségesebb ellenőrzések; új funkció, új tesztbank és ismételt teljes manuális kör nélkül.  
**Ellenőrzött kód-/CI-pillanatkép:** `850359fe6525cd494b78013a082fd8e755b2ce48` – Chromium `45959078318` SUCCESS; PHP/MySQL/ZIP `45959078375` SUCCESS; Linux `45959078363` SUCCESS. A hatpontos elfogadási kapu szándékosan BLOCKED, a tesztelője 9/9 PASS.

## Kiadásjelölt és korábbi éles változat: változáshatás

A GitHub `compare_commits` lekérdezés a projektgazda által **korábban** megadott éles `644914afdfae460765f3b82671bb10294426b73d` és a fenti tesztelt fejlesztési SHA között **76 módosult fájlt** talált; a Git-ágak **divergáltak** (186 commit előre, egy merge-commit lemaradás). Ez **nem** bizonyítja, hogy a mai éles szerver még mindig ezt a SHA-t futtatja: az éles verziót jelenleg hitelesített hozzáférés nélkül nem tudtuk megállapítani. A korábbi éles commit és a fejlesztési ág közötti egyetlen különálló merge-commitot a végső, `main`-be kerülő SHA előállításakor össze kell egyeztetni. Nem szabad az éles oldalt pusztán ezen összehasonlításból felülírni.

| Kritikus kapu | Korábbi ellenőrzött tény | Változáshatás / egyetlen még szükséges döntés |
|---|---|---|
| **A-15 – jogok** | Projektgazda korábban jogtisztának jelölte a publikálásra meghagyott saját/szabad anyagokat; a technikai leltár **403 médiát és 81 PHP-forráscsoportot** azonosít | A Git-összehasonlításban nem jelent meg közvetlen `public/` médiacsere. **Egyetlen, a végleges közzétételi és Tanársegéd-indexelési terjedelemre érvényes jogosulti/felelősi igazolás és bizalmas bizonyítékazonosító hiányzik**; nem kérünk 403 külön általános manuális újratesztet. Az indexelt szövegek jogalapját ettől még nem szabad feltételezni |
| **A-20 – zenei szakmaiság** | Projektgazda sikeres hangköz-, moll-, ritmus-, kotta- és Tanársegéd-mintákat jelentett; **439** kvízkérdés válaszkulcs-technikai ellenőrzése zöld | Módosult néhány hangnév-jelölés és a Tanársegéd visszakeresési/válaszadó kódja. **Egyetlen célzott, dokumentált szakmai mintavételi jóváhagyás szükséges**, nem a 439 kérdés tételes újramegoldása |
| **A-06 – két eszköz / adatmegőrzés** | Projektgazdai számítógép–telefon kedvencszinkron és újrabelépés sikeres; PHP/MySQL 409 verziókonfliktus és böngészős összevezetés zöld | `src/progress.ts` változott, ezért nem mondhatjuk, hogy a kód teljesen azonos. **Csak a végső feltöltés utáni adatmegőrzés és meglévő mentett eredmény ellenőrzése szükséges**, nincs új teljes 409-es próbasor |
| **A-21 – SMTP/jogosultság** | Projektgazda valós e-mailkézbesítést és hallgató/tanár/admin szerepkör-próbákat sikeresnek jelezte; PHP/MySQL CI zöld | A korábbi és új SHA közti összesített eltérésben az `php/api/index.php` és `src/components/AccountPanel.tsx` **nem módosult**. **Ne ismételjünk meghívót, jelszóresetet vagy fióktörlést csak adminisztráció miatt.** A végső jelölten egyszeri, nem destruktív belépési/jogosultsági próba és a korábbi SMTP-igazolás összerendelése elegendő |
| **A-23 – akadálymentesség** | Projektgazda korábban mobil, képernyőolvasó, billentyűzet, kontraszt és 200% nagyítás próbákat sikeresnek jelzett | Több `src/components/` felület módosult. **Egyetlen összevont, rövid 200%-os + billentyűzet/mobil használhatósági szemle indokolt az éles jelölten**, nem teljes újbóli WCAG-futam |
| **A-24 – CloudPanel** | Projektgazda szerint offsite mentés és elkülönített visszaállítási próba már megtörtént; csomagolás 403 média SHA-256 integritásellenőrzéssel zöld | **Egyetlen végső SHA/ZIP és az éles `scanComplete=true`, `buildConsistent=true`, `ready=true` + privát config/HTTPS + tanulói eredmény megőrzésének igazolása** hiányzik. Nincs új mentés-visszaállítási ciklus pusztán papír miatt, de telepítés előtt a meglévő mentés frissességét és visszaállíthatóságát ellenőrizni kell |

## Minimális zárási művelet – egyetlen összevont próba

**Csak akkor**, ha az A-15 közzétételi jogalap és az A-20 szakmai minimáljóváhagyás igazolt, és az üzemeltető biztonságos adatmegőrző telepítést engedélyezett:

1. Rögzítsük az **egy** végleges, immutábilis Git SHA-t és csomag SHA-256-át; egyeztessük a divergáló Git-ágak eltérését; a meglévő három CI legyen zöld erre az SHA-ra.
2. A meglévő, használható **webhely + MySQL + privát konfiguráció + AI-forrás** offsite mentésének ellenőrzése után telepítsünk az engedélyezett CloudPanel folyamatban, a meglévő tanulói adatokat megtartva. Sikertelen állapotnál STOP/rollback.
3. **Egyetlen összevont, nem destruktív élő ellenőrzés:** HTTPS és verziójelzés; admin `auth/deployment-check` biztonságos összesítése; egy meglévő eredmény megmaradása; jogosult és jogosulatlan fiókelérés; 200%-os használhatóság és billentyűzet, rövid mobil szemle. **Nincs új tanuló törlése, nem küldünk felesleges resetleveleket, nem kérünk 439 kérdéses tesztet.**
4. Csak az igazolt pontokat jelöljük PASS-ra az A-06/A-15/A-20/A-21/A-23/A-24 sorokban, hiteles szerep, dátum, ténylegesen ellenőrzött SHA és nem titkos bizonyítékhivatkozás mellett. A többi 18 auditpont státuszát nem hamisítjuk meg.
5. Mind a hat kritikus PASS, nincs nyitott tényleges FAIL, PR review és Git-állapot rendben: PR Draft megszüntetése, jóváhagyott `main` merge, végső `main` build és publikálás.

## Korlátok / biztonság

- A korábbi sikeres projektgazdai tesztek **érvényes részpróbák**, nem bizonyítják automatikusan a még nem telepített SHA működését.
- A jelen lap **nem állítja**, hogy a 2026-11-27-i élő szerveren a fejlesztési jelölt telepítve van, hogy a publikálás minden joga dokumentum szerint megvan, vagy hogy valaki már jóváhagyta az összes szakmai anyagot.
- Az aktuális A-01–A-24 naplóban **5 PASS**, a hat kritikus kapuból **0 teljes formális PASS**. A hat kritikus kapu mostantól az 1.0 előfeltétele; minden valódi `FAIL` továbbra is STOP.
- A privát bizonyíték (engedélylevél, szerződés, jelszó, tanulói adat, nyers admin-válasz, szervermentés) **nem kerülhet nyilvános GitHubra**.

**Kapcsolódó források:** `docs/acceptance/acceptance-1.0.csv`, `docs/acceptance/a06-keteszkoz-konfliktus-proba-2026-11-23.md`, `docs/acceptance/a21-a24-eles-bizonyitekok-2026-11-24.md`, `docs/acceptance/a23-zoom-200-tulajdonosi-proba-2026-11-23.md`, `docs/acceptance/a20-tanarseged-regresszio-2026-11-23.md`, `docs/acceptance/1-0-szukitett-kiadasi-kapu-2026-11-27.md`.
