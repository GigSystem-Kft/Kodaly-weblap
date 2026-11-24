# Zeneelméleti Műhely 1.0 – bizonyíték-összerendelési mátrix

**Állapotnap:** 2026-11-24. **Ág:** `fix/audit-p0-search-release-quiz-20261107`.  
**Technikailag sikeresen tesztelt commit:** `b99a413ea6d51dac935f45dcae4cae7772822393`.  
**Ugyanezen SHA sikeres workflow-jai:** Chromium `45283486736`, PHP telepítő ZIP `45283486814`, Linux telepítő `45283486737`. Emberi elfogadási workflow `45283486698`: **failure**. Ez nem azonos a 24 pontos elfogadás teljesítésével.

## Alapelv

A `docs/acceptance/acceptance-1.0.csv` az egyetlen **formális** kapu. A lentiek a meglevő kódbeli, automatizált és tulajdonosi bizonyítékokat rendezik; **nem állítanak elő hiányzó jóváhagyást**, és nem írják át a `NOT_RUN`/`BLOCKED` státuszokat `PASS`-ra. A felhasználó által korábban ellenőrzött funkciókat bizonyítékgyűjtési okból nem kell céltalanul újratesztelni. A legutóbb ismert éles SHA `644914afdfae460765f3b82671bb10294426b73d`, ami **nem** azonos a fenti fejlesztési jelölttel.

## A-01–A-24: meglévő bizonyíték és pontosan mi hiányzik

| Pont | Meglévő bizonyíték | A formális lezáráshoz még szükséges |
|---|---|---|
| A-01 | 13 ritmikai JPG és fájlazonossági ellenőrzés; auditált build | A végső SHA és a kapcsolódó A-15 jognyilvántartás összerendelése |
| A-02 | Unicode kereső/oldalnyitás Chromium E2E | Éles, azonosított kiadáson könyvenkénti keresés és oldalmegnyitás bizonyítéka |
| A-03 | A 04/05 témakörök nem üresek, automata; két kvízválaszkulcsot a projektgazda ellenőrzött | Végleges kérdésbank szakmai mintája és azonosított jelölt |
| A-04 | Fejezetjelölés, újratöltés automatizált | Valós hallgatói fiók és szerveres megőrzés verzióhoz kötve |
| A-05 | Párosító teljes kör, XP és idempotencia Chromium; korábbi felhasználói játékpróba | Fiókos, érintős/billentyűzetes eredmény és verzió-/bizonyítékkötés |
| A-06 | CAS/409 PHP+JS és két böngészőkörnyezetes E2E; projektgazdánál **mindkét külön kedvenc megmaradt** két fizikai eszközön | A tényleges éles HTTP **409** naplóazonosítója, végső SHA és mentési revízió bizonyítéka |
| A-07 | 1793/1793 fogalom ellenőrzése a csomagban | Éles `source-coverage` és egyedi keresési/válaszpróba a végső jelölthöz |
| A-08 | Statikus és PHP-index exportparitás, forrásszámlálás | Éles teljes privát forrásindex, engedély és jogosultság tényleges igazolása |
| A-09 | Magyar Unicode-alapú kereső, forrásmegjelölés és védelem | Reprezentatív tanári kérdések szakmai jóváhagyása az aktuális indexszel |
| A-10 | 1793 fogalom 12 kategóriában; nulla „Egyéb” | Terminológiai mintavétel és azonosított felelős |
| A-11 | Napi hallás-/párosító XP limit, értékellenőrzés | Pedagógiai döntés: az XP kizárólag gyakorlási mutató, vagy külön hitelesített mérés |
| A-12 | Kilenc modul és fejlődésjelzők automatikus ellenőrzése | Mind a 9 modul éles profilbeli szerveres megőrzésének igazolása |
| A-13 | Egységes lecke- és modulstruktúra, korábbi sikeres kreatív nevelés próba | Fejezetmélység, terminológia és belső hivatkozások szerkesztői jóváhagyása |
| A-14 | 12-TET, magyar H/B hangnevek, hangközök automatikusan; projektgazda három hangköz + hangsor/ritmus hangzó PASS | Végső kiadáshoz rendelt akusztikus és böngészős bizonyíték |
| A-15 | Projektgazdai nyilatkozat: jogok rendezve; korábbi 5/5 előellenőrzés | A ténylegesen publikált állományok/AI-index tételes, nem titkos jogbizonyíték-hivatkozása; a privát engedélyek nem kerülhetnek GitHubra |
| A-16 | XP, offline összevezetés, kedvencek és hibás azonosítók regressziója; két eszközön kedvencek megtartva | Az XP pedagógiai értelmezésének jóváhagyása és végső tesztverzió |
| A-17 | 15 kérdéses, hibás kérdésekre és dupla kattintásra kiterjedő Chromium E2E; korábbi 4/4 játék/teszt PASS | Pontozás és trend szakmai értelmezésének jóváhagyása |
| A-18 | 302 tankönyvoldal + 13 ritmikai + 64 jegyzetkép csomagolási teszt | Végső SHA, éles csomagintegritás és az A-24-hez kötés |
| A-19 | Menü, könyvek, mobilnavigáció, billentyűzetes bejárás Chromium; felhasználói mobilteszt 5/5 | Végső éles menü/link/előzmény bejárás azonosított bizonyítéka |
| A-20 | Tanársegéd két válasza, hangköz, három a-moll, négy ritmus 60 BPM, egy kotta–hang és két kvízkérdés **projektgazdai PASS**; keresztmodul automatika | Pontos példák azonosítója, független lektor jóváhagyása és a végső SHA-hoz kötés |
| A-21 | PHP/MySQL szerepkör-, CSRF-, meghívás- és resetlogika; korábban hallgató/tanár 5/5 | Valódi SMTP kézbesítés, meghívás, jelszó-visszaállítás, jogosultság-elutasítás és végső buildazonosság |
| A-22 | 15 kérdéses kör, 3+3 trend, tanulási adatok | Egyetemi pedagógiai mérés-értékelési szabályok tulajdonosi jóváhagyása |
| A-23 | Mobil, billentyűzet, képernyőolvasó korábban 5/5; **200% zoom PASS**; kontraszt/fókusz **PASS**; axe/Chromium | Eredmények végső SHA-hoz kötése; a ténylegesen támogatott sötét/világos téma külön ellenőrzése, ha elérhető |
| A-24 | HTTPS, 403/.cache tiltás, teljes mentés és próbavisszaállítás tulajdonosi megerősítése, build-hash védelem | Végső telepített SHA; admin `scanComplete`, `buildConsistent`, `ready`; bizalmas offsite mentés metaadata és csomaghash-azonosság |

