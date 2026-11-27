# A-21 / A-24 – éles fiók- és telepítési bizonyítékok lezárási lapja

**2026-11-24 • státusz: részben igazolt, formálisan nem elfogadott.**
A cél a korábban megcsinált próbák újrafuttatásának elkerülése, és csak a **hiányzó** adatok beszerzése. Nem telepítési utasítás, nem jelenti a jelenlegi éles weboldal ellenőrzésének teljesülését.

## A-21 – valós felhasználók, szerepkör és levélkézbesítés

| Részterület | Már rendelkezésre áll | Pontos hiány |
|---|---|---|
| Hallgatói felület és belépés | 2026-11-20-i összesítő: projektgazda szerint 5/5 emberi próba sikeres | A kipróbált build és pontos, nem titkos tesztazonosító |
| Tanári/admin felület | Projektgazda szerint 5/5 emberi próba sikeres | Az aktuális verzióhoz rendelt szerepkör-/jogosultság-bizonyíték |
| Fiók és eredményszinkron | PC–telefon megjelenés, kilépés/visszalépés, két eltérő kedvenc megőrzése PASS | Valós élő 409 (ha létrejött) naplóazonosítója; külön A-06 kapu |
| PHP/MySQL szerepkör- és tokenvédelem | Kód- és integrációs tesztek a kiadási audit szerint | Valódi meghívó, jelszó-visszaállítás, jogosulatlan API-művelet 401/403 |
| Rackhost SMTP | Dedikált küldő postaláda és konfiguráció korábbi projektállapot szerint | **Tényleges címzetti kézbesítés**, meghívó és reset levél sikerességének nem titkos naplóazonosítója |
| GDPR/tesztfiókok | Export/törlés technikai ellenőrzés | Csak eldobható fiókon tesztelt export/törlés, az eredmény dokumentálása |

**Következő valóban új, célzott próbasor** (az üzemeltető végzi, eldobható tesztfiókkal):
1. Admin új meghívót küld → címzett tényleges levélkézbesítést igazol → meghívás elfogadása és belépés.
2. Jelszó-visszaállító levél megérkezik → új jelszóval belépés → régi token és régi jelszó elutasítva.
3. Vendég/hallgató/tanár jogosulatlan adminművelete elutasítva (401/403), admin jogosult funkció rendben.
4. Export és törlés kizárólag kijelölt **eldobható** tesztfiókkal; más felhasználó adata nem sérül.

**Bizonyítékrekord (személyes adat nélkül):** `checked_on | tested_sha | environment | reviewer_role | invitation_delivery PASS/FAIL | password_reset PASS/FAIL | forbidden_access PASS/FAIL | test_account_only PASS/FAIL | safe_evidence_ref`. A címzett neve, e-mail-címe, jelszava, tokenje nem kerül nyilvános GitHubra.

## A-24 – CloudPanel, mentés, buildazonosság

| Részterület | Már rendelkezésre áll | Pontos hiány |
|---|---|---|
| HTTPS és nyilvános útvonal | 2026-11-23-i tulajdonosi `HEAD /` → 200 | A végső jelöltre külön éles/proba ellenőrzés |
| `.cache` HTTP védelem | Tulajdonosi két `HEAD` válasz 403; FTP-leltár egy 0 bájtos jelzőfájllal | Admin `excludedDirs`/eredet igazolása; ettől még nem teljes scan |
| Mentés | Teljes webhely és adatbázis-mentés projektgazda szerint elkészült | Nem titkos mentési metaadat, offsite másolat azonosítója |
| Visszaállítás | Projektgazda **kipróbálta** és sikeresként jelezte | A visszaállítás célkörnyezete, dátuma, konziszten­ciaellenőrzés és bizonyítékazonosító |
| Csomagolás | Ugyanazon `016b93b42f6b48d09d55b2b72eaab6d727271e51` SHA-n Chromium `45346654343`, PHP ZIP `45346654203`, Linux `45346654771`: **success** | A **végső** release SHA és ténylegesen telepített csomag ZIP SHA-256 egyezése |
| Éles konfiguráció | PHP/MySQL útvonal és `auth/deployment-check` ellenőrzés kódban megvan | Bejelentkezett admin valódi `scanComplete`, `buildConsistent`, `ready`, `excludedDirs`, `scanIssue` értékei |
| Adatmegőrzés | Két fizikai eszköz kedvencei frissítés után megmaradtak | Végső telepítés előtti és utáni biztonságos állapotazonosító és ellenőrzés |

**Biztonságos üzemeltetői sorrend:** a már meglévő mentés és próba *bizonyítékainak* azonosítása → a végleges build SHA rögzítése → ZIP hash ellenőrzése → elkülönített próbaverzió telepítése a korábbi élő adatok érintése nélkül → csak olvasó preflight → admin `auth/deployment-check` → SMTP/tesztfiókos szerepkörpróba → záró döntés.

**Javasolt kitöltési mezők (nem titkos):**
```text
date:
reviewer_role:
environment: staging | production
tested_full_git_sha:
zip_sha256_match: PASS | FAIL | NOT_RUN
backup_reference:
offsite_reference:
restore_test_reference:
restored_data_consistent: PASS | FAIL | NOT_RUN
scanComplete:
buildConsistent:
ready:
excludedDirs:
scanIssue: [redacted summary only]
smtp_delivery: PASS | FAIL | NOT_RUN
role_denials: PASS | FAIL | NOT_RUN
retained_learner_data: PASS | FAIL | NOT_RUN
final_decision: BLOCKED
```

