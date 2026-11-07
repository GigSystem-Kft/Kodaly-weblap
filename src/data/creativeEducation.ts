import { EXTENDED_CREATIVE_PRACTICES } from './creativeEducationExtended';
/**
 * Saját megfogalmazású módszertani útmutatók a felhasználó által adott kézikönyv alapján.
 * Forrás: Szirányi Borbála (2021), Kreatív énekes-játékok ritmikus mozgással,
 * Aktív zenetanulás énekléssel és mozgással – 1. modell. ISBN 978-615-6316-09-7.
 * A könyv teljes szövege és képei nem kerülnek a nyilvános alkalmazásba.
 * Az oldalszámok a könyv nyomtatott oldalszámozására vonatkoznak.
 */
export const CREATIVE_SOURCE = {
  author: 'Szirányi Borbála',
  year: 2021,
  title: 'Kreatív énekes-játékok ritmikus mozgással',
  series: 'Aktív zenetanulás énekléssel és mozgással – 1. modell, tanári kézikönyv',
  isbn: '978-615-6316-09-7',
  note: 'A módszertani összefoglalók és feladatvázlatok saját megfogalmazású feldolgozások; a könyv teljes szövegét nem tesszük közzé.'
};

export interface CreativePractice {
  id: string;
  title: string;
  theme: string;
  age: string;
  grouping: string;
  duration: string;
  page: string;
  goal: string;
  materials: string;
  steps: string[];
  observation: string;
  extension: string;
}

