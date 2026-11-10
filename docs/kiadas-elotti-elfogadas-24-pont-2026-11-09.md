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
| A-06 | CAS `revision`, 409 és két konkurens PHP/MySQL munkamenet; régi offline kvízrekordok elsőbbségi védelme; két elkülönített Chromium-munkamenet automatikus 409-es összevezetése és újratöltési tesztje | Két külön fizikai eszköz, azonos fiók, offline/online változtatások és újratöltés | Nyitott éles |
| A-07 | PHP-indexben 1793/1793 fogalom követelmény; csomagellenőrző és adminstatisztika | CloudPanel tényleges `source-coverage` válasz és kérdés-válasz ellenőrzés | Nyitott éles |
| A-08 | Statikus **104 forráscsoport / 4041 részlet**, PHP-export **4249 részlet**; **15/15** alfejezet, **395** forrásoldal-csoport, 7 teljes gyakorlóbank. A külön tanári feltöltések rövid címsorait, zenei példáit, sortöréseit, összetett Unicode-jeleit is veszteségmentesen indexeli, és a forráshűséget negatív regressziós próbák védik | **Éles CloudPanel**-forrásjegyzék, magyar AI-válaszok érdemi szaklektorálása, és külön licencelt források tartalmi/jogi lefedettsége nem igazolt | Nyitott forrás |
| A-09 | Beépített magyar nyelvű kereső, forrásmegjelölés és opcionális, alapból kikapcsolt generatív mód | Reprezentatív magyar oktatói kérdésbank alapján szakmai válaszellenőrzés; AI mód egyértelmű megnevezése | Nyitott szakmai |
| A-10 | 1793 fogalom 12 kategóriában, nulla `Egyéb`; azonosítók változatlanok | Szakmai mintavétel, terminológiai egységesség és kényes fogalmak tételes lektorálása | Nyitott szakmai |
| A-11 | Napi hallás-XP és párosító limit, új szigorú dátum-/XP-típusvalidáció | Döntés: maradjon csak gyakorlási pont vagy készül szerveroldali hiteles eseménynapló; anti-cheat nem teljes | Nyitott termékdöntés |
| A-12 | Kilenc modul, összesített 0–9 számláló és 06–09 teljesítésjelző; Chromium újratöltési teszt | Éles profilban mind a 9 egység mentésének ellenőrzése | Nyitott éles |
| A-13 | 5 alaptananyag és 4 kiegészítő modul szerkezeti tesztjei | Egységes fejezetmélység, terminológia, belső hivatkozás szakmai szerkesztése | Nyitott szakmai |
| A-14 | H/B magyar hangnevek, 12-TET hangok és 12 hangköz tesztjei | Valódi hangkimenet, fülhallgató/hangszóró, külön böngészők, lejátszóindítás | Nyitott akusztikai |
| A-15 | Médiaforrás-metaadatok és 9 forráscsoportból álló jogállási bizonyítéknyilvántartás (`docs/a15-forras-es-jogallasi-nyilvantartas-2026-11-09.md`) | Tankönyv, kotta, kép, jegyzet, szótár és videó tételes felhasználási engedélye/licence még nem igazolt; jóváhagyási bizonyíték kell | **Jogi blokkoló** |
| A-16 | XP-max összevezetés és kedvencek háromutas konfliktusfeloldása; hibás/Unicode-szóköz azonosítók elutasítása; kvízrekord-azonosítók szerveres elsőbbsége; örökölt JS-kulcsok nélküli pontszám-összevezetés és új kvízpontszám mentése validált saját kulcsokból | Oktatói döntés az XP-kimutatás jelentéséről, esetleges historikus eseménynaplóról és valós többeszközös elfogadásról | Nyitott termékdöntés |
| A-17 | Kvízpróbálkozás, hibás kérdések, időtartam, 3+3 trend; számszerű konzisztencia; hibás kérdésazonosítók duplikációjának tiltása JS/PHP-ben; válasz, továbblépés és befejezés dupla kattintási E2E regressziója | Pedagógiai validálás: mit jelent pontszám, hibaarány, ismétlés és trend | Nyitott szakmai |
| A-18 | 302 tankönyvoldal, 13 ritmikai és 64 jegyzetkép, PHP modulok és JS/CSS ellenőrzése | Éles feltöltés külön A-24 alatt; a CI-build csomagszerkezete teljes | **Build lezárva** |
| A-19 | Alap/extra tananyagútvonalak, 5 könyv, mobil menü, Enter/Space és reload Chromium | Teljes menübejárás mobilon és asztali gépen, külső linkek és visszalépés | Nyitott kézi |
| A-20 | Adatstruktúra és kérdésválasz-egyediség automatikus vizsgálata | Definíció–kotta–hang–kvíz–AI kereszthivatkozások független zenei lektorálása | **Szakmai blokkoló** |
| A-21 | Két fiók PHP/MySQL izolációja, szerepkörök, export és törlés; jelszócsere és resetlink-visszavonás; valódi MySQL-zár alatt HTTP-bejelentkezési versenyhelyzet, amely nem adhat ki lejárt jelszóval sessiont (CI sikeres) | Valódi meghívó és SMTP-kézbesítés, tanár/hallgató életút, mentés-törlés csak tesztfiókon, többeszközös éles próba; adatvédelmi jóváhagyás | **Éles blokkoló** |
| A-22 | 15 kérdéses gyakorlókör, 3+3 trend és saját tanulási jelölések | Egyetemi pedagógiai mérés/értékelési szabályok jóváhagyása | Nyitott szakmai |
| A-23 | Bővített axe WCAG 2.1 AA CI, admin/profil/fióktörlés és mobil vizsgálatok; Tanársegéd képnagyító/bezáró Escape-, Tab- és fókuszvisszaállítás Playwright-regresszióval | Képernyőolvasós, zoom/kontraszt, sötét-világos téma és valódi billentyűzetes kézi audit | Nyitott kézi |
| A-24 | GitHub Actions Chromium/PHP/MySQL/Linux; admin-only rekurzív webgyökér- és titokkeresés; hiányos vizsgálat lezárásának tiltása; közös Git-revízió és 12 kritikus PHP-modul, valamint a Vite JS/CSS-belépési fájlok SHA-256 ellenőrzése; a privát tanári források külső symlinkjeinek és hibás JSON-jának kizárása a HTML/JSON/PHP csomagban; éles bejelentkezés és alap admin/progress korábban helyreállt | Új build valós telepítés, **valós verzióegyezés és tiszta fájlvizsgálat**, rollback, könyvtárjogok, HTTPS, SMTP, forrásindex, két fizikai eszköz és adatmegőrzés | **Kiadási blokkoló** |

