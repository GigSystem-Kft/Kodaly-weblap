# Zeneelméleti Műhely – PHP telepítés CloudPanelben

> **AKTUÁLIS KIADÁSI FIGYELMEZTETÉS · 2026-11-09**
>
> A dokumentum alsóbb, dátumozott fejezetei a fejlesztés **történeti lépéseit** is tartalmazzák. A régi Node.js-telepítésre, `mail()`-re, részleges `api/index.php`-feltöltésre vagy külön képfájlcsomagra vonatkozó részletek **nem tekinthetők a jelenlegi, teljes kiadás utasításának**.
>
> **Jelenleg nincs jóváhagyott végleges kiadás.** A fejlesztési PR #2 Draft, a `main` összevezetése és a végleges letöltési link a [24 pontos elfogadási jegyzőkönyv](../docs/kiadas-elotti-elfogadas-24-pont-2026-11-09.md) szerint blokkolt.
>
> Ha a kiadási kapuk teljesülnek, kizárólag az **azonos Git commitból** származó `php-release.yml` csomag teljes `index.html` + `assets/` + `api/` + médiaállomány-készletével szabad dolgozni. Előtte ellenőrzött, webgyökéren kívüli és szerveren kívüli mentés kell az SQL-adatbázisról, a webhelyről, a privát konfigurációról és a privát AI-forrásokról. A migrációkat csak a tényleges adatbázisállapot felmérése után alkalmazzuk; tanulói eredményeket nem törlünk.
>
> Az éles backend **PHP 8.4/8.5 + MySQL/Percona**, a levélküldés **PHPMailer + Rackhost hitelesített SMTP**; a privát `zeneelmelet-private.php` kizárólag a `htdocs` könyvtáron kívül lehet. A nyilvános regisztráció és a generatív AI alapból tiltott maradjon. A régi dokumentáció alapján az éles rendszeren **ne módosíts beállítást**.
>
> Rövid, naprakész üzemeltetési lista: [CloudPanel ellenőrzőlista](../docs/cloudpanel-telepites.md). A szakmai és jogi jóváhagyások, az éles SMTP, a két fizikai eszközös adatmegőrzés és a manuális akadálymentességi elfogadás nem helyettesíthetők zöld CI-futással.


## Elkészült kiszolgáló

- React + Vite frontend, kizárólag statikus fájlként publikálva
- PHP 8.4/8.5 backend a `/api/index.php?route=...` címen
- Percona/MySQL 8, meglévő `zm_users`, `zm_sessions`, `zm_progress` táblák
- CloudPanel generikus PHP webhely: `zeneelmelet.digitaliskottatar.hu`
- Éles gépen **nem kell Node.js / Docker / SSH** a futtatáshoz
- Regisztráció alapesetben zárva; a meghívásos pilotot külön kell aktiválni.

## 1. GitHub Actions ZIP

A `php-release.yml` GitHub Actions workflow Ubuntu alatt építi meg a weboldalt:
`npm install`, `npm test`, `npm run lint`, `VITE_PHP_API=1 npm run build`;
majd a lefordított `dist/` tartalmát és a `php/api/index.php` fájlt egy ZIP-be gyűjti.

Az eredmény neve: `zeneelmeleti-muhely-php.zip`. GitHub Actions Artifacts alatt
a ZIP külön ZIP csomagolásban is megjelenhet: előbb csomagold ki a letöltött
Actions csomagot, majd a benne lévő telepítési ZIP-et töltsd fel.

## 2. Feltöltés

CloudPanel → Webhelyek → `zeneelmelet.digitaliskottatar.hu` → Fájlkezelő.

Cél: **a webhely gyökérkönyvtára**, amelyben a `.well-known/` mappa van.

A ZIP felépítése:
```
index.html
assets/
api/index.php
api/knowledge.php
...```

