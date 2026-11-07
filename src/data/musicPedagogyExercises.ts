import type { Flashcard, QuizQuestion, MatchingPair } from '../types';

/** Új, eredeti gyakorlóbank a Kelemen Judit (2019) kötet alapján készült
 * 08. Ének-zene tantárgy-pedagógia tananyaghoz. Nem könyvrészletek másolatai.
 */
const cards:[string,string][]=[
['Esztétikai nevelés','A művészethez és a zenei élményhez való személyes viszony alakítása.'],
['Zenei képesség','A zenei feladatok megoldásához szükséges, fejleszthető feltételrendszer.'],
['Zenei készség','A gyakorlással biztonságossá, részben automatizálttá váló zenei tevékenység.'],
['Relatív hallás','Hangok és hangközök viszonyának felismerése összehasonlító hang alapján.'],
['Belső hallás','A hangzó minta elképzelése közvetlen megszólalás nélkül.'],
['Transzferhatás','A tanulás egy területének lehetséges hatása másik teljesítményterületre.'],
['Korreláció','Két mért jelenség együttjárása; önmagában nem igazolja az okságot.'],
['Kodály-koncepció','Átfogó, éneklésközpontú zenei nevelési szemlélet, nem egyetlen rögzített módszer.'],
['Zenei anyanyelv','A gyermek saját kulturális közegének énekes-zenei hagyománya.'],
['Aktív éneklés','A tanulók saját hanggal végzett, tudatos és örömteli zenélése.'],
['Órafázis','A tanóra egy célhoz rendelt, egymáshoz kapcsolódó tevékenységi egysége.'],
['Énekes köszönés','Rövid, énekelt közösségi óraindító keret.'],
['Avizó','Az ének vagy hangszeres megszólalás közös indítását előkészítő jelzés.'],
['Hangképzés','A természetes és kíméletes énekhang fejlesztése.'],
['Intonáció','A zenei hangmagasságok pontos megszólaltatása.'],
['Fejlesztő értékelés','A siker és a következő gyakorlási cél konkrét megnevezése.'],
['Motiváció','A tanulók érdeklődésének és aktív zenei részvételének elősegítése.'],
['Hallás utáni daltanítás','A teljes zenei mintából és részletek utánzásából kiinduló tanulási út.'],
['Jelrendszerről daltanítás','Már ismert hang- és ritmuskészlet tudatos olvasásával történő daltanulás.'],
['Érzékelés','Új zenei jelenség meghallása és megtapasztalása ismert hangzó anyagban.'],
['Tudatosítás','A felismert zenei jelenség megnevezése és jelölésének megtanulása.'],
['Alkalmazás','Új feladathelyzetben önálló felismerés vagy megszólaltatás.'],
['Ritmushunyó','Ritmuskotta eltakarásával végzett belső hallási és emlékezeti játék.'],
['Ritmuskígyó','Rövid ritmussorok folyamatos lánccá összekapcsolása.'],
['Dallamvisszhang','Hallott dallammotívum énekes megismétlése.'],
['Bordun','Egyszerű, tartott vagy ismételt hangokra épülő kíséret a többszólamúság előkészítésében.'],
['Ritmikai kétszólamúság','Két eltérő ritmus egyidejű megszólaltatása.'],
['Kottaolvasás','A lejegyzett zenei jelek hangzásként való belső értelmezése.'],
['Improvizáció','Adott vagy szabad zenei keretben végzett önálló alkotó tevékenység.'],
['Irányított zenehallgatás','Előre kijelölt konkrét zenei szempont megfigyelése hallgatás közben.'],
['Tanmenet','A zenei fejlesztési célok és tananyag hosszabb időre szóló rendszerezése.'],
['Dalcroze-ritmika','A zenei ritmus és mozgás összekapcsolására épülő pedagógiai megközelítés.'],
['Orff-szemlélet','Beszéd, ritmus, mozgás, hangszerjáték és improvizáció kapcsolata.'],
['Differenciálás','Feladatok és segítség igazítása a tanulók eltérő kiinduló szintjéhez.']
];
export const PEDAGOGY_FLASHCARDS:Flashcard[]=cards.map(([term,definition],i)=>({
 id:'pedagogy-f'+String(i+1).padStart(2,'0'),term,definition,category:'Ének-zene tantárgy-pedagógia'
}));
const pairs:[string,string][]=[
 ['Kodály-koncepció','Éneklés és zenei anyanyelv'],['Dalcroze','Zenei ritmus mozgásban'],
 ['Orff','Beszéd, mozgás és egyszerű hangszer'],['Relatív hallás','Hangok közötti viszony'],
 ['Belső hallás','Hangzás elképzelése megszólalás nélkül'],['Avizó','Közös kezdőjelzés'],
 ['Ritmushunyó','Kitakart ritmusrészlet felidézése'],['Ritmuskígyó','Ritmussorok folyamatos lánca'],
 ['Hallás utáni tanítás','Énekes bemutatás és utánzás'],['Jelrendszerről tanítás','Ismert jelekből zenei olvasás'],
 ['Érzékelés','Új elem hangzásbeli megtapasztalása'],['Tudatosítás','Zenei jelenség elnevezése'],
 ['Alkalmazás','Felismert elem új feladatban'],['Dallamvisszhang','Énekelt minta megismétlése'],
 ['Bordun','Egyszerű hangzó kíséret'],['Kánon','Időben eltolva kezdett azonos dallam'],
 ['Intonáció','Hangmagasság pontos megszólaltatása'],['Fejlesztő értékelés','Konkrét zenei visszajelzés'],
 ['Metrum','Súlyos és súlytalan ütemrészek rendje'],['Improvizáció','Önálló zenei döntés szabályozott keretben'],
 ['Irányított zenehallgatás','Célzott megfigyelés a hallott műben'],['Óravázlat','Konkrét tanóra tevékenységei és céljai'],
 ['Tanmenet','Hosszabb távú zenei fejlődési terv'],['Transzfer','Lehetséges hatás más teljesítményterületre'],
 ['Korreláció','Együttjárás, nem önmagában ok-okozat'],['Önértékelés','Saját zenei fejlődés megfigyelése']
];
export const PEDAGOGY_MATCHING:MatchingPair[]=pairs.map(([term,match],i)=>({
 id:'pedagogy-m'+String(i+1).padStart(2,'0'),term,match,category:'Ének-zene tantárgy-pedagógia'
}));
const items:[string,string,string,string,string,string][]=[
 ['Mi a zenei nevelés egyik elsődleges célja?','Élményszerű, aktív zenei kapcsolat kialakítása','Csak a dalcímek bemagoltatása','A kották színeinek felismerése','Kizárólag gyors kottamásolás','A zene művészi befogadása és az aktív zenélés alapvető cél.'],
 ['Mit jelent a készség a zenei fejlődésben?','Gyakorlással biztonságossá váló részművelet','Egyszeri véletlenszerű siker','Csak veleszületett tehetség','A dal eredeti hangneme','A gyakorlással bizonyos zenei műveletek részben automatizálódhatnak.'],
 ['Melyik fejlesztési lépés történjen előbb egy új ritmusképletnél?','Hangzó érzékelés ismert dalban','A definíció vakon másolása','Azonnali dolgozatírás','Ismeretlen ritmusnév memorizálása','A hangzó tapasztalat előzi meg a jelölés tudatosítását.'],
 ['Melyik állítás igaz a relatív hallásról?','Összehasonlító hanghoz viszonyított hangkapcsolatokat követ','Kizárólag abszolút hangneveket ismer','Csak hangos énekléssel fejleszthető','Azonos a zongorázási technikával','A viszonyokra épülő hallási tájékozódás pedagógiailag fejleszthető.'],
 ['Mit nem bizonyít önmagában a két képesség közötti korreláció?','Az egyik képesség okozza a másik javulását','Együtt járhat a két mérés','Kapcsolat mutatható ki','Lehetnek közös háttértényezők','Együttjárásból nem következik automatikusan ok-okozat.'],
 ['Melyik illik a Kodály-koncepcióhoz?','Az ismeret előtt aktív, hangzó zenei élmény','A teljes zeneoktatás kizárólag kottamásolás','A gyermekhang rendszeres túlterhelése','A mozgás teljes tiltása','Az énekes tapasztalat és a fokozatos tudatosítás alapelv.'],
 ['Mit jelent az „énekes köszönés”?','Rövid, ismert dallammal adott közösségi óraindítás','A tanulók teljesítményének leosztályozása','Hangos ritmusdiktálás','Csak tanári monológ','A rövid, megszokott zenei keret segíthet az órára hangolódásban.'],
 ['Mire szolgál az avizó?','Az ének közös kezdetének előkészítésére','Egy dal végleges törlésére','A szolmizáció helyettesítésére','Kizárólag a hangerő emelésére','Az indítójel a közös tempó és belépés biztonságát segíti.'],
 ['Mi helyes hangképzési szempontból?','Kíméletes hangadás, kényelmes fekvés','Állandó, erőltetett forte','A legmagasabb hangok gyakori kiabálása','Levegővétel teljes elhagyása','A gyermekhang természetes és biztonságos fejlesztése elsődleges.'],
 ['Milyen a fejlesztő értékelés?','Konkrét sikerre és következő célra mutat rá','Általános megszégyenítés','Csak osztályzatot közöl','Csak a hibákat sorolja fel','A pontos visszajelzés segíti a következő önálló gyakorlást.'],
 ['Mi előzze meg a hallás utáni daltanítás részletezését?','A dal egészének muzikális bemutatása','A szöveg minden betűjének diktálása','Egy hangnemteszt','Az értékelőlap kiosztása','A teljes dal élménye adja a részletek összefüggését.'],
 ['Mikor célravezető a jelrendszerről történő daltanítás?','Amikor a szükséges ritmikai és dallami készlet már ismert','Mindig, a kezdő készlettől függetlenül','Csak szöveg nélküli dalokban','Csak zenehallgatás után','Az olvasott jelnek belső hallási képzettel kell összekapcsolódnia.'],
 ['Mit jelent a „tudatosítás” az új zenei ismeretnél?','A hangzásból megismert jelenség megnevezése és jelölése','Az ismeretlen elem felolvasás nélküli másolása','A teljes dal elhallgatása','Csak az óra végén adott dicséret','A tudatosítás a korábban érzékelt zenei elem megértése.'],
 ['Mi a „ritmushunyó” célja?','Kitakart ritmus felidézése belső hallással','Dallam átírása más hangnembe','Hangszerek beállítása','Kizárólag gyorsasági verseny','A hiányzó zenei részlet emlékezeti pótlása figyelmet igényel.'],
 ['Mi a „ritmuskígyó”?','Ritmussorok megszakítás nélküli összefűzése','A hangjegyfejek körberajzolása','Egyetlen hang hosszan tartása','A hangszerek elnevezése','Az egymás után kapcsolt ritmusminták folyamatos mérőtartást kívánnak.'],
 ['Mi segíti a többszólamúság előkészítését?','Egyszerű bordun, osztinátó, majd kánon','Az éneklés teljes megszüntetése','A dallam állandó hangnemváltása','Kizárólag szövegmondás','Az önálló szólamtartás fokozatosan, egyszerű kísérettel épülhet fel.'],
 ['Miért hasznos a dallamvisszhang?','Hallási figyelmet és dallamemlékezetet fejleszt','Kizárólag hangerőt mér','Megmutatja a zeneszerző születési helyét','Megtiltja a hangmagasság-változást','A hallott fordulat pontos énekelt visszaadása több készséget összekapcsol.'],
 ['Mi a kottaolvasás fontos feltétele?','A jelhez belsőleg elképzelhető hangzás kapcsolódjék','Csak a hangjegyek számolása','A tanuló soha ne énekeljen','Csak az íráskép alakja számít','A zenei olvasás a jelek hangzó értelmezését jelenti.'],
 ['Melyik alkalmas improvizáció kezdő feladatnak?','Kétütemes ritmuskérdésre saját válasz','Nehéz atonális mű azonnali komponálása','Kizárólag tanári dallam másolása','A többi tanuló hallgatásának tiltása','A kötött, ismert ritmuskészlet biztonságos alapot ad saját ötlethez.'],
 ['Mire irányulhat az első zenehallgatási feladat?','Egy felismerhető hangszerhangra vagy visszatérő témára','Tíz történeti adat egyszerre megtanulására','A felvétel teljes jegyzőkönyvezésére','Minden hang megnevezésére','A kevés, pontos megfigyelési szempont segíti a tudatos hallgatást.'],
 ['Mit tartalmazzon a tanmenet?','Fokozatos zenei célokat, anyagot és ismétlést','Csak a dátumok felsorolását','Kizárólag a fegyelmezési szabályokat','Csak vizsgaeredményeket','A hosszabb távú fejlődést az órák közötti kapcsolat teszi követhetővé.'],
 ['Melyik irányzatban központi a zenei ritmus testi átélése?','Dalcroze-ritmika','Klasszikus partitúraolvasás','Elektronikus hangrögzítés','Kottanyomtatás','Dalcroze megközelítésében az időbeli viszonyok mozgással tapasztalhatók.'],
 ['Melyik párosítás illik az Orff-szemlélethez?','Beszédritmus és egyszerű hangszeres játék','Csak passzív műhallgatás','Kizárólag zeneelméleti definíciók','Mozgás nélküli ritmusolvasás','A beszéd, ritmus, mozgás, hangszer és improvizáció összekapcsolódhat.'],
 ['Mi a differenciálás célja az énekórán?','A feladat nehézségének igazítása a tanulók fejlődési szintjéhez','Mindenki számára azonos erőltetett hangterjedelem','A bizonytalan énekesek kizárása','Csak a gyors tanulók szerepeltetése','A gyermekek eltérő kiinduló szintjéhez igazított tanulási utak eredményesebbek.'],
 ['Mit célszerű tenni ritmushibánál?','Megfigyelni, a mérő, a jel vagy az emlékezet okozza-e','Mindig gyorsítani a tempót','Azonnal lezárni a feladatot','Mindig hangnemet váltani','A nehézség pontos azonosítása segíti a célzott javítást.'],
 ['Mi az ismert dallam és a kotta kapcsolatának jó sorrendje?','Hangzó élmény, felismerés, jelölés, alkalmazás','Jelölés, számonkérés, majd első ének','Az összes jel megtanulása zenélés nélkül','Csak a ritmusnevek memoriterezése','A hallási tapasztalat megalapozza az írásos szimbólum értelmét.'],
 ['Mi teszi fejlesztővé a zenehallgatást?','Megfigyelés és visszatérés a konkrét hangzó eseményhez','Csak életrajzi adatok sorolása','A felvétel alatti folyamatos beszéd','A mű meghallgatásának mellőzése','A tanuló saját hallási bizonyíték alapján értelmezi a zenét.'],
 ['Mi segíti a dallam belső hallásának fejlesztését?','Ismert dallamrész némán történő továbbéneklése','Hangszerek puszta felsorolása','A hangjegyfejek kiszínezése','A dal szövegének gépelése','A belső hallást ismert rövid motívumok gondolati felidézése fejlesztheti.']
];
export const PEDAGOGY_QUIZZES:QuizQuestion[]=items.map(([question,correct,a,b,c,explanation],i)=>{
 const answers=[correct,a,b,c],shift=i%4;
 return {id:'pedagogy-q'+String(i+1).padStart(2,'0'),chapterId:'pedagogia',question,
  options:answers.map((_,j)=>answers[(j+4-shift)%4]),correctIndex:shift,explanation};
});