## Kiadási döntési protokoll

1. **Kód:** ugyanazon Git SHA-hoz tartozó Chromium, PHP/MySQL/ZIP és Linux workflow eredménye *success*; migráció, CSRF, szerepkör, tanulási eredmények visszaállítása kipróbálva.
2. **Tananyag:** a 9 modul, 1793 címszó, válaszkulcsok, kották, hangminták és forrásmegjelölések szakmailag jóváhagyva; vizsgáknál a nem hiteles XP egyértelmű.
3. **Jog:** a közzétett forrásokhoz rendelkezésre álló engedélyek/licencek felhasználási módra ellenőrizve; adatkezelési tájékoztató és mentésmegtartás írásban elfogadva.
4. **Éles szerver:** változtatás előtt SQL + teljes webhely + privát konfig + külön AI-forrásmentés a webgyökéren kívül, lehetőleg offsite; új telepítő egyben, a fennálló adatok felülírása nélkül; ellenőrzött visszaállítási próba.
5. **Valódi pilot:** tesztadmin küld meghívót, hallgató feliratkozik, megerősíti az e-mailt, két eszközön ugyanabba a fiókba belép, kvízt/fejezetet teljesít, ütközésből szinkronizál, kilép/visszalép; oktatói és hallgatói jogok tényleg elkülönülnek. Fióktörlési próbát csak **eldobható tesztfiókon** szabad végezni.
6. **Kiadás és Git:** ha minden blokkoló igazoltan megszűnt, PR #2 végső diff- és branch-ellenőrzés, csak akkor Draft → Ready, jóváhagyás és konfliktusmentes összevezetés a `main` ágba. Utána ismételt CI és a végleges telepítő kiadása.


