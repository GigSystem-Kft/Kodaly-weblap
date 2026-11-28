# Zeneelméleti Műhely – PWA alkalmazás

## Mit tud?
- Androidon, iPhone-on, iPaden és asztali Chromium-alapú böngészőben telepíthető, külön ikonnal és önálló alkalmazásablakkal.
- Sikeres első online megnyitás után a csomaghoz tartozó alaptananyagok **részlegesen offline** is megnyithatók. A csomagban lévő JS és CSS, valamint az alkalmazás kezdőoldala tartósan, verzióhoz kötötten gyorsítótárazódik.
- A tankönyv-PDF-ek, nagy képtárak, hanganyagok, dinamikus vagy adminisztrátori tartalmak, valamint a szerverről közzétett legfrissebb szerkesztett szövegek **nem** kapnak offline ígéretet.
- A bejelentkezés, a Tanársegéd, a felhasználói profil és a tanulói eredmények szinkronizálása internetet igényel. A PWA önmagában nem jelent eszközök közötti szinkronizálást.
- Frissítéskor a telepített alkalmazás felajánlja a következő verzióra váltást; a felhasználó döntéséig az előző aktív worker marad használatban.

## Telepítés
- Android / Chrome: nyisd meg https://zeneelmelet.digitaliskottatar.hu címen, és válaszd a böngésző **Alkalmazás telepítése** menüpontját, vagy az oldal alján a **Telepítés** lehetőséget.
- iOS / iPadOS: nyisd meg az oldalt **Safariban**, majd **Megosztás → Hozzáadás a Főképernyőhöz**.
- Mac / Windows Chrome vagy Edge: a címsor telepítési ikonja, illetve a böngésző alkalmazástelepítési menüje.

## Biztonság és frissítés
- Csak az app publikus statikus váza kerül a `zm-public-shell-<verzió>` Cache Storage tárolóba.
- A service worker NEM fogja át a `/api/` útvonalakat, a nem-GET metódusokat vagy a más eredetű kéréseket. A személyes fiók-, eredmény-, admin- és AI-válaszokat nem tárolja.
- A szerveroldali kód által generált személyes tartalmat semmilyen SW-válasz nem cache-eli; a nyilvános kezdő `index.html` gyorsítótárazása cookie nélkül történik.
- A friss telepítés csak akkor aktiválódik, ha minden szükséges, az aktuális Vite-verzióból származó fájl egyszerre elérhető. Így a részleges CloudPanel-feltöltés nem ír felül csendben egy működő offline változatot.
- Az új worker verziója a lefordított JS/CSS tartalmától függ. A ZIP-kiadás emellett fájl-hashekkel ellenőrzi a `sw.js`, a manifest és az offline kezdőoldal egyezését.

## Kiadás a CloudPanelre
- A teljes PHP-telepítő vagy a hozzá pontosan illeszkedő differenciális csomag szükséges. A manifest és a SW változatát a frontend JS, CSS és `index.html` fájllal együtt frissítsd.
- Az összes új ikon kerüljön a `icons/` mappába. A korábbi, külső átlátszó weboldallogót az `images/` mappában meg kell tartani.
- A jelenlegi PHP/MySQL-adatbázis, tanulói eredmények és adminisztrátori szerkesztések változatlanok. Nem szükséges adatbázismigráció.
- A telepítő ZIP-et ne hagyd a nyilvános `htdocs` alatt. Először az új JS/CSS, manifest és worker, utoljára az `index.html` fájlt töltsd fel.

## Korlátok
- A PWA **nem natív App Store/Google Play alkalmazás**, hanem telepíthető webes alkalmazás.
- Az offline mód nem garantálja az élesben szerkesztett legfrissebb szövegeket: offline az eredeti csomagban lévő tananyagot látod.
- Az eltérő iOS és Android verziók eltérő telepítési felületet jeleníthetnek meg; a tényleges eszközös próbát külön végezd el.