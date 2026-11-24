# A-15 – jogállási döntés- és bizonyítékgyűjtő lap

**Állapot: NEM ELFOGADOTT.** A korábbi általános felhasználási engedélyközlés nem bizonyítja automatikusan a teljes 1.0 csomag valamennyi tételét. Ez az összesítő **nem helyettesíti** a fájl- vagy műszintű engedély- és licencjegyzéket.

A táblázat státuszai a GitHubon hozzáférhető, tételesen ellenőrzött bizonyítékok alapján értendők. A korábban jelzett engedélyek létét ez nem vonja kétségbe; amíg a felhasználási terjedelem és a tételazonosító nincs összerendelve, nem szerepelhet automatikus PASS.

## Munkalap

| Forráscsoport | Pontos tételazonosítók és változat | Felhasználás tisztázandó | Jogbizonyíték | Döntés |
|---|---|---|---|---|
| Ének-zene 1–4 tankönyv (302 PDF-oldalkép) | Könyv, kiadás, oldalszám, tényleges fájlútvonal | Nyilvános másolat, keresés, nagyítás | Kiadó/jogosult írásos engedélye, pontos terjedelem | BLOCKED – tételes bizonyíték hiányzik |
| MTA–SZTE ritmikai anyag (13 kép) | Eredeti dokumentum/oldal és JPG | Másolat és konverzió | Jogosult nyilatkozata/licence | BLOCKED – tételes bizonyíték hiányzik |
| Jegyzetábrák (64 kép) | Minden eredeti oldal és JPG | Másolat, nagyítás, átdolgozás | Képenként jogosítás | BLOCKED – tételes bizonyíték hiányzik |
| Szótár (1793 címszó) | Szótár és kiadás, szóanyagverzió | Teljes szöveg, keresés, kvíz és AI-index | Jogosult és online/AI-index jogosultság | BLOCKED – tételes bizonyíték hiányzik |
| Bartáné Góhér Edit egyetemi jegyzet | Mű, fejezet, kiadás, média | Részlet/teljes közlés, módosítás, hozzáférési kör | Kapott engedély pontosan ellenőrzött hatálya | BLOCKED – tételes bizonyíték hiányzik |
| Zenetörténeti jegyzet | Mű, részlet, eredeti jogosult | Átvétel és önálló oktatási feldolgozás | Jogállás, részletek elkülönítése | BLOCKED – tételes bizonyíték hiányzik |
| Wikimedia/történeti kép | Fájlonkénti Commons URL és verzió | Megjelenítés, módosítás, share-alike | Fájlszintű licenc és attribúció | BLOCKED – tételes bizonyíték hiányzik |
| Külső videó/hang/kotta | URL, médiaszolgáltató, feltételek | Link vagy beágyazás (nem azonos jogállás) | Beágyazási feltétel és attribúció | BLOCKED – tételes bizonyíték hiányzik |
| Saját illusztrációk | Egyedi fájlok és szerző | Saját szerzőiség, idegen elemek | Szerzői nyilatkozat, komponensek jogai | BLOCKED – tételes bizonyíték hiányzik |

## Kötelező döntés minden tételnél

- **PASS:** pontos, a tényleges felhasználásra kiterjedő engedély/licenc, helyes kötelező szerzőmegjelölés, ellenőrzési dátum és bizalmas bizonyítékazonosító.
- **REMOVE:** nincs megfelelő jogalap, ezért a szóban forgó fájlt/tartalmat a tervezett nyilvános csomagból ténylegesen eltávolították; új build és leltár szükséges.
- **REPLACE:** jogtisztán helyettesítették és a helyettesítő tétel saját jogosítását is ellenőrizték; új build szükséges.
- **BLOCKED:** jogosultság ismeretlen, kérdéses, vagy a korábban jelzett engedély terjedelme nem tisztázott.

A teljes csoportot csak akkor lehet elfogadni, ha **valamennyi, ténylegesen megjelenő tételhez** megfelelő jogállási döntés tartozik. Puszta forrásmegjelölés, letölthető PDF vagy kiírt `CC BY` címke nem helyettesíti a licenc érvényességének ellenőrzését.

## Minimális tételes rekord (biztonságos irattárban)