A ZIP-et ebbe a gyökérkönyvtárba bontsd ki. **NE** egy új `zeneelmeleti-muhely-php/`
alkönyvtárban hagyd. A `.well-known/` mappát és a SSL-tanúsítványt őrizd meg.

## 3. Bizalmas adatbázis-konfiguráció

A webhely-felhasználó a képernyőképek szerint `zeneelmeletadmin`.
Hozd létre a config fájlt a felhasználó saját mappájában, **nem a htdocs alatt**:

```
/home/zeneelmeletadmin/zeneelmelet-private.php
```

A mintát a `deploy/zeneelmelet-private.example.php` fájl tartalmazza.
Állítsd be a valódi DB jelszót, és ügyelj arra, hogy csak a megfelelő
Linux-felhasználó olvashassa. A mintában az `invite_registration=false`;
így a webhely az első telepítéskor nem vesz fel nyilvános hallgatókat.

A PHP `pdo_mysql`, `json`, `openssl` és `password_hash` funkciókat
használja; PHP 8.4/8.5 alatt ellenőrizendők. A webhelynek a valódi DB eléréséhez
jogosultságokkal kell rendelkeznie.

**NE** töltsd a valós konfigurációt a webhely gyökerébe, GitHubra vagy csevegésbe.

## 4. Tesztelés

1. `https://zeneelmelet.digitaliskottatar.hu/` – tananyag és teljes UI
2. `https://zeneelmelet.digitaliskottatar.hu/api/index.php?route=health` – egészségellenőrzés
3. `https://zeneelmelet.digitaliskottatar.hu/api/index.php?route=auth/status` – elérhető adatbázis; `available: true`
4. Profil oldal: zárt regisztráció; bejelentkezés csak már létező fiókkal.
5. Zárt pilothoz `invite_registration=true`, miután a meghívó- és e-mail-migrációt telepítettük.

**Az előző Node.js kód által scrypt-tel készített jelszóhash-eket a PHP password_verify
nem tudja ellenőrizni.** Ha ilyen korábbi felhasználói fiókok vannak, élesítés
előtt migráció vagy biztonságos jelszó-visszaállítás szükséges.

## Korlátok

- A PHP API támogatja a regisztrációt, bejelentkezést, kijelentkezést és a profil eredménymentését.
- A Tanársegéd PHP-kiadása a telepítőcsomagban található, lecke- és forrásrészletekből álló **helyi keresőmóddal** működik. Nem használ külső Gemini API-t és nem fogalmaz önálló AI-magyarázatot.
- E-mail-megerősítés, jelszó-visszaállítás és jelszócsere megvalósult, de valós e-mail-kézbesítéssel és éles használattal még ellenőrizni kell. A hallgatói/oktatói önkiszolgáló fióktörlés és a sajátadat-export elkészült a fejlesztési ágon; éles elfogadási próba és végleges adatvédelmi tájékoztató még hiányzik.
- Az IP-alapú belépésvédelem a webhely saját, nem nyilvános `~/.zeneelmelet-rate-limits/` mappáját használja, nagy forgalomnál nem helyettesíti a központi rate limitet.
- **Nyilvános regisztráció ne induljon az üzemeltetési és adatvédelmi ellenőrzésekig.**

## Meghívásos regisztráció (új kiadás)

A már működő `zeneelmelet` adatbázist **nem kell törölni vagy újratelepíteni**.

1. phpMyAdmin → `zeneelmelet` adatbázis → Importálás: `database/V002__one_time_invitations.sql`. Ezzel létrejön a `zm_invitations` tábla, a korábbi három tábla változatlan marad.
2. A Macen, a projekt könyvtárában egyetlen címzettnek generálj meghívót:

   ```bash
   node scripts/create-invitation.mjs cimzett@pelda.hu
   ```

   A parancs megjelenít egy **titkos kódot** és egy **SQL INSERT** utasítást. Az utóbbit futtasd a megfelelő adatbázis phpMyAdmin SQL lapján. A kódot biztonságos csatornán add át a címzettnek, és ne küldd ide a beszélgetésbe.
