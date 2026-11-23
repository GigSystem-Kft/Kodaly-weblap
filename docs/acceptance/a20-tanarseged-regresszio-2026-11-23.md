# A-20 szakmai regresszió – Tanársegéd, 2026-11-23

**Forrás:** projektgazda által az éles Tanársegédből bemásolt válaszok. **Korábbi állapot: FAIL / javítandó. 2026-11-23-i éles újrateszt: a két korábban hibás összehasonlító kérdés PASS.** A teljes A-20 továbbra sem lezárt, mert a kotta, hangzó példák és további kvíz/AI-válaszok független lektorálása hátravan. A telepített verziót a projektgazda Admin-jelentése alapján azonosítottuk: `644914afdfae460765f3b82671bb10294426b73d`, melynek második szülője a tesztelt javító commit `ed9362bbe13e743d9d894eafff1e9c91f8d29d67`.

| Tesztkérdés | Ténymegfigyelés | Értékelés | Elvárt tartalom |
|---|---|---|---|
| Mi a különbség a tiszta kvint és a szűkített kvint között? | A válasz meghatározza a tiszta kvintet (7 félhang) és példát ad (C–G), de a szűkített kvintet csak megemlíti. | RÉSZLEGES | A szűkített kvint 6 félhang, például C–Gesz; világos összehasonlítás. |
| Miben különbözik a természetes, harmonikus és dallamos a-moll hangsor? | Szótárcímszó töredéke és relevanciáját vesztett szomszédos szócikkek kerülnek elő; nincs összehasonlítás. | HIBÁS | Természetes: a–h–c–d–e–f–g–a; harmonikus: gisz; dallamos felfelé: fisz és gisz, hagyományosan lefelé természetes moll. A dallamos moll értelmezése a tananyag konvenciójához igazodjon. |
| Mi a különbség a nyújtott és éles ritmus között? | A helyes alapdefiníció megjelenik: hosszú–rövid, illetve rövid–hosszú; a válaszban más ritmustani forrásrészletek is szerepelnek. | ALAPVETŐEN MEGFELELŐ | A két ritmusképlet pontos különbsége, lehetőleg hangértékpéldával és tömör forráshivatkozással. |

## Fejlesztési teendő

1. A Tanársegéd a háromrészes összehasonlító kérdést ne egyetlen lexikon-találatként dolgozza fel. A válasz foglalja össze a *kérdés valamennyi összehasonlított elemét*.
2. A magyar `zenei-kifejezesek-teljes-szotar.txt` keresési eredményeinek címszó-határainál ne jelenjen meg szomszédos címszó szövege vagy töredékes forrásrészlet kész szakmai válaszként.
3. A forrásszemelvény legyen külön, tömör és kontextusban értelmezhető; a válasz ne egy sérült/töredékes idézettel kezdődjön.
4. Legyen automatizált regressziós próba mindhárom pontos kérdésre; külön ellenőrizze, hogy a kvint válaszban szerepel-e a 6 félhang és a moll válaszban a természetes/harmonikus/dallamos variáns megkülönböztetése.
5. Javítás után valós éles teszt; csak a telepített SHA és dokumentált bizonyíték alapján állítható A-20 PASS.

## Bizonyíték

A projektgazda 2026-11-23-i bemásolt Tanársegéd-válaszai a projektbeszélgetésben. A nyilvános GitHub-naplóba személyes adatok vagy privát szerverbeállítások nem kerültek.

## 2026-11-23 – éles újrateszt eredménye (projektgazda)

**Éles telepítési azonosító:** `644914afdfae460765f3b82671bb10294426b73d`. Az Admin felületen 529 megvizsgált fájlbejegyzés, befejezett nyilvános állományvizsgálat és 1793/1793 fogalomtári tétel szerepelt. A `.cache` kizárás továbbra sem bizonyítja a mappa HTTP-védelmét.