## 2026-11-09 – A-23 további technikai ellenőrzés

A Tanársegéd nyitásakor a kérdésmező kap fókuszt; az Escape bezárja a nem modális beszélgetésablakot és visszaadja a fókuszt az indítógombra. A nagyított előre ellenőrzött kottaábra, jegyzetoldal és AI-kép egyaránt valódi, megnevezett modalitású párbeszédablakot használ, nyitáskor a bezárógombra helyezi a fókuszt, Tab-bal a modalitáson belül tartja, majd Escape/gomb után visszaadja a megnyitó elemnek.

A `scripts/browser-smoke.mjs` automatizált próba ellenőrzi a mobil Tanársegédet, az ábra-/jegyzetnagyítást, a fókusz-visszaállítást és a párbeszédablakból való kilépést. A `a6434df2` SHA Chromium, PHP/MySQL+ZIP és Linux workflow-ja teljesen sikeres. Az újonnan hozzáadott **generált képes** eset is igazolt: a `61eaf916` SHA Chromium `42695509995`, PHP/MySQL/ZIP `42695509567` és Linux `42695509794` folyamata **mind sikeres**. A teszt kontrollált képadatot használ, nem éles külső AI-generálást.

**Változatlanul nyitott:** manuális képernyőolvasó, valódi kisegítő technológia, 200%-os zoom, alacsony kontraszt, mobilon fizikai billentyűzet és sötét/világos színtéma vizsgálata. Az A-23 státusza továbbra is **Nyitott kézi**; a jelen bejegyzés nem jelent éles kiadási jóváhagyást.


**A-08 számlálófrissítés:** a korábbi 75/2840 és 104/3806 számok történeti pillanatképek, nem a jelenlegi build értékei. A `fb9860de` PHP/ZIP workflow `42699297596` naplója alapján az új statikus index 104 forráscsoportból 4041 keresési részletet, a PHP export 4228 részletet állít elő; 1793/1793 fogalom, 460/460 szókártya, 439/439 kvízkérdés és 449/449 párosító tétel igazolt. Ezek az eltérő darabolási módszerekből álló számok nem jelentenek önmagukban adatvesztést vagy szakmai teljességet. A külön telepített, licencelt forrásokat a CI nem tudja igazolni.

## 2026-11-09 – A-24 szerveroldali részleges-telepítés- és titokellenőrzés

**Megtalált technikai hiány:** az adminisztrációs `auth/deployment-check` korábban csak a webgyökér és az `api/` könyvtár közvetlen szintjén vizsgált néhány archiválási fájlt, így egy `assets/alappélda/mentés.SQL.GZ`, `.env.production` vagy egy külső szimbolikus link kimaradhatott. A zöld fájlállapot még akkor is megjelenhetett, ha a fájlvizsgálat hiányos volt, illetve a HTML és a PHP API más kiadásból származott.

