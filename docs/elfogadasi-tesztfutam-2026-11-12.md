# Zeneelméleti Műhely 1.0 – elfogadási tesztfutam (2026-11-12)

**Szakasz:** ELFOGADÁSI TESZTELÉS ELINDÍTVA  
**Kiadási döntés:** STOP / NEM KIADHATÓ  
**Jelölt:** Draft PR #2, kiinduló SHA: `f201c855496102926887202e364a17e723f26ff0`  
**Tényleges tesztelés:** még nem igazolt. Az alábbi pipák *elvégzendő feladatokat* jelentenek, nem elvégzett méréseket.

A tesztfutam forrása a [24 pontos audit](kiadas-elotti-elfogadas-24-pont-2026-11-09.md), a [publikálási kapu](kiadas-1-0-publikalasi-kapu-2026-11-10.md), a [jogi nyilvántartás](a15-forras-es-jogallasi-nyilvantartas-2026-11-09.md), valamint az [üzemeltetési útmutató](cloudpanel-telepites.md). Minden egyes A-01–A-24 ellenőrzésnek külön döntés kell; a lenti munkacsomagok csak a végrehajtási sorrendet rendezik.

## 0. Belépési kapu: kiadásjelölt rögzítése

- [ ] Tesztvezető, zenei lektor, jogi kapcsolattartó és CloudPanel-üzemeltető kijelölve.
- [ ] Aktuális PR #2 head SHA rögzítve; a korábbi, `f201c855` SHA-n a Chromium, PHP/MySQL/ZIP és Linux CI sikeres, de az új commitokat újra kell tesztelni.
- [ ] A változtatási kör befagyasztva: új funkció az 1.1-be; az 1.0 ágon csak elfogadást blokkoló hiba javítható.
- [ ] Reprodukálható hibabejelentés: A-pont, lépések, elvárt/tényleges eredmény, eszköz/böngésző, biztonságos bizonyíték.

## 1. Jogi és szakmai forráskapu – A-15 (közzététel előtt)

**Felelős:** projektgazda és érintett jogosultak. **STOP**, ha egy publikálandó forrás licencelése bizonyítatlan.

- [ ] 302 tankönyvoldalkép: mű, kiadás, jogosult, a konkrét online közlésre vonatkozó engedély és attribúció tételesítve.
- [ ] 13 ritmikai és 64 jegyzetkép: forrásoldal, átvétel/módosítás és megjelenítés jogalapja bizonyított.
- [ ] 1793 fogalom: teljes szöveg, online kereshetőség és AI-indexelés engedélyezett terjedelme tisztázva.
- [ ] Bartáné Góhér Edit jegyzetének engedélye: a fejezetekre, ábrákra, módosításra és hozzáférési körre pontosítva.
- [ ] További jegyzetek, Wikimedia-, video-, hang- és kottaforrások egyenként igazoltak.
- [ ] Engedély nélküli tétel eltávolítva vagy jogtisztán helyettesítve; utána teljes CI megismételve.

**Bizonyíték:** csak tételazonosító, döntés, dátum, ellenőrző és *korlátozott hozzáférésű bizonyíték hivatkozása* kerüljön a nyilvános összesítőbe; szerződés, e-mail, személyes adat nem.

## 2. Biztonságos CloudPanel-előkészítés – A-24

**Felelős:** üzemeltető. **Tilos** az éles állapotot felülírni bizonyított teljes mentés és rollback nélkül.

- [ ] Jelenlegi webgyökér, PHP-verzió, MySQL és alkalmazott migrációk felmérve; éles adatok sértetlenek.
- [ ] Teljes webhely, MySQL, privát `zeneelmelet-private.php` és privát `zeneelmelet-ai-sources` mentve a webgyökéren kívül, offsite másolattal.
- [ ] A mentést **elkülönített** tesztkörnyezetbe visszaállítva ellenőrizték; eredmény és visszaállítási idő dokumentálva.
- [ ] Azonos SHA-jú PHP ZIP és SHA-256 melléklet ellenőrzése; a ZIP nem kerül weben elérhető mentési mappába.
- [ ] Próbatelepítés után: HTTPS, PHP/MySQL, privát könyvtárjogok és admin `auth/deployment-check`; a `scanComplete`, `buildConsistent` és `ready` mind igaz.
- [ ] A helyi hálózatról futtatott `scripts/check-live-php-release.py --expected-sha <FULL_40_CHAR_SHA>` hibamentes (az admin-ellenőrzést *nem* helyettesíti).
- [ ] Sikertelen próbánál dokumentált rollback, tanulói adatok megőrzésének visszaellenőrzésével.

## 3. Valós felhasználó, Rackhost SMTP és jogosultság – A-04/A-21

