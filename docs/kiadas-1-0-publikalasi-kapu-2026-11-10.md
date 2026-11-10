# Zeneelméleti Műhely 1.0 – publikálási kapu és feladatátadás

Állapot: **NEM KIADHATÓ** · rögzítve: 2026-11-10

Ez a rövid *kiadási kapu* az [A-01–A-24 audit](kiadas-elotti-elfogadas-24-pont-2026-11-09.md), a [CloudPanel-lista](cloudpanel-telepites.md) és a [jogi forrásleltár](a15-forras-es-jogallasi-nyilvantartas-2026-11-09.md) mellett használható. Nem helyettesíti a részletes bizonyítékokat.

## Az 1.0 célja és befagyasztott határa

Első kiadás: a meglévő kilenc magyar nyelvű tananyagegység, interaktív zenei gyakorlás, szókártya/kvíz, hallgatói profil, meghívásos belépés és **helyi, forrásalapú** Tanársegéd, statikus Vite frontend + PHP/MySQL backend. A külső generatív szöveg/kép AI és a nyilvános önregisztráció **alapból kikapcsolva** marad. Új tartalmi ötlet vagy UI-cizellálás nem bővíti az 1.0 határát; azok az 1.1 backlogba kerülnek. A kiadásblokkoló biztonsági vagy tartalmi hibák viszont az 1.0 részei.

## P0: a végleges ZIP és a `main` összevezetés előtti kötelező bizonyítékok

| Kapu | Bizonyíték / elfogadási próba | Felelősség | Állapot |
|---|---|---|---|
| Szakmai helyesség (A-20) | A zenei/kotta/hang, ritmus, szóhasználat, 1793 fogalom és kérdésbank mintavételes, dokumentált független lektorálása; kritikus hiba = stop | Zenei lektor + projektgazda | **NYITOTT** |
| Felhasználási jog (A-15) | Az összes csomagolt tankönyvoldal, ritmikai/jegyzetkép, szótárszöveg és beágyazott média jogosultsági igazolása a nyilvántartás szerint, ellenőrzött közzétételi terjedelemmel | Jogosult/kiadó + projektgazda | **NYITOTT** |
| Éles CloudPanel (A-21/A-24) | Valós webhelyen ellenőrzött PHP/MySQL/HTTPS, teljes verzió- és SHA-256 leltár, privát config és forrásfájlok, admin `auth/deployment-check` zöld jelentése | Üzemeltető | **NYITOTT** |
| Megőrzés és rollback (A-24) | Webhely + MySQL + webgyökéren kívüli PHP-konfiguráció + privát AI-források mentése **webgyökéren és szerveren kívül**; próbavisszaállítás; meglévő tanulói eredmények megmaradnak | Üzemeltető | **NYITOTT** |
| Valódi szerepkör és SMTP (A-21) | Vendég/hallgató/tanár/admin belépés, meghívó, igazolt címzetti Rackhost levél, jelszó-visszaállítás, jogosultság-tiltások | Projektgazda + üzemeltető | **NYITOTT** |
| Két külön fizikai eszköz (A-06/A-21) | Mentett eredmény, offline/online frissítés, 409 ütközés utáni összevezetés, újrabelépés után minden adat megvan | Projektgazda | **NYITOTT** |
| Akadálymentesség (A-23) | Kézi billentyűzet, képernyőolvasó, 200% nagyítás, kontraszt, mobil felület és hangkimenet; blokkoló hiba javítása | Tesztelő | **NYITOTT** |
| Ugyanazon commit CI | Chromium + Linux + PHP/MySQL/ZIP sikeres, kiadási SHA azonos az artefaktumban és az éles ellenőrzésben | Fejlesztés | **TECHNIKAI BIZONYÍTÉK VAN**, végső kiadási SHA újratesztelendő |

A korábbi sikeres CI-futás **nem** minősít másik SHA-t vagy az éles CloudPanelt elfogadottnak. A tényleges teljes 24 pontos auditban további nyitott pontok is lehetnek; **mindegyiket** ellenőrizni kell, mielőtt az 1.0 elfogadott.

## Műveleti sorrend és stop-szabály

1. A fejlesztési ág kódját és kötelező tananyagegységeit befagyasztani; minden kritikus javítást továbbra is ezen az ágon végezni, új kívánságokat 1.1-re felvenni.
2. Szakmai/jogi bizonyítékokat tételesen összegyűjteni. Ha nincs engedély, **az érintett tartalom csak igazoltan megfelelő alternatívára cserélve vagy elhagyva** kerülhet nyilvános kiadásba; a változást újratesztelni kell.
3. Üzemeltetővel egyeztetve, **a jelenlegi éles adatok felülírása előtt** menteni és próbavisszaállítani. A migrációkat csak az alkalmazott verziók vizsgálata után futtatni. A ZIP és a titkos konfiguráció soha nem kerülhet nyilvános gyökérbe letöltésként.
4. A [telepítési kézikönyv](../deploy/php-telepites.md) aktuális PHP-útján a *teljes* azonos SHA-jú csomagot ellenőrzött próbakörnyezetben telepíteni; a `.well-known/` és az éles adatok megőrzendők. Az admin ellenőrzésnek `scanComplete=true`, `buildConsistent=true`, `ready=true` eredményt kell adnia.
5. Külön fizikai eszközökön elvégezni az összes fiók-, SMTP-, hangzó-, profil- és akadálymentességi próbát; eredményt és hibát rögzíteni.
6. **Csak ha minden A-01–A-24 kapu igazolt**: a PR #2 Draft státuszának megszüntetése, az aktuális head SHA-hoz tartozó minden kötelező CI ellenőrzése, merge a védett `main` ágba, az új `main` commit ellenőrzése, majd a hozzá tartozó csomag kiadása és telepítése.
7. Bármely hiányzó bizonyíték, sikertelen teszt vagy adatvesztési kockázat: **STOP – nincs merge, nincs végleges ZIP-link, nincs nyilvános regisztráció**.

## 1.1-re halasztandó (nem blokkoló) elemek

Vizuális cizellálás; további zeneelméleti fejezetek, hangszeres példák és játékvariánsok; opcionális külső generatív AI; új analitika és extrák. Ez a felsorolás **nem** engedmény a szerzői jogi, biztonsági, szakmai vagy hozzáférhetőségi minimumokra.

## Handoff: mit kell a projektgazdának/üzemeltetőnek ellenőriznie?

A projektgazda vagy lektor igazolja a zenei és szerzői jogi A-15/A-20 bizonyítékokat, az üzemeltető az éles CloudPanel/SMTP/mentés-visszaállítás próbát. A projektgazda vagy kijelölt tesztelő két *valódi* eszközön és segédtechnológiával kipróbálja a felületet. Jelszót, személyes adatot, valódi meghívót, SQL-mentést és engedélylevél teljes tartalmát **ne másolják nyilvános GitHub-issue-ba**.

**Publikálási határ:** a készültség nem a commitok számától, hanem a fenti, bizonyítékokkal igazolt feltételektől függ. Kiadás vagy határidő kizárólag ezek ismeretében vállalható.
