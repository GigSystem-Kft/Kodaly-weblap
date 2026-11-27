# Zeneelméleti Műhely 1.0 – kiadási kapu, tényalapú állapot 2026-11-23

**Cél:** a 2026-11-23-i projektgazdai „kérlek csináld” kérés alapján a meglévő 1.0 kiadás elfogadását előrevinni. **Új funkció nincs. Nem végleges kiadás.**

## GitHub és éles állapot

- Ág: `fix/audit-p0-search-release-quiz-20261107`. GitHub compare: `main`-hez képest **727 commit ahead / 0 behind** az ellenőrzés pillanatában.
- Vizsgált korábbi commit: `75335f1547bf695e0382b16db81f520d905e3bb0`. Chromium füstteszt, PHP telepítő ZIP és Linux telepítő CI: **success**. Emberi elfogadási workflow: **failure**, mert a formális bizonyítékokra épített kapu nincs teljesítve. Ez nem három sikertelen automatizált tesztet jelent.
- A tulajdonos által 2026-11-23-án megerősített éles telepített SHA: `644914afdfae460765f3b82671bb10294426b73d`. **Nem azonos a fejlesztési ág aktuális fejével**.
- A `docs/acceptance/acceptance-1.0.csv` ellenőrzéskor 21 `NOT_RUN` és 3 `BLOCKED` státuszt tartalmazott. A korábbi részleges emberi próbák ennek ellenére ténylegesen megtörténtek, de nem mind rendelkeznek tételes, SHA-hoz kapcsolt bizonyítékkal.

## A-24: új, ellenőrzött részpróbák

- NGINX CloudPanel Vhost: `location = /.cache { return 403; }` és `location ^~ /.cache/ { return 403; }` a külső és a belső szerverben.
- A tulajdonos PowerShell HTTP HEAD válaszai (2026-11-23 20:20:23 GMT): `/.cache/` → **403**, `/.cache/ellenorzes-nemletezo.txt` → **403**, `/` → **200**.
- Linux státusz: könyvtár `zeneftp:zeneelmeletadmin`, mód `0700`, 2026-11-07-i létrehozás; a `zeneftp` FTP-fiók létezik. FTP/Fájlkezelő leltár: egyetlen 0 bájtos `motd.legal-displayed` jelzőfájl.
- A tulajdonos megerősítette a **teljes biztonsági mentés elkészültét** és a **próbavisszaállítás elvégzését**. Ennek technikai naplóazonosítója, tesztkörnyezete és részletes eredménye nincs ide csatolva.
- A `php/api/deployment-audit.php` forrás szerint a webgyökérszintű `.cache` kizárása **szándékos**, az `excludedDirs` mezőben jelentkezik. Ebből önmagában nem következik `scanComplete=false`. Az automatikus kizárást bizonyíték nélkül nem szabad „teljesen átvizsgálva” állapotra átírni.
- A-24 formális státusz: **BLOCKED**, amíg a végleges kiadási build, ellenőrzés és nem titkos bizonyítékok egyeztetése nem teljes.

## Amihez nem kérünk felesleges újratesztet

- Korábbi tulajdonosi sikeres próba: Kreatív zenei nevelés, szókártyák 5/5, játék/teszt 4/4, hallgatói és tanári fiókpróbák, PC–telefon közti eredményszinkron.
- Korábbi tulajdonosi akadálymentességi próba: mobil, billentyűzet, képernyőolvasó (5/5 mindegyik).
- A Tanársegéd két éles regressziója azonosított SHA-n PASS: tiszta/szűkített kvint, természetes/harmonikus/dallamos a-moll.
- A mentést és visszaállítást a tulajdonos már elvégezte; csak a meglévő próba ellenőrizhető metaadatainak összerendelése indokolt.

## A kiadást még blokkoló ténylegesen hiányzó vagy nem igazolt elemek

1. **A-15:** a csomag ténylegesen megjelenő valamennyi harmadik feles (PDF, kép, szótár, jegyzet, zene, videó, AI-index) tételéhez közzétételi és felhasználási jogosultság. Nem elfogadható általános szóbeli „van rá engedély” vagy fiktív PASS.
2. **A-20:** független zenei lektori, ugyanazon buildhez kötött mintavételes hangzó/kotta/ritmus/kvíz/fogalomtár értékelés. A két Tanársegéd-regresszió már PASS, nem ismétlendő.
3. **A-06/A-21:** valódi, két eszközös 409 konfliktuskezelés adatvesztés nélkül; SMTP meghívó és jelszó-visszaállítás, jogosultsági tiltások verzióhoz kötött bizonyítéka. A sima PC–telefon szinkron már sikeres, nem elég a konfliktuspróbához.
4. **A-23:** a korábban sikeres képernyőolvasó/billentyűzet/mobil próbák nem titkos azonosítója, valamint a 200%-os nagyítás és kontraszt hiányzó ellenőrzése.
5. **A-24:** az admin `auth/deployment-check` mezői (`scanComplete`, `buildConsistent`, `ready`, `excludedDirs`, `scanIssue`), az új, **egyetlen végleges SHA** szerinti build-fingerprint, hozzá tartozó csomag hash, biztonsági mentés/restore metaadatai. A telepített 644914… build nem azonos az új jelölttel.
6. **A-01–A-24** összes többi sora: a meglévő tulajdonosi és CI-próbák lehetőség szerinti bizonyítékkötése; valóban nem futtatott negatív próbák elkülönítése és célzott lefuttatása. Az elfogadási CSV napló formális kapu, megkerülése tilos.

## Kiadási stop és következő döntés

- **Nincs `main` merge, éles telepítés vagy végleges ZIP-link** a még hiányzó jogi, szakmai és biztonsági bizonyítékok alapján.
- A készítendő végleges csomagnál a *csomag, a három technikai workflow, az emberi elfogadás és az admin-telepítési fingerprint* ugyanahhoz a commit SHA-hoz kötendő.
- Tilos közreadni jelszót, SQL-t, visszaállítási mentést, privát forrásokat vagy engedélylevelet. Nyilvános naplóba elegendő a nem titkos hivatkozási azonosító.

Források: `docs/acceptance/owner-reported-test-summary-2026-11-20.md`, `docs/acceptance/1-0-funkciozaras-2026-11-23.md`, `docs/acceptance/a24-cache-http-proba-2026-11-23.md`, `docs/acceptance/a20-tanarseged-regresszio-2026-11-23.md`, `docs/acceptance/a15-jogallas-teteles-ellenorzes.md`, `docs/acceptance/acceptance-1.0.csv`, GitHub compare és Actions.
