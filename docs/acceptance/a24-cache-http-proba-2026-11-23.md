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