| Kérdés | Valós újrateszt | Ellenőrizhető tartalom |
|---|---|---|
| Tiszta vs. szűkített kvint | **PASS** | Tiszta kvint 7 félhang (C–G), szűkített 6 félhang (C–Gesz), egy félhang különbség. |
| Természetes, harmonikus és dallamos a-moll | **PASS** | Természetes A–H–C–D–E–F–G–A; harmonikus Gisz; dallamos felszálló Fisz–Gisz és hagyományos leszálló természetes alak; F–Gisz bővített szekund értelmezése. |
| Nyújtott és éles ritmus | **Korábbi részteszt: alapvetően megfelelő** | Az új kiadásban erre a kérdésre nem érkezett külön újrateszt, ezért új PASS nem állítható. |

**Bizonyíték:** a projektgazda az éles Tanársegéd két teljes válaszát bemásolta a 2026-11-23-i projektbeszélgetésbe, és mindkettőt „Rendben” jelöléssel jóváhagyta. A GitHubon csak a nem érzékeny tartalmi összefoglaló szerepel; teljes személyes adatok és konfigurációk nem. **Kiadási döntés:** a két konkrét regresszió elfogadva, az A-20 összesített kapu továbbra is BLOCKED a szélesebb, független zenei lektorálásig.

## 2026-11-23 – kibővített A-20 technikai ellenőrzés

**Jelölt commit:** `5d6c276cc56d30ad2df6e5090223a601acd0e4f3`.

A `scripts/test-a20-cross-module-harmony.ts` automatikus vizsgálatai immár külön ellenőrzik:
- C-, G- és F-dúr, valamint természetes/harmonikus/dallamos a-moll függetlenül meghatározott félhangsémáját és tananyagbeli/hangzó egyezését;
- a 12 megnevezett hangköz **önálló elméleti félhangszámát**, nem csak a magyarázó szöveg és a hangadat kölcsönös egyezését;
- a dúr, moll, szűkített és bővített hármashangzatok intervallumszerkezetét;
- a nyújtott, éles, szinkópás és triolás ritmusok hanghosszait és 60 BPM-es indítási időpontjait;
- a 2/4, 3/4, 4/4, 6/8 ütemek hosszát és ütésindításait a megfelelő időegységben.

**GitHub Actions ugyanazon SHA-n:** Chromium böngészős füstteszt `45270689275` **success**; PHP telepítő ZIP `45270689243` **success**; Linux telepítő `45270689282` **success**. Az emberi elfogadási workflow `45270689263` **failure**, konkrétan a 24 pontos bizonyítéknapló hitelesítésénél, nem a technikai zenei tesztekben.

**Határ:** ezek az automatikus vizsgálatok a hangadatot és időzítési algoritmust ellenőrzik, nem a valódi hangszórós lejátszást, a kotta emberi olvashatóságát, a teljes kérdésbank szakmai minőségét vagy a független lektor jóváhagyását. A két korábban sikeresen élőben tesztelt Tanársegéd-kérdést nem kell indokolatlanul megismételni.

**A-20 formális státusz:** változatlanul `BLOCKED` a hiányzó, aktuális jelölthöz kötött hallási/kottás/kvízes, független szakmai lektori bizonyíték miatt.

## 2026-11-23 – élő hangközlejátszás, tulajdonosi visszajelzés

A projektgazda a célzott A-20 akusztikai részpróba után ezt erősítette meg:

> A-20 hangközök meghallgatása: a kis szekund, tiszta kvart és tiszta kvint megfelelően szól. Folytasd a szakmai elfogadást.

**Eredmény: PASS – a három külön megnevezett hangköz (kis szekund, tiszta kvart, tiszta kvint) tényleges meghallgatásának részpróbája.** A kapcsolódó elméleti elvárások 1, 5 és 7 félhang; a 12 hangköz külön elméleti és adatszintű automatizált tesztje a fenti SHA-n sikeres.

**Bizonyíték:** a 2026-11-23-i projektbeszélgetés tulajdonosi közlése. A konkrét eszköz, böngésző és az élő lejátszás idején telepített teljes SHA nem szerepelt külön a visszajelzésben, ezért nem állítjuk, hogy az aktuális fejlesztési buildet tesztelte. A teljes A-20 továbbra is `BLOCKED`, amíg az aktuális build hangzó hangsor/ritmus/kotta/kvíz szakmai jóváhagyása és a verzióazonosító nincs megerősítve.

## 2026-11-23 – háromféle a-moll hangsor élő meghallgatása

