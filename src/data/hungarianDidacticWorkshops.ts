/**
 * A 6. és 8. tananyagrész saját megfogalmazású, magyar nyelvű didaktikai
 * kiegészítése. Ezek nem a hivatkozott művek szó szerinti részletei.
 * Magyar módszertani támpontok:
 * Szirányi Borbála (2021) – felhasználó által biztosított tanári kézikönyv;
 * Kelemen Judit (2019) – Ének-zene tantárgy-pedagógia;
 * NKP Ének-zene 1–2. tanítói kézikönyv és Kodály HUB magyar tudásközpont.
 */
export type HungarianWorkshop={
 id:string; aims:string[]; explanation:string[]; differentiation:string[];
 evidence:string[]; questions:{prompt:string;answer:string}[];
 sources:{label:string;url:string}[];
};
const kodaly='https://kodalyhub.hu/tanaroknak/zenei-tavoktatas';
const nkp='https://www.nkp.hu/api/media/file/5613c98675d9c07ccd556dc9e0d1cd26e6ed8bcf';
const kelemen='https://publikacio.uni-eszterhazy.hu/5286/';
export const CREATIVE_WORKSHOPS:HungarianWorkshop[]=[
 {id:'merojaras',aims:['Folyamatos belső lüktetés fenntartása irányváltás közben.','A dal ritmusának és a mérőnek a megkülönböztetése.'],
  explanation:['A közös járás csak akkor fejleszt mérőérzéket, ha a tanulók az egyenletes lüktetést követik, nem minden énekelt hangra lépnek. Először egy egyszerű ismert dal éneklésével állapítsuk meg a kényelmes járás tempóját. A lépések közé beillesztett rövid megállásnál is őrizzék meg a belső pulzust.','A tanári bemutatás után fokozatosan kerüljön a döntés a gyermekekhez: mikor térjenek vissza a helyben járáshoz, és mikor változtassanak irányt? Az eredményességet nem a látványos mozgás, hanem az éneklés és az állandó mérő együttese mutatja.'],
  differentiation:['Kezdők helyben, ülve vagy egy kézzel is jelezhetik a mérőt.','Biztos tanulóknál váratlan, de biztonságos mozgásirány-váltással lehet nehezíteni.'],
  evidence:['A gyermek a dallam szünetében is tartja a lüktetést.','Az irányváltás után egy ütemen belül visszatalál a közös mérőhöz.'],
  questions:[{prompt:'Mitől különbözik a mérőjárás az énekelt ritmus minden hangjára adott lépéstől?',answer:'A mérőjárás az alaplüktetést tartja, miközben a dallamban ennél hosszabb, rövidebb hangok vagy szünetek is lehetnek.'}],
  sources:[{label:'Szirányi Borbála (2021), tanári kézikönyv – mérőérzék fejlesztése',url:kodaly},{label:'Kodály HUB – magyar nyelvű módszertani gyűjtemény',url:kodaly}]},
 {id:'szinkopalabda',aims:['A szinkópa helyének hallási felismerése.','A mozgásos válasz időzítésének tudatosítása.'],
  explanation:['A játékot nem szabad rögtön gyors labdaadogatással kezdeni. Először a tanulók énekeljék tisztán az ismert dalt, majd tapssal emeljék ki az adott szinkópás motívumot. A labda átadása csak ezt követően kapcsolódjon a hangzó jelenséghez.','Az értékelés első szempontja az, hogy a tanuló hallás után felismeri-e a ritmusképlet helyét; a kézügyesség és a dobás pontossága másodlagos. A feladatot mozdulatutánzással is helyettesíthetjük, ha a labdás tevékenység elvonná a figyelmet.'],
  differentiation:['Bizonytalan résztvevő puha tárgy emelésével, tényleges átadás nélkül is jelezheti a ritmust.','Haladóknál két eltérő szinkópás motívumhoz két különböző mozdulat rendelhető.'],
  evidence:['A helyes mozdulat a szinkópa kezdetekor jelenik meg.','A gyermek egy másik ismert dalban is felismeri ugyanazt a képletet.'],
  questions:[{prompt:'Miért nem tekinthető a sikeres labdaátadás önmagában a szinkópa megtanulásának?',answer:'Mert lehet a társat utánozni hallási felismerés nélkül; külön önálló ritmusazonosítás is kell.'}],
  sources:[{label:'Szirányi Borbála (2021), szinkópás mozgásos játék',url:kodaly},{label:'NKP – Ének-zene 1–2., tanítói kézikönyv',url:nkp}]},
 {id:'tobbszolam',aims:['Önálló szólamtartás egyszerű kísérettel.','A közös hangzáshoz alkalmazkodó éneklés fejlesztése.'],
  explanation:['A többszólamúságot egyszerű, biztos dallammal és kis terhelésű kísérőszólammal érdemes előkészíteni. Előbb minden csoport ismerje az összes szólam feladatát. Az osztinátó lehet egy rövid ritmus vagy visszatérő hangpár, amely könnyebben megjegyezhető, mint egy hosszú új dallam.','A szólamcsere megmutatja, hogy a gyermek csak követi-e a csoportot, vagy önállóan is tájékozódik a zenei folyamatban. Az ellenőrzés közös éneklés közben történjen, ne kizárólag szerepléshelyzetben.'],
  differentiation:['Kezdő csoport kapjon egyszerű mérőt vagy egyhangú bordunt.','Haladóknak rövid ritmikai osztinátó vagy kánonkezdet javasolható.'],
  evidence:['A csoport saját szólamát a másik csoport megszólalása mellett is tartja.','A szerepek felcserélése után mindkét csoport önállóan teljesíti a feladatot.'],
  questions:[{prompt:'Miért érdemes a szólamokat felcserélni a gyakorlat során?',answer:'Mert így látható, hogy a tanulók mindkét zenei feladatot megértették-e, és nem pusztán egy vezérszólamot utánoznak.'}],
  sources:[{label:'Kodály HUB – többszólamú éneklés',url:'https://kodalyhub.hu/tanaroknak/modszertani-segedanyagok/tobbszolamusag-az-iskolaban/tobbszolamu-enekles-fejlesztese-13-14-evesek'},{label:'Szirányi Borbála (2021), mozgásos énekes-játékok',url:kodaly}]},
 {id:'iranyitott-zenehallgatas',aims:['Egyetlen meghatározott zenei jelenség figyelése.','Megfigyelés alátámasztása konkrét hangzó eseménnyel.'],
  explanation:['Első hallgatáskor a zenemű egészének befogadását engedjük meg, a másodiknál adjunk egyetlen célzott kérdést: mikor tér vissza a téma, változik a hangerő, vagy jelenik meg új hangszín? A rövid, ismételt részlet alkalmasabb kezdőknek, mint egy összetett mű teljes szerkezeti elemzése.','A követő mozgás nem helyettesíti a zenehallgatást, hanem annak látható visszajelzése. A tanulóknak a mozdulat után szóban is meg kell nevezniük, milyen hangzó jelenséget követtek.'],
  differentiation:['Kezdők kézjellel csak egyetlen visszatérő hangszínt mutassanak.','Haladók készíthetnek egyszerű A–B–A formai térképet vagy indokolhatják megfigyelésüket.'],
  evidence:['A jelzés a hallható zenei váltáshoz igazodik.','A tanuló meg tudja magyarázni saját megfigyelését.'],
  questions:[{prompt:'Miért célszerű egyetlen megfigyelési kérdéssel kezdeni a zenehallgatást?',answer:'Mert a figyelmi terhelés így kezelhetőbb, és a gyermek világosan ellenőrizhető hangzó jelenséget keres.'}],
  sources:[{label:'NKP – Ének-zene 1–2., tanítói kézikönyv',url:nkp},{label:'Kodály HUB – zenehallgatási módszertan',url:kodaly}]}
];
export const PEDAGOGY_WORKSHOPS:HungarianWorkshop[]=[
 {id:'daltanitas',aims:['Megindokolja a hallás utáni vagy jelrendszerről tanítás választását.','Megtervez legalább két differenciált daltanítási lépést.'],
  explanation:['A daltanítási módszer megválasztását nem a tanár megszokása, hanem a dallam hangkészlete, a ritmus nehézsége és a tanulók korábbi hallási tapasztalata dönti el. Az ismert zenei elemre épülő kottaolvasás támogathatja az önállóságot, de a zenei élményhez a dal egészét is meg kell mutatni.','Egy jól működő óravázlat elkülöníti a tanári bemutatást, a célzott megfigyelést, a motívumok gyakorlását és az egész dal önálló megszólaltatását. Az értékelésben a kezdet, a forma és a hangmagasság pontossága külön-külön is vizsgálható.'],
  differentiation:['Kezdők ismétlődő rövid motívumot utánoznak.','Biztos olvasók egy ismert fordulatot önállóan szolmizálnak.'],
  evidence:['A hallgató választott eljárását a dal konkrét nehézségével indokolja.','A mikrotanításban a tanulók önállóan visszaadják a dallam főmotívumát.'],
  questions:[{prompt:'Mikor indokolt hallás után tanítani egy új dalt?',answer:'Ha a dallam hangkészlete vagy ritmikája még nem része a tanulók biztosan olvasott készletének, illetve a teljes hangzó mintának fontos szerepe van.'}],
  sources:[{label:'Kelemen Judit (2019), Ének-zene tantárgy-pedagógia',url:kelemen},{label:'NKP – Ének-zene 1–2., tanítói kézikönyv',url:nkp}]},
 {id:'ritmusfej',aims:['Ritmikai fejlesztőfeladatot tervez az érzékeléstől az alkalmazásig.','Megkülönbözteti a hallási és a mozgáskoordinációs hibát.'],
  explanation:['A ritmikai fejlesztés sorrendje nem a kotta másolásával kezdődik, hanem ismert hangzó anyagon végzett tapasztalatszerzéssel. A dal ritmusának kiemelése, a mérő és a ritmusképlet elkülönítése, majd a jelölés és az önálló visszaolvasás egymást támogató műveletek.','Ritmushunyónál az eltakarás csak akkor segít, ha a tanuló a teljes képletet előbb biztosan hangoztatta. Ritmuskígyónál fontos megállapítani, hogy az új motívum csatlakozása miatt romlik-e a pontosság, vagy már maga az alapkészlet bizonytalan.'],
  differentiation:['Kezdőnél kevesebb ritmusképletet és lassabb mérőt alkalmazzunk.','Haladók ritmikus kérdés–feleletet alkothatnak adott készletből.'],
  evidence:['Új dallamban is azonosítja az ismert ritmusképletet.','Külső segítség nélkül egyenletes mérőre hangoztatja a ritmust.'],
  questions:[{prompt:'Mikor használható eredményesen a ritmushunyó?',answer:'Ha a képlet hangzó és vizuális alakja már ismert, így az eltakarás belső hallási és emlékezeti munkát vált ki.'}],
  sources:[{label:'Kelemen Judit (2019), ritmikai készségfejlesztés',url:kelemen},{label:'Kodály HUB – magyar módszertani anyagok',url:kodaly}]},
 {id:'zenehallgatas',aims:['Egy megfigyelési szempontot tudatosan kiválaszt a hallgatás előtt.','A tanulói választ hangzó bizonyítékhoz köti.'],
  explanation:['A zenehallgatási órarészben a rövid tanári beszéd csak az értelmezést segítse, ne helyettesítse a zenei tapasztalatot. A konkrét megfigyelési kérdés előre tisztázza, mire kell figyelni, és a következő meghallgatás lehetőséget ad a válasz ellenőrzésére.','A hallgatás eredményét életkorhoz illő eszközzel tehetjük láthatóvá: kézjel, rajzolt forma, rövid szóbeli leírás vagy mozgás. Az értékelés ne a hangulatjelzők sokaságát díjazza, hanem a pontos hallási megfigyelést.'],
  differentiation:['Kezdők két kontrasztos hangszínt különböztetnek meg.','Haladók visszatérő témát és formai tagolást jelölnek.'],
  evidence:['Helyesen jelzi a kiválasztott hangzó eseményt.','Elmondja, mi alapján döntött a jelzés időpontjáról.'],
  questions:[{prompt:'Miért nem elég pusztán zeneszerzői életrajzot elmondani a zenehallgatási órarészben?',answer:'Mert a célzott zenei befogadás a mű konkrét hangzó jelenségeinek megfigyelésével fejlődik.'}],
  sources:[{label:'Kelemen Judit (2019), zenehallgatás módszertana',url:kelemen},{label:'NKP – Ének-zene 1–2., tanítói kézikönyv',url:nkp}]},
 {id:'tervezes',aims:['Óravázlatot készít konkrét tevékenységekkel és ellenőrzési ponttal.','A differenciálást a tanulók előzetes tudásához igazítja.'],
  explanation:['Az óravázlat pedagógiai célja nem a tevékenységek minél hosszabb felsorolása, hanem az új zenei felismerés feltételeinek megtervezése. A választott dalanyag és a tanulói tevékenység minden esetben visszavezethető legyen egy világos fejlesztési célra.','Az óratervnek az is része, hogyan változtat a tanító, ha a csoport nem tudja még biztosan az alapképletet. A mikrotanításban ezért érdemes előre készíteni könnyített és nehezített változatot, valamint egy gyors, megfigyelhető értékelési szempontot.'],
  differentiation:['Kezdő tanulóknak rövid minta és több visszhang szükséges.','Előrehaladott tanulók önálló variációt vagy kíséretet készítenek.'],
  evidence:['Az óraterv minden lépéshez tanulói cselekvést és célt rendel.','A hallgató meg tudja indokolni a differenciált feladat kiválasztását.'],
  questions:[{prompt:'Mitől több egy óravázlat egyszerű feladatsornál?',answer:'Mert a fejlesztési célhoz kapcsolja a zenei anyagot, a tanulói tevékenységet, az előzetes tudást, a differenciálást és az ellenőrzést.'}],
  sources:[{label:'Kelemen Judit (2019), óratervezés',url:kelemen},{label:'Kodály HUB – magyar módszertani segédanyagok',url:kodaly}]}
];