## Következő végrehajtható zárási sorrend

1. **Kiadási SHA stabilizálása:** a további módosítások után ugyanazon jelölt mindhárom technikai CI-jének újraellenőrzése. Ne vezessünk be új funkciókat.
2. **A-11/A-16/A-17/A-22 termékdöntés:** az XP gyakorlási pontszámként, nem hivatalos bizonyítvány/értékelésként való kezelésének és a trend jelentésének kifejezett jóváhagyása; ez nem igényel ismételt hangzó próbát.
3. **A-15/A-20/A-23 bizonyíték-kötés:** a korábban ténylegesen elvégzett szakmai, jogi és akadálymentességi ellenőrzések meglévő nyilvántartási azonosítóinak/tesztelt verzióinak összegyűjtése. Ne kérjünk újra 200%-os zoomot, két kedvencet, három hangközt, hangsorokat vagy a kvíz két kérdését.
4. **A-21/A-24 éles üzemeltetői kapu:** a tényleges SMTP/jogosultság és telepítési audit + backup/fingerprint bizonyíték kezelése. Csak eldobható tesztfiókkal.
5. **A-01–A-24 napló tételes lezárása:** csak ellenőrizhető, pontos 40 karakteres SHA, szerepkör, dátum és nem titkos bizonyíték alapján `PASS`.
6. **#3 issue és #2 PR:** hét előzetes ellenőrzés, elfogadási napló 24/24, védett `main` összevezetés, majd az új `main` kiadás ellenőrzése. Előtte nincs végleges ZIP vagy éles telepítés.

**A dokumentum bizonyíték-összerendezés, nem kiadási engedély.**
