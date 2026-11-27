# A-06 / A-21 – két eszközös konfliktusos kedvencmentés

**Bejelentés dátuma:** 2026-11-23  
**Tesztelő:** projektgazda  
**Tesztelt felület:** Zeneelméleti Műhely, az elfogadási beszélgetésben leírt számítógép és telefon  
**Visszajelzés:** „A-06 két eszközös konfliktuspróba: mindkét különböző kedvenc megmaradt a szinkronizálás és frissítés után. Folytasd az elfogadást.”

## Eredmény: a felhasználói adatmegőrzési részpróba PASS

A projektgazda a külön eszközökön létrehozott két eltérő kedvenc mentését és szinkronizálását sikeresnek jelezte: **mindkét kedvenc megmaradt frissítés után**. Ez kifejezetten az előző A-06 tesztutasításban kért offline/online versenyhelyzet felhasználói kimenetelére adott megerősítés.

A korábbi külön PC–telefon alap-szinkronvizsgálat is sikeres volt, ezért annak céltalan ismétlése nem szükséges.

## A formális A-06 kapuból hiányzó bizonyíték

- A konkrét HTTP **409** válasz nem látható a projektgazdai visszajelzésből. A konfliktuskezelő JavaScript/PHP/MySQL automatikus próbái ezt kódoldalon vizsgálják, de ezekből **nem** állítható bizonyíték nélkül, hogy a fenti éles kérés is 409 választ kapott.
- A próba során ténylegesen telepített **40 karakteres Git SHA**, böngésző-/eszközazonosító és egy nem titkos hálózati naplóazonosító még nincs rögzítve. A korábban ismert éles `644914afdfae460765f3b82671bb10294426b73d` SHA nem rendelhető automatikusan a mostani próbához.
- A tesztfiók törlésének / egyéb A-21 szerepkör- és SMTP-folyamatoknak ez a részpróba nem bizonyítéka.

**Döntés:** felhasználói adatmegőrzési részpróba **PASS**; A-06 összesített formális státusza a hiányzó élő 409/verzióbizonyítékig **nem teljes PASS**, a 24 pontos kaput nem lehet megkerülni.

**Nem titkos bizonyíték:** a projektgazda 2026-11-23-i beszélgetésbeli közlése; jelen jegyzőkönyv. Jelszót, felhasználói azonosítót vagy privát hálózati naplót nem tárolunk itt.