**Felelős:** üzemeltető és projektgazda, kizárólag eldobható tesztfiókokkal.

- [ ] Admin meghívó -> Rackhost levél tényleges kézbesítése -> regisztráció -> címellenőrzés -> belépés.
- [ ] Elfelejtett jelszó és jelszócsere után régi token és munkamenet elutasítva.
- [ ] Vendég/hallgató/tanár/admin jogosultsági elkülönítés, tiltott API-műveletek 403/401.
- [ ] Mentés, export és törlés adatvédelmi ellenőrzése; fióktörlés csak dedikált tesztfiókon.

## 4. Két valódi eszköz és tanulási folyamat – A-02–A-07, A-12, A-19

**Felelős:** két tesztelő vagy egy tesztelő két külön *fizikai* eszközzel.

- [ ] Ugyanaz a tesztfiók asztali és mobil eszközön; mind a kilenc modul elérhető.
- [ ] Tankönyvkeresés magyar ékezetekkel; oldalmegnyitás és nagyítás.
- [ ] Haladási jelölések, kvíz, párosító, kedvencek és XP mentése; kilépés és újrabelépés után megmaradnak.
- [ ] Valós offline/online módosítás és 409 ütközés; az összevezetés nem veszít el új eredményt.
- [ ] Menük, böngésző visszalépés, mobil tájolás és külső hivatkozások kipróbálva.

## 5. Zenei és pedagógiai lektorálás – A-03, A-07–A-17, A-20, A-22

**Felelős:** független zenei lektor / oktató, szükség esetén több szakértő.

- [ ] Hangnevek (magyar H/B), szolmizáció, dúr/moll, skálák, hangközök, ritmus, ütemmutatók, kotta–hang párok ellenőrizve.
- [ ] Hangzó gyakorlatok külön hangszórón/fülhallgatón és böngészőkben ellenőrizve.
- [ ] Mind a kilenc modul szerkezete, terminológiája és forrásai egyeztetve.
- [ ] Az 1793 fogalom és a kérdésbank reprezentatív, dokumentált mintavétele; bármely súlyos hiba teljes érintett kör újravizsgálatát váltja ki.
- [ ] Magyar Tanársegéd: releváns válaszok, eredetjelölés, hiányzó források és téves válaszok próbái.
- [ ] Oktatói döntés: XP, pontszám, hibaarány és trend jelentése; a nem hitelesítetten számított XP nem jelenhet meg vizsgaeredményként.

## 6. Akadálymentesség – A-05/A-19/A-23

**Felelős:** kézi tesztelő, lehetőleg tényleges segédtechnológiával.

- [ ] Teljes billentyűzetes bejárás, fókuszsorrend, fókuszvisszaállítás, Escape és nagyítók.
- [ ] Képernyőolvasó címkék és visszajelzések.
- [ ] 200%-os nagyítás, világos/sötét téma, kontraszt és mobil.
- [ ] Hangzó feladatok alternatívái, lejátszó kontrollok és billentyűzetes használat.

## 7. Záró döntés – valamennyi A-01–A-24 és Git

- [ ] A részletes 24 pontos audit *minden* sora rendelkezik aláírt vagy visszakövethető elfogadással és dátummal.
- [ ] Minden blokkoló hiba javítva, az érintett tesztek megismételve.
- [ ] Ugyanazon végső PR head SHA három kötelező technikai CI-je sikeres; a #3 elfogadási issue elő-merge tételei igazoltan lezártak.
- [ ] Csak ezután PR #2 Draft -> Ready, szabályos review és merge a védett `main` ágba.
- [ ] Új `main` commit CI, ZIP SHA-256 és célkörnyezeti azonos SHA ellenőrizve; csak ezután végleges letöltési link.

## Egységes tesztnapló (egy rekord minden elvégzett próbához)

| Mező | Kitöltés |
|---|---|
| Auditazonosító | A-01…A-24 és vizsgálati tétel |
| Jelölt SHA | Teljes 40 karakteres Git SHA |
| Tesztdátum és ellenőrző | YYYY-MM-DD; személy/szerep |
| Környezet | Staging/éles, böngésző, eszköz (titkok nélkül) |
| Lépések és elvárt eredmény | Pontosan reprodukálható |
| Tényleges eredmény | PASS / FAIL / BLOCKED / NOT RUN |
| Bizonyíték | Nem érzékeny link vagy biztonságos belső bizonyítékazonosító |
| Hibahivatkozás és retest | Issueszám és későbbi SHA, ha releváns |

**Tilos** a PASS jelölés pusztán sikeres CI, létező ZIP vagy korábbi általános engedélyközlés alapján. Az elfogadási szakasz megkezdése önmagában nem jogosít telepítésre, `main`-merge-re vagy nyilvános letöltésre.