3. A privát `/home/zeneelmeletadmin/zeneelmelet-private.php` konfigurációba írd be:

   ```php
   'invite_registration' => true,
   ```

   A régi `allow_registration` opciót a PHP API már **nem használja**; ezt törölheted.
4. Töltsd fel a **legfrissebb PHP telepítő ZIP** tartalmát a webhely gyökérkönyvtárába; őrizd meg a `.well-known` mappát. Ne töltsd fel a privát konfigurációt a webhely alá.
5. A Profil oldalon megjelenik a **Meghívókód** mező. Az új hallgatónak ugyanazt az e-mail-címet kell megadnia, amelyhez a meghívót létrehoztad.
6. Ellenőrizd, hogy ugyanaz a kód második regisztrációra már nem használható. Próbáld ki a bejelentkezést, a kvízeredmény szerveroldali mentését és az újra bejelentkezés utáni visszatöltést.

**Biztonság:** csak a kód SHA-256 hash-e szerepel a MySQL-ben; a nyers meghívó nem. A kód 32 bájt kriptográfiai véletlenből készül, 64 hexadecimális karakter hosszú; 7 napig érvényes, és adatbázis-tranzakcióban pontosan egyszer használható. A meghívó nem helyettesíti a tényleges e-mail megerősítését. Nyilvános regisztráció továbbra sincs.

**Régi jelszavak:** a korábbi Node.js scrypt-hash nem kompatibilis a PHP Argon2id ellenőrzésével. A régi fiókokhoz külön migráció/jelszó-visszaállítás szükséges.

## V003 – E-mail-cím ellenőrzése és jelszó-helyreállítás

**Telepítés előtt készíts biztonsági mentést a `zeneelmelet` adatbázisról.**
A V003 nem törli a meglévő tanulási eredményeket. A már regisztrált pilotfiókokat migrációkor ellenőrzöttnek jelöli; az ezután létrejövő új fiókok csak megerősítés után léphetnek be.

1. A `zeneelmelet` adatbázisban egyszer importáld:
   `database/V003__account_email_verification_reset.sql`.
   A script a `zm_users.email_verified_at` oszlopot és a `zm_account_tokens` táblát hozza létre.
   **Ne importáld másodszor**, mert az oszlop már létezik.
2. Töltsd fel a legújabb GitHub Actions **PHP telepítő ZIP** tartalmát a webhely gyökérkönyvtárába, felülírva a régi API-t, React indexet és a megfelelő asseteket.
3. A webhely nyilvános könyvtárán kívüli `/home/zeneelmeletadmin/zeneelmelet-private.php` fájlban a meglévő `db` és `app_origin` mellé szükséges:

   ```php
   'invite_registration' => true,
   'mail_enabled' => false,
   'mail_from' => 'noreply@zeneelmelet.digitaliskottatar.hu',
   ```

   **Először maradjon `mail_enabled=false`!** Ekkor a rendszer nem vesz fel új felhasználókat, ha nem tud megerősítő levelet küldeni.

4. A szerveradminnal egyeztesd a kimenő levelezést. A PHP API a `mail()` függvényt használja; ehhez a PHP-folyamatnak működő, megbízható és helyesen hitelesített helyi mail transport (MTA/SMTP relay) szükséges. A `mail()` sikeres visszatérése **nem bizonyítja a címzetthez történő kézbesítést**. Be kell állítani a feladó-domain SPF, DKIM és DMARC rekordjait és ellenőrizni a levél sikeres megérkezését.
5. A rendszergazda által **tesztelt** e-mail-küldés után állítsd `mail_enabled=true` értékre. Ne oszd meg a mail-/DB-jelszavakat és a tokeneket.
6. Zárt meghívós próba: új meghívó + fiók → levélben érkező megerősítés (24 óra) → bejelentkezés → „Elfelejtetted a jelszavad?” → e-mailben küldött 30 perces visszaállító link → új jelszó → bejelentkezés. A jelszócsere minden meglévő munkamenetet érvénytelenít.

