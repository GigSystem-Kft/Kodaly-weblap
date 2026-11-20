# Zeneelméleti Műhely 1.0 – korábban elvégzett tulajdonosi tesztek összesítője

> **Tájékoztató, nem formális PASS.** A projektgazda ChatGPT-ben jelentett eredményeit rögzíti; nem helyettesíti az A-01–A-24 elfogadási napló tételenkénti lektorát, pontos vizsgálati dátumát, telepített Git SHA-ját és bizalmas bizonyítékazonosítóját. Az ismételt teszteket csak valóban hiányzó eseteknél kérjük.

## Tulajdonosi visszajelzések – meglévő ellenőrzések

| Terület | Tulajdonos által jelentett eredmény | További formális igazolás |
|---|---|---|
| Tananyag és zenei példák | Alapfunkciók működnek, emberi ellenőrzések sikeresek | A-20 hangzó/kottás szakmai minták; tételes bizonyíték |
| Kreatív zenei nevelés | Sikeres emberi ellenőrzés | Verzióhoz kötött bizonyíték |
| Szókártyák | 5/5 jelzett sikeres | Verzióhoz kötött bizonyíték |
| Játék és teszt | 4/4 jelzett sikeres, eredménymentéssel | A-06/A-21 célzott 409 adatütközés, adatmegőrzés |
| AI-tanársegéd – korábbi 503-as válaszok | Javított éles csomaggal 4/4 kérdésre megfelelő választ jelzett a projektgazda | A-20 zenei lektor és hosszabb mintakészlet |
| Mobil hozzáférhetőség | 5/5 jelzett sikeres | A-23 SHA, dátum, bizonyíték |
| Billentyűzet | 5/5 jelzett sikeres | A-23 SHA, dátum, bizonyíték |
| Képernyőolvasó | 5/5 jelzett sikeres | A-23 SHA, dátum, bizonyíték |
| Hallgatói fiók | 5/5 jelzett sikeres | A-21 szerepkör- és SMTP-bizonyíték |
| Tanári/admin fiók | 5/5 jelzett sikeres | A-21 szerepkör- és SMTP-bizonyíték |
| Két valódi eszköz | Az eredmény telefonon megjelent, kijelentkezés és visszalépés rendben | 409 konfliktusos eset és tesztazonosság |
| A-15 jogállás | Jogkategóriák és 5/5 jognyilvántartási előellenőrzés „Rendben” tulajdonosi válasszal | Tételes állomány/licenc/index-jogellenőrzés |
| Mentés | A projektgazda szerint webfájl, adatbázis és privát konfiguráció mentve | Visszaállítás tényleges és igazolt próbája, offsite-evidencia |
| A-24 nyilvános fájlátvizsgálás | **BLOCKED**: `.cache` nem bejárható. `zenefpt:zeneelmeletadmin`, mód `0700`; CloudPanel terminál `zeneelmeletadmin` számára Permission denied. A mappa törlés után visszajön. | Rendszergazdai diagnózis, teljes scan, `ready=true` és verzióbizonyíték |

## 2026-11-20 technikai állapot

- A `f1888971edeff472354f039863d22833fa54fa05` SHA-n a PHP ZIP, Chromium füstteszt és Linux build sikeres.
- A második, projektgazda által kiválasztott logó a fejlécbe beépítve, később 20%-kal nagyítva, ezen SHA-hoz tartozó Chromium-teszttel.
- A #2 PR Draft, az emberi elfogadási kapu blokkolt. A `main` nem módosult.
- **Az `acceptance-1.0.csv` státuszait a bizonyítékok hiányában nem változtattuk meg.**

## Következő célzott elfogadási munkák

1. A rendszergazda rendezze a megújuló, nyilvános `.cache` könyvtár eredetét vagy hozzáférését; helyi adatok törlése és `0777` nem megengedett kerülőút.
2. A-20 szakmai lektorálás – rövid, ellenőrizhető hangnem, ütemmutató, hangsor, intervallum, ismeretlen AI-fogalom minták.
3. A-06/A-21 eszközkonfliktus megőrzésének célzott tesztje, csak eldobható tesztfiókkal.
4. A-15 és A-24 tételes, bizalmas bizonyítékainak összekötése nem titkos azonosítókkal a kiadási naplóban.

*Forrás: a projektgazda jelen projektbeli visszajelzései és a GitHub technikai ellenőrzések; nem önállóan végzett szerveroldali tanúsítás.*
