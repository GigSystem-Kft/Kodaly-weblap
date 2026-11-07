import { Chapter, Flashcard, QuizQuestion, MatchingPair } from '../types';

export const MUSIC_CHAPTERS: Chapter[] = [
  {
    id: 'ritmus',
    number: 1,
    title: 'Ritmus, Tempó és Ütemfajták',
    description: 'A ritmus mint időbeli rend, ritmusértékek, ritmusképletek (szinkópa, éles, nyújtott, triola), szünetjelek, tempó és ütemfajták.',
    iconName: 'Activity',
    subchapters: [
      {
        id: 'ritmus-alapok',
        title: '1.1 A ritmus és ritmusértékek',
        summary: 'A ritmus a zenében a hangok sorának időbeli rendje, egymáshoz való időértékviszonya.',
        content: [
          'A ritmus jelen van életünk minden pillanatában, testünk működésében és a bennünket körülvevő világban.',
          'Kodály Zoltán: „A zene elemei külön-külön is értékes nevelő eszközök. A ritmus figyelmet, koncentrációt, határozottságot, beidegző képességet fejleszt.”',
          'Kiinduló értékünk az egész érték. Valamennyi rövidebb ritmusértéket felezéssel hozzuk létre.',
          'Egész érték – gyakorló neve: tá - á - á - á',
          'Fél érték – gyakorló neve: tá - á',
          'Negyed érték – gyakorló neve: tá',
          'Nyolcad érték – gyakorló neve: (párban) ti - ti',
          'Tizenhatod érték – gyakorló neve: (párban) ri - ri (vagy ti-ri)'
        ],
        examples: [
          {
            title: 'Ritmusértékek hierarchiája',
            description: '1 Egész (4 negyed) = 2 fél (2 negyed) = 4 negyed = 8 nyolcad = 16 tizenhatod.',
            audioNotes: ['C4', 'C4', 'C4', 'C4']
          }
        ],
        quotes: [
          {
            text: 'Ki miben járatlan, abban gyermek.',
            source: 'Kodály Zoltán (1941)'
          }
        ]
      },
      {
        id: 'ritmuskepsz',
        title: '1.2 Ritmusképletek és szünetek',
        summary: 'Összetettebb ritmusminták: szinkópa, éles ritmus, nyújtott ritmus, triola és a szünetjelek.',
        content: [
          'Szinkópa [TI-TÁ-TI]: Két nyolcad értékből, s középen negyed értékből áll. Négy nyolcadból jön létre.',
          'Éles ritmus [TI-TÁM / TI-TÁI]: Nyolcad + pontozott negyed.',
          'Nyújtott ritmus [TÁM-TI / TÁI-TI]: Pontozott nyegyed + nyolcad.',
          'Triola: Ha egy negyed érték megszólalásának ideje alatt egyenletesen oszlik el három kisebb érték.',
          'Szünetjelek: Egész szünet (-), fél szünet ([SZÜ-NET]), negyed szünet ([SZÜN]), nyolcad szünet ([SZÜ]).'
        ],
        examples: [
          {
            title: 'Szinkópa példa',
            description: '„Círóka, maróka, Mit főztél? Kását.”',
            audioNotes: ['C4', 'E4', 'E4', 'C4']
          }
        ]
      },
      {
        id: 'tempo-utem',
        title: '1.3 Tempó és Ütemfajták',
        summary: 'A tempó a zenemű sebessége, Mälzel-metronóm használata. Az ütem mint metrikus egység és ütemjelzők.',
        content: [
          'A tempó a zenemű hangjainak abszolút időtartam-meghatározása (szemben a relatív ritmussal).',
          'Mälzel-féle metronóm (M. M.): pl. M. M. = 60 azt jelenti, hogy 60 ütés jut egy percre.',
          'Ütemfajták:',
          '• 2/4-es ütem: Magyar gyermekdalok jellemző ütemfajtája. 1 súlyos, 1 súlytalan negyed.',
          '• 3/4-es ütem: Egy súlyos és két súlytalan egység (pl. Sárga csikó).',
          '• 4/4-es ütem: Fősúly az 1., melléksúly a 3. negyeden.',
          '• 6/8-os ütem: Nyolcad egységnyi ütem, 6 nyolcad fér egy ütembe (pl. Summáját írom).'
        ]
      }
    ]
  },
  {
    id: 'hangok-kulcsok',
    number: 2,
    title: 'Hangok, Kulcsok és Módosító Jelek',
    description: 'Abszolút hangok, violin kulcs (G-kulcs), vonalrendszer, módosító jelek (# kereszt, b bé) és előjegyzések.',
    iconName: 'Music',
    subchapters: [
      {
        id: 'abszolutm-hangok',
        title: '2.1 Abszolút hangok és a Violin kulcs',
        summary: 'Az abszolút hangok helye és magassága állandó, nagybetűvel jelölve (C, D, E, F, G, A, H).',
        content: [
          'A vonalrendszer öt vonalból és négy vonalközből áll, alulról felfelé számozva.',
          'Violin vagy G-kulcs: A kezdő rajzolat a második vonalon van, ez az egyvonalas G hang.',
          'Félhang-lépések: EF és HC hangpárok között kis szekund (fél hang) távolság van, a többi nagy szekund.',
          'Férfiak hangfekvése egy oktávval mélyebb a női hangnál.'
        ],
        examples: [
          {
            title: 'Alaphangok skála',
            description: 'C4, D4, E4, F4, G4, A4, H4, C5',
            audioNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'H4', 'C5']
          }
        ]
      },
      {
        id: 'modositok',
        title: '2.2 Módosító jelek és előjegyzések',
        summary: 'Kereszt (#) felemel (-isz végződés), bé (b) leszállít (-esz / b végződés). Előjegyzések a kottasor elején.',
        content: [
          'Kereszt (#): A hang magasságát fél hanggal (kis szekunddal) felemeli. Törzshang neve + „-isz” (Cisz, Disz, Eisz, Fisz, Gisz, Áisz Hisz).',
          'Bé (b): A hang magasságát fél hanggal (kis szekunddal) leszállítja. Név + „-esz” (Cesz, Desz, Esz, Fesz, Gesz, Ász, B).',
          'Előjegyzés: A kulcs utáni módosító jelek az egész zeneműre érvényesek.'
        ]
      }
    ]
  },
  {
    id: 'szolmizacio-hangkozok',
    number: 3,
    title: 'Szolmizáció és Hangközök (Intervallumok)',
    description: 'Relatív szolmizációs hangok (d-r-m-f-s-l-t), tiszta, kis- és nagy hangközök prímektől decimáig.',
    iconName: 'Layers',
    subchapters: [
      {
        id: 'szolmizacio-elonyai',
        title: '3.1 Relatív szolmizáció',
        summary: 'A szolmizáció nem az abszolút magasságot, hanem a hangnemen belüli funkciót jelöli (dó, ré, mi, fá, szó, lá, ti).',
        content: [
          'Dúr hangsorban az 1. hang a dó, moll hangsorban az 1. hang a lá.',
          'Kodály elve: „Könnyebb félhang nélkül tisztán énekelni” (félhang nélküli pentatónia / hexachord).',
          'Azonos hangzók (ó-i, ó-á) segítik az intonációt és zenei emlékezetet.'
        ]
      },
      {
        id: 'hangkoz-fajtak',
        title: '3.2 Hangközök (Prímtől Decimáig)',
        summary: 'Két hang egymástól való távolsága. Tiszta, kis- és nagy hangközök.',
        content: [
          'a) Prím (1): Azonos magasságú hangok (pl. d-d, jele: T1)',
          'b) Szekund (2): Szomszédos hangok (kis szekund, jele: K2 (mi-fá, ti-dó); nagy szekund jele: N2 (d-r, r-m, f-s, s-l, l-t)',
          'c) Terc (3): Három hang távolság (kis terc, jele: K3, nagy terc, jele: N3). K3 = N2 + K2. N3 = N2 + N2.',
          'd) Kvart (4): Négy hang távolság (tiszta kvart, jele? T4 (pl.: d-f). T4 = N2 + N2 + N2 + K2.',
          'e) Kvint (5): Öt hang távolság (tiszta kvint, jele: t5). T5 = N2 + N2 + N2 + N2 + K2.',
          'f) Szext (6): Hat hang távolság (kis szext k6, nagy szext n6)',
          'g) Szeptim (7): Hét hang távolság (kis szeptim k7, nagy szeptim n7)',
          'h) Oktáv (8): Nyolc hang távolság (tiszta oktáv t8: l,-l\')',
          'i) Nona (9) és Decima (10): Oktávon túli hangközök.'
        ],
        examples: [
          {
            title: 'Tiszta Kvint hallgatása',
            description: 'd - s (Dó és Szó hangok együttesen vagy egymás után)',
            audioNotes: ['C4', 'G4']
          },
          {
            title: 'Nagy Terc hallgatása',
            description: 'd - m (Dó és Mi)',
            audioNotes: ['C4', 'E4']
          }
        ]
      }
    ]
  },
  {
    id: 'hangkeszletek',
    number: 4,
    title: 'Gyermekdalok Hangkészlete',
    description: 'Biton, triton, tetraton, pentaton, hexachord, bichord, trichord és pentachord hangkészletek.',
    iconName: 'BookOpen',
    subchapters: [
      {
        id: 'ton-hangkeszlet',
        title: '4.1 Non-ton (nem szomszédos) hangkészletek',
        summary: 'Olyan hangok, amelyek nem egymás után következnek, nélkülözik a kis szekundot.',
        content: [
          '• Biton: Két nem szomszédos hang (pl. s-m, Csigabiba bácsi).',
          '• Triton: Három nem szomszédos hang (pl. l-s-m, Borsót főztem).',
          '• Tetraton: Négy nem szomszédos hang (pl. s-m-r-d).',
          '• Pentaton: Öt nem szomszédos hang, a magyar népzene alapja.'
        ]
      },
      {
        id: 'chord-hangkeszlet',
        title: '4.2 Chord (szomszédos) hangkészletek',
        summary: 'Egymás melletti szomszédos hangokból álló láncok.',
        content: [
          '• Bichord: Két szomszédos hang nagy szekund távolságban (s-l).',
          '• Trichord: Három egymás melletti hang (d-r-m, Túrót ettem).',
          '• Pentachord és Hexachord: 5 illetve 6 egymás melletti hang.'
        ]
      }
    ]
  },
  {
    id: 'hetfoku-hangsorok',
    number: 5,
    title: 'Hétfokú Hangsorok, Dúr-Moll és Kvintkör',
    description: 'Ion, líd, mixolíd, természetes, összhangzatos és dallamos moll, valamint a kvintkör és hármashangzatok.',
    iconName: 'Compass',
    subchapters: [
      {
        id: 'dúr-es-modalis',
        title: '5.1 Dúr és modális hétfokú hangsorok',
        summary: 'A dúr hangsor szerkezete (2 egész, 1 fél, 3 egész, 1 fél lépés). Modális hangsorok (líd, mixolíd).',
        content: [
          'Dúr hangsor szerkezete: n2 + n2 + k2 + n2 + n2 + n2 + k2 (dó-tól dó-ig).',
          'G-dúr: 1 kereszt (#) - Fisz.',
          'D-dúr: 2 kereszt (#) - Fisz, Cisz.',
          'F-dúr: 1 bé (♭) – B (leszállított H).',
          'Modális hangsorok: Ion (dúr), Líd (bővített kvart), Mixolíd (kis szeptim).'
        ]
      },
      {
        id: 'moll-hangsorok',
        title: '5.2 Moll hangsorok fajtái',
        summary: 'Természetes moll (aelol), összhangzatos moll (felemelt 7. fokkal), és dallamos moll.',
        content: [
          'A moll hangsor a dúr hangsor 6. fokára épül (la- hangsor, kis terc az alaphangon).',
          '• Természetes moll: Változatlan hangok (pl. a-moll).',
          '• Összhangzatos moll: A 7. fok felemelve (vezetőhang, szi).',
          '• Dallamos moll: A 6. és 7. fok felemelve a felfelé menő menetben.'
        ]
      },
      {
        id: 'harmashangzatok',
        title: '5.3 Hármashangzatok leltára',
        summary: 'Dúr (nagy+kis terc), moll (kis+nagy terc), szűkített (kis+kis terc) és bővített (nagy+nagy terc) hármashangzatok.',
        content: [
          'Dúr hármashangzat (D): Nagy terc alul, kis terc felül.',
          'Moll hármashangzat (m): Kis terc alul, nagy terc felül.',
          'Szűkített hármashangzat (sz): Két kis terc.',
          'Bővített hármashangzat (B): Két nagy terc.'
        ]
      }
    ]
  }
];

