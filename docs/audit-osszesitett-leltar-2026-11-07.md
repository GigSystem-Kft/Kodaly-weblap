# Zeneelméleti Műhely – összevont auditleltár (v1.2)

Kezdő dátum: 2026-11-07. Legutóbb frissítve: 2026-11-09. Forrás: a 2026-11-07-i 18 pontos kódaudit és a további 6 ellenőrzési terület. A-19–A-24 vizsgálati hatókör, nem mind igazolt hiba.

**A korábbi javítási egységek korabeli, történeti állapotjelentések; az aktuális helyzetet az alábbi A-01–A-24 táblázat és a legutolsó egység mutatja.**

**Változtatási szabály:** meglévő tanulói adatokat nem törlünk; éles kiadás előtt CI + szerepkörös és telepítési ellenőrzés; státuszt csak bizonyíték alapján zárunk.

| Prioritás | ID | Téma | Állapot |
|---|---|---|---|
| P0 | A-01 | 13 ritmikai oldalkép hiányzik a kiadásból | MEGOLDVA: 13 eredeti, Git SHA-val bájtpontosan ellenőrzött JPG feltöltve a fejlesztési ágra; 42422196761 teljes PHP-telepítő CI sikeres |
| P0 | A-02 | Tankönyvkereső ékezet- és szóközkezelése hibás | Kódjavítás; magyar ékezet/kisbetű/szóközkeresés Chromium E2E sikeres; éles webhely ellenőrzése hátra |
| P0 | A-06 | Párhuzamos profilmentések felülírhatják egymást | CAS, 409/újrapróba, fiókizoláció és UTF-8 ID-k; 1 MB szervernapló mellett a kétpéldányos offline helyreállítás 3 MB-os UTF-8 korlátot kapott, 7000 alfejezetes regresszióval és 3/3 zöld CI-vel. Két fizikai eszközös éles próba hátra |
| P0 | A-18 | Release csomag teljessége nincs ellenőrizve | MEGOLDVA a build oldalán: 302 tankönyvoldal, 13 ritmikai és 64 jegyzetkép mellett kötelező PHP-modulok, tudásindex, JS/CSS-hivatkozások és tiltott webgyökéri ZIP-archívum ellenőrzése; éles feltöltés teljessége külön teszt |
| P1 | A-03 | 04/05 tesztkategóriák hiányoznak | Mindkét témakör Chromiumban megjelenik; a vegyes 15 kérdéses, 0 pontos kör a teljes hibajegyzékkel oldalfrissítés után is megmarad, UI/TS/PHP/MySQL regresszióval. Teljes feladatbanki szakmai értékelés hátra |
| P1 | A-04 | Alfejezet-teljesítések nem íródnak | Manuális fejezet-/alfejezetjelölés és tanulási állapotmegőrzés, Chromium E2E zöld; éles fiókos próba hátra |
| P1 | A-05 | Párosító teljesítési naplója hiányzik | Stabil pár-ID-k és idempotens XP; a teljes párosító kör, hibás válasz, újraindítás, egyedi feliratok és gyors újraválasztás Chromium E2E sikeres; éles fiókos eredménymentés és manuális hozzáférhetőség hátra |
| P1 | A-07 | 09. fejezet hiányzik a PHP AI forrásriportból | Az élő PHP-jelentés külön megmutatja a 09. fejezet 1793 fogalmának indexelési darabszámát; a kiadási PHP build hiány esetén leáll. Kiadás előtti éles ellenőrzés hátra |
| P1 | A-08 | Statikus AI leltár eltér az élő index mérésétől | Élő és statikus riport elkülönítve, hét teljes tananyagbank tételes indexparitása CI-vel védve; az 1793 címszavas szótár forrásmegnevezése a PHP/Node változatban már egységes és jelzi a részleges lektoráltságot. Éles forráscsoport-szintű ellenőrzés még szükséges |
| P1 | A-09 | PHP Tanársegéd fallback kereső, nem Gemini chat | Opcionális, alapból kikapcsolt Gemini PHP-útvonal mellett a helyi magyar kereső felismeri a kvintkörről, szinkópáról, hexachordokról/hexakordokról ragozott kérdéseket; a magyar ékezetes válaszokat UTF-8 karakterhatáron rövidíti, külön PHP regresszióval. Élő API- és szakmai választeszt hátra |
| P1 | A-12 | Csak öt alapfejezet teljesítéskövetése teljes | Mind a kilenc tananyagegység közös számlálóban, 6–9. fejezet saját kártyáján a teljesítési állapot; Chromium útvonal-, jelölés- és oldalfrissítéses teszt sikeres. Éles hallgatói elfogadás hátra |
| P1 | A-21 | Vendég/hallgató/tanár/admin end-to-end életút | Adatizoláció és szerepkörök PHP/MySQL CI-vel; régi auth/me nem írja felül az új bejelentkezést, és a sikeres login utáni sikertelen progress GET a félig nyitott munkamenet visszavonását váltja ki (Chromium E2E zöld). Valódi SMTP/CloudPanel és két fizikai eszköz próba hátra |
| P1 | A-24 | Valós telepítési E2E és regressziótesztek | Admin-only olvasható telepítés-önellenőrzés (hiányzó PHP/JS/CSS és publikus backup), jogosultsági/MySQL- és Chromium-próbával. A teljes fejlesztői CI 42536887023 / 42536887004 / 42536887006 sikeres; CloudPanel új verzió, SMTP és két fizikai eszköz továbbra sincs élesen igazolva |
| P2 | A-10 | Szótári taxonómia túl sok Egyéb elemmel | BESOROLÁS KÉSZ: mind az 1793 tétel 12 konkrét kategóriában, 0 Egyéb; 945 tétel átsorolva, új általános nyelvi kategória. Eredeti szöveg/azonosítók változatlanok; független zenetudományi lektorálás hátra |
| P2 | A-11 | XP kliensoldalról tetszőlegesen halmozható | A kliens már naplóbejegyzés létrehozásakor elutasítja a nem létező dátumot, egész XP-re kerekít és 100 milliós felső korlátot alkalmaz; PHP ugyanezt validálja, regresszió CI-zöld. Az XP továbbra is gyakorlási pont, nem hiteles vizsgaeredmény; anti-cheat nyitott |
| P2 | A-13 | Párhuzamos, egyenetlen tananyag-adatforrások | 5 alap- és 4 bővített modulkatalógus, egységes 5 fejezetes alfejezeti útmutatók; önellenőrzési válaszok alfejezetenként elkülönítve, teljes szakmai szerkesztői egyeztetés hátra |
| P2 | A-14 | H/B hangnevek és MIDI megfeleltetése | WebAudio B/H megfeleltetés és G5 (783,99 Hz) javítva; a nagy szeptim hangsor H4-re javítva; teljes 12-TET és 12 hangköz frekvenciateszt bekerült; további lejátszás-E2E hátra |
| P2 | A-15 | Kotta/média URL licenc és forrásellenőrzés | OSZK és LFZE forráshelyesbítések, 8 Commons-képfájl jogállásleltára, 1927-es Bartók portré; történeti tónárium pontosítva. Tankönyv/1979-es kottakiadás jogi ellenőrzése hátra |
| P2 | A-16 | Progress egyesítés max XP szabálya nem nyilvánvaló | A két eszköz profil- és kedvenc-összevezetése után újra érvényesülnek a szerverhez igazított adattípus-, lista- és UTF-8 hosszkorlátok, hibás offline kedvenc megtartása nélkül; a történeti XP-eseménynapló és oktatói elfogadás nyitott |
| P2 | A-17 | Kérdésenkénti tesztmetrikák hiányoznak | A 15 kérdéses kvíz most mind a 15 rontott feladat ID-ját megőrzi (korábban 12-re csonkolta), szerveroldali 15 elfogadva / 16 visszautasítva; Chromium E2E oldalfrissítéses próba és regresszió zöld. Pedagógiai értékelés hátra |
| P2 | A-19 | Teljes menü- és navigációs mátrix | Tankönyvek, billentyűzetes alapfejezetek és mind a négy bővített fejezet Chromium bejárása és jelölésének frissítés utáni megőrzése; a kilencegységes főoldali számláló is tesztelt. Teljes manuális navigáció/akadálymentesség hátra |
| P2 | A-20 | Szakmai egyezés: definíció, kotta, hang, teszt, AI | Kvart/kvint párosító pontos félhangmeghatározás és egységes kategória stabil ID-val; minden kvíz/szókártya/párosító/hangsor/hangkészlet/kvintkör/fogalomtár PHP-indexbe kerülése tételes egyezésteszttel igazolt. Független szakmai lektorálás hátra |
| P2 | A-22 | Egységes pedagógiai teljesítési/értékelési rendszer | 15 kérdéses témaköri gyakorlókörök, egyedi válaszlehetőségek, témakörönkénti 3+3 korábbi kör trend; pedagógiai értékelési standard hátra |
| P2 | A-23 | Reszponzivitás, sötét/világos téma, kontraszt, WCAG | Kibővített axe WCAG 2.1 AA Chromium-teszt: 04/05 kvíz, adminisztráció, fióktörlés, mobil Tanársegéd és korábbi oldalak; minden vizsgált képernyőn 0 súlyos/kritikus hiba. Manuális és sötét téma audit hátra |

## Első javítási csomag

- A-02: Unicode combining mark regex és szóköz szerinti tokenizálás javítása a `TextbookView.tsx` állományban.
- A-03: 04/05 fejezet kategóriáinak hozzáadása; a lista kizárja azokat a kategóriákat, amelyekben nincs kérdés.
- A-01/A-18: `php-release.yml` ellenőrzi, hogy a `release/ritmikai/p001.jpg` – `p013.jpg` mind létező, nem üres fájl-e; a jelenlegi hiány esetén a build megáll, nem ad ki hibás ZIP-et.

**Negyedik javítási egység:** A-23 első akadálymentességi javítás: a fejléc főoldalra visszalépő eleme billentyűzettel is aktiválható. A teljes WCAG és mobil ellenőrzés továbbra is hátra.

**Harmadik javítási egység:** A-08 élő PHP-lefedettség és statikus buildleltár különválasztása; A-09 Tanársegéd üzemmód egyértelműsítése; A-12 négy bővített modul manuális teljesítési jelölése; A-16 XP-max tájékoztató.

**Második javítási egység:** A-04/A-05/A-07 kódjavítás, valamint A-06 verzióazonosítós feltételes szervermentés, 409-es konfliktusválasz és böngészős összevezetés. A késznek minősítéshez CI, valódi párhuzamos eszközös teszt, PHP kompatibilitás és éles adatmegőrzési próba szükséges.

**Fontos:** az első csomag nem helyettesíti a 13 jogszerűen felhasználható képfájl beszerzését és felvételét. Az éles weboldal és a belépett felhasználók nincsenek validálva. A-06 biztonságos, migrációt igénylő következő feladat. Korábbi CI-kör: a TypeScript/egységteszt/PHP/build lépések sikeresek, a ZIP-összeállítás a hiányzó 13 ritmikai kép miatt elbukik. Az új commitok aktuális CI státuszát külön kell ellenőrizni.

## Ötödik javítási egység (2026-11-07)

- A-06: a PHP szerver friss mentés után a MySQL JSON-mezőből visszaolvasott adat alapján adja a revisiont; új izolált MySQL integrációs teszt vizsgálja az első mentést, ismételt mentést, hiányzó revision elutasítását és elavult kliens 409 válaszát. **MySQL-fiók integrációs teszt CI-sikeres; valós többeszközös böngészőpróba még hátra.**
- A-18: a PHP csomagképek ellenőrzése Python manifest-szkripttel bővült; a 4 tankönyv 302 indexelt oldala és megfelelő képei, a 64 jegyzet-JPG és a 13 ritmikai JPG szükséges. A hiányzó képek továbbra is kiadásblokkolók.
- A-19/A-23: a tankönyvmenü érintéssel nyitható, Escape-pel zárható; a menüpontok kijelölése zárja a menüt.
- A-03: üres kérdésbank esetén kezelhető üzenet jelenik meg, nem omlik össze a teszt.

**Kiadási tény:** a legutóbbi megvizsgált PHP Actions-futtatásban (42408457312) a TypeScript/egységteszt, a PHP szintaxis/tesztek, a MySQL fiók- és progress-tesztek és a frontend build sikeresek voltak. A ZIP összeállítása továbbra is blokkolt a média-manifeszt miatt. Egy korábbi Linux telepítőcsomag sikeres volt. A sikeres Linux build nem jelenti a PHP produkció készségét. Éles szerver, tényleges felhasználói adatok és minden média URL ellenőrzése továbbra sem történt meg.

## Hatodik javítási egység (2026-11-07)

Az eredeti MTA–SZTE 13 oldalas PDF a korábbi feltöltések között megtalálható. SHA256: `eddb1e3a0e8ec9e6135d5e7b3f1807e9728df2399a5258a870b1d9d4d55dc3aa`. A forrásfájl `pdfinfo` szerint 13 oldal, és helyben 13 JPG oldal előállítható. A hivatalos egyetemi webcím 2026-11-07-én nem PDF-et, hanem hibás HTML-választ adott még a GitHub Actions környezetben is; ezért az online letöltést nem tesszük a kiadási folyamat részévé. A 13 helyben renderelt képfájl GitHubba történő bináris feltöltése továbbra is szükséges. A manifest addig szándékosan blokkolja a PHP ZIP-et.

## Hetedik javítási egység (2026-11-07)

- A-17: a korábbi `quizScores` legjobb eredmények változatlanul megmaradnak; opcionális, legfeljebb 100 eseményes `quizAttempts` került az adatmodellbe, kliens migrációba, összevezetésbe, PHP-adatellenőrzésbe és személyes profilba. Kvíz-témakör, dátum, eredmény, helyes/összes rögzül, tanulási naplóként, nem hiteles vizsgamérésként. Kérdésenkénti hibák, időtartam és statisztikai trend részletei még fejlesztendők.
- A-21: a `teacher` és `student` admin-jogosultságának megtagadására készült teszt CI-sikeres.

## Nyolcadik javítási egység (2026-11-07)

- A-20: automatikus tananyagintegritási teszt ellenőrzi az 5 alaptananyag és a 4 bővített modul azonosítóit, az alfejezeti tartalom meglétét, a kérdésbank kategóriakapcsolatait és válaszindexeit, valamint a szókártya- és párosítóazonosítók egyediségét. A teljes szakmai-kottai-zenei egyezés ettől még nem tekinthető lezártnak.

## Kilencedik javítási egység (2026-11-07)

- A-11: az XP kizárólag játékos gyakorlási pont, nem hitelesített kompetenciaérték; a profil ezt világosan kommunikálja. A szerveroldali anti-cheat és egységes pontszabályzat továbbra is nyitott.
- CI bizonyíték: GitHub Actions 42409475820 futásban a TypeScript, egységteszt, PHP ellenőrzés, MySQL fiók- és szerepkörteszt, frontend build sikeres, a hiányzó ritmikai JPG-k miatt a PHP telepítő ZIP blokkban meghiúsult. Ez nem jelenti a teljes produkció megfelelőségét.

## Tizedik javítási egység (2026-11-07)

- A-10: a 1793 címszavas glosszárium 62 egyértelmű, a definíciója alapján biztosan besorolható tételét átvezettük két új és három meglévő kategóriába. Minden címszó, eredeti meghatározás és stabil ID megmaradt. A feladatbankok új kategóriaelemei a régebbi gyakorlatok sorrendjének megtartásával bővültek. Az első CI-regresszió új kategóriás kártyahiányt jelzett, ezt a korlát és sorrend javításával kezeltük; a 42411290126-os PHP CI-futtatásban az egységtesztek sikeresek; a kiadási ZIP még hiányzó képek miatt blokkolt.
- A-14: a Web Audio motorban B3, B4 és B5 tévesen H természetes frekvenciáján szólt. Most a magyar B nemzetközi B♭-ként, a H természetes B-ként szól. Oktávonkénti regressziós teszt készült.
- A-15: történeti médiaforrásoknál HTTPS-t, képi forrásoldalt, licencmegjegyzést, történeti korszak-ID-t és videók elérhetőségi tájékoztatását automatikusan ellenőrizzük. A konkrét videók elérhetőségét nem igazolja az offline teszt.
- A-17: a kvíznapló már legfeljebb 12 elrontott kérdés azonosítóját is megőrizheti próbálkozásonként, és a profil ezeket a feladatbankban szereplő kérdésszöveggel jeleníti meg. Többeszközös összevezetés és PHP-validáció kiterjesztve, új regresszióval.
- A-13/A-20: a struktúraellenőrzés nem helyettesíti a teljes tartalmi és zenetörténeti lektorálást.
- A-01 továbbra is P0 blokkoló: a 13 JPG helyben elkészült, de GitHubba történő feltöltésük nincs igazolva. A telepítő nem adható ki hiányos képekkel.

