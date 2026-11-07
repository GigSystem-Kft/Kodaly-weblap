/**
 * Korszakonként önálló, rövid zenehallgatási és önellenőrző műhely.
 * A tanulói kérdések és megoldások saját megfogalmazású összefoglalók.
 * A történeti tényanyaghoz lásd a musicHistory.ts korszakonkénti forráslinkjeit.
 */
export interface HistoryWorkshop {
  periodId: string;
  goals: string[];
  context: string[];
  steps: string[];
  question: string;
  modelAnswer: string;
  furtherPractice: string;
}
export const HISTORY_WORKSHOPS:HistoryWorkshop[]=[
 {periodId:'kezdetek',
  goals:['Különbséget tesz írott forrás, régészeti tárgy és feltételezett hangzó gyakorlat között.','Megfogalmazza, miért korlátozott az ókori zene rekonstruálhatósága.'],
  context:[
   'Az ókori hangszereket, rítusokat és a zenéről szóló gondolkodást többnyire nem teljes hangzó művek, hanem fennmaradt szövegek, képi ábrázolások, eszközök és ritka lejegyzések segítségével vizsgáljuk. A mai előadások ezért gyakran kutatáson alapuló rekonstrukciók, nem közvetlen hangfelvételek egykori előadásokról.',
   'A görög elméleti hagyományban a hangközviszonyok, a zene és a nevelés kapcsolata fontos kérdés volt. A történeti források értelmezésénél azonban külön kell választani a későbbi korok elképzeléseit attól, amit közvetlen ókori dokumentum támaszt alá.'
  ],
  steps:['Válassz egy fennmaradt ókori hangszert ábrázoló forrást.','Jegyezd fel, mely részletek figyelhetők meg közvetlenül.','Hallgass kutatási rekonstrukcióként megjelölt felvételt.','Különítsd el az ellenőrizhető adatot az előadói döntéstől.'],
  question:'Miért nem nevezhető egy mai ókori zenei rekonstrukció hiteles hangfelvételnek?',
  modelAnswer:'Mert az eredeti hangzó esemény nem maradt fenn; a mai megszólalás töredékes írott, tárgyi és elméleti források értelmezésére épül.',
  furtherPractice:'Vess össze két eltérő rekonstrukciót ugyanarról a fennmaradt dallamról: mely előadói döntések különböznek?'
 },
 {periodId:'kozepkor',
  goals:['Megkülönbözteti az egyszólamú liturgikus éneket a korai többszólamúságtól.','Felismeri a kottaírás szerepét a zene továbbörökítésében.'],
  context:[
   'A gregorián ének a latin nyelvű liturgikus gyakorlat több évszázados, változatos repertoárjához tartozik. A monódia egyetlen dallamvonalat jelent, amelyet többen is énekelhetnek egyszerre; ez nem azonos a magányos előadással. A dallamok modális szerveződése és a szöveghez kapcsolódó tagolás fontos elemzési szempont.',
   'A neumaírás korai alakjai emlékeztető jelek voltak, amelyek később egyre pontosabb magasságjelöléshez vezettek. Az organum és más korai többszólamú technikák lehetővé tették az önálló dallamvonalak tudatos együttmozgását. A középkor azonban nem egynemű korszak: a világi és egyházi zene gyakorlatai eltértek.'
  ],
  steps:['Hallgass rövid, egyszólamú latin éneket, és számold a hallható önálló dallamvonalakat.','Hasonlítsd össze korai kétszólamú organummal.','Figyeld meg, a szólamok együtt vagy eltérő ritmussal haladnak.','Mutasd be, hogyan segíti a lejegyzés a megszólaltatás megismételhetőségét.'],
  question:'Mi az egyszólamúság és a korai organum legfontosabb szerkezeti különbsége?',
  modelAnswer:'Az egyszólamúság egyetlen dallamvonalra épül; az organumban legalább két egymáshoz kapcsolódó hangzó szólam szerepel.',
  furtherPractice:'Vizsgáld meg neumaírásos és vonalas kottakép párját: milyen új információ válik pontosan olvashatóvá?'
 },
 {periodId:'reneszansz',
  goals:['Hangzás alapján felismeri az imitáció alapelvét.','Megkülönbözteti az egyenrangú szólammozgást a homofón megszólalástól.'],
  context:[
   'A reneszánsz vokális polifóniában a szólamok gyakran egymás után indítják ugyanazt a dallammotívumot. Az imitáció felismeréséhez a hallgató nem feltétlenül érti a teljes partitúrát: elég ugyanazt a jellegzetes motívumkezdetet több szólam belépésekor megfigyelnie.',
   'A kórushangzásban a szöveg érthetősége, a disszonancia kezelése és a szólamok közötti egyensúly fontos szerkesztési kérdések. A reneszánsz motetta és mise mellett a világi madrigál is alkalmas annak bemutatására, hogyan kapcsolódhat a zenei gesztus a szöveg kifejezéséhez.'
  ],
  steps:['Hallgass rövid reneszánsz motetta-részletet.','Jelezz kézemeléssel, amikor az első motívum új szólamon belép.','Jelöld meg a szólamok közös, akkordszerű megállását.','Beszéljétek meg, hol hallható a szöveg kiemelése.'],
  question:'Mi az imitáció a reneszánsz többszólamúságban?',
  modelAnswer:'Egy jellegzetes dallamfordulat egymást követő belépése több önálló szólamban, rendszerint eltérő hangmagasságról.',
  furtherPractice:'Hasonlíts össze madrigált és motettát a szöveg jellegének és a zenei kifejezésnek a szempontjából.'
 },
 {periodId:'barokk',
  goals:['Megfigyeli a szóló és tutti közötti kontrasztot.','Megfogalmazza a basso continuo és a fúga alapvető szerepét.'],
  context:[
   'A barokk zenében a basso continuo a mély basszusvonalhoz társuló, harmonikus kíséreti gyakorlatot jelenti. A kor előadói nem minden esetben azonos hangszerekkel szólaltatták meg: a darab műfajától és környezetétől függően változhatott az apparátus. Ezt fontos elkülöníteni a modern, teljesen rögzített hangszereléstől.',
   'A fúgában a tárgy és a különféle szólamokban megjelenő belépések önálló zenei folyamatot alkotnak. A barokk concerto ezzel szemben gyakran a szóló és a zenekari tutti közötti váltásra épül; a két technika ugyanabban a korszakban is más-más szerkesztési célt szolgál.'
  ],
  steps:['Hallgass barokk versenyműből részletet.','Jelöld a szóló és a teljesebb zenekari megszólalás váltását.','Ezután figyelj egy fúgatárgy ismételt belépéseire.','Fogalmazd meg, miben tér el a két megszólalás zenei szervezése.'],
  question:'Mit jelent a basso continuo?',
  modelAnswer:'Basszusvonalra épülő, harmóniákat is megvalósító kíséreti gyakorlat; a szólamot korabeli előadási szokások szerint különféle hangszer-összeállítás szólaltathatta meg.',
  furtherPractice:'Hallgass egy Vivaldi-concerto és egy Bach-fúga rövid részletét; írd le a hallható szerkesztési különbségeket.'
 },
 {periodId:'klasszika',
  goals:['Felismeri a formai tagolás, kérdés–felelet és tematikus kontraszt szerepét.','Megfigyeli a szonátaforma expozíciójának alapelvét.'],
  context:[
   'A bécsi klasszika zenéjében gyakori a jól elkülönülő frázis és a ritmikus-motivikus építkezés. A szonátaforma azonban nem minden zeneműve azonos merev képlet: egy első tétel expozíciója többféleképpen alakíthatja a témákat és a hangnemeket.',
   'A klasszikus szimfónia és vonósnégyes hallgatásakor érdemes elkülöníteni a tematikus anyag megjelenését, ismétlődését és átalakulását. A hangszerelés és a dinamika kontrasztja is jelölhet szerkezeti fordulópontot, de önmagában nem bizonyít tematikus változást.'
  ],
  steps:['Hallgass klasszikus szonátatétel expozíciójából rövid részletet.','Jegyezd le az első fontos motívum ritmikai jellegét.','Figyeld meg, mikor jelentkezik új dallamkarakter.','Próbáld a későbbi visszatérésben felismerni az első motívumot.'],
  question:'Mi a tematikus kontraszt szerepe egy klasszikus első tételben?',
  modelAnswer:'A különböző karakterű zenei anyagok elkülönülése segíti a hallgatót a formai szerveződés és a későbbi visszatérések felismerésében.',
  furtherPractice:'Állíts össze egyszerű hangzó formai térképet egy rövid Mozart- vagy Haydn-tételhez.'
 },
 {periodId:'romantika',
  goals:['Hallja a gazdagabb hangszerelés és a kifejező forma különböző lehetőségeit.','Megkülönbözteti a programzene és az abszolút zene fogalmát.'],
  context:[
   'A romantikus zenei nyelvben a műfaji és kifejezésbeli sokféleség legalább olyan fontos, mint a kibővülő zenekari hangzás. A műdalban a költői szöveg és a zongoraszólam együtt alakíthatja a karaktert; a szimfonikus költeményben pedig irodalmi, természeti vagy filozófiai tartalom válhat szervező ösztönzővé.',
   'A kromatikus harmóniák, a távolabbi hangnemi kapcsolatok és a formai rugalmasság önmagukban nem teszik „romantikussá” a művet: a zeneszerzői szándékot, műfajt és történeti helyzetet együtt kell értelmezni. A programzene cím vagy szöveges elképzelés révén nyújthat értelmezési keretet, de nem kell minden hangot konkrét történéshez kötni.'
  ],
  steps:['Hallgass romantikus műdalrészletet, és jegyezd meg a zongorakíséret hangulatát.','Vizsgáld meg, mi változik, ha csak a dallamot figyeled.','Hasonlítsd össze egy programot megjelölő zenekari mű rövid részletével.','Fogalmazd meg, mely hangzási elemek segítik a zenei karakter megértését.'],
  question:'Miben különbözik a programzene és az abszolút zene fogalma?',
  modelAnswer:'A programzene zenén kívüli gondolati, képi vagy elbeszélő kapcsolódást jelölhet meg; az abszolút zene értelmezésének elsődleges kerete magának a zenei szerkezetnek a vizsgálata.',
  furtherPractice:'Válassz Schubert-műdalt, és térképezd fel, hogyan viszonyul egymáshoz az énekszólam és a zongorakíséret.'
 },
 {periodId:'huszadik',
  goals:['Felismeri, hogy a 20. századi zene nem egységes stílus.','Megkülönbözteti a népzenei feldolgozást, a hangszínközpontú és a szeriális gondolkodás alapjait.'],
  context:[
   'A 20. század zenetörténete nem egyetlen fejlődési vonal: párhuzamosan élt egymás mellett a folklórból táplálkozó komponálás, a tonalitás különböző újraértelmezése, a tizenkétfokúság, a jazzhez kapcsolódó zenei kultúrák és a kísérleti hangzásvilág. A hangzó példák kiválasztásakor a stílusbeli sokszínűség fontosabb egyetlen „modern zene” címke használatánál.',
   'A hangrögzítés, az elektronikus hangszerek és a digitális eszközök új előadási és komponálási lehetőségeket teremtettek. Bartók és Kodály munkássága a népzene gyűjtésének és művészi feldolgozásának kapcsolatát is példázza, de külön kell választani a tudományos gyűjtést, az eredeti népzenei gyakorlatot és a komponált művet.'
  ],
  steps:['Hallgass Bartók-műrészletet, és azonosíts ritmikai vagy hangkészletbeli sajátosságot.','Hasonlítsd össze egy elektronikus hangzású rövid részlettel.','Jegyezz fel három eltérő szervezési elvet, ne pusztán hangulatjelzőket.','Beszéljétek meg, hogyan módosítja az előadás módját a hangtechnika.'],
  question:'Miért pontatlan a 20. századi zenét egyetlen stílusként kezelni?',
  modelAnswer:'Mert számos eltérő kompozíciós és előadási gyakorlat élt párhuzamosan, a népzenei feldolgozástól a szeriális és elektronikus zenéig.',
  furtherPractice:'Készíts forrásmegjelölt, háromrészes hallgatási összehasonlítást a népzenei, klasszikus modern és elektronikus megközelítésről.'
 }
];