A projektgazda az A-20 hallásfejlesztési részpróba után így nyilatkozott:

> A-20 a-moll hangsorok hangzó próbája: a természetes, harmonikus és felszálló dallamos a-moll egyaránt helyesen szól. Folytasd a szakmai elfogadást.

**Eredmény: PASS – három hangzó a-moll hangsor részpróbája.** A korábban ellenőrzött felszálló hangkészletek:
- természetes: A–H–C–D–E–F–G–A;
- harmonikus: A–H–C–D–E–F–Gisz–A;
- felszálló dallamos: A–H–C–D–E–Fisz–Gisz–A.

A projektgazda a három tényleges lejátszást megfelelőnek találta; a hangsorok önálló félhangsémáját és tananyag–hangadat egyezését a `5d6c276cc56d30ad2df6e5090223a601acd0e4f3` commit A-20 tesztjei automatikusan is ellenőrzik.

**Korlát:** a meghallgatási válasz nem tartalmazta a telepített pontos 40 karakteres SHA-t és eszközazonosítót. Ez nem jelenti automatikusan az aktuális jelölt éles tesztelését, és nem igazolja a ritmus-, kotta- vagy kvíz-részpróbát. A teljes A-20 továbbra is `BLOCKED`, amíg a hiányzó ellenőrzések igazolása és a verzióhoz kötött független szakmai jóváhagyás nem teljes.

## 2026-11-23 – négy ritmus élő meghallgatása, 60 BPM

A projektgazda a Hallásfejlesztés célzott akusztikai részpróbájáról visszajelezte:

> A-20 ritmusgyakorlatok hangzó próbája: a nyújtott ritmus, éles ritmus, szinkópa és nyolcadtriola egyaránt megfelelően szól 60 BPM mellett. Folytasd a szakmai elfogadást.

**Részpróbák: PASS** az alábbi négy lejátszásra:
- **Nyújtott:** hosszú–rövid (pontozott negyed–nyolcad).
- **Éles:** rövid–hosszú (nyolcad–pontozott negyed).
- **Szinkópa:** nyolcad–negyed–nyolcad.
- **Nyolcadtriola:** három egyenlő triolanyolcad egy negyed időtartama alatt.

A 60 BPM-hez tartozó hanghosszakat és indítási időpontokat önálló számítógépes A-20 ellenőrzés is vizsgálta a `5d6c276cc56d30ad2df6e5090223a601acd0e4f3` commiton, amelynek három technikai kiadási workflow-ja sikeres volt.

**Korlát:** a projektgazdai visszajelzés nem tartalmazta külön a vizsgált éles verzió pontos 40 karakteres SHA-ját; a kotta–hang összevetés és a kvízhelyesség emberi részpróbája nem szerepelt benne. Az A-20 teljes formális státusza ezért továbbra is `BLOCKED`; ezt a négy sikeres részpróbát nem kell megismételtetni.

## 2026-11-23 – kotta–hang egyezés élő szakmai részpróbája

A projektgazda az interaktív kottapélda ellenőrzése után ezt erősítette meg:

> A-20 kotta–hang szakmai próba: a megvizsgált interaktív kottapélda hangmagasságai és ritmusértékei megfelelnek a megszólaló hangoknak. Folytasd az elfogadást.

**Eredmény: PASS – egy megvizsgált interaktív kottapélda kotta–hang egyezésének részpróbája.** A projektgazda visszajelzése a hallott hangmagasságokra és ritmusértékekre is kiterjed. Nem állítható, hogy a teljes kottatár minden példáját megvizsgálta.

**Hiányzó metaadat:** a konkrét kottapélda azonosítója, böngésző/eszköz, telepített 40 karakteres SHA és nem titkos további bizonyítékazonosító nincs a visszajelzésben. Emiatt a sikeres felhasználói részpróba önmagában nem zárja le a teljes A-20 elfogadási kaput.

**Következő nyitott szakmai részpróba:** a kvízkérdések és válaszkulcsok legalább két kiválasztott kérdésének emberi ellenőrzése, valamint a teljes A-20 független szakmai és végső buildhez kötött igazolása. A korábbi hangköz-, hangsor- és ritmusteszteket nem kérjük újra.