**Fontos:** a meghívó továbbra is egyszer használható, az e-mail megerősítő és jelszó-visszaállító tokeneket az adatbázis csak SHA-256 lenyomatként tárolja, a linkek egyszer használhatók. A nyilvános, meghívó nélküli regisztráció továbbra sincs bekapcsolva.

A PHP CI valós MySQL 8 tesztadatbázissal és teszt e-mail-átvevővel ellenőrzi a folyamatot. Ez nem helyettesíti a valódi CloudPaneles kézbesítési próbát, a biztonsági auditot és az adatvédelmi dokumentáció elkészítését.

## Rackhost SMTP – dedikált feladó (2026-11)

A dedikált postafiók: `noreply@digitaliskottatar.hu`.
A webmailbe való bejelentkezés önmagában **nem bizonyítja**, hogy a CloudPanel szerverről kimenő SMTP elérhető.

Az alkalmazás PHPMailert használ hitelesített SMTP-vel, implicit TLS-sel (`smtp.rackhost.hu:465`).
A telepítő ZIP már tartalmazza a szükséges Composer `vendor` könyvtárat;
**a CloudPanelre sem Composer, sem SSH nem szükséges**.

A `/home/zeneelmeletadmin/zeneelmelet-private.php` fájlban, a `return [` tömbben legyen:

```php
'mail_enabled' => false,
'mail_transport' => 'smtp',
'mail_from' => 'noreply@digitaliskottatar.hu',
'smtp' => [
    'host' => 'smtp.rackhost.hu',
    'port' => 465,
    'user' => 'noreply@digitaliskottatar.hu',
    'password' => 'IDE_IRD_A_POSTAFIOK_JELSZAVAT',
],
```

Ezt a fájlt a **htdocs-on kívül** kell tárolni, megfelelő fájljogosultsággal.
Ne töltsd fel GitHubra, és ne oszd meg a jelszót a beszélgetésben.
A gyártási útvonalon `mail()` helyett a hitelesített SMTP használatos;
a `local-test` opció kizárólag `http://localhost:8000` alatt engedélyezett.

Telepítés utáni lépések:
1. Frissítsd az `api/index.php` fájlt és az `api/vendor/` mappát az új ZIP-ből.
2. Ellenőrizd a V003 migrációt, az API státuszt, a meglévő felhasználó bejelentkezését.
3. Egyeztess az üzemeltetővel: a CloudPanel szerver kimenő `smtp.rackhost.hu:465` forgalma engedélyezett-e. A Rackhost MX-rekordjaihoz vagy a már működő weboldal DNS A-rekordjaihoz most nem kell hozzányúlni. Az SPF/DKIM/DMARC legyen beállítva a választott feladói domainen.
4. A tesztfiókhoz egy új meghívóval, szűk tesztidőszakban `mail_enabled=true` és `invite_registration=true` mellett próbálj regisztrálni. A megerősítő levél **valós kézbesítését** ellenőrizd. Hiba esetén vissza `mail_enabled=false`, és nézd meg a CloudPanel PHP error logot titkok megosztása nélkül.
5. Sikeres levélküldés után ellenőrizd a megerősítést és a jelszó-visszaállítást.

**Ne állítsd éles nyilvános regisztrációra a weboldalt**, amíg a kézbesítés és az adatvédelmi folyamatok nem lettek ellenőrizve.

## Tanársegéd: ellenőrzött források és külön képgenerálás (2026-11)

A hibásan felismert `kesztler-zenei-alapismeretek.txt` OCR-szöveget **kivettük**
a `server-data/forrasok/` könyvtárból. Az exportáló és a PHP betöltő
egyaránt szűri a Kesztler-féle forráscímkéket; a következő kiadás
`api/knowledge.php` állománya sem tartalmazza. Ez **nem a könyv szakmai
minőségének** megítélése, kizárólag a hibás digitális átirat kizárása.