export const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 'f1',
    term: 'Ritmus',
    definition: 'A zenében a hangok sorának időbeli rendje, egymáshoz való időértékviszonya.',
    category: 'Ritmus'
  },
  {
    id: 'f2',
    term: 'Szinkópa',
    definition: 'Ritmusképlet [TI-TÁ-TI], amely két nyolcad értékből s középen negyed értékből áll.',
    category: 'Ritmus'
  },
  {
    id: 'f3',
    term: 'Mälzel-metronóm',
    definition: 'A tempó (sebesség) mérésére szolgáló mechanikus vagy digitális ingás eszköz (M. M.).',
    category: 'Tempó'
  },
  {
    id: 'f4',
    term: 'Violin kulcs (G-kulcs)',
    definition: 'A violinkulcs (más néven G-kulcs) a zenei kottázásban használt hangmagasság-jelölő kulcs. A kottavonalak közül a második vonalon áll, és az egyvonalas G hang helyét jelöli.',
    category: 'Hangok'
  },
  {
    id: 'f5',
    term: 'Kereszt (#)',
    definition: 'Módosító jel, amely a hang magasságát fél hanggal felemeli (-isz végződés).',
    category: 'Hangok'
  },
  {
    id: 'f6',
    term: 'Bé (b)',
    definition: 'Módosító jel, amely a hang magasságát fél hanggal leszállítja (-esz végződés).',
    category: 'Hangok'
  },
  {
    id: 'f7',
    term: 'Szolmizáció',
    definition: 'Relatív hangmagasság-jelölési rendszer (dó, ré, mi, fá, szó, lá, ti), amely a hangok egymáshoz való viszonyát mutatja.',
    category: 'Szolmizáció'
  },
  {
    id: 'f8',
    term: 'Prím (T1)',
    definition: 'Két azonos magasságú hang közötti hangköz (intervallum).',
    category: 'Hangközök'
  },
  {
    id: 'f9',
    term: 'Kvint (T5)',
    definition: 'Öt hang távolságát jelölő tiszta, kiválóan hangzó (konszonáns) hangköz.',
    category: 'Hangközök'
  },
  {
    id: 'f10',
    term: 'Pentaton hangkészlet',
    definition: 'Öt, nem egymás melletti hangból építkező hangkészlet, a magyar népzene alappillére.',
    category: 'Hangkészletek'
  },
  {
    id: 'f11',
    term: 'Dúr hangsor',
    definition: 'Hétfokú hangsor, amely dó-tól dó-ig épül fel: 2 db N2, 1 db K2, 3 db N2, 1 db K2 lépés szerkezetben.',
    category: 'Hangsorok'
  },
  {
    id: 'f12',
    term: 'Természetes moll (eol)',
    definition: 'A Dúr hangsor 6. fokára épülő, kis terccel kezdődő la-alapú moll hangsor: 1 db N2, 1 db K2, 2 db N2, 1 db K2, 2 db N2 lépés szerkezetben.',
    category: 'Hangsorok'
  },
  {
    id: 'f13',
    term: 'Dúr hármashangzat',
    definition: 'Hármashangzat, amelynek alsó terce nagy (N3), felső terce kis terc (K3).',
    category: 'Hármashangzatok'
  },
  {
    id: 'f14',
    term: 'moll hármashangzat',
    definition: 'Hármashangzat, amelynek alsó terce kicsi (K3), felső terce nagy (N3).',
    category: 'Hármashangzatok'
  },
  {
    id: 'f15',
    term: 'Dó (d)',
    definition: 'Relatív szolmizációban a dúr hangsor alaphangja, vagyis az 1. fok. A hangmagassága a hangnemmel együtt változik.',
    category: 'Szolmizáció'
  },
  {
    id: 'f16',
    term: 'Lá (l)',
    definition: 'A természetes moll hangsor alaphangjának relatív szolmizációs neve.',
    category: 'Szolmizáció'
  },
  {
    id: 'f17',
    term: 'Relatív szolmizáció',
    definition: 'A szótagok a hangnem fokaihoz és a hangok egymáshoz való viszonyához kötődnek; dúrban az alaphang dó, mollban lá.',
    category: 'Szolmizáció'
  },
  {
    id: 'f18',
    term: 'ABC-s hangnevek',
    definition: 'A magyar törzshangok sorrendje: C, D, E, F, G, A, H; a H után a következő oktávban újra C következik.',
    category: 'ABC-s hangok'
  },
  {
    id: 'f19',
    term: 'H és B',
    definition: 'A magyar hangnevekben H a természetes B hang, B pedig a leszállított H hang (nemzetközi jelöléssel B♭).',
    category: 'ABC-s hangok'
  },
  {
    id: 'f20',
    term: 'C-dúr hangnevei',
    definition: 'C, D, E, F, G, A, H; a C-dúr példában ezekhez a dó, ré, mi, fá, szó, lá, ti szótagok tartoznak.',
    category: 'ABC-s hangok'
  },
  {
    id: 'f21',
    term: 'Ré (r)',
    definition: 'A dúr hangsor második foka a relatív szolmizációban.',
    category: 'Szolmizáció'
  },
  {
    id: 'f22',
    term: 'Mi (m)',
    definition: 'A dúr hangsor harmadik foka a relatív szolmizációban.',
    category: 'Szolmizáció'
  },
  {
    id: 'f23',
    term: 'Fá (f)',
    definition: 'A dúr hangsor negyedik foka a relatív szolmizációban.',
    category: 'Szolmizáció'
  },
  {
    id: 'f24',
    term: 'Szó (s)',
    definition: 'A dúr hangsor ötödik foka a relatív szolmizációban.',
    category: 'Szolmizáció'
  },
  {
    id: 'f25',
    term: 'Ti (t)',
    definition: 'A dúr hangsor hetedik foka a relatív szolmizációban; a dó felé vezet.',
    category: 'Szolmizáció'
  },
  {
    id: 'f26',
    term: 'Oktávszám',
    definition: 'A hangnév után írt szám a hang fekvését jelzi. Például C5 egy oktávval magasabb, mint C4.',
    category: 'ABC-s hangok'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    chapterId: 'ritmus',
    question: 'Mit jelent a ritmus a zenében a leírás alapján?',
    options: [
      'A hangok hangerejét és dinamikáját',
      'A hangok sorának időbeli rendjét, egymáshoz való időértékviszonyát',
      'A dalok szövegének ritmusát és rímelését',
      'A hangszerek hangszínét'
    ],
    correctIndex: 1,
    explanation: 'A ritmus a zenében a hangok sorának időbeli rendje, egymáshoz való időértékviszonya [Böhm, 2000].'
  },
  {
    id: 'q2',
    chapterId: 'ritmus',
    question: 'Hogyan épül fel a szinkópa ritmusképlet?',
    options: [
      'Két negyed és egy nyolcad értékből',
      'Két nyolcad értékből, s középen negyed értékből [TI-TÁ-TI]',
      'Négy egyenlő tizenhatod értékből',
      'Egy egész és egy fél hangból'
    ],
    correctIndex: 1,
    explanation: 'A szinkópa [TI-TÁ-TI] két nyolcad értékből, s középen negyed értékből áll.'
  },
  {
    id: 'q3',
    chapterId: 'ritmus',
    question: 'Mi a magyar gyermekdalok legjellemzőbb ütemfajtája?',
    options: ['3/4-es ütem', '4/4-es ütem', '2/4-es ütem', '6/8-os ütem'],
    correctIndex: 2,
    explanation: 'A 2/4-es ütem (egy súlyos és egy súlytalan negyed) a magyar gyermekdalok legjellemzőbb ütemfajtája.'
  },
  {
    id: 'q4',
    chapterId: 'hangok-kulcsok',
    question: 'Melyik vonalon helyezkedik el a violin (G) kulcs kezdő rajzolata?',
    options: ['Az 1. vonalon', 'A 2. vonalon', 'A 3. vonalon', 'Az 5. vonalon'],
    correctIndex: 1,
    explanation: 'A violin kulcs kezdő rajzolata a második vonalon helyezkedik el, ami az egyvonalas G hang helye.'
  },
  {
    id: 'q5',
    chapterId: 'hangok-kulcsok',
    question: 'Hogyan módosítja a kereszt (#) jel a hangot?',
    options: [
      'Fél hanggal (kis szekunddal) leszállítja',
      'Egész hanggal (nagy szekunddal) felemeli',
      'Fél hanggal (kis szekunddal) felemeli (-isz végződést kap)',
      'Nem változtat a magasságán'
    ],
    correctIndex: 2,
    explanation: 'A kereszt (#) a hang magasságát fél hanggal felemeli, és a neve -isz szótaggal egészül ki.'
  },
  {
    id: 'q6',
    chapterId: 'szolmizacio-hangkozok',
    question: 'Mit jelöl a relatív szolmizáció?',
    options: [
      'A hangok abszolút frekvenciáját Hertzben',
      'A hangnemen belüli funkciót és relatív magasságot (dó, ré, mi...)',
      'A zongorabillentyűk pontos helyét',
      'A dalok tempóját'
    ],
    correctIndex: 1,
    explanation: 'A szolmizáció nem az abszolút magasságot, hanem egy hangnemen belül jelzi a hang funkcióját, relatív magasságát.'
  },
  {
    id: 'q7',
    chapterId: 'szolmizacio-hangkozok',
    question: 'Milyen hangköz van két azonos magasságú hang között?',
    options: ['Szekund', 'Prím (t1)', 'Terc', 'Kvint'],
    correctIndex: 1,
    explanation: 'Két azonos magasságú hang közti hangköz neve prím (1), pl. d-d.'
  },
  {
    id: 'q8',
    chapterId: 'hangkeszletek',
    question: 'Mi jellemző a biton hangkészletre?',
    options: [
      'Öt egymás melletti hang alkotja',
      'Két különböző, nem egymás melletti hang alkotja',
      'Hétfokú dúr hangsor',
      'Csak félhangokat tartalmaz'
    ],
    correctIndex: 1,
    explanation: 'Ha két különböző hangból áll a dallam és nem egymás melletti a két hang, ez a biton hangkészlet.'
  },
  {
    id: 'q9',
    chapterId: 'hetfoku-hangsorok',
    question: 'Hogyan épül fel a dúr hangsor lépésközeinek sorrendje?',
    options: [
      '2 egész, 1 fél, 3 egész, 1 fél lépés',
      'Csak fél hang lépések',
      '3 egész és 3 fél lépés',
      '1 fél és 5 egész lépés'
    ],
    correctIndex: 0,
    explanation: 'A dúr hangsor 2 egész, egy fél, majd 3 egész és egy fél lépésből épül fel (n2+n2+k2+n2+n2+n2+k2).'
  },
  {
    id: 'q10',
    chapterId: 'solfege',
    question: 'Mit jelöl a dó a relatív szolmizációban dúr hangnemben?',
    options: ['A dúr hangsor alaphangját', 'Mindig a C hangot', 'A hangsor ötödik fokát', 'A hang legrövidebb időértékét'],
    correctIndex: 0,
    explanation: 'Relatív szolmizációban a dúr hangsor első foka, az alaphang kapja a dó nevet; a hangmagassága a hangnemtől függ.'
  },
  {
    id: 'q11',
    chapterId: 'solfege',
    question: 'Mi változik, ha egy dúr dallamot más hangnembe helyezünk át relatív szolmizációval?',
    options: [
      'A dallam hangközviszonyai és szótagjai változatlanok, a dó tényleges hangmagassága változik',
      'Minden hang ugyanazon a fizikai hangmagasságon marad',
      'A dó minden hangnemben C marad',
      'A dallam ritmusa megváltozik'
    ],
    correctIndex: 0,
    explanation: 'A relatív szolmizáció a fokok és hangközök viszonyát őrzi meg; a változó dó új alaphangra kerül.'
  },
  {
    id: 'q12',
    chapterId: 'solfege',
    question: 'Melyik szótag jelöli a természetes moll hangsor alaphangját a relatív szolmizációban?',
    options: ['Dó', 'Mi', 'Szó', 'Lá'],
    correctIndex: 3,
    explanation: 'A természetes moll hangsor alaphangját relatív szolmizációban lá-nak nevezzük.'
  },
  {
    id: 'q13',
    chapterId: 'abc-hangok',
    question: 'Mi a magyar törzshangok emelkedő sorrendje?',
    options: ['C, D, E, F, G, A, H', 'A, B, C, D, E, F, G', 'C, E, G, A, H, D, F', 'D, E, F, G, A, H, C'],
    correctIndex: 0,
    explanation: 'A magyar hangnévrendszerben a törzshangok C, D, E, F, G, A, H sorrendben követik egymást.'
  },
  {
    id: 'q14',
    chapterId: 'abc-hangok',
    question: 'Mit jelent a H hang a magyar hangnévrendszerben?',
    options: ['A leszállított B hangot', 'A természetes B hangot', 'A C hangot', 'A félhanggal felemelt A hangot'],
    correctIndex: 1,
    explanation: 'A magyar hangnév H a természetes B hangot jelöli. A magyar B a leszállított H hang neve.'
  },
  {
    id: 'q15',
    chapterId: 'abc-hangok',
    question: 'Mi következik a H után a magyar törzshangok sorában?',
    options: ['A', 'B', 'C a következő oktávban', 'D a következő oktávban'],
    correctIndex: 2,
    explanation: 'A H után a C hang következik, amely az előző C-nél egy oktávval magasabban szól.'
  }
];

