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

## 2026-11-23 – két kvízkérdés szakmai helyességének tulajdonosi ellenőrzése

A projektgazda az A-20 célzott tesztfelhívására a következő visszajelzést adta:

> A-20 kvíz szakmai próba: két zeneelméleti kérdést ellenőriztem, mindkét kérdés és helyes válaszkulcs megfelelő. Folytasd az elfogadást.

**Eredmény: PASS – két ellenőrzött kérdés és azok válaszkulcsának szakmai részpróbája.** A két kérdés pontos szövege és azonosítója nem szerepelt a közlésben; a jóváhagyás ezért nem értelmezhető a teljes kérdésbank tételes felülvizsgálataként.

### A célzott A-20 emberi részpróbák összesítése

| Ellenőrzött részterület | Tulajdonosi eredmény |
|---|---|
| Tanársegéd: tiszta és szűkített kvint; háromféle a-moll | PASS |
| Élő hangközlejátszás: kis szekund, tiszta kvart, tiszta kvint | PASS |
| Élő hangsorlejátszás: természetes, harmonikus, felszálló dallamos a-moll | PASS |
| Élő ritmuslejátszás 60 BPM: nyújtott, éles, szinkópa, nyolcadtriola | PASS |
| Egy interaktív kottapélda hangmagasság- és ritmusegyezése | PASS |
| Két zeneelméleti kvízkérdés és helyes válaszkulcs | PASS |

**Szakmai részpróbák:** mindegyik felsorolt tulajdonosi ellenőrzés sikeresnek jelentve. **Formális A-20 státusz: továbbra is BLOCKED**, mert az önálló szakmai lektori jóváhagyás, a konkrét kottapélda és kvíztételek azonosítói, valamint a vizsgálat és a végső kiadási jelölt teljes 40 karakteres SHA-jának összerendelése nem igazolt.

**Következő teendő:** nem újabb ismételt hallás- vagy kvízpróba, hanem a meglévő bizonyítékok verzióhoz és tételazonosítókhoz kötése, majd a szakmai jóváhagyás dokumentálása. A többi A-01–A-24 kiadási követelmény ettől önállóan érvényben marad.

## 2026-11-24 – kifejezett szakmai projektgazdai jóváhagyás

A projektgazda a fenti, korábban ténylegesen elvégzett hangköz-, hangsor-, ritmus-, kotta–hang-, kvíz- és Tanársegéd-részpróbák tételes összefoglalóját áttekintve a kérdésre: **„A felsorolt, már sikeresen ellenőrzött zeneelméleti funkciókat szakmai projektgazdaként jóváhagyod az 1.0-s kiadáshoz, a dokumentált mintavétel terjedelmében?”** kifejezetten **„jóváhagyom”** választ adott.

**Döntés: PROJEKTGAZDAI SZAKMAI JÓVÁHAGYÁS MEGADVA – a dokumentált részpróbák és mintavétel körére.** A már elfogadott zenei próbák indokolatlan megismétlése nem szükséges. Ez nem jelenti a teljes kvízkérdésbank, az összes kottapélda és minden Tanársegéd-válasz tételes, független lektori átvizsgálását, sem azt, hogy a korábbi éles próbák automatikusan az új, `013b911b6e2c4e842960e0fffede188309db4473` kiadásjelölten történtek.

**Formális napló:** az A-20 sor továbbra is `BLOCKED`, amíg a kiadásjelöltre vonatkozó független lektori/tételazonosító- és pontos verzióbizonyíték nem áll rendelkezésre. Ezt a projektgazdai jóváhagyást nem cseréljük össze azzal a külön bizonyítékkal. **Következő munkapont: A-21 fiókok, jogosultságok és valódi SMTP-kézbesítés.**

## A-20 – teljes kvízbank tételes, verziókötött szakmai lektori jegyzéke

A PHP-kiadási GitHub-folyamat a ténylegesen betöltött `QUIZ_QUESTIONS` kérdésbankból létrehozza az `a20-quiz-review.csv` állományt. Ez a tesztelt kiadási artifact **melléklete**, nem a nyilvános webgyökér része.

A CSV minden stabil kérdésazonosítóhoz megadja a fejezetet, a megjelenő kérdést, az összes válaszlehetőséget (`options_json`), a helyes válasz indexét és szövegét, az indoklást, az `item_sha256` tartalmi lenyomatot és a teljes 40 karakteres `release_sha` verziót. A `decision` minden sornál kezdetben **PENDING**. Ez **nem** jelenti azt, hogy az eddig igazolt két kvízkérdéses szakmai részpróba elvész, és nem állítja, hogy a teljes kérdésbankot bárki már lektorálta.

A GitHub ZIP artifact letöltése után a jogosult szakmai lektor a CSV mellett **helyi, privát** döntési munkalapot készíthet:

```bash
python3 scripts/check-a20-quiz-review.py \
  --inventory a20-quiz-review.csv \
  --expected-sha TELJES_40_KARAKTERES_GIT_SHA \
  --template "$HOME/privat-irattar/a20-kviz-lektori-dontesek.csv"
```

A munkalap minden tételnél csak a kérdésazonosítót és a tartalmi lenyomatot, valamint a `decision`, `reviewer_role`, `reviewed_on`, `evidence_ref` oszlopokat tartalmazza. A lektor csak tényleges szakmai ellenőrzés és bizonyíték mellett írhat be `APPROVED` döntést. Ezt követően:

```bash
python3 scripts/check-a20-quiz-review.py \
  --inventory a20-quiz-review.csv \
  --expected-sha TELJES_40_KARAKTERES_GIT_SHA \
  --review "$HOME/privat-irattar/a20-kviz-lektori-dontesek.csv"
```

A program megtagadja a lefedettség igazolását, ha hiányzik egy tétel, megváltozott a kérdés, a válaszkulcs vagy a magyarázat, rossz kiadás SHA-jával készült a CSV, vagy a jóváhagyáshoz nem tartozik ellenőrző szerep, dátum és bizalmas bizonyítékazonosító. Csak az összevont darabszámokat jelenti.

**A kapu értelmezése:** a teljes kérdésbankot gépileg már több módon ellenőrizzük, de a válaszkulcs szintaktikai helyessége és a szókártyával való összhang **nem helyettesíti a független zenei szakértői lektorálást**. A kvízbank-ellenőrző `coverage_passed` eredménye kizárólag bizonyítékhivatkozási teljesség. A korábbi projektgazdai hallás-, kotta- és két kvízkérdéses részpróba érvényes a dokumentált mintákra; **a teljes A-20 továbbra is BLOCKED**, amíg a végleges kiadásjelölthöz kötött szakmai jóváhagyás nincs meg. A privát lektori munkalapot tilos a webgyökérbe vagy nyilvános GitHubra másolni.