**Elkészült műszaki védelem:**
- `php/api/deployment-audit.php`: legfeljebb 50 000 bejegyzést és 100 kockázatos találatot feldolgozó, teljes webgyökeret bejáró, szimbolikus linkeket nem követő ellenőrző. Mélyen lévő bizalmas archívumok, `.env.*`, .git/.svn/.hg és külső fájlhivatkozások jelzése. Túl nagy vagy olvashatatlan fa esetén **`scanComplete=false`**, ezért nincs `ready=true`.
- `scripts/stamp-php-release.py`: ugyanannak a ténylegesen buildelt Git-commitnak az azonosítója kerül a `index.html` metaadatába, a `release-build.json` és az `api/release-build.php` fájlokba. A `deploymentBuildFingerprint` olvasási alapon összehasonlítja a három jelölőt; eltérés vagy hiány esetén **`buildConsistent=false`** és **`ready=false`**. A PHP-jelölőt a vizsgálat nem futtatja.
- `src/components/AdminDashboard.tsx`: hiányos vizsgálat, nyilvános titkos fájl és vegyes kiadás esetén külön figyelmeztetés, és csak bizonyítottan egyező kiadásnál zöld fájlkészlet-státusz. Az ellenőrzés nem töröl semmit.
- `scripts/verify-release-assets.py`: a ZIP-összeállítás során is tiltja a rejtett titkokat, tömörített adatbázismentéseket, verziókezelési könyvtárakat, és vizsgálja a három verziójelölő egyezését.
- Külön PHP-s egységteszt, valós MySQL-es bejelentkezett admin HTTP-integrációs teszt, valamint böngészős szimuláció a teljes/hiányos fájlvizsgálatra és az egyező/eltérő kiadásra.

**CI-bizonyíték:** a `fb9860de` állapot teljes kiadási próbája mindhárom workflow-n sikeres: Chromium `42699297630`, PHP/MySQL/ZIP `42699297596`, Linux `42699297595`. Ez az összesített **műszaki részfeladat**, nem az A-24 éles elfogadása.

**Nyitott:** a valós CloudPanel-fájlrendszer ellenőrzése (régi állományok és jogosultságok), a telepítési visszaállítás tényleges kipróbálása, az éles SMTP és azonosított felhasználói szerepkörök, két külön fizikai eszköz, a valódi tanulói adatok megtartása és a jogi/szakmai megfelelés. Az A-24 ezért továbbra is **kiadási blokkoló**, sem `main` összevezetés, sem végleges ZIP-link nem engedélyezett.


## 2026-11-09 – A-16 adatminőségi megerősítés

A korábbi `migrateProgress` és PHP `progressOk` ellenőrzés legfeljebb 120 bájtos azonosítókat engedett, de a teljesen üres vagy kizárólag szóközökből álló `completedChapters`, `favoriteExpressions`, `quizAttempts` és `wrongQuestionIds` tételeket nem szűrte megfelelően. Az új `validProgressId` a böngészőben kizárja ezeket; a PHP `progressIdOk` Unicode-tudatosan, `preg_match('/\\S/u')` segítségével ugyanezt követeli meg. Külön próbák vizsgálják a normál és a nem törhető Unicode szóközt, a fejezet-, kedvenc- és hibás kérdésazonosítókat.

A korábbi `413a485a` SHA-n az első A-16 teljes CI-kör sikeresen lezárult: Chromium `42703393883`, PHP/MySQL/ZIP `42703393577`, Linux `42703393645`. A Unicode-szóközre bővített `976e2f97` változat **mindhárom** CI-folyamata sikeres: Chromium `42703771415`, PHP/MySQL/ZIP `42703771299`, Linux `42703770837`. Ez a műszaki hibásadat-védelem **nem dönti el**, hogyan kell az XP-t történeti, pedagógiai mutatóként kezelni, és nem váltja ki a valódi két eszközös tesztet. Az A-16 nyitott marad.

**E dokumentum önmagában nem zár le új pontot.** A fő auditban két buildoldali pont igazoltan lezárt; a többi lezárásához a fenti ellenőrzésből származó bizonyítékot kell rögzíteni. Végleges letöltési csomagot és `main` összevezetést tilos kiadni a kapuk teljesülése előtt.

