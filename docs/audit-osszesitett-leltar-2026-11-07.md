# Zeneelméleti Műhely – összevont auditleltár (v1.2)

Kezdő dátum: 2026-11-07. Legutóbb frissítve: 2026-11-08. Forrás: a 2026-11-07-i 18 pontos kódaudit és a további 6 ellenőrzési terület. A-19–A-24 vizsgálati hatókör, nem mind igazolt hiba.

**A korábbi javítási egységek korabeli, történeti állapotjelentések; az aktuális helyzetet az alábbi A-01–A-24 táblázat és a legutolsó egység mutatja.**

**Változtatási szabály:** meglévő tanulói adatokat nem törlünk; éles kiadás előtt CI + szerepkörös és telepítési ellenőrzés; státuszt csak bizonyíték alapján zárunk.

| Prioritás | ID | Téma | Állapot |
|---|---|---|---|
| P0 | A-01 | 13 ritmikai oldalkép hiányzik a kiadásból | MEGOLDVA: 13 eredeti, Git SHA-val bájtpontosan ellenőrzött JPG feltöltve a fejlesztési ágra; 42422196761 teljes PHP-telepítő CI sikeres |
| P0 | A-02 | Tankönyvkereső ékezet- és szóközkezelése hibás | Kódjavítás; magyar ékezet/kisbetű/szóközkeresés Chromium E2E sikeres; éles webhely ellenőrzése hátra |
| P0 | A-06 | Párhuzamos profilmentések felülírhatják egymást | Compare-and-swap mentés, háromutas összevezetés és fiókonkénti offline helyreállítás; valódi két PHP/MySQL munkamenetes 409-es konfliktus/újrapróba CI sikeres; éles két fizikai eszközös próba hátra |
| P0 | A-18 | Release csomag teljessége nincs ellenőrizve | MEGOLDVA: a kötelező 302 tankönyvoldal, 13 ritmikai és 64 jegyzetkép médiaellenőrzése zöld; 42422196761 PHP ZIP sikeresen összeállt |
| P1 | A-03 | 04/05 tesztkategóriák hiányoznak | Kódjavítás és kategória-regresszió CI sikeres; valódi böngészőteszt hátra |
| P1 | A-04 | Alfejezet-teljesítések nem íródnak | Manuális fejezet-/alfejezetjelölés és tanulási állapotmegőrzés, Chromium E2E zöld; éles fiókos próba hátra |
| P1 | A-05 | Párosító teljesítési naplója hiányzik | Stabil pár-ID-k és idempotens XP, egységtesztek; valódi sikeres párosítás végigjátszása böngészőben hátra |
| P1 | A-07 | 09. fejezet hiányzik a PHP AI forrásriportból | Kódjavítás és PHP forrásteszt sikeres; éles tudásindex hátra |
| P1 | A-08 | Statikus AI leltár eltér az élő index mérésétől | Külön élő és buildleltár megjelenítés implementálva; éles ellenőrzés hátra |
| P1 | A-09 | PHP Tanársegéd fallback kereső, nem Gemini chat | Opcionális, alapból kikapcsolt és bejelentkezéshez kötött Gemini PHP-útvonal, nyilvános tananyagból RAG, licencelt forrás kizárva; konfiguráció, élő API- és szakmai választeszt hátra |
| P1 | A-12 | Csak öt alapfejezet teljesítéskövetése teljes | Kilenc modul manuális tanulási jelölése, összegzése és CI-tesztje sikeres |
| P1 | A-21 | Vendég/hallgató/tanár/admin end-to-end életút | PHP/MySQL CI szerepkörteszt és Chromium-böngészős mockolt student/teacher/admin navigáció sikeres; fogalomtárkedvencek profilszinkronja implementálva, valódi hitelesített éles próba hátra |
| P1 | A-24 | Valós telepítési E2E és regressziótesztek | Chromium CI 42415390838 sikeres: vendég, szókártya, párosító, 04 kvíz, keresés, mobil touch/AI, szerepkörös UI; valódi éles hitelesítés/telepítés tesztje hátra |
| P2 | A-10 | Szótári taxonómia túl sok Egyéb elemmel | BESOROLÁS KÉSZ: mind az 1793 tétel 12 konkrét kategóriában, 0 Egyéb; 945 tétel átsorolva, új általános nyelvi kategória. Eredeti szöveg/azonosítók változatlanok; független zenetudományi lektorálás hátra |
| P2 | A-11 | XP kliensoldalról tetszőlegesen halmozható | Párosító 5 XP/új pár (max. 50/kör), hallásfeladat 100 XP/nap, PHP-validált napló és tesztek; az XP továbbra is kliensoldali gyakorlási pont, teljes szerveroldali anti-cheat hátra |
| P2 | A-13 | Párhuzamos, egyenetlen tananyag-adatforrások | 5 alap- és 4 bővített modulkatalógus, egységes 5 fejezetes alfejezeti útmutatók; önellenőrzési válaszok alfejezetenként elkülönítve, teljes szakmai szerkesztői egyeztetés hátra |
| P2 | A-14 | H/B hangnevek és MIDI megfeleltetése | WebAudio B/H megfeleltetés és G5 (783,99 Hz) javítva; a nagy szeptim hangsor H4-re javítva; teljes 12-TET és 12 hangköz frekvenciateszt bekerült; további lejátszás-E2E hátra |
| P2 | A-15 | Kotta/média URL licenc és forrásellenőrzés | OSZK és LFZE forráshelyesbítések, 8 Commons-képfájl jogállásleltára, 1927-es Bartók portré; történeti tónárium pontosítva. Tankönyv/1979-es kottakiadás jogi ellenőrzése hátra |
| P2 | A-16 | Progress egyesítés max XP szabálya nem nyilvánvaló | Profil és kedvenc-összevezetés tisztázva; párhuzamos kedvenc törlés háromutas összevezetése; XP-adat történeti eseménynaplója továbbra sincs |
| P2 | A-17 | Kérdésenkénti tesztmetrikák hiányoznak | Időbélyeges kvízpróbálkozások, rontott kérdések, magyarázatok, gyakorlási idő; azonos témakör utolsó 3 és előző 3 átlagának trendje elkészült, pedagógiai értékelés hátra |
| P2 | A-19 | Teljes menü- és navigációs mátrix | Mobil/keyboard tankönyvmenü és 5 tananyagkártya Enter/Space aktiválása; részletes Chromium navigációs teszt; teljes böngészős bejárás hátra |
| P2 | A-20 | Szakmai egyezés: definíció, kotta, hang, teszt, AI | A teljes kvízbank és a fogalomtári kvízek normalizált válaszopció-egyedisége CI-vel védett, zenei hang- és tananyag-integritástesztek sikeresek; szakmai lektorálás hátra |
| P2 | A-22 | Egységes pedagógiai teljesítési/értékelési rendszer | 15 kérdéses témaköri gyakorlókörök, egyedi válaszlehetőségek, témakörönkénti 3+3 korábbi kör trend; pedagógiai értékelési standard hátra |
| P2 | A-23 | Reszponzivitás, sötét/világos téma, kontraszt, WCAG | Hét nézetes axe WCAG 2.1 AA Chromium teszt (alapfejezet, profil, fogalomtár is), átmeneti kontraszthiba kijavítva és CI zöld; manuális audit hátra |

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
