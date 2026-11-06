/** Saját megfogalmazású tanulmányi életrajzok és irányított műelemzések.
 * A kapcsolt források tájékozódási pontok, nem átvett szócikkek.
 * A műhallgatások a kapcsolódó korszak YouTube-ajánlóit használják.
 */
export interface ComposerBiography {
  id: string;
  periodId: string;
  name: string;
  dates: string;
  significance: string;
  keywords: string[];
  works: string[];
  sourceUrl: string;
}
export interface GuidedListening {
  id: string;
  periodId: string;
  title: string;
  composer: string;
  concept: string;
  before: string;
  during: string[];
  after: string;
  sampleAnswer: string;
  sourceUrl: string;
}
const wiki = (title: string) => 'https://hu.wikipedia.org/wiki/' + encodeURIComponent(title.replace(/ /g,'_'));
export const COMPOSER_BIOGRAPHIES: ComposerBiography[] = [
  {
    id:'seikilos', periodId:'kezdetek', name:'Szeikilosz',
    dates:'Kr. u. 1–2. század körül (a lelet datálása vitatott)',
    significance:'A Szeikilosz-sírfelirat nem egy szerző részletes életművét, hanem egy ritka, szöveggel és hangjelöléssel fennmaradt ókori dallamot őrzött meg. A modern megszólaltatások rekonstrukciók, ezért előadásonként eltérőek lehetnek.',
    keywords:['ókori görög zene','hangjelölés','rekonstrukció'],
    works:['Szeikilosz sírfeliratának dallama'],
    sourceUrl:wiki('Szeikilosz-sírfelirat')
  },
  {
    id:'hildegard', periodId:'kozepkor', name:'Hildegard von Bingen',
    dates:'1098–1179',
    significance:'Bencés apátnő, író és komponista. Liturgikus énekei a középkori egyszólamú zene személyes, gazdagon formált dallamvilágát mutatják. Művei összefüggnek a korabeli vallási szövegek és közösségi élet szerepével.',
    keywords:['középkor','liturgia','egyszólamúság'],
    works:['Ordo Virtutum','O viridissima virga'],
    sourceUrl:wiki('Hildegard von Bingen')
  },
  {
    id:'palestrina', periodId:'reneszansz', name:'Giovanni Pierluigi da Palestrina',
    dates:'kb. 1525–1594',
    significance:'Az itáliai reneszánsz egyházi vokális polifónia egyik jelentős mestere. Műveiben a szólamok önálló mozgását gyakran áttekinthető szövegkezelés és a hangzás kiegyensúlyozottsága kapcsolja össze.',
    keywords:['reneszánsz','imitáció','kóruspolifónia'],
    works:['Sicut cervus','Missa Papae Marcelli'],
    sourceUrl:wiki('Giovanni Pierluigi da Palestrina')
  },
  {
    id:'bach', periodId:'barokk', name:'Johann Sebastian Bach',
    dates:'1685–1750',
    significance:'Német barokk zeneszerző és orgonista. Kantátáiban, hangszeres műveiben és fúgáiban a harmóniai szerveződés és az ellenpont magas fokú kidolgozottsága figyelhető meg. Az egyházi és világi műfajokban egyaránt alkotott.',
    keywords:['barokk','ellenpont','fúga','kantáta'],
    works:['Brandenburgi versenyek','A fúga művészete','Máté-passió'],
    sourceUrl:wiki('Johann Sebastian Bach')
  },
  {
    id:'mozart', periodId:'klasszika', name:'Wolfgang Amadeus Mozart',
    dates:'1756–1791',
    significance:'A bécsi klasszika meghatározó alkotója, aki operákban, szimfóniákban, versenyművekben és kamarazenében is jelentős életművet hagyott hátra. Műveiben a motívumok világos megformálása és az érzékeny hangszerelés együtt jelenik meg.',
    keywords:['bécsi klasszika','szimfónia','opera','kamarazene'],
    works:['Egy kis éji zene, K. 525','Figaro házassága','g-moll szimfónia, K. 550'],
    sourceUrl:wiki('Wolfgang Amadeus Mozart')
  },
  {
    id:'liszt', periodId:'romantika', name:'Liszt Ferenc',
    dates:'1811–1886',
    significance:'Magyar kötődésű, nemzetközi pályát befutott zongoravirtuóz és zeneszerző. A szimfonikus költemény kialakításában, a tematikus átalakításban és a zongorahangzás új lehetőségeinek feltárásában játszott fontos szerepet.',
    keywords:['romantika','szimfonikus költemény','programzene','zongora'],
    works:['Les Préludes','h-moll szonáta','Magyar rapszódiák'],
    sourceUrl:wiki('Liszt Ferenc')
  },
  {
    id:'bartok', periodId:'huszadik', name:'Bartók Béla',
    dates:'1881–1945',
    significance:'Magyar zeneszerző, zongoraművész és népzenekutató. A helyszíni gyűjtést és az összehasonlító népzenetudomány módszereit művészi alkotómunkájától is elkülönítve kell szemlélni, ugyanakkor a népzenei fordulatok műveiben új ritmikai és harmóniai összefüggésekbe kerültek.',
    keywords:['20. század','népzene','ritmus','modernizmus'],
    works:['Román népi táncok','Concerto zenekarra','Mikrokosmos'],
    sourceUrl:wiki('Bartók Béla')
  }
];
export const GUIDED_LISTENING: GuidedListening[] = [
  {
    id:'seikilos-melodia',periodId:'kezdetek',title:'Szeikilosz dallama – eredeti emlék és előadói rekonstrukció',composer:'Ismeretlen ókori dallam a Szeikilosz-sírfeliraton',
    concept:'Lejegyzés és rekonstrukció',
    before:'Olvasd el, milyen forrásból maradt fenn a dallam. Különítsd el az ókori adatot a mai előadás hangszerelésétől.',
    during:['Melyik hangszer vezeti a dallamot?','Hallható-e kíséret vagy csak egy dallamvonal?','Mit változtat az előadó a hangszíneken vagy tempón?'],
    after:'Miért nem állíthatjuk, hogy egy mai felvétel minden részlete biztosan ókori?',
    sampleAnswer:'A lelet hangjelölése és szövege fennmaradt, de az előadói hangzás több eleme mai döntés.',
    sourceUrl:wiki('Szeikilosz-sírfelirat')
  },
  {
    id:'perotin-szolam',periodId:'kozepkor',title:'Pérotin – Viderunt omnes: a többszólamúság kialakulása',composer:'Pérotin',
    concept:'Organum és hosszú tartott hangok',
    before:'Hallgass meg először egy egyszólamú gregorián éneket, majd a Viderunt omnes részletét.',
    during:['Hány, egymástól elkülöníthető szólamot hallasz?','Hol észlelsz hosszan kitartott hangokat?','Milyen mozgást végeznek a felső szólamok?'],
    after:'Miben tér el ez a hangzás a gregorián egyszólamúságtól?',
    sampleAnswer:'A kitartott alapdallamhoz több, ritmikailag mozgékony felső szólam kapcsolódik.',
    sourceUrl:wiki('Pérotin')
  },
  {
    id:'palestrina-imitacio',periodId:'reneszansz',title:'Palestrina – Sicut cervus: az imitáció hallása',composer:'Giovanni Pierluigi da Palestrina',
    concept:'Vokális polifónia és imitáció',
    before:'Figyeld meg az első dallamfordulatot: a következő belépéskor felismered-e hasonló alakban?',
    during:['Mikor szólal meg új szólam?','Hányszor tér vissza hasonló motívum?','A szólamok egyenrangúnak vagy fődallam-kíséret viszonyúnak hatnak?'],
    after:'Miért beszélünk itt imitációs polifóniáról?',
    sampleAnswer:'A rövid dallamfordulat különböző szólamokban egymást követően megjelenik.',
    sourceUrl:wiki('Giovanni Pierluigi da Palestrina')
  },
  {
    id:'vivaldi-ritornello',periodId:'barokk',title:'Vivaldi – A négy évszak, Tavasz: ritornelló',composer:'Antonio Vivaldi',
    concept:'Szóló–tutti kontraszt és visszatérő zenekari anyag',
    before:'Hallgass meg egy rövid részletet, és különítsd el a teljes zenekart a szólóhegedűtől.',
    during:['Mikor játszik a teljes együttes?','Melyik zenei anyag tér vissza?','Milyen hangzásbeli kontraszt alakul ki a szóló és tutti között?'],
    after:'Miért könnyíti meg a visszatérő zenekari anyag a szerkezet követését?',
    sampleAnswer:'A visszatérő ritornelló felismerhető támpontot ad a szólóepizódok közötti tagoláshoz.',
    sourceUrl:wiki('Antonio Vivaldi')
  },
  {
    id:'beethoven-motivum',periodId:'klasszika',title:'Beethoven – 5. szimfónia, I. tétel: motívumfejlesztés',composer:'Ludwig van Beethoven',
    concept:'Rövid motívumból épített nagyforma',
    before:'Hallgasd meg a híres kezdő ritmust, majd koppintsd le: hogyan váltakoznak a rövid és hosszú hangok?',
    during:['Mikor tér vissza a kezdő ritmikai alak?','Ugyanazon a hangmagasságon hallod-e mindig?','Melyik változat tűnik a legerőteljesebbnek?'],
    after:'Hogyan lehet kevés hangból nagyobb zenei szerkezetet építeni?',
    sampleAnswer:'A kezdő motívum különféle hangmagasságokon, hangszerekkel és dinamikákkal visszatér és továbbfejlődik.',
    sourceUrl:wiki('Ludwig van Beethoven')
  },
  {
    id:'liszt-tema',periodId:'romantika',title:'Liszt – Les Préludes: témák és karakterváltozás',composer:'Liszt Ferenc',
    concept:'Programzene és tematikus átalakítás',
    before:'Keress egy felismerhető témát, majd figyeld meg az eltérő karakterű szakaszokat.',
    during:['Hogyan változik a téma tempója vagy hangszíne?','Mikor lesz ünnepélyes vagy lírai a zene?','Milyen szerepe van a zenekari hangszerelésnek?'],
    after:'Mi különbözteti meg a tematikus átalakítást a téma egyszerű, változatlan megismétlésétől?',
    sampleAnswer:'Az ismert téma hangközei, ritmusa vagy hangszínei új karaktert kapnak, miközben felismerhető kapcsolat marad.',
    sourceUrl:wiki('Les Préludes')
  },
  {
    id:'bartok-tancok',periodId:'huszadik',title:'Bartók – Román népi táncok: karakter és ritmus',composer:'Bartók Béla',
    concept:'Népzenei dallam és műzenei feldolgozás',
    before:'Ismerd meg a sorozat rövid tánctételeit. A figyelmedet a tempókra és az eltérő karakterekre összpontosítsd.',
    during:['Miben különböznek egymástól a tételek ritmusai?','Mely dallamfordulatok tűnnek népzenei eredetűnek?','Hogyan segít a hangszerelés a karakter megformálásában?'],
    after:'Mi a különbség a népzenei gyűjtés és a népzenei ihletésű zeneszerzői feldolgozás között?',
    sampleAnswer:'A gyűjtés egy létező zenei hagyomány rögzítése, a feldolgozás tudatos kompozíciós alakítás.',
    sourceUrl:wiki('Román népi táncok')
  }
];