## Tizenegyedik javítási egység – CI ellenőrzés

- A 42411290104 GitHub Actions Linux telepítő munkafolyamat sikeres.
- A 42411290126 PHP telepítő munkafolyamatban a TypeScript- és egységtesztek, PHP és MySQL integráció, valamint a frontend build sikeres; a `Assemble root-ready CloudPanel ZIP` lépés hibával leáll a hiányzó médiák miatt.
- A 62 kategóriaátvezetés után a korábbi gyakorlóbankok előnyben részesített sorrendje helyreállt, a kártya- és párosítóbank pedig a két új csoportot is felveszi.
- A-15: az OSZK Zeneműtár és négy Commons-portré forrásoldala hozzáférhető volt webes ellenőrzéskor; a YouTube/archív videók tényleges lejátszhatóságát nem bizonyítja a webes metadata-lekérés.
- **Nincs release-teljesítés, nincs main merge.**

## Tizenkettedik javítási egység (2026-11-07)

- A-06: hálózati mentési hiba után a bejelentkezett fiók nyitott oldalán 15 másodpercenként megismétlődik az elmaradt mentés; online állapot visszatérésekor azonnali próbálkozás történik. A fiókpanel kézi újrapróbálási gombot is kínál. A korábban megvalósított revision/409 összevezetési védelem változatlan. **A bezárt böngészőnél vagy éles többeszközös esetben a teljes adatbiztonság nem bizonyított.**
- A-19: automatikus teszt vizsgálja a főmenü oldalazonosítóit, az 5 tankönyv nézetét és a négy bővített modulhoz tartozó útvonalat.
- A-23: szókártyák megfordítása Enterrel és szóközzel is működik; hiányzó témakörben nem omlik össze a szókártya és a párosító nézet; a már megtanult kártya nem hirdet újabb XP-bónuszt, a párosító gombok kijelölési állapotot jeleznek a segítő technológiáknak.
- A késznek minősítés továbbra is csak a teljes, bizonyított éles E2E és P0 kiadási folyamat után lehetséges.

## Tizenharmadik javítási egység (2026-11-07)

- A-09: a PHP Tanársegéd a helyi, ellenőrzött keresés mellett új, **kifejezetten engedélyezhető** generatív szövegválaszt is támogat. A `tutor_text_generation` konfiguráció alapból `enabled=false`, az API-kulcs kizárólag a nem nyilvános PHP-konfigurációban található. A modell fix allowlisten van, a kérdések külső továbbítása csak bejelentkezett hallgatónál, külön throttle mellett történhet. A rendszer a külső modellnek legfeljebb három első félhez tartozó tananyagrészletet küld; elkülönítetten licencelt könyvszöveg vagy személyes előrehaladás nem része a kérésnek. A generatív válasz forráslistája szerveroldalról készül. Hiba vagy hiányzó forrás esetén a meglévő PHP helyi tanársegéd válaszol. `store=false` API-tulajdonságot adunk át a szolgáltatónak.
- A felület a generatív módnál jelzi a Google-szolgáltatóhoz történő adattovábbítást és a bejelentkezési feltételt. Éles üzem előtt szükséges adatkezelési és szolgáltatási költségkeret jóváhagyása, a nem nyilvános konfiguráció tényleges megadása, modellélőteszt és pedagógiai válaszminták értékelése.
- Fontos: az új útvonal **nem bekapcsolt éles AI**. A működési állapotot a `chat/status` jelzi, a kód konfiguráció nélkül csak helyi forráskereső marad.

## Tizennegyedik javítási egység (2026-11-07)

- A-23: a Tanársegéd felugró ablaka már a `100vw` szélességből és a `100dvh` magasságból számított méretkorlátot alkalmazza; kis mobilképernyőn nem lóghat túl a megjelenítési területen.
- A-09: a PHP CI beemelte a különálló `tutor-text-generation.php` fájlt a kiadási csomagba, hozzáadta a PHP-szintaxist és az opt-in/adatvédelmi unit tesztet. A MySQL nélküli tanársegéd teszt ideiglenes könyvtárába is bekerül a modul. A következő CI eredménye még ellenőrizendő.
- A P0 médiahiány miatt a teljes PHP telepítő továbbra sem tekinthető késznek.

## Tizenötödik javítási egység (2026-11-07)

- A-22: a fejezetenkénti és vegyes kvízek legfeljebb 15 kérdésből álló, újraindításonként újraválogatott gyakorlókörök. A teljes, korábban hosszú feladatsor helyett a tanuló rövid, megismételhető gyakorlást kap. A `vegyes-gyakorlas` külön mentési azonosítóval rendelkezik, ezért nem írja felül a régi, teljes kérdésbankra vonatkozó `all` eredményt. A tanulási pont továbbra sem vizsgaminősítés.
- A-06: hálózati hiba miatti mentetlen fiókprogressz esetén böngészőzárási figyelmeztetés készült, de bezárt böngésző után még nem bizonyított a teljes adatmegőrzés.
- A #2 PR továbbra is draft, a főág érintetlen.

## Legutóbb ellenőrzött CI eredmény

- 2026-11-07, GitHub Actions `42413149677`: Linux telepítőcsomag **sikeres**.
- 2026-11-07, GitHub Actions `42413149871`: TypeScript, PHP és MySQL tesztelések, frontend build **sikeresek**; a PHP ZIP végső `Assemble root-ready CloudPanel ZIP` lépése **sikertelen**, mivel a hiányzó ritmikai JPG-k miatt a média-manifeszt blokkolja a kiadást.
- A P0 médiaszállítás és éles E2E nem teljesült. A #2 PR továbbra is draft; **main merge nem történt**.

## Tizenhatodik javítási egység (2026-11-07)

- A-10: 127 további, magyar definíció alapján teljes biztonsággal felismerhető fogalmat helyeztünk át a tempó, karakter, hangszer/technika, harmónia, műfaj és előadásmód kategóriákba. Összesen 189 ilyen besorolást javítottunk, 756 „Egyéb” elem maradt. Az 1793 eredeti fogalom meghatározásai és ID-jei változatlanok.
- A-13: az ismételten kimaradó kvízfejezetek elkerülésére a kategóriaválasztó az öt `MUSIC_CHAPTERS` és négy `EXTRA_LEARNING_MODULES` definíciójából épül; nincs külön kézzel szinkronizálandó fejezetlista. Regressziós teszt igazolja a 04/05 és 07/09 témákat.
- A-18: a kiadási médiaellenőrző az elnevezés/létezés mellett a JPEG fejléceket, zárójelölőket és minimális méretet is ellenőrzi. Ez akadályozza, hogy hibás HTML oldalt képnek álcázva kiadjon.
- A-23: a tankönyvoldalak nagyított nézetébe belépéskor a bezárógomb fókuszt kap, Tab-bal a párbeszédablakon belül lehet navigálni, és bezáráskor visszatér a megnyitó gombhoz. A keresőmező hozzáférhető címkét kapott.
- A-01: a második egyetemi PDF-hivatkozásból letöltött fájl SHA-256-ja nem egyezik az eredetivel. A bizonytalan eredetű fájl importját nem folytattuk; a kiadási kapu továbbra is blokkol a 13 GitHubban hiányzó JPG miatt.

## Tizenhetedik javítási egység (2026-11-07)

- A-17: a gyakorlókörök eltelt ideje is menthető `durationSeconds` adatként, visszamenőleg kompatibilis opcionális mezővel. A PHP adatellenőrzés és a kliensmigráció legfeljebb 10 órás egész másodpercértékeket fogad el, a profil a gyakorlás idejét perc/másodperc formátumban megjeleníti. Új teszt védi az értékvesztés és a hibás/időben túlzó mezők ellen.
- A-13: a kvízmodul kategóriái automatikusan az alap- és kiegészítő modulkatalógusból származnak; egyesítési/CI próba hátra.
- A-01/A-18: a teljes GitHub release-t továbbra is meggátolja a repóból hiányzó 13 eredeti ritmikai oldalkép. A hiba nem hallgatható el vagy kerülhető meg minőségromlással.

## Tizennyolcadik javítási egység (2026-11-07)

- A-24: új `.github/workflows/browser-smoke.yml` kötelező PR ellenőrzésként (vagy kézzel) futtatja a `scripts/browser-smoke.mjs` Playwright Chromium-tesztet. A teszt a vendégoldal, a szókártya Enter-rel történő megfordítása, a párosító, a 04-es témakör tesztje, az 1. tankönyv keresője és képnagyítója, valamint a 390 px széles mobilos Tanársegéd képernyőn maradása irányában ad tényleges UI-ellenőrzést. **A 42415123945 futásban a vendég/szókártya/játék/04 kvíz/tankönyvkereső/mobil AI tesztek sikeresek. A következő bővítés a vendégprofil és a mobilos érintőképernyős tankönyvmenü bejárását is ellenőrzi.**
- A-23: a mobilon ikonméretű Tanársegéd-nyitógomb hozzáférhető `aria-label` címet kapott.
- A-01: a 13 oldalképből a helyi fejlesztői környezetben megvan az eredeti PDF alapján renderelt változat; a `scripts/render-rhythm-research-pages.sh` most az eredeti SHA-256 egyezést is kötelezően ellenőrzi, így rossz/módosított PDF-ből nem lehet kiadási képet előállítani.

## Tizenkilencedik javítási egység (2026-11-07)

- A-19/A-24: az első Playwright E2E feltárt egy hibát: asztali egérmutatóval a tankönyvmenü megnyitása után a kattintás bezárta a legördülő menüt, mert a hover és kattintás kétszer kapcsolta ugyanazt az állapotot. A menü nyitási szabályát javítottuk; a `42415123945` Chromium CI ezt és a kvízt, szókártyát, nagyított tankönyvoldalt és mobil AI-panelt sikeresen ellenőrizte.
- A-24: újabb mobil `isMobile/hasTouch` és vendégprofil E2E kiterjesztés készült, CI-eredmény még ellenőrizendő.
- A-01 változatlan: a helyben elkészült 13 eredeti PDF-oldalkép még nincs GitHubba beemelve. Biztonságos, SHA-ellenőrzött `scripts/commit-rhythm-original-pages.sh` segédszkript kész a fejlesztési ágon történő beemeléshez, az eredeti PDF a szerkesztő gépén szükséges.

## Huszadik javítási egység (2026-11-07)

- A-21/A-24: GitHub Actions `42415390838` Chromium füstteszt **sikeres**. Valódi böngészőben ellenőrzi a vendég menüit, a kvízt, az 1. tankönyv keresését és nagyított oldalát, a szókártyákat, a párosító felületet, a tanulási profilt, a mobilos `hasTouch` tankönyvmenüt és a mobil AI-ablak képernyőn belül maradását. A hallgató/tanár/admin navigációt mockolt API-válaszokkal validálja; a szerver PHP/MySQL-fiók- és jogosultsági regressziója ettől külön fut.
- A-01/A-18: a hiányzó 13 JPG problémája változatlan; a helyi forrás SHA-256-ellenőrzött importja és kizárólag a fejlesztési ágra történő push előkészítve. A teljes kiadás és main merge még nem engedélyezett.

## Huszonegyedik javítási egység (2026-11-07)

- A-10: további 69, pontosan egyező magyar fogalommeghatározással alátámasztott kifejezést soroltunk át a hangszertechnika, tempó, műfaj, előadásmód, díszítés és kottaírás kategóriáiba. Eddig összesen 258 átsorolás történt, 687 „Egyéb” tétel maradt. Az eredeti fogalmak és definíciók nem módosultak. A teljes szakmai taxonómiai lektorálás ettől még nem kész.
- A-16/A-21: a fogalomtári kedvencek korábban csak komponenslokális állapotban éltek, és oldalváltás után eltűntek. Opcionális, visszamenőleg kompatibilis `favoriteExpressions` adattal bekerültek a fiók- és vendéghaladásba; szerveroldali korlátozás, migrációs és többeszközös egyesítési teszt készült. A kedvencek eltávolítása párhuzamos konfliktus esetén külön UX-ellenőrzést igényel.
- A-01: a 13 eredeti oldalkép a jelen futásban elérhető munkakönyvtárban ellenőrzött PDF-ből elkészült, ám a GitHub csatlakozás nem fogad fájlrendszerútvonalat; a bináris GitHub push egyelőre nem történt meg. A kiadási védelem változatlan.

## Huszonkettedik javítási egység (2026-11-07)

- A-06: a kedvencek összevezetése most a legutóbb sikeresen mentett, a szerver új és a kliens új állapota között háromutas; a helyi kedvenc-törlést nem állítja vissza egy másik eszköz új eleme. A vendégeredmények külön, törlés nélküli egyesítést használnak. Kijelentkezés előtt figyelmeztet a rendszer a szerverre még fel nem töltött tanulási eredményekre.
- A-11: idempotens párosítójutalom minden új páronként 5 XP és körönként maximum 50 XP. Hallásfejlesztés legfeljebb napi 100 XP, a folytatólagos gyakorlás pont nélkül is működik. Visszamenőleg kompatibilis, napi dátumkulcsú napló; a PHP ellenőrzi a mező alakját és korlátját. Nem állítjuk, hogy ez szerveroldali hitelesített vizsga- vagy anti-cheat rendszer.
- A-17: a korábban hibásan megoldott kvízkérdésekhez a profil a tényleges kérdésbankból kiolvassa a helyes válasz szövegét és magyarázatát, így érdemi felzárkóztató ismétlés lehetséges.
- A-02/A-23/A-24: a Playwright teszt ékezet/kisbetű/szóköz normalizálási böngészős próbával bővült, és az `@axe-core/playwright` WCAG 2.1 AA súlyos/kritikus szabálysértéseit ellenőrzi. Konkrét hibák nyomán a főoldalon, fejezetlistában, láblécben és tankönyvolvasóban kontrasztjavítás, a látható felirat és az akadálymentes név egyeztetése történt. A `42419439591` tesztben a főoldal/kvíz/tankönyvolvasó 0 WCAG-figyelmeztetést adott, a mobil Tanársegéd két névtelen ikongombját később javítottuk; a `42419584013` futásban mind a négy vizsgált nézet 0 WCAG-figyelmeztetéssel sikeres. Az egész felület kézi WCAG és segédtechnológiás ellenőrzése még hátra.
- A-01/A-18: a 13 ritmikai képfájl továbbra sem került binárisan GitHubba; a többi 302 tankönyvoldal és 64 jegyzet képellenőrzése sikeres. A teljes kiadás szándékosan blokkolt, main merge nincs.

## Huszonharmadik javítási egység – WCAG elfogadási próba

- A Chromium/axe `42419584013` futás **sikeres**: a főoldal, kvíz, tankönyvolvasó és 390 px széles mobilos Tanársegéd mind 0 automatikusan detektált WCAG 2.1 AA sértéssel zárult. Korábban 30 főoldali és 46 tankönyvoldal-felirati kontraszttal kapcsolatos hibát találtunk, amelyek most nem jelentkeztek. A Tanársegéd ikonikus bezáró és küldő gombjai is akadálymentes nevet kaptak.
- Linux `42419584031` CI sikeres. PHP/MySQL alaptesztek és a frontend build `42419583981` futásban sikeresek, a ZIP továbbra is szándékosan leáll a 13 hiányzó ritmikai JPG miatt.
- Az automatikus ellenőrzés nem teljes WCAG-tanúsítvány; kézi fókuszsorrend, kontrasztváltozatok és segédtechnológiás próba még hátra.

## Lezárási feltételek

1. A P0 hibák megszűnnek, és a telepítő teljes statikus asset-manifeszt ellenőrzése sikeres.
2. A kilenc modul tananyag–példa–kvíz–szókártya–AI hivatkozásai megfelelnek a közös azonosítóknak.
3. Vendég, hallgató, tanár, admin teljes életút szerepkörös és többeszközös tesztje kész; nincs adatvesztés.
4. Magyar hangnevek, kotta és audio, valamint a forrásolt AI-válaszok szakmai mintatesztje sikeres.
5. Mobil/desktop, billentyűzet és akadálymentességi ellenőrzés után az összes hiba bizonyítékkal lezárható.

