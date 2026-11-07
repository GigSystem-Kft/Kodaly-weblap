# Zeneelméleti Műhely – CloudPanel / MySQL telepítési terv

## Előkészített környezet

- Domain: **https://zeneelmelet.digitaliskottatar.hu**
- CloudPanel webhely: Node.js 24 LTS, alkalmazásport **3100**
- Webhelyfiók: `zeneelmelet`
- Adatbázis: `zeneelmelet`
- MySQL-kapcsolat: `127.0.0.1:3306`
- SSH-fiók: `zeneelmeletssh`; a 22-es port külső elérése **jelenleg nem működik**.

A CloudPanel webhely és a TLS-tanúsítvány létrehozása **nem jelenti azt, hogy az alkalmazás telepítve van**. Az éles szerverhez a rendszergazdai telepítés vagy megfelelő fájlfeltöltési hozzáférés külön szükséges.

## Helyi fejlesztés és ellenőrzés SSH nélkül

A felület és a helyi tanulási napló adatbázis nélkül is működik. A szerveroldali regisztrációhoz helyi MySQL/MariaDB adatbázis szükséges, vagy később az éles adatbázis közvetlen szerveroldali elérése.

```bash
git pull --ff-only
npm install
npm test
npm run lint
npm run build
npm run dev
```

A `mysql2` új függőség: az első telepítéskor az `npm install` frissíti a `package-lock.json` állományt is. A frissített lockfile-t verziókezelésbe kell venni az éles `npm ci` telepítés előtt.

A fiókszolgáltatás API-címei:

| Módszer | Útvonal | Jelentés |
|---|---|---|
| GET | `/api/auth/status` | Adatbázis konfiguráció jelenléte |
| POST | `/api/auth/register` | Hallgató regisztrációja |
| POST | `/api/auth/login` | Bejelentkezés |
| GET | `/api/auth/me` | Aktuális fiók |
| POST | `/api/auth/logout` | Kijelentkezés |
| GET | `/api/progress` | Saját eredmények lekérése |
| PUT | `/api/progress` | Saját eredmények mentése |

## CloudPanel adatbázis létrehozása után

A CloudPanel **Adatbázisok → phpMyAdmin (Kezelés)** felületen a `zeneelmelet` adatbázist kiválasztva a **database/schema.sql** fájlt importálhatod. Ez 3 új, `zm_` előtagú táblát hoz létre: `zm_users`, `zm_sessions`, `zm_progress`.

**Ne importáld másik webhely adatbázisába!** Az SQL-t csak a megfelelő adatbázisban futtasd, és a migráció előtt készüljön mentés. A fiókadatbázisban most nincsenek még hallgatói adatok.

## Éles alkalmazás konfigurálása

A szerveren, **nem a GitHubon**, hozz létre környezeti változókat vagy egy védett `.env.local` fájlt a projekt gyökerében:

```dotenv
NODE_ENV=production
PORT=3100
APP_ORIGIN=https://zeneelmelet.digitaliskottatar.hu
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=zeneelmelet
DB_USER=zeneelmelet
DB_PASSWORD=<a saját, nem megosztott adatbázis-jelszavad>
```

A `DB_PASSWORD` értéket csak a szerveren add meg. Az adatbázis ne legyen külső hálózatra publikálva. A Node.js alkalmazásnak írható `zm_` táblákra van szüksége; a sémalétrehozáshoz ideiglenes DDL-jogosultság lehet szükséges.

A telepítés elkészülte, a lockfile szinkronizálása és az ellenőrzések után az alkalmazás:

```bash
npm install
npm run build
npm start
```

A CloudPanel 3100-as portja az alkalmazás `PORT` értékével egyezzen. Az alkalmazást folyamatkezelővel (pl. systemd) kell indítani és újraindítani. A szerver üzemeltetője állítsa be a folyamatkezelőt, a naplózást és az automatikus újraindítást.

## Biztonsági és kiadási korlátok

- A jelszavakat véletlen sóval és scrypt kulcsszármaztatással tároljuk, nem olvasható formában.
- A munkamenet-cookie `HttpOnly`, `SameSite=Lax`, production módban `Secure`; a token hash-e van az adatbázisban.
- Az API-n a módosító kéréseket Origin-ellenőrzés védi. Az `APP_ORIGIN` egyezzen a valódi HTTPS domainnel.
- A regisztráció automatikusan **student** szerepkört ad; oktatói jogosultságot nem lehet önállóan igényelni.
- A jelenlegi fiókrendszer **pilot/teszt célú**: nincs még e-mail-cím-megerősítés, jelszó-visszaállítás, adminisztrációs felület, részletes auditnapló vagy többpéldányos közös rate limit.
- A tanulói haladás személyes önellenőrzés: a szerver jelenleg kliensről érkező eredményadatokat ment. Ez még **nem hiteles vizsgáztatási vagy jegybeírási rendszer**.
- Éles nyilvános regisztráció előtt adatvédelmi tájékoztatás, adatmegőrzési szabályok, biztonsági audit és rendszeres adatbázis-mentések szükségesek.

## Előre elkészíthető Linuxos telepítőcsomag SSH nélkül

A GitHub Actions új `.github/workflows/deploy-bundle.yml` munkafolyamata Ubuntu 24.04 / Node.js 24 környezetben állítja elő a csomagot. Előtte automatikusan futtatja az `npm test`, `npm run lint`, `npm run build` ellenőrzéseket. Az archívum a szerveroldali függőségeket is tartalmazza, így a kibontás után külön `npm install` nem feltétlenül szükséges.

**Használat:**

1. Nyisd meg a GitHubon a projekt **Actions** fülét.
2. Válaszd a **Zeneelméleti Műhely – Linux telepítőcsomag** munkafolyamatot. A kézi indítás csak akkor látható, ha a workflow fájl a repository alapértelmezett ágán is megtalálható; a fejlesztési PR futását az automatikus `pull_request` esemény is indíthatja.
3. Sikeres futásnál az **Artifacts** részből töltsd le a `zeneelmeleti-muhely-linux-node24` csomagot. A GitHub egy ZIP-fájlt ad, abban található a `zeneelmeleti-muhely-linux-node24.tar.gz` archívum.
4. Csak **zöldre futott** ellenőrzés esetén használd a csomagot. Ha valamelyik ellenőrzés hibás, ne telepítsd.
5. A CloudPanel **Fájlkezelő** felületén a célkönyvtár:
   `/home/zeneelmelet/htdocs/zeneelmelet.digitaliskottatar.hu/`.
   A `.well-known` mappát semmilyen körülmények között ne töröld. Az archívum kibontásához a fájlkezelőnek támogatnia kell a TAR.GZ formátumot; ennek hiányában helyben kibontott és ZIP-be csomagolt fájlokkal dolgozhatsz.
6. A csomaghoz csatolt `README-TELPITES.txt` megadja a szerveroldali beállításokat.

**A feltöltés önmagában nem indítja el a webalkalmazást.** A Node.js folyamatot a szerveren, a `zeneelmelet` webhely felhasználójával, a megfelelő környezeti változókkal kell futtatni:

```bash
node server.mjs
```

Ehhez a szerver rendszergazdája által beállított folyamatkezelő vagy engedélyezett SSH/terminál hozzáférés szükséges. A későbbi üzemeltetési ellenőrzés a `/api/health` és `/api/auth/status` útvonalakon végezhető.

A telepítőcsomag nem tartalmaz adatbázis-jelszót, nem telepít adatbázist, és a GitHub Actions futása **nem jelent éles szervertelepítést**.
