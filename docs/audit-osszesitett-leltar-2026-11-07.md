# Zeneelméleti Műhely – összevont auditleltár (v1.1)

Dátum: 2026-11-07. Forrás: a 2026-11-07-i 18 pontos kódaudit és a további 6 ellenőrzési terület. A-19–A-24 vizsgálati hatókör, nem mind igazolt hiba.

**Változtatási szabály:** meglévő tanulói adatokat nem törlünk; éles kiadás előtt CI + szerepkörös és telepítési ellenőrzés; státuszt csak bizonyíték alapján zárunk.

| Prioritás | ID | Téma | Állapot |
|---|---|---|---|
| P0 | A-01 | 13 ritmikai oldalkép hiányzik a kiadásból | Eredeti 13 oldalas PDF megtalálva, 13 JPG helyben előállítva; a bináris oldalképek GitHubba való felvétele még hátra |
| P0 | A-02 | Tankönyvkereső ékezet- és szóközkezelése hibás | Javítás commitolva, CI még nem igazolta |
| P0 | A-06 | Párhuzamos profilmentések felülírhatják egymást | Compare-and-swap mentés, tárolt MySQL JSON-ból képzett revision; MySQL integrációs teszt CI-sikeres, valódi többeszközös böngészős próba hátra |
| P0 | A-18 | Release csomag teljessége nincs ellenőrizve | Média-manifeszt: 302 tankönyvoldal index/kép, 13 ritmikai kép, 64 jegyzetkép; a hiányos ZIP blokkolt; a hivatalos PDF URL jelenleg hibás választ ad, a 13 lokálisan generált kép GitHubba való felvétele szükséges |
| P1 | A-03 | 04/05 tesztkategóriák hiányoznak | Javítás commitolva, CI még nem igazolta |
| P1 | A-04 | Alfejezet-teljesítések nem íródnak | Kód javítva: manuális alfejezetjelölés, teszt hátra |
| P1 | A-05 | Párosító teljesítési naplója hiányzik | Kód javítva: stabil pár-ID-k, teszt hátra |
| P1 | A-07 | 09. fejezet hiányzik a PHP AI forrásriportból | Fejezetszám 9-re módosítva; regresszió hátra |
| P1 | A-08 | Statikus AI leltár eltér az élő index mérésétől | Külön élő és buildleltár megjelenítés implementálva; éles ellenőrzés hátra |
| P1 | A-09 | PHP Tanársegéd fallback kereső, nem Gemini chat | Mód pontosan felcímkézve; szakmai validáció hátra |
| P1 | A-12 | Csak öt alapfejezet teljesítéskövetése teljes | Kilenc modul manuális tanulási jelölése és összegzése implementálva; teszt hátra |
| P1 | A-21 | Vendég/hallgató/tanár/admin end-to-end életút | Vizsgálat hátra |
| P1 | A-24 | Valós telepítési E2E és regressziótesztek | Vizsgálat hátra |
| P2 | A-10 | Szótári taxonómia túl sok Egyéb elemmel | Nyitott |
| P2 | A-11 | XP kliensoldalról tetszőlegesen halmozható | Nyitott |
| P2 | A-13 | Párhuzamos, egyenetlen tananyag-adatforrások | Nyitott |
| P2 | A-14 | H/B hangnevek és MIDI megfeleltetése | Validálás hátra |
| P2 | A-15 | Kotta/média URL licenc és forrásellenőrzés | Validálás hátra |
| P2 | A-16 | Progress egyesítés max XP szabálya nem nyilvánvaló | Profil tájékoztató pontosítva; történeti XP-eseménynapló továbbra sincs |
| P2 | A-17 | Kérdésenkénti tesztmetrikák hiányoznak | Nyitott |
| P2 | A-19 | Teljes menü- és navigációs mátrix | Tankönyv legördülő mobil/keyboard nyitás javítva, teljes mátrixvizsgálat hátra |
| P2 | A-20 | Szakmai egyezés: definíció, kotta, hang, teszt, AI | Vizsgálat hátra |
| P2 | A-22 | Egységes pedagógiai teljesítési/értékelési rendszer | Tervezés és validálás hátra |
| P2 | A-23 | Reszponzivitás, sötét/világos téma, kontraszt, WCAG | Márkagomb és tankönyv menü keyboard/touch kezelés javítva; teljes audit hátra |

## Első javítási csomag

- A-02: Unicode combining mark regex és szóköz szerinti tokenizálás javítása a `TextbookView.tsx` állományban.
- A-03: 04/05 fejezet kategóriáinak hozzáadása; a lista kizárja azokat a kategóriákat, amelyekben nincs kérdés.
- A-01/A-18: `php-release.yml` ellenőrzi, hogy a `release/ritmikai/p001.jpg` – `p013.jpg` mind létező, nem üres fájl-e; a jelenlegi hiány esetén a build megáll, nem ad ki hibás ZIP-et.

