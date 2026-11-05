# Zeneelméleti Műhely – adminmodul (V004)

A meglévő, működő PHP + Rackhost SMTP telepítés bővítése, az adatbázis újrakezdése nélkül.

## Biztonságos telepítési sorrend

1. **Készíts friss SQL-mentést** a CloudPanel phpMyAdmin felületén a `zeneelmelet` adatbázisról. Ezután importáld **egyszer** a `database/V004__admin_role.sql` migrációt. Nem törli vagy módosítja a tanulási naplókat, a meglévő szerepkörök megmaradnak.
2. A GitHub Actions legújabb sikeres `Zeneelméleti Műhely – PHP telepítő ZIP` artifactját bontsd ki. A tartalmát **közvetlenül** a `/home/zeneelmeletadmin/htdocs/zeneelmelet.digitaliskottatar.hu/` webgyökérbe töltsd (a `.well-known` mappát őrizd meg). Fontos: `api/index.php` **és** `api/admin.php` is felkerüljön.
3. A **saját, már e-mailben megerősített** fiókodat ellenőrizd phpMyAdmin → `zm_users` tábla, majd az `SQL` fülön állítsd be az **első admin** szerepkört az alábbi paranccsal. Az e-mailt a saját fiókod pontos címére cseréld:

   ```sql
   UPDATE zm_users
   SET role = 'admin'
   WHERE email = 'A_SAJAT_EMAIL_CIMED'
     AND email_verified_at IS NOT NULL
     AND role = 'student';
   ```

   **Csak egy ellenőrzött, saját fiókra futtasd.** A parancs a már meglévő fiókot emeli adminná, nem készít új fiókot, és nem változtatja meg annak jelszavát vagy tanulási eredményeit. A visszajelzésben 1 módosult sor legyen; 0 esetén ne ismételd gondolkodás nélkül, előbb vizsgáld meg a felhasználói sort.
4. Frissítsd a weboldalt a böngészőben; ha be voltál jelentkezve, jelentkezz ki és be ismét. A fejlécben megjelenik az **Admin** menüpont.
5. Admin → **Új hallgató meghívása**: add meg a címzett e-mail-címét. Az alkalmazás titkos meghívókódot generál, az adatbázisban csak a hash marad, a teljes meghívókódot **közvetlenül a címzettnek küldi ki** a már működő Rackhost SMTP-vel. A kód 7 napig érvényes, egyszer használható és a címzett e-mail-címéhez kötött.
6. A meghívók listájában függőben lévő meghívó visszavonható; a felhasználók listájában a hallgató–oktató szerepkör módosítható. **Adminszerepkör nem osztható ki a webfelületen**, és adminfiók nem fokozható le onnan.

## Biztonsági korlátok és következő feladatok

- A szerver minden admin API-nál önállóan ellenőrzi a bejelentkezést és az `admin` szerepkört; a fejléc menüpontjának elrejtése nem biztonsági védelmi mechanizmus.
- A szerepkörváltozás kizárólag `student` / `teacher` között engedélyezett, más adminfiókot sem lehet ezzel módosítani.
- A jelenlegi adminmodul az első **100** felhasználót/meghívót jeleníti meg, kereséssel. Több intézményes használathoz lapozás, naplózás, többadminos szerepkörkiosztási protokoll, tanári csoportok és részletes adatkezelési szabályok szükségesek.
- A meghívók küldéséhez a korábban ellenőrzött `smtp.rackhost.hu:465` kapcsolaton `mail_enabled=true` kell.
- A szerverbeállítások és jelszavak továbbra is a `htdocs`-on **kívüli** privát konfigurációban maradnak. A GitHub csomag és a telepítés nem tartalmazhat titkokat.

## Gyors ellenőrzés

- Adminfiókkal: **Admin** fül látható, a lista betöltődik.
- Hallgatói fiókkal: Admin fül nincs, közvetlen `/api/index.php?route=admin/users` kérés 403-at ad.
- Meghívó: a címzett megkapja a levelet, a kód egy alkalommal használható; a meghívó visszavonása után nem használható.
- Az eredeti hallgatói adatok, eredménymentés és fiókhelyreállítás továbbra is működik.