## 2026-11-09 – A-17 és A-24 utóellenőrzés: kvízregresszió és SHA-256 fájlintegritás

**A-17:** A korábbi `2152bd64` állapot Chromium CI-je (`42700089199`) a 15 hibás választ váró ellenőrzésnél megbukott. A teszt addig csak a kérdés megjelenő szövegére keresett az összes kérdésbankban, így eltérő válaszkészlethez téves kulcsot társíthatott. A `scripts/browser-smoke.mjs` most a megjelenő kérdés szövegét **és a válaszlehetőségek pontos sorrendjét** együtt azonosítja, igazolja a hibás válasz valódi visszajelzését, és hibánál diagnosztikai adatot ad. A `scripts/test-curriculum-integrity.ts` külön tiltja, hogy azonosan látható kérdés-válasz pároknak eltérő helyes indexe legyen. A megismételt Chromium CI már sikeres, de a kérdésbank teljes pedagógiai lektorálása ettől még nyitott.

**A-24:** A három egyező Git-verziójelölő nem bizonyítja a JS/CSS/PHP tartalmának sértetlenségét. A `release-build.json` most **2-es sémájú** nyilvános ellenőrzőjegyzék: az azonos Git SHA mellett a betöltött JS/CSS belépési állományok és hat kritikus PHP-modul SHA-256 lenyomatát tartalmazza. Az admin `deploymentBuildFingerprint` és a buildoldali `scripts/verify-release-assets.py` ugyanazokat a szükséges fájlokat és lenyomatokat ellenőrzi. Ha akár egy JavaScript vagy PHP állományt véletlenül régi kiadással írnak felül, a verziójelölők egyezése ellenére **`buildConsistent=false`**. PHP-egységteszt és ténylegesen bejelentkezett admin HTTP-integrációs teszt ellenőrzi a sérült JavaScript esetét.

**Bizonyíték:** `6b15eac6ffb58497a1fbffefeb49857d8c984692` SHA – Chromium `42702327442`, PHP/MySQL/ZIP `42702327370`, Linux `42702327534`: **mindhárom sikeres**. Az A-17 és A-24 végleges elfogadása ettől **nem változik**: valódi felhasználói, szakmai és éles CloudPanel/rollback ellenőrzések hiányoznak. Sem `main` merge, sem végleges csomag nem engedélyezett.


## 2026-11-10 – A-17/A-24: további műszaki integritási vizsgálatok

**A-17 – kvízstatisztika:** a `src/progress.ts` és a `php/api/index.php` azonos szabállyal ellenőrzi a hibás kérdésazonosítókat. `wrongQuestionIds` nem tartalmazhat duplikátumot, és száma nem haladhatja meg a `total - correct` értéket (a meglévő maximum 15 mellett). A frontend regressziója a hibátlan, a valóságos 4/5 és a több hibát jelző 4/5 esetet; a PHP/MySQL integráció a szerverrevízió változatlanságát is vizsgálja hibás adatoknál. Az A-17 szakmai jóváhagyása továbbra is nyitott.

**A-24 – fájlintegritás:** a `scripts/stamp-php-release.py`, `scripts/verify-release-assets.py` és a `php/api/deployment-audit.php` ellenőrzőlista immár 12 kritikus PHP-fájlt fed le: a fő alkalmazás- és admin-útvonalat, a Tanársegéd minden saját tartalmi modulját, a PHP tudásindexet és a Composer autoload belépési pontját. A normál HTML-ből hivatkozott JavaScript/CSS belépési fájlokat változatlanul automatikusan felveszi. A regresszió külön kicseréli a képgeneráló PHP-modult és a Composer-betöltőt azonos Git-címkék mellett; hibás fájl esetén a telepítés nem kaphat zöld állapotot.

