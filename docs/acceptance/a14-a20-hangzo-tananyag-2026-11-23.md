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

## 2026-11-23 – közvetlen böngészős dupla-válasz regresszió

A `scripts/browser-smoke.mjs` immár a tényleges React kezelőket aktiválja, nem pusztán az adatállományokat hasonlítja össze. Elkülönített vendég-munkamenetben, meghatározott véletlen sorrend mellett ugyanabban az eseményciklusban kétszer kattint a helyes válaszra. Három feladattípusnál – hangköz (kis szekund), hangsor (G-dúr), ritmus (nyújtott ritmus) – ellenőrzi, hogy minden feladatért **pontosan 25 XP**, nem pedig dupla jutalom jár. Az automatikus teszt a következő feladatra lépést és témakörváltást is végrehajtja.

A kezdeti tesztfutás kizárólag a hibásan escape-elt tesztnavigációs reguláris kifejezésen állt meg; a javított teszt az `af7aa0e0f1496484fe74633b0ae67ab9c1cb07fa` commiton minden előírt technikai ellenőrzésen sikeres:

- Chromium: https://github.com/GigSystem-Kft/Kodaly-weblap/actions/runs/45192338110 – **success**
- PHP/MySQL/ZIP: https://github.com/GigSystem-Kft/Kodaly-weblap/actions/runs/45192338133 – **success**
- Linux: https://github.com/GigSystem-Kft/Kodaly-weblap/actions/runs/45192338141 – **success**

**A-14 és A-20 formális státusz továbbra is nyitott:** a fenti teszt nem igazolja a tényleges hangkimeneti vagy kottakép-lektorálási követelményeket. A-15, A-24 és a többi emberi elfogadási pont változatlan.

## 2026-11-23 – napi hallás-XP és helyes visszajelzés (A-11 / A-14 / A-16)

**A javított kód verziója:** `0d3a023959945f693c3b7338c864e87b9255b456`. A hallásgyakorlatok napi jutalma a korábban érvényes **100 XP/nap** felső határt megtartja, de a felület immár a ténylegesen még jóváírható jutalmat mutatja; betelt keretnél nem állít valótlant a +25 XP megszerzéséről. A hangköz-, hangsor/ritmus/hangérték- és hangkészlet-felismerés egy közös maradékkeretből dolgozik. A hangkészlet-párosítás azonos helyes párra adott gyors ismételt kattintások miatti többszöri jóváírás ellen szinkron zárral védett. A napi összegkorlát mellett az összesített XP felső határát is figyelembe veszi a megjelenítés.

**Automatizált bizonyíték:** `progress.test.ts` vizsgálja a részlegesen betelt 90/100-as keretet, a keret teljes betelését, a következő nap megújulását, a hibás dátumot és az összesített XP-limitet. A `scripts/browser-smoke.mjs` valós gombkezelői négyféle helyes hallásfeladatot oldanak meg, az 5. helyes válasznál pedig a „napi 100 XP-s gyakorlási kereted betelt” üzenetet és a további pontok elmaradását ellenőrzi. A gyors dupla válaszadás továbbra sem adhat dupla pontot.

- PHP/MySQL/ZIP workflow: https://github.com/GigSystem-Kft/Kodaly-weblap/actions/runs/45211339799 – **success**
- Chromium E2E workflow: https://github.com/GigSystem-Kft/Kodaly-weblap/actions/runs/45211339533 – **success**
- Linux workflow: https://github.com/GigSystem-Kft/Kodaly-weblap/actions/runs/45211339520 – **success**

**Elfogadási korlát:** ezek műszaki és felhasználói felületet szimuláló tesztek; a valódi hangkimenet, pedagógiai lektorálás, tartalmak jogállása, éles szerveres telepítés és a formális 1.0 elfogadás továbbra is nyitott. Az XP gyakorlási pont, nem vizsgajegy.