export const MATCHING_PAIRS: MatchingPair[] = [
  { id: 'm1', term: 'Egész érték', match: 'tá - á - á - á', category: 'Ritmus' },
  { id: 'm2', term: 'Nyolcad érték', match: 'ti - ti (párban)', category: 'Ritmus' },
  { id: 'm3', term: 'Szinkópa', match: 'TI - TÁ - TI', category: 'Ritmus' },
  { id: 'm4', term: 'Éles ritmus', match: 'TI - TÁM', category: 'Ritmus' },
  { id: 'm5', term: 'Nyújtott ritmus', match: 'TÁM - TI', category: 'Ritmus' },
  { id: 'm6', term: 'Kereszt (#)', match: 'Fél hanggal felemeli (-isz)', category: 'Hangok' },
  { id: 'm7', term: 'Bé (b)', match: 'Fél hanggal leszállítja (-sz)', category: 'Hangok' },
  { id: 'm8', term: 'Tiszta prím (T1)', match: 'Két azonos hang', category: 'Hangközök' },
  { id: 'm9', term: 'Tiszta kvint (T5)', match: 'Öt hang távolság', category: 'Hangközök' },
  { id: 'm10', term: 'Tiszta Kvárt (T4)', match: 'Négy hang távoldóság', category: 'Hangköz' },
  { id: 'm11', term: 'Biton hangkészlet', match: 'Két nem szomszédos hang', category: 'Hangkészletek' },
  { id: 'm12', term: 'Triton hangkészlet', match: 'Három nem szomszédos hang', category: 'Hangkészletek' },
  { id: 'm13', term: 'Pentaton hangkészlet', match: 'Öt nem szomszédos hang', category: 'Hangkészletek' },
  { id: 'm14', term: 'Dúr hármashangzat', match: 'Nagy terc + kis terc', category: 'Hármashangzatok' },
  { id: 'm15', term: 'Dó (d)', match: 'A dúr hangsor 1. foka, alaphangja', category: 'Szolmizáció' },
  { id: 'm24', term: 'Ré (r)', match: 'A dúr hangsor 2. foka', category: 'Szolmizáció' },
  { id: 'm16', term: 'Mi (m)', match: 'A dúr hangsor 3. foka', category: 'Szolmizáció' },
  { id: 'm25', term: 'Fá (f)', match: 'A dúr hangsor 4. foka', category: 'Szolmizáció' },
  { id: 'm17', term: 'Szó (s)', match: 'A dúr hangsor 5. foka', category: 'Szolmizáció' },
  { id: 'm18', term: 'Lá (l)', match: 'A természetes moll alaphangja; dúrban a 6. fok', category: 'Szolmizáció' },
  { id: 'm26', term: 'Ti (t)', match: 'A dúr hangsor 7. foka', category: 'Szolmizáció' },
  { id: 'm19', term: 'C', match: 'C-dúrban: dó', category: 'ABC-s hangok' },
  { id: 'm27', term: 'D', match: 'C-dúrban: ré', category: 'ABC-s hangok' },
  { id: 'm20', term: 'E', match: 'C-dúrban: mi', category: 'ABC-s hangok' },
  { id: 'm28', term: 'F', match: 'C-dúrban: fá', category: 'ABC-s hangok' },
  { id: 'm21', term: 'G', match: 'C-dúrban: szó', category: 'ABC-s hangok' },
  { id: 'm29', term: 'A', match: 'C-dúrban: lá', category: 'ABC-s hangok' },
  { id: 'm22', term: 'H', match: 'A természetes B hang magyar neve', category: 'ABC-s hangok' },
  { id: 'm23', term: 'B', match: 'A leszállított H hang magyar neve (B♭)', category: 'ABC-s hangok' }
];
