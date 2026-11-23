# A-20 szakmai regresszió – Tanársegéd, 2026-11-23

**Forrás:** projektgazda által az éles Tanársegédből bemásolt válaszok. **Státusz: FAIL / javítandó**, a teljes A-20 nem lezárt. A telepített Git SHA ezen válaszokból nem igazolható; a fejlesztői ág aktuális commitja nem tekinthető automatikusan az éles verziónak.

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
