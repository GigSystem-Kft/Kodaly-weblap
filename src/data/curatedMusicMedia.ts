/**
 * Kurátori szemléltetőanyag-katalógus. A címek és pedagógiai megjegyzések
 * magyar nyelvű, önálló szerkesztések. Külső alkotást nem másolunk be a ZIP-be.
 * A Wikimedia Commons képeknél a fájloldal tartalmazza a szerzőt/licencet.
 * A videóhivatkozás valódi magyar nyelvű oktatási oldalra/videótárra vezet;
 * ahol szükséges, jelezzük a regisztrációt.
 */
export interface CuratedMedia {
 id:string; chapters:number[]; title:string; note:string; kind:'kep'|'video'|'hanganyag';
 url:string; imageUrl?:string; embedUrl?:string; license?:string; access?:string;
}
const commons='https://commons.wikimedia.org/wiki/File:';
const fileImage=(name:string)=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(name);
const signs=[
 ['do','dó','A relatív dó kézjele a dallam alaphangjának hallási elképzelését segítheti.'],
 ['re','ré','A ré kézjelét a dó–ré kapcsolat megfigyeléséhez használhatjuk.'],
 ['mi','mi','A mi és fá közötti félhang hallási és mozgásos összehasonlítása.'],
 ['fa','fá','A fá helyzetét a mi–fá félhang kapcsolatában vizsgáljuk.'],
 ['sol','szó','A dó–szó tiszta kvint és a szó–mi nagy terc bemutatása.'],
 ['la','lá','A lá hang szerepének felismerése és a relatív moll kiindulása.'],
 ['ti','ti','A ti–dó vezetőhangos irány felismerése kézjellel.']
] as const;
export const CURATED_MEDIA:CuratedMedia[]=[
 ...signs.map(([file,title,note])=>({
   id:'kezjel-'+file,chapters:[3,6,8],title:'Szolmizációs kézjel: '+title,note,
   kind:'kep' as const,url:commons+'Solfege_hand_sign_'+file+'.jpg',
   imageUrl:fileImage('Solfege hand sign '+file+'.jpg'),license:'CC0 – Freya Jarman, Wikimedia Commons'
 })),
 {
  id:'guido-keze',chapters:[3,4,7,8],title:'A középkori Guido-kéz',
  note:'A történeti szolmizáció ut–re–mi–fa–sol–la hangjait szemléltető kéziratos forrás. Hexachordhoz különösen ajánlott.',
  kind:'kep',url:commons+'The_Hand_of_Guido.jpg',imageUrl:fileImage('The Hand of Guido.jpg'),
  license:'Közkincs – középkori kézirat 1274-ből, Wikimedia Commons'
 },
 {
  id:'gregorian',chapters:[2,7,8],title:'Gregorián négyvonalas kottaírás',
  note:'A középkori négyvonalas kottarendszer és a négyzetes hangjegyírás összevetése a modern ötvonallal.',
  kind:'kep',url:commons+'Notaci%C3%B3_gregoriana_quadrada.jpg',
  imageUrl:fileImage('Notació gregoriana quadrada.jpg'),license:'CC BY-SA 3.0 – Carlets, Wikimedia Commons'
 },
 {
  id:'beethoven-kezirat',chapters:[5,7],title:'Beethoven V. szimfóniájának kézirata',
  note:'Tanulmányozható a zeneszerzői kottakép, a hangszerelés és az előadói jelzések kéziratos megjelenése.',
  kind:'kep',url:commons+'BeethovenSinfonia5autografo.jpg',
  imageUrl:fileImage('BeethovenSinfonia5autografo.jpg'),license:'Közkincs – Ludwig van Beethoven kézirata, Wikimedia Commons'
 },
 {
  id:'kvintkor-cc0',chapters:[5],title:'Kvintkör – külső szemléltető ábra',
  note:'Fontos: az ábra angolszász hangneveket használhat; a magyar H/B hangneveket a tananyag szövegében ellenőrizd.',
  kind:'kep',url:commons+'Circle_of_5ths_(fifths).svg',
  imageUrl:fileImage('Circle of 5ths (fifths).svg'),license:'CC0 – TYalaA, Wikimedia Commons'
 },
 {
  id:'kep-furulya-german',chapters:[2,3,8],title:'Germán fogású szopránfurulya ujjrendtáblázata',
  note:'Szopránfurulya fogástáblázat, C hangról indulva. A magyar tananyagban mindig ellenőrizd a germán és barokk fogásrendszer különbségét.',
  kind:'kep',url:'https://folkfluteworld.com/free_fingering_charts/free_fingering_charts.html'
 },
 {
  id:'video-kodaly-liszt',chapters:[7],title:'Liszt Ferenc munkássága – magyar vonatkozások',
  note:'Kovács Tamásné magyar nyelvű zenetörténeti bemutatója, a kecskeméti Kodály Iskola nyilvános, iskolai videójegyzékéből. Figyeld meg a Liszt-életmű magyar kapcsolatait.',
  kind:'video',url:'https://youtu.be/czHwpBARY90',
  embedUrl:'https://www.youtube-nocookie.com/embed/czHwpBARY90',
  access:'Az ágyazott lejátszás a videó tulajdonosának beállításaitól függ'
 },
 {
  id:'video-ritmus-gs',chapters:[1,6],title:'A zene alapjai: ritmus és lüktetés',
  note:'Jónás Tamás magyar nyelvű videós magyarázata a metrumokról, ritmusértékekről és triolákról. A videó a hivatkozott magyar cikkbe van beágyazva.',
  kind:'video',url:'https://gsfanatic.com/hu/gs-article/a-zene-alapjai-ritmus-es-luktetes'
 },
 {
  id:'video-paratlan',chapters:[1,6],title:'Ritmusérzék fejlesztése páratlan ütemekkel',
  note:'Jónás Tamás gyakorlati magyar videója; ütemszámolás, 7/4-es ritmusgyakorlatok. A feladatok a forrásoldalon, beágyazott videóval érhetők el.',
  kind:'video',url:'https://gsfanatic.com/hu/gs-article/igy-fejleszd-a-ritmuserzeked---paratlan-utemmutatoval'
 },
 {
  id:'video-zeneelmelet-zenecsoda',chapters:[3,4,5,8],title:'Zeneelméleti videók – relatív hangok, hangközök, akkordok',
  note:'Magyar magyarázatok és tényleges videólejátszók egy forrásoldalon. A lejátszás sütibeállításhoz kötött lehet.',
  kind:'video',url:'https://zenecsoda.jimdoweb.com/zeneelm%C3%A9let/',
  access:'A videókat a forrásoldal a látogató hozzájárulása után tölti be'
 },
 {
  id:'video-aktiv-ritmus',chapters:[1,6,8],title:'Ritmikus énekes-játékok – magyar kutatási videótár',
  note:'Tanórai bemutatók és szöveges feladatleírások a Szirányi–Barabás multimédia példatárban.',
  kind:'video',url:'https://aktivzenetanulas.hu/',access:'Az egyes videók regisztrációhoz kötöttek lehetnek'
 },
 {
  id:'video-aktiv-mozgas',chapters:[3,4,6,8],title:'Aktív zenetanulás – mozgásos és dallami gyakorlatok',
  note:'Tanári megfigyeléshez javasolt: melyik mozdulat segíti a dallami vagy ritmikai felismerést?',
  kind:'video',url:'https://aktivzenetanulas.hu/',access:'Az egyes videók regisztrációhoz kötöttek lehetnek'
 },
 {
  id:'video-aktiv-tobbszolam',chapters:[6,8],title:'Aktív zenetanulás – többszólamú és társas gyakorlatok',
  note:'Készségterületek, évfolyamok és játékok szerint kereshető pedagógiai példatár.',
  kind:'video',url:'https://aktivzenetanulas.hu/',access:'Az egyes videók regisztrációhoz kötöttek lehetnek'
 },
 {
  id:'video-mta',chapters:[6,8],title:'Zeneakadémia – az Aktív zenetanulás kutatás videós eredményei',
  note:'Hivatalos magyar nyelvű bemutató és hivatkozások a módszertani videótárhoz.',
  kind:'video',url:'https://kodaly.hu/kodaly_mta-lfze/a-kutatas-zaro-produktumai-122204'
 },
 {
  id:'video-presto',chapters:[3,6,8],title:'Kodály HUB – távoktatási videók, animációk',
  note:'Egyes anyagok magyarul elérhetők, mások angol nyelvűek; csak a magyar részeket javasoljuk a hallgatóknak.',
  kind:'video',url:'https://kodalyhub.hu/tanaroknak/zenei-tavoktatas',access:'Vegyes nyelvű gyűjtemény; a magyar tartalmat válaszd'
 },
 {
  id:'video-zenelek',chapters:[2,3,8],title:'Magyar énekoktatási videók – hangközök és hangképzés',
  note:'A magyar nyelvű videós képzés tananyagjegyzéke; az elérhető leckéket a szolgáltató határozza meg.',
  kind:'video',url:'https://zenelek.hu/enek/tananyag/fejezetek',
  access:'Bizonyos leckékhez hozzáférési feltétel tartozhat'
 },
 {
  id:'video-hangtechnika',chapters:[1,2,3,5],title:'Zeneelméleti multimédiás leckék – hangköz, kottaírás, hangolás',
  note:'Magyar nyelvű leckeoldal, videókkal és hangmagassági példákkal.',
  kind:'video',url:'https://learningage.szgyn.hu/hangtechnikusi_alapismeretek'
 },
 {
  id:'keptar-hangkoz',chapters:[3],title:'Hangközök és kottaképek – magyar magyarázatos ábrák',
  note:'Külső, magyar nyelvű zeneelméleti képtár és hangközök leírása. Az ábrák az eredeti oldalon tekinthetők meg.',
  kind:'kep',url:'https://www.zeneora.hu/cikkek/zeneelmelet/hangkozok.html'
 },
 {
  id:'keptar-guido',chapters:[4,7,8],title:'Guido-kéz és hexachord-táblázatok magyar zenetörténeti tanulmányban',
  note:'A Guido-kéz történeti és a hexachordok modern kottás bemutatása a forrásoldalon.',
  kind:'kep',url:'https://zemplenimuzsa.hu/latoter/kelemen-judit-matyas-korabeli-zenei-neveles-sarospatakon-a-szalkai-kodex-tukreben/'
 }
];