**STOP szabály:** a `main` összevonás és a végleges letöltés csak akkor lehetséges, ha a fenti éles ellenőrzések és **mind a 24** elfogadási pont függetlenül is igazoltak. Egy korábban sikeres fejlesztői CI nem bizonyítja a telepített webhely állapotát.

Hivatkozott, tényleges jegyzőkönyvek:
- `docs/acceptance/owner-reported-test-summary-2026-11-20.md`
- `docs/acceptance/a06-keteszkoz-konfliktus-proba-2026-11-23.md`
- `docs/acceptance/a24-cache-http-proba-2026-11-23.md`
- `docs/acceptance/a24-cloudpanel-proba-jegyzokonyv.md`
- `docs/cloudpanel-telepites.md`

## 2026-11-24 – hitelesített admin válasz biztonságos helyi összefoglalása

A `scripts/summarize-deployment-check.py` offline segéd csak **meglévő**, admin jogosultsággal, biztonságosan megszerzett `auth/deployment-check` JSON-választ fogad, és a kiadáshoz szükséges mezők szűkített összesítését adja vissza. **Nem** kér be felhasználónevet, jelszót vagy sessiontokent; nem csatlakozik hálózathoz; nem jeleníti meg a válaszban lévő állományneveket vagy további mezőket. A nyers admin JSON-t és böngészőhitelesítési adatot nem szabad nyilvános GitHubra tölteni.

A fájlt csak biztonságos helyi mappából olvasva, a **ténylegesen telepített build** teljes SHA-jával lehet futtatni:

```bash
python3 scripts/summarize-deployment-check.py --expected-sha TELJES_40_KARAKTERES_SHA < admin-deployment-check.json
```

Kimenetben szerepel a telepített SHA, az egyezés, a `ready`, `scanComplete`, `buildConsistent`, `mailConfigured` logikai státusz, továbbá a hiányzó fájlok és kizárt könyvtárak **darabszáma** (nem a neve), és hogy volt-e scanhiba. A visszatérési kód `0` csak a fájlkapu igazolására utal; a többi kézi kapu mindig nyitott marad. Hibás JSON, hiányzó kötelező mező vagy SHA-eltérés esetén hibával tér vissza. Az összesítőt a PHP telepítő CI külön teszteli.

**Nem titkos kimenetből is csak józan adatvédelmi ellenőrzés után készüljön elfogadási bizonyíték**; az admin teljes nyers JSON-ját nem kell és nem szabad továbbítani. Az eszköz nem helyettesíti az élő adminpróbát vagy a független emberi ellenőrzést.

**További biztonsági ellenőrzés (2026-11-24):** az összesítő kizárólag a dokumentált gyökérszintű `.cache` kihagyást ismeri el. Ha az adminválasz bármely más kihagyott könyvtárat is jelez, `unexpected_exclusions_present=true` és `file_gate_passed=false`, akkor is, ha a szerver `ready=true` értéket közöl. Az ismeretlen könyvtár nevét a kimenet nem tartalmazza. Az elfogadott `.cache` kihagyás továbbra is külön HTTP 403-as és üzemeltetői vizsgálatot igényel; ez nem teljes éles kiadási PASS.

## 2026-11-24 – valós A-21 e-mailes próba: projektgazdai visszajelzés

A projektgazda az A-21 **valós Rackhost e-mail-kézbesítés és jelszó-visszaállítás célzott ellenőrzésére** adott kérés után kifejezetten visszajelzett: **„megcsináltam a tesztet, működik”**. Ezt **sikeres tulajdonosi funkcionális visszajelzésként** rögzítjük, és ugyanazt a próbát nem kérjük újra csak a jegyzőkönyvezés miatt.

**Igazolt közlés:** a projektgazda az általa elvégzett A-21 e-mailes tesztet működőnek minősítette. A rövid közlésből nem állapítható meg külön-külön a meghívó és a resetlevél beérkezési időpontja, a tesztelt teljes telepített SHA, az SMTP-kiszolgáló naplóazonosítója vagy a 401/403-as éles HTTP-válasz. Ezeket nem találjuk ki. A meghívó, megerősítő token, jelszó-visszaállítás, jogosultsághatárok és tesztfióktörlés a **GitHub PHP/MySQL automatikus integrációs tesztjeiben** is sikeres; a CI azonban `local-test` levéltransportot használ, nem Rackhostot.

**A-21 eredmény:** projektgazdai e-mailes próba **PASS (visszajelzett, a közlés szerinti terjedelemben)**; a teljes formális A-21 napló `NOT_RUN` marad, amíg a pontos kiadási SHA-hoz, megfelelő biztonságos bizonyítékazonosítóhoz és a ténylegesen tesztelt részfunkciókhoz nem lehet egyértelműen hozzárendelni. A felhasználótól e-mail-címet, hozzáférési tokent, képernyőképes személyes adatot vagy jelszót nem kérünk. A jelenlegi éles weboldalt ez a dokumentálás nem módosítja.