Az Admin felület új *Tanársegéd – további források* részében ellenőrzött
`.txt` vagy `.md` szövegek tölthetők fel (UTF-8, maximum 300 KB/fájl,
maximum 25 dokumentum). Az alkalmazás privát mappában tárolja őket:
`/home/zeneelmeletadmin/zeneelmelet-ai-sources/` — nem a `htdocs` alatt.
Feltöltés vagy eltávolítás után a PHP kereső azonnal az új állományból dolgozik;
ehhez nincs szükség új GitHub-csomagra. PDF, fényképezett könyvoldal vagy
nyers OCR-átirat közvetlen feltöltése nem engedélyezett. Előbb ellenőrizd
és alakítsd pontos, jogszerűen használható UTF-8 szöveggé.

A Gemini **képgenerálás a régi, előre rögzített képek megjelenítésétől külön
funkció**, amelyet csak a szerveroldali privát konfigurációval lehet aktiválni:

```php
'tutor_image_generation' => [
    'enabled' => false, // true csak ellenőrzött API-számlázás és keret után
    'model' => 'gemini-2.5-flash-image',
    'api_key' => 'A_GOOGLE_AI_STUDIO_API_KULCSOD',
],
```

A PHP a `generativelanguage.googleapis.com` hivatalos API-ját hívja.
Az API-kulcs soha nem kerül a böngészőbe vagy a GitHubba. Bekapcsolás esetén
a képgenerálás **bejelentkezéshez kötött**, a kéréslimit 3/15 perc/felhasználó
és IP kombinációval. A kép csak a kérés válaszában, átmenetileg jelenik meg,
az alkalmazás nem menti el a szerverre. A rövid PHP API-kérés előbb is
megszakadhat, ha a szolgáltató nagyon lassú, így élesítéskor próbát igényel.
A generált képekben a kotta és a hangközök pontatlanok lehetnek.

**Költségek:** képgeneráláshoz a Google API fizetős modellkerete
szükséges lehet. A `enabled=false` beállítás mellett nem történik képgenerálási
API-hívás és nincs ilyen költség. A szerver kimenő HTTPS-kapcsolatát
és a Google AI Studio projekt kvótáit előbb ellenőrizni kell.
Egyidejű sokfelhasználós használat előtt központi, havi költségkeret,
nyomon követés és szigorúbb kvótakezelés szükséges.

## Kreatív zenei nevelés – 6. fejezet és kézikönyvi képek

A Kreatív zenei nevelés a Tananyag kezdőoldalán a **6. fejezet**, nem külön felső menüpont.
A jógyakorlatok a Szirányi Borbála (2021): *Kreatív énekes-játékok ritmikus mozgással*
című tanári kézikönyv alapján készült, önálló szerkesztésű pedagógiai vázlatok.

A felhasználó által adott PDF-ből három, **eredeti forrásrészletet** kivágtunk
(nem generált AI-képek). Ezek **külön képcsomagban** érkeznek, a GitHub
telepítő ZIP jelenleg nem tartalmazza a bináris állományokat.

CloudPanel Fájlkezelőben a képcsomagot a PHP webhely gyökérkönyvtárába
kell kibontani, az útvonalak változtatása nélkül:
- `images/kreativ/szunet-testritmus.webp` – 47. nyomtatott oldal, PDF 48.
- `images/kreativ/szinkopa-testritmus.webp` – 48. nyomtatott oldal, PDF 49.
- `images/kreativ/egesz-hang-testritmus.webp` – 49. nyomtatott oldal, PDF 50.

A fájlok alatt az oldalnak meg kell jelölnie a forrást:
Szirányi Borbála (2021): *Kreatív énekes-játékok ritmikus mozgással*,
az adott nyomtatott oldalszám. Mivel a kézikönyv szerzői jogi védelem
alatt áll, **nyilvános közzététel előtt meg kell győződni az ábrák
újraközlésére vonatkozó engedélyről**. A részleteket ne terjeszd tovább
jogosultság nélkül. Az alkalmazás működik a képek nélkül is; sikertelen
képbetöltéskor eltünteti az érintett képhelyet.

