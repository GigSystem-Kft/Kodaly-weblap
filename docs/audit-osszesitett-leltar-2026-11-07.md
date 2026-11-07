# Zeneelméleti Műhely – összevont auditleltár (v1.1)

Dátum: 2026-11-07. Forrás: a 2026-11-07-i 18 pontos kódaudit és a további 6 ellenőrzési terület. A-19–A-24 vizsgálati hatókör, nem mind igazolt hiba.

**Változtatási szabály:** meglévő tanulói adatokat nem törlünk; éles kiadás előtt CI + szerepkörös és telepítési ellenőrzés; státuszt csak bizonyíték alapján zárunk.

| Prioritás | ID | Téma | Állapot |
|---|---|---|---|
| P0 | A-01 | 13 ritmikai oldalkép hiányzik a kiadásból | Eredeti 13 oldalas PDF megtalálva, 13 JPG helyben előállítva; a bináris oldalképek GitHubba való felvétele még hátra |
| P0 | A-02 | Tankönyvkereső ékezet- és szóközkezelése hibás | Kódjavítás és CI build/tesztek sikeresek; élő magyar kereső-E2E még hátra |
| P0 | A-06 | Párhuzamos profilmentések felülírhatják egymást | Compare-and-swap mentés; háromutas kedvenc-összevezetés és kijelentkezés előtti mentetlenségfigyelmeztetés, regressziós tesztek. MySQL CI-sikeres; valódi többeszközös böngészős próba hátra |
| P0 | A-18 | Release csomag teljessége nincs ellenőrizve | Média-manifeszt: 302 tankönyvoldal, 13 ritmikai kép, 64 jegyzetkép JPEG-jelölő és méretellenőrzéssel; a hiányos ZIP blokkolt; az egyetemi PDF alternatív URL-jének SHA-256-ja sem egyezett, a 13 lokális JPG GitHubba való felvétele szükséges |
| P1 | A-03 | 04/05 tesztkategóriák hiányoznak | Kódjavítás és kategória-regresszió CI sikeres; valódi böngészőteszt hátra |
| P1 | A-04 | Alfejezet-teljesítések nem íródnak | Kód javítva: manuális alfejezetjelölés, teszt hátra |
| P1 | A-05 | Párosító teljesítési naplója hiányzik | Kód javítva: stabil pár-ID-k, teszt hátra |
| P1 | A-07 | 09. fejezet hiányzik a PHP AI forrásriportból | Kódjavítás és PHP forrásteszt sikeres; éles tudásindex hátra |
| P1 | A-08 | Statikus AI leltár eltér az élő index mérésétől | Külön élő és buildleltár megjelenítés implementálva; éles ellenőrzés hátra |
| P1 | A-09 | PHP Tanársegéd fallback kereső, nem Gemini chat | Opcionális, alapból kikapcsolt és bejelentkezéshez kötött Gemini PHP-útvonal, nyilvános tananyagból RAG, licencelt forrás kizárva; konfiguráció, élő API- és szakmai választeszt hátra |
| P1 | A-12 | Csak öt alapfejezet teljesítéskövetése teljes | Kilenc modul manuális tanulási jelölése és összegzése implementálva; teszt hátra |
| P1 | A-21 | Vendég/hallgató/tanár/admin end-to-end életút | PHP/MySQL CI szerepkörteszt és Chromium-böngészős mockolt student/teacher/admin navigáció sikeres; fogalomtárkedvencek profilszinkronja implementálva, valódi hitelesített éles próba hátra |
| P1 | A-24 | Valós telepítési E2E és regressziótesztek | Chromium CI 42415390838 sikeres: vendég, szókártya, párosító, 04 kvíz, keresés, mobil touch/AI, szerepkörös UI; valódi éles hitelesítés/telepítés tesztje hátra |
| P2 | A-10 | Szótári taxonómia túl sok Egyéb elemmel | 62+127+69=258 tétel definíció alapján átsorolva, 945 helyett 687 Egyéb; maradék kézi lektorálás szükséges |
| P2 | A-11 | XP kliensoldalról tetszőlegesen halmozható | Párosító 5 XP/új pár (max. 50/kör), hallásfeladat 100 XP/nap, PHP-validált napló és tesztek; az XP továbbra is kliensoldali gyakorlási pont, teljes szerveroldali anti-cheat hátra |
| P2 | A-13 | Párhuzamos, egyenetlen tananyag-adatforrások | A kvíz témakörmenüje közvetlenül az 5 alap- és 4 bővített modulkatalógusból épül; a többi párhuzamos tananyagforrás egyeztetése hátra |
| P2 | A-14 | H/B hangnevek és MIDI megfeleltetése | WebAudio B3/B4/B5 233.08/466.16/932.33 Hz-re javítva, H természetes hang; regressziós teszt a 42411290126-os CI-ben sikeres; további kotta- és lejátszás-E2E hátra |
| P2 | A-15 | Kotta/média URL licenc és forrásellenőrzés | HTTPS/forrás/licenc-metaadat CI-teszt sikeres; 4 Commons fájloldal és OSZK gyűjteményoldal kézzel visszaellenőrizve; teljes élő URL/jogi validálás hátra |
| P2 | A-16 | Progress egyesítés max XP szabálya nem nyilvánvaló | Profil és kedvenc-összevezetés tisztázva; párhuzamos kedvenc törlés háromutas összevezetése; XP-adat történeti eseménynaplója továbbra sincs |
| P2 | A-17 | Kérdésenkénti tesztmetrikák hiányoznak | Időbélyeges kvízpróbálkozások, rontott kérdések, helyes válaszok és magyarázatok, gyakorlási idő; trend és pedagógiai értékelés hátra |
| P2 | A-19 | Teljes menü- és navigációs mátrix | Tankönyv legördülő mobil/keyboard nyitás javítva; 5 tankönyv és menüoldalak navigációs integritási tesztje felvéve; teljes böngészős bejárás hátra |
| P2 | A-20 | Szakmai egyezés: definíció, kotta, hang, teszt, AI | Strukturális kérdésbank/fejezet/szókártya/párosító integritási teszt CI-sikeres, teljes zenei lektorálás hátra |
| P2 | A-22 | Egységes pedagógiai teljesítési/értékelési rendszer | 15 kérdéses véletlen gyakorlókörök és külön vegyes eredményazonosító; pedagógiai értékelési standard és élő validálás hátra |
| P2 | A-23 | Reszponzivitás, sötét/világos téma, kontraszt, WCAG | Chromium/axe WCAG 2.1 AA CI 42419584013 sikeres: főoldal/kvíz/tankönyv/mobil AI 0 súlyos vagy kritikus hiba; kézi, teljes WCAG-audit hátra |

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
