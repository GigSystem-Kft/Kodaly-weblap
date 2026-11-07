# Zeneelméleti Műhely – telepítés saját Docker Registryből

Ez a folyamat a szerveradminisztrátor **saját privát Registryjét** használja. Nem szükséges GitHub Container Registry, nyitott SSH-port vagy második MySQL-adatbázis.

## Már rendelkezésre áll

- Domain: `https://zeneelmelet.digitaliskottatar.hu`
- CloudPanel Nginx: 3100-as alkalmazásport továbbítása
- MySQL: `zeneelmelet`, `zm_users`, `zm_sessions`, `zm_progress`
- Node: 24 LTS
- App: Express + React; `/api/health` ellenőrző végpont

## Fontos hálózati döntés

A meglévő CloudPanel Nginx és a MySQL jelenleg `127.0.0.1` címet használ a **Linux hoszton**. Egy normál bridge konténerben a `127.0.0.1` viszont a konténerre mutatna; ez nem érné el a MySQL-t.

Az első telepítési minta ezért kizárólag **Linux szerveren** `network_mode: host` beállítást alkalmaz, és az alkalmazás a `127.0.0.1:3100` címre figyel. Így a meglévő CloudPanel Nginx és a hoszt saját MySQL-csatlakozása működhet a MySQL hálózati szolgáltatásának vagy tűzfalának módosítása nélkül.

**Biztonsági kompromisszum:** host-hálózat esetén a konténer hálózati izolációja csökken. Az üzemeltetőnek ezt jóvá kell hagynia. A `HOST=127.0.0.1` változóval és a meglévő tűzfallal az alkalmazásport nem válik külön nyilvános porttá. Amennyiben az üzemeltető szigorú konténerhálózati izolációt követel, a MySQL-szolgáltatást külön belső hálózati csatornán kell elérhetővé tenni; ne használjuk ehhez ellenőrizetlenül a `host.docker.internal` címet.

## 1. Image építése és feltöltése a saját Registrybe

A Dockerfile a GitHub forráskódját használja, **de semmi nem kerül automatikusan a GitHub Registrybe**.

Az üzemeltető vagy CI-je a saját környezetében, hozzáféréssel a forráskódhoz:

```bash
docker build -t REGISTRY_CIM/zeneelmeleti-muhely:2026-11-05 .
docker login REGISTRY_CIM
docker push REGISTRY_CIM/zeneelmeleti-muhely:2026-11-05
```

A `REGISTRY_CIM` helyére a saját privát Registry pontos címét kell írni (például `registry.ceg.hu/oktatas`). A bejelentkezést interaktívan vagy a Registry hivatalos titokkezelésével végezzék; **jelszó/token nem kerül a repositoryba**.

Az image multi-stage Node 24 Linux buildet használ, automatikusan futtatja a tesztet, a TypeScript-ellenőrzést és a Vite buildet, majd lefordítja a szervert. Nem másolja be a Macen készült `node_modules` mappát.

## 2. Compose-konfiguráció

Az üzemeltető a szerveren létrehozza az alkalmazás dedikált könyvtárát, és oda másolja a repository `compose.yaml` fájlját.

Ebbe a könyvtárba kell egy **nem Gitben tárolt** `.env` fájl:

```dotenv
ZENEELMELET_IMAGE=REGISTRY_CIM/zeneelmeleti-muhely:2026-11-05
DB_PASSWORD=(valódi MySQL-jelszó, csak a szerveren)
```

Az üzemeltető a fájl jogosultságát és a Compose/Engine titokkezelését szabályozza. A Docker Compose környezeti változókon át adja tovább az adatbázis-jelszót, ezért a Docker adminisztrátorok hozzáférhetnek; magasabb biztonsági igénynél secret-file támogatásra lehet átállni.

**Telepítés:**

```bash
docker login REGISTRY_CIM
docker compose config --quiet
docker compose pull
docker compose up -d --no-build
docker compose ps
docker compose logs --tail=80 zeneelmeleti-muhely
```

## 3. Ellenőrzések a Linux hoszton

```bash
curl --fail --silent http://127.0.0.1:3100/api/health
curl --fail --silent http://127.0.0.1:3100/api/auth/status
```

A `/api/auth/status` `available=true` értéke **csak a DB-konfiguráció jelenlétét**, nem pedig a tényleges MySQL kapcsolat sikerességét jelzi. A regisztráció/bejelentkezés végpontjait külön próbafiókkal, **nyilvános megnyitás előtt** kell ellenőrizni.

Külső ellenőrzés a meglévő domainen: `https://zeneelmelet.digitaliskottatar.hu/api/health`.

Ha a 3100-as portot már egy másik Node.js-folyamat foglalja, az üzemeltetőnek előbb konfliktusmentesen át kell állítania a folyamatokat. **Ne változtassa meg a CloudPanel Vhostot ellenőrzés nélkül.**

## 4. Üzemeltetés

- A meglévő `zeneelmelet` MySQL-adatbázist használjuk, **nem** hozunk létre második MySQL konténert.
- A hallgatói eredmények az adatbázisban maradnak, ezért a konténer frissítésétől függetlenek. A DB-ről külön biztonsági mentés szükséges.
- Frissítés: új verziótagre módosítani a `ZENEELMELET_IMAGE` értékét, `docker compose pull && docker compose up -d`, majd ellenőrizni.
- A konténer a Node.js `node` felhasználójával fut, írható root fájlrendszer nélkül, minden Linux capability eldobásával.
- Nyilvános önkiszolgáló regisztráció **még nem élesíthető**, mert nincs e-mail megerősítés, jelszó-visszaállítás, teljes biztonsági teszt és adatvédelmi folyamat.

## Mit kell még az admintól megtudni?

A saját Registry **címét**, a támogatott image-feltöltés módját (ő építi, vagy külső CI tölthet fel), valamint hogy **ugyanazon a Linux hoszton** fut-e a Docker, a CloudPanel és a MySQL. Ezek nélkül nem szabad éles telepítést vagy MySQL-kapcsolatot feltételezni.
