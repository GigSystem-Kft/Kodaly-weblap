/** A Kelemen-kötethez kapcsolódó további, önállóan írt didaktikai feldolgozás. */
export interface DeepPedagogyLesson {
 unitId: string; explanation: string[]; lessonPlan: string[];
 pitfalls: string[]; figure?: {file:string; caption:string; pdfPage:number; printPage:number};
}
export const DEEP_PEDAGOGY_LESSONS: DeepPedagogyLesson[]=[
 {unitId:'esztetikai',
 explanation:[
  'A zenei nevelés értékét nem lehet a pontos ritmusolvasás vagy a megtanult dalok számával azonosítani. A kisgyermek számára az elsődleges esemény az élő muzsikálás: a közösen megvalósuló ének, a társakra figyelő mozgás és a hangzásban felfedezett különbség. A tanító ezért tudatosan váltogatja a gyermek aktivitását, a rövid tanári mintát és a közös megfigyelést.',
  'Egy dalban egymás után többféle tanulási út is megjelenhet. Kezdetben a gyermekek a szöveg hangulatát és mozgását fejezik ki, majd egy újrahallgatásnál a visszatérő dallamrészt vagy a jellegzetes ritmust keresik. Így az élményből lesz fokozatosan megnevezhető tudás, anélkül hogy a zenei mű elveszítené a maga művészi egységét.'
 ],lessonPlan:['Énekeld el a kiválasztott dalt teljes egészében, természetes karakterrel.','Kérj a szövegből vagy dallamkarakterből kiinduló mozdulatot.','Közös éneklés közben figyeltess meg egyetlen visszatérő fordulatot.','Ugyanezt a fordulatot másik mozdulattal vagy dinamikával ismételtesd.','Röviden reflektáljatok arra, hogyan változott a zenei élmény.'],
 pitfalls:['A játék a dalhoz képest öncéllá válik.','Túl korán bevezetett zeneelméleti terminológia elnyomja a hallási tapasztalatot.']},
 {unitId:'kepesseg',
 explanation:[
  'A pedagógiai megfigyeléshez célszerű külön kezelni a hallási megkülönböztetés, a ritmus megtartása és a hangzó anyag visszaidézésének nehézségeit. Ha egy gyermek pontatlanul tapsolja a szinkópát, nem biztos, hogy magát a képletet nem ismeri: a mozdulat gyorsasága, a mérő bizonytalansága vagy a túl hosszú feladat egyaránt lehet akadály.',
  'A fejlesztő feladat akkor jól diagnosztizálható, ha egy időben egyetlen fontos változót módosít. Azonos ritmusképlet több tempóban való utánzása a tempó hatását mutatja; két hasonló képlet összehasonlítása a megkülönböztetést, másik dalban történő felismerése pedig az alkalmazást vizsgálja.'
 ],lessonPlan:['Hangozzék el rövid ritmusminta tanári előadásban.','A tanulók visszhangozzák tapssal, majd ritmusnévvel.','Egyetlen hang megváltoztatásával hozz létre összehasonlítható mintát.','Kérd az eltérés felismerését azonos mozgás mellett.','Végezz önálló alkalmazást új dal ritmusából.'],
 pitfalls:['Az egyéni pillanatnyi hibát végleges képességhiánynak minősítjük.','A gyors ismétlésszámot a megértés bizonyítékának tekintjük.']},
 {unitId:'transzfer',
 explanation:[
  'A zenetanulás és más kognitív vagy társas teljesítmények kapcsolatáról szóló állításokat mindig a kutatási módszertan felől kell értelmezni. A korreláció nem bizonyítja önmagában, hogy a zenetanítás idézte elő a különbséget: családi háttér, motiváció, korábbi tanulás és a kiválasztás módja is hatással lehet az eredményre.',
  'Egy zenepedagógiai óratervben a tanító ezért először a valóban megfigyelhető zenei célt fogalmazza meg. Ha a ritmusjátékban együttműködési vagy figyelmi változást is észlel, azt pedagógiai megfigyelésként rögzítheti, de nem szükséges ebből általános értelmi fejlődésre vonatkozó bizonyosságot levezetnie.'
 ],lessonPlan:['Olvassátok el egy kutatás rövid ismertetését.','Soroljátok fel a valóban mért teljesítményeket.','Különítsétek el a kapcsolatot és az esetleges ok-okozati értelmezést.','Tervezettek célzott zenei feladatot, amelynek saját eredménye mérhető.','Reflektáljatok az elérhetőség és a méltányosság szempontjaira.'],
 pitfalls:['Minden tanulási javulást automatikusan a zenének tulajdonítunk.','A zene önálló művészeti értékét kizárólag más tantárgyak szolgálatába állítjuk.']},
 {unitId:'kodaly',
 explanation:[
  'A Kodály-koncepció iskolai megvalósításának módszertani következménye, hogy az új ritmus- vagy dallamjelenséget ismert hangzó anyagból vezetjük le. A tanító énekléssel bemutatja, a tanulók utánzással és önálló énekkel megerősítik, majd a felismerhető jelenséget szolmizációval, kézjellel vagy kottaképpel is megnevezik.',
  'A relatív szolmizáció nem azonos a hangok rögzített abszolút elnevezésével. Elsődleges didaktikai értéke, hogy a gyermek a hangok egymáshoz viszonyított helyzetét követi, akár más hangmagasságról is. A kottakép és az énekhang összekapcsolása belső hallási képzetet kíván, ezért új, túl nehéz dallamot nem célszerű pusztán írásjelekkel bevezetni.'
 ],lessonPlan:['Válassz egy már ismert, jól énekelhető gyermekdalt.','Ismételtesd úgy, hogy a fő dallamfordulat hangzásban biztossá váljon.','Kérd azonos fordulat felismerését másik dallamban.','Kapcsolj hozzá relatív szolmizációt és kézjelet.','Csak ezután jelenjen meg az írásos jel.'],
 pitfalls:['A kézjelek mechanikus utánzása belső hallás nélkül.','A módszertan egyetlen rögzített feladatsorrá szűkítése.']},
 {unitId:'elzmenyek',
 explanation:[
  'Az első osztályos ének-zene órán a pedagógus tudatosan épít az óvodai énekes játékokra, de közvetlenül felméri, mit ismernek a tanulók. Az azonos életkorú gyermekek között jelentős különbségek lehetnek az énekbátorságban, a mozgáskoordinációban és az ismert dalrepertoárban.',
  'A biztonságos átmenethez lehetőség szerint ugyanazt a dallamot többféle feladatban használjuk. Az először játékhelyzetben felidézett dal később alkalmas lehet a mérő, ritmusképlet vagy dalforma megfigyelésére. A kezdő tananyag nem a korábbi játékos keretek hirtelen elhagyásával válik iskolássá.'
 ],lessonPlan:['Beszélgessetek röviden az ismert óvodai énekes játékokról.','Énekeljetek közösen, szóló értékelés nélkül.','Figyeld meg a kezdőhangot, a tempótartást és a részvételt.','Az ismert dalhoz rendelj egyetlen új felismerési feladatot.','Rögzíts fejlesztési megfigyeléseket további differenciáláshoz.'],
 pitfalls:['Az előzetes tudás túlbecslése.','Az ismert énekes játékok elhagyása az első tanítási hetekben.']},
 {unitId:'orafelépites',
 explanation:[
  'Az óra szerkezetét mindig a didaktikai cél és a tanulók tényleges figyelmi állapota határozza meg. Az énekes köszönés és a dalcsokor segíthet az együtt éneklésre hangolódásban, de csak akkor, ha tempójuk, hangmagasságuk és terjedelmük illeszkedik a csoporthoz.',
  'A jó óravázlat a tevékenységek időkerete mellett a tanulói cselekvéseket is tartalmazza: mikor figyelnek, mikor énekelnek, mikor tapasztalnak új elemet és mikor alkalmazzák önállóan. A zenemű teljes formáját, a dalok karakterét és az értékelés pedagógiai tapintatát az időbeosztás közben sem szabad elveszíteni.'
 ],lessonPlan:['Készíts elő hangszert, kottát, teret és jelzőeszközöket.','Vezess be rövid, pontos kezdő éneklést.','Helyezz el egy új ismeretet a már ismert hangzó anyagba.','Váltogasd a közös, páros és egyéni gyakorlást.','Zárj közös énekkel és rövid önértékeléssel.'],
 pitfalls:['Az óra puszta feladatlistává válik, zenei összefüggés nélkül.','Nincs előkészített kezdőhang vagy egyértelmű indítójel.'],
 figure:{file:'enekes-koszones.png',caption:'Énekes köszönés: eredeti kottakép a kézikönyvből',pdfPage:37,printPage:35}},
 {unitId:'hangkepzes',
 explanation:[
  'A hangképzési gyakorlatok értéke nem a bonyolultságukban, hanem abban van, hogy röviden és kíméletesen felkészítik a gyermekhangot a közös éneklésre. A kényelmes hangterjedelem, az oldott testtartás és a természetes levegővétel megfigyelése fontosabb a hang erősségénél.',
  'Bizonytalan intonáció esetén a tanító először kisebb dallamfordulattal, világos hangzó mintával és megfelelő tempóval dolgozzon. A gyermek számára a hibajavítás megoldható feladatként jelenjen meg: egyetlen hangköz, jól megtalált kezdőhang vagy hangmagassági irány gyakorlása gyakran többet segít a teljes dal többszöri elismétlésénél.'
 ],lessonPlan:['Lazítsátok el a vállat és az állkapcsot természetes testtartásban.','Végezzetek rövid, játékos levegőáramlási feladatot.','Utánozzatok kényelmes fekvésű két-három hangos motívumot.','Kapcsoljátok a motívumot az új dal egyik fordulatához.','Figyeld meg a hangszín és intonáció alakulását.'],
 pitfalls:['Túl erős hangerőre ösztönzés.','Túl magas fekvés vagy túl hosszú hangképző gyakorlatsor.']},
 {unitId:'ertekeles',
 explanation:[
  'A zenei fejlődés értékelése akkor támogató, ha világos zenei szempontokra épül. A ritmus pontossága, a dallam felismerése, a közös tempótartás és a kifejezés különböző területek; nem szerencsés egyetlen általános „ügyes vagy” vagy „rossz” ítéletté összevonni őket.',
  'A gyermekek biztonságérzetét a kiszámítható elvárás és a hibákból való tanulás lehetősége segíti. Például a tanító mondhatja: „A kezdést közösen eltaláltátok; most a második sor végének szünetére figyelünk.” Az ellenőrzés és a pozitív visszajelzés nem ellentétes, ha konkrétan megnevezzük a következő fejlesztési célt.'
 ],lessonPlan:['Határozz meg két megfigyelhető zenei szempontot.','Mutass be sikerkritériumot hangzó példával.','Rövid feladat közben rögzíts konkrét megfigyelést.','Adj egyetlen, pontosan megfogalmazott fejlesztő visszajelzést.','Kérj a tanulóktól saját szempontú önértékelést.'],
 pitfalls:['A személy értékelése a zenei cselekvés helyett.','Csak a hibák keresése előzetes sikerfeltételek nélkül.']},
 {unitId:'daltanitas',
 explanation:[
  'Hallás utáni tanításnál a dal egészének első bemutatása zenei és érzelmi összképet ad. A részletezés csak ezt követően kezdődjön, és a tanító rendszeresen visszajuttassa a tanulókat a teljes dalhoz. A jelrendszerről történő daltanítás a már felépült ritmikai és dallami készletet kívánja meg; a kotta nem pótolja a biztos belső zenei elképzelést.',
  'A megfelelő módszert a dal hangterjedelme, ritmikai és dallami nehézsége, a szöveg, valamint a tanulók előzetes tudása határozza meg. Egyszerű pentaton dal esetén jól előkészített szolmizációs olvasás segíthet, összetett idegen hangkészletnél a hallás utáni tanulás lehet célszerűbb. Egyik út sem teszi mellőzhetővé a tiszta, muzikális éneklést.'
 ],lessonPlan:['Mutasd be a teljes dalt megfelelő karakterrel.','Kérj egyetlen hallgatási megfigyelést a formáról vagy hangulatról.','Bontsd a dalt jól megjegyezhető motívumokra.','Ismételd és kapcsoltasd össze a motívumokat, a nehezebb fordulatokkal külön dolgozva.','Énekeltessétek újra a dalt teljes egészében, majd vezess be önálló feladatot.'],
 pitfalls:['A tanulók csak töredékeket tanulnak, a dal egészét nem érzékelik.','Kottáról tanítunk olyan hangkészletet, amelyet a tanulók nem hallanak belül.']},
 {unitId:'ismeret',
 explanation:[
  'Egy új ritmusképlet tudatosítása előtt a gyermek többször hallja és énekli a jelenséget ismert dalban. A tanító a hangzó részletet izolálja, összeveti más képlettel, majd elvezeti a pontos ritmusnévhez és írásos jelhez. Az alkalmazás új feladathelyzetben történik, lehetőleg másik zenei anyaggal.',
  'Dallami ismeretnél az énekelt hangviszony, a mozgás vagy kézjel és a kottakép fokozatosan kapcsolódjon össze. Az elméleti fogalom akkor válik használhatóvá, ha a tanuló nem csupán reprodukálja a definíciót, hanem hangzásból azonosítja a jelenséget, sőt szükség esetén önállóan képes megszólaltatni.'
 ],lessonPlan:['Készíts elő ismert dalt, amelyben az új elem tisztán hallható.','Emeld ki a megfelelő rövid zenei részletet.','Tegyél fel célzott összehasonlító kérdést.','Mutasd be a megnevezést és jelölést a hangzó mintára építve.','Új dalban vagy saját alkotó feladatban ellenőrizd a felismerést.'],
 pitfalls:['A definíció bemagoltatása hangzó példa nélkül.','Az alkalmazás kimarad, így a felismerés nem általánosítható.']},
 {unitId:'ritmusfej',
 explanation:[
  'A ritmikai készségfejlesztésnek sokkal több lehetősége van az egyszerű tapsoltatásnál. A ritmushunyóban a tanító egy ismert sorból egy-egy részletet elrejt, a gyermekeknek pedig a hiányzó egységet kell belső hallással kiegészíteniük. A ritmuskígyóban rövid ismert motívumok folytonos lánccá állnak össze; a követéshez mérőtartás és figyelem szükséges.',
  'A feladatok nehézsége szabályozható a ritmuskészlet, a tempó, az emlékezetben tartandó hossz és a mozgásos kíséret szerint. Egy összetett ritmusképletet célszerű előbb közösen megszólaltatni, majd csoportoknak vagy egyéneknek átadni. A hiba javítása előtt meg kell találni, hogy a mérő, az olvasás vagy a memória okozza-e az elakadást.'
 ],lessonPlan:['Mutass be három rövid, ismert képletből álló ritmussort.','Hangoztassátok mérőre tapssal.','Egy egységet takarj le, és kérd annak emlékezetből pótlását.','Kapcsold össze a sorokat folyamatos ritmuskígyóvá.','Kérj önálló ritmusváltozatot az ismert készletből.'],
 pitfalls:['A tempó minden körben nő, ezért a pontosság romlik.','A vizuális jelölés fontosabbá válik a hangzó ritmusnál.'],
 figure:{file:'ritmuskigyo.png',caption:'Ritmuskígyó: kottás módszertani példa a könyvből',pdfPage:87,printPage:85}},
 {unitId:'dallamfej',
 explanation:[
  'A dallami készségfejlesztés a hangmagasságviszonyok folyamatos észlelésére épül. Az énekelt dallamvisszhang, a dallamhibák felismerése, a kézjelekkel követett hangmozgás és a belső hallási feladat eltérő összetevőket fejleszt. A tanító csak akkor növelje a hangterjedelmet, ha a kisebb hangkészlet biztonságossá vált.',
  'A többszólamúság előkészítéséhez előbb stabil egyszólamú éneklés és mérőtartás szükséges. Egy egyszerű bordun vagy ritmikai osztinátó mellett az énekelt dallam fokozatosan önállóvá válhat; később kánon, hangsúlyban eltérő szólam, vagy tercekben haladó dallamrészek következhetnek.'
 ],lessonPlan:['Énekeltess egy rövid, biztos dallammotívumot.','Kérd a mozgásirány kézjeles jelzését.','Vezess be egyszerű ritmikai osztinátót második csoporttal.','Cseréld meg a két csoport feladatát.','Végezz rövid önálló szólamtartási próbát.'],
 pitfalls:['Túl hamar lépünk összetett többszólamúságra.','A tanuló csak saját szólamát figyeli, nem hallja a teljes hangzást.']},
 {unitId:'olvasas',
 explanation:[
  'A ritmusolvasás egyik alapelve, hogy a szimbólumot valós hangzó időviszonnyal kapcsoljuk össze. Különböző hosszúságú ritmusképletek felolvasásánál a gyermeknek ugyanazt az egyenletes mérőt kell megtartania. A vizuális jelölés önmagában nem elegendő: a ritmusértékeket mozdulattal és hangzó példával kell ellenőrizni.',
  'Dallamolvasásnál a kézjel és a szolmizáció a relatív hangmagassági viszonyok felidézését segíti. Az ötvonalas kotta bevezetését differenciálni kell; a hangok helye és az ismert dallam belső hangzása együtt váljon biztossá. Az írásbeli diktálás ne puszta memóriateszt legyen, hanem hallási értelmezést követő rögzítés.'
 ],lessonPlan:['Hangozzon el ritmusrészlet, amit a tanulók már ismernek.','Azonosítsák a kottaképen és olvassák ritmusnévvel.','Tartsák a mérőt és hangoztassák el újra.','Ábrázolják rövid jelöléssel vagy hiányos kotta kiegészítésével.','A lejegyzést visszahangoztatással ellenőrizzék.'],
 pitfalls:['A hangsúly teljesen a grafikus pontosságra kerül a hallás rovására.','Belső hallás nélkül kell ismeretlen dallamot ötvonalas kottáról olvasni.'],
 figure:{file:'ritmusolvasas.png',caption:'Ritmusolvasás, dallamolvasás: a könyv eredeti kottás szemléltető anyaga',pdfPage:101,printPage:99}},
 {unitId:'alkotas',
 explanation:[
  'Az alkotó zenei tevékenységben a gyermek a tanult készlet elemeit nemcsak felismeri, hanem új sorrendben, új ritmusban vagy új dallamként használja. A ritmuskérdés–válasz, a rövid gyermekvers megzenésítése, a ritmuslánc és az adott hangkészletű dallamfolytatás fokozatos szabadságot ad. A kötöttség ebben az esetben nem az alkotás ellentéte, hanem segítő kerete.',
  'Közös improvizáció után érdemes az elkészült megoldást visszahallgatni vagy megismételni. Egy tanuló ritmusát a társa folytathatja, a csoport pedig dönthet két változat között. Az értékelés középpontjában az előzetes zenei szabályok követése, a felismerhető forma és a kreatív döntés állhat.'
 ],lessonPlan:['Adj meg rövid ritmikai vagy pentaton dallami hangkészletet.','Mutass be egy kérdés–válasz mintát.','Kérj tanulói saját folytatást egyetlen feltétellel.','Próbáljátok ki egymás ötleteit csoportban.','Az elkészült formát ismételjétek és értékeljétek közösen.'],
 pitfalls:['Túl sok szabály akadályozza az önálló döntést.','Az improvizációt kizárólag a tanári mintával való egyezés alapján értékeljük.'],
 figure:{file:'ritmusalkotas.png',caption:'Kreatív ritmikai feladatok: kottás példák a kötetből',pdfPage:114,printPage:112}},
 {unitId:'zenehallgatas',
 explanation:[
  'A zenehallgatás tanításához érdemes rövid, konkrét és egyértelmű megfigyelési szempontot kijelölni. A gyermek először például a hangszerek váltakozását követi, majd újabb meghallgatásnál a visszatérő témát vagy a dinamika változását. A szerző és a mű keletkezésének ismertetése önmagában nem helyettesíti a zenei figyelmet.',
  'A hallgatott részletet jó esetben énekes, ritmikai vagy mozgásos tevékenység is előkészíti. A megbeszélésnél a pedagógus a konkrét hangzó eseményhez kér visszatérést: a tanuló ne csupán a hangulatát minősítse, hanem megtanuljon felismerhető zenei bizonyítékot mondani.'
 ],lessonPlan:['Játssz le egy rövid, korosztálynak megfelelő zenei részletet.','Adj a második hallgatás előtt egyetlen célzott megfigyelési kérdést.','Hallgassátok újra és jelöljétek a jelenség előfordulását.','Beszéljétek meg, hogy ki milyen hangzó bizonyítékot hallott.','Kapcsoljatok hozzá rövid énekes vagy ritmikai követőfeladatot.'],
 pitfalls:['Túl hosszú magyarázat előzi meg a felvételt.','Egyszerre túl sok megfigyelési feladatot kapnak a tanulók.']},
 {unitId:'tervezes',
 explanation:[
  'Az ének-zene tanmenetben a dalanyag, az új zenei jelenségek és az ismétlés egymásra épülnek. Érdemes külön rögzíteni az adott tanulási célt, az ehhez kiválasztott hangzó anyagot, a differenciálás lehetőségét és az ellenőrzés módját. Egy időszak megtervezésekor helyet kell hagyni az énekes közösségi élményeknek és az aktualitásoknak is.',
  'A mindennapos éneklés vagy a tanórán kívüli zenei alkalom tervezésénél az iskolai közösség életkora, repertoárja és helyi lehetőségei a döntőek. Egy jól megválasztott kóruspróba, énekes ünnepség vagy rövid rendszeres közös éneklés nem azonos az énekóra teljes módszertani szerkezetével, mégis fontos zenei tapasztalatot adhat.'
 ],lessonPlan:['Írd össze a következő négy hét fő zenei céljait.','Rendelj mindegyikhez ismert és új dalanyagot.','Tervezz ismétlő játékot és rövid zenehallgatást.','Jelöld a differenciálás és a fejlesztő értékelés pillanatait.','Fogalmazz meg tanórán kívüli kapcsolódási lehetőséget.'],
 pitfalls:['Az óraterv kizárólag dalcímek felsorolása.','Az egyes órák céljai nem épülnek a korábbi fejlesztésre.']},
 {unitId:'iranyzatok',
 explanation:[
  'A 20. század európai zenepedagógiai irányzatait érdemes működő tanulási helyzeteken keresztül összehasonlítani. Dalcroze ritmikájában a mozgásos idő- és hangsúlytapasztalat kap hangsúlyt; Orff megközelítésében a beszéd, ritmus, mozgás és egyszerű hangszeres alkotás kapcsolódik össze; Kodály nevelési koncepciójában az aktív éneklés, a zenei anyanyelv és a tudatos hallásközpontú zenei műveltség áll előtérben.',
  'Ezek nem kizárólagos válaszok egyetlen pedagógiai helyzetre. A tanító a korosztály, a készségek és a művészi cél szerint választhat például ritmikus járást, szolmizációt, egyszerű ütőhangszeres osztinátót vagy közös énekes improvizációt. A módszer eszköz; a pedagógiai hatékonyságot az adott zenei feladatban kell vizsgálni.'
 ],lessonPlan:['Válassz egy egyszerű kétsoros gyermekdalt.','Tervezz hozzá mozgásos lüktetésgyakorlatot Dalcroze szemléletében.','Adj beszédritmusból és egyszerű ütőhangszerből induló Orff-jellegű feladatot.','Készíts ismert hangkészletű énekes-szolmizációs gyakorlást Kodály szemléletében.','Hasonlítsd össze, milyen zenei felismeréshez segít az egyes út.'],
 pitfalls:['A módszerek puszta névfelidézésként jelennek meg.','Az eltérő irányzatok minden elemét egyetlen kötelező óratervbe próbáljuk sűríteni.']}
];
