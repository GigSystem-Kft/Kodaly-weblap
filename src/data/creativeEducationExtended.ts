import type { CreativePractice } from './creativeEducation';

/**
 * Teacher-friendly original paraphrases based on Szirányi Borbála (2021):
 * Kreatív énekes-játékok ritmikus mozgással.
 * Page numbers refer to the book's printed pagination (PDF page = printed + 1).
 * Suggested timings are teaching estimates, not claims made by the handbook.
 */
export const EXTENDED_CREATIVE_PRACTICES: CreativePractice[] = [
  {
    id: 'kendos-mero', title: 'Lüktetés közös kendővel', theme: 'Mérőérzék',
    age: '1–3. évfolyam', grouping: 'Nagy kör', duration: '6–10 perc', page: '22.',
    goal: 'Az egyenletes mérő közös megélése és a mozdulatok összehangolása.',
    materials: 'Nagy, könnyű, biztonságosan megfogható textilkendő; ismert dal.',
    steps: [
      'A gyerekek körben állva megfogják a kendő szélét, és először biztosan eléneklik a dalt.',
      'Éneklés közben azonos ütemben ringatják a kendőt, a mérő lüktetését követve.',
      'A tanári jelzés után a kendő magasságváltoztatásával a dallam emelkedését és ereszkedését is szemléltethetik.'
    ],
    observation: 'A csoport minden tagja együtt tudja-e tartani a mérőt?',
    extension: 'Próbáljatok egyénileg, a kendő nélkül is ugyanilyen biztos lüktetést.'
  },
  {
    id: 'labdasuly', title: 'Labda az ütemsúlyon', theme: 'Metrumérzék',
    age: '2–4. évfolyam', grouping: 'Nagy kör / páros', duration: '7–10 perc', page: '22., 33.',
    goal: 'A súlyos és súlytalan ütemrészek elkülönítése a testmozgásban.',
    materials: 'Puha labda; jól ismert, egyértelmű metrumú dal.',
    steps: [
      'A tanulók körbe állnak, és az ütemek súlyos helyét együtt beazonosítják.',
      'Az ütemsúlyon egy tanuló a tanárnak dobja a puha labdát, aki a súlytalan ütemrészen továbbadja a következő résztvevőnek.',
      'Ha stabil a játék, próbáljátok megfordítani a súlyos és súlytalan helyhez kapcsolódó labdamozdulatokat.'
    ],
    observation: 'Az ütemsúlyt azonosítják-e az ének folyamatosságának megszakítása nélkül?',
    extension: 'Háromnegyedes metrumban pattintás–elkapás–visszadobás mozgássort próbáljatok.'
  },
  {
    id: 'felkotta-guritas', title: 'Félkotta alatt érkezzen meg!', theme: 'Ritmusképletek',
    age: '2–4. évfolyam', grouping: 'Körben ülő csoport', duration: '6–10 perc', page: '22.',
    goal: 'A félhang időtartamának testi és időbeli érzékeltetése.',
    materials: 'Puha, jól guruló labda; félkottát tartalmazó ismert dal.',
    steps: [
      'Éneklés közben keressétek meg a félkotta ritmikai helyét.',
      'A labdát kizárólag a félkotta ideje alatt szabad egy választott társnak elgurítani.',
      'A gurítást úgy időzítsétek, hogy a labda a félhang időtartamának végére érkezzen meg.'
    ],
    observation: 'A továbbadás megkezdése és a megérkezés a zenei időtartamhoz igazodik-e?',
    extension: 'A gyerekek megfigyelését vezessétek vissza a ritmusképlet tudatos olvasására.'
  },
  {
    id: 'motivumlabda', title: 'Motívumváltó labdaadás', theme: 'Formaérzék',
    age: '1–4. évfolyam', grouping: 'Nagy kör', duration: '7–10 perc', page: '23.',
    goal: 'A zenei motívumkezdetek biztos felismerése.',
    materials: 'Puha labda és rövid, ismert motívumokból építkező dal.',
    steps: [
      'Énekeljétek el a dalt, és közös tapsolással jelöljétek az egyes motívumok kezdetét.',
      'A labdát minden új motívum kezdetén adjátok tovább a szomszédnak.',
      'A gyerekek éneklés mellett önállóan tartják a motívumváltások ritmusát.'
    ],
    observation: 'Nem ütemenként, hanem a dallam valódi motívumhatárain történik-e az átadás?',
    extension: 'Fordítsátok meg a labda haladási irányát.'
  },
  {
    id: 'postassor', title: 'A postás a dallamsor végére érkezik', theme: 'Formaérzék',
    age: '1–4. évfolyam', grouping: 'Kör / tantermi székek mellett', duration: '8–12 perc', page: '23., 27., 37.',
    goal: 'A dallamsor hosszának és lezárásának megtapasztalása.',
    materials: 'Nagy puha labda vagy más könnyű tárgy; ismert dal.',
    steps: [
      'Egy játékos postásként az énekelt dallamsor ideje alatt egy másik résztvevőhöz lépdel.',
      'A küldeményt pontosan a dallamsor végén adja át.',
      'Az új postás a következő dallamsor alatt továbbviszi a tárgyat.'
    ],
    observation: 'A postás mozgása a dallamsor időtartamát követi-e?',
    extension: 'Szűk tanteremben mindenki a saját széke mögött marad, csak a postás mozog.'
  },
  {
    id: 'karmesterforma', title: 'Motívumonként változó karmestermozdulat', theme: 'Formaérzék',
    age: '2–4. évfolyam', grouping: 'Osztály / egyéni vezető', duration: '7–10 perc', page: '36., 39.',
    goal: 'A motívumok és a zenei formaegységek terjedelmének felismerése.',
    materials: 'Egyszerű, ismétlődő motívumú énekelt dal.',
    steps: [
      'A tanár az egyes motívumok alatt eltérő testtájon érzékelteti a mérőt, a gyerekek tükörként követik.',
      'A következő éneklésnél egy tanuló vállalja a karmester szerepét.',
      'A tanulók önállóan készítenek a motívumhatárokat jól láthatóan jelző mozdulatsort.'
    ],
    observation: 'A mozdulatváltás azonos időpontban esik-e a zenei motívumhatárral?',
    extension: 'Hasonlítsátok össze két különböző felépítésű dal formai tagolását.'
  },
  {
    id: 'ritmusketszolam', title: 'Két dal ritmusa egyszerre', theme: 'Többszólamúság',
    age: '3–5. évfolyam', grouping: 'Két csoport / párok', duration: '10–14 perc', page: '60.',
    goal: 'Két önálló ritmusszólam megtartása a társakra figyelve.',
    materials: 'Két biztosan megtanult dal ritmusképe; testritmusmozdulatok.',
    steps: [
      'Először külön-külön olvassátok és hangoztassátok a két ritmussort.',
      'Az osztály egyik fele az első, a másik a második ritmussort szólaltatja meg testritmussal.',
      'Cseréljetek szólamot, majd próbáljátok ki a feladatot egy-egy párossal is.'
    ],
    observation: 'Megmarad-e az egyéni ritmusszólam a másik ritmus mellett?',
    extension: 'Ha biztos a két szólam, fokozatosan váltsatok testritmusról egyszerű tapsra.'
  },
  {
    id: 'osztinato-parban', title: 'Ének és makacs ritmus párban', theme: 'Többszólamúság',
    age: '2–5. évfolyam', grouping: 'Párok / egyéni', duration: '8–12 perc', page: '61.',
    goal: 'Megosztott figyelem és ritmikai önállóság fejlesztése.',
    materials: 'Jól ismert dal, hozzá illő rövid ritmusosztinátó.',
    steps: [
      'A pár egyik tagja énekli a dalt, a másik a rövid osztinátót kíséri testritmussal.',
      'Szerepcsere után keressétek meg, melyik szólam megtartása volt nehezebb.',
      'Haladó változatként egy tanuló önállóan is próbálja egyszerre énekelni a dalt és hangoztatni a ritmust.'
    ],
    observation: 'A kísérőritmus egyenletes marad-e a dallam mellett?',
    extension: 'Próbáljatok rövidebb és hosszabb ismétlődő ritmusmintát.'
  },
  {
    id: 'quodlibet-kor', title: 'Két dallam, két kör', theme: 'Többszólamúság',
    age: '3–5. évfolyam', grouping: 'Két önálló kör', duration: '10–15 perc', page: '63.',
    goal: 'A két ismert dallam egyidejű éneklése és a saját szólam megtartása.',
    materials: 'Két, együtt énekelhető és előzetesen biztosan megtanult dal.',
    steps: [
      'Mindkét csoport külön-külön énekli és egyszerű mozdulatokkal kíséri saját dalát.',
      'Az eltérő mozdulatokat megtartva a két kör egyszerre indítja a dallamokat.',
      'Cseréljetek dalokat és mozdulatokat, majd közösen értékeljétek a tempótartást.'
    ],
    observation: 'Segítik-e a csoport saját mozdulatai a két dallam elkülönítését?',
    extension: 'Könnyű, egyenletes mérőlépést vagy egyszerű tapsot is kipróbálhattok.'
  },
  {
    id: 'zenehallgat-cim', title: 'Adj címet a hallott zenének!', theme: 'Irányított zenehallgatás',
    age: '1–5. évfolyam', grouping: 'Egyéni / közös megbeszélés', duration: '8–12 perc', page: '67.',
    goal: 'A figyelmes, előítéletmentes első meghallgatás és az egyéni zenei asszociáció támogatása.',
    materials: 'Rövid, életkornak megfelelő zeneműrészlet.',
    steps: [
      'A tanulók először mozgás nélkül, csendben végighallgatják a zenei részletet.',
      'Mindenki saját címet, színt vagy elképzelt helyszínt társít a zenéhez.',
      'Hallgassátok meg egymás választásait; ha szükséges, ismételjétek meg a meghallgatást.'
    ],
    observation: 'A gyerekek a saját benyomásukat tudják-e elmondani, mások válaszának minősítése nélkül?',
    extension: 'Másodszor egy tudatos zenei megfigyelési szempontot is kijelölhettek.'
  },
  {
    id: 'dinamika-karmester', title: 'Halk és hangos zene – mozdulatmérettel', theme: 'Irányított zenehallgatás',
    age: '2–5. évfolyam', grouping: 'Osztály / egyéni karmester', duration: '8–12 perc', page: '68.',
    goal: 'A dinamika váltakozásainak hallás utáni felismerése.',
    materials: 'Jól hallható halk és hangos részleteket tartalmazó zenemű.',
    steps: [
      'Az első meghallgatás mozgás nélkül történik; beszéljétek meg a dinamikai változásokat.',
      'Másodszorra a tanulók kis mozdulattal jelzik a halk, nagyobb mozdulattal a hangos részeket.',
      'Egy tanuló karmesterként vezeti a mozdulatokat, a többiek a hallott zenét követik.'
    ],
    observation: 'A dinamikai változásokra reagálnak-e, nem pusztán a karmestert figyelik?',
    extension: 'Hasonlítsátok össze a hirtelen és a fokozatos hangerőváltozásokat.'
  },
  {
    id: 'hangszinek-mozgas', title: 'Hangszínek követése mozgással', theme: 'Irányított zenehallgatás',
    age: '3–5. évfolyam', grouping: 'Párok / osztály', duration: '8–12 perc', page: '68–69.',
    goal: 'A különböző hangszínek és hangszerek megszólalásának felismerése.',
    materials: 'Rövid, jól elkülönülő hangszínekből álló zeneműrészlet.',
    steps: [
      'Első hallgatáskor különítsétek el a visszatérő hangszíneket.',
      'Rendeljetek minden kiválasztott hangszínhez eltérő egyszerű mozdulatot.',
      'Újabb meghallgatásnál mindenki csak akkor végzi a mozdulatát, amikor az adott hangszín hallható.'
    ],
    observation: 'Az adott hangszínre önállóan, pontos időben reagálnak-e?',
    extension: 'Páronként egy-egy hangszín hallgatását és mozgásos jelölését osszátok szét.'
  }
];
