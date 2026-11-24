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
