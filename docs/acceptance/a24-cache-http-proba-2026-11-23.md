# A-24 – .cache HTTP-védelmi részpróba, 2026-11-23

**Státusz:** részpróba PASS (projektgazda által közölt HTTP-válaszok); **az A-24 egészében BLOCKED**.

## A projektgazda által megadott körülmények és eredmények

Az éles weboldal: `https://zeneelmelet.digitaliskottatar.hu`. A projektgazda az NGINX CloudPanel Vhost konfiguráció mindkét `server` blokkjába azonos `/.cache` és `/.cache/` útvonalszabályokat állított be, majd 2026-11-23 20:20:23 GMT időpontú HTTP HEAD kérések válaszait közölte:

| Kérés | HTTP státusz | Megfigyelés |
|---|---|---|
| `HEAD /.cache/` | 403 | HTTP-hozzáférés megtagadva |
| `HEAD /.cache/ellenorzes-nemletezo.txt` | 403 | A közölt gyermekútvonalon is tiltás |
| `HEAD /` | 200 | Kezdőoldal válaszolt |

A használt NGINX-szabályok: `location = /.cache { return 403; }` és `location ^~ /.cache/ { return 403; }`, mind a 443-as előtét és a 8080-as kiszolgáló `server` blokkján belül.

**Korlátok:** A HEAD válaszok nem tanúsítják az összes HTTP-metódust és URL-variációt, a könyvtár tényleges tartalmát, a szerver belső jogosultságait, a fizikai mentések visszaállítását vagy az éles alkalmazás minden funkcióját. Ez felhasználói terminálból másolt próba, nem független szerveroldali audit.

## Miért marad meg a figyelmeztetés?

A `php/api/deployment-audit.php` `deploymentPublicRiskScan()` függvénye a webgyökér **gyökérszintű** `.cache` könyvtárát szándékosan kihagyja a rekurzív bejárásból, és feljegyzi `excludedDirs` alatt. Ez nem azonos automatikusan a `scanComplete=false` esettel. A figyelmeztetés nem tűnik el pusztán HTTP hozzáférés blokkolásától.

## A fennmaradó A-24 teendők

1. A gyorsítótár eredetének, létrehozó folyamatának, tartalomtípusainak és hozzáférési jogainak üzemeltetői, **csak olvasó** vizsgálata, titkos fájlnevek és tartalmak nyilvánosságra hozása nélkül.
2. A teljes ellenőrzés pontos mezői: `scanComplete`, `excludedDirs`, `scanIssue`, `buildConsistent`, `ready`, telepített teljes 40 karakteres Git SHA.
3. Azonos SHA-jú telepítő sértetlensége, mentés, offsite másolat, tényleges elkülönített helyreállítás, adatmegőrzés, privát források, SMTP és szerepkörök igazolása.
4. A jogi A-15 és szakmai A-20 kapuk külön lezárandók.

**Döntés:** kizárólag a felsorolt HTTP-részpróbát rögzítjük; nem módosítjuk az `acceptance-1.0.csv` A-24 = `BLOCKED` státuszát, a `main` ágat vagy az éles állományokat.

## FTP-tulajdonosi ellenőrzés – 2026-11-23

A projektgazda által beküldött szerver-parancskimenetek alapján a webgyökérben található `.cache` könyvtár tulajdonosa `zeneftp:zeneelmeletadmin`, módja `0700`, létrehozási dátuma 2026-11-07. A `zeneftp` rendszerfelhasználó elsődleges csoportja `zeneelmeletadmin`, másodlagos csoportja `ftp-user`, shellje `/bin/false`. Az `zeneelmeletadmin` felhasználóval indított `sudo find` jogosultság hiányában visszautasítva (nem kerülgetendő).

A projektgazda FTP-felhasználóval készült FileZilla képernyőképe alapján a `.cache` könyvtárban **egy látható, 0 bájtos** `motd.legal-displayed` fájl szerepel, `zeneftp` tulajdonossal, 2026-11-07 módosítási dátummal. A fájlnév tipikusan felhasználói környezeti üzenet megjelenítését rögzítő jelző; a pontos létrehozó alkalmazás nem bizonyított. A képernyőkép csak az ott megjelenített fájlokat igazolja, nem zárja ki a további rejtett tartalmat. A teljes `.cache` könyvtár admin-oldali átvizsgálása továbbra sem történt meg.

**Teendő:** FTP-kliens rejtett fájlok megjelenítésének ellenőrzése; az üzemeltetői dokumentációhoz nem titkos, csak olvasó leltár; a PHP ellenőrzőprogram `excludedDirs` figyelmeztetését nem szabad automatikusan `PASS`-ra fordítani vagy a szükséges vizsgálatot bizonyíték nélkül elhagyni. Nincs indok fájl- vagy könyvtártörlésre, `chmod`-ra vagy `chown`-ra. A-24 teljes státusz változatlanul BLOCKED.

**Utólagos tulajdonosi megerősítés:** a projektgazda a rejtett fájlok ellenőrzése után is kizárólag az egyetlen `motd.legal-displayed` fájlt találta a `.cache` könyvtárban. Ez a tulajdonosi FTP-leltár részeredményét megerősíti; az alkalmazás beépített kihagyásának tényét és a teljes A-24 elfogadási kapu nyitottságát nem változtatja meg.

## Mentés – tulajdonosi visszajelzés (2026-11-23)

A projektgazda megerősítette: **„ez már kész van”** a weboldal- és adatbázis-mentéssel kapcsolatos feladatra. A mentést ezért **tulajdonosi közlés szerint elkészültnek** rögzítjük; nem kérjük fölöslegesen újrakészíteni. A visszaállítás próbájának ténye, időpontja, helye és eredménye ebben a visszajelzésben nem szerepel; ezért az elkészített mentés önmagában **nem jelenti a helyreállítás bizonyítását**. Az éles SHA: `644914afdfae` (projektgazda által megerősítve). Az A-24 teljes kapu továbbra sem módosul automatikusan.

## Próbavisszaállítás – projektgazdai visszajelzés (2026-11-23)

A projektgazda a mentés elkészültének megerősítése után külön jelezte: **„kipróbáltam”** a mentés visszaállítását. Ezt **tulajdonos által elvégzett próbavisszaállításként** rögzítjük. A teszt célkörnyezete, az adatbázis- és fájlvisszaállítás részletes ellenőrzése, valamint a napló vagy a nem bizalmas bizonyíték azonosítója nem került megadásra; ezért a teljes A-24 kiadási kapu még nem tekinthető automatikusan PASS-nak. Nem kérünk új, szükségtelen mentést vagy ismételt visszaállítást; a meglévő próba bizonyítékát összekapcsoljuk a telepítési ellenőrzéssel.