**Negyedik javítási egység:** A-23 első akadálymentességi javítás: a fejléc főoldalra visszalépő eleme billentyűzettel is aktiválható. A teljes WCAG és mobil ellenőrzés továbbra is hátra.\n\n**Harmadik javítási egység:** A-08 élő PHP-lefedettség és statikus buildleltár különválasztása; A-09 Tanársegéd üzemmód egyértelműsítése; A-12 négy bővített modul manuális teljesítési jelölése; A-16 XP-max tájékoztató.\n\n**Második javítási egység:** A-04/A-05/A-07 kódjavítás, valamint A-06 verzióazonosítós feltételes szervermentés, 409-es konfliktusválasz és böngészős összevezetés. A késznek minősítéshez CI, valódi párhuzamos eszközös teszt, PHP kompatibilitás és éles adatmegőrzési próba szükséges.\n\n**Fontos:** az első csomag nem helyettesíti a 13 jogszerűen felhasználható képfájl beszerzését és felvételét. Az éles weboldal és a belépett felhasználók nincsenek validálva. A-06 biztonságos, migrációt igénylő következő feladat. Korábbi CI-kör: a TypeScript/egységteszt/PHP/build lépések sikeresek, a ZIP-összeállítás a hiányzó 13 ritmikai kép miatt elbukik. Az új commitok aktuális CI státuszát külön kell ellenőrizni.

## Ötödik javítási egység (2026-11-07)

- A-06: a PHP szerver friss mentés után a MySQL JSON-mezőből visszaolvasott adat alapján adja a revisiont; új izolált MySQL integrációs teszt vizsgálja az első mentést, ismételt mentést, hiányzó revision elutasítását és elavult kliens 409 válaszát. **MySQL-fiók integrációs teszt CI-sikeres; valós többeszközös böngészőpróba még hátra.**
- A-18: a PHP csomagképek ellenőrzése Python manifest-szkripttel bővült; a 4 tankönyv 302 indexelt oldala és megfelelő képei, a 64 jegyzet-JPG és a 13 ritmikai JPG szükséges. A hiányzó képek továbbra is kiadásblokkolók.
- A-19/A-23: a tankönyvmenü érintéssel nyitható, Escape-pel zárható; a menüpontok kijelölése zárja a menüt.
- A-03: üres kérdésbank esetén kezelhető üzenet jelenik meg, nem omlik össze a teszt.

**Kiadási tény:** a legutóbbi megvizsgált PHP Actions-futtatásban (42408457312) a TypeScript/egységteszt, a PHP szintaxis/tesztek, a MySQL fiók- és progress-tesztek és a frontend build sikeresek voltak. A ZIP összeállítása továbbra is blokkolt a média-manifeszt miatt. Egy korábbi Linux telepítőcsomag sikeres volt. A sikeres Linux build nem jelenti a PHP produkció készségét. Éles szerver, tényleges felhasználói adatok és minden média URL ellenőrzése továbbra sem történt meg.

## Hatodik javítási egység (2026-11-07)

Az eredeti MTA–SZTE 13 oldalas PDF a korábbi feltöltések között megtalálható. SHA256: `eddb1e3a0e8ec9e6135d5e7b3f1807e9728df2399a5258a870b1d9d4d55dc3aa`. A forrásfájl `pdfinfo` szerint 13 oldal, és helyben 13 JPG oldal előállítható. A hivatalos egyetemi webcím 2026-11-07-én nem PDF-et, hanem hibás HTML-választ adott még a GitHub Actions környezetben is; ezért az online letöltést nem tesszük a kiadási folyamat részévé. A 13 helyben renderelt képfájl GitHubba történő bináris feltöltése továbbra is szükséges. A manifest addig szándékosan blokkolja a PHP ZIP-et.

## Lezárási feltételek

1. A P0 hibák megszűnnek, és a telepítő teljes statikus asset-manifeszt ellenőrzése sikeres.
2. A kilenc modul tananyag–példa–kvíz–szókártya–AI hivatkozásai megfelelnek a közös azonosítóknak.
3. Vendég, hallgató, tanár, admin teljes életút szerepkörös és többeszközös tesztje kész; nincs adatvesztés.
4. Magyar hangnevek, kotta és audio, valamint a forrásolt AI-válaszok szakmai mintatesztje sikeres.
5. Mobil/desktop, billentyűzet és akadálymentességi ellenőrzés után az összes hiba bizonyítékkal lezárható.