**Automatizált státusz:** az A-24 kiterjesztés `d98844e9` commitján Chromium `42781697939`, PHP ZIP `42781698058` és Linux `42781697932` sikeres. Az A-17 legutolsó változtatásának a teljes CI-eredményét az aktuális kiadási ág végleges ellenőrzése dönti el. A CloudPanel éles telepítés, visszaállítás, SMTP, két eszköz, zenei szaklektorálás, jogok és kézi akadálymentességi elfogadás továbbra sem igazolt.


## 2026-11-10 – A-06/A-16: szerveres kvízeredmények elsőbbsége az offline összevezetésnél

**Talált hibák:** az `src/progress.ts` `mergeProgress` függvénye a kvízpróbálkozások egyedi `id` mezőjét korábban `new Map([...accountAttempts, ...guestAttempts])` segítségével egyesítette. Azonos azonosítójú rekord esetén a **később beolvasott helyi/vendég rekord nyert**, így régi offline pillanatkép felülírhatta a már tárolt szerveres kvízpróbálkozás tartalmát. További adatminőségi esetben a `quizScores` sima JavaScript objektumba való egyesítése a `constructor`, `toString` vagy `__proto__` nevű JSON-kulcsok öröklött értékeit használhatta, és elveszíthetett egy érvényes pontszámot.

**Javítás és automatizált bizonyíték:** a `mergeProgress` most az azonos `id`-hez tartozó **első, szerveres kvízpróbálkozást megtartja**, miközben az új, egyedi helyi próbálkozásokat változatlanul beemeli. A pontszám-egyesítés `Object.create(null)` kulcstárat használ, amelyet a `migrateProgress` normál adatstruktúrává alakít. A `progress.test.ts` külön igazolja a szerveres próbálkozás védelmét sima importnál, háromutas összevezetésnél és mentetlen helyi pillanatkép helyreállításakor, továbbá az ütköző objektumkulcsok megőrzését.

**CI:** a `cd93c248b2014f81b508f7b9935bc6f2f0b466dd` állapoton mindhárom munkafolyamat sikeres: Chromium `42784207250`, PHP/MySQL/ZIP `42784207070`, Linux `42784207054`. **Korlát:** az új hibákhoz készített ellenőrzések automatizáltak. Az A-06 két külön fizikai eszközt és éles CloudPanel-felhasználói fiókot igénylő elfogadása, illetve az A-16 XP-jelentésének szakmai jóváhagyása továbbra is **nyitott**. Az A-15/A-20/A-21/A-23/A-24 kiadási blokkolók változatlanok.


## 2026-11-10 – A-06/A-16/A-17: gyors kvízinterakció és két böngészős szinkron

**A-17 – kettős kattintás ellen:** a `src/components/QuizView.tsx` szinkron `useRef`-alapú válaszadási és továbblépési zárral kizárja, hogy ugyanazon kérdésben két gyors választás, kétszeri „Következő kérdés”, vagy két „Kvíz befejezése” művelet kétszer pontozzon, kérdést ugorjon át vagy duplikált kvízrekordot mentsen. A `scripts/browser-smoke.mjs` a 15 kérdéses körben egy válasz, egy köztes továbblépés és a végső befejezés azonnal egymás után leadott `element.click()` hívásait szimulálja; a kvíz nem ugorhat kérdést, és csak egy próbarekord keletkezhet. **CI:** `fa4a7a3c38c69b078eb400c4e15ad60bcc9d8dcb` mindhárom munkafolyamat success.

**A-16 – pontszámrekordok biztonsága:** a `getQuizBestScore` csak a kvíztémakörhöz tartozó saját, véges számszerű adatot veszi figyelembe; a `constructor`, `toString`, `__proto__` és korrupt `NaN`/`Infinity` kulcs/érték esetekkel szemben megelőzi a hibás új pontszám mentését. A `progress.test.ts` a megfelelő visszaolvasást és a hibás adatok 0-ra való biztonságos kezelését ellenőrzi. **CI:** `218813be382c9fdc97a1fb965d8ea7a2d4bdca63` mindhárom munkafolyamat success.

