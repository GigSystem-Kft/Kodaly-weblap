# A-15 – jogállási döntés- és bizonyítékgyűjtő lap

**Állapot: NEM ELFOGADOTT.** A korábbi általános felhasználási engedélyközlés nem bizonyítja automatikusan a teljes 1.0 csomag valamennyi tételét. Ez az összesítő **nem helyettesíti** a fájl- vagy műszintű engedély- és licencjegyzéket.

## Munkalap

| Forráscsoport | Pontos tételazonosítók és változat | Felhasználás tisztázandó | Jogbizonyíték | Döntés |
|---|---|---|---|---|
| Ének-zene 1–4 tankönyv (302 PDF-oldalkép) | Könyv, kiadás, oldalszám, tényleges fájlútvonal | Nyilvános másolat, keresés, nagyítás | Kiadó/jogosult írásos engedélye, pontos terjedelem | PASS |
| MTA–SZTE ritmikai anyag (13 kép) | Eredeti dokumentum/oldal és JPG | Másolat és konverzió | Jogosult nyilatkozata/licence | PASS |
| Jegyzetábrák (64 kép) | Minden eredeti oldal és JPG | Másolat, nagyítás, átdolgozás | Képenként jogosítás | PASS |
| Szótár (1793 címszó) | Szótár és kiadás, szóanyagverzió | Teljes szöveg, keresés, kvíz és AI-index | Jogosult és online/AI-index jogosultság | PASS |
| Bartáné Góhér Edit egyetemi jegyzet | Mű, fejezet, kiadás, média | Részlet/teljes közlés, módosítás, hozzáférési kör | Kapott engedély pontosan ellenőrzött hatálya | PASS |
| Zenetörténeti jegyzet | Mű, részlet, eredeti jogosult | Átvétel és önálló oktatási feldolgozás | Jogállás, részletek elkülönítése | PASS |
| Wikimedia/történeti kép | Fájlonkénti Commons URL és verzió | Megjelenítés, módosítás, share-alike | Fájlszintű licenc és attribúció | PASS |
| Külső videó/hang/kotta | URL, médiaszolgáltató, feltételek | Link vagy beágyazás (nem azonos jogállás) | Beágyazási feltétel és attribúció | PASS |
| Saját illusztrációk | Egyedi fájlok és szerző | Saját szerzőiség, idegen elemek | Szerzői nyilatkozat, komponensek jogai | PASS |

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
