# Zeneelméleti Műhely – összevont auditleltár (v1.1)

Dátum: 2026-11-07. Forrás: a 2026-11-07-i 18 pontos kódaudit és a további 6 ellenőrzési terület. A-19–A-24 vizsgálati hatókör, nem mind igazolt hiba.

**Változtatási szabály:** meglévő tanulói adatokat nem törlünk; éles kiadás előtt CI + szerepkörös és telepítési ellenőrzés; státuszt csak bizonyíték alapján zárunk.

| Prioritás | ID | Téma | Állapot |
|---|---|---|---|
| P0 | A-01 | 13 ritmikai oldalkép hiányzik a kiadásból | Nyitott; kiadási ellenőrzés hozzáadva, képek pótlása hátra |
| P0 | A-02 | Tankönyvkereső ékezet- és szóközkezelése hibás | Javítás commitolva, CI még nem igazolta |
| P0 | A-06 | Párhuzamos profilmentések felülírhatják egymást | Verziózott compare-and-swap API + összevezető kliens implementálva; többeszközös teszt hátra (migráció nélkül) |
| P0 | A-18 | Release csomag teljessége nincs ellenőrizve | Részben javítva a 13 kép kötelező ellenőrzésével |
| P1 | A-03 | 04/05 tesztkategóriák hiányoznak | Javítás commitolva, CI még nem igazolta |
| P1 | A-04 | Alfejezet-teljesítések nem íródnak | Kód javítva: manuális alfejezetjelölés, teszt hátra |
| P1 | A-05 | Párosító teljesítési naplója hiányzik | Kód javítva: stabil pár-ID-k, teszt hátra |
| P1 | A-07 | 09. fejezet hiányzik a PHP AI forrásriportból | Fejezetszám 9-re módosítva; regresszió hátra |
| P1 | A-08 | Statikus AI leltár eltér az élő index mérésétől | Nyitott |
| P1 | A-09 | PHP Tanársegéd fallback kereső, nem Gemini chat | Nyitott; működés tisztázása és validálás |
| P1 | A-12 | Csak öt alapfejezet teljesítéskövetése teljes | Nyitott |
| P1 | A-21 | Vendég/hallgató/tanár/admin end-to-end életút | Vizsgálat hátra |
| P1 | A-24 | Valós telepítési E2E és regressziótesztek | Vizsgálat hátra |
| P2 | A-10 | Szótári taxonómia túl sok Egyéb elemmel | Nyitott |
| P2 | A-11 | XP kliensoldalról tetszőlegesen halmozható | Nyitott |
| P2 | A-13 | Párhuzamos, egyenetlen tananyag-adatforrások | Nyitott |
| P2 | A-14 | H/B hangnevek és MIDI megfeleltetése | Validálás hátra |
| P2 | A-15 | Kotta/média URL licenc és forrásellenőrzés | Validálás hátra |
| P2 | A-16 | Progress egyesítés max XP szabálya nem nyilvánvaló | Nyitott |
| P2 | A-17 | Kérdésenkénti tesztmetrikák hiányoznak | Nyitott |
| P2 | A-19 | Teljes menü- és navigációs mátrix | Vizsgálat hátra |
| P2 | A-20 | Szakmai egyezés: definíció, kotta, hang, teszt, AI | Vizsgálat hátra |
| P2 | A-22 | Egységes pedagógiai teljesítési/értékelési rendszer | Tervezés és validálás hátra |
| P2 | A-23 | Reszponzivitás, sötét/világos téma, kontraszt, WCAG | Vizsgálat hátra |

## Első javítási csomag

- A-02: Unicode combining mark regex és szóköz szerinti tokenizálás javítása a `TextbookView.tsx` állományban.
- A-03: 04/05 fejezet kategóriáinak hozzáadása; a lista kizárja azokat a kategóriákat, amelyekben nincs kérdés.
- A-01/A-18: `php-release.yml` ellenőrzi, hogy a `release/ritmikai/p001.jpg` – `p013.jpg` mind létező, nem üres fájl-e; a jelenlegi hiány esetén a build megáll, nem ad ki hibás ZIP-et.

**Második javítási egység:** A-04/A-05/A-07 kódjavítás, valamint A-06 verzióazonosítós feltételes szervermentés, 409-es konfliktusválasz és böngészős összevezetés. A késznek minősítéshez CI, valódi párhuzamos eszközös teszt, PHP kompatibilitás és éles adatmegőrzési próba szükséges.\n\n**Fontos:** az első csomag nem helyettesíti a 13 jogszerűen felhasználható képfájl beszerzését és felvételét. Az éles weboldal és a belépett felhasználók nincsenek validálva. A-06 biztonságos, migrációt igénylő következő feladat. A commitok CI eredménye még nem ismert.

## Lezárási feltételek

1. A P0 hibák megszűnnek, és a telepítő teljes statikus asset-manifeszt ellenőrzése sikeres.
2. A kilenc modul tananyag–példa–kvíz–szókártya–AI hivatkozásai megfelelnek a közös azonosítóknak.
3. Vendég, hallgató, tanár, admin teljes életút szerepkörös és többeszközös tesztje kész; nincs adatvesztés.
4. Magyar hangnevek, kotta és audio, valamint a forrásolt AI-válaszok szakmai mintatesztje sikeres.
5. Mobil/desktop, billentyűzet és akadálymentességi ellenőrzés után az összes hiba bizonyítékkal lezárható.