export const CREATIVE_PRACTICES: CreativePractice[] = [
  {
    id: 'merojaras', title: 'Éneklés és lüktetés térben', theme: 'Mérőérzék',
    age: 'Kisiskolások', grouping: 'Egyéni / osztály', duration: '5–8 perc', page: '31–32.',
    goal: 'Az egyenletes mérő tartása és mozgással való megélése.',
    materials: 'Ismert, biztosan énekelt dal; szabad mozgástér.',
    steps: [
      'Énekeljétek a jól ismert dalt közösen, és érzékeltessétek a lüktetést helyben, egyszerű mozdulattal.',
      'A mozdulatot fokozatosan alakítsátok át lépéssé; a lépések a mérővel együtt haladjanak.',
      'Próbáljatok ki új útvonalakat: kör, csigavonal, irányváltás. Az éneklés és a lüktetés maradjon egyenletes.'
    ],
    observation: 'Megmarad-e az állandó lüktetés mozgásirány-váltáskor is?',
    extension: 'Ugyanazt a dalt karakterének megfelelően eltérő járásmóddal is próbáljátok.'
  },
  {
    id: 'metrum', title: 'Érezd az ütem súlyát!', theme: 'Metrumérzék',
    age: 'Kisiskolások', grouping: 'Csoport', duration: '5–10 perc', page: '32–35.',
    goal: 'A hangsúlyos és hangsúlytalan ütemrészek testi tapasztalatként való felismerése.',
    materials: 'Ismert, világos ütemű énekes dal.',
    steps: [
      'Éneklés közben először minden mérőütésre azonos kis mozdulatot végezzetek.',
      'Az ütem első, súlyos részéhez rendeljetek egy eltérő, nagyobb mozdulatot.',
      'Váltogassátok a mozgást és az éneklést, majd próbáljátok a súlyos részt önállóan megtalálni.'
    ],
    observation: 'A tanuló a dallam megállítása nélkül felismeri-e az új ütem kezdetét?',
    extension: 'Hasonlítsatok össze két- és háromnegyedes lüktetésű részleteket.'
  },
  {
    id: 'dallamforma', title: 'Mozdulattal jelölt dallamrészek', theme: 'Formaérzék',
    age: 'Kisiskolások', grouping: 'Páros / csoport', duration: '8–12 perc', page: '36–39.',
    goal: 'A motívumok ismétlődésének és az eltérő dallamsoroknak a felismerése.',
    materials: 'Rövid, ismert dal jól elkülönülő motívumokkal.',
    steps: [
      'A dal két különböző motívumához közösen válasszatok két könnyen kivitelezhető mozdulatot.',
      'Éneklés közben ugyanazt a motívumot mindig ugyanazzal a mozdulattal jelezzétek.',
      'A tanári mintát hagyjátok el, és figyeljétek meg, hogy a csoport önállóan felismeri-e az ismétléseket.'
    ],
    observation: 'Azonos mozdulattal reagálnak-e a visszatérő zenei anyagra?',
    extension: 'Kérjétek meg a tanulókat egy új motívum saját mozdulatának kitalálására.'
  },
  {
    id: 'szunetszobor', title: 'Mozdulj csak a szünetben!', theme: 'Ritmusképletek',
    age: 'Kisiskolások', grouping: 'Egyéni / csoport', duration: '5–8 perc', page: '7.',
    goal: 'A szünet helyének tudatos hallása és a belső időtartás.',
    materials: 'Olyan ismert dal, amelyben jól hallható szünet szerepel.',
    steps: [
      'Énekeljétek el a dalt, és külön figyeljétek meg a szüneteket.',
      'A szünet ideje alatt mindenki új szoborpózt vesz fel.',
      'A következő szünetig a póz mozdulatlan marad, miközben az éneklés folytatódik.'
    ],
    observation: 'Pontosan csak a szünet alatt történik-e a mozdulatváltás?',
    extension: 'A tanulók egymás mozdulatait figyelve is ellenőrizhetik a ritmikai pontosságot.'
  },
  {
    id: 'szinkopalabda', title: 'Labdagurítás szinkópára', theme: 'Ritmusképletek',
    age: 'Kisiskolások', grouping: 'Körben ülő csoport', duration: '8–10 perc', page: '10.',
    goal: 'A szinkópa előzetes felismerése és a ritmusképlet helyének tudatosítása.',
    materials: 'Puha labda; a szinkópát tartalmazó, megtanult dal.',
    steps: [
      'Üljetek körbe, és ismételjétek át a dal szinkópás motívumát.',
      'A labdát kizárólag a szinkópa megszólalásakor lehet egy társ felé gurítani.',
      'Ismételjétek meg a játékot úgy, hogy a címzett és az irány is változhat.'
    ],
    observation: 'Előre készülnek-e a tanulók a szinkópa belépésére?',
    extension: 'Kísérjétek ugyanezt a ritmusképletet egyszerű testritmussal.'
  },
  {
    id: 'testritmus', title: 'Ritmus a testünkön', theme: 'Testritmus',
    age: 'Kisiskolások', grouping: 'Egyéni / csoport', duration: '8–12 perc', page: '45–53.',
    goal: 'A ritmusértékek megélése többféle érintő és ütő mozdulattal.',
    materials: 'Rövid ritmusminta vagy ismert dal.',
    steps: [
      'Válasszatok néhány következetesen használt mozdulatot: taps, csettintés, combérintés vagy dobbantás.',
      'Éneklés közben először rövid részleteken, tanári mintával végezzétek a mozdulatokat.',
      'Ha biztos a mozdulatsor, alkalmazzátok utóritmizálásnál vagy ritmusvisszhangnál.'
    ],
    observation: 'Minden mozdulat időben kapcsolódik-e a megfelelő ritmusértékhez?',
    extension: 'Két csoport váltva adhat ritmusvisszhangot.'
  },
  {
    id: 'dallamtest', title: 'Dallamjárás a testünkön', theme: 'Dallami relációk',
    age: 'Kisiskolások', grouping: 'Egyéni / páros', duration: '8–12 perc', page: '6–8., 56–58.',
    goal: 'A hangmagasságok, lépések és ugrások testi észlelése.',
    materials: 'Jól megtanult, rövid szolmizációs dallam.',
    steps: [
      'Az ismert dallam mélyebb és magasabb hangjaihoz rendeljétek különböző magasságú testérintések helyét.',
      'Énekeljétek a dallamot a hangmagasságot követő mozdulatokkal.',
      'Vizsgáljátok meg, hol lép a dallam szomszédos hangra, és hol ugrik nagyobb hangközt.'
    ],
    observation: 'A tanuló a mozdulatból és az éneklésből is felismeri-e a dallam irányát?',
    extension: 'Párok egymás dallammozdulatait követve is gyakorolhatnak.'
  },
  {
    id: 'tobbszolam', title: 'Éneklés egymásra figyelve', theme: 'Többszólamúság',
    age: 'Fokozatosan bevezetve', grouping: 'Két csoport', duration: '8–12 perc', page: '59–64.',
    goal: 'Az önálló szólamtartás és a másik szólam egyidejű hallgatásának fejlesztése.',
    materials: 'Két biztosan megtanult, egyszerű, összekapcsolható énekes szólam.',
    steps: [
      'Mindkét csoport külön-külön gyakorolja saját dallamát.',
      'A csoportok egy időben énekelnek; egyszerű, eltérő mozdulat segíti a saját szólam megtartását.',
      'Cseréljetek szólamot, és beszéljétek meg, mikor volt nehéz megtartani a saját dallamot.'
    ],
    observation: 'Megmarad-e a dallam önállósága a másik csoport éneklése mellett?',
    extension: 'A mozdulat elhagyásával is próbáljátok meg a két szólamot.'
  },
  {
    id: 'iranyitott-zenehallgatas', title: 'Zenehallgatásból mozgás', theme: 'Irányított zenehallgatás',
    age: 'Kisiskolások', grouping: 'Egyéni / csoport', duration: '10–15 perc', page: '65–69.',
    goal: 'A zenei kifejezés és a forma tudatos hallgatása egyszerű mozgással.',
    materials: 'Rövid, életkornak megfelelő zenei részlet; szabad mozgástér.',
    steps: [
      'Elsőként hallgassátok meg a részletet csendben, mozgás nélkül.',
      'Beszéljétek meg, milyen karaktert, hangulatot vagy zenei változást figyeltek meg.',
      'A második meghallgatásnál egyszerű, a megfigyelt zenei jelenséget követő mozgást alkalmazzatok.'
    ],
    observation: 'A mozgás valóban a hallható zenei változásokat követi-e?',
    extension: 'Két különböző megfigyelési szempont szerint is meghallgathatjátok ugyanazt a zenét.'
  },
  ...EXTENDED_CREATIVE_PRACTICES
];

export const CREATIVE_THEMES = [...new Set(CREATIVE_PRACTICES.map(practice => practice.theme))];
