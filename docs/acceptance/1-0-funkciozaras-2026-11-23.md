# Zeneelméleti Műhely 1.0 – funkciózárás és lezárási nyilvántartás

**Döntés:** 2026-11-23, projektgazda: „A meglévő rendszert zárjuk le”.

**Hatály:** az 1.0 funkcióköre BEFAGYASZTVA; **a kiadási elfogadás NEM teljesült**. Ez a dokumentum nem változtatja meg automatikusan az `acceptance-1.0.csv` státuszait.

## Az 1.0 változatlan funkcióköre

Kilenc magyar tananyagegység, interaktív zeneelméleti és hallásgyakorlatok, szókártyák, játék/kvíz, haladási profil, meghívásos hallgató/tanár/admin fiókok, PHP/MySQL-es tárolás és helyi forrásalapú Tanársegéd. Nyilvános önregisztráció és külső generatív AI alapértelmezetten nem része a kiadásnak.

**Változtatási szabály:** kizárólag P0/P1 biztonsági, adatvédelmi, adatmegőrzési, jogi, akadálymentességi, telepítési vagy zenei szakmai hibajavítás, továbbá kizárólag teszt, bizonyíték, dokumentáció és reproducibilis kiadási javítás végezhető. Új tartalom, UI-bővítés és extra funkció: 1.1 backlog. Minden tényleges kódváltozás után az aktuális SHA-n újra kell futtatni a kötelező teszteket.

## Már jelentett pozitív emberi próbák (nem formális PASS)

- Kreatív zenei nevelés, szókártyák, játék, teszt és eredménymentés: projektgazdai visszajelzés szerint rendben.
- Telefon–számítógép eredményszinkron, kijelentkezés és újrabelépés: projektgazdai visszajelzés szerint rendben.
- Mobil, billentyűzet, képernyőolvasó: a projektgazda korábban megfelelőnek jelezte.
- Tanársegéd: a tiszta/szűkített kvint és a háromféle a-moll két konkrét éles regressziója PASS a `644914afdfae460765f3b82671bb10294426b73d` telepítésen.

Ezeket **ne futtassuk újra indokolatlanul**. Kiadási beszámításukhoz a jelzett tesztkörülményeket és telepített SHA-t szükség szerint hitelesítsük; a hiányzó eseteket célzottan futtassuk.

## Kiadást blokkoló kapuk

| Kapu | Minimális végső bizonyíték | Státusz 2026-11-23 |
|---|---|---|
| A-15 felhasználási jog | Tételes nyilvántartás a csomagban közzétett anyagokhoz; minden jogosultság igazolt vagy a problémás anyag kivéve | BLOCKED |
| A-20 szakmai helyesség | Független zenei lektori mintavétel a kottaképekből, hallásból, ritmusból, kvízből, fogalomtárból és Tanársegédből; azonosított verzió | BLOCKED |
| A-24 telepítés és adatmegőrzés | Offsite mentés + elkülönített visszaállítás; CloudPanel admin `scanComplete/buildConsistent/ready` ellenőrzés, sértetlen csomag/SHA, nem publikált konfiguráció | BLOCKED |
| A-06/A-21 | Két valódi eszközön célzott 409 konfliktusos összevezetés; szerepkörök, meghívó, SMTP és visszaállítás | Igazolás hiányzik |
| A-23 | Korábbi pozitív emberi próbák verzióhoz és bizonyítékhoz kötése; maradék 200%-os nagyítás/kontraszt ellenőrzése | Igazolás hiányzik |
| A-01–A-24 többi pont | Teljes, nem titkos ellenőrzési napló kitöltése, tesztelő és dátum megadásával | Nincs formálisan lezárva |

Források: `docs/acceptance/acceptance-1.0.csv`, `docs/acceptance/owner-reported-test-summary-2026-11-20.md`, `docs/acceptance/a20-tanarseged-regresszio-2026-11-23.md`, `docs/acceptance/a24-cloudpanel-proba-jegyzokonyv.md`.

## Utolsó végrehajtási sorrend

1. Revíziót rögzíteni, a fejlesztési ágat kódszinten befagyasztani; a korábbi bizonyítékokat összerendezni.
2. A-15 jogi tételjegyzéket és A-20 független zenei lektori mintát lezárni; hiba esetén kizárólag célzott javítás.
3. A-24 éles telepítés, mentés-visszaállítás, privát könyvtárak és SHA-azonosság vizsgálata **adatvesztés nélkül**.
4. A-06/A-21 konfliktus, SMTP és szerepkör; A-23 hiányzó emberi esetek; minden A-01–A-24 ponthoz verzió és bizonyíték.
5. Az aktuális commiton `npm test`, Chromium, Linux, PHP/MySQL/ZIP és 1.0 elfogadási workflow teljes zöld ellenőrzése.
6. Csak minden kötelező kapu PASS után PR #2 draftból review-ra, jóváhagyás után merge a védett `main` ágba, egyező SHA-jú végleges ZIP és kontrollált telepítés.

**STOP:** hiányzó tételes jogi bizonyíték, visszaállítási próba, szakmai lektori PASS, környezeti azonosító vagy bármely kötelező negatív teszt esetén nincs `main` merge és nincs végleges letöltési link.

**Megjegyzés:** A funkciózárás sikeres projektvezetési döntés, nem éles kiadási vagy 24 pontos elfogadási igazolás.