## Huszonnegyedik javítási egység – eredeti média kiadása és offline helyreállítás

- A-01/A-18: **2026-11-07, GitHub commit `dfa23b569796ace22a15071224029d083b4d23ce`: 13 darab valódi `public/ritmikai/p001.jpg`–`p013.jpg` fájl kerültek a fejlesztési ágra.** A forrás az eredeti, 13 oldalas PDF, amelynek SHA-256-ja `eddb1e3a0e8ec9e6135d5e7b3f1807e9728df2399a5258a870b1d9d4d55dc3aa`. Minden oldal Git-blob SHA-ját külön összevetettük a korábban generált JPG Git SHA-jával; mind a 13 egyezett. GitHub Actions `42422196761` **teljes PHP ZIP sikeres**, `42422196762` Linux build sikeres, `42422196771` Chromium E2E sikeres. A technikai A-01/A-18 kiadásblokkoló lezárható; ez még nem az éles szerver telepítési elfogadása.
- A-06: bejelentkezett felhasználó függő, szerverre még el nem jutott eredményeit fiókazonosítóval elkülönített helyi böngészőtárolóba írjuk, és a következő azonos fiókbelépésnél a mentett alapállapothoz viszonyított háromutas összevezetéssel állítjuk helyre. A fiókhoz nem tartozó vagy hibás változatot nem emeljük be. Sikeres szervermentéskor kizárólag a ténylegesen továbbított változat ideiglenes helyi másolatát töröljük. Felületi figyelmeztetés és egység-, valamint böngészős regresszió készült. A böngésző helyi tárolója **nem titkosított biztonsági mentés**; érzékeny adatokhoz a közös gépen körültekintés szükséges.
- A-14/A-20: felfedeztük és javítottuk, hogy a G5 táblázatos frekvenciája 790 Hz volt az A=440 Hz 12-TET szerinti 783,99 Hz helyett; a nagy szeptim hangközprogramban H4 helyett korábban a magyar B4 (B♭) szólt. 39 hangmagasság 12-TET ellenőrzése és mind a 12 hangköz automatikus frekvencia–felirat egyezése bekerült a tesztcsomagba.
- A teljes projekt még **nem** kiadásra kész, amíg a nyitott tudományos/tartalmi audit, adatkezelési jóváhagyás és az éles jogosultsági/telepítési E2E nincs lezárva. A `main` változatlan.

## Huszonötödik javítási egység – zenei példák és élő magyar források

- A-14/A-20: az `ExtendedEarTraining.tsx` 2/4 ütemmutatójának szövegében a „kétszólamú” hibás megnevezést „kétnegyedes”-re javítottuk. A `scripts/test-extended-ear-music-integrity.ts` külön ellenőrzi a skálák tényleges MIDI hangmagasságait, a ritmikai példák negyedértékben számolt időtartamát, a kétütemes metrikus példák ütemhosszát és a lejátszás eseményeinek sorrendjét.
- A-04/A-19/A-23: az öt elméleti fejezet kattintható, korábban billentyűzettel nem aktiválható kártyája `role=button`, `tabIndex=0`, Enter/Space és látható fókuszjelölést kapott. A Chromium-tesztbe bekerült a tanulmányozott alfejezet és teljes fejezet állapotának megőrzése oldalváltás után. Az első WCAG-tesztben a kártyák mesterséges `aria-label` felirata ütközött a látható szöveggel; ezért a gombok hozzáférhető neve már a teljes látható címükből származik.
- A-15: a 2026. július 15-i MédiaKlikk-videó 2026. október 13-ig volt elérhető és november 7-én nem tölthető be. Helyette a Liszt Ferenc Zeneművészeti Egyetem elérhető, magyar nyelvű `Kodály mindenkié!` dokumentumfilm-oldala került a tananyagba. A Mozart K.331 és Erkel Ferenc OSZK-linkeket gyűjtőoldalként pontosítottuk; időponttal ellátott leltár: `docs/media-linkellenorzes-2026-11-07.md`. Ez nem jogi felhasználási tanúsítás.
- A-01/A-18: 13/13 JPG GitHubban és a teljes PHP ZIP sikeres, a technikai kiadási blokkoló megszűnt. A `main` ágra összevezetés még nincs, mert további tételek nyitottak.

## Huszonhatodik javítási egység – licencfeltételek és további fogalmak

- A-15: a Wikimedia Commons `Hidraulis_Aquincum1.JPG` képéhez a korábban túl általános licencszöveg helyett **Kaboldy szerzői megjelölés és CC BY-SA 3.0 Unported** licencközlés került. A weboldalon külön, közvetlen `https://creativecommons.org/licenses/by-sa/3.0/` link jelenik meg a Commons forrásoldal mellett. Automatikus metaadat/regressziós teszt készült. A többi képre vonatkozó teljes jogi ellenőrzés még nincs lezárva.
- A-10: további 78, a magyar definícióhoz illeszkedő hangszer, játéktechnika, műfaj, előadásmód, dinamika, ornamentika és kottaírási fogalom került szakszerűbb kategóriába. A 1793 eredeti tételből immár 336 javított besorolás történt; az „Egyéb szakkifejezések” 945-ről **609-re csökkent**. Minden eredeti term, definíció és stabil ID megmaradt; a fennmaradó 609 kézi lektorálásra szorul.
- A-23: a Chromium axe súlyos/kritikus WCAG 2.1 AA tesztje a korábbi négy nézeten túl az alfejezetet, tanulási profilt és fogalomtárat is átvizsgálja. Az új CI eredménye még ellenőrizendő.

## Huszonhetedik javítási egység – bővített WCAG és tanulási trendek

- A-23: GitHub Actions `42423241640` Chromium-böngészős, axe WCAG 2.1 AA füstteszt **sikeres**. Hét nézetben – főoldal, alapfejezet, kvíz, tankönyvolvasó, tanulói profil, fogalomtár és mobil Tanársegéd – 0 automatikusan észlelt súlyos/kritikus WCAG-sértés. A két korábban feltárt súlyos alfejezeti kontraszteltérés a zöld futásban megszűnt. Nem tekintjük teljes manuális akadálymentességi tanúsítványnak.
- A-17/A-22: `src/quizAnalytics.ts` témakörönként elemzi a részletesen mentett kvízpróbálkozásokat. Az utolsó 3 gyakorlókör százalékos átlagát a megelőző 3-hoz kizárólag legalább 6 azonos témakörű próbálkozás után hasonlítja. Vegyes gyakorlás külön témakörként szerepel. A profil érthető szöveges táblázatot ad, nem hitelesített vizsgaértékelést; egységteszt ellenőrzi a matematikát és a témakörök elkülönítését.
- A-10: 78 további, kézzel ellenőrzött szakszó került az eredeti magyar definíció alapján megfelelő kategóriába. Összesen 336 átsorolás, 609 tétel még „Egyéb” besorolású. A 1793 címszó azonosítója és definíciója változatlan.
- A-15: a Wikimedia Commons aquincumi víziorgona-képénél a szerzőt (Kaboldy) és CC BY-SA 3.0 Unported feltételeket közvetlen licenclinkkel tüntetjük fel; külön regresszió ellenőrzi a forrás- és licencadatokat.
- A technikai PHP ZIP, Linux és Chromium csomagteszt a `12d8fd8fbf4d7b9c9cfd5e857601b3e3639ca854` commitnál háromszorosan zöld. Az azóta hozzáadott trend és licencváltozások friss CI státuszát külön kell ellenőrizni.
- A **main merge továbbra is nincs engedélyezve**, mert az éles hitelesítéses, többeszközös és telepítési E2E, a 609 glosszárium tétel teljes szakszerű besorolása, a teljes tananyag szakmai lektorálása és a médiák maradéktalan jogi ellenőrzése hátravan.

## Huszonnyolcadik javítási egység – 2026-11-08, fogalomtár, fiókállapot, magyar zenetörténet

- **A-10:** a korábbi 609 „Egyéb” tétel további jelentésalapú rendezése (192+144+223+50) után az eredetileg 945 vegyes szócikkből **0** maradt az általános gyűjtőkategóriában. A teljes 1793 elem 12 konkrét pedagógiai kategóriába került; a nem műfajhoz vagy zenei fogalomhoz tartozó olasz, német és francia szavakat új „Általános zenei nyelv és utasítások” kategória fogja össze. A 1793 eredeti ID, fogalom és definíció változatlan. Regressziós tesztek ellenőrzik az új eloszlást, valamint az összes kategória megjelenését a szókártyák, párosítók és kvízfeladatok között. Az **értelmezések hibáinak független szakmai lektorálása nem ugyanaz**, mint a kategóriák teljes rendezése: továbbra is szükséges.
- **A-06/A-21:** a böngésző helyi tárolójának tiltása (privacy / `SecurityError`) már nem blokkolhatja a bejelentkezett fiók szerverről történő betöltését. Vendégként az alkalmazás jól láthatóan jelzi, ha a helyi eredménymentés nem működik. Ezt külön mockolt fiókos és vendég Chromium-próbával teszteljük; a szerveroldali mentés ettől független.
- **A-13:** az önellenőrző mintaválaszok most fejezet + alfejezet + kérdés index alapján elkülönülnek, és fejezetváltáskor a korábbi szakasz képi/megoldási állapota is törlődik. Chromium E2E teszt ellenőrzi, hogy a megmutatott mintaválasz nem szivárog át a másik alfejezet kérdésére.
- **A-20:** a teljes kilencmodulos kvízbank minden kérdésénél Unicode-normalizált, kis/nagybetűtől és többszörös szóköztől független válaszopció-egyediségi ellenőrzés került az egységtesztekbe.
- **A-23:** gyors alfejezetváltásnál az átmenetileg gyenge kontrasztú gombszín-animáció megszűnt. A `42462557360` Chromium és a `42462557616` PHP, valamint `42462557356` Linux CI együttesen sikeres volt. A későbbi kódváltoztatások után új CI szükséges.
- **A-15:** a 2026-11-08-i forrásellenőrzés mind a nyolc használatban lévő Commons-képfájl oldalát dokumentálta a `docs/media-linkellenorzes-2026-11-07.md` fájlban. A Bartók-képet egy ismeretlen szerzőjű, 1927-es, Commons közkincsjelzésű portréra cseréltük a jogilag bizonytalanabb, 1982-es könyvre hivatkozó fájl helyett. A limoges-i tónárium képaláírása szakmailag pontosabb lett; az 1979-es Graduale Romanum-ból származtatott gregorián képtartalom jogainak független ellenőrzése továbbra is nyitott.

**Végleges kiadás előfeltétele:** valódi PHP-auth hallgató/tanár/admin és két eszközös éles próba, adatkezelési ellenőrzés és manuális WCAG-folyamat; teljes tananyag zenetudományi és kiadói jogi lektorálása; zöld végső CI és próba CloudPanel telepítés. Csak ezután `main` merge és végleges terjesztés.

## 2026-11-08 – automatikusan előállított szótári kvízek válaszellenőrzése

- A-20/A-22: a `src/data/musicExpressionsPractice.ts` által generált zenei kifejezés-kvízkérdéseknél az alternatív válaszok kiválasztása immár normalizált magyar szöveg alapján kiszűri az ismétlődő jelentéseket. Mindig a saját zenei tárgyköréből választ először három különböző értelmezést, és csak hiány esetén keres más területről. A helyes válasz pozíciója és az eredeti kérdésazonosító változatlan, ezért a korábban mentett gyakorlási eredmények megmaradnak.
- Új regressziós teszt: `scripts/test-glossary-answer-integrity.ts` ellenőrzi a négy válasz meglétét, egyediségét és a helyes válasz szótári forrását a teljes generált kérdésbankon. A teszt a szótári szöveg elválasztó szóközeit is normalizálja; ez nem módosítja a forrásdefiníciókat.
- Az aktuális besorolási állapot továbbra is: 1793 tétel, 12 kategória, **0 „Egyéb”**. Ez csak technikai taxonómiai teljesség; a független zenetudományi lektorálás, a szinonim meghatározások pedagógiai egyértelműségének ellenőrzése és az éles E2E továbbra is nyitott.
- A teljes audit befejezéséig a PR draft és a `main` változatlan.

## 2026-11-08 – teljes kvízválasz-koherencia és két fiókmunkamenetes próba

- **A-20/A-22:** `src/data/musicExpressionsPractice.ts` zenei fogalomtári kvízgenerálásakor minden kérdéshez négy különböző, szótárban szereplő jelentést választunk. Azonos kategórián belüli alternatívák előnyt élveznek; csak szükség esetén más kategóriásak. Az ismétlődő válaszokat normalizált magyar szöveg alapján kiszűrjük. Eredeti kérdés-azonosítók és helyes válaszpozíciók megmaradnak. A `scripts/test-glossary-answer-integrity.ts` minden generált fogalomtári kérdésnél ellenőrzi a válaszok számát, egyediségét és a forrást. A `scripts/test-curriculum-integrity.ts` már a teljes kvízkészlet ismétlődő válaszopcióit is vizsgálja.
- **A-06/A-21/A-24:** `scripts/test-php-two-device-sync.sh` két külön, tényleges bejelentkezett PHP/MySQL-munkamenetet hoz létre. Ugyanarról a verzióról A ment, B elavult verzióval **409** ütközést kap, majd az egyesített adatok új verzióval sikeresen menthetők. Ellenőrzi, hogy a korábbi eredmény, kvíznapló és az A/B eszközökről hozzáadott kedvencek is megmaradtak. A teszt automatikusan fut az ideiglenes MySQL szerverrel a PHP CI-ben. Ez még nem teljes éles böngészős multi-device vizsgálat.
- **2026. november 8-i CI:** `f34ae02ffc53cba250f7c40d7ef61aa3d2c04f07`: Chromium `42464213579` **success**, PHP/MySQL tesztek + teljes ZIP `42464213583` **success**, Linux `42464213558` **success**.
- A-10: az aktuális forrásfájlban 1793 eredeti, azonosítóval követett címszó 12 szakterületi kategóriában szerepel, 0 „Egyéb”. A besorolás teljessége nem egyenlő a független szakterületi kontrollal.
- **Nincs éles kiadás és nincs `main` összevezetés:** a teljes tananyag/tételbank lektorálása, médiaszerzői jogi ellenőrzés, az éles CloudPanel beüzemelés, hitelesített hallgató/tanár/admin E2E és fizikai két eszközös szinkronvizsgálat továbbra is nyitott.


## 2026-11-08 – párosító játék tényleges böngészős teljesítése és hozzáférhető visszajelzés

- **A-05/A-24:** A `scripts/browser-smoke.mjs` nem csupán megnyitja a párosító oldalt: a tényleges forrásbankból megkeresi az aktuális, véletlenszerűen kiválasztott párok helyes jelentését, az összes látható párt végigjátssza, ellenőrzi a sikeres befejező képernyőt és az új játék indítását. A korábbi bővítés a `a1bbe27419c0930df714250443bfb4b9970f4870` commitnál Chromium `42466309168`, PHP `42466309176`, Linux `42466309196` futásokban sikeres.
- **A-05/A-23:** A párosító most sikeres és hibás próbálkozás esetén is magyar szöveges, `role=status` / `aria-live=polite` visszajelzést ad, ezért a feladat megoldása nem kizárólag a hangjelzésből érthető. Újrakezdésnél az előző visszajelzés törlődik. A Chromium-szkript a hibás választ, a visszajelzés szövegét, a hibás kijelölés elengedését, a teljes helyes sort és az újraindítás utáni állapotot is vizsgálja.
- A további változások végső commitja `8fdb902425e67503a1a69b24a19495389b673ec2`; az ehhez tartozó Chromium, Linux és PHP CI-ellenőrzés e bejegyzéskor **folyamatban volt**, így az új hozzáférhetőségi módosítások még nem tekinthetők zöldnek.
- A párosító teljesítési naplójának és XP-szabályainak szerveroldali jogosultsági/adatvédelmi elfogadása, továbbá a manuális képernyőolvasós teszt továbbra is nyitott. Nincs végleges kiadás vagy `main` összevezetés.


## 2026-11-08 – párosító regresszió lezárása, három zöld CI