**A-06 – valódi klienslogika szimulációja:** a `scripts/browser-smoke.mjs` most két külön Playwright böngészőkörnyezetet futtat egy, a valós `auth/me`/`progress` válaszokat mintázó közös szerver-fixture-rel. Mindkettő azonos, elavuló szerverrevíziót lát, de eltérő `kodaly_pending_progress_*` offline eredményt hordoz. Az első PUT visszatartása miatt a második kliens mentése 409-es ütközést kap, majd Reacten keresztül újrapróbálja az összevezetett állapotot. Csak akkor sikeres, ha **pontosan egy 409**, két sikeres mentés, mindkét új kedvenc megőrzése és egy újratöltési szerveres visszaolvasás is megvalósult. **CI:** `f86a6bdcd09b1d64394d1c38379bf200f981038e` Chromium `42795162233`, PHP/MySQL/ZIP `42795162134`, Linux `42795162417` – mind success.

**Kiadási határ:** a két böngészőkörnyezetes E2E nem két fizikai eszköz és nem a valós CloudPanel-fiók próbája. A-06 éles elfogadása, A-16 XP-értékelési döntés, A-17 szakmai kvízlektorálás és A-15/A-20/A-21/A-23/A-24 kiadási kapu továbbra is nyitott. `main` merge és végleges letöltés tilos.


## 2026-11-10 – A-08: szöveghű, Unicode-biztos AI-index és teljes tananyagparitás

**Megtalált valódi hibák:** a `scripts/export-php-knowledge.ts` korábban `String.slice` művelettel 1200 **UTF-16 kódegységenként** darabolta a magyar források és egyetemi jegyzetek szövegét. Ez a `𝄞` kottajel, az emojik és az összetett ékezetek egyes határhelyzeteiben érvénytelen Unicode-karaktereket okozhatott. Az export a `<=30` karakteres utolsó darabokat eldobta, a tananyagból pedig az első 5000 kódegységnél hosszabb részt levágta. A PHP-tananyagban az eredeti leckék hangszeres példái, hangzó jegyzetei és idézetei korábban hiányoztak, pedig ezek a statikus keresőben részben szerepeltek. A statikus `server-knowledge.ts` hosszú bekezdéseinél is volt UTF-16-os határvágás.

**Elkészült kód:** `scripts/knowledge-chunks.ts` `Intl.Segmenter('hu', { granularity: 'grapheme' })` alapú, szövegvesztés nélküli darabolót ad. Az exportált darabok összefűzése az eredetit adja, a rövid záró szövegrészek és a határokon átívelő grafémák sem vesznek el. A PHP-tananyag indexelése most az alfejezet teljes szövegét, az összes ismert `examples.notes`, `examples.audioNotes` és forrásmegjelölt idézet szövegét tartalmazza; az elágazó, 5000 karakteres levágás megszűnt. A statikus Node kereső is teljes grafémáknál bontja a hosszú bekezdéseket.

**Új automatizált lefedettségi kapu:** `scripts/test-knowledge-chunks.ts` teszteli a négybájtos zenei jeleket, kombináló magyar ékezeteket, emoji-sorozatokat és a rövid forrásvégeket. A `scripts/verify-php-knowledge-parity.ts` az exportált PHP-indexben mind a **15** tényleges tananyag-alfejezet teljes szövegét példákkal és idézetekkel egyezteti; a `server-data` tanár által jóváhagyott forrásainál **395 forrásoldal-csoportot** rak össze az indexből és hasonlít össze betűhíven az eredetivel. A hét eredeti tanulói adatbank `assertBank` ellenőrzése változatlan, a 1793 elemű fogalomtár is teljes.

