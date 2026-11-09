# Zeneelméleti Műhely – 24 pontos végső elfogadási kapu

**Dátum:** 2026-11-09. **Ág:** `fix/audit-p0-search-release-quiz-20261107`, Draft PR #2.  
**Kiadási döntés:** BLOKKOLVA – sem végleges letöltési link, sem `main` összevezetés nincs engedélyezve.

A `docs/audit-osszesitett-leltar-2026-11-07.md` a részletes, commitokkal alátámasztott technikai történet. Ez a dokumentum külön felsorolja **mind a 24 pont tényleges elfogadási bizonyítékát**. A sikeres CI egy adott tesztkörre vonatkozik, nem az éles szerverre; a szakmai és jogi jóváhagyást nem helyettesíti.

| Pont | Meglévő technikai bizonyíték | Kötelező lezáró ellenőrzés | Kiadási kapu |
|---|---|---|---|
| A-01 | 13 ritmikai JPG és változatlan Git-bájtazonosság ellenőrzése | Média-licenc része A-15; éles jelenlét A-24 | **Build lezárva** |
| A-02 | Magyar ékezet, szóköz és kis/nagybetűs tankönyvkeresés Chromium E2E | Éles böngészőn valamennyi könyvben keresés és lapmegnyitás | Nyitott kézi |
| A-03 | 04-es és 05-ös témaköri kvízek nem üresek, Chromium E2E | Oktatói helyességellenőrzés és kérdésbank átfedésvizsgálat | Nyitott szakmai |
| A-04 | Alfejezet/fejezet teljesítési jelölés és újratöltési CI | Valós hallgatói fiók, újra-belépés, feladatok szerveroldali mentése | Nyitott éles |
| A-05 | Párosító teljes kör, helytelen választás, XP-idempotencia, újrajátszás | Valós fiók és billentyűzetes/érintős kézi akadálymentesség | Nyitott éles |
| A-06 | CAS `revision`, 409 és két konkurens PHP/MySQL munkamenet | Két külön fizikai eszköz, azonos fiók, offline/online változtatások és újratöltés | Nyitott éles |
| A-07 | PHP-indexben 1793/1793 fogalom követelmény; csomagellenőrző és adminstatisztika | CloudPanel tényleges `source-coverage` válasz és kérdés-válasz ellenőrzés | Nyitott éles |
| A-08 | PHP/JSON statikus jelentés elkülönítése és forráscsoport-lista különbsége | 75/2840 és 104/3806 eltérés csoportonkénti feloldása és hiányzó források listája | Nyitott forrás |
| A-09 | Beépített magyar nyelvű kereső, forrásmegjelölés és opcionális, alapból kikapcsolt generatív mód | Reprezentatív magyar oktatói kérdésbank alapján szakmai válaszellenőrzés; AI mód egyértelmű megnevezése | Nyitott szakmai |
| A-10 | 1793 fogalom 12 kategóriában, nulla `Egyéb`; azonosítók változatlanok | Szakmai mintavétel, terminológiai egységesség és kényes fogalmak tételes lektorálása | Nyitott szakmai |
| A-11 | Napi hallás-XP és párosító limit, új szigorú dátum-/XP-típusvalidáció | Döntés: maradjon csak gyakorlási pont vagy készül szerveroldali hiteles eseménynapló; anti-cheat nem teljes | Nyitott termékdöntés |
| A-12 | Kilenc modul, összesített 0–9 számláló és 06–09 teljesítésjelző; Chromium újratöltési teszt | Éles profilban mind a 9 egység mentésének ellenőrzése | Nyitott éles |
| A-13 | 5 alaptananyag és 4 kiegészítő modul szerkezeti tesztjei | Egységes fejezetmélység, terminológia, belső hivatkozás szakmai szerkesztése | Nyitott szakmai |
| A-14 | H/B magyar hangnevek, 12-TET hangok és 12 hangköz tesztjei | Valódi hangkimenet, fülhallgató/hangszóró, külön böngészők, lejátszóindítás | Nyitott akusztikai |
| A-15 | Médiaforrás-metaadatok és 9 forráscsoportból álló jogállási bizonyítéknyilvántartás (`docs/a15-forras-es-jogallasi-nyilvantartas-2026-11-09.md`) | Tankönyv, kotta, kép, jegyzet, szótár és videó tételes felhasználási engedélye/licence még nem igazolt; jóváhagyási bizonyíték kell | **Jogi blokkoló** |
| A-16 | XP-max összevezetés és kedvencek háromutas konfliktusfeloldása | Oktatói döntés az XP-kimutatás jelentéséről és esetleges historikus eseménynaplóról | Nyitott termékdöntés |
| A-17 | Kvízpróbálkozás, hibás kérdések, időtartam, 3+3 trend; számszerű konzisztencia | Pedagógiai validálás: mit jelent pontszám, hibaarány, ismétlés és trend | Nyitott szakmai |
| A-18 | 302 tankönyvoldal, 13 ritmikai és 64 jegyzetkép, PHP modulok és JS/CSS ellenőrzése | Éles feltöltés külön A-24 alatt; a CI-build csomagszerkezete teljes | **Build lezárva** |
| A-19 | Alap/extra tananyagútvonalak, 5 könyv, mobil menü, Enter/Space és reload Chromium | Teljes menübejárás mobilon és asztali gépen, külső linkek és visszalépés | Nyitott kézi |
| A-20 | Adatstruktúra és kérdésválasz-egyediség automatikus vizsgálata | Definíció–kotta–hang–kvíz–AI kereszthivatkozások független zenei lektorálása | **Szakmai blokkoló** |
| A-21 | Két fiók PHP/MySQL izolációja, szerepkörök, export és törlés; jelszócsere és resetlink-visszavonás; valódi MySQL-zár alatt HTTP-bejelentkezési versenyhelyzet, amely nem adhat ki lejárt jelszóval sessiont (CI sikeres) | Valódi meghívó és SMTP-kézbesítés, tanár/hallgató életút, mentés-törlés csak tesztfiókon, többeszközös éles próba; adatvédelmi jóváhagyás | **Éles blokkoló** |
| A-22 | 15 kérdéses gyakorlókör, 3+3 trend és saját tanulási jelölések | Egyetemi pedagógiai mérés/értékelési szabályok jóváhagyása | Nyitott szakmai |
| A-23 | Bővített axe WCAG 2.1 AA CI, admin/profil/fióktörlés és mobil vizsgálatok | Képernyőolvasós, zoom/kontraszt, sötét-világos téma és valódi billentyűzetes kézi audit | Nyitott kézi |
| A-24 | GitHub Actions Chromium/PHP/MySQL/Linux; CloudPanel bejelentkezés és alap admin/progress helyreállt | Új build valós telepítés, Rollback, könyvtárjogok, HTTPS, SMTP, forrásindex, két fizikai eszköz és adatmegőrzés | **Kiadási blokkoló** |

