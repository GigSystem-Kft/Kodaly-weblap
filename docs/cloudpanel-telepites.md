# Zenelméleti Műhely – CloudPanel / MySQL telepítési terv

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
