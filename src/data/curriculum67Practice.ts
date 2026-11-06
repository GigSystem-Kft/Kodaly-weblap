import type { Flashcard, MatchingPair, QuizQuestion } from '../types';

/** Egyedi oktatási feladatok a 06. Kreatív és 07. Zenetörténet fejezethez.
 * Az eredeti öt fejezet és a korábbi feladatok érintetlenek maradnak.
 */
const cards: [string,string,string][] = [
  ['Mérőérzék','Egyenletes lüktetés biztos érzékelése és tartása.','Kreatív zenei nevelés'],
  ['Metrumérzék','A hangsúlyos és hangsúlytalan ütemrészek érzékelése.','Kreatív zenei nevelés'],
  ['Testritmus','A test mozdulataival megszólaltatott ritmus.','Kreatív zenei nevelés'],
  ['Ritmusvisszhang','Rövid ritmusminta hallás utáni megismétlése.','Kreatív zenei nevelés'],
  ['Motívum','Önállóan felismerhető, rövid zenei gondolat.','Kreatív zenei nevelés'],
  ['Osztinátó','Visszatérően ismétlődő ritmikai vagy dallami minta.','Kreatív zenei nevelés'],
  ['Szoborjáték','Mozdulattartással vagy váltással figyeltet meg szünetet.','Kreatív zenei nevelés'],
  ['Labdajáték szinkópára','A labdát csak a szinkópás ritmusképletnél adhatjuk tovább.','Kreatív zenei nevelés'],
  ['Dallamjárás','A dallam emelkedését és ereszkedését követő mozgás.','Kreatív zenei nevelés'],
  ['Mozgásos formajelölés','Az ismétlődő motívumot ugyanazzal a mozdulattal jelöljük.','Kreatív zenei nevelés'],
  ['Belső lüktetés','A mérő tartása külső hangjelzés nélkül is.','Kreatív zenei nevelés'],
  ['Irányított zenehallgatás','Konkrét hallási megfigyelési szemponttal vezetett zenehallgatás.','Kreatív zenei nevelés'],
  ['Quodlibet','Két egymással összeillő, önálló dallam egyidejű megszólalása.','Kreatív zenei nevelés'],
  ['Ritmikai kétszólamúság','Két különböző ritmusszólam egyidejű hangoztatása.','Kreatív zenei nevelés'],
  ['Hallgatási megfigyelés','Olyan kérdés, amely a tanuló figyelmét egy zenei jelenségre irányítja.','Kreatív zenei nevelés'],
  ['Szeikilosz-sírfelirat','Ókori görög dallam lejegyzésével fennmaradt emlék.','Zenetörténet'],
  ['Gregorián ének','A nyugati keresztény liturgia hagyományos, többnyire egyszólamú éneke.','Zenetörténet'],
  ['Neuma','A középkori dallamlejegyzés korai jelölésmódja.','Zenetörténet'],
  ['Organum','Korai többszólamú énekszerkesztési forma.','Zenetörténet'],
  ['Imitáció','Egy motívum egymás utáni megszólalása több szólamban.','Zenetörténet'],
  ['Reneszánsz madrigál','Világi, rendszerint többszólamú énekes műfaj.','Zenetörténet'],
  ['Basso continuo','Barokk basszusszólam és hozzá tartozó harmóniakíséret.','Zenetörténet'],
  ['Ritornelló','Visszatérő zenei rész, gyakran versenyműben.','Zenetörténet'],
  ['Fúga','Téma egymást követő szólam-belépéseire épülő kontrapunktikus szerkesztés.','Zenetörténet'],
  ['Szonátaforma','Expozícióra, kidolgozásra és reprízre épülő formaelv.','Zenetörténet'],
  ['Vonósnégyes','Két hegedűből, brácsából és csellóból álló kamaraegyüttes.','Zenetörténet'],
  ['Műdal','Művészi igényű énekes darab, többnyire hangszerkísérettel.','Zenetörténet'],
  ['Szimfonikus költemény','Egytételes zenekari mű, gyakran programzenei tartalommal.','Zenetörténet'],
  ['Atonalitás','A hagyományos hangnemi középpontot kerülő zenei szerveződés.','Zenetörténet'],
  ['Minimalizmus','Rövid minták ismétlésére és fokozatos változására épülő irányzat.','Zenetörténet']
];
export const NEW_FLASHCARDS: Flashcard[] = cards.map(([term,definition,category], index)=>({
  id:'curriculum67-f'+String(index+1).padStart(2,'0'),term,definition,category
}));

