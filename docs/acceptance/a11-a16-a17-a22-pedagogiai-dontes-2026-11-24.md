# Zeneelméleti Műhely 1.0 – A-11/A-16/A-17/A-22 pedagógiai értékelési döntés

**Javaslat, nem jóváhagyás – 2026-11-24.**  
**Fejlesztési ág:** `fix/audit-p0-search-release-quiz-20261107`.

## A jelenlegi rendszer tényleges működése

A `src/components/ProgressDashboard.tsx` és `src/progress.ts` alapján:
- **XP:** a tanulói gyakorlási aktivitás pontszáma; a hallásfejlesztés napi részértéke legfeljebb 100 XP. A rendszer nem rendelkezik vizsga-azonosságot, felügyeletet és csalásbiztos eseménynaplót igazoló modullal.
- **Kvízpontszám:** a kérdéssor helyes válaszainak százaléka; a profil a témánkénti **legjobb** eredményt is megőrzi. A kvízpróbálkozásokból legfeljebb az utolsó 100 szerepel a részletes naplóban.
- **Hibás kérdések:** a korábbi téves válaszok ismétlési célú listája, nem szankció.
- **Trend:** az utolsó három és az azokat megelőző három gyakorlókör átlagának összehasonlítása; hat próbálkozás alatt nincs iránymutató trend. Ez a viszonyítás tájékoztató, eltérő kérdéssorokkal, nem hitelesített mérés.
- **Tanulmányozottság:** a felhasználó saját fejezet-/alfejezetjelölése; nem bizonyítja önmagában az ismeret elsajátítását vagy a sikeres vizsgát.
- **Offline szinkron:** a felhasználói haladás ütközésvédett adatmegőrzése nem tesz egy korábban helyi eszközön keletkezett pontszámot vizsgajeggyé.

## Jóváhagyásra előterjesztett 1.0 szabály

| Terület | Javasolt értelmezés | Védőkorlát |
|---|---|---|
| A-11 | XP kizárólag **motivációs gyakorlási pont** | Nem osztályzat, nem rangsor, nem hivatalos tanúsítvány |
| A-16 | Szinkronizált XP, kedvencek, teljesítések **tanulási aktivitási napló** | Nincs visszamenőleges hitelesítési vagy tanári értékelési állítás |
| A-17 | Kvíz százalék, legjobb eredmény, hibakérdéslista **önellenőrzés** | Legjobb pontszámból nem következik igazolt tudásszint |
| A-22 | Három-három kvízátlag és trend **gyakorlási visszajelzés** | Nincs automatikus megfelelt/nem felelt meg döntés, félévi jegy vagy oklevél |

**A kódban elvégzett egyértelműsítés:** a profil most közvetlenül jelzi, hogy az XP és a kvízeredmény nem hivatalos osztályzat vagy vizsgaeredmény; az eddigi megjelenített számértékek és a mentett adatok változatlanok maradnak. A kérdésbank, a szinkronizáció és az eredményszámítás algoritmusa nem módosult.

## Kötelező döntés a kiadási kapuhoz

**Döntési kérdés:** a projektgazda/oktatásszakmai felelős elfogadja-e, hogy az **1.0-s verzióban minden XP, kvízeredmény, teljesítés és trend kizárólag önellenőrzési, gyakorlási és motivációs visszajelzés**, amelynek nincs hivatalos osztályzati, vizsgáztatási vagy tanúsítási következménye?

- `ELFOGADOM`: a fenti pedagógiai értelmezés tulajdonosi döntésként rögzíthető dátummal és tesztelt verzióval; az A-11/A-16/A-17/A-22 formális státuszát **külön**, az összes többi feltétel ellenőrzése után lehet módosítani.
- `MÓDOSÍTÁST KÉREK`: először az értékelési policy és szükség esetén a megfelelő kód/teszt pontosítása, utána új technikai és szakmai ellenőrzés.

A jelen dokumentum létrehozása **nem tulajdonosi elfogadás és nem formális PASS**. A `docs/acceptance/acceptance-1.0.csv` sorait változatlanul kell hagyni, amíg a döntés, a végleges kiadási SHA és a nem titkos bizonyítékazonosító ténylegesen nincs meg.
