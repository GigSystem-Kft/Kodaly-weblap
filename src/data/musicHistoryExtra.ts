/** Bővített zenetörténeti magyarázatok és ellenőrzött zenehallgatási javaslatok.
 * Az ellenőrzött videók közvetlen YouTube-linkek; ahol az előadás nincs külön
 * ellenőrizve, a YouTube keresési eredményét nyitjuk meg, nem kitalált videóazonosítót.
 */
export interface MusicHistoryExtra {
  id: string;
  sections: { title: string; paragraphs: string[] }[];
  listening: { title: string; url: string; focus: string; kind: 'video' | 'search' }[];
}
const youtubeSearch = (query: string) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
export const MUSIC_HISTORY_EXTRA: MusicHistoryExtra[] = [
  {
    id: 'kezdetek',
    sections: [
      { title: 'Zene az ókori közösségekben', paragraphs: [
        'Az ókor zenéjét nem egyetlen stílusként ismerjük: Egyiptom, Mezopotámia, Görögország és Róma kulturális hagyományai különböztek egymástól. A zene jelen volt vallási szertartásokon, közösségi ünnepeken, színházi előadásokon és magánéleti alkalmakon. Az előadási gyakorlatról ábrázolások, hangszermaradványok, szövegek és ritka lejegyzett dallamok tanúskodnak.',
        'Az ókori görög gondolkodók a zene nevelő és etikai szerepéről, a hangközök számarányairól és a hangsorrendszerekről is írtak. A püthagoraszi hagyományhoz kapcsolódik a húrhosszok és hangközök összefüggéseinek vizsgálata; ezt ne keverjük össze a későbbi európai dúr–moll hangnemrendszerrel.'
      ]},
      { title: 'Mit hallhatunk ma?', paragraphs: [
        'A Szeikilosz-sírfelirat egy rövid, hangjegyjelöléssel együtt fennmaradt görög dallam kiemelkedő példája. Mai előadásai szükségszerűen részben rekonstrukciók: a ritmikai, hangszerelési és előadói döntések nem minden részletét ismerjük. Érdemes meghallgatni két eltérő feldolgozást, és elválasztani a fennmaradt dallamot a modern előadói megoldásoktól.',
        'Figyeljétek meg, hogyan követi a dallam a szöveget, és milyen hangszerhangzások jelennek meg az előadásokban. A feladat nem a „hiteles ókori hangzás” biztos azonosítása, hanem a történeti forrás és az értelmezés különválasztása.'
      ]}
    ],
    listening: [
      { title: 'Szeikilosz sírfelirata – rekonstruált előadás (Michael Levy)', url: 'https://www.youtube.com/watch?v=y9fuWhuzcjo', kind: 'video', focus: 'Az énekelt dallam és a lantkíséret megkülönböztetése; a rekonstrukció bizonytalanságai.' },
      { title: 'Szeikilosz dallama – másik mai értelmezés (Farya Faraji)', url: 'https://www.youtube.com/watch?v=zPTF28XyH4g', kind: 'video', focus: 'Ugyanannak a forrásnak eltérő hangszerelése.' }
    ]
  },
  {
    id: 'kozepkor',
    sections: [
      { title: 'Liturgia, egyszólamúság és lejegyzés', paragraphs: [
        'A nyugat-európai középkori egyházi énekanyag nagy része latin nyelvű liturgikus hagyományhoz kötődik. A gregoriánnak nevezett énekanyag tipikusan egyszólamú, szöveghez kapcsolódó dallamokból áll. Az egyes dallamok különböző liturgikus szerepeket töltenek be; nem minden ének azonos ritmusú vagy szerkezetű.',
        'A kottaírás fokozatos alakulása lehetővé tette, hogy a dallamok pontosabban fennmaradjanak és nagyobb távolságokon is terjedjenek. A neumaírás korai változatai főként a dallam mozgására utaltak; a vonalrendszer és a hangmagasság jelölésének fejlődése Guido d’Arezzo nevéhez is kapcsolódik.'
      ]},
      { title: 'A többszólamúság kialakulása', paragraphs: [
        'Az organum korai formái egy meglévő énekdallam mellé további szólamot állítottak. A Notre-Dame-i iskola zenéjében az egymástól eltérő ritmusú és mozgású szólamok már nagyobb kompozíciós szerepet kaptak. A 13. századi motetta különösen alkalmas volt többféle szöveg és szólam egyidejű megszólaltatására.',
        'Az egyházi zenével párhuzamosan udvari és világi hagyományok is éltek. A trubadúrok és trouvère-ek dalai a szerelemről, társadalmi témákról és udvari kultúráról is szóltak. A középkor tehát nem kizárólag templomi zenét jelent.'
      ]}
    ],
    listening: [
      { title: 'Gregorián ének – Kyrie (előadások keresése)', url: youtubeSearch('Gregorian chant Kyrie schola authentic performance'), kind: 'search', focus: 'Egyszólamú ének, szöveg és dallam kapcsolata.' },
      { title: 'Pérotin: Viderunt omnes (előadások keresése)', url: youtubeSearch('Perotin Viderunt omnes Hilliard Ensemble'), kind: 'search', focus: 'Többszólamúság és hosszú, kitartott alapdallam megfigyelése.' }
    ]
  },
  {
    id: 'reneszansz',
    sections: [
      { title: 'Az önálló szólamok szövete', paragraphs: [
        'A reneszánsz vokális többszólamúságban a szólamok gyakran egyenrangúak. Az imitáció során egy motívum más-más hangmagasságban, más-más szólamokban újra megszólal. A hallgató számára az egyik legfontosabb feladat a belépések és a visszatérő dallamfordulatok követése.',
        'A templomi mise és motetta mellett számos világi műfaj virágzott. A madrigál például alkalmas volt az énekelt szöveg képi vagy érzelmi tartalmának zenei megjelenítésére. Nem minden reneszánsz zene a cappella: hangszeres táncok és átiratok is fontos szerepet kaptak.'
      ]},
      { title: 'Zenei kultúra és terjedés', paragraphs: [
        'A humanizmus és az udvari kultúra új közönséget és támogatási lehetőségeket adott a zenének. A hangjegynyomtatás a 16. században egyre több művet tett terjeszthetővé. A különböző nemzeti és helyi hagyományok sokszínűségét azonban nem szabad egyetlen „reneszánsz hangzással” azonosítani.',
        'Josquin, Palestrina és Lassus művein különböző módokon figyelhető meg a szövegkezelés, a polifónia és a nagyobb szerkezeti egységek összetartása. Érdemes rövid, legfeljebb egyperces részleteket többször meghallgatni, hogy a szólamok belépése felismerhető legyen.'
      ]}
    ],
    listening: [
      { title: 'Josquin des Prez: Ave Maria… virgo serena (előadások keresése)', url: youtubeSearch('Josquin Ave Maria virgo serena professional vocal ensemble'), kind: 'search', focus: 'Az imitációs belépések sorrendje.' },
      { title: 'Palestrina: Sicut cervus (előadások keresése)', url: youtubeSearch('Palestrina Sicut cervus The Sixteen'), kind: 'search', focus: 'A szöveg és a nyugodt, kiegyensúlyozott szólamvezetés.' }
    ]
  },
  {
    id: 'barokk',
    sections: [
      { title: 'Dramaturgia és hangzásbeli ellentétek', paragraphs: [
        'A 17. század elejének egyik fontos törekvése, hogy az énekelt szöveg érzéseit és jelentését közvetlenebbül fejezze ki a zene. Az opera kialakulása összekapcsolta az éneket, drámát, színpadképet és hangszeres kíséretet. A korabeli monódia és a később általánossá vált basso continuo lényeges újítás volt.',
        'A basso continuo a basszusszólamot és annak harmóniai kiegészítését jelenti, rendszerint billentyűs vagy pengetős hangszerrel és egy mély hangszerrel. A barokk hangszeres zenében fontos az ellenpont, a szekvenciák alkalmazása, a díszítés és a kisebb-nagyobb együttesek közötti kontraszt.'
      ]},
      { title: 'Formák és alkotók', paragraphs: [
        'A concerto grosso és a szólóversenymű a hangszeres csoportok közötti kontrasztot használja. A szvit különböző karakterű, gyakran tánceredetű tételekből áll. A fúga olyan kontrapunktikus szerkesztésmód, amelyben egy téma több szólam egymást követő belépéseiben jelenik meg.',
        'Monteverdi az opera korai történetének, Vivaldi a versenymű-irodalomnak, Bach a polifon szerkesztésnek, Händel pedig az oratórium és az opera történetének meghatározó alakja. A barokk végét gyakran Bach 1750-es halálához kötik, ám a stílusváltozás fokozatos volt.'
      ]}
    ],
    listening: [
      { title: 'Vivaldi: A négy évszak – Tavasz (Netherlands Bach Society)', url:'https://www.youtube.com/watch?v=0FP9N2SbWn4', kind:'video', focus:'A szólóhegedű és a zenekar párbeszéde, ritornelló-visszatérések.' },
      { title: 'Bach: d-moll toccata és fúga, BWV 565 (előadások keresése)', url: youtubeSearch('Bach BWV 565 organ official performance'), kind:'search', focus:'A virtuóz hangszeres gesztusok és a szólamok összjátéka.' }
    ]
  },
  {
    id: 'klasszika',
    sections: [
      { title: 'A forma világossága', paragraphs: [
        'A 18. század második felében a bécsi klasszikus stílus egyik jellegzetessége a zenei mondatok áttekinthetősége és a nagyobb formák tudatos építése. A dallamokat gyakran világos harmóniai kíséret támasztja alá; a rövid motívumokból különböző változatok születnek.',
        'A szonátaforma nem pusztán két témát jelent, hanem a tematikus és hangnemi viszonyokból épülő formai folyamatot. Az expozícióban bemutatott zenei anyag a kidolgozás során átalakul, majd a reprízben más összefüggésben tér vissza. A korszak művei ugyanakkor változatosak: nem mindegyik tétel szonátaformájú.'
      ]},
      { title: 'A zenekar és a kamarazene', paragraphs: [
        'A szimfónia többtételes zenekari műfajként fejlődött tovább; a vonósnégyesben két hegedű, brácsa és cselló egymásra figyelő kamarazenei együttest alkot. A zongora fejlődése átalakította a billentyűs hangszerek hangszínét, dinamikáját és szerepét.',
        'Haydn, Mozart és Beethoven művészete között jelentős különbségek vannak. Beethoven életműve sok szempontból átvezet a 19. század újabb zenei gondolkodásához. Hallgatáskor érdemes egyszerre figyelni a motívum visszatérésére, a hirtelen dinamikai változásokra és a hangnemi feloldásokra.'
      ]}
    ],
    listening: [
      { title: 'Mozart: Egy kis éji zene, K. 525 (előadások keresése)', url: youtubeSearch('Mozart Eine kleine Nachtmusik Academy of St Martin in the Fields'), kind:'search', focus:'Szimmetrikus frázisok és visszatérő témák.' },
      { title: 'Beethoven: 5. szimfónia, I. tétel (előadások keresése)', url: youtubeSearch('Beethoven Symphony 5 first movement Berlin Philharmonic'), kind:'search', focus:'Négynótás motívum és annak átalakulása.' }
    ]
  },
  {
    id: 'romantika',
    sections: [
      { title: 'Személyes kifejezés és programzene', paragraphs: [
        'A romantika korában a zeneszerzők gyakran az egyéni érzelmeket, történeteket és természeti képeket igyekeztek megjeleníteni. A programzene valamely zeneirodalmon kívüli gondolatra, eseményre vagy képre utal, míg az abszolút zene értelmezésében nem feltételezünk konkrét külső történetet.',
        'A harmóniavilág gazdagodott, a kromatika és a moduláció új feszültségeket hozott létre. A zongoradarabok, a műdalok és a nagyzenekari alkotások egyaránt fontos szerepet kaptak, és a hangszerek technikai fejlődése új hangzási lehetőségeket teremtett.'
      ]},
      { title: 'Műfajok és nemzeti törekvések', paragraphs: [
        'Schubert műdalai a költői szöveg és a zongorakíséret szoros egységét mutatják; Chopin zongoradarabjai a játék és a harmóniai árnyalatok gazdagságát. Liszt szimfonikus költeményeiben gyakran programszerű gondolat szervezi a zenei anyagot.',
        'A 19. századi nemzeti zenei törekvések részben történeti és irodalmi témákhoz, részben hagyományos dallamokhoz és táncokhoz kapcsolódtak. Nem minden „nemzeti” hangzás azonos a tudományosan gyűjtött népzenével; különítsük el a romantikus stilizálást a későbbi népzenekutatástól.'
      ]}
    ],
    listening: [
      { title:'Chopin: Esz-dúr noktürn, Op. 9/2 (Vadim Chaimovich)', url:'https://www.youtube.com/watch?v=9E6b3swbnWg', kind:'video', focus:'Rubato, díszítés és finom dinamikai árnyalatok.' },
      { title:'Liszt: Les Préludes – szimfonikus költemény (előadások keresése)', url: youtubeSearch('Liszt Les Preludes symphonic poem full orchestra'), kind:'search', focus:'Visszatérő témák és programzenei karakterváltozás.' }
    ]
  },
  {
    id:'huszadik',
    sections: [
      { title: 'Sokféle modern zenei nyelv', paragraphs: [
        'A 20. század zenéjét nem egységes hangzás határozza meg, hanem különböző irányzatok együttélése. Egyes szerzők a tonalitás új lehetőségeit keresték, mások atonális vagy szeriális szerkesztési módszerekkel kísérleteztek. Az impresszionizmusként emlegetett zenei törekvések a hangszínek és különleges harmóniák szerepét erősítették.',
        'A felvételtechnika, az elektronikus hangkeltés és a rádiózás megváltoztatta a zene terjesztését és alkotását. A jazz és különféle népzenei hagyományok a műzene mellett önálló, jelentős történetet alakítottak ki, gyakran kölcsönhatásban vele.'
      ]},
      { title: 'Ritmus, népzene, új szerkesztési módok', paragraphs: [
        'Stravinsky Tavaszi áldozatában a ritmikai hangsúlyok váratlan eltolódása és a hangszerelés újfajta ereje különösen fontos. Bartók népzenei kutatásai a dallam- és ritmusvilág mélyebb megértését segítették, ugyanakkor műveiben összetett modern zeneszerzői technikákkal párosultak.',
        'Kodály zenepedagógiai szemlélete a zenei anyanyelvre és az aktív éneklésre helyezte a hangsúlyt. A század második felében megjelent minimalizmusban a rövid minták ismétlése és fokozatos változtatása kerülhet előtérbe. Kortárs művekben gyakran újfajta hangkeltési és előadói módszerekkel találkozunk.'
      ]}
    ],
    listening: [
      { title:'Stravinsky: Tavaszi áldozat – részlet (előadások keresése)', url: youtubeSearch('Stravinsky Rite of Spring Royal Stockholm Philharmonic'), kind:'search', focus:'Változó hangsúlyok, ritmikai rétegzettség és hangszínek.' },
      { title:'Bartók: Román népi táncok (előadások keresése)', url: youtubeSearch('Bartok Romanian Folk Dances concert performance'), kind:'search', focus:'Népzenei karakterek és ritmikus tagolás.' }
    ]
  }
];