- A kibővített Chromium-teszt első futása (`42467637714`) sikertelen volt: az oldal címe után még nem álltak rendelkezésre a `useEffect` által összeállított párok. A tesztet explicit, látható fogalomgombra várakozással javítottuk (`27761824d9b071cb97c88982c5510d264748ea48`).
- **Chromium `42467713101`: success. PHP/MySQL/ZIP `42467713130`: success. Linux `42467713115`: success.** A párosító hibás választ, szöveges élő visszajelzést, teljes helyes feladatsort és újraindítást tartalmazó automatikus ellenőrzés ezzel sikeres.
- A-05 párosítójáték-böngészős részpróbája lezárható; a teljes A-05 / A-23 kézi segédtechnológiás és éles fiókos elfogadása nem. **A `main` nincs módosítva, végleges csomagot nem adtunk ki.**


## 2026-11-08 – gyors újraválasztás és párosító állapotverseny

- **A-05/A-24:** A `MatchingGame.tsx` hibás párosítás után korábban 500 ms-mal később állította vissza a kijelöléseket. Ez a késleltetett visszaállítás egy gyorsan indított új kijelölést is törölhetett, ezért a hibás pár kijelölésének elengedése most azonnal megtörténik, miközben a magyar szöveges hibajelzés megmarad.
- A `scripts/browser-smoke.mjs` külön regressziója azonnal ismét kijelöl egy fogalmat, majd az egykori 500 ms késleltetésnél tovább várva ellenőrzi, hogy a friss kijelölés nem tűnt el.
- Commitok: `cec6cad6f836024da501042f6c1cbe11d6cc2361`, `12e4a4f7e4f8b35564d222c762b42e885e506385`. Az új ellenőrzések CI-futtatásai: Chromium `42468385846`, Linux `42468385850`, PHP `42468385907`. Utólag igazolt eredmények: Chromium `42468385846` **success**, Linux `42468385850` **success**, PHP `42468385907` **success**.
- A szakmai/jogi ellenőrzések és az éles jogosultsági, többeszközös, CloudPanel, manuális WCAG teszt továbbra is kiadásblokkoló. A `main` változatlan.


## 2026-11-08 – párosító feladatok egyértelműsége és véletlenszerűsége

- **A-05/A-20/A-22:** A `MatchingGame.tsx` korábban `sort(() => Math.random() - 0.5)` keverést használt, amely nem ad egyenletes permutációkat. A fogalmak és jelentések most Fisher–Yates algoritmussal keverednek.
- Ugyanabban a körben két azonos, normalizált feliratú fogalom vagy jelentés pedagógiailag kétértelmű, ezért a véletlenül kiválasztott elemekből csak eltérő megjelenített fogalom- és válaszfeliratot engedünk be. Ez nem változtatja meg az eredeti párok azonosítóit vagy a tanulói eredményeket. Ha az egyedi elemekből hatnál kevesebb van, rövidebb kör készül.
- A `scripts/browser-smoke.mjs` most ellenőrzi, hogy mindkét oszlopban az összes látható felirat egyedi. A magyar Unicode- és whitespace-normalizálás hibás `\\s` escape-jét a kódban és a tesztben is javítottuk.
- Implementációs commitok: `7ce4899f6b0216d29e7e7c3964c8f53c79556ee0`, `92772c71b13908314687e6c11586206449873c35`, `fdc7ef071fda4e41c5ff281e7043add919230b24`, `50518a3f7d70aa59dd72f7522be9459ae0462e73`.
- A változtatások **nem** helyettesítik az eredeti fogalmak/jelentések zenepedagógiai lektorálását vagy a teljes kérdésbank tartalmi ellenőrzését. Éles CloudPanel, jogosultsági E2E, két fizikai eszköz, licencellenőrzés és manuális akadálymentességi vizsgálat továbbra is nyitott, ezért nincs `main` merge és nincs végleges letöltési csomag.

- **Új javítás végső CI eredménye (2026-11-08):** Chromium `42469761747` **success**; PHP/MySQL/ZIP `42469761757` **success**; Linux `42469761830` **success**. A párosító címke-egyediségi regresszió a böngészőben is átment. Ez az A-05/A-20/A-22 technikai részének bővítése, nem teljes szakmai vagy éles elfogadás.


## 2026-11-08 – tanulói fiókváltás és mentés újraütemezése (A-06/A-21/A-24)

- Az `App.tsx` mentési zára (`savingRef`) korábban ki tudott ejteni egy új fiókhoz tartozó mentési próbát, ha az előző fiók PUT kérése még folyamatban volt. A régi válasz állapotfrissítését a generáció-ellenőrzés már tiltotta, de a `finally` ág nem ébresztette fel az új fiók mentését, ha a régi kérés `reschedule=false` értékkel tért vissza.
- Az előző kérés mentési zárolásának felszabadítása most új mentési próbát ütemez, ha közben a fiókgeneráció megváltozott. A döntési szabály önálló `shouldRescheduleProgressSync` függvényben található, egységtesztekkel a változatlan és megváltozott generációra.
- Kódcommitok: `20edda05bb5918a77186c191e899b20119a26dba`, `1ccb799b93222b9dc15ab6c85056126c1f024a9e`, `0c55527acd94d8285d551968341d980cbb6c0c6f`, `00d5ffac1af6126afccfb76fdeb8c52ab79f4a1f`.
- Elindított ellenőrzések: PHP/MySQL/ZIP `42472071175`, Linux `42472071224`, Chromium `42472071172`. **Az új mentési versenyhelyzetet egyelőre a döntési szabály egységtesztje védi; teljes valós fiókváltós és fizikai többeszközös elfogadási teszt továbbra is nyitott.**
- A projekt továbbra sem végleges: CloudPanel-élesítés, személyes adatok adatvédelmi jóváhagyása, teljes szakmai és jogi lektorálás, valamint manuális akadálymentességi teszt szükséges. Nincs `main` merge és nincs végleges letöltés.

- **Ellenőrzött CI eredmény (2026-11-08):** a fiókváltási mentés javítását tartalmazó `00d5ffac1af6126afccfb76fdeb8c52ab79f4a1f` commitnál Chromium `42472071172` **success**, Linux `42472071224` **success**, PHP/MySQL/ZIP `42472071175` **success**. A teljes éles többfiókos, két eszközös teszt ettől még nem teljesült.

## 2026-11-08 – A-11 adatintegritási javítás és hátralévő elfogadási kapuk

- **A-11:** A `recordActivity` nem véges (`NaN`, `Infinity`, `-Infinity`) jutalompont esetén korábban érvénytelen `xp` értéket képezhetett. A `recordEarTrainingActivity` napi számlálója ugyanezeknél a bemeneteknél szintén romolhatott. Most az ilyen bemenet 0 pontot ad, és a negatív jutalom is 0-ra korlátozódik. Érvénytelen korábban betöltött napi számláló helyett biztonságos 0-ról indul. A már helyesen tárolt XP, valamint a napi 100 pontos korlát változatlan.
- Egységteszt: `progress.test.ts` ellenőrzi a nem véges, negatív és hibás napi számlálóval érkező pontokat. Commitok: `708ea8aae6cf2da9e15313b77fe09e9caa6e9d19`, `98f835b31bc17708e5d6283cb5fe885913df6a32`.
- **Auditpontok:** a 24 tételből A-01 és A-18 zárható önállóan igazolt technikai követelményként; a többihez további szerepkörös, pedagógiai, jogi vagy valós telepítési elfogadás tartozik. Ez nem azt jelenti, hogy a többi 22 pont kódja hiányzik.
- **Kiadási kapuk:** (1) teljes zenepedagógiai, kotta/hang/kvíz és 1793 fogalom lektorálása; (2) összes külső média és kiadói engedély ellenőrzése; (3) valódi CloudPanel PHP/MySQL migráció és telepítés; (4) éles szerepkörös és fizikai két eszközös próba; (5) manuális WCAG és mobil teszt; (6) opcionális Gemini élő API/adatkezelési validáció – AI nélkül a helyi keresős mód maradhat.
- A `main` ágra nem történt összevezetés. A végleges letöltési csomag továbbra sem kiadható.


## 2026-11-08 – PHP-függőségletöltési CI-helyreállítás és XP-regresszió

- `98f835b31bc17708e5d6283cb5fe885913df6a32`: az XP-kód és regresszió után a Chromium `42472481460` és Linux `42472481538` ellenőrzések sikeresek, és **304 / 304 TypeScript/Node teszt átment**. A PHP `42472481550` futás nem kódhibával, hanem a PHPMailer 6.10.0 GitHub ZIP letöltése közben fellépő `curl error 56` kapcsolatszakadás miatt elbukott.
- `.github/workflows/php-release.yml`: a Composer letöltés legfeljebb három próbálkozást kap, rövid visszavárással, de a hiányzó csomagot nem hagyja jóvá és a telepítési ZIP hiányos függőséggel továbbra sem készülhet el. Commit: `ffe63f5e87fafd0dc4b88d17f8bfcb45cea563bf`.
- **A módosított folyamat új ellenőrzései:** Chromium `42472684234` **success**, PHP/MySQL/ZIP `42472684239` **success**, Linux `42472684300` **success**. A technikai javítás tesztelt, de a szakmai és produkciós kiadási feltételek továbbra is nyitottak.


## 2026-11-08 – jelszóváltási adatvesztés-védelem és vendég eredmények böngészős tartóssága

- **A-06/A-21:** A jelszóváltás minden eszközön érvénytelenítheti a bejelentkezést. Az `AccountPanel.tsx` ezért most a kijelentkezéshez hasonlóan megerősítést kér, ha a profil utolsó tanulási változásai még nem kerültek a szerverre. A figyelmeztetés visszautasításakor a jelszóváltási POST nem indul el. A már fiókonként elkülönített függőben lévő helyi mentéseket a változtatás nem törli.
- **A-04/A-05/A-06/A-24:** A Chromium-füstteszt egy teljesen sikeres párosító kör után most ténylegesen újratölti a böngészőoldalt, és összeveti a vendég helyi tanulási naplójában a megtalált pár-ID-ket és XP-t. A teszt az előző feladatsor állapotmentésének megtörténtét kivárja.
- Kódcommitok: `77fbc1d2f89e176b7f6deafcfbb6f3739f623013`, `ed66d569b6ab673d2cf270979389c6bdc41683aa`. Az eredményeket csak a friss Chromium, Linux és PHP CI lezárása után szabad sikeresnek minősíteni.
- **Maradék:** valós bejelentkezéses jelszóváltás, többeszközös fiókszinkron, tanár/admin jogosultság, CloudPanel-telepítés, a teljes szakmai és licencellenőrzés, manuális WCAG. A `main` változatlan, végleges csomag nem készül.


## 2026-11-08 – jelszóváltás előtti mentésvédelem, regresszió és Composer forrás-fallback

- **A-06/A-21:** A `src/components/AccountPanel.tsx` a globális kijelentkeztetést eredményező jelszóváltási kérés előtt megáll és jóváhagyást kér, ha vannak még nem szerverre mentett tanulói változások. A `scripts/browser-smoke.mjs` valódi Chromium UI-műveletekkel létrehoz egy mockolt bejelentkezett tanulói állapotot és sikertelen szervermentést, megnyitja a jelszóváltási űrlapot, elutasítja a figyelmeztetést, majd ellenőrzi, hogy nem küldődött ki jelszóváltási POST. Ez nem egyenértékű az éles PHP hitelesítéses E2E-vel.
- **A-04/A-05/A-06/A-24:** A Chromium-regresszió a vendég párosító teljesítése után valódi oldalfrissítést végez, ellenőrzi, hogy a `matchingCompleted` ID-lista és a tanulói XP megegyezik-e az oldalfrissítés előtt tárolttal.
- **Telepítő:** A Composer harmadik próbálkozása `--prefer-source` opcióval próbálkozik, ha a PHPMailer GitHub ZIP-letöltése többször megszakad; hiányzó `vendor` könyvtárral továbbra sem lehet kiadni a ZIP-et.
- Kódcommitok: `77fbc1d2f89e176b7f6deafcfbb6f3739f623013`, `ed66d569b6ab673d2cf270979389c6bdc41683aa`, `f2935554567a1349470bb8d3d5e2e1be68c09783`, `05c3a08ff338fa09783969666215f36f4112be5d`.
- A friss változat Chromium-futtatása `42478139405` **success**. PHP/MySQL/ZIP `42478139546` **success** és Linux `42478139532` **success**. Mindhárom ellenőrzés zöld. A szakmai, jogi, CloudPanel, kézi WCAG és fizikai két eszközös tesztek kiadásblokkolók maradnak; a `main` változatlan.


## 2026-11-08 – A-07/A-08 forráslefedettség, A-18/A-24 teljes telepítő és CloudPanel-első próba

- **Éles üzemeltetési tény (felhasználó által képernyőképekkel ellenőrizve):** az `zeneelmelet` adatbázis és `admin` fiók épségben van; a korábbi PHP belépési rate-limit probléma javítása után sikeres bejelentkezés történt. A régi frontend `PUT /progress` kérése 428-at adott, mert hiányzott a `revision`. Az azonos buildből feltöltött `index.html` + `assets/` után a 64 karakteres `revision` már szerepelt, a mentési PUT 200 volt, majd a phpMyAdminban a `zm_progress.progress_json.favoriteExpressions` szerveroldali kedvencazonosító frissítése igazolódott. Korábban a `api/admin.php` fájl hiányzott (négy admin GET 503), ennek visszatöltése után mind a négy admin végpont 200. Valós kézi szerveres alap-szerepkörpróba így **részben teljesült**, de hallgató/oktató, meghívás, SMTP és két fizikai eszköz szinkronja nem igazolt.
- **A-07/A-08:** A statikus `source-inventory.json` jelentés 104 forráscsoportja/3806 részlete és az élő PHP `knowledge.php` keresőindex 75 csoportja/2840 részlete két külön indexelési/adatbetöltési útból is keletkezhet. A különbség **önmagában nem bizonyít elveszett forrást**, de eddig az admin oldal csendben a statikus tartalékjelentést is élőként mutathatta. A `src/components/AdminDashboard.tsx` most külön jelöli az élő és statikus nézetet, mindkettőt betölti, számszerű és forráscsoportnév szerinti eltérést jelenít meg, a csak statikus fallbacket feltűnően jelzi. A böngészőteszt ellenőrzi a két jelentés összevetését és a PHP 503 esetén a nem félrevezető fallbacket. Ez a *diagnosztika* javítása; az összes forrás tananyagszintű, szakmai egyeztetése továbbra is nyitott.
- **A-18/A-24:** A `scripts/verify-release-assets.py` már nem csak a 302 tankönyvoldalt, 13 ritmikai és 64 jegyzetképet, hanem az `api/admin.php`, `knowledge.php`, `tutor-text-generation.php`, `vendor/autoload.php` és más nélkülözhetetlen PHP-modulokat, továbbá az `index.html` által hivatkozott frontend JS/CSS fájlokat is megköveteli. A `release` gyökérben nem enged nyilvánosan elérhető `*.zip` archívumot. Ez megakadályozza a GitHub által **hiányosan** előállított csomag kiadását, de a külön, részlegesen végzett éles feltöltésből eredő hiányokat csak a helyszíni validálás tudja kimutatni. A visszaállítás és a nem nyilvános mentés szabályai a `deploy/php-telepites.md` dokumentumba is bekerültek.
- **GitHub-kódcommitok:** `6003e8251a01be28752ecd862873cd1a77fed7e1`, `7ec77e95413f405d8ca444ace7652a2bc9b44739`, `95ccde115606de8a994a4ffe56374d79b1f09de9`; üzemeltetési leírás: `e11593180ad1f0ff5b8e0cb644e633863398b14d`.
- **Tesztbizonyíték a teljes kódjavítás után:** Chromium `42528220711` **success**, PHP/MySQL/ZIP `42528220708` **success**, Linux `42528220739` **success**. A leírásfrissítés utáni futások ettől külön ellenőrzendők.
- **További blokkolók:** teljes, 1793 elemű zenepedagógiai szaklektorálás; képek/kották/tankönyvek felhasználási engedélyei; valódi meghívás/e-mail/jelszóhelyreállítás és hallgató/oktató szerepkör a CloudPanelen; valódi két eszközös szinkron; manuális WCAG és teljes mobil próba; adatkezelési megfelelőség; végső stabil release. Az opcionális generatív Gemini mód élő validálása csak a funkció külön engedélyezése esetén szükséges. **Nincs végleges ZIP-átadás és nincs `main` összevezetés.**

## 2026-11-08 – A-07 teljes PHP szótárindex védelme (1793/1793)

