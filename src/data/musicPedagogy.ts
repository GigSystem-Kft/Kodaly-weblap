/**
 * 08. Ének-zene tantárgy-pedagógia
 * Saját megfogalmazású, szakirodalom alapján készített tematikus tananyag.
 * Forrás: Kelemen Judit (2019), Ének-zene tantárgy-pedagógia tanító alapszakos
 * hallgatók számára. Líceum Kiadó, Eger. ISBN 978-615-5621-66-6.
 * A hivatkozott oldalak a könyv nyomtatott oldalszámai (nem a PDF lapindexe).
 * Nem tartalmazza és nem helyettesíti a teljes eredeti könyvet.
 */
export const PEDAGOGY_SOURCE = {
  author:'Kelemen Judit',
  title:'Ének-zene tantárgy-pedagógia tanító alapszakos hallgatók számára',
  year:2019, publisher:'Líceum Kiadó, Eger',
  isbn:'978-615-5621-66-6',
  originalUrl:'https://publikacio.uni-eszterhazy.hu/5286/'
};
export interface PedagogyUnit {
 id:string; title:string; page:string; goal:string;
 concepts:string[]; sections:{heading:string; text:string}[];
 seminar:string[]; reflection:string[];
}
export const PEDAGOGY_UNITS:PedagogyUnit[]=[
 {
  id:'esztetikai',title:'A zenei nevelés helye az esztétikai nevelésben',page:'7–9.',
  goal:'A hallgató értelmezni tudja a zenei élmény, a közös éneklés és a művészeti nevelés kapcsolatát.',
  concepts:['esztétikai nevelés','zenei élmény','énekes játék','közösségi nevelés'],
  sections:[
   {heading:'A zene mint művészeti tapasztalat',text:'A tantárgy tanítása több az ismeretek közlésénél: az élményszerű éneklés, zenehallgatás és mozgás a művészethez való személyes viszony kialakulását segítheti. A gyermekek korábbi zenei és játékos tapasztalatai jelentik az új felismerések természetes kiindulópontját. A pedagógus feladata, hogy a befogadó és az alkotó tevékenység váltakozásával értelmes, biztonságos és közösségi zenei helyzeteket hozzon létre.'},
   {heading:'Éneklés, játék és együttműködés',text:'A kisgyermekek számára az ének és a mozgás összekapcsolása különösen kézenfekvő. Az ismétlődő közös mozdulatok segítenek érzékelni a mérőt, a ritmust és a zenei forma tagolódását. A játék figyelmet, egymásra hangolódást és feladatvállalást is igényel, miközben nem szabad háttérbe szorítani az örömteli részvételt.'},
   {heading:'A pedagógiai döntés',text:'A fogalmi magyarázat lehetőleg a megtapasztalt zenére épüljön, ne előzze meg a hallási élményt. A tanuló akkor tudja későbbi ismereteibe beépíteni a felismerést, ha a tanító az életkorhoz illő dalból, mozdulatból vagy konkrét hangzó jelenségből indul ki.'}
  ],
  seminar:['Válassz ismert gyermekdalt, tervezz hozzá mérőre lépést és szöveghez kapcsolódó mozdulatot.','Írd le, milyen esztétikai, zenei és társas cél érvényesül ugyanabban a játékban.'],
  reflection:['Mikor válik a mozgás céltalan kísérőelemmé?','Hogyan őrizhető meg az éneklés öröme a tudatosítás során?']
 },
 {
  id:'kepesseg',title:'Zenei képességek és készségek összefüggése',page:'10–13.',
  goal:'A hallgató megkülönböztesse az adottság, képesség és automatizálódó készség fogalmát.',
  concepts:['adottság','képesség','készség','relatív hallás','ritmusérzék'],
  sections:[
   {heading:'Fejlődő rendszer',text:'A zenei tevékenység során az észlelési, emlékezeti, mozgásos és gondolkodási tényezők együttesen működnek. A képesség egy feladat megoldásának lehetőségét, a készség pedig bizonyos részműveletek gyakorlással kialakuló biztonságát is jelenti. A kettő nem egymástól független: a jól megválasztott gyakorlat újabb zenei felismerést tesz lehetővé.'},
   {heading:'Ritmikai példa',text:'Egy új szinkópás ritmusképlet először érzékelhető hangzó jelenségként jelenjen meg. Az utánzás, felismerés, összehasonlítás és önálló megszólaltatás ismétlése segítheti a ritmikai készség kialakulását. A feladat ne csupán hibátlan ismétlésre irányuljon, hanem a jelenség felismerésére eltérő dalokban is.'},
   {heading:'Egyéni különbségek',text:'A könyv elkülöníti a veleszületett lehetőségeket a neveléssel és gyakorlással kibontakozó teljesítménytől. A relatív hallás fejlesztésének pedagógiai értéke nagy: az összehasonlító hanghoz viszonyított hangmagassági kapcsolatok megfigyelése tanítható és gyakorolható.'}
  ],
  seminar:['Készíts háromlépcsős szinkópafeladatot: utánzás, felismerés, önálló reprodukció.','Tervezz két különböző nehézségű hallási feladatot ugyanahhoz a dallamhoz.'],
  reflection:['Miért nem azonos a zenei készség a zenei tehetséggel?','Hogyan látható a fejlődés egyetlen foglalkozáson belül?']
 },
 {
  id:'transzfer',title:'A zenetanulás személyiségformáló ereje és transzferhatásai',page:'14–19.',
  goal:'A hallgató kritikusan értelmezze a zenei tevékenység és az általános fejlődés közötti összefüggéseket.',
  concepts:['transzferhatás','motiváció','közösségi együttműködés','kognitív fejlődés'],
  sections:[
   {heading:'A zenei tevékenység tágabb hatásai',text:'A közös éneklés, figyelmes hallgatás és együttműködés az érzelmi, társas és értelmi tevékenységekhez is kapcsolódik. A kötet több korábbi kutatást és kezdeményezést ismertet, közöttük a zenei képzés és a nyelvi, olvasási vagy matematikai teljesítmény lehetséges összefüggéseit.'},
   {heading:'Pedagógiai értelmezés és óvatosság',text:'Fontos különbség van együttjárás és bizonyított ok-okozati hatás között. A könyvben bemutatott eredményeket a vizsgálatok körülményeivel együtt kell mérlegelni. A zenetanítás önálló művészeti értéke akkor is fennáll, ha valamely más tantárgyi eredmény javulása nem igazolható.'},
   {heading:'Befogadás és közösség',text:'A művészeti részvételhez való hozzáférés társadalmi és pedagógiai kérdés is. A MUS-E kezdeményezés bemutatása az elfogadás és a különböző művészeti kifejezési formák közösségépítő lehetőségeit emeli ki. A tanító terveiben ezt differenciált feladatadással és biztonságos részvétellel lehet képviselni.'}
  ],
  seminar:['Állíts össze két oszlopot: mit állít a hivatkozott kutatás, és mi az, ami ebből nem következik.','Tervezz olyan csoportos ritmusjátékot, amelyben minden tanuló részt tud venni.'],
  reflection:['Mi a különbség a korreláció és az oksági állítás között?','Miért indokolható a zenei nevelés más tantárgyi transzfer nélkül is?']
 },
 {
  id:'kodaly',title:'Kodály zenepedagógiai koncepciója',page:'20–27.',
  goal:'A hallgató el tudja különíteni a Kodály-koncepció alapelveit az egyes tanítási módszerektől.',
  concepts:['Kodály-koncepció','zenei anyanyelv','aktív éneklés','relatív szolmizáció'],
  sections:[
   {heading:'A koncepció és a módszerek különbsége',text:'A kötet hangsúlyozza: a köznyelvi „Kodály-módszer” valójában átfogó nevelési koncepció, amely nem egyetlen kötött óravezetési algoritmus. Fontos benne a zene hozzáférhetősége, az iskolai zenetanítás jelentősége, a magas színvonalú zenei anyag és a művészi élmény.'},
   {heading:'Éneklés és zenei anyanyelv',text:'A saját énekhang minden tanuló számára közvetlen eszköz. A népdalok, gyermekdalok és a gondosan választott műzene olyan tapasztalati anyagot jelenthetnek, amelyre a ritmikai és dallami ismeretek tudatosítása épül. A zenei jel csak az ismert hangzás után kapjon szerepet.'},
   {heading:'Az ismeretszerzés útja',text:'Az énekelt, tapsolt, megfigyelt jelenség előzi meg az elnevezést és a kottaképet. A relatív szolmizáció, a kézjel és a belső hallás támogatják a hangviszonyok megértését. A cél nem puszta jelolvasás, hanem önálló zenei tájékozódás és aktív muzsikálás.'}
  ],
  seminar:['Egy pentaton gyermekdalból tervezz hangzó tapasztalat → felismerés → szolmizáció → lejegyzés folyamatot.','Írj rövid indoklást, miért kell a kottaképnek hangzó példára épülnie.'],
  reflection:['Miért koncepció és nem egységes tanítási módszer?','Hogyan tartható meg az élményközpontúság a készségfejlesztésben?']
 },
 {
  id:'elzmenyek',title:'Az iskolai ének-zenei nevelés előzményei',page:'28–30.',
  goal:'Az óvodai és alsó tagozatos zenei nevelés közötti folytonosság felismerése.',
  concepts:['óvodai előzmények','gyermekdal','zenei fejlődési szint','folyamatosság'],
  sections:[
   {heading:'Mire épít az iskola?',text:'Az óvodában az éneklés, a körjátékok, mondókák és zenehallgatás alapvető élményeket és hangzó emlékeket hoznak létre. Az iskolakezdéskor a tanító nem indulhat abból ki, hogy valamennyi gyermek azonos repertoárral, hangterjedelemmel vagy ritmikai biztonsággal érkezik.'},
   {heading:'Átmenet az élménytől a tudatosításig',text:'A biztosan ismert dallam alkalmas lehet egy-egy zenei jelenség felismerésére. A tudatosítás ütemét a tanulók tényleges hallási és mozgásos teljesítményéhez igazítsuk. A gyermekdalok szerepe továbbra is elsődlegesen a közös zenélés és a játék öröme, nem csupán az elméleti példaadás.'}
  ],
  seminar:['Gyűjts öt lehetséges óvodai énekes tapasztalatot, amelyre első osztályban építhetsz.','Tervezz megfigyelő játékot az osztály előzetes ritmikai tapasztalatainak felmérésére.'],
  reflection:['Miért fontos az előzetes tudás feltárása?']
 },
 {
  id:'orafelépites',title:'Az ének-zene óra szerkezete, szervezése és vezetése',page:'31–34., 44–50.',
  goal:'A hallgató tudatosan tervezze az órafázisokat és a csoportos éneklés vezetését.',
  concepts:['óratípus','órafázis','énekes köszönés','kezdő dalcsokor','avizó','leintés'],
  sections:[
   {heading:'Óratípus és didaktikai cél',text:'Az óra megtervezése a tanulási célból induljon ki: új dal, új ritmikai vagy dallami elem, gyakorlás, ellenőrzés vagy zenehallgatás kerülhet előtérbe. Az egyes fázisok sorrendje rugalmas, de az énekes aktivitás, a tudatosítás és a gyakorlás belső összefüggése legyen világos.'},
   {heading:'Előkészítés és hangzó keret',text:'A tanító a foglalkozás előtt készíti elő a hangszereket, kottaképeket, eszközöket és a mozgáshoz szükséges teret. Az énekes köszönés, kezdő vagy záró dalcsokor közösségi keretet adhat. A dalcsokor megfelelő hangterjedelme és tempója összefügg a hangképzési állapottal.'},
   {heading:'Indítás és lezárás',text:'A közös éneklésnél a tanító előre elképzelt tempóval, érthető levegővételi jelzéssel és pontos indítással segít. Az avizó a közös kezdést készíti elő, a lezárás a dal zenei végét teszi világossá. A tanulók fokozatosan önállóvá tehetők a tempótartásban és a felvezetésben.'}
  ],
  seminar:['Készíts 45 perces óravázlatot konkrét célokkal, munkaformával és eszközökkel.','Próbáld ki társakkal a levegővételi előkészítést, az indítást és a leintést.'],
  reflection:['Mikor indokolt eltérni az előzetes óratervtől?','Mitől válik zeneivé, nem pusztán adminisztratívvá az óra szerkezete?']
 },
 {
  id:'hangkepzes',title:'Légzés, hangképzés és a közös énekhang fejlesztése',page:'36–43.',
  goal:'Az életkornak megfelelő, kíméletes éneklési szokások kialakításának megtervezése.',
  concepts:['testtartás','légzés','hangindítás','intonáció','hangszépítés'],
  sections:[
   {heading:'Az egészséges éneklés feltételei',text:'A természetes testtartás, laza áll- és nyelvmozgás, megfelelő levegővétel és kényelmes hangterjedelem segíti az éneklést. A légző- és hangképző gyakorlatok kapcsolódjanak az éppen tanított dal hangterjedelméhez, és ne erőltessék a gyermekhangot.'},
   {heading:'A hangképző gyakorlat didaktikája',text:'Rövid, játékos hangadási feladatokkal lehet előkészíteni a dallam magasabb vagy nehezebb fordulatait. A tanító önmaga is tiszta, helyes mintát adjon, és a hibajavítást ne megszégyenítéssel, hanem biztató, konkrét útmutatással végezze.'},
   {heading:'Intonációs nehézségek megfigyelése',text:'A tisztátlan éneklés többféle okból keletkezhet: elégtelen hallási tájékozódás, hangképzési bizonytalanság, nehéz kezdőhang vagy túl nagy hangterjedelem miatt. A pedagógusnak a feladatot szükség szerint kisebb fordulatra, kényelmesebb fekvésre és lassabb tempóra kell bontania.'}
  ],
  seminar:['Tervezz három rövid hangképző feladatot egy választott gyermekdalhoz.','Mutasd meg, hogyan javítanál kíméletesen bizonytalan hangindítást.'],
  reflection:['Milyen jelek utalnak arra, hogy a feladat túl magas vagy megterhelő?']
 },
 {
  id:'ertekeles',title:'Számonkérés, értékelés és motiváció',page:'49–52.',
  goal:'Fejlesztő és életszerű visszajelzések tervezése az ének-zene órán.',
  concepts:['formatív értékelés','motiváció','önértékelés','differenciálás'],
  sections:[
   {heading:'Motiváló tanulási helyzet',text:'A dalokhoz kapcsolódó történet, kép, játék vagy mozgás felkeltheti a kíváncsiságot. Az előkészítés akkor hatásos, ha rövid, életkorhoz illő, és egyértelműen a következő zenei élményhez vezet. A tanuló ne csupán a helyes válaszért, hanem az aktív részvételért is kapjon pozitív visszajelzést.'},
   {heading:'Értékelés a fejlődés szolgálatában',text:'A tanító külön figyelje a ritmikai pontosságot, dallami intonációt, együttműködést és zenei kifejezést. A jó visszajelzés megnevezi, mi sikerült és mi gyakorlandó; a személyes fejlődéshez viszonyít. A szóló énekeltetés módját a gyermekek biztonságérzetéhez kell igazítani.'}
  ],
  seminar:['Írj három konkrét, támogató értékelő mondatot ritmushiba után.','Készíts három szempontú, leíró önértékelő lapot.'],
  reflection:['Mi a különbség az ellenőrzés és a motiváló visszajelzés között?']
 },
 {
  id:'daltanitas',title:'Daltanítás hallás után és jelrendszerről',page:'52–63.',
  goal:'A két alapvető daltanítási út módszertani megválasztása és indoklása.',
  concepts:['hallás utáni daltanítás','jelrendszerről daltanítás','dallamrészlet','bemutatás'],
  sections:[
   {heading:'Hallás utáni daltanítás',text:'A tanító a dal egészét zeneileg igényesen, megfelelő karakterrel bemutatja, majd a megértést és megjegyzést segítő kisebb egységekben dolgozza fel. A részeket újra a teljes dal összefüggésébe kell helyezni; a végső cél a kifejező, önálló éneklés és a dalhoz kapcsolódó játék, mozgás megélése.'},
   {heading:'A jelrendszerről történő tanulás feltételei',text:'A szolmizációs, betűkottás és ötvonalas jelrendszerre épülő daltanítás akkor eredményes, ha a szükséges ritmus- és dallamkészletet a tanuló már biztonsággal ismeri. A hangzó elképzeléshez kapcsolódó jelolvasás összetettebb feladat, ezért nem célszerű az első ismerkedéskor pusztán a leírt dallamot másoltatni.'},
   {heading:'Módszerválasztás és differenciálás',text:'A tanító a dal nehézségét, ritmikai és dallami anyagát, a tanulók előzetes tudását és a kitűzött órai célt együtt mérlegeli. Hallás utáni tanulásnál több modellálásra, jelolvasásnál több tudatos előzetes gyakorlásra lehet szükség. Mindkét út végén az élő zenei megszólalás az elsődleges.'}
  ],
  seminar:['Egy gyermekdalhoz írj két óravázlatot: hallás utáni és jelrendszerről történő tanítással.','Azonosítsd a dal három legnehezebb dallami vagy ritmikai pontját.'],
  reflection:['Mikor indokolatlan jelrendszerről megtanítani egy dalt?','Miért nem maradhat a tanulás puszta szótagismétlés?']
 },
 {
  id:'ismeret',title:'Új zenei ismeret tanítása: ritmus, dallam és elmélet',page:'64–78.',
  goal:'Egy új jelenség érzékelésének, tudatosításának és alkalmazásának szakszerű megtervezése.',
  concepts:['érzékelés','tudatosítás','alkalmazás','ritmusképlet','dallamreláció'],
  sections:[
   {heading:'A három fokozat',text:'A könyv központi módszertani elve, hogy az új ritmikai vagy dallami elem először valódi zenében hangozzon el. A gyermek több dalban megfigyeli, felismeri és elkülöníti, majd a tanítóval együtt tudatosítja a jelenséget. A végén új feladatban önállóan alkalmazza a megtanult ismeretet.'},
   {heading:'Ritmikai ismeret tanítása',text:'Az új ritmusképletnek legyen előzetesen ismert, jól felismerhető hangzó példája. A hangoztatás és összehasonlítás után kerülhet sor a ritmusnévre, a jelre és a kottaképre. Az írásbeli megjelenítést kövesse új dalban való felismerés és önálló reprodukció.'},
   {heading:'Dallami és elméleti elemek',text:'A dallami relációk megértését az ismert hangkészlet, a kézjel, a szolmizáció és a belső hallás segíti. Hangnemek, hangsorok, hangzatok esetén is törekedni kell a hallható, énekelhető példára. A fogalom önmagában nem helyettesíti az élő zenei tapasztalatot.'}
  ],
  seminar:['Tervezz új szinkópaelemre érzékelés–tudatosítás–alkalmazás hármas egységet.','Egy ismert dalban válassz új dallami relációt, és vezesd végig a hangzó példától a kézjelig.'],
  reflection:['Miért nem jó a ritmusképlet puszta definíciójával kezdeni?']
 },
 {
  id:'ritmusfej',title:'Ritmikai készségfejlesztés',page:'79–84.',
  goal:'Változatos ritmikai felismerő és reprodukáló feladatok kialakítása.',
  concepts:['ritmusvisszhang','ritmuskánon','memóriajáték','mérő','ritmuslánc'],
  sections:[
   {heading:'Feladatcsaládok',text:'A ritmikai fejlesztésben szerepet kap az utánzás, kottakép felismerése, hallás utáni lejegyzés, ismert ritmuselemek variálása, valamint az emlékezeti feladat. A könyv a ritmusház, elhagyott ütemek visszaidézése és változatos mozgásos játékok példájával érzékelteti, hogy azonos készség többféle helyzetben gyakorolható.'},
   {heading:'Fokozatosság',text:'Először rövid, biztosan megszólaltatható motívumokkal dolgozzunk, majd növeljük a ritmikai készletet és a memóriaterhelést. A hibát ne pusztán javíttassuk: közösen derítsük ki, hogy a mérő tartása, a ritmusképlet felismerése vagy az emlékezeti feladat okozza-e a nehézséget.'},
   {heading:'Játékos alkalmazás',text:'A ritmusláncban az előző játékos ritmusának egy részét meg kell tartani és új egységgel folytatni. Az így kialakuló rövid folyamat a hallási figyelem, a pontos reprodukció és a kreatív ritmusalkotás összekapcsolását teszi lehetővé.'}
  ],
  seminar:['Hozz létre négy állomásból álló ritmusfejlesztő forgószínpadot.','Tervezz ritmusmemória-játékot növekvő nehézséggel.'],
  reflection:['Mi a különbség a mérőre és a ritmusra végzett tapsolás között?']
 },
 {
  id:'dallamfej',title:'Dallami készségfejlesztés és a többszólamúság előkészítése',page:'85–97.',
  goal:'Relatív hallásra, belső hallásra és önálló szólamtartásra épülő gyakorlatok készítése.',
  concepts:['dallamvisszhang','belső hallás','élő vonalrendszer','kánon','kürtmenet','tercmenet'],
  sections:[
   {heading:'A hallásfejlesztés útja',text:'Ismert dalok motívumai, szolmizált fordulatok és dallamvisszhangok alkalmasak a hangmagassági viszonyok tisztázására. A kézjel és az „élő vonalrendszer” összekötheti a hallási és térbeli tájékozódást. Az ismert hangkészletből kiinduló önálló dallamalkotás későbbi készségszint.'},
   {heading:'Belső hallás és dallamemlékezet',text:'A hallgató alakítson ki olyan feladatokat, amelyekben a gyermek a hiányzó vagy némán folytatott dallamot belsőleg elképzeli. A fokozatosság lényeges: a pedagógus először rövid, biztosan megtanult egységgel dolgozik, majd nagyobb részekre tér át.'},
   {heading:'A többszólamúság felé',text:'Az egyszerű bordun és osztinátó, a ritmikai kétszólamúság, a kánon és az egymással együtt énekelhető dallamok előkészítik a szólamtartást. A könyv kürtmenet és tercmenet típusú szólamviszonyokat is bemutat. A cél a másik szólam hallása mellett megőrzött saját zenei gondolat.'}
  ],
  seminar:['Tervezz fokozatos fejlődést egyszólamú énekléstől ritmikai kétszólamúságig.','Mutasd be ötujjas élő vonalrendszerrel egy rövid dallam mozgását.'],
  reflection:['Hogyan lehet megállapítani, hogy a tanuló belül hallja-e a dallamot?']
 },
 {
  id:'olvasas',title:'Zenei olvasás és írás',page:'98–106.',
  goal:'A hallott és elképzelt zenei anyag tudatos jelölésének és visszaolvasásának megtervezése.',
  concepts:['ritmusírás','dallamírás','betűkotta','ötvonalas lejegyzés','lapról éneklés'],
  sections:[
   {heading:'Hangzás és jel kapcsolata',text:'A kottaolvasás nem önálló vizuális rejtvény: a jelnek belsőleg hallható hangzást kell felidéznie. A gyermekek fokozatosan haladjanak a kézjeles vagy dallamrajzos megjelenítéstől a betűkottán át az ötvonalas írásig, a már ismert ritmus- és dallamkészleten belül.'},
   {heading:'Olvasási feladatok',text:'A ritmus felolvasását és a szolmizációt egyre önállóbb feladatok követhetik: hiányos kotta kiegészítése, motívumok egyeztetése, egyszerű dallam leolvasása, illetve ismert zene visszakeresése a jelrendszerben. A tanító minden lépésnél ellenőrzi, hogy a jel valóban zenei képzethez kapcsolódik-e.'},
   {heading:'Írás és önellenőrzés',text:'Kottaírásnál az énekelt vagy diktált egységet előbb hallás útján kell értelmezni. A lejegyzést visszaénekléssel, ritmushangoztatással ellenőrizzük. A pontosságot a hangközök és a mérőből levezetett időviszonyok együttesen adják.'}
  ],
  seminar:['Készíts hiányos ritmuskottát önellenőrző hangoztatással.','Egy dallamhoz tervezd meg a kézjel, betűkotta és ötvonalas kotta közötti átmenetet.'],
  reflection:['Mikor célszerű áttérni az ötvonalas jelölésre?']
 },
 {
  id:'alkotas',title:'Zenei alkotótevékenység és improvizáció',page:'107–116.',
  goal:'A gyermekek önálló ritmikai és dallami döntéseinek támogatása biztonságos keretek között.',
  concepts:['improvizáció','ritmuslánc','dallamkomponálás','formaalkotás','variáció'],
  sections:[
   {heading:'Alkotás és tanult készlet',text:'Az improvizáció nem feltétlenül teljesen kötetlen: a biztosan ismert ritmusértékek, dallamhangok és formai egységek keretet adhatnak a saját zenei ötleteknek. Rövid kérdés–válasz játék, ritmuslánc vagy kötött hangkészletű dallamfolytatás segíti a kezdeti önállóságot.'},
   {heading:'Forma és kreativitás',text:'A gyermekek megadott A–B formaelemekből készíthetnek sorrendet, vagy változtathatják a jól ismert dallam ritmusát. A különböző megoldásokat hangozva is ki kell próbálni; így a tanuló meghallja döntése következményét, és képes lesz továbbalakítani saját ötletét.'},
   {heading:'Értékelés alkotó helyzetben',text:'A kreatív feladatban célszerű az előre megbeszélt kereteket, a zenei követhetőséget és a kipróbált változatokat értékelni. A cél nem egyetlen tanári mintaválasz eltalálása, hanem a zenei képzelet és a hallási ellenőrzés összekapcsolása.'}
  ],
  seminar:['Tervezz kétütemes ritmuskérdés–válasz játékot 3. osztályosoknak.','Adj meg pentaton hangkészletet és egyszerű visszatérő formai keretet saját dallam alkotásához.'],
  reflection:['Hol van szükség megkötésre, és hol célszerű szabad döntést engedni?']
 },
 {
  id:'zenehallgatas',title:'A zenehallgatás tanítása',page:'117–125.',
  goal:'Az életkorhoz illő, aktív és célzott zenehallgatás megtervezése.',
  concepts:['irányított zenehallgatás','figyelmi szempont','hangszín','zenei karakter','újrahallgatás'],
  sections:[
   {heading:'Előkészítés és befogadás',text:'A tanuló számára az ismeretlen zeneművet érdemes rövid motiváló háttérrel, egyetlen fő hallgatási szemponttal bemutatni. Nem a hosszú életrajzi ismertető, hanem a közvetlen hangzó élmény és az irányított figyelem a kiindulópont. A kiválasztott részlet illeszkedjen az életkorhoz és a korábbi zenei tapasztalathoz.'},
   {heading:'A megfigyelési feladat',text:'Hangszín, ritmus, karakter, forma vagy dinamika közül először válasszunk kevés jól követhető szempontot. A tanító a felvételt szükség esetén újraindítja; a közös megbeszélés konkrét hangzó jelenségekre térjen vissza. A könyv műpéldákat és részletes tanári kérdezési lehetőségeket is bemutat.'},
   {heading:'Kapcsolat az aktív zenéléssel',text:'A zenehallgatás és az éneklés nem két elzárt terület. Ismert motívumok, ritmusképletek vagy mozgásos karakterek felismerése segít, hogy a gyermek a hallott műben valódi zenei összefüggéseket vegyen észre.'}
  ],
  seminar:['Készíts 8 perces zenehallgatási tervet előzetes motivációval és két visszahallgatással.','Egy barokk részlethez készíts hangszínre és formai visszatérésre irányuló kérdéssort.'],
  reflection:['Miért előnyösebb a kevés, jól megválasztott megfigyelési szempont?']
 },
 {
  id:'tervezes',title:'A zenei nevelőmunka tervezése és a mindennapos éneklés',page:'126–130.',
  goal:'A tanítási órák és az iskolai zenei élet tervezésének összekapcsolása.',
  concepts:['tanmenet','óravázlat','fejlesztési cél','tanórán kívüli zene','mindennapos ének'],
  sections:[
   {heading:'Tervezési szintek',text:'A hosszabb távú tanmenet és az egyes órák terve egymásra épül. A dalanyag, az új ismeretek és a készségfejlesztés sorrendje legyen fokozatos, mégis adjon helyet ismétlésnek, aktuális eseményeknek és eltérő tanulói szükségleteknek.'},
   {heading:'A tanórán kívüli zenei élet',text:'Az iskolai éneklés nem korlátozódik az órarend szerinti ének-zene foglalkozásra: ünnepek, kórus, játékos éneklési alkalmak és közös zenehallgatások is alakíthatják a közösség zenei kultúráját. A megvalósítás a helyi körülményektől és a résztvevők képességeitől függ.'}
  ],
  seminar:['Készíts négy hétre egymásra épülő zenei fejlesztési tervet.','Tervezz megvalósítható tanórán kívüli éneklési alkalmat egy adott iskolai közösségnek.'],
  reflection:['Hogyan tartja együtt a tanmenet a hosszabb távú fejlődést és az órai rugalmasságot?']
 },
 {
  id:'iranyzatok',title:'Zenei neveléstörténet és 20. századi európai irányzatok',page:'131–143.',
  goal:'A történeti zenei nevelési elképzelések és néhány meghatározó 20. századi pedagógiai irányzat összehasonlítása.',
  concepts:['zenei neveléstörténet','Dalcroze','Orff','Kodály','mozgás','improvizáció'],
  sections:[
   {heading:'Történeti nézőpont',text:'A művészeti és zenei nevelés értékéről az ókortól kezdve különböző gondolkodók fogalmaztak meg nézeteket. A könyv a hagyományos oktatási formák és az iskolai éneklés fejlődésének fontos állomásait áttekintve jut el a 20. század pedagógiai megújulásához.'},
   {heading:'Dalcroze és a mozgásos tanulás',text:'A Dalcroze-féle ritmika a zene testi megtapasztalását, a mozgás és a hallás összehangolását emeli ki. A tanulók a zenei időt és hangsúlyokat testmozgással érzékeltethetik. A mozdulat nem látványos kiegészítés, hanem a zenei megértés része.'},
   {heading:'Orff és a kreatív zenélés',text:'Az Orff-pedagógia a beszédet, ritmust, mozgást, gyermekjátékot és egyszerű hangszeres tevékenységet kapcsolja össze. Az improvizáció és az osztinátó jellegű kíséretek különösen alkalmasak csoportos gyakorlásra. A kötet más pedagógiai elképzeléseket is megemlít; az irányzatokat nem érdemes kizárólag egyetlen módszerre szűkíteni.'},
   {heading:'Összehasonlító alkalmazás',text:'Az eltérő zenepedagógiai irányzatok közös vonása lehet a tapasztalatra, aktív részvételre és fokozatosságra építés. A hallgató konkrét pedagógiai célhoz válasszon eljárást, ne kizárólag módszernév alapján döntsön.'}
  ],
  seminar:['Hasonlíts össze egy ritmikai célhoz Dalcroze-, Orff- és Kodály-szemléletű megoldást.','Tervezd meg ugyanazt a gyermekdalt mozgással, testritmussal és szolmizációval.'],
  reflection:['Mikor egészítik ki egymást a különböző pedagógiai irányzatok?']
 }
];