## 2026-11-06 – teljes Kreatív kézikönyv visszavonása

A Szirányi Borbála-féle teljes 71 oldalas, nyilvános könyvmásolatot kivettük
a `07. Tankönyvek` menüből. A régi `textbook-5` felületet a React-alkalmazás
többé nem nyitja meg. A `06. Kreatív zenei nevelés` önálló, saját
megfogalmazású módszertani feldolgozása megmarad és **21 feladatra bővült**.

**Fontos: a menüpont elrejtése nem törli a már feltöltött fájlokat.**
A CloudPanel Fájlkezelőben, a megfelelő webhely
`/home/zeneelmeletadmin/htdocs/zeneelmelet.digitaliskottatar.hu/`
gyökérkönyvtárából **töröld kizárólag a `tankonyvek/5/` mappát teljes
tartalmával** (`oldalak.json` és `p001.jpg` … `p071.jpg`).
A `tankonyvek/1/` … `tankonyvek/4/` mappákat NE töröld.
Ez biztosítja, hogy a régi közvetlen könyvoldal-URL-ek se működjenek.

Törlés után ellenőrizd például ezt a címet:
`https://zeneelmelet.digitaliskottatar.hu/tankonyvek/5/p001.jpg`.
Ennek HTTP 404-et kell adnia, nem könyvborítót vagy indexoldalt.
Nginx/Varnish vagy CDN gyorstárból is töröld a régi oldalakat, ha továbbra
is láthatók.

A `Kreatív` módszertani oldalon külön létező 3 eredeti illusztrációhoz
a felhasználási jogot külön kell tisztázni. Engedély hiányában az
`images/kreativ/` alatt tárolt eredeti képrészleteket se terjeszd nyilvánosan.
A szöveges, önálló összefoglalók nem igénylik az eredeti PDF közzétételét.

## 2026-11-08 – helyreállítási tanulságok, teljes PHP-csomag és forráslefedettség

**Éles incidens:** fájlok visszaállítása után a régebbi frontend nem küldött `revision` értéket a tanulási eredmények mentésekor, ezért `PUT /api/index.php?route=progress` **428** választ adott. A frontend és API azonos buildből telepített állományai megszüntették a hibát. A szerver `api/admin.php` hiánya miatt az összes `admin/*` végpont **503** válasszal állt le; a hiányzó fájl helyreállítása után mind a négy admin GET kérés **200** lett. A felhasználó phpMyAdminból igazolta a kedvencazonosító szerveroldali mentését; ez **nem** váltja ki a fizikai két eszközös vagy több felhasználós végtesztet.

**Új telepítési szabályok:**