- A PHP Tanársegéd élő `admin/source-coverage` válasza most külön `chapter09GlossaryEntries` mezőt is tartalmaz. Az adminfelület a 09. fejezethez **1793 / 1793** elvárt szótári bejegyzést jelenít meg; eltérésnél a `missing` listában megjelenik a tényleges hiány. Ezzel megkülönböztethető a 09. fejezet valódi PHP-indexhiánya a statikus és az élő index eltérő teljes forráscsoport-számaitól.
- A PHP ZIP-összeállító workflow a valóban exportált `release/api/knowledge.php` adataiból külön megszámolja a `09. Zenei kifejezések / ` címkéjű elemeket, és **hiány esetén leállítja a telepítő elkészítését**. A fogalmak szakmai helyességét, teljes forrásjogi engedélyét és a CloudPanelre ténylegesen feltöltött fájlok állapotát ez nem bizonyítja.
- A böngészős admin-teszt a külön élő 09-es darabszámot is ellenőrzi. Kódcommitok: `cd8cdb6dbf166c09eded80f033c01e90b317e9f9`, `a2f6e2f0ec89c97a91be4c327935deb3ea1322ad`, `66cfe140fa8747fc96b6932bb21ae339a675f6ab`, `9736137141b058a7b3a1699add0f1c27db8882e8`.
- A 24 pontos leltár továbbra sem teljesen elfogadott; a `main` nincs módosítva, végleges letöltés nincs. Az új CI-eredményeket a kör lezárásakor ellenőrizni kell.

## 2026-11-08 – Adminforrás-frissítés és meghívás hibakezelése (A-07/A-08/A-21/A-24)

- **Valós adminhiba a forráskezelésben:** sikeres `admin/source-upload` vagy `admin/source-delete` után a felület korábban csak a forráslistát töltötte újra; a `admin/source-coverage` jelentésben maradt a régi forráscsoport- és szövegrészszám. Az `AdminDashboard.tsx` most az első betöltést és a sikeres forrásmutációk utáni újramérést külön kezeli. A feltöltés/törlés **nem állítja alaphelyzetbe a felhasználók keresési szűrőjét**, és a változás után frissül az élő Tanársegéd-leltár.
- **Sikertelen meghívás:** a meghívó e-mail címe eddig még sikertelen szerverválasz után is törlődött (`action(...).then(() => setEmail(''))` akkor is lefutott, ha az `action` saját maga kezelte a hibát). Az e-mail-cím most **csak elfogadott szerverválasz** után ürül. A sikeres szerverműveletet követő esetleges listaújratöltési hibát külön jelzi a UI, nem téveszti össze magának az írásnak a kudarcával.
- **Regresszió:** a `scripts/browser-smoke.mjs` mockolt, adminisztrátori Chromium életúttal ellenőrzi a sikertelen/sikeres meghívást, az eredeti e-mail-cím megőrzését, a privát forrás feltöltését, a tényleges élő `source-coverage` újrahívását, a listában megjelenő új forrást és a törlés utáni leltárfrissítést. Az első futás csak a teszt egy összecsukott részletes táblázatának rejtett elemére várt hibásan, ezt a látható `Eltávolítás` vezérlő ellenőrzésére cseréltük.
- **PHP-regresszió:** a `scripts/test-php-tutor-search.php` már explicit ellenőrzi a `chapter09GlossaryEntries` mezőt és a hiányos 09. fejezet forrásriportbeli jelzését.
- **Kódcommitok:** `bc70038c58c9f959b8063cd9838f6e8bc3ec0ef3`, `c9271a4bbd54804645afced48d6e8ff043b00744`, `616413110fa445d738a09f3cee341dc0221b2d30`, `aab5883283d7f7f1a71a7cac8e5ee5b5ec09fa15`.
- **Igazolt teljes CI:** Chromium `42529407297` **success**, PHP/MySQL/ZIP `42529407371` **success**, Linux `42529407391` **success**. Ez technikai regressziós bizonyíték, nem valós Rackhost SMTP-kézbesítés vagy élő felhasználói elfogadás.
- **Maradék elfogadási kapuk:** CloudPanel adminforrás valódi feltöltés/törlés; meghívó tényleges e-mail-kézbesítés, regisztráció, hallgató/tanár jogosultság és fizikai két eszközös progress-szinkron; szótári/tananyagi szaklektorálás, források jogállása, kézi WCAG és adatkezelési jóváhagyás. A `main` nem módosult és végleges telepítő nincs átadva.

## 2026-11-08 – két valóban hitelesített felhasználó szerepkörös és adatizolációs integrációs próbája

- **A-06/A-21/A-24:** A korábbi `scripts/test-php-roles.sh` teszt csak egy admin fiók közvetlen SQL-szerepkörváltását ellenőrizte. A tesztet kiegészítettük két **külön PHP munkamenettel, külön felhasználói rekorddal és külön Cookie-tárral** egy elkülönített MySQL 8 tesztadatbázisban. A hallgató nem olvashatja a négy admin végpontot (`admin/users`, `admin/invitations`, `admin/sources`, `admin/source-coverage`), és tiltott szerepkörváltási POST-ra 403-at kap. Az admin feljogosíthatja az új felhasználót oktatóvá, majd vissza hallgatóvá; a **már meglévő munkamenet** a friss, DB-beli szerepkört mutatja. Admin jogot az adminfelület sem tud kiadni (400). A második felhasználó saját `progress` mentése után az admin előtte és utána mért revisionje **azonos**, tehát a másik tanulási naplója érintetlen maradt. A hallgató kijelentkezése után saját progress API-jára 401-et kap, miközben az admin munkamenete tovább működik.
- **Hibás bejelentkezési kérések:** A `php/api/index.php` `auth/login` útvonala korábban `strtolower(trim(...))` hívást végzett ellenőrzés nélkül az e-mail JSON mezőn. Tömb vagy objektum bemenet PHP `TypeError`-t okozhatott; most ezek a kérések biztonságosan **400** hibával térnek vissza. A `scripts/test-php-invitations.sh` négy hibás inputtípust ellenőriz valódi HTTP-kéréssel, majd igazolja, hogy a normál fiókbejelentkezés továbbra is működik.
- **Tesztfejlesztés során észlelt téves hiba:** a friss, eredmény nélküli hallgató `progress: null` válaszát a teszt a `??` operátor miatt hiányzó értéknek tekintette. A teszt most `array_key_exists` segítségével különbözteti meg a hiányzó mezőt a helyes, explicit `null` értéktől. Ez nem volt szerveroldali adatvesztési hiba.
- Kódcommitok: `4202eea68b715ab4fc0019833107539be321a830`, `597a8c8bba1e9936c0e8bbb977a47f321b113ef5`, `29b86ea462b2d3321fd11d79a4dc9eb7f53b198a`, `d8de0d3f4f229e4838241ccd0e2e560328070f05`.
- **Igazolt CI:** Chromium `42531249280` **success**, PHP/MySQL/ZIP `42531249227` **success**, Linux `42531249231` **success**. A PHP CI valódi SQL-mentéseket és bejelentkezést használ ugyan, de ez nem az éles CloudPanel vagy két fizikailag külön eszköz. A szakmai, média/licenc, manuális WCAG, szerepkörös éles és adatvédelmi ellenőrzések továbbra is nyitottak.
- **Kiadási állapot:** a `main` továbbra is változatlan, a PR #2 draft. Nincs végleges letöltési csomag.

## 2026-11-08 – felhasználói adathordozhatóság és fióktörlés (A-21/A-24, adatvédelmi audit)

- **Új működés:** `GET /api/index.php?route=auth/export-data` csak hitelesített fióknak adja vissza a saját nevét, e-mailjét, szerepkörét, regisztrációs és ellenőrzési időpontját, tanulási naplóját és utolsó naplómódosítási időpontját; jelszóhash, session-cookie, másik felhasználó vagy meghívótoken nélkül. A Profilban a személyes JSON menthető.
- **Saját fiók megszüntetése:** `POST /api/index.php?route=auth/delete-account` csak bejelentkezett hallgató/oktató számára, jelszó és pontos `FIÓKOM TÖRLÉSE` megerősítés alapján. A szerver saját felhasználórekordja és a külső kulcsokkal kapcsolt napló, munkamenet, helyreállítótoken tranzakciósan megszűnnek, az e-mail-címhez kötött meghívók is eltűnnek. Admin saját törlése 403, hibás jelszó 403, hibás megerősítés 400. A böngésző további megerősítést és mentetlen eredményekre figyelmeztetést kér, majd csak a törölt fiókhoz kötött offline mentést takarítja el. Törlési/portabilitási műveletet kizárólag eldobható CI-tesztfiókon próbáltunk, **nem éles felhasználón**.
- **Korlát:** a korábban készített üzemeltetői SQL/webhely-backupok, külső levelezési és szervernaplók nem érhetők el az alkalmazás önkiszolgáló API-jából. Megőrzés, biztonsági mentésekből visszaállítás, érintetti jogok és adatkezelési tájékoztató **külső jogi/üzemeltetői jóváhagyást** igényelnek. Egyetlen technikai funkció sem igazolja önmagában a teljes GDPR-megfelelőséget.
- **Kód:** `07810906247aeb29b278e0af6d6bb902cb7f352a` (PHP erasure), `dad75deb2e17eb59f4fa5f1c6265652391085d18` és `198094f754dc451ebecfc7ddd419568325d77344` (webes erasure), `7486b702d981c04e3eab549b863fcd785999db9f` (MySQL cleanup), `3a3cbc0e74fa6091c36cbe551b7da06389d3450d` (Playwright erasure), `792204239d44c866697739b5f74bd737799ffa48` (PHP export), `681e8ea72518f1d1774557092d1968f9a26a6b22` (webes JSON export), `814ff0f633f5cbed18c74e6bcb1f1c5573dc3e7e` (export izoláció), `6f9e659d4ba635a019f7db7335520d2212b82642` (böngészős letöltés).
- **Igazolt 3/3 CI a funkciók és tesztek együttes kódállapotán:** Chromium `42533033784` **success**, PHP/MySQL + CloudPanel ZIP `42533033874` **success**, Linux csomag `42533033780` **success**.
- **Kiadási kapu:** A-21 továbbra is **részben lezárt**, mert az éles valódi SMTP, adatvédelmi/engedélyezési eljárás, fizikai 2 eszközös fiókpróba, szakmai/jogi lektorálás és teljes kiadási validáció hátra van. PR #2 továbbra is draft, a `main` nincs módosítva; végleges telepítő letöltési linkje nincs kiadva.

## 2026-11-08 – 04/05 kvízek és admin/fiók WCAG kiterjesztés

- **A-03:** `scripts/browser-smoke.mjs` Chromium alatt ténylegesen megnyitja a 04. `hangkeszletek` és az 05. `hetfoku-hangsorok` tesztkategóriát, és ellenőrzi, hogy mindkettőben megjelenik kérdés; a kvíznézeteken axe WCAG 2.1 AA vizsgálat fut. Ez *elérhetőségi és UI*, nem teljes zenepedagógiai kérdéshelyességi vizsgálat.
- **A-23:** a statikus és élő indexet megkülönböztető adminoldal és a hallgatói fióktörlés külön, explicit `browser.newContext()` Playwright környezetben automatikus axe ellenőrzést kapott. Az első tesztfuttatás az axe-környezet hiányán bukott, nem a webhely kontraszthibáján; `852ff5ea45f3b2df4677ef00da5008af975210ea` javítás után a teszt zöld.
- **A-21:** a személyes JSON export csak szerveroldalon elmentett adatot tartalmaz; az exportgomb mentetlen tanulási változások esetén letiltott, amíg a fiók szinkronja meg nem történik (`239c2be0cd1c26a65ed9d7123110387cf77d9d35`). A teljes jogi/üzemeltetői megfelelőség továbbra sem bizonyított.
- **Teljes CI az új UI + teszteken:** Chromium `42533440824` **success**, PHP/MySQL/ZIP `42533440742` **success**, Linux `42533440683` **success**.
- **Kiadás:** a kód több auditpontra kiterjedő javításai ellenére a független pedagógiai/zenei lektorálás, jogi engedélyellenőrzés, valódi hallgató/oktató és két fizikai eszközös CloudPanel-proba, adatvédelmi jóváhagyás, valamint teljes manuális WCAG audit még nyitott. Nincs `main` összevezetés és nincs végleges letöltési link.

## 2026-11-09 – A-11/A-12/A-17/A-19: tanulási napló konzisztenciája és a kilencegységes tananyag

**A-11/A-17 adatkonzisztencia:**
- `php/api/index.php` új `validStudyDay()` függvénye valóban létező naptári napot követel meg a `activityDays` listában és `earTrainingDailyXp` naplóban. A szerver a szöveges/lebegőpontos XP-t, a szöveges témaköri pontszámot és a válaszok számával matematikailag ellentmondó kvízpróbálkozásokat **HTTP 400** hibával utasítja el. A regresszió mindegyik hibás eset után ellenőrzi, hogy a korábbi szerververzió nem változott, majd az érvényes mentés és az elavult verzió `409` védelme továbbra is működik. Ezek az **új mentések** védelmei; korábban tárolt SQL-adatokat nem módosítunk.
- `src/progress.ts` `validStudyDay()` és `migrateProgress()` a hibás régi naptári napokat és ellentmondó kvízpróbálkozásokat kihagyja, az XP-t nem negatív egészre normalizálja; a valid dátumokat rendezi. A `progress.test.ts` új regressziója a 2024-es szökőnapot és a nem létező 2026. február 29–30. napokat is ellenőrzi. Az XP kliensoldali gyakorlási mutató marad; a teljesen szerver által hitelesített aktivitásnapló/anti-cheat **továbbra is nyitott**.
  
**A-12/A-19 pedagógiai navigáció:**
- A tananyag nyitóoldala korábban `TANANYAG (9 FEJEZET)` mellett csak az 5 alapfejezetet számolta teljesítettnek. A `ChapterListView.tsx` most a `MUSIC_CHAPTERS` és `EXTRA_LEARNING_MODULES` közös azonosító-készletéből `TELJESÍTVE: x/9 TANANYAGEGYSÉG` értéket ad, a 06–09. modulok kártyáin is megjelenik a teljesítés jelzése. A személyes naplóval így azonos számlálási elvet követ.
- A `scripts/browser-smoke.mjs` böngészőpróba mind a négy kiegészítő tananyagba belép, ellenőrzi a megfelelő címet, a `Modul tanulmányozva` műveletet, a főoldali 2/9 → 5/9 számlálást és az oldalfrissítés utáni 5/9 értéket.
  
**Kódcommitok:** `e367bfddae2f7a21eb2fbba751fd95f7f5bbf53b` (szerver dátum/típus), `865fd4347867e1f1449b7736a4b5f5e7c1dddbb6` (PHP regresszió), `417640aee3f0d94e1a819b004235d7a613e3638e` (kliensnapló), `db834feae27b78adc8df901097c98b6408585375` (unit teszt), `e286ad807082187b10a91704b61e0ca4218e1ee6` (tananyag főoldal), `d86afeda5d990be91140eb8dda4be6a009157e52` (böngészős próba).

**Teljes CI az új teljes kódállapoton:** Chromium `42535728803` **success**, PHP/MySQL/ZIP `42535728794` **success**, Linux `42535728782` **success**. A teljes 24 pontos szakmai/jogi/éles elfogadás változatlanul nyitott; nincs végleges letöltés és nincs `main` összevezetés.

## 2026-11-09 – A-08/A-18/A-24: telepítés-önellenőrzés és Tanársegéd saját tananyagbankjai