const pairs: [string,string,string][] = [
  ['Mérőérzék','Egyenletes lüktetés megtartása','Kreatív zenei nevelés'],
  ['Metrumérzék','Súlyos ütemrész felismerése','Kreatív zenei nevelés'],
  ['Testritmus','Taps, dobbantás és testérintés','Kreatív zenei nevelés'],
  ['Szünet-szobor','Mozdulattal jelölt szünet','Kreatív zenei nevelés'],
  ['Szinkópás labda','Továbbadás a szinkópa helyén','Kreatív zenei nevelés'],
  ['Motívumváltás','Változás a dallamrész kezdetén','Kreatív zenei nevelés'],
  ['Osztinátó','Állandóan ismétlődő kísérőminta','Kreatív zenei nevelés'],
  ['Quodlibet','Két összeillő dallam egyszerre','Kreatív zenei nevelés'],
  ['Ritmusvisszhang','Hallott ritmus megismétlése','Kreatív zenei nevelés'],
  ['Irányított hallgatás','Célzott hallási szempont követése','Kreatív zenei nevelés'],
  ['Dallamjárás','Hangmagasságok követése mozgással','Kreatív zenei nevelés'],
  ['Formaérzék','Motívumok visszatérésének felismerése','Kreatív zenei nevelés'],
  ['Szeikilosz','Ókori görög lejegyzett dallam','Zenetörténet'],
  ['Gregorián','Középkori liturgikus egyszólamúság','Zenetörténet'],
  ['Organum','A korai európai többszólamúság','Zenetörténet'],
  ['Madrigál','Reneszánsz világi vokális műfaj','Zenetörténet'],
  ['Imitáció','Motívum átvétele egy másik szólamban','Zenetörténet'],
  ['Basso continuo','Barokk basszus- és harmóniakíséret','Zenetörténet'],
  ['Concerto','Szóló és zenekar kontrasztja','Zenetörténet'],
  ['Fúga','Téma egymást követő szólamokban','Zenetörténet'],
  ['Szonátaforma','Expozíció, kidolgozás, repríz','Zenetörténet'],
  ['Vonósnégyes','Két hegedű, brácsa, cselló','Zenetörténet'],
  ['Szimfonikus költemény','Romantikus programzenei zenekari mű','Zenetörténet'],
  ['Minimalizmus','Ismételt minták fokozatos változása','Zenetörténet']
];
export const NEW_MATCHING: MatchingPair[] = pairs.map(([term,match,category],index)=>({
  id:'curriculum67-m'+String(index+1).padStart(2,'0'),term,match,category
}));

