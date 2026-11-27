# Zeneelméleti Műhely 1.0 – minimális hátralévő emberi zárópróbák

**Dátum:** 2026-11-23  
**Ág:** `fix/audit-p0-search-release-quiz-20261107`  
**Technikai bázis:** `41302be9c7052ca30d9c5b384458054bbddfab41` – Chromium `45270689275` success, PHP telepítő ZIP `45270689243` success, Linux `45270689282` success.  
**Státusz:** próbautasítás, **nem** PASS-jegyzőkönyv és **nem** végleges release SHA.

A korábban elfogadott **Tanársegéd**-válaszokat (tiszta/szűkített kvint; háromféle a-moll), a meglevő szókártya, játék, alapszinkron, mentés/visszaállítás, HTTPS/.cache vizsgálat és a projektgazda által rendezettnek nyilvánított jogokat **nem kérjük újra tesztelni**. Az A-15 jogi dokumentumok meglévő nem titkos bizonyítékazonosítóit később a naplóhoz kell kapcsolni.

## A-14/A-20 – hangzó, kottás, kvízes lektor (emberi meghallgatás)

A [zenei tudásellenőrző automatikus teszt](../../scripts/test-a20-cross-module-harmony.ts) függetlenül ellenőrzi a 12 megnevezett hangköz félhangszámát, a dúr és háromféle moll intervallumait, hármashangzatokat, a szinkópa/nyújtott/éles/triola hanghosszait és 2/4–6/8 60 BPM időzítését; az egy SHA-n sikeres Chromium workflow ezt futtatta.

A lektornak ezekhez **csak a még hiányzó tényleges hangzó és kottás** próbákat kell végeznie:

| Próba | Kézi művelet | Elvárt |
|---|---|---|
| Hangköz | Fejhallgatón/hangszórón kis szekund, tiszta kvart, tiszta kvint meghallgatása | 1 / 5 / 7 félhang, tisztán felismerhető hangzás |
| Hangsor | Természetes, harmonikus és dallamos a-moll lejátszása | VII.: g/gisz; melodikus felfelé fisz és gisz; hagyományos lefelé f/g |
| Ritmus | Nyújtott, éles, szinkópa, nyolcadtriola | 60 BPM mellett érthető: hosszú–rövid, rövid–hosszú, nyolcad–negyed–nyolcad, 3 egyenlő triolanyolcad egy negyedben |
| Kotta–hang | Egy kiválasztott kottaképet összevetni a megszólalóval | Hangmagasság és ritmus egyezik |
| Kvíz | A kiválasztott témához tartozó legalább két kérdés és válaszkulcs ellenőrzése | Helyes válasz és indoklás összhangban a tananyaggal |

A lektor minden próbáról csak **PASS / FAIL + rövid indok + nem titkos bizonyítékazonosító** adatot rögzítsen. Szakmai hiba esetén **FAIL**, célzott javítás és az érintett tesztek ismétlése.

## A-06/A-21 – két valódi eszköz, kizárólag eldobható tesztfiókkal

A korábban sikeres PC → telefon szinkron után *csak* a konfliktusos eset hiányzik:

1. Azonos tesztfiókban PC és mobil, mindkét eszközön azonos szerveres eredmény.
2. PC-n offline új kedvenc/teljesítés, közben mobilon online **másik** kedvenc/teljesítés.
3. PC visszakapcsolása; nem lehet hamis „minden mentve” állapot, a szerveres újabb revízió nem írható felül.
4. Két eszköz újratöltése és újrabelépése után mindkét eltérő módosításnak meg kell maradnia.
5. A tényleges HTTP **409** választ csak böngésző hálózati naplóból vagy ellenőrzött tesztlogból lehet igazolni; pusztán látható adatmegőrzés nem bizonyít 409-et.

## A-23 – hiányzó kézi akadálymentességi próba

Korábbi mobil/billentyűzet/képernyőolvasó 5/5 eredmények megőrzendők. Csak:
- **200% böngészőnagyítás:** menü, tananyag, szókártyák, kvíz, Tanársegéd elérhető; nincs tartalomvesztés vagy kezelhetetlen vízszintes görgetés.
- **Kontraszt/színmód:** látható fókusz, olvasható gombfeliratok, működő kontraszt a valóban támogatott témákban.

## Éles A-24 és elfogadási kapu

- A projektgazda megerősítette a teljes mentést és a próbavisszaállítást. A `.cache` URL-tiltása 403/403, az oldal gyökere 200; FTP-leltár szerint egyetlen nulla bájtos `motd.legal-displayed` fájl.
- A jelenlegi éles SHA: `644914afdfae460765f3b82671bb10294426b73d`, **nem a fejlesztési jelölt**. A végleges, *egyetlen* kiválasztott SHA kiadásakor ismét az admin `scanComplete`, `buildConsistent`, `ready` és verzióazonosság számít.
- A `docs/acceptance/acceptance-1.0.csv` 24 soros dokumentuma **csak valóban ellenőrzött** soroknál írható PASS-ra (szerepkör, ISO dátum, pontos 40 karakteres SHA, biztonságos bizonyítékazonosító); a CI fail-closed marad.

### Beszámolási minta

`Zene (hangköz/hangsor/ritmus/kotta/kvíz): ... | Két eszköz konfliktus és 409: ... | 200% zoom: ... | Kontraszt: ... | tesztelt SHA: ... | dátum: ...`

Csak akkor szabad PR #2-t `main`-be összevonni, ha az összes 24 sor hitelesen lezárt, a végső SHA ugyanazon három technikai CI-je sikeres, és a jogosultság/backup/SHA ellenőrzés igazolt. **Nincs automatikus vagy fiktív PASS.**