1. Teljes SQL-export, publikus webhelyfájlok, privát `zeneelmelet-private.php` és `zeneelmelet-ai-sources` (ha létezik) mentése **a webgyökéren kívül**; legalább egy példányt a szerveren kívül tároljunk. Az adatbázis és privát konfiguráció a frontend frissítésekor **nem** írható felül.
2. A teljes GitHub Actions által összeállított `index.html` + `assets/` + `api/` fájlkészletet kell összhangban tartani. Soha ne tekintsünk teljes telepítésnek egy külön feltöltött `api/index.php` vagy `index.html` fájlt. Az új `assets/` állományok kerüljenek fel az új `index.html` előtt. A média-, tankönyv- és `.well-known` könyvtárak maradjanak meg.
3. A csomagellenőrző most kötelezően ellenőrzi `api/admin.php`, `api/tutor-sources.php`, `api/tutor-text-generation.php`, `api/knowledge.php`, `api/vendor/autoload.php` és a többi API-modul meglétét, valamint az `index.html` által hivatkozott `/assets/*.js` és `/assets/*.css` fájlokat. Ez a **csomag teljességét** ellenőrzi; az éles könyvtár kézi feltöltésének helyességét külön kell ellenőrizni.
4. Biztonság: a `htdocs/` vagy `htdocs/.../api/` könyvtárban hagyott `archive.zip` vagy más biztonságimentés-archívum **nyilvánosan letölthető lehet**. Miután ellenőrzött, privát másolat készült, helyezzük át a webgyökéren kívülre; ne tároljuk szerverkonfigurációval együtt publikus helyen. A ZIP-re történő közvetlen HTTP-hozzáférést is tesztelni kell.
5. Próba: `auth/status` a DB kapcsolatot ellenőrzi; bejelentkezett adminnál `admin/users`, `admin/invitations`, `admin/sources`, `admin/source-coverage` mind `200`; eredménymentés `GET` → `PUT` **64 hexadecimális revisionnel** → `200` → oldalfrissítés utáni visszatöltés; minden lépésben őrizzük meg a meglévő tanulói naplót.
6. Az adminforrásleltár két külön indexrendszerből származhat: `server-knowledge.ts` statikus `source-inventory.json` és a PHP `knowledge.php` tényleges élő betöltése (plusz külön telepített, engedélyezett források). A 104/3806 és 75/2840 számkülönbség **nem bizonyít automatikusan elveszett dokumentumot**. Az új admin nézet forráscsoportonként különbözteti meg őket és jelzi, ha az élő jelentés helyett csak statikus van.
7. Kiértékeléskor ne oszd meg a cookie-, session-, jelszó- vagy tokenadatokat. Éles jogosultsági, meghívó/e-mail, két fizikai eszközös szinkron, szakmai és szerzői jogi jóváhagyás továbbra is szükséges a végleges terjesztés előtt.

## 2026-11-08 – Személyes adatok exportálása és fiók végleges törlése

A fejlesztési ág új fiókfunkciói (az éles CloudPanelre csak a teljes kiadási próba után telepítsük):

- **Saját adatok exportálása:** Profil → **Saját adataim exportálása (JSON)**. Bejelentkezett felhasználó `GET /api/index.php?route=auth/export-data` útvonalon kizárólag a **saját** alap-profiladatait, tanulási naplóját, időbélyegeit kapja. E-mail/jelszó, jelszólenyomat, munkamenet-cookie és meghívótoken **nincs az exportban**. Ez személyes adatokat tartalmazó fájl: a felhasználó biztonságosan tárolja.
- **Hallgató/oktató fiók törlése:** Profil → **Fiók törlése**. A gomb nem jelenik meg adminnak. A művelethez a jelenlegi jelszó, az `FIÓKOM TÖRLÉSE` szöveg pontos begépelése, a mentetlen adatokra figyelmeztetés és külön, visszavonható megerősítő párbeszéd kell. A végleges `POST /api/index.php?route=auth/delete-account` tranzakció törli a saját `zm_users` rekordot, a hozzá kapcsolódó `zm_progress`, `zm_sessions` és `zm_account_tokens` sorok a külső kulcsok `ON DELETE CASCADE` szabályával eltűnnek. A személyes e-mailt őrző `zm_invitations` rekordok külön törlődnek. Másik felhasználó adata nem változhat.
- **Adminvédelem:** a meglévő adminfiók önkiszolgáló törlése szerveroldali `403`; adminfiók megszüntetése csak külön, felügyelt intézményi adatkezelési eljárással történhet, nehogy a webhely admin nélkül maradjon.
- **Böngésző:** sikeres törlés után az adott fiók `kodaly_pending_progress_<azonosító>` offline mentését is eltávolítja. A többi felhasználó és a korábbi **vendég** böngészőadatait nem töröljük automatikusan. Más böngészőben tárolt offline pillanatképek fizikailag külön vannak, azokat a felhasználó ott tudja törölni.
- **A törlés határai:** a CloudPanel, a MySQL/SQL és az üzemeltető által korábban készített biztonsági mentéseket, szerver-/e-mail-naplókat a fióktörlő API **nem** tudja utólag módosítani. A GDPR szerinti megőrzési és törlési szabályokat, megőrzési időt, helyreállítási helyzeteket és érintetti kérelmek kezelését az adatkezelőnek külön, jóváhagyott szabályzatban kell rögzítenie. Az alkalmazás fióktörlése önmagában **nem** igazolja a teljes GDPR-megfelelést.
- **Tesztelés:** minden új adatkezelési útvonal valós PHP/MySQL-integrációs teszten fut külön admin és hallgató munkamenettel, így a saját fiók szerveroldali adatai és a másik felhasználó sértetlensége ellenőrizhető. A böngészős teszt a tényleges JSON-letöltést, a törlés elutasított jóváhagyását, a sikeres törlési kérést és a helyi, fiókhoz kötött ideiglenes állomány eltávolítását is vizsgálja. A teljes CloudPanel-érintetti próbát **először egy külön, csak tesztre regisztrált fiókkal** kell elvégezni; az éles adminfiókot és a már mentett felhasználói naplókat soha ne használjuk törléses próbára.

