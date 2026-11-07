/** Forrásmegjelölt, önállóan írt kiegészítés az 01–05. fejezetekhez.
 * Alapművek:
 * - Open Music Theory (Shaffer–Hughes–Moseley et al.), CC BY-SA 4.0:
 *   https://quadriviumpress.com/musicTheory/
 * - Robert Hutchinson, Music Theory for the 21st-Century Classroom:
 *   https://musictheory.pugetsound.edu/mt21c/
 * - Edinburgh University, Fundamentals of Music Theory:
 *   https://open.ed.ac.uk/fundamentals-of-music-theory-open-textbook/
 * Az alábbi pedagógiai megfogalmazások nem szó szerinti fordítások.
 */
export interface FoundationsGuide {
  chapterId:string;
  objectives:string[];
  sections:{title:string;paragraphs:string[]}[];
  guidedPractice:string[];
  commonMistakes:string[];
  selfCheck:{question:string;answer:string}[];
  sources:{title:string;url:string;note:string}[];
}
const openTheory='https://quadriviumpress.com/musicTheory/';
const hutchinson='https://musictheory.pugetsound.edu/mt21c/';
const edinburgh='https://open.ed.ac.uk/fundamentals-of-music-theory-open-textbook/';
export const FOUNDATIONS_GUIDES:FoundationsGuide[]=[
 { chapterId:'ritmus',
  objectives:['A ritmusértékek időarányainak hangzó és írásos azonosítása.','Az egyszerű és az összetett metrum közötti különbség hallási megfigyelése.','Önálló ritmusalkotás és hibajavítás egyenletes lüktetésben.'],
  sections:[
   {title:'A mérő és a ritmus két különböző réteg',paragraphs:[
    'A mérő vagy pulzus a zenei időben viszonyítási pontot jelentő, többnyire egyenletes lüktetés. A ritmus ezzel szemben a hangok és szünetek tényleges időbeli elrendezése: lehet a mérővel azonos, de el is térhet tőle. Egy zeneműben a mérő érzete akkor is fennmaradhat, amikor egy szólam nem szólal meg minden lüktetésnél.',
    'Gyakorlat közben az egyik kézzel egyenletes negyedeket kopoghatunk, a másikkal pedig különböző ritmusképleteket tapsolhatunk. Ha a két mozdulat szétcsúszik, célszerű lassabb tempóban, rövidebb egységekkel újrakezdeni.'
   ]},
   {title:'Ritmusértékek és pontozás',paragraphs:[
    'A szabványos zenei időértékek egymással kettő-egy arányban állnak: egy egész két félnek, egy fél két negyednek, egy negyed két nyolcadnak felel meg. A pontozás az eredeti érték felével növeli az időtartamot, tehát a pontozott negyed három nyolcadnyi érték.',
    'A kötőívvel összekapcsolt azonos magasságú hangok időtartama összeadódik; ezt az átkötőívet nem szabad összekeverni a különböző hangok között álló frazeáló ívvel. A hangszünetek időértékei is beleszámítanak az ütem összértékébe.'
   ]},
   {title:'Egyszerű és összetett ütem',paragraphs:[
    'A 2/4, 3/4 és 4/4 jellegzetes egyszerű metrumok, amelyekben egy alaplüktetés kettéosztható. A 6/8 gyakran két, egyenként három nyolcadból álló lüktetési egységre szerveződik; ezért nem feltétlenül hat különálló pulzust hallunk.',
    'A metrum számai az írásos időegységek teljes mennyiségét jelzik, de nem mindig nevezik meg egyértelműen a tényleges hallott pulzust. Döntő a hangsúlyrend és a dallam ritmikai tagolódása.'
   ]},
   {title:'Szinkópa, nyújtott ritmus és triola',paragraphs:[
    'Szinkópában egy hangsúly a metrikailag gyengébb helyre eshet, vagy az ott kezdett hang áthúzódhat a hangsúlyos helyre. A nyújtott ritmus hosszabb értéket rövidebb követ, az éles ritmus ezzel ellentétes időrendet mutat.',
    'A triola három egyenlő időértéket helyez olyan időkeretbe, amelybe szokásosan kettő azonos alapérték férne. Felismeréséhez először az állandó lüktetést, majd az annak megfelelő egyenletes hármas osztást érdemes gyakorolni.'
   ]}
  ],
  guidedPractice:['Tarts negyedlüktetést, és tapsolj rá negyed–két nyolcad–negyed–két nyolcad mintát.','Írj két 3/4-es ütemet háromféle ritmusértékkel, majd számold ellenőrzésként a negyedegységeket.','Hasonlíts össze egy 3/4-es és egy 6/8-os részletet: melyiknél hány fő lüktetési csoportot érzel?','Alkoss négyütemes ritmusválaszt egy kétsoros ritmuskérdésre.'],
  commonMistakes:['Az ütemmutató felső számát automatikusan a hallott főlüktetések számának tekintjük.','A pontozást teljes értékkel történő növelésnek gondoljuk.','A szinkópát egyszerűen „gyors” ritmusként nevezzük meg.'],
  selfCheck:[{question:'Hány nyolcadnyi idő a pontozott negyed?',answer:'Három nyolcadnyi: két nyolcad és egy további nyolcad.'},{question:'Miben más a tipikus 6/8 és a 3/4?',answer:'A 6/8 gyakran két háromrészes lüktetési egységként, a 3/4 három kétrészes egységként hallható.'}],
  sources:[{title:'Open Music Theory – Meter and Rhythmic Values',url:openTheory,note:'Mérő, ritmusértékek, metrum és szinkópa.'},{title:'University of Edinburgh – Fundamentals of Music Theory',url:edinburgh,note:'Ritmus és időbeli szerveződés, nyílt oktatási forrás.'}]
 },
 {chapterId:'hangok-kulcsok',
  objectives:['A G- és F-kulcsban a hangok helyének pontos azonosítása.','A törzshang, módosított hang és enharmonikus hang megkülönböztetése.','A hangnem előjegyzésének és a helyi módosítójel érvényének értelmezése.'],
  sections:[
   {title:'A hangmagasság és az ötvonalas jelölés kapcsolata',paragraphs:[
    'Az ötvonalas rendszer a hangok egymáshoz viszonyított magasságát jeleníti meg, de az önmagában látott vonal nem határozza meg a hang nevét: ehhez kulcsra van szükség. A G-kulcs a második vonal G4 hangját, az F-kulcs a negyedik vonal F3 hangját rögzíti.',
    'A hangok olvasásánál a vonalak és vonalközök váltakozása diatonikus lépéseket jelent. A segédvonalak az öt vonalon kívül is ugyanilyen hangnév-sorrendet tesznek lehetővé; a középső C a G-kulcsban az alsó, F-kulcsban a felső segédvonalon áll.'
   ]},
   {title:'Hangnevek, oktáv és félhanglépések',paragraphs:[
    'A magyar hangnévrendszerben a törzshangok C, D, E, F, G, A, H. A H-tól félhanggal lefelé módosított hang neve B. A C4 és C5 azonos hangosztályba tartozik, de egy oktávnyi hangmagasság-különbséggel szól.',
    'A törzshangok között E–F és H–C természetes félhanglépés van. A kromatikus skála az oktávot tizenkét félhanglépésre osztja az egyenletes temperálás rendszerében, de a hagyományos kottaírás továbbra is különbséget tesz például Fisz és Gesz megnevezése között.'
   ]},
   {title:'Módosítójel és előjegyzés',paragraphs:[
    'A kereszt félhanggal emeli, a bé félhanggal csökkenti a hangot; a feloldójel a hangot az adott hangnév természetes alakjára állítja vissza. Az előjegyzés a kotta elején általános hangmagassági kiindulást ad, a darabon belüli módosítójel viszont meghatározott helyi érvénnyel működik.',
    'G-dúr előjegyzése egy kereszt, a Fisz; F-dúr előjegyzése egy bé, a B; D-dúr előjegyzése két kereszt, a Fisz és Cisz. Az ütemen belüli módosítójel mai közös gyakorlat szerint ugyanazon hangmagasságra és oktávra érvényes az ütemben; a hangazonosságot átkötőív külön is továbbviheti.'
   ]},
   {title:'Enharmónia és zenei helyesírás',paragraphs:[
    'Egyenletes temperálású hangszeren például Fisz és Gesz rendszerint ugyanazon billentyű megszólalásához vezet, mégsem azonos a kottaolvasásban betöltött szerepük. A hangnév hangnemi, skálabeli és harmóniai összefüggést is hordoz.',
    'Egy D-dúr hangsorban Fisz a harmadik fok, nem Gesz. Hangközszámításkor a betűnév a diatonikus fokok számolásában fontos, ezért a hanghelyesírás megtartása nem puszta írásbeli formalitás.'
   ]}
  ],
  guidedPractice:['Nevezd meg a G-kulcs öt vonalát és négy vonalközét alulról felfelé.','Olvasd le F-kulcsban a középső C helyét, majd rajzold meg a G-kulcsban is.','Írd fel D-dúr előjegyzését, és keresd meg a módosított fokokat.','Mutass be azonos megszólalású, de eltérő hangnevű enharmonikus hangpárt.'],
  commonMistakes:['A magyar H és B betűt összekeverjük az angolszász B és B-flat elnevezéssel.','Minden vonal hangját azonosnak gondoljuk különböző kulcsokban.','Az ütem elején álló előjegyzést azonosítjuk minden ütemen belüli módosítójel funkciójával.'],
  selfCheck:[{question:'Mi a G-kulcs második vonalának hangja?',answer:'G4 (egyvonalas g).'}, {question:'Melyik két módosított hang szerepel D-dúrban?',answer:'Fisz és Cisz.'}],
  sources:[{title:'Open Music Theory – Basic Notation and Pitches',url:openTheory,note:'Kottaolvasás, kulcsok, hangmagasság és módosítójelek.'},{title:'Music Theory for the 21st-Century Classroom – Basic Concepts',url:hutchinson,note:'A hangmagasságok és a zenei hangírás alapfogalmai.'}]
 },
 {chapterId:'szolmizacio-hangkozok',
  objectives:['A relatív szolmizációs fokok hangzó felismerése és transzponálása.','A hangköz számának és minőségének önálló meghatározása.','Az összhangzó és disszonáns megszólalás történetileg változó értelmezésének felismerése.'],
  sections:[
   {title:'Relatív szolmizáció mint hangviszony',paragraphs:[
    'A relatív szolmizációban a dó–ré–mi–fá–szó–lá–ti szótagok a hangnemi-funkcionális viszonyokat segítik hallani. C-dúrban a dó C, G-dúrban a dó G; a hangviszonyok és a fokok szerepei azonban megmaradnak transzponáláskor.',
    'A kézjel, a hangzó utánzás és a belső hallás összekapcsolható, de a kézjelek mechanikus elvégzése nem helyettesíti a dallam elképzelését. Az ismert gyermekdal és a rövid motívum jó kiindulás a hangközi viszonyok megértéséhez.'
   ]},
   {title:'Hangköz szám és minőség',paragraphs:[
    'A hangköz számát a hangnevek befoglaló számlálása adja, így C–E terc, C–G kvint. A hangköz minősége a félhangtávolság és a diatonikus hangnevek együttes viszonyából állapítható meg: C–E nagy terc négy félhanggal, C–Esz kis terc három félhanggal.',
    'A tiszta kvart öt, a tiszta kvint hét félhang; a hat félhangos távolságot tritónusznak nevezzük, amely írásmódtól függően bővített kvart vagy szűkített kvint lehet. A hangköz felismerésénél a kottaképet és a hangzást együtt vizsgáljuk.'
   ]},
   {title:'Hangközfordítás és összefüggések',paragraphs:[
    'A fordításnál az egyik hangot oktávval helyezzük át. Az eredeti és a fordított egyszerű hangköz száma kilencet ad: terc–szext, kvart–kvint, szekund–szeptim. A nagy fordított párja kis, a tisztáé tiszta.',
    'A fordítás gyakorlása a dallamképzésben, az akkordfelbontásban és a hangközök felismerésében is segít. Például a C–E nagy terc fordítása E–C kis szext, ha a megfelelő oktávba fordítjuk.'
   ]},
   {title:'Hallás és analitikus gondolkodás',paragraphs:[
    'Egy hangköz a dallamban egymás után, harmóniai helyzetben egyidejűleg is megszólalhat. A hallgatási feladatokat érdemes különválasztani: előbb a felfelé-lefelé irányt, majd a szűkebb-tágabb különbséget, végül a pontos hangközminőséget kereshetjük.',
    'A konszonancia és disszonancia megítélése stílus- és korszakfüggő is. A tiszta kvint fizikai hangközarányait és egy zenetörténeti műben megjelenő funkcióját emiatt ne mossuk össze.'
   ]}
  ],
  guidedPractice:['Énekeld a dó–ré–mi–fá–szó sort C-, majd G-dúrban.','Számold meg a C–Esz és C–E hangközök félhangjait, és nevezd meg őket.','Fordítsd meg az E–G kis tercet, majd nevezd meg a keletkező hangközt.','Hallgass két hangot előbb egymás után, majd egyszerre, és írd le a különbséget.'],
  commonMistakes:['A hangközszámot pusztán a félhangok számának tekintjük.','Az enharmonikus hangok hangközhelyesírását figyelmen kívül hagyjuk.','A szolmizációt minden esetben fix hangneveknek használjuk.'],
  selfCheck:[{question:'Hány félhang a nagy terc és a tiszta kvint?',answer:'Nagy terc: 4 félhang, tiszta kvint: 7 félhang.'},{question:'Mi a nagy terc fordítása?',answer:'Kis szext.'}],
  sources:[{title:'Open Music Theory – Intervals',url:openTheory,note:'Hangközszám, minőség és fordítás.'},{title:'Music Theory for the 21st-Century Classroom – Intervals',url:hutchinson,note:'Hagyományos hangköz-meghatározás és alkalmazások.'}]
 },
 {chapterId:'hangkeszletek',
  objectives:['A hangkészlet és a hangsor fogalmának elkülönítése.','Két-, három-, négy-, öt- és hatfokú dallamkészlet felismerése.','Dallamalkotás és gyermekdal-elemzés adott hangkészlet alapján.'],
  sections:[
   {title:'Hangkészlet és rendezett hangsor',paragraphs:[
    'A hangkészlet egy adott dalban előforduló különböző hangok összessége, míg a hangsor ezek meghatározott sorrendű elrendezése is lehet. Egy dal négy hangot használhat úgy, hogy azok nem egymás melletti skálafokok, vagy alkothatnak egymás mellett lévő, szűk hangterjedelmű négyes csoportot.',
    'A gyermekdalok elemzésében a ténylegesen megszólaló hangokat kell megfigyelni. Ne feltételezzük, hogy minden pentaton dallam azonos kezdőhanggal, azonos hangterjedelemmel vagy azonos funkcionális környezetben szólal meg.'
   ]},
   {title:'Nem szomszédos és szomszédos hangkészletek',paragraphs:[
    'A tananyagban előforduló biton, triton, tetraton és pentaton elnevezések a felhasznált különböző hangok számához kapcsolódnak. A hangok között lehetnek nagyobb rések, ami jellegzetes dallamfordulatokat és hangterjedelmet eredményez.',
    'Az egymás melletti fokokból felépülő szűk készletek más jellegű dallammozgást adnak. Egy valódi gyermekdal vizsgálatánál az ismételt hangok számát nem adjuk hozzá a hangkészlet elemszámához: csak a különböző hangmagasságokat vesszük figyelembe.'
   ]},
   {title:'Pentatónia mint dallami alap',paragraphs:[
    'A félhang nélküli, úgynevezett anhemiton pentatónia sok népzenei és gyermekdallamban jelenik meg. Egy jellegzetes dó-pentaton hangkészlet dó–ré–mi–szó–lá, amely C alap esetén C–D–E–G–A hangokból áll.',
    'A gyermekek ismert dallamokat énekelve, kézjellel vagy egyszerű hangszeren megszólaltatva fedezhetik fel az öt hang közötti kapcsolatokat. A felismerésből kérdés–felelet dallamalkotás vezethető le, ahol a hangkészlet adott, de a ritmus és dallamkontúr a tanuló döntése.'
   ]},
   {title:'Hangkészlet, hangterjedelem és zenei jelentés',paragraphs:[
    'A hangkészlet elemszáma nem azonos a dal hangterjedelmével. Három különböző hang lehet egymáshoz nagyon közel vagy viszonylag távol is. Az elemzés során ezért mindkét tulajdonságot vizsgáljuk, és megfigyeljük a gyakran ismételt hangokat, a hangsúlyos kezdést és a dallam végpontját.',
    'A hangkészlet önmagában nem mondja meg egy dallam eredetét, funkcióját vagy stílusát. A hangzó környezetet, a szöveget és a ritmikai sajátosságokat is szükséges megvizsgálni.'
   ]}
  ],
  guidedPractice:['Gyűjts össze három ismert gyermekdalt, és írd le mindegyik különböző hangjait.','Hasonlíts össze egy nem szomszédos háromhangú és egy szomszédos háromhangú dallammotívumot.','Alkoss kétütemes kérdést a C–D–E–G–A készletből, majd készíts válaszmotívumot.','Külön nevezd meg a dal hangkészletét és legmélyebb-legmagasabb hangját.'],
  commonMistakes:['Az ismételt hangokat többször számoljuk a hangkészletben.','A hangkészlet és a hangsor kifejezést minden összefüggésben felcseréljük.','A hangkészletből bizonyíték nélkül nemzeti vagy történeti eredetre következtetünk.'],
  selfCheck:[{question:'Hány különböző hangot tartalmaz a C–E–G–C–G dallam?',answer:'Hármat: C, E és G.'},{question:'Mi a különbség a hangterjedelem és a hangkészlet között?',answer:'A hangterjedelem a legmélyebb és legmagasabb hang közét, a hangkészlet a használt különböző hangokat írja le.'}],
  sources:[{title:'Open Music Theory – Scales and Scale Degrees',url:openTheory,note:'Hangsorok és a zenei hangkészletek rendszerezése.'},{title:'Integrated Music Theory – Modes and Pentatonics',url:'https://intmus.github.io/inttheory/',note:'Móduszok és pentaton hangkészletek elemzése.'}]
 },
 {chapterId:'hetfoku-hangsorok',
  objectives:['A dúr és moll hangsorok hangközrendjének megkülönböztetése.','A kvintkör és az előjegyzések gyakorlati használata.','Dúr, moll és szűkített hármashangzat építése, felismerése.'],
  sections:[
   {title:'A dúr hangsor és a modális rendszerek',paragraphs:[
    'A dúr hangsor egész- és félhanglépéseinek mintája: egész–egész–fél–egész–egész–egész–fél. C-dúr hangjai C–D–E–F–G–A–H–C. A móduszokat ugyanilyen diatonikus hangkészletből is levezethetjük, de a zenei alaphang és hangsúlyrend más érzetet ad.',
    'A modális hangzás nem egyszerűen „dúr vagy moll hibás kezdőhanggal”: a dór, fríg, líd és mixolíd más-más fokviszonyokkal és jellegzetes dallami mozgásokkal rendelkezik. Móduszokat célszerű ugyanarra az alaphangra építve is összehasonlítani.'
   ]},
   {title:'Természetes, harmonikus és melodikus moll',paragraphs:[
    'A természetes moll hangjai A alapon A–H–C–D–E–F–G–A. A harmonikus moll hetedik fokának felemelése vezetőhangot hoz létre; A-harmonikus moll esetén Gisz jelenik meg.',
    'A klasszikus zeneelméleti tanításban a melodikus moll felfelé a hatodik és hetedik fokot emeli, lefelé általában a természetes moll formájában tér vissza. Ez a séma nem minden műfaj és stílus tényleges dallamhasználatának kizárólagos szabálya.'
   ]},
   {title:'A kvintkör logikája',paragraphs:[
    'A kvintkör a hangnemek kvintlépések szerinti kapcsolatát ábrázolja. C-dúrból felfelé haladva G, D, A, E, H hangnemek következnek; G-dúr előjegyzése Fisz, azaz egy kereszt, D-dúré Fisz és Cisz, azaz két kereszt; a további kvintlépéseknél rendre eggyel nő a keresztek száma; lefelé haladva F, B, Esz, Asz következik, egyre több bével.',
    'A közeli hangnemeknek rendszerint sok közös hangjuk van, ezért a moduláció és a hangnemi rokonság megértésénél a kvintkör jól használható. A dúrhangnemekhez ugyanannyi előjegyzéssel rendelkező párhuzamos moll társul; C-dúr és a-moll például előjegyzés nélküli.'
   ]},
   {title:'Hármashangzatok és fordítások',paragraphs:[
    'Az alaphelyzetű dúr hármashangzat egy nagy és egy kis tercből épül fel, alulról felfelé. C-dúrban C–E–G, ahol C–E nagy terc, E–G kis terc; az alaphang és az ötödik hang között tiszta kvint van.',
    'A moll hármashangzatban a tercsorrend fordított: C–Esz–G esetén kis terc és fölötte nagy terc. A szűkített hármashangzat két kis tercből áll. Az akkordfordításban a hangok sorrendje átrendeződik, de az akkord alapvető hangosztály-készlete megmarad.'
   ]}
  ],
  guidedPractice:['Írd fel C-dúr és a-moll hangjait, és jelöld a közös előjegyzést.','Énekeld a természetes, harmonikus és melodikus a-moll hangsorokat; jelöld a módosított fokokat.','A kvintkör alapján írd fel G-, D-, F- és B-dúr előjegyzését.','Építs C-dúr, c-moll és c-szűkített hármashangzatot, majd nevezd meg a tercek sorrendjét.'],
  commonMistakes:['A melodikus moll klasszikus felfelé–lefelé sémáját minden kortárs zenére kiterjesztjük.','A párhuzamos mollt az azonos alaphangú mollal keverjük.','A kvintkörben a lefelé irányt is keresztek növekedéseként írjuk le.'],
  selfCheck:[{question:'Mi C-dúr párhuzamos mollja?',answer:'a-moll, mindkettőnek nincs előjegyzése.'},{question:'Miből áll a dúr és moll hármashangzat?',answer:'Dúr: nagy terc + kis terc; moll: kis terc + nagy terc.'}],
  sources:[{title:'Open Music Theory – Key Signatures, Scales and Triads',url:openTheory,note:'Dúr/moll hangsorok, kvintkör, hármashangzatok.'},{title:'Music Theory for the 21st-Century Classroom',url:hutchinson,note:'Hangsorok, előjegyzések, hangközök és hármashangzatok.'}]
 }
];