## Kiadási döntési protokoll

1. **Kód:** ugyanazon Git SHA-hoz tartozó Chromium, PHP/MySQL/ZIP és Linux workflow eredménye *success*; migráció, CSRF, szerepkör, tanulási eredmények visszaállítása kipróbálva.
2. **Tananyag:** a 9 modul, 1793 címszó, válaszkulcsok, kották, hangminták és forrásmegjelölések szakmailag jóváhagyva; vizsgáknál a nem hiteles XP egyértelmű.
3. **Jog:** a közzétett forrásokhoz rendelkezésre álló engedélyek/licencek felhasználási módra ellenőrizve; adatkezelési tájékoztató és mentésmegtartás írásban elfogadva.
4. **Éles szerver:** változtatás előtt SQL + teljes webhely + privát konfig + külön AI-forrásmentés a webgyökéren kívül, lehetőleg offsite; új telepítő egyben, a fennálló adatok felülírása nélkül; ellenőrzött visszaállítási próba.
5. **Valódi pilot:** tesztadmin küld meghívót, hallgató feliratkozik, megerősíti az e-mailt, két eszközön ugyanabba a fiókba belép, kvízt/fejezetet teljesít, ütközésből szinkronizál, kilép/visszalép; oktatói és hallgatói jogok tényleg elkülönülnek. Fióktörlési próbát csak **eldobható tesztfiókon** szabad végezni.
6. **Kiadás és Git:** ha minden blokkoló igazoltan megszűnt, PR #2 végső diff- és branch-ellenőrzés, csak akkor Draft → Ready, jóváhagyás és konfliktusmentes összevezetés a `main` ágba. Utána ismételt CI és a végleges telepítő kiadása.

**E dokumentum önmagában nem zár le új pontot.** A fő auditban két buildoldali pont igazoltan lezárt; a többi lezárásához a fenti ellenőrzésből származó bizonyítékot kell rögzíteni. Végleges letöltési csomagot és `main` összevezetést tilos kiadni a kapuk teljesülése előtt.
