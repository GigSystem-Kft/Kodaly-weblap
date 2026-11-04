# Zenelméleti Műhely

Interaktív magyar nyelvű zeneelméleti tananyag és gyakorlófelület, kottaképekkel, szókártyákkal, kvízekkel, hallásgyakorlatokkal és forrásalapú Tanársegéddel.

## Projektazonosítók

- **Terméknév:** Zenelméleti Műhely
- **npm-csomag:** `zenelmeleti-muhely`
- **Javasolt GitHub-tárhely:** `GigSystem-Kft/zenelmeleti-muhely`
- **Tervezett webcím:** `https://zenelmeleti.gigsystem.eu` (még nem létrehozott DNS/webhely)
- **Jelenlegi GitHub-tárhely:** `GigSystem-Kft/Kodaly-weblap`, amíg a tárhely átnevezése megtörténik.

A domain, DNS, CloudPanel webhely, HTTPS-tanúsítvány és GitHub-tárhely neve **nem változik meg** a forráskód átírásától. Ezeket az üzemeltetőnek külön kell beállítania.

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

A webcím beállításakor CloudPanelben létre kell hozni a `zenelmeleti.gigsystem.eu` webhelyet, és a domain DNS-rekordját a szerverhez kell irányítani. HTTPS-t csak a megfelelő DNS-beállítás után állíts be.