- **A-24 (részleges CloudPanel telepítés előrejelzése):** az éles incidensben az API `auth/status` elérhető volt, mégis hiányzott az `admin.php`, ezért adminkérések 503-at adtak. Most az admin szerepkörű felhasználó `GET auth/deployment-check` hívással — a hiányzó `admin.php` betöltése előtt — külön megkapja a kötelező PHP/HTML/JS/CSS állományok lokális jelenlétét, a nyilvános `*.zip`, `*.sql`, `*.bak`, `*.tar.gz`, `.env` állományok listáját és a levelezés konfigurációs alapállapotát. Az ADMIN nézet piros figyelmeztetésben mutatja a hiányokat, de **semmit nem töröl**. A saját privát útvonal, DB-jelszó és token nem szerepel a válaszban.
- **Jogosultság:** `scripts/test-php-roles.sh` élő, eldobható PHP/MySQL szerverrel ellenőrzi a hallgató/oktató `403` tiltást, az admin `200` állapotát és egy tesztcélú `api/zm-deployment-check-test.zip` archívum észlelését. A fixture törlése után a tesztek továbbfutnak. A Chromium-teszt mind az egészséges, mind a hiányos (admin.php + archive.zip) telepítési jelentés olvashatóságát ellenőrzi.
- **A-18 (kiadási ZIP):** `scripts/verify-release-assets.py` most `*.sql`, `*.bak`, `*.tar.gz`, `.env` fájlt is blokkol a publikus kiadási csomagban, nemcsak `*.zip` archívumot. A helyszíni, kézi feltöltés teljességét a release vizsgálat önmagában nem tudja bizonyítani.
- **A-08 (PHP kontra statikus index):** `scripts/export-php-knowledge.ts` korábban nem vitte át a PHP indexbe a tanulói weboldal saját `FLASHCARDS_DATA`, `QUIZ_QUESTIONS`, `MATCHING_PAIRS`, hangsor/akkord, hangkészlet és kvintkör bankjait, noha a `server-knowledge.ts` statikus tartalma ezeket már használta. Most e hat kategóriát a PHP is exportálja. A `php-release.yml` mindegyik jelenlétét kötelező ellenőrzéssel védi. Ez a két index tartalmi különbségét csökkenti, de **nem garantál azonos darabszámot**, mivel más források és eltérő szövegdarabolás is szerepelhet.
- **CI a változtatásokon (commit `528699661d2992af1a795fceb668aee27b11df5f`):** PHP/MySQL/ZIP `42536887023` **success**, Chromium `42536887004` **success**, Linux `42536887006` **success**. Dokumentáció: `deploy/php-telepites.md`.
- **A végleges kiadásra nincs engedély:** a tényleges CloudPanelre új build telepítése és SMTP/2 eszközös felhasználói próba, az egyetemi szakmai lektorálás, a közzétételi engedélyek és a manuális WCAG/adatvédelmi ellenőrzés nem igazolt. A 24 pontos elfogadás és PR #2 Draft állapota változatlan; `main` és végleges letöltési csomag nincs.

## 2026-11-09 – A-08/A-11/A-20: tételes PHP-forrásparitás és pontos kvart–kvint párosítás

- **A-20 tárgyi pontosság:** a tanulói `MATCHING_PAIRS` korábbi `m10` bejegyzése hibásan „Tiszta Kvárt (T4)” és „Négy hang távoldóság” volt, a `m9` kvint pedig nem rögzítette a pontos félhangtávolságot. Most **tiszta kvart = 4 diatonikus fok, 5 félhang**, **tiszta kvint = 5 diatonikus fok, 7 félhang**; egységes `Hangközök` kategória és megőrzött `m9`/`m10` eredményazonosítók. `scripts/test-curriculum-integrity.ts` külön regresszióban védi ezeket. Ez célzott szakmai hibajavítás, nem helyettesíti a teljes 1793 fogalom független lektorálását.
- **A-08 teljes PHP-tananyaglefedettség:** az új `scripts/verify-php-knowledge-parity.ts` a ténylegesen előállított `release/api/knowledge.php` állományt dekódolva **tételenként** összehasonlítja a JS-forrásban található összes szókártyát, kvízkérdést és magyarázatot, párosítófeladatot, hangzó hangsor- és hármashangzatot, hangkészleti példát, kvintkör-bejegyzést és mind az **1793** 09. fejezeti fogalmat. Az összehasonlítás nem csupán darabszámot ellenőriz: a címkét és a teljes szöveget is, ismétlődést és változtatást is kimutat. Hiány esetén a PHP-telepítő CI sikertelen lesz. A statikus Node-tanársegéd más szövegdarabolást használhat; az éles indexek **teljes** egyezését ezért továbbra sem állítjuk.
- **A-11 mentési integritás:** a `recordActivity()` és `recordEarTrainingActivity()` nem enged új XP-bejegyzést lehetetlen naptári dátumra; a pontok egész számként, a backend 100 milliós korlátján belül kerülnek helyi mentésbe. `progress.test.ts` regressziója nem létező napot, tört XP-t, felső korlátot és korábbi hibás napi bejegyzés tisztítását ellenőrzi.
- **Kódcommitok:** `9510b69658afacd5dbfcd28877a64687b904172d`, `a483f7e19d00abc83c48451a3fc7e7af30e7b8c0`, `6bf9b142914dc82b4cbfa3ee45942372e7ae843d`, `a481a527f2e113bf8346b6171b7e824d5466f897`, `9fd73bf6d9e97f3cd8b055922f3556cb97f83e57`, `2f505785ae2927997973956d0539bebe9e7355b6`.
- **Teljes automatizált ellenőrzés az utolsó funkcionális commiton:** Chromium `42537886707` **success**, PHP/MySQL/ZIP `42537886773` **success**, Linux `42537886708` **success**.
- **Kiadási helyzet:** a teljes 24 pontos auditban jelenleg változatlanul két buildoldali pont lezárt. A zenei szaklektorálás, közzétételi engedélyek, Rackhost SMTP és két fizikai eszközös valódi CloudPanel-próba, adatvédelmi és manuális WCAG-jóváhagyás továbbra is nyitott. A PR #2 **Draft**, a `main` nincs módosítva, és végleges letöltési link nincs kiadva.

## 2026-11-09 – A-06/A-21: versenyhelyzetektől védett bejelentkezés és jelszó-visszaállítás

- **Probléma:** a `php/api/index.php` `auth/change-password` útvonala korábban tranzakción kívül ellenőrizte a régi jelszót, így két közel egyidejű kérés ugyanazzal a régi jelszóval átjuthatott az ellenőrzésen. A jelszóellenőrzés most `SELECT ... FOR UPDATE` sorzárolás és közös tranzakció alatt történik, a minden eszközre kiterjedő munkamenet-visszavonással együtt.
- **Második probléma:** a korábban kiküldött jelszó-visszaállító link érvényben maradhatott a felhasználó későbbi kézi jelszócseréje után. Most a sikeres `auth/change-password` **és** `auth/reset` ugyanezen tranzakcióban törli a fiók minden `purpose='reset'` tokenjét. A `scripts/test-php-invitations.sh` két külön böngészőcookie-val ellenőrzi a munkamenetek érvénytelenítését és egy előzetesen elküldött resetlink későbbi HTTP 400 elutasítását.
- **Harmadik probléma:** a korábbi `auth/login` a jelszóellenőrzés után, külön tranzakció nélkül hozta létre a munkamenetet. Jelszó-visszaállítással való verseny esetén új munkamenet jöhetett létre olyan jelszóval, amelyet időközben lecseréltek. Most a login `SELECT ... FOR UPDATE` zárolással, tranzakción belüli `INSERT zm_sessions` művelettel és **csak a commit után** beállított cookie-val történik.
- **Determinista szerveroldali regresszió:** az új `scripts/test-php-login-revocation-race.sh` elkülönített MySQL-tesztfiókot hoz létre, zárolja a felhasználói sort, párhuzamosan PHP HTTP-bejelentkezést indít a régi jelszóval, majd az SQL-tranzakcióban lecseréli a hash-t. A régi jelszavas kérésnek **401** választ kell kapnia, és nem jöhet létre új munkamenet; az új jelszóval történő bejelentkezés viszont **200** és azonos fiókadatokat ad. Ez tényleges adatbázis-versenyhelyzet, nem pusztán szekvenciális mock.
- **Kódcommitok:** `eda4f5126af062be2154e97ea873d0b0dd49bad2`, `8f5bf668afa46acd32c4521330b0594dce0b6f41`, `0f8708d4b82821282f4201a1aff6281378e803bd`, `e44c6808c8cc7f6981340673c00e734ece11e08b`, `6b23563e16eef89ed38ade1de876f942e29f8a98`, `274c441db890dcdc6e3fc41a26057e578599dcff`, `57b253bef5e27dfcfef7f3f23a62a36e5467456d`.
- **Teljes CI az utolsó funkcionális commiton:** Chromium `42574897652` **success**, PHP/MySQL/ZIP `42574897678` **success**, Linux `42574897691` **success**.
- **Elfogadási állapot:** A-06 és A-21 továbbra is **részben lezárt**, mert a valós CloudPanel/PHP-FPM, Rackhost SMTP, éles tesztfiókos hallgatói/oktatói szerepkör, fizikailag két külön eszköz és felügyelt visszaállítás még nincs igazolva. A védett `main` változatlan, a PR #2 Draft, és végleges letöltési csomag nincs kiadva.

## 2026-11-09 – A-09: ragozott magyar kérdések, relevancia és UTF-8 válaszhossz

- **Konkrét keresési hiba:** `php/api/tutor-search.php` korábban a `kvintkör` szóra talált, de a `kvintkörről`, `szinkópáról` alakokra nem, mivel a címke rövidebb volt a kérdés ragozott tokenjénél. A keresés most csak teljes szóra vagy ellenőrzött, gyakori magyar ragokkal képzett kifejezésekre enged egyezést, és ez a válaszon belüli releváns mondat kiválasztására is érvényes. Az alapértelmezett, 60%-os többfogalmas találati küszöb megmaradt; a nem zenei `tanulunk/tanulhatunk` jellegű kérdező szavak többé nem torzítják az arányt. A `hexachordokról` és `hexakordokról` alak ugyanahhoz az ellenőrzött történeti fogalomhoz vezet. Idegen összetett szó, például `kvintkorhajo` nem lehet tetszőleges fuzzy egyezés.
- **Konkrét válaszkivágási hiba:** a korábbi `mbSafeLength()` és `mbSafeCut()` név ellenére nyers bájthosszal (`strlen`/`substr`) dolgozott. Most UTF-8 karakterenként számol; opcionális `mbstring` nélküli, megosztott PHP-tárhelyen is Unicode-biztos a 200/320 karakteres válaszhatár. A regressziós teszt `Őő`, `Őszinte`, valamint 240 darab `ő` betű kivágását vizsgálja, félbevágott UTF-8 nélkül.
- **PHP regresszió:** `scripts/test-php-tutor-search.php` ellenőrzi a ragozott kereséseket, a megfelelő címkéjű top találatot, a forrásmegjelölést és az idegen alak kizárását; az éles forráscsoportok és a szakmai válaszhelyesség emberi ellenőrzése ettől továbbra is külön feladat.
- **Kódcommitok:** `46682764476dbeed3e739db690c2cee17b5797b8`, `7119a5feee63f8847a65d0128fec327940606167`, `75590433e92f5876cefdfb0ea204f5f1735dc50c`, `6b132d15a0aa8973990d075bbb43c14cdc407c2f`, `650025d1d3fd37f952e28683a944fbb79ff5e1b8`.
- **CI:** a `75590433` funkcionális állapoton PHP/MySQL/ZIP `42579069132`, Linux `42579069078` és Chromium `42579069080` mind sikeres; a végső UTF-8 regressziót tartalmazó futást külön kell ellenőrizni a kiadási döntés előtt.
- **Kiadás:** ez az A-09 pont technikai előrelépése, **nem** teljes szakmai, szerzői jogi vagy éles fiókos elfogadása. PR #2 továbbra is Draft; nincs `main` összevezetés vagy végleges kiadási link.

## 2026-11-09 – A-08: 09. szótár azonos forrásnévvel a két indexben

- A `server-knowledge.ts` statikus index és a `scripts/export-php-knowledge.ts` PHP-index a 09. Zenei kifejezések **azonos** tartalmához korábban eltérő csoportnevet rendelt. A PHP címkéje saját szótárként értelmezhető volt, míg a statikus leltár jelzi, hogy a mellékelt forrás nem minden címszava lektorált.
- Most mindkét index a **„Zenei kifejezések – mellékelt, nem minden címszóban lektorált teljes szótár”** forrásnevet használja. A 1793 eredeti címszóazonosító, definíció és tanulói eredmény azonos marad.
- A `scripts/verify-php-knowledge-parity.ts` ennek megfelelően az új, egységes név alatt is tételenként ellenőrzi az összes fogalmat; a teljes PHP-telepítő CI sikertelen, ha bármelyik hiányzik.
- **Éles állapot:** az eltérő korábbi 75/2840 és 104/3806 jelentés számai külön gyártási/telepítési verzióra is utalhatnak; pusztán az offline indexek címkéjének egységesítése az élő szerver darabszámát nem változtatja meg. Éles forrásleltár új telepítés utáni mérése szükséges, ezért A-08 továbbra is részlegesen lezárt.

## 2026-11-09 – A-03/A-17: 15 kérdéses kvíz teljes hibajegyzékének megőrzése

- **Talált adatvesztés:** a `QuizView` egy gyakorlókörben legfeljebb 15 kérdést mutat, de a hibás kérdések listáját korábban `.slice(0,12)` korlátozta. Ha egy hallgató mind a 15 választ elrontotta, az utolsó **három hibás kérdés azonosítója kimaradt** a gyakorlási statisztikából. A `src/progress.ts` régi migrációja és a PHP `progressOk()` ugyanilyen legfeljebb 12-es korláttal működött.
- **Javítás:** `QuizView.tsx`, `src/types.ts`, `src/progress.ts`, `php/api/index.php` közös határértéke 15. A korábban mentett ≤12-es hibajegyzékek továbbra is elfogadhatók; a korábban elveszett három ID-t azonban a rendszer nem tudja rekonstruálni.
- **Automatizált regresszió:** `progress.test.ts` igazolja a 15 hibás kérdés helyes migrációját és a 16-os túlméretű lista elutasítását; `scripts/test-php-progress-revisions.sh` tényleges PHP/MySQL környezetben 15 hibajegyzékelemet elment és visszaolvas, a 16. elemre HTTP 400 válasz jön; `scripts/browser-smoke.mjs` 15 kérdésből álló, teljesen elrontott vegyes kvízt játszik végig, oldalfrissítés után is ellenőrzi az összes hibaazonosítót, majd a Profilban az összes 15 átismétlendő kérdés megjelenését.
- **Kódcommitok:** `604d4189d70f3669cb611f6b513e2cf1267dad21`, `5329c0cb1360d15c3ceb29abdd58cc5af0239a44`, `05e19f2286e2a480b9e6c7ba6c96a548f85acc4d`, `da65df89406cb2d94e8b43443270e89bf4552aff`, `732794f61d92b359541d4f99ad6b4e9a05acb526`, `acd3521a8d5cdb57b18e00bb448639272326d5a6`, `acd5a3f78a8df33cab69bd225335a708aac88bb2`, `6050214586df3ce5877ec415dc7ea3368b660ecd`.
- **Igazolt egyetlen commitra futó teljes CI:** Chromium `42592322351` **success**, PHP/MySQL és telepítő `42592322571` **success**, Linux `42592322643` **success**. Éles hallgatói kvízpróba és a statisztikák zenepedagógiai értelmezésének jóváhagyása továbbra is hátra van; ez nem zárja le automatikusan az A-03/A-17 pontokat.

## 2026-11-09 – A-06/A-16: offline profilmentés szerverkompatibilis normalizálása

- **Talált probléma:** a PHP `progressOk()` maximum 10 000 listaelemet, 500 kvízeredmény-kategóriát és az azonosítóknál 120 **UTF-8 bájtot** fogad el. A régebbi böngészős `migrateProgress()` csak a JavaScript sztringeket szűrte; nem tartotta be ezeket a listakorlátokat, és az ékezetes szövegek bájtméretét sem vizsgálta. Két offline eszközön létrehozott profil összevezetése után tehát előállhatott a PHP által visszautasított mentési tartalom.
- **Javítás:** `src/progress.ts` azonosítói most UTF-8 bájthosszal ellenőrzöttek, az elavult listák és kvízeredmény-kategóriák mennyisége a PHP-korlátok szerint normalizált, a 100 elemnyi kvízpróbálkozás és a 15 hibás kérdés megengedett határa változatlan. Az általános `mergeProgress()` és a háromutas `mergeConcurrentProgress()` is normalizálja az eredményeket; utóbbi továbbra is megőrzi a helyi kedvenctörlés és a másik eszközön hozzáadott kedvenc különbségét. Az érvényes adatok előnyt élveznek, de a szerverlimit feletti tételek a normalizálás során kieshetnek; ezért ez továbbra sem helyettesíti a többeszközös éles pilotot, sem a teljes XP-eseménynaplót.
- **Regresszió:** `progress.test.ts` ellenőrzi a 61 `ő` betűt tartalmazó (>120 bájt) azonosító kiszűrését, 10 005 fejezetnél a 10 000-es limitet, 510 kvízkategóriából az 500-as korlátot, két 6 000-es listából az összevezetés után megtartott, érvényes eredményeket, valamint a régi offline pillanatképből érkező, hibás szótárkedvenc kizárását.
- **Kódcommitok:** `5635b5a160804ae4f407ca9a14f5f27258dc1535`, `8463981f0972240bac2a59b4a4f7512d913ec140`, `d2514b2f86efddd27b4c5375c969458a8fae306a`, `2f118c7f5b09142d4ec22a87e3b11c35ea011fd6`.
- **Egy commiton igazolt CI:** Chromium `42594491793` **success**, PHP/MySQL/ZIP `42594491809` **success**, Linux `42594491848` **success**. A valós CloudPanel-két-eszközös próba, a szerzői engedélyek, a szakmai lektorálás és a manuális adatvédelmi/WCAG-ellenőrzés változatlanul nyitott; PR #2 Draft, a `main` változatlan, nincs végleges letöltés.