**CI-bizonyíték:** `80d31fea641cfaf2cffd00bfb64d6c02674e94fb` commit: Chromium `42847943126`, PHP/MySQL/ZIP `42847943232`, Linux `42847943224` – **mindhárom sikeres**. Napló: statikus 4041 részlet, 104 csoport, 0 hiányzó kötelező fájl; PHP-index 4249 részlet; 15/15 alfejezet, 395 eredeti szöveggel egyező forrásoldal-csoport, mind a hét tanulói adatbank teljes.

**Nyitott kiadási feltételek:** a CI a helyben rendelkezésre álló források szöveghűségét bizonyítja, nem a külön éles CloudPanelen tárolt források jelenlétét, a hallgatói válaszok szakmai minőségét vagy a szerzői jogi felhasználási engedélyeket. A-08 nyitott, és A-15/A-20/A-21/A-23/A-24 továbbra is blokkol; nincs `main` merge vagy végleges letöltés.


## 2026-11-10 – A-08/A-24: privát tanári források teljes szöveghűsége és biztonsága

**Valódi hiba:** a PHP `tutorExtraKnowledge()` a külön adminisztrátori feltöltéssel jóváhagyott magyar szövegeket a korábbi mondat-/bekezdésbontás során módosította. A `tutorSourceUtf8Pieces()` `trim()` hívása eltávolította a bekezdés eleji és végi szóközöket/sortöréseket; a rövidebb, 40 bájt alatti önálló bekezdések (például egy rövid szolmizációs példa) kimaradhattak az indexből. Egyes karakterhatárokon a kódpontszintű vágás az `e + kombináló ékezet` vagy a zenei emoji-szekvencia látható egységét is kettészakíthatta.

**Javítás:** a PHP `tutorSourceUtf8Pieces()` most az eredeti szöveg nyers részleteit őrzi, és a 900 bájtos darabolási határt a teljes Unicode-grafémához igazítja, ha lehetséges. A `tutorExtraKnowledge()` a tanár által jóváhagyott szöveget hiánytalanul indexeli: a bekezdések közötti eredeti CRLF/LF és szóközök, a rövid fejezetcímek és zenei példák nem vesznek el. Az automatikus forrásfeldolgozás többé nem alkalmazza a korábbi 40 bájtos küszöböt.

**Biztonsági javítás:** a `tutorSourceList()` kizárja a forráskönyvtáron kívülre mutató symlinkeket, a 330 000 bájtnál nagyobb JSON-állományokat, a hibás cím-/szövegtípusokat, a rossz UTF-8-at és a NUL bájtot tartalmazó rekordokat. A tartalmuk nem kerül a Tanársegédbe. Ez a helyi fájllista ellenőrzése; nem jogosít állításra az éles CloudPanel biztonságáról.

**Új regresszió:** `scripts/test-php-tutor-sources.php` az indexelt szöveg összefűzését az eredeti magyar UTF-8 szöveggel egyezteti, beleértve a 900 bájtos határ környéki `𝄞` és `👩‍🎼` jeleket, a kombináló ékezetet, a rövid `Dó–ré` példát, a sortöréseket és a rövid forrásvéget. A biztonsági teszt külső JSON-fájlra mutató szimbolikus hivatkozást és hibás JSON-szerkezetet helyez a forrásmappába; a forráslistának és a Tanársegéd-indexnek ezeket ki kell zárnia.

**CI-bizonyíték:** a `32d26dc6e84880a66e7fad2e77249ac49d3ad6ca` SHA-n Chromium `42850213678`, PHP/MySQL/ZIP `42850213955`, Linux `42850213088` – **mindhárom sikeres**.

**A-08 és A-24 továbbra is nyitott:** a valódi CloudPanelen tárolt külön források ellenőrzése, SMTP, visszaállítási próba, jogok, lektorálás, két fizikai eszköz és kézi akadálymentesség nem igazolt. Nincs `main` összevezetés és nincs végleges letöltés.