## 2026-11-09 – Telepítési önellenőrzés és PHP Tanársegéd forrásbankok

**Adminisztrátori, olvasási célú önellenőrzés:** a `GET /api/index.php?route=auth/deployment-check` végpontot kizárólag bejelentkezett **admin** hívhatja (`403` hallgatónak és oktatónak, `401` vendégnek). Szándékosan az `admin.php` modul betöltése előtt fut, így annak hiányát is ki tudja mutatni. A válasz csak a hiányzó relatív fájlneveket, a webgyökérben talált `*.zip`/`*.sql`/`*.bak`/`*.tar.gz`/`.env` állományok neveit, az SMTP alapkonfigurációjának logikai állapotát és egy ellenőrzési időbélyeget tartalmaz; **nem ad vissza abszolút szerverútvonalat, jelszót vagy felhasználói adatot**. Az ADMIN felületen külön állapotjelentés mutatja a problémákat.

**Korlát:** az önellenőrzés csak az ismert PHP-modulok, `index.html`, `source-inventory.json` és az abban hivatkozott JavaScript/CSS-belépési állományok helyi jelenlétét vizsgálja. Nem helyettesíti a valós felhasználói regisztrációt, SMTP-kézbesítést, adatbázis-visszaállítást, képállományok ellenőrzését vagy a 24 pontos elfogadási folyamatot. Ha a `tutor-search.php` még az API betöltése előtt hiányzik, maga az API is hibát adhat; ilyen esetben a szerver hibalogját kell ellenőrizni.

**Biztonsági mentések:** a jelentésben szereplő publikus archívumokat csak az ellenőrzött, **webgyökéren kívüli** biztonsági másolat után mozgassuk ki; a felület nem töröl. A GitHub kiadási ellenőrzője most a ZIP mellett SQL-mentést, TAR.GZ-t, BAK-t és `.env` állományt sem enged a publikus telepítőbe.

**A-07/A-08 tananyaglefedettség:** a PHP tudásindex-exporter a 09. fejezet 1793 címszava, módszertani és történeti fejezetei mellett most a weboldal saját **Szókártyák, Teszt, Párosító, Hangzó hangsor és akkord, Hangkészletek és pentaton példák, Kvintkör** bankjait is felveszi. Az új telepítőmunka külön megszámolja e hat kategória élő exportbejegyzéseit, és bármelyik hiánya esetén leáll. Az élő PHP és a statikus index szövegrészszáma ettől még jogosan eltérhet a források darabolása és egyéb dokumentumok miatt; a konkrét eltérések a telepítés utáni adminjelentésben vizsgálandók.

A funkciók kizárólag a fejlesztési ágon szerepelnek; az éles CloudPanelre még **nem** telepítettük őket.
