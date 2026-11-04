# Zenelméleti Műhely

Interaktív magyar nyelvű zeneelméleti tananyag és gyakorlófelület, kottaképekkel, szókártyákkal, kvízekkel, hallásgyakorlatokkal és forrásalapú Tanársegéddel.

## Projektazonosítók

- **Terméknév:** Zenelméleti Műhely
- **npm-csomag:** `zenelmeleti-muhely`
- **Javasolt GitHub-tárhely:** `GigSystem-Kft/zenelmeleti-muhely`
- **Tervezett webcím:** `https://zeneelmelet.digitaliskottatar.hu` (CloudPanelben létrehozva; telepített Let's Encrypt tanúsítvánnyal)
- **Jelenlegi GitHub-tárhely:** `GigSystem-Kft/Kodaly-weblap`, amíg a tárhely átnevezése megtörténik.

A CloudPanelben a `zeneelmelet.digitaliskottatar.hu` webhely létrejött, a Let's Encrypt tanúsítvány telepítve van. Az alkalmazás éles telepítése és az adatbázis létrehozása ettől még külön lépés. A GitHub-tárhely neve **nem változik meg** a forráskód átírásától.

## Helyi indítás

Node.js és npm szükséges.

```bash
npm install
npm run dev
```

A fejlesztői szerver alapértelmezett címe: `http://localhost:3000`.

## Ellenőrzés

```bash
npm test
npm run lint
npm run build
```

## Zeneelméleti Tanársegéd

Gemini használatához az alkalmazás gyökérkönyvtárában hozz létre egy nem verziókezelt `.env.local` fájlt:

```dotenv
GEMINI_API_KEY=ide_kerul_a_sajat_kulcs
```

API-kulcs nélkül a Tanársegéd a helyi, kereshető tananyagból és a `server-data` mappában található forrásokból jelenít meg kapcsolódó részleteket. A kulcsot ne add hozzá a GitHubhoz, és ne oszd meg képernyőképen.

## Tanulói előrehaladás

A jelenlegi alkalmazás a böngésző `localStorage` tárolójában őrzi a tanulási eredményeket. Az eredeti `kodaly_progress` technikai kulcsot **kompatibilitási okból megtartottuk**, hogy a már megszerzett XP-k és a teljesítések ne vesszenek el az átnevezés során. Ez nem a termék látható neve. A valódi többfelhasználós, szerveroldali adatmentés későbbi fejlesztés.

## Átnevezés a GitHubon

A repository adminisztrátora a GitHub **Settings → General → Repository name** mezőjében tudja a `Kodaly-weblap` nevet `zenelmeleti-muhely` névre módosítani. Ezután a lokális klónban:

```bash
git remote set-url origin https://github.com/GigSystem-Kft/zenelmeleti-muhely.git
git remote -v
```

A `zeneelmelet.digitaliskottatar.hu` CloudPanel-webhely már létrejött. Az SSL/TLS oldalon telepített Let's Encrypt tanúsítvány látható; a teljes éles működéshez még az alkalmazás futtatását és a háttéradatbázist kell beállítani.

## Hallgatói fiókok – fejlesztői előnézet

A 06. Profil oldalon a regisztráció és bejelentkezés az adatbázis beállítása után válik elérhetővé. A fiókrendszer MySQL/MariaDB és `mysql2` segítségével működik.

**CloudPanel szerverbeállítások, SQL-import és biztonsági lépések:** [Telepítési útmutató](docs/cloudpanel-telepites.md).

A következő fájlok tartoznak hozzá:

- `server-auth.ts` – fiókkezelő és eredménymentő API
- `database/schema.sql` – adatbázistáblák
- `src/components/AccountPanel.tsx` – hallgatói bejelentkezés és regisztráció
- `.env.example` – konfigurációs minta, valódi jelszavak nélkül

SSH-hozzáférés nélkül a fejlesztés GitHubon és a helyi gépen folytatható; ez **nem jelenti a szerveren történő telepítést**. Jelszót és privát SSH-kulcsot ne tölts fel a GitHubra.
