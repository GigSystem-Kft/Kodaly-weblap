/**
 * A felhasználó által átadott 16 oldalas "A zene története" egyetemi jegyzet
 * zenetörténeti, pedagógiai feldolgozása és az 1–4. osztályos Ének-zene tankönyvek
 * tematikus keresztmutatója. A tankönyvszámok a PDF-digitalizátum oldalszámai.
 * A történeti tények önálló, mai szakmai megfogalmazásban szerepelnek.
 */
export interface HistoricalNote {
  periodId:string; title:string; pages:number[]; explanation:string; listenFor:string[];
  task:string; sampleAnswer:string; caution?:string;
}
export interface PrimaryMusicLink {
  periodId:string; grade:1|2|3|4; page:number; work:string;
  focus:string; activity:string;
}
export interface HistoricalVisual {
  periodId:string; title:string; caption:string; imageUrl:string; sourceUrl:string;
  licenseNote:string; licenseUrl?:string;
}
export interface HistoricalResource {
  periodId:string; title:string; url:string; kind:'hangtar'|'kotta'|'video'|'forras';
  focus:string; availabilityNote?:string;
}
export const HISTORY_NOTE_SOURCE='Saját, 16 oldalas jegyzet: A zene története (a felhasználó által átadott PDF)';
export const HISTORY_NOTE_INSIGHTS:HistoricalNote[]=[
 {periodId:'kezdetek',title:'Hogyan keletkezhetett a zene?',pages:[1],
 explanation:'A jegyzet több, egymástól eltérő eredetmagyarázatot ismertet: az állati hangjelzésekből kiinduló elképzelést, a közösen végzett munka ritmusát és a rituális ismétlést. Ezek magyarázó hipotézisek, nem bizonyított, kizárólagos eredettörténetek. A zenei gyakorlat és a lejegyzett, elméletileg tárgyalt zenekultúra között különbséget tehetünk, de a szóbeli hagyomány is lehet rendkívül összetett.',
 listenFor:['Ismétlődés és változatosság a munkaritmusokban.','Mely jelenségek nevezhetők zenei szervezésnek?'],task:'Hozz létre négyütemes munkaritmust tapssal, és hasonlítsd össze a spontán hangadással.',sampleAnswer:'A tudatosan ismételt ritmus segít összehangolni a mozdulatokat, de önmagában nem bizonyítja a zene egyetlen eredetét.'},
 {periodId:'kezdetek',title:'Kínai, indiai és egyiptomi zene',pages:[1],
 explanation:'A jegyzet a kínai pentaton hagyományt és a seng szájorgonát, az indiai rága fogalmát és vínát, valamint az egyiptomi szisztrumot és sípféléket emeli ki. A pentatónia nem kizárólag Kínára jellemző, a rágák pedig nem egyszerűen rögzített dallamok: hangkészletük, jellegzetes fordulataik, hangsúlyaik és előadási szabályaik vannak.',
 listenFor:['Mennyiben más egy pengetős, egy sípos és egy rázott ütőhangszer hangja?','A pentaton hangkészlet önmagában meghatároz-e egy zenei kultúrát?'],task:'Hasonlíts össze egy pentaton és egy hétfokú rövid dallamot, majd tervezz hangszerfelismerő játékot.',sampleAnswer:'A pentatónia öt hangot használó hangkészlet; különböző kultúrákban eltérő dallamformák és hagyományok kapcsolódhatnak hozzá.',
 caution:'A jegyzet több ókori kultúráról túl általánosan fogalmaz; az indiai rágák számát és az egyes hangszerek történetét ne tanítsuk változatlan, mindenkire érvényes tényként.'},
 {periodId:'kezdetek',title:'Görög színház és római Aquincum',pages:[2,3],
 explanation:'A görög aulos és kithara, az ókori tragédia szöveg-, mozgás- és zenekapcsolata, valamint a Szeikilosz-sírfelirat jó összehasonlítási pontok. A római kori Aquincumból fennmaradt víziorgona különösen fontos hazai hangszertörténeti lelet, amelynek rekonstrukcióját ma is bemutatják.',
 listenFor:['A hangszeres kíséret és az ének viszonya.','Milyen hangzásbeli döntéseket kell meghozni egy ókori rekonstrukciónál?'],task:'Mutasd meg térképen Aquincumot, majd készíts rövid múzeumi hangszercímkét a víziorgonához.',sampleAnswer:'Az aquincumi víziorgona római kori, régészeti lelet; mai hangját rekonstrukcióból ismerjük, nem ókori hangfelvételről.'},
 {periodId:'kozepkor',title:'Gregorián, neumák és Guido',pages:[3],
 explanation:'A jegyzet részletesen tárgyalja a hallás utáni dallamtanulást, a neumákat és Guido d’Arezzo négyvonalas kottaíráshoz kapcsolódó szerepét. A gregorián repertoár évszázadokon át alakult, ezért nem tekinthető egyetlen pápa által egyszerre megalkotott dallamgyűjteménynek.',
 listenFor:['Egyszólamú dallam és szövegmondás kapcsolata.','A neumák és a mai kotta közti információkülönbség.'],task:'Rajzolj emelkedő és ereszkedő neumaszerű jeleket, majd próbáld egy társad dallamát ebből visszaénekelni.',sampleAnswer:'A korai neuma többnyire a dallam mozgására emlékeztetett; a vonalrendszer pontosította a hangmagasságot.',
 caution:'A Gergely pápához és a kódex láncolásához kötött legendás történet nem történeti bizonyítéka a teljes gregorián repertoár szerzőségének.'},
 {periodId:'kozepkor',title:'Ars nova, trubadúrok és minnesängerek',pages:[3],
 explanation:'Az ars nova a 14. század új ritmikai lejegyzési lehetőségeit jelöli. A trubadúrok, trouvère-ek és minnesängerek világi dalai a lovagi udvari kultúrához kapcsolódnak; az egyházi ének mellett sokféle zenei közeg létezett.',
 listenFor:['Mi a különbség a szövegközpontú szólóének és a több szólamú darab között?','Hogyan befolyásolja a ritmikai jelölés a pontos újraelőadást?'],task:'Alkoss rövid, négy soros udvari dalt, majd énekeld el két eltérő ritmikai megoldással.',sampleAnswer:'A szöveg ritmikai tagolása megváltoztathatja az előadás karakterét.'},
 {periodId:'reneszansz',title:'Római és velencei iskola: imitáció és térbeli felelgetés',pages:[4],
 explanation:'Palestrina és Orlando di Lasso vokális polifóniája mellett a velencei többkórusosság megmutatja, hogyan válhat a tér a hangzás részesévé. A motetta jellemzően egyházi latin szöveghez, a madrigál világi, gyakran nemzeti nyelvű szöveghez kapcsolódik.',
 listenFor:['Mikor veszi át a másik szólam ugyanazt a motívumot?','Milyen hatást kelt a két kóruscsoport egymásnak felelgetése?'],task:'Két csoport egymás után énekeljen azonos kétütemes motívumot, majd rövid átfedéssel is.',sampleAnswer:'Az imitáció azonos vagy hasonló motívum egymást követő szólamindítása; a felelgetésben a csoportok térbeli elkülönítése is hallható.',
 caution:'A Palestrina által megmentett, már betiltott polifónia története leegyszerűsítő legenda; a tridenti zsinat nem hozott általános, végleges polifóniatilalmat.'},
 {periodId:'reneszansz',title:'A korai opera előzményei',pages:[5],
 explanation:'A jegyzet a firenzei humanista kör, az udvari zenés színpadi játékok és a recitativo szerepét emeli ki. Az opera a 16. század végén és 17. század elején fejlődött ki, ezért átvezetés a reneszánszból a korai barokkba.',
 listenFor:['Hogyan különbözik a beszédszerű recitativo egy zárt dallamú áriától?','Mikor lép előtérbe a színpadi történet?'],task:'Mondj el egy kétsoros történetet először prózában, utána recitativószerű hangokon.',sampleAnswer:'A recitativo rugalmasan követi a beszéd hangsúlyait, és előreviszi a cselekményt.'},
 {periodId:'barokk',title:'Basso continuo, concerto, szvit és oratórium',pages:[5],
 explanation:'A barokk jellegzetes continuo-együttesében a basszushanghoz akkordikus kíséret kapcsolódik. Bach, Händel és Vivaldi művein a kifejezés, a szekvenciák és a szóló–zenekar közti kontraszt figyelhető meg. A fúga, kantáta, oratórium és concerto eltérő műfaji feladatokat tölt be.',
 listenFor:['Visszatérő dallamrészlet a concerto tételeiben.','A basso continuo állandóan visszatérő harmóniai támasza.'],task:'Alkoss A–B–A kétszólamú ritmusformát, ahol a visszatérő A szólam más hangszínen szól.',sampleAnswer:'A visszatérő motívum egységet teremt, a hangszínkontraszt pedig jól érzékelhető tagolást ad.'},
 {periodId:'klasszika',title:'Haydn, Mozart és Beethoven: a klasszikus forma',pages:[6],
 explanation:'A jegyzet kiemeli Haydn vonósnégyeseit és szimfóniáit, Mozart operáit és Beethoven szimfonikus gondolkodását. A világos periodizálás, a motívumok variálása és a szonátaformai kontraszt hallási megfigyelésre is alkalmas.',
 listenFor:['Két eltérő karakterű téma.','Visszatér-e az ismert motívum megváltozott hangnemben vagy hangszerelésben?'],task:'Hallgasd meg Haydn „Óra” szimfóniájának lassú tételét; jelöld a szabályos kísérőlüktetést.',sampleAnswer:'Az ismétlődő kísérőlüktetés óraműszerű hatást ad a dallamnak.',
 caution:'A jegyzet Mozart és Beethoven életrajzában több anekdotikus, illetve pontatlan műszámot közöl; a konkrét adatokat külön ellenőrizni kell.'},
 {periodId:'romantika',title:'Műdal, zongoravirtuozitás, programzene és nemzeti stílus',pages:[7],
 explanation:'A romantikus zene gazdagabb hangszerelése, érzelmi kifejezése és programzenei törekvései között Schubert, Chopin, Liszt, Berlioz és Wagner más-más utat képviselnek. A magyar verbunkos és a nemzeti operakultúra kialakulása a 19. századi történet fontos része.',
 listenFor:['Hallható-e visszatérő karakter vagy téma?','Milyen zenei eszköz jelenít meg képet, jelenetet vagy drámát?'],task:'Egy programzenei részlethez rajzolj három képet, majd igazold a zenei motívumokkal a sorrendet.',sampleAnswer:'A hangszín, dinamika és a dallamformálás segíthet felidézni a zenei programot.'},
 {periodId:'romantika',title:'A magyar zene: kollégiumi énekek, verbunkos, Erkel és Liszt',pages:[12,13],
 explanation:'A jegyzet a korai magyar zenei emlékektől a kuruc énekeken és a verbunkoson át Erkel operájáig és Liszt zongoraművészetéig vezet. A verbunkos a 18–19. század magyar hangszeres tánczenei kultúrájának fontos jelensége, de nem azonos a teljes magyar népzenével.',
 listenFor:['Lassú és friss karakterének különbsége.','A színpadi ének és a nemzeti ünnepi ének eltérő funkciói.'],task:'Hasonlítsd össze Erkel Himnuszát egy verbunkos jellegű hangszeres részlettel; milyen eltérő társadalmi helyzetre készültek?',sampleAnswer:'A Himnusz ünnepi közösségi ének, a verbunkos tánczenei és előadói hagyományhoz kapcsolódik.'},
 {periodId:'huszadik',title:'A 20. századi újítások és a jazz',pages:[7,8],
 explanation:'A tonalitás újrafogalmazása, az új ritmikai képletek és a hangszínkísérletek mellett a jazz improvizációs kultúrája is új fejezetet nyitott. A jazz története afroamerikai társadalmi és zenei hagyományokhoz kapcsolódik; eredetét nem lehet egyetlen városra vagy egyetlen előadóra leszűkíteni.',
 listenFor:['Szinkópa és hangsúlyeltolódás.','Mely részek rögtönzöttnek és melyek állandónak hatnak?'],task:'Hagyj szünetet egy szinkópás tapsmintában, majd engedj rövid saját ritmikus választ.',sampleAnswer:'Az improvizáció helyben alkotott zenei válasz, amely egy közös formához is igazodhat.'},
 {periodId:'huszadik',title:'Elektronikus hangzás, rock, reggae, rap és a magyar könnyűzene',pages:[9,10,11,15,16],
 explanation:'A jegyzet a 20. századi populáris zene sokféleségét mutatja be a rocktól az elektronikus irányzatokig és a hazai beat- és punkmozgalomig. A műfajok fejlődése társadalmi, technológiai és kulturális változásokkal fonódik össze.',
 listenFor:['Akusztikus hangszer és elektronikus hangszín elkülönítése.','Mely ritmusképletek tartják össze a dalformát?'],task:'Készíts három korszakból álló, saját hangszínes idővonalat egyszerű testhangszerekkel.',sampleAnswer:'A különböző technológiák a hangképzést is megváltoztatták, de a ritmus, forma és ismétlés továbbra is fontos.'},
 {periodId:'huszadik',title:'Bartók és Kodály: népzene, komponálás és zenepedagógia',pages:[14],
 explanation:'Bartók és Kodály a magyar és a szomszéd népek hagyományainak gyűjtésével és elemzésével új népzenetudományi módszereket erősítettek meg. Zeneszerzői életművük és kutatói munkájuk kapcsolatban áll, mégsem azonos egymással; Kodály zenei nevelési törekvései külön önálló témát képeznek.',
 listenFor:['Népdal és műzenei feldolgozás eltérő hangszerelése.','Milyen új szerepet kap a ritmus vagy a népzenei motívum?'],task:'Hallgass meg egy dallamot énekelve és Bartók-feldolgozásban: milyen zenei anyag változott?',sampleAnswer:'A dallam megőrződhet, miközben a harmonizálás, forma, hangszerelés és ritmus új jelentést ad neki.'}
];
export const HISTORY_TEXTBOOK_LINKS:PrimaryMusicLink[]=[
 {periodId:'barokk',grade:1,page:40,work:'Antonio Vivaldi: A négy évszak – Ősz, I. tétel',focus:'Évszak, dinamika és hangszeres kontraszt',activity:'Rajzold le a hangos és halk részek váltakozását.'},
 {periodId:'klasszika',grade:1,page:18,work:'Joseph Haydn: D-dúr „Óra” szimfónia, II. tétel',focus:'Egyenletes kísérőritmus és mozgás',activity:'Járással mutasd az óraszerű lüktetést.'},
 {periodId:'klasszika',grade:1,page:47,work:'Wolfgang Amadeus Mozart: Esz-dúr kürtverseny, III. tétel',focus:'Rézfúvós hangszín és zenei karakter',activity:'Keresd meg, hol válaszol a zenekar a kürtre.'},
 {periodId:'huszadik',grade:1,page:13,work:'Kodály Zoltán: Háry János – Bécsi harangjáték',focus:'Haranghang és meseszerű hangszerelés',activity:'Képzeld el a történetet, és jelöld a harangok belépését.'},
 {periodId:'huszadik',grade:1,page:27,work:'Bartók Béla: Gyermekeknek I/12.',focus:'Népdalfeldolgozás és dallamváltozatok',activity:'Jelezd a mélyebben megszólaló zenei részt.'},
 {periodId:'klasszika',grade:2,page:33,work:'W. A. Mozart: D-dúr fuvolanégyes, K. 285, I. tétel',focus:'Fuvolahangszín és kamarazenei szólamok',activity:'Mutasd kézzel a fuvoladallam emelkedését és ereszkedését.'},
 {periodId:'klasszika',grade:2,page:54,work:'W. A. Mozart: Német tánc, K. 605/3 – Utazás szánon',focus:'Zenei hangfestés és tánckarakter',activity:'Milyen hangok kelthetnek télies, csilingelő benyomást?'},
 {periodId:'barokk',grade:2,page:55,work:'Antonio Vivaldi: A négy évszak – Tél, II. tétel',focus:'Téli zenei program és kísérő szólamszövet',activity:'Vesd össze a zenében érzett hangulatot egy saját téli rajzzal.'},
 {periodId:'huszadik',grade:2,page:16,work:'Bartók Béla: Gyermekeknek I/1. – Játszó gyermekek',focus:'Népdal és feldolgozás kapcsolata',activity:'Keresd meg, mely szövegsor vagy zenei fordulat tér vissza.'},
 {periodId:'huszadik',grade:2,page:11,work:'Kodály Zoltán: Lengyel László – gyermekkar (részlet)',focus:'Gyermekkari hangzás és történelmi téma',activity:'A közös éneklésben hány különálló hangréteget észlelsz?'},
 {periodId:'klasszika',grade:3,page:24,work:'Ludwig van Beethoven: István király – nyitány, op. 117',focus:'Magyar történelmi téma a klasszika–romantika határán',activity:'Figyeld meg az ünnepélyes és mozgékony részek ellentétét.'},
 {periodId:'romantika',grade:3,page:63,work:'Erkel Ferenc – Kölcsey Ferenc: Himnusz',focus:'Nemzeti ünnepi zene és 19. századi magyar zenetörténet',activity:'Beszéljétek meg a közös éneklés és a nemzeti ünnep kapcsolatát.'},
 {periodId:'huszadik',grade:3,page:24,work:'Bartók Béla: Mikrokozmosz III/95 – Rókadal',focus:'Népzenei ihletés és modern zongorahangzás',activity:'Milyen ritmus és motívum teszi felismerhetővé a zongoradarabot?'},
 {periodId:'huszadik',grade:3,page:13,work:'Kodály Zoltán: Túrót eszik a cigány – gyermekkar',focus:'Népdalhang, forma és többszólamú feldolgozás',activity:'Figyeld meg a zenei forma fordulópontjait.'},
 {periodId:'romantika',grade:4,page:64,work:'Modest Muszorgszkij: Egy kiállítás képei – Baba Jaga kunyhója',focus:'Programzene és fantáziát megmozgató karakter',activity:'Vázolj fel három történetszakaszt az elhangzó zenére.'},
 {periodId:'huszadik',grade:4,page:4,work:'Kodály Zoltán és az Éneklő Ifjúság mozgalom',focus:'Kórusmozgalom és magyar zenepedagógia',activity:'Vizsgáljátok meg, mit adhat a közös éneklés egy iskolaközösségnek.'},
 {periodId:'huszadik',grade:4,page:15,work:'Bartók Béla: Tizenöt magyar parasztdal – Régi táncdalok',focus:'Népdalgyűjtés és komponált hangszeres népzenei feldolgozás',activity:'Válaszd külön a forrásdallamot a zongorakíséret és új forma elemeit.'},
 {periodId:'huszadik',grade:4,page:9,work:'Kodály Zoltán: Ötfokú zene II. – olvasógyakorlat',focus:'Pentatónia és Kodály-féle relatív szolmizáció',activity:'Énekeld el a dallamot szolmizálva, és nevezd meg a hangkészletet.'}
];
// Kizárólag az ellenőrzött Commons-fájlokra mutató képek; a nagyítás és a forráslicenc a fájllapon.
const commons=(file:string)=>'https://commons.wikimedia.org/wiki/File:'+file;
const filepath=(file:string)=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file.replaceAll('_',' '));
export const HISTORY_VISUALS:HistoricalVisual[]=[
 {periodId:'kezdetek',title:'Az aquincumi víziorgona rekonstrukciója',caption:'Római kori billentyűs hangszer: a jegyzet 3. oldala magyarországi példaként tárgyalja.',imageUrl:filepath('Hidraulis_Aquincum1.JPG'),sourceUrl:commons('Hidraulis_Aquincum1.JPG'),licenseNote:'Szerző: Kaboldy · Wikimedia Commons · CC BY-SA 3.0 Unported. Forrás, licenc és újrafelhasználási feltételek a képfájl oldalán.',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/'},
 {periodId:'reneszansz',title:'Giovanni Pierluigi da Palestrina arcképe',caption:'A római iskola polifon zeneszerzője; párosítsd az imitációs motettával.',imageUrl:filepath('Retrato_de_Palestrina.jpg'),sourceUrl:commons('Retrato_de_Palestrina.jpg'),licenseNote:'Wikimedia Commons; közkincsnek jelölt történeti arckép.'},
 {periodId:'barokk',title:'Johann Sebastian Bach korabeli arcképe',caption:'Elias Gottlob Haussmann festménye; a barokk fúga és ellenpont mestere.',imageUrl:filepath('Johann_Sebastian_Bach.jpg'),sourceUrl:commons('Johann_Sebastian_Bach.jpg'),licenseNote:'Wikimedia Commons; 1748-as történeti portré, közkincs.'},
 {periodId:'klasszika',title:'Wolfgang Amadeus Mozart arcképe',caption:'Barbara Krafft portréja. A tankönyvek a kürtversenyt, a fuvolanégyest és a német táncot is kiemelik.',imageUrl:filepath('Mozart.jpeg'),sourceUrl:commons('Mozart.jpeg'),licenseNote:'Wikimedia Commons; közkincsnek jelölt portré.'},
 {periodId:'romantika',title:'Liszt Ferenc – történeti portré',caption:'Zongoravirtuozitás, programzene, szimfonikus költemény és magyar romantika.',imageUrl:filepath('Franz_Listz.jpg'),sourceUrl:commons('Franz_Listz.jpg'),licenseNote:'Wikimedia Commons; 1885 körüli, közkincsnek jelölt történeti felvétel.'},
 {periodId:'huszadik',title:'Bartók Béla portréja',caption:'A népdalkutató és zeneszerző; kapcsolódás a tankönyvek népdal-feldolgozásaihoz.',imageUrl:filepath('Bartók_Béla.jpg'),sourceUrl:commons('Bartók_Béla.jpg'),licenseNote:'Wikimedia Commons; közkincsnek jelölt portré, az eredeti fájloldalon ellenőrizendő.'},
 {periodId:'kozepkor',title:'Gregorián kottaírás – Kyrie',caption:'Négyvonalas éneklejegyzés, történeti kotta. Figyeld meg a modern hangjegyírástól eltérő formákat.',imageUrl:filepath('Gregorian_chant.gif'),sourceUrl:commons('Gregorian_chant.gif'),licenseNote:'Wikimedia Commons, közkincsnek jelölt történeti kotta.'},
 {periodId:'kozepkor',title:'Középkori neumás kézirat',caption:'Eredeti középkori kéziratkép: a hangmagasságok és a szöveg kapcsolata.',imageUrl:filepath('Troparium_et_prosarium_Sancti_Martialis_Lemovicensis_BNF_Latin_1118_fo_104.jpg'),sourceUrl:commons('Troparium_et_prosarium_Sancti_Martialis_Lemovicensis_BNF_Latin_1118_fo_104.jpg'),licenseNote:'Wikimedia Commons, középkori kézirat.'}
];
export const HISTORY_RESOURCES:HistoricalResource[]=[
 {periodId:'kezdetek',title:'Aquincumi víziorgona – eredeti műtárgy és rekonstrukció képei',url:'https://commons.wikimedia.org/wiki/Category:Hydraulis_in_the_Aquincum_Museum',kind:'kotta',focus:'Régészeti bizonyíték és rekonstruált hangszín megkülönböztetése.'},
 {periodId:'kozepkor',title:'Gregorián kottaírás – történeti kottapélda',url:'https://commons.wikimedia.org/wiki/File:Gregorian_chant.gif',kind:'kotta',focus:'Neumák és négyvonalas kottakép.'},
 {periodId:'reneszansz',title:'Országos Széchényi Könyvtár – Zeneműtár',url:'https://oszk.hu/zenemuvek',kind:'forras',focus:'Kottakéziratok és zenetörténeti emlékek magyar közgyűjteményben.'},
 {periodId:'barokk',title:'Antonio Vivaldi – A négy évszak, négy versenymű (konkrét videó)',url:'https://www.youtube.com/watch?v=5a9aUN7JPSM',kind:'video',focus:'A tankönyvek Ősz és Tél tételeinek visszakeresése: Ősz 20:21; Tél 31:57.',availabilityNote:'A videó 2017-es, magyar címmel és tételjegyzékkel szereplő külső előadás. A lejátszó és a jogok a videó szolgáltatójától függenek.'},
 {periodId:'barokk',title:'Bach: d-moll toccata és fúga, BWV 565 – Lehotka Gábor orgonafelvétele',url:'https://www.youtube.com/watch?v=v2z942agohk',kind:'video',focus:'Orgonahangszín, virtuóz toccata és imitációs fúgaszerkesztés; a feltöltő magyar nyelvű műismertetője is elérhető.',availabilityNote:'1966-os felvétel külső videóplatformon; a hozzáférés és beágyazás a videó szolgáltatójától függ.'},
 {periodId:'barokk',title:'OSZK katalógusok – Hangtár keresése',url:'https://oszk.hu/oszk_katalogusok',kind:'hangtar',focus:'Az OSZK katalógusoldaláról a Hangtárban kereshető történeti hangfelvételekhez juthatsz.'},
 {periodId:'klasszika',title:'Mozart K. 331 – OSZK zenei virtuális kiállítások gyűjtőoldala',url:'https://oszk.hu/category/virtualis-kiallitasok/zene',kind:'kotta',focus:'A gyűjtőoldalon keresd a Mozart K. 331 (A-dúr szonáta) kiállítást: eredeti kézirattöredék és kiadások összevetése.'},
 {periodId:'romantika',title:'Erkel Ferenc – OSZK zenei virtuális kiállítások gyűjtőoldala',url:'https://oszk.hu/category/virtualis-kiallitasok/zene',kind:'forras',focus:'A gyűjtőoldalon az Erkel Ferenc zeneszerző kiállításra lépj tovább: Himnusz, Bánk bán és Hunyadi László kéziratok és dokumentumok.'},
 {periodId:'huszadik',title:'OSZK katalógusok – Hangtár-gyűjtemény elérése',url:'https://oszk.hu/oszk_katalogusok',kind:'hangtar',focus:'A gyűjtőoldal Hangtár-linkjéről indulva keress ellenőrizhető történeti felvételeket.'},
 {periodId:'huszadik',title:'Kodály mindenkié! – a Zeneakadémia dokumentumfilmje',url:'https://lfze.hu/videok/kodaly-mindenkie-119270',kind:'video',focus:'Kodály zenepedagógiai öröksége, nemzetközi alkalmazásai és magyarországi háttere.',availabilityNote:'A Liszt Ferenc Zeneművészeti Egyetem magyar nyelvű bemutatóoldalára vezet; a külső videólejátszó működése nem garantált.'}
];