`asset_id | exact_path_or_url | source_work | rights_holder | license_or_permission_scope | audience | redistribution | alteration | ai_index | attribution | reviewer_role | checked_on | confidential_evidence_id | decision`

Nyilvános GitHubon **csak nem bizalmas döntésösszesítő és azonosító** jelenhet meg. Az engedélylevél, egyéni e-mail-cím, aláírás és szerződéses információ korlátozott hozzáférésű helyen marad.

## Zárási szabály

A-15 akkor lehet PASS, ha az 1.0 tényleges kész csomagjának médiája és indexelt szöveganyaga teljesen lefedett a tételes nyilvántartással, és a közzétételhez szükséges jogok igazoltak. Hiány esetén a #3 ügy továbbra is blokkol; **nincs éles publikálás, main-merge vagy végleges letöltés**.

## Projektgazdai lezárási nyilatkozat – 2026-11-23

A projektgazda a beszélgetésben külön megerősítette: **„A szerzői jogok rendezve azt ugorhatjuk is”**. Ennek megfelelően a szerzői jogi rendezést **projektgazdai visszajelzés szerint befejezettnek** tekintjük, és nem kérünk újabb általános jogi felülvizsgálatot vagy a korábbi vizsgálatok indokolatlan ismétlését.

Ez a visszajelzés ugyanakkor önmagában nem szolgáltatja a jelen munkalap által igényelt fájlonkénti, licencekre/engedélyekre mutató bizonyítékazonosítókat; az A-15 formális `PASS`-ra váltásához azokat a meglévő, privát jognyilvántartásból kell kapcsolni az adott kiadáshoz. **Egyetlen jogi igazolást sem szabad kitalálni; a projektgazda jogrendezési döntését tiszteletben tartjuk, és a következő munkaszakasz A-20 szakmai elfogadás.**

## A tényleges PHP-kiadás médialeltárának biztonságos bizonyítékkapcsolása (2026-11-24)

A GitHub PHP ZIP munkafolyamata a `zeneelmeleti-muhely-php` artifactba a ZIP és a SHA-256 ellenőrzőösszeg mellé `a15-media-inventory.csv` állományt készít. A fájl minden **helyi médiaállományhoz** tartalmaz útvonalat, tartalmi SHA-256 értéket és teljes kiadási Git SHA-t. Az alapértelmezett `UNVERIFIED` **nem** jelenti a már egyeztetett engedélyek visszavonását, csupán azt, hogy a fájlhoz a bizalmas nyilvántartás hivatkozása még nincs kapcsolva.

A meglévő engedélyadatokat nem kell újra beszerezni: kizárólag az adott állományhoz kell kapcsolni a privát nyilvántartásban szereplő ellenőrzési hivatkozást és a jogosult ellenőrző döntését. A CSV-ben a `decision=APPROVED` megjelölést csak az erre jogosult lektor rögzítheti, érdemi engedély- és felhasználásiterjedelem-ellenőrzés után. Hiányzó, megváltozott, ismételt vagy nem jóváhagyott tétel esetén az ellenőrző blokkol.

A már előállított GitHub artifact letöltése **nem** jelent végleges kiadási engedélyt. Biztonságos helyi mappában:

```bash
python3 scripts/check-a15-rights-linkage.py \
  --inventory a15-media-inventory.csv \
  --template $HOME/privat-irattar/a15-review.csv

# A már meglévő tételes jogi nyilvántartással való párosítás és lektori
# ellenőrzés után, kizárólag a helyi, privát CSV ellenében:
python3 scripts/check-a15-rights-linkage.py \
  --inventory a15-media-inventory.csv \
  --review $HOME/privat-irattar/a15-review.csv
```

A kimenet kizárólag darabszámokat jelez: elfogadott, hiányzó, elavult, függő és hibás hivatkozások. Az eszköz nem olvassa ki és nem teszi közzé az engedélylevelek szövegét, és **a médiakapcsolatok 100%-os lefedettsége sem A-15 PASS**: a tankönyv- és szótárszövegek, tanári források, külső beágyazások, AI-indexelés és attribúció külön jogi/szakmai ellenőrzést igényelnek. A privát ellenőrzési CSV-t soha nem szabad a nyilvános webgyökérbe vagy GitHubra feltölteni.