const questions: [string,string,string,string,string,string][] = [
  // question, correct, distractor1, distractor2, distractor3, explanation
  ['Mit fejleszt a lüktetésre történő egyenletes járás?','Mérőérzéket','Dallamhangmagasságot','Hangszertörténetet','Hangszerelést','A mozdulat az egyenletes mérő tudatosítását segíti.'],
  ['Mi a szinkópára épülő labdajáték legfontosabb szabálya?','A labdát csak a szinkópánál adjuk tovább','A labdát mindig a dal elején adjuk tovább','A labda mindig minden negyedre pattan','A labdát csak a zene után használjuk','A mozdulatnak a jellegzetes ritmusképlettel kell egybeesnie.'],
  ['Miért hasznos a szoborjáték a szünet tanításához?','A mozdulatváltás pontos helyét tudatosítja','Gyorsabban énekelnek tőle a tanulók','Megtanítja a hangnemeket','A szünetet hanggal tölti ki','Az ének folyamatában a szünetet kell pontosan felismerni.'],
  ['Mit figyelünk a motívumváltó mozgásos játékban?','Az új dallammotívum kezdetét','A hangszerek számát','Az énekes ruházatát','A zeneszerző születési évét','A mozdulatváltás a zenei forma kisebb egységeit jelöli.'],
  ['Mi a metrumérzéket fejlesztő játék célja?','Ütemsúlyok felismerése','Csak a gyors éneklés','Csak a hangszín megváltoztatása','Szólamok számolása','A súlyos és súlytalan ütemrészek érzékelését fejleszti.'],
  ['Melyik mozgás lehet testritmus?','Taps és combérintés','Kottanyomtatás','Dallam átírása más hangnembe','Hangszerhangolás','A testritmus a test mozdulataival alkot hangzó ritmust.'],
  ['Mit jelent az osztinátó?','Ismétlődő ritmus- vagy dallamminta','Véletlenszerű hangugrás','Kötelező hangerőváltás','Zenei szünet a mű végén','Az osztinátó visszatérő kísérő vagy önálló minta.'],
  ['Mit fejleszt a két csoportban hangoztatott különböző ritmus?','Ritmikai önállóságot és megosztott figyelmet','Csak tempógyorsítást','Csak szövegmemóriát','Csak szolmizálást','A saját ritmus megtartása a másik szólam mellett fontos készség.'],
  ['Mi a quodlibet gyakorlati lényege?','Két összeillő dallam egyidejű éneklése','Az összes hang uniszónóban','Egy dal teljes elhagyása','Kizárólag hangszeres improvizáció','A két dallam párhuzamos megtartását kell gyakorolni.'],
  ['Mi a helyes sorrend az irányított zenehallgatásnál?','Hallgatás, megfigyelés, megbeszélés','Rögtön osztályzatot adunk','Csak a zeneszerző nevét kérdezzük','Hangosan beszélgetünk a zene alatt','A tudatos hallgatást konkrét megfigyelési kérdés segíti.'],
  ['Mi segíti a dallamirány megélését?','Hangmagassághoz rendelt mozdulat','A kottapapír színe','Az ülésrend','A terem hőmérséklete','A mozgás követheti a dallam emelkedését és ereszkedését.'],
  ['Mit ellenőrzünk egy mérőjátéknál irányváltáskor?','Megmarad-e az egyenletes lüktetés','Megváltozik-e a dal címe','Nő-e a szólamok száma','Megszűnik-e az összes mozdulat','A lüktetés megtartása jelzi a mérő biztos érzékelését.'],
  ['Melyik ókori zenei emlékhez maradt fenn lejegyzett dallam?','Szeikilosz sírfelirata','Bach: A fúga művészete','Mozart: Requiem','Chopin: Noktürn','A sírfelirat hangjelöléseket és énekszöveget őrzött meg.'],
  ['Melyik jellemző a gregorián énekre?','Liturgikus, jellemzően egyszólamú ének','Klasszikus szimfónia','Elektronikus hangmontázs','Romantikus zongoraverseny','A gregorián a nyugati egyházi ének hagyományához kötődik.'],
  ['Mi az organum?','A korai többszólamúság egyik típusa','Egy romantikus zongoradarab','Egy barokk tánc neve','Elektronikus hangszer','Az organum meglévő dallamhoz társított szólamokat.'],
  ['Mit jelent az imitáció a reneszánsz polifóniában?','Motívum átvétele másik szólamban','Egy hang állandó kitartása','Teljes csend a darab elején','Csak hangszerek nélkül játszható ritmus','A motívumok egymást követő belépésekben hallhatók.'],
  ['Melyik műfaj fontos világi reneszánsz vokális műfaj?','Madrigál','Szimfonikus költemény','Elektronikus etűd','Zongoraverseny','A madrigál a reneszánsz világi többszólamú énekes műfajai közé tartozik.'],
  ['Mi a basso continuo?','Basszushoz tartozó harmonikus kíséret','Egyszólamú népdal','Díszítetlen kóruséneklés','Ritmus nélküli dallam','A continuo a barokk zenei kíséret egyik alapvető módja.'],
  ['Melyik zeneszerző kötődik A négy évszakhoz?','Antonio Vivaldi','Joseph Haydn','Frédéric Chopin','Claude Debussy','Vivaldi hegedűverseny-sorozatának négy darabja az évszakokat jeleníti meg.'],
  ['Melyik három nagy formai szakasz jellemzi a szonátaformát?','Expozíció, kidolgozás, repríz','Intró, kuplé, refrén','Kyrie, Gloria, Credo','Prelúdium, passacaglia, kóda','A szonátaforma tipikus nagyszerkezete expozícióból, kidolgozásból és reprízből áll.'],
  ['Milyen hangszerösszeállítás a klasszikus vonósnégyes?','Két hegedű, brácsa, cselló','Fuvola, oboa, klarinét, fagott','Négy zongora','Két trombita és két harsona','A vonósnégyes alapfelállása két hegedű, brácsa és cselló.'],
  ['Ki jelentős magyar romantikus zeneszerző és zongoravirtuóz?','Liszt Ferenc','Pérotin','Guido d’Arezzo','Palestrina','Liszt Ferenc a 19. századi zongorairodalom és szimfonikus költemény fontos alakja.'],
  ['Melyik művéről ismert Stravinsky a ritmikai hangsúlyok miatt?','Tavaszi áldozat','A négy évszak','Egy kis éji zene','Szeikilosz-sírfelirat','A Tavaszi áldozat szokatlan ritmikai szerveződése fontos modernista újítás.'],
  ['Mi jellemző a minimalizmus egyik fontos zenei eljárására?','Rövid minták ismétlése és fokozatos változása','Kizárólag egyszólamú gregorián dallam','Csak hagyományos operai áriák','Minden hang egyszerre szól','A minimalizmus gyakran ismétléses mintákból építkező formai folyamat.']
];
export const NEW_QUIZZES: QuizQuestion[] = questions.map(([question,correct,...rest],index)=>({
  id:'curriculum67-q'+String(index+1).padStart(2,'0'),
  chapterId:index<12?'kreativ':'zenetortenet',
  question,
  options: [correct,rest[0],rest[1],rest[2]].map((_, pos, array) => array[(pos + 4 - (index % 4)) % 4]),
  correctIndex: index % 4,
  explanation:rest[3]
}));