## 2026-11-09 – A-06/A-21: a kezdeti munkamenet késői válasza nem írhatja felül a friss bejelentkezést

- **Versenyhelyzet:** az `src/App.tsx` induláskor külön `auth/me` és `progress` kérésből állítja vissza az előző munkamenetet. Ha ez a folyamat a felhasználó új bejelentkezése után tér vissza, a régi inicializálás korábban lecserélhette a frissen belépett fiókot és az oldalon látható tanulási adatokat. Ez elsősorban változó sebességű hálózaton vagy késlekedő szervernél jelentkező probléma.
- **Kódjavítás:** a kezdeti betöltés a kezdő `accountGenerationRef` értékét rögzíti, és a régi eredményt sem `auth/me`, sem `progress` után nem alkalmazza, ha azóta fiókváltás történt. Az `onSignedIn` már **a saját szerveres `progress` kérése előtt** érvényteleníti a régi generációt, és a válasz alkalmazása előtt újra ellenőrzi az azonosítót. Kijelentkezéskor a korábban meglévő generációváltás működik tovább.
- **Böngészős regresszió:** a `scripts/browser-smoke.mjs` új, izolált szerepkör-fixture-ben mesterségesen visszatart egy korábbi `auth/me` választ; ezalatt új hallgatói belépést és tanulási naplóbetöltést hajt végre, majd szándékosan késve visszaengedi a régi adminfiók válaszát. Ellenőrzi, hogy az új hallgató neve/jogosultsága változatlan marad, az ADMIN menü nem jelenik meg, és a régi bootstrap nem indít második tanulási naplóbetöltést. Ez mockolt böngészős ellenőrzés; az éles CloudPanel több eszközös és valós munkamenetes elfogadás ettől még nyitott.
- **Kódcommitok:** `28f26398d0c4d0e5bd6f1c9e870b139b8ff23524` (védett inicializálás), `f7488eae6ae0276899b59dc2bb74aee17f0cf676`, `597215a7ad55f84ae8893076191913977c7951d2` (böngészős regresszió). Az első commit Chromium/PHP/MySQL/Linux ellenőrzése sikeres: `42596084500`, `42596084478`, `42596084491`; a késleltetett válaszos böngészőtesztet a GitHub Chromium-futás sikeresen igazolta: `42596766184` (a naplóban: „Account UI: late startup auth response cannot replace newly signed-in user”). Ugyanezen SHA PHP/MySQL/ZIP-futása `42596766170` **success**, Linux-futása `42596766215` **success**.
- **Kiadási kapu:** az éles két fizikai eszközös bejelentkezés, fiókváltás, lassú hálózati mentés és a tényleges adatvédelmi próba továbbra is nyitott. Ez a javítás nem jogosítja fel a PR #2 `main` ágra történő összevezetését vagy a végleges ZIP kiadását.

## 2026-11-09 – A-06/A-21: félbeszakadt belépés és 64 KB-nál nagyobb tanulási napló

- **Részben sikerült hitelesítés visszavonása:** `AccountPanel.tsx` korábban az `auth/login` HTTP 200 válasza után az `onSignedIn()` `progress` GET hibáját sikertelen bejelentkezésként kezelte, holott a böngészőben a szerver munkamenet-cookie-ja már aktív volt. A javított felület a tanulási napló lekérésének hibája esetén azonnal `auth/logout` POST-tal visszavonja az új munkamenetet; így a vendégfelület nem marad észrevétlenül hitelesített állapotban. Ha a visszavonás hálózati hiba miatt szintén nem sikerül, erről külön, kifejezett figyelmeztetést ad, és nem állítja, hogy kijelentkezett.
- **Böngészős regresszió:** `scripts/browser-smoke.mjs` külön böngészőkörnyezetben eljátssza, hogy az `auth/login` sikeres, de a kezdeti `progress` lekérés 503-at ad. Ekkor ellenőrzi az egyszeri `auth/logout` visszavonást, a hibaüzenetet, valamint hogy a be nem töltött fiók adatai nem jelennek meg hallgatói profilként.
- **Nagy tanulási előzmények:** az összes JSON kérés korábbi **64 KiB-os** határa már a PHP `progressOk()` validációja előtt megakadályozta az érvényes, hosszú naplók mentését. A `getPayload(int $maxBytes=65536)` alapértelmezett szigorú korlátot továbbra is megtartja a hitelesítési, admin- és egyéb JSON-kéréseknél; a verziózárral védett `progress` PUT **1 000 256 bájt** bemeneti keretet kap, legfeljebb **1 000 000 bájt** tárolt JSON-t fogad el. Ez a teljes napló méretének határa, nem minden későbbi mentésre adott garancia.
- **PHP/MySQL-integráció:** `scripts/test-php-progress-revisions.sh` valós MySQL-teszttáblában elment és visszaolvas egy 64 KiB-nál nagyobb, de az 1 MB-os határnál kisebb, több száz alfejezetet tartalmazó eredményt; a több mint 1 MB-os kérésre **HTTP 413** jár, és a szerververzió / korábbi adatok változatlanok maradnak. Nem írja át az éles felhasználói adatbázist.
- **Kódcommitok:** `9e3e9fcb219353e369939c1343fe727b69f86e88` (félbeszakadt belépés visszavonása), `ed9a3c053401426cf238791450dac43beda552bb` (böngészős regresszió), `eba36f86b2bd91bf3a14f90b1d4bb37bfbab7afc` (progress API méretkeret), `2e3bdd7b26ffd294b81883d1ca54c5f41241fbe3` (MySQL regresszió), `759e1ea490cd5323a371b5df0ec9c33e4688151f` (Chromium tesztjavítás).
- **Együttes CI a `759e1ea` commiton:** Chromium `42604648174` **success**, PHP/MySQL + CloudPanel ZIP `42604648124` **success**, Linux `42604648106` **success**. Az élő CloudPanel, a Rackhost SMTP, a szakmai lektorálás, a forrásengedélyek, a két fizikai eszköz és a manuális WCAG/adatvédelmi elfogadás még **nem igazolt**.
- **Kiadási korlátozás:** PR #2 Draft, `main` változatlan, végleges ZIP-letöltés nincs. Az A-06/A-21 pontok továbbra is részben elfogadottak.

## 2026-11-09 – A-06: nagyobb tanulási naplók offline visszaállításának biztonsága

- **Helyi korlát-ütközés:** a PHP tanulási napló PUT immár 1 MB-ig fogad érvényes eredményt, de a `src/pendingProgress.ts` régi helyreállítási mentése egyszerre tartalmazza a *szerveres alapállapotot* és az *offline módosított állapotot*, így már 500 KB-nál nagyobb egyetlen példány mellett meghaladhatta a teljes korábbi 1 MB-os helyi limitet. Ez megakadályozhatta a fiókhoz kötött offline biztonsági másolat elkészítését, miközben maga a napló a PHP számára érvényes volt.
- **Javítás:** a kétpéldányos helyi helyreállítási keret **3 000 000 UTF-8 bájt**, tehát két, közel 1 MB-os mentés számára is elegendő tartalékot ad. A kód méretellenőrzése most nem JavaScript UTF-16 kódegységeket, hanem tényleges UTF-8 bájtokat mér. A `kodaly_pending_progress_<azonosító>` kulcs és az `ownerId` összevetése változatlan; másik hallgató offline adata nem importálható automatikusan. Túlméretes vagy hibás helyi adatot a rendszer továbbra is elutasít. Ez böngészőoldali *best effort* mentés: privát mód, letiltott tárolás vagy megtelt helyi tár esetén továbbra sem garantált, hogy elmenthető.
- **Regresszió:** `progress.test.ts` egy 7000 alfejezetes, az előző 1 MB-os korlátnál nagyobb, kétpéldányos helyreállítási mentést készít és olvas vissza, megőrzi az offline új eredményt, kizárja a másik fiók azonosítóját, és csak a ténylegesen szerverre mentett állapot visszaigazolásakor törli a helyi pillanatképet. Egy külön eset az `ő` többbájtos magyar karaktert használva igazolja a 3 MB-os UTF-8 korlátot.
- **Kódcommitok:** `66420d269b6308d862c8a7336d0f86977ceb92d4` (helyi méretkeret és byte-kalkuláció), `eafdddd32c7aca6476746aea386626c37835f4ef` (két nagy pillanatkép / UTF-8 / fiókizoláció tesztje).
- **CI az együttes kódverzión:** Chromium `42687592512` **success**, PHP/MySQL/ZIP `42687592454` **success**, Linux `42687592389` **success**. Ez a fejlesztői automata körre érvényes; nem a CloudPanel tényleges telepítési vagy két fizikai eszközös próbája.
- **Fennmaradó elfogadás:** A-06 továbbra is nyitott a valós két eszközös próba és a böngészőkvóták kézi vizsgálata miatt. A szerzői engedélyezés, zenepedagógiai szakellenőrzés, SMTP, manuális akadálymentességi és adatvédelmi jóváhagyás sem zárult le. Végleges ZIP-link és `main` összevezetés továbbra sincs.


## 2026-11-09 – A-08/A-09: hosszú magyar forrásszöveg, élő index és Unicode-lefedettség

- **Tényleges hibajavítás:** a `php/api/tutor-sources.php` korábban a 1400 bájtnál hosszabb, külön feltöltött oktatói szövegsorokat egyszerű `substr` művelettel levágta. A sor végén szereplő fogalom eltűnhetett a Tanársegéd indexéből, a magyar UTF-8 ékezetes karakterek pedig sérülhettek. A `tutorSourceUtf8Pieces` már teljes, Unicode-határon darabolt, legfeljebb 900 bájtos részeket állít elő, a kereső maximum 1000 bájtos részleteibe rendezve. A forrás eredeti szóközeit és a rövid utolsó részletet is megőrzi.
- **Teszttel javítva:** az új `scripts/test-php-tutor-sources.php` regresszió 1049 `ő` karakteres, hosszú lezáró fogalmat tartalmazó szöveget, UTF-8/JSON-érvényességet, 1000 bájtos korlátot és 900 bájtos részlet utáni egyetlen karakteres maradékot vizsgál. Az első javítás `e8e033ea` SHA-n a rövid szóközkezelési eset miatt **elhasalt** (PHP CI `42691469202`); a következő `972794ec` SHA-n a PHP/ZIP `42691962487`, Chromium `42691962266` és Linux `42691962716` **sikeres**. A zöld teszt nem jelent éles CloudPanel-validálást.
- **A-08 kötelező bankok:** a PHP `tutorDetailedCoverage` hat előírt tanulói forrásbankot (szókártyák, kvíz, párosító, hangzó hangsor/akkord, hangkészletek, kvintkör) jelenlétre ellenőriz; hiányukat az admin `missing` listájában jelzi. A `src/components/AdminDashboard.tsx` ezen bankokat élő darabszámmal és `HIÁNYZIK` figyelmeztetéssel is megmutatja. Az ellenőrzés a hiányzó teljes bankot fogja meg, az **egyedi elemek teljes egyezését** továbbra is a `scripts/verify-php-knowledge-parity.ts` buildteszt igazolja.
- **Unicode-karakterpontosság:** a `server-knowledge.ts` statikus és a `php/api/tutor-search.php` élő riportjában a `characters` mező most Unicode-karakterszámot jelent; korábban az egyik JavaScript UTF-16 kódegységeket, a másik PHP UTF-8 bájtokat számolt. A PHP opcionális mbstring nélküli megoldása nem készít külön tömböt minden karakterhez. A Node/PHP regressziók a magyar ékezeteket, a zenei Unicode jelet és a hat bank azonos listáját vizsgálják.
- **A-08/A-09 lezárása továbbra is nyitott:** a ténylegesen telepített PHP-index forráscsoportonkénti egyeztetése, a külön engedélyezett forrásfájlok jelenléte, a magyar pedagógiai kérdés-válasz szaklektorálása és a CloudPanel többfelhasználós próbája még nem történt meg. A statikus és élő index eltérő részletszáma önmagában nem hiba, és nem is bizonyítja a teljességet. **A PR #2 Draft, a `main` változatlan, végleges letöltés továbbra sincs.**


## 2026-11-09 – A-23: Tanársegéd képnagyítás és billentyűzetes fókuszkezelés

- **Talált akadálymentességi hiány:** a Tanársegéd három képnagyító nézete (előre szerkesztett kottaábra, jegyzetoldal, generált kép) nem rendelkezett teljes, egységes Escape/Tab-kezeléssel és fókuszvisszaállítással; a jegyzetkép-nagyító nem volt ARIA `dialog`-ként megjelölve. A beszélgetésablak nyitása a fókuszt nem tette a kérdésmezőre, bezárása nem állította vissza az indítógombra.
- **Javítás:** `src/components/ChatAssistant.tsx` modalitásonként `role="dialog"`, `aria-modal="true"`, megnevezett bezárógomb, Tab-csapda az egyetlen vezérlőre, Escape-kezelés, indítógomb-fókuszvisszaállítás; a beszélgetésablak külön, nem modális `dialog` és saját Escape-kezelés/fókuszvisszaállítás.
- **Automatikus ellenőrzés:** `scripts/browser-smoke.mjs` mobil méretben ellenőrzi az ábra-/jegyzetmodalt, Tab- és Escape-viselkedést, a beszélgetés megnyitásakor a kérdésmező fókuszát és Escape után az indítógomb fókuszát; a generált képes ág is kapott külön képként szimulált regressziót. A `a6434df2` SHA **Chromium `42695157847`, PHP ZIP `42695157599`, Linux `42695158196` mind sikeres**. A generált képes ág külön regressziója a `61eaf916` SHA-n Chromium `42695509995`, PHP/MySQL/ZIP `42695509567` és Linux `42695509794` workflow-n **sikeres**. Ez kontrollált képadat, nem a külső képgeneráló szolgáltató éles kipróbálása.
- **Korlát:** az automatizált böngészős teszt és axe nem helyettesíti a képernyőolvasóval, nagyítással, magas kontraszttal, valódi billentyűzettel, mobilon és mindkét színtémában végzett kézi vizsgálatot. Az A-23 **nem lezárt**. Nem történt éles CloudPanel-publikálás, `main` összevezetés vagy végleges csomag kiadás.


## 2026-11-09 – A-24: rekurzív fájlbiztonság és közös kiadási verzió

A kiadási kapu új, **ténylegesen implementált** technikai védelmei:

