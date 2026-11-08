# Zenei-történeti forráslinkek célzott ellenőrzése – 2026. november 7.

## Ellenőrzési szabály

A link csak olyan állítást támaszthat alá, ami ténylegesen szerepel a céloldalon. Gyűjtőoldal nem nevezhető közvetlenül egy bizonyos kézirat megtekintési oldalának; lejárt médiatári felvétel nem reklámozható elérhető videóként. Külső médiát a weboldal nem másol és nem archivál automatikusan.

| Forrás | 2026-11-07 eredmény | Weboldalbeli intézkedés |
| --- | --- | --- |
| [OSZK Zeneműtár](https://oszk.hu/zenemuvek) | Élő, magyar nyelvű intézményi ismertető | Megtartva |
| [OSZK katalógusok](https://oszk.hu/oszk_katalogusok) | Élő gyűjtőoldal; kereshető Hangtárhoz vezető szolgáltatásokkal | Hangtár-gyűjtőoldalként pontosítva |
| [OSZK zenei virtuális kiállítások](https://oszk.hu/category/virtualis-kiallitasok/zene) | Élő lista, külön **Mozart K. 331** és **Erkel Ferenc** kiállítás-leírással | Közvetlen kéziratlink helyett gyűjtőoldalként azonosítva; a látogató a konkrét kiállításra lép tovább |
| [MédiaKlikk: Legyen a zene mindenkié, 2. rész](https://mediaklikk.hu/retro/video/2026/07/15/retro/legyen-a-zene-mindenkie-2-resz-a-kodalyi-zenepedagogia-eszkozei/) | A forrás szerint **2026. október 13-ig** volt elérhető; a 2026. november 7-i közvetlen lekérés 404-et adott | Kikerült a hallgatók számára ajánlott élő videók közül |
| [LFZE: Kodály mindenkié!](https://lfze.hu/videok/kodaly-mindenkie-119270) | Élő, magyar nyelvű egyetemi dokumentumfilm-bemutató | A lejárt médiatári felvétel helyettesítése ezzel a pontosan megnevezett magyar forrással |
| [Wikimedia Commons: Gregorian chant.gif](https://commons.wikimedia.org/wiki/File:Gregorian_chant.gif) | Élő fájloldal, forrásadatokkal | A külső fájloldal és licencmegjegyzés megtartva |

**Korlát:** ez nem teljes szerzői jogi audit és nem igazolja az összes YouTube-videó későbbi elérhetőségét. Az egyedi Commons-licenceket, a magyar tankönyvoldalak felhasználási engedélyét és a szolgáltatói beágyazási feltételeket külön is ellenőrizni kell.

Az alapul szolgáló linkek az `src/data/musicHistorySupplement.ts` fájlban vannak; a stabil URL-ek meglétét `scripts/test-media-source-metadata.ts` regressziós teszt őrzi.

## Kiegészítő képfájlellenőrzés – 2026. november 8.

Az `src/data/musicHistorySupplement.ts` állomány **nyolc** történeti vizuális Commons-állományának konkrét fájllapját ellenőriztük. A fájloldal élő elérése és feltüntetett licenc nem jelenti egyben az adott kép minden országra kiterjedő, független jogi szakvéleményét.

| Kép | Forrásoldal és forrás szerinti jogállás | Oktatási oldalon tett intézkedés |
| --- | --- | --- |
| Aquincumi víziorgona | [Hidraulis Aquincum1.JPG](https://commons.wikimedia.org/wiki/File:Hidraulis_Aquincum1.JPG) – Kaboldy, 2009, CC BY-SA 3.0 Unported | Szerző és közvetlen CC licencfeltétel közölve; kép változatlanul külső Commons-forrásból |
| Palestrina | [Retrato de Palestrina.jpg](https://commons.wikimedia.org/wiki/File:Retrato_de_Palestrina.jpg) – ismeretlen szerző, 16. századi portré, Commons PD-old licencjelzés | Közkincsnek jelölt műként hivatkozva; pontos szerzőiség nem feltételezett |
| J. S. Bach | [Johann Sebastian Bach.jpg](https://commons.wikimedia.org/wiki/File:Johann_Sebastian_Bach.jpg) – Elias Gottlob Haussmann, 1748, Commons PD-art | A forrásoldal azonosított szerzőjét és eredeti festménydátumát megtartottuk |
| Mozart | [Mozart.jpeg](https://commons.wikimedia.org/wiki/File:Mozart.jpeg) – Barbara Krafft, 1819, Commons PD-art | A képhez kötődő név és korszak egyezik |
| Liszt | [Franz Listz.jpg](https://commons.wikimedia.org/wiki/File:Franz_Listz.jpg) – 1885-ben publikált portré, ismeretlen szerző, Commons PD-old | Közkincsnyilatkozat a forrásoldalon, pontos fotós nem állítható |
| Bartók | Régi: [Bartók Béla.jpg](https://commons.wikimedia.org/wiki/File:Bart%C3%B3k_B%C3%A9la.jpg) – Commons-fájllap 1982-es könyvre és felhasználói PD-self állításra hivatkozott; új: [Bartók Béla 1927.jpg](https://commons.wikimedia.org/wiki/File:Bart%C3%B3k_B%C3%A9la_1927.jpg) – 1927, ismeretlen szerző, EU anonim műre és amerikai lejárt védelmi időre hivatkozó Commons közkincsnyilatkozat | A bizonytalan eredeti fénykép-újrafelhasználási hátterű könyvszkennelt portrét lecseréltük a dokumentált 1927-es fotóra |
| Gregorián kottapélda | [Gregorian chant.gif](https://commons.wikimedia.org/wiki/File:Gregorian_chant.gif) – Commons szerinti anonimitás/korai publikáció miatti PD; a fájllap 1979-es Graduale Romanum közvetítésre is hivatkozik | A forrásoldal nyitott, de a származtatott kiadásra vonatkozó jogi kérdést külön értékelni kell |
| Limoges-i tónárium | [Troparium... BNF Latin 1118](https://commons.wikimedia.org/wiki/File:Troparium_et_prosarium_Sancti_Martialis_Lemovicensis_BNF_Latin_1118_fo_104.jpg) – 990–1010 körüli kézirat, BnF Gallica, Commons PD-art | A pontos műfaj **tónárium**, zsoltáréneklési zenei hangnemek; a képen Dávid király ábrázolása is felismerhető |

**Fenntartások:** a Commons oldalain található licencjelzések külső állítások, nem helyettesítik a tankönyv-PDF-ek felhasználási engedélyét és a 1979-es kiadásból származtatott gregorián kottakép jogainak tisztázását. A feltöltött tankönyvek és egyetemi források külön ellenőrzési tételek maradnak.
