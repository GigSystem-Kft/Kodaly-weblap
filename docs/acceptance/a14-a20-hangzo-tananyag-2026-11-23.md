# A-14 / A-20 – hangzó tananyag és hallásgyakorlatok műszaki ellenőrzése

**Ellenőrzés napja:** 2026-11-23  
**Fejlesztési commit:** `fa949889338f903392f30152e7907a2f0aa7c213`  
**Státusz:** automatikus tesztek PASS; **éles hangkimeneti és független zenei lektori elfogadás még hiányzik**.

## Megvalósult ellenőrzések

- `scripts/test-a20-cross-module-harmony.ts`: a C-, G-, F-dúr hangsorok félhanglépéseinek egyezése a fejezet hangsorlistája és a hallásfeladatok között.
- Természetes, harmonikus, dallamos a-moll: a hangzó fejezet és az auralizált feladatsor felszálló alakjának egyezése; dallamos moll hagyományos leszálló természetes alakjának ellenőrzése.
- A C-dúr, c-moll, C-szűkített és C-bővített hármashangzat terchangközeinek ellenőrzése a lejátszott azonosítókból.
- A 12 hallásgyakorlati hangköz hangzó frekvenciái és kijelzett félhangszámai egyeznek.
- `EarTrainingView.tsx` és `ExtendedEarTraining.tsx`: az első válasz megnyomása szinkron választási zárral védett, így egy gyors dupla aktiválás nem pontozhat kétszer ugyanarra a feladatra.
- A változtatást az előírt `npm test` csomag, a Chromium füstteszt és a PHP/MySQL/ZIP kiadási workflow is ellenőrzi.

## GitHub Actions eredmények

- PHP/MySQL/ZIP: `45170390690` – success
- Chromium böngészős füstteszt: `45170390759` – success
- Linux telepítő: `45170390853` – success

## A-14 / A-20 elfogadás még hátravan

A zöld CI **nem bizonyítja a hangkártya/fülhallgató valós hangját**, a különböző böngészők automatikus lejátszási korlátozásait, a ritmushallás szubjektív érthetőségét vagy a kottakép teljes szakmai helyességét. A következő pilotot éles telepített SHA mellett kell végezni, tételesen:

1. Hangközök: tiszta kvart (5 félhang), tiszta kvint (7 félhang), kis szekund (1 félhang) lejátszás és újrahallgatás.
2. Hangsorok: természetes és harmonikus a-moll VII. fokának különbsége; melodikus a-moll felfelé Fisz/Gisz; ellenőrzött feladatmegoldás és egyetlen XP-jóváírás.
3. Ritmusképletek: nyújtott/éles ritmus időrendje és szinkópa; 60 BPM beállítás.
4. Valódi mobil és asztali hangkimenet, szünetelés, módváltás, visszalépés; hangminta megszűnése a felület elhagyásakor.
5. Kottaképek véletlenszerű mintavétele és hozzájuk tartozó tananyag/kvíz válaszok zenei lektori összevetése.

**Megjegyzés:** A-14 és A-20 összesített PASS csak a fenti valós próbák, a lektori azonosító és a telepített SHA rögzítése után adható. Az A-15 és A-24 kiadási kapuk ettől függetlenül nyitottak.
