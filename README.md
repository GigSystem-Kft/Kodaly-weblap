# Zeneelméleti Műhely

Magyar nyelvű, interaktív zeneelméleti tananyag és gyakorlófelület: kilenc tananyagegység, kották és ábrák, szókártyák, párosító, kvízek, hallásgyakorlatok, hallgatói profil és forrásalapú Tanársegéd.

**Kiadási állapot (2026-11-09): ellenőrzés alatt.** A `fix/audit-p0-search-release-quiz-20261107` ág és a #2 Draft PR nem végleges kiadás. A legfrissebb automatikus tesztfuttatás önmagában nem helyettesíti a teljes szakmai, jogi, akadálymentességi, éles üzemeltetési és két fizikai eszközös elfogadást. A `main` ágra csak a 24 pontos kapu igazolt lezárása után kerülhet a változat.

## Technológia és környezetek

- **Fejlesztés:** React + TypeScript + Vite; a helyi szerver Node.js-t használhat.
- **Éles CloudPanel-célkörnyezet:** statikus Vite-build + **PHP 8.4/8.5 API** + MySQL/Percona. Az éles felület futtatásához **nem** kell Node.js, Docker vagy SSH; a PHP ZIP előre, GitHub Actionsben épül.
- **Tervezett webcím:** `https://zeneelmelet.digitaliskottatar.hu`.
- **Tényleges repository:** `GigSystem-Kft/Kodaly-weblap`. A terméknév átnevezése nem módosítja automatikusan a GitHub-repository nevét.
- **Bizalmas konfiguráció:** `zeneelmelet-private.php`, kizárólag a webgyökéren kívül, az éles szerveren. Példa: `deploy/zeneelmelet-private.example.php`. Jelszó, SMTP-kulcs és AI-kulcs nem kerülhet GitHubra.

## Helyi fejlesztés

```bash
npm install
npm run dev
```

A fejlesztői Node.js környezet **nem azonos** az éles PHP-kiszolgálással. Kiadás előtti ellenőrzés:

```bash
npm test
npm run lint
VITE_PHP_API=1 npm run build
```

A tényleges PHP/MySQL-regressziókat és a kiadási ZIP összeállítását a `.github/workflows/php-release.yml` ellenőrzi. A böngészős és Linux build munkafolyamatok külön futnak. A kiadás feltétele, hogy a **same commit SHA** mindhárom vizsgálata sikeres legyen, majd a nem automatizálható kapukat is lezárják.

## Telepítés: kizárólag a PHP-folyamat szerint

A mindenkor irányadó, részletes eljárás: **[PHP CloudPanel telepítés](deploy/php-telepites.md)**. Rövid üzemeltetési áttekintés: [CloudPanel üzemeltetési ellenőrzőlista](docs/cloudpanel-telepites.md).

A `php-release.yml` által generált ZIP az `index.html`, `assets/`, `api/` és kötelező médiaállományok összetartozó készlete. Telepítés előtt az adatbázist, a teljes webhelyet, a privát konfigurációt és a privát AI-forrásokat külön mentsük, ellenőrizzük a visszaállíthatóságot; **meglévő hallgatói naplót nem szabad törölni**. A szükséges `database/` migrációkat csak az aktuális állapot felmérése után szabad alkalmazni. A telepítő ZIP-et ne tároljuk nyilvánosan a webgyökérben.

A PHP API útvonala: `/api/index.php?route=...`. A `health` és `auth/status` csak részellenőrzés; az éles elfogadáshoz hitelesített hallgatói/tanári/admin életút, SMTP-próba, két külön eszköz adatütközés-kezelése és visszaállítási próba is kell.

## Profil, adatkezelés és Tanársegéd

A bejelentkezett felhasználók eredménymentése a PHP/MySQL-fiókszolgáltatással működik; a böngészőben korábbi `kodaly_progress` kulcs kompatibilitási okból megmaradt. A helyi állapot nem tekinthető önmagában hiteles, többeszközös vizsgaeredménynek. A fejlődési pont (XP) gyakorlási visszajelzés, **nem hivatalos érdemjegy**.

A PHP Tanársegéd alapértelmezett módja **helyi, forrásalapú keresés**. A generatív szöveg- és képmód külön, alapból kikapcsolt, szerveroldali konfigurációval engedélyezhető; bekapcsolása előtt adatvédelmi, szakmai és költségkeret-jóváhagyás szükséges. A felhasznált tananyagok, tankönyvoldalak, képek és szótár közlési jogait a kiadás előtt külön dokumentálni kell.

## Kiadási dokumentumok

- [24 pontos végső elfogadási kapu](docs/kiadas-elotti-elfogadas-24-pont-2026-11-09.md)
- [Összesített műszaki auditleltár](docs/audit-osszesitett-leltar-2026-11-07.md)
- [Forrás- és felhasználási jogi bizonyítékok](docs/a15-forras-es-jogallasi-nyilvantartas-2026-11-09.md)

A dokumentáció ellenőrzése vagy egy sikeres CI nem jelenti a kiadás jóváhagyását.
