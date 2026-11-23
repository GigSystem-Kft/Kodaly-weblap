# 1.0 – célzott végső elfogadási próbák (nem új funkciófejlesztés)

**Dátum:** 2026-11-23  
**Környezet:** éles `zeneelmelet.digitaliskottatar.hu`, kizárólag tulajdonosi engedéllyel és biztonságos tesztadatokkal.  
**Státusz:** FELADATLAP; az itt szereplő próbák **nincsenek e dokumentum által elvégzettnek minősítve**.  
**Szabály:** már sikeresen jelentett alapfunkciókat nem ismételtetünk céltalanul; csak a hiányzó ellenőrzést végezzük.

## 0. Adatvesztés és biztonság elleni kapu

Éles adatot felülíró deploy, migráció, adatmódosítás vagy törlés NEM indítható addig, amíg a teljes aktuális webhely, MySQL adatbázis, privát PHP-konfiguráció és privát tanári források webgyökéren kívüli és szerveren kívüli mentése, illetve elkülönített próbavisszaállítása nem igazolt. A tesztfiók soha nem lehet tényleges hallgató fiókja. Jelszót, session tokent, személyes adatot és mentésállományt tilos issue-ba vagy logba tenni.

## 1. Elsődleges blokkoló – A-24: `.cache` és teljes telepítési ellenőrzés

**Ismert megfigyelés:** korábbi jelentésben a webgyökérben visszatérő `.cache` könyvtár tulajdonosa `zenefpt:zeneelmeletadmin`, jogosultsága `0700`; a CloudPanel felhasználója nem tudja olvasni. Ez megakadályozhatja a rekurzív, teljes bejárás bizonyítását. **Nem következik ebből**, hogy önmagában rosszindulatú vagy nyilvánosan elérhető volna.

1. Az üzemeltető azonosítsa a **valós document rootot**, a PHP-FPM futtatási felhasználót, az adott mappa tulajdonosát és tényleges létrehozó folyamatát (fájlrendszer-metaadat, PHP/app konfiguráció, folyamatnapló).
2. Ellenőrizze, hogy a könyvtár elérhető-e HTTP-n és tartalmaz-e nem nyilvános adatokat; nyilvános útvonalon **nem szabad titkos adatot megjeleníteni**.
3. Ne törölje ismételten az ismeretlen eredetű könyvtárat, ne állítson `0777` jogosultságot, és ne kapcsolja ki a teljes fájlvizsgálat követelményét.
4. Amennyiben alkalmazás-cache, az üzemeltető állítsa be dokumentáltan az alkalmazás által elvárt **webgyökéren kívüli** privát gyorsítótár-elhelyezést, vagy igazolja a teljes és biztonságos átvilágítást; változás után ismételje meg a bejárást.
5. Bejelentkezett admin `auth/deployment-check`: `scanComplete=true`, `buildConsistent=true`, `ready=true`. A `release-build.json`, HTML és PHP buildazonosítója a telepített teljes 40 karakteres commit-SHA-hoz egyezzen.
6. Rögzítés csak nem titkos formában: `ellenőrzés dátuma | telepített SHA | ellenőrző szerepköre | állapot | bizalmas bizonyíték azonosítója`.

**PASS kizárólag:** az összes megelőző mentési kapu és a valódi admin deployment-check igazoltan zöld; régi JS/CSS, bizalmas fájl és hiányos könyvtárbejárás nem maradhat észrevétlen.

## 2. A-06 / A-21: két fizikai eszközös konfliktusos mentés

A korábban sikeres „PC-n elmentettem → telefonon megjelent” próba nem helyettesíti az **offline/409** esetet.

1. Egy **eldobható tesztfiókba** PC-n és mobilon bejelentkezni. Előzetesen mindkét eszközön azonos szerveres eredmény látszódjon.
2. A PC-n kapcsolat nélkül új, jól felismerhető kedvenc/teljesítés mentése; a mobilon közben online, **másik** kedvenc/teljesítés mentése.
3. A PC újracsatlakoztatásakor ellenőrizni, hogy nincs téves „minden mentve” jelzés, ha a szerver újabb revíziót tartalmaz; a kliens megőrzi és újrapróbálja az eltérő módosításokat.
4. Mindkét eszközt frissíteni; kijelentkezni és újból belépni.
5. **PASS:** mindkét külön változtatás megmarad, nem vész el a korábbi eredmény, nincs más fiók adatának szivárgása. A tényleges 409-es hálózati válasz külön technikai bizonyítékkal igazolandó; pusztán a látható eredményből nem állítható, hogy 409 történt.

## 3. A-14 / A-20: rövid zenei mintavétel

**Valós fülhallgatón vagy hangszórón, lehetőleg asztali és mobil böngészőn.** A tesztelő jelölje, mit hallott; az automatikus hangmagasságteszt nem helyettesíti a valós akusztikai tapasztalatot.

| Próba | Elvárt eredmény |
|---|---|
| Tiszta kvart, kvint, kis szekund | 5, 7, 1 félhang; két elkülönülő hang, visszahallgatható |
| Természetes / harmonikus a-moll | VII. fok: g / gisz; lényegi hallható eltérés |
| Dallamos a-moll | Felfelé fisz és gisz; hagyományos lefelé f és g |
| Nyújtott / éles ritmus | hosszú–rövid / rövid–hosszú; 60 BPM érthető |
| Szinkópa | a hangsúlyeltolódás felismerhető, a kottával egyezik |
| Tanársegéd | tiszta/szűkített kvint és három moll korábban élesben elfogadva; célzott új teszt csak új regresszió esetén |
| Kotta-kvíz összhang | független zenei lektor által választott, dokumentált mintában a hangzó példa, képlet, válaszkulcs ugyanazt tanítja |

**PASS:** a szakmai lektor nevét helyettesítő szerepkör, vizsgált tételek, telepített SHA és bizonyítékazonosító rögzítve; nem pusztán automatizált CI.

## 4. A-15: jogállás

A `docs/acceptance/a15-jogallas-teteles-ellenorzes.md` minden forráscsoportjánál tételazonosító, felhasználási mód (nyilvános megjelenítés, módosítás, AI-index), jogosult, hatály, szerzőmegjelölés, döntés és bizalmas bizonyítékazonosító szükséges. Hiányzó bizonyíték esetén `BLOCKED`; ha nem jogtisztázható, az elem csak igazoltan jogtiszta csere vagy eltávolítás után adható ki.

## 5. A-23, SMTP és 24 pontos napló

- A korábban közölt mobil/billentyűzet/képernyőolvasó sikerek megtartása, hiányzó verzióhoz kötött igazolás; célzott 200% nagyítás/kontraszt és színmód.
- Rackhost meghívó és visszaállító email tényleges tesztcímzetthez kézbesítve; tanár/hallgató/admin tiltott jogosultságok ellenőrizve.
- Minden A-01–A-24 státusza csak tényleges biztonságos bizonyítékkal és ellenőrzővel állítható `PASS`-ra. A `scripts/check-acceptance-ledger.py` elfogadási kaput **nem kapcsoljuk ki és nem kerüljük meg**.

## Lezárási döntés

A végleges ZIP és `main` merge csak akkor engedélyezhető, ha A-01–A-24 igazoltan `PASS`, a közös kiadási SHA mindhárom műszaki CI-futása sikeres, és az ellenőrzött éles telepítés nem veszít adatot. A jelen dokumentum feladatsor, **nem** teljesítési tanúsítvány.