1. **Talált hiba:** a telepítési diagnosztika korábban csak `htdocs/` és `htdocs/api/` közvetlen állományait nézte, ezért a mélyebb mappákba került `.env.production`, `*.SQL.GZ` és egyéb archívumok észrevétlenül nyilvánossá maradhattak. A `php/api/deployment-audit.php` most rekurzívan, korlátok között vizsgál; találatot relatív útvonallal jelzi, a fájl tartalmát és privát szerverútvonalat nem árulja el. A teljes bejárás elmaradása blokkolja a pozitív állapotot. Ellenőrzi a kockázatos külső symlinkeket és a nyilvános `.git`/hasonló könyvtárakat is.
2. **Telepítési verzióvédelem:** a `scripts/stamp-php-release.py` a kiadási workflow által ténylegesen ellenőrzött Git-revíziót három helyre írja: `index.html` meta, `release-build.json`, `api/release-build.php`. A PHP `auth/deployment-check` ezt **kódvégrehajtás nélkül** ellenőrzi. Hiányzó vagy eltérő verzióval a `buildConsistent` hamis, a kész jelzés tiltott; az admin oldalon külön figyelmeztetés látható. A funkció elsősorban a korábbi, részlegesen feltöltött frontend/API okozta hallgatói mentési problémák újbóli előfordulását segít megelőzni.
3. **Végpont és kiadási ZIP tesztelése:** `scripts/test-php-deployment-audit.php` külön ellenőrzi a beágyazott archívumokat, rejtett konfigurációt, szimbolikus hivatkozást, túl alacsony vizsgálati korlátot és eltérő/duplikált revíziót. `scripts/test-php-invitations.sh` bejelentkezett admin HTTP-kéréssel ellenőrzi a rekurzív jelentést és a vegyes kiadás tiltását. `scripts/verify-release-assets.py` a PHP ZIP-et is megállítja veszélyes közállományoknál és hibás háromrétegű verziójelölésnél. A böngészős mock `live/static/incomplete/mixed` módokat fed le.
4. **Ellenőrzés:** a `fb9860de` SHA-n a **Chromium `42699297630`, PHP/MySQL/ZIP `42699297596`, Linux `42699297595` sikeres**. A korábbi `229af49c` állapotban a Chromium-teszt kizárólag az elavult sikerüzenet-fixture miatt bukott; a módosított UI-státusz tesztje az `a196b2aa` SHA-n már mindhárom workflow-val sikeres. A végleges ZIP artefaktum megléte nem jogosít élesítésre.
5. **Nyitott éles elfogadás:** CloudPanelen tényleges kétirányú telepítés/visszaállítás, korábban feltöltött fájlok ellenőrzése, valós SMTP, OAuth nélküli meghívó és profil életút, két külön fizikai eszközös mentésellenőrzés, engedélyek és zenei lektorálás, manuális akadálymentesség. Az A-24 **nem lezárt**. A `main` és a letöltési kiadás tiltása változatlan.

## 2026-11-09 – A-17/A-24 regresszió: kérdésazonosítás és tényleges fájltartalom-ellenőrzés

- **Kvíz:** a `2152bd64` Chromium-futás (`42700089199`) a vegyes teszt 15 hibás válaszának tárolási ellenőrzésénél megállt. A régi teszt csak kérdésszöveg alapján választott hibás opciót, amely az ismétlődő kérdésfeliratok mellett nem elégséges azonosító. Javítva: a teljes megjelenített válaszkészletet és sorrendet is egyeztetjük, ellenőrizzük a rose-színű hibavisszajelzést és naplózzuk a mentési adatot, ha hibázik. A tananyag-integritási teszt tiltja az azonosan látható, de ellentmondó megoldásokat.
- **Kiadási integritás:** a korábbi három Git SHA-címke mellé 2-es sémájú `release-build.json` került a ténylegesen csomagolt JS/CSS-belépési fájlok és hat kritikus PHP-modul SHA-256 lenyomatával. A `scripts/stamp-php-release.py`, a `scripts/verify-release-assets.py` és a `php/api/deployment-audit.php` azonos elv szerint ellenőrzi a fájlneveket és lenyomatokat. A teszt szándékosan felülírja a JavaScript-állományt úgy, hogy a verziójelölők egyezők maradnak, és ellenőrzi a blokkolást.
- **CI:** `6b15eac6` teljes zöld futások: Chromium `42702327442`, PHP/MySQL/ZIP `42702327370`, Linux `42702327534`. A kiadás továbbra is blokkolt: a CloudPanel éles verzióellenőrzése, a visszaállítási próba, az engedélyek, a pedagógiai lektorálás, az SMTP, a két fizikai eszköz és a kézi akadálymentességi audit nincs igazolva.


## 2026-11-09 – A-16: üres és Unicode-szóközös tanulói azonosítók kiszűrése

- **Talált adatminőségi hiány:** a felhasználói eredmények `completedChapters`, `completedSubchapters`, `flashcardsMastered`, `matchingCompleted`, `favoriteExpressions`, `quizScores`, `quizAttempts` és `wrongQuestionIds` listái/rekordjai korábban elfogadhattak üres vagy kizárólag szóközökből álló, bár 120 bájtnál nem hosszabb azonosítókat. Ezek téves eredmény-, kedvenc- vagy kérdésbejegyzésekhez vezethetnek.
- **Javítás:** `src/progress.ts` a régi/hibás böngészős adatokat szűri, `php/api/index.php` `progressIdOk` pedig Unicode-tudatosan, 120 bájtos korláttal elutasítja az ilyen hibás szinkronadatokat. A meglévő helyes bejegyzések megtartandók; ez nem XP-pontszám-újraszámolás.
- **Teszt:** `progress.test.ts` a teljes tanulói lista-, kvíz- és kedvenc-kollekciót teszteli, beleértve a `U+00A0` nem törhető szóközt; `scripts/test-php-progress-revisions.sh` az éles PHP mentési API-val megegyező HTTP-útvonalon normál és Unicode-szóközös azonosítókat próbál meg elmenteni, és ellenőrzi a 400-as elutasítást az előző szerverrevízió megőrzésével.
- **Bizonyíték:** `976e2f97b658eebd7988a4cc41f7814ab33b6068` commiton mindhárom GitHub Actions sikeres: Chromium `42703771415`, PHP/MySQL/ZIP `42703771299`, Linux `42703770837`.
- **A-16 nyitott marad:** az XP mint tanulási mutató értelmezése és az éles, két fizikai eszközön végzett szinkronizálási próba nincs jóváhagyva. A `main` összevezetés és a végleges letöltés változatlanul blokkolt.


## 2026-11-10 – A-17/A-24: kvízhibák és minden kiadott PHP-funkció integritása

- **A-17 – talált adatellentmondás:** a `quizAttempts[].wrongQuestionIds` korábban tárolhatott több azonosítót, mint amennyi tényleges hibás válasz (`total - correct`) lehetséges, illetve azonos kérdésazonosítót többször is. A `src/progress.ts` régi helyi eredmények validálásakor és a `php/api/index.php` bejövő fiókszinkron-kérésnél ezt ellenőrzi. `progress.test.ts` és `scripts/test-php-progress-revisions.sh` negatív regressziói azt is vizsgálják, hogy hibás kvízstatisztika ne módosítsa a szerver mentési verzióját. Az eredmények pedagógiai értelmezését nem igazolják.
- **A-24 – javított fájl-lefedettség:** a három, azonos Git SHA-t tanúsító címke mellé épített 2-es sémájú `release-build.json` immár a korábbi 6 helyett **12 kötelező PHP-állomány** (a teljes saját `api/` feladatkód, tudásindex és `vendor/autoload.php`) SHA-256 lenyomatát tartalmazza. Ezzel a Tanársegéd képgeneráló vagy kreatív válaszmoduljának, a zenés válaszoknak és a Composer belépési pontnak a véletlen régi feltöltése is diagnosztizálható. Az előre csomagolt Vite JS/CSS belépési fájlok szintén ellenőrizve.
- **Külön hibaszimuláció:** `scripts/test-php-deployment-audit.php` egyező verziócímkék mellett szándékosan felülírja a képgeneráló modult és a Composer autoload fájlt, majd ellenőrzi a `buildConsistent=false` állapotot; visszaállítás után újra megfelelő. PHP/ZIP build, Chromium és Linux a `d98844e9` SHA-n **sikeres**: `42781698058`, `42781697939`, `42781697932`.
- **Le nem zárt elfogadás:** az A-17 szakmai, az A-24 szerveroldali (CloudPanel, SMTP, felhasználók, visszaállítás), az A-15 jogállási és A-23 akadálymentességi kiadási kapuk továbbra is nyitottak. A PR Draft marad, `main` összevezetés és végleges letöltés nincs.


## 2026-11-10 – A-06/A-16: offline kvízpróbálkozás ütközése és pontszámkulcsok

- **A-06 valódi adatmegőrzési hiba:** a `mergeProgress` azonos ID-jű helyi és szerveres kvízpróbálkozásnál korábban a helyit hagyta érvényesülni. A következő, offline helyreállítást vagy 409 utáni összevezetést végző mentés ezért visszaminősíthetett már mentett kvízpróbálkozásokat. Most elsőként a szerveres rekord kerül a `Map`-be, és ugyanahhoz az ID-hez több rekord már nem írható be; más, valóban új helyi próbálkozások megmaradnak.
- **A-16 adatminőség:** a JSON-kulcsként érvényes `constructor`, `toString` vagy `__proto__` fejezetazonosítók egyesítésénél a sima `{...quizScores}` objektum örökölt tulajdonságaiból `NaN` pontszám keletkezhetett. A köztes pontszámtár most öröklésmentes; a feldolgozott kimenet változatlan, JSON-kompatibilis szerkezet.
- **Automatikus tesztek:** `progress.test.ts` szerveres-első kvízazonosító-kollíziót ellenőriz normál importnál, `mergeConcurrentProgress`-nél, majd `savePendingProgress` → `loadPendingProgress` → `recoverPendingProgress` helyi helyreállítás után. Külön teszt a prototípushoz kötődő JSON-pontszámkulcsok helyes tárolása.
- **CI-bizonyíték:** commit `cd93c248b2014f81b508f7b9935bc6f2f0b466dd`: Chromium `42784207250`, PHP/MySQL/ZIP `42784207070`, Linux `42784207054` – **mind sikeres**. Nem áll rendelkezésre ezzel egyenértékű éles, két valódi fizikai eszközös bizonyíték; a lektorálás, jogok és CloudPanel-pilot továbbra is nyitottak.


## 2026-11-10 – A-06/A-16/A-17: böngészős 409 összevezetés és kvíz-duplikáció tiltása

- **A-17 kvízversenyhelyzet:** a kvíz `handleSelectOption` és `handleNext` React-állapotváltozásai között két szinkron kattintás egy kérdést kétszer értékelhetett, a `Következő kérdés` műveletet kétszer alkalmazhatta vagy a befejezett kvíz eredményét kétszer rögzíthette. A `src/components/QuizView.tsx` válaszadási és továbblépési `useRef` zárai ezt kizárják. A Playwright 15 kérdéses ciklus valós DOM `element.click(); element.click()` hívásokkal ellenőrzi a rossz válasz egyszeri rögzítését, a kérdés át nem ugrását, a befejezés egyetlen próbálkozását és az újratöltés utáni hibás kérdések megmaradását.
- **A-16 kategóriakódok:** a pontszám mentésekor az `App.saveQuizScore` korábban egyszerű `prev.quizScores[chapterId]` értéket olvasott, amely egy nem saját objektumkulcs (`constructor`, `toString`) esetén nem számra, hanem beépített JavaScript-függvényre mutathatott. Az új `getQuizBestScore` csak `hasOwnProperty`-val igazolt, véges saját számszerű értéket fogad el; a teszt külön vizsgálja az érvényes `__proto__` saját JSON-kulcsokat és a korrupt számokat.
- **A-06 a tényleges React-útvonalon:** két elszigetelt Chromium-környezet, azonos szerver-fixture és két eltérő offline kedvenc adja a bemenetet. Az első PUT szándékos visszatartása 409-es ütközést vált ki a második kliensnél; az alkalmazás valódi `mergeConcurrentProgress` és mentési retry útvonala mindkét kedvencet megőrzi, majd az első kliens újratöltése is az egységes szerveres állapotot mutatja. Nem valós CloudPanel vagy fizikai eszköz, ezért az A-06 kiadási elfogadása még nyitott.
- **CI:** dupla kattintási E2E `fa4a7a3c`, biztonságos best-score `218813be`, két böngészős 409 E2E `f86a6bdc`: mindhárom ponton sikeres Chromium, PHP/MySQL/ZIP, Linux. A két böngészős konkrét futások: `42795162233`, `42795162134`, `42795162417`. Pedagógiai, jogi és éles rendszerbeli elfogadás továbbra is kötelező.


## 2026-11-10 – A-08: Unicode-biztos, veszteségmentes forrásexport

- **Hiba és javítás:** a PHP tudásbázis exportja korábban `slice(offset, offset+1200).trim()` művelettel vághatott ketté olyan UTF-16 surrogate pairt, mint a `𝄞`, és a 30 kódegységnél rövidebb forrásvégeket eldobta. A leckék korábbi `slice(0, 5000)` rövidítése minden további tartalmat elhagyott. A `scripts/knowledge-chunks.ts` most Unicode-grafémánként, a szöveg és minden üres-/sortörés karakter hű megőrzésével oszt; az exportált darabok összefűzve az eredeti oldalszöveget adják.
- **Tananyag/AI egységesség:** a PHP `scripts/export-php-knowledge.ts` most teljes alfejezetszövegeket, `examples.notes`/`examples.audioNotes` zenei példákat és `quotes` forrásmegjelöléseket is tartalmaz, nem csupán az összefoglalót és a főszöveget. A statikus `server-knowledge.ts` ugyanazzal a grafémabiztos segéddel vágja a hosszú részleteket; a saját tananyag példamezői is egyeznek.
- **Visszaellenőrzés:** `scripts/test-knowledge-chunks.ts` grafémahatár-, hosszú szöveg-, összetett ékezet- és rövid záró részlet próbák. `scripts/verify-php-knowledge-parity.ts` az **összes 15** tananyag-alfejezet teljes szövegét, 395 eredeti magyar forrásoldal-csoportot és a 7 tanulói gyakorló-/szótáradatbázis teljes tételkészletét összesítve, tételenként vizsgálja, nem csak a számukat.
- **CI:** `80d31fea641cfaf2cffd00bfb64d6c02674e94fb`: statikus index **4041** részlet / **104** forráscsoport / 0 hiányzó kötelező fájl; PHP Tanársegéd **4249** részlet; 15/15 alfejezet, 395/395 forrásoldal-csoport, 1793/1793 szótárelem, 460/460 szókártya, 439/439 teszt, 449/449 párosító. Chromium `42847943126`, PHP/MySQL/ZIP `42847943232`, Linux `42847943224` **sikeres**. Egy korábbi CI-futás a vártnál alacsonyabb, de helyesen ellenőrzött 15 alfejezet miatt mesterséges `>=25` számlálóküszöbön megállt; ezt a valós adatszerkezethez igazítottam. A kód vagy forrás nem veszett el.
- **Korlát:** A-08 szemantikus és éles CloudPanel-forrásellenőrzése, A-15 jogállás, A-20 szakmai lektorálás, A-21 személyes próba és A-24 éles telepítési elfogadás nyitott. Ne hivatkozzunk pusztán a PHP/Node indexek eltérő darabszámára adatvesztés bizonyítékaként.


## 2026-11-10 – A-08/A-24: szerveren külön feltöltött tanári szövegek megőrzése

- **Tényleges hiba:** a `php/api/tutor-sources.php` feltöltött forrásfeldolgozója korábban kihagyhatta a különösen rövid bekezdéseket (például egy önálló „Dó–ré” példát); a `trim()` és a mondatok feldolgozása elveszítette a bekezdések közötti eredeti sortöréseket és szóközöket. A feltöltött `*.txt` és `*.md` forrásokból emiatt nem mindig lehetett maradéktalanul visszanyerni az eredetit.
- **Szöveghű javítás:** a PHP daraboló az eredeti szöveget teljesen megőrzi; `tutorExtraKnowledge()` nem dob el címsorokat és 40 bájt alatti zenei példákat. A 900 bájtos részleteknél a `\X` Unicode-gráfémahatárt is vizsgálja, nemcsak a teljes UTF-8 kódpontokat. A normál, 1000 bájtnál kisebb keresési részletek és a forrásmegjelölések megmaradnak.
- **Adatvédelem:** a külön forrásmappa `tutorSourceList()` függvénye nem követ symlinket, a túlméretes vagy rossz JSON-ból származó rekordot nem tekinti jóváhagyott forrásnak; a Tanársegéd sem indexeli azokat. A jogosult admin továbbra is saját forrásait kezeli a korábbi API-kon, a rendszer nem töröl éles fájlokat.
- **Regressziós próbák:** `scripts/test-php-tutor-sources.php` több bekezdés teljes összeillesztését az eredeti forrással egyezteti, beleértve a CRLF/LF sortöréseket, rövid szolmizációs példát, az `e + U+0301` kombináló ékezetet, a négybájtos `𝄞` jelölést, az `👩‍🎼` emoji-szekvenciát, az izolált külső fájlra mutató symlinket és a JSON-típushibákat.
- **GitHub CI:** `32d26dc6e84880a66e7fad2e77249ac49d3ad6ca` állapoton Chromium `42850213678`, PHP/MySQL/ZIP `42850213955`, Linux `42850213088` – mindhárom **success**. A teljes éles forráskészlet megőrzésének, jogszerűségének és zenei helyességének jóváhagyása ettől még **nem teljesült**. PR #2 továbbra is Draft, `main` nem módosul.
