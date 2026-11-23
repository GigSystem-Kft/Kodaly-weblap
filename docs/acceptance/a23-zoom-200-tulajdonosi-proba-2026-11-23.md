# A-23 – 200%-os böngészőnagyítás: projektgazdai éles részpróba

**Bejelentés napja:** 2026-11-23.  
**Tesztelő szerepe:** projektgazda (valós felhasználói visszajelzés).  
**Eredmény:** **PASS – kizárólag a 200%-os nagyítás részpróbájára.**

## A projektgazda által igazolt működés

A projektgazda az alábbi üzenetet küldte a 2026-11-23-i elfogadási teszt felhívására:

> A Zeneelméleti Műhely 200%-os nagyítási próbája sikeres: a menü, tananyag, szókártyák, teszt és Tanársegéd használható. Folytasd az elfogadást.

Ez alapján **200%-os nagyítás mellett az öt felsorolt felület használhatónak bizonyult**. A kiválasztott böngésző, operációs rendszer, a hálózati napló és a teszt során telepített teljes 40 karakteres Git SHA **nem került külön megadásra**, ezért ezeket nem következtetjük ki a fejlesztési ág állapotából. A korábban megerősített éles telepítés azonosítója `644914afdfae460765f3b82671bb10294426b73d` volt, de a fenti új próba ehhez a SHA-hoz nincs függetlenül hozzárendelve.

## A-23 elfogadási helyzet

- **Igazolt részpróba:** 200%-os nagyítás, a menü, tananyag, szókártyák, teszt és Tanársegéd használata.
- **Korábban projektgazdai sikeresnek jelentett részpróbák:** mobil, billentyűzet, képernyőolvasó (lásd `owner-reported-test-summary-2026-11-20.md`).
- **Hátralévő, nem igazolt A-23 rész:** az elfogadási naplóban a tesztelt build SHA-jának és nem titkos bizonyítékazonosítójának egyeztetése; csak ténylegesen támogatott, különböző színtémák esetén azok ellenőrzése.

**Döntés:** az új 200%-os zoom részpróba elfogadott; **a teljes A-23 még NEM PASS**, a 24 pontos kiadási kaput nem lehet ezen egyetlen eredménnyel teljesültnek jelölni.

**Bizonyíték helye:** projektbeszélgetés, 2026-11-23; jelen nem titkos összesítő. Jelszó, tanulói adat, konfiguráció nem került a dokumentumba.

## 2026-11-23 – kontraszt és billentyűzetes fókusz (projektgazdai részpróba)

A projektgazda az éles Zeneelméleti Műhely megtekintése után külön visszaigazolta: **„A Zeneelméleti Műhely A-23 kontrasztpróbája rendben: a szókártyák, teszt, Tanársegéd feliratai, gombjai és billentyűzetes fókusza jól láthatók.”**

**Eredmény: PASS a felsorolt felületek kontraszt- és fókuszlátványának kézi részpróbájára.** A vizsgálat nem számszerű WCAG-kontrasztarány-mérés, és a sötét/világos témák külön tesztjét nem igazolja. A konkrét telepített SHA a visszajelzésben nem szerepelt; ebből a teljes A-23 kapu automatikus PASS-ára következtetni nem lehet.

**Nyitott:** a buildhez rendelt formális jóváhagyás, az esetleg támogatott témák külön vizsgálata, továbbá a teljes A-01–A-24 kiadási napló.
