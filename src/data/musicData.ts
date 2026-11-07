import { Chapter, Flashcard, QuizQuestion, MatchingPair } from '../types';
import { ADDITIONAL_LESSONS, ADDITIONAL_QUESTIONS, ADDITIONAL_FLASHCARDS, ADDITIONAL_MATCHING } from './extendedMusicData';
import { NEW_FLASHCARDS, NEW_QUIZZES, NEW_MATCHING } from './curriculum67Practice';
import { PORTRAIT_FLASHCARDS, PORTRAIT_MATCHING, PORTRAIT_QUIZZES } from './musicHistoryExerciseBank';
import { PEDAGOGY_FLASHCARDS, PEDAGOGY_MATCHING, PEDAGOGY_QUIZZES } from './musicPedagogyExercises';
import { FOUNDATIONS_FLASHCARDS, FOUNDATIONS_MATCHING, FOUNDATIONS_QUIZZES } from './musicFoundationsExercises';
import { HUNGARIAN_FLASHCARDS, HUNGARIAN_MATCHING, HUNGARIAN_QUIZZES } from './hungarianWorkshopsExerciseBank';

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
          'Nyújtott ritmus [TÁM-TI / TÁI-TI]: Pontozott negyed + nyolcad.',
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
        title: '1.3 Tempó, metrum, hangsúly és ütemmutatók',
        summary: 'A korábbi 1.3 és 1.5 teljes, összevont tananyaga: tempó, mérőlüktetés, súlyos/súlytalan ütések és egyszerű/összetett ütemek.',
        content: [
          'A tempó a zene haladási sebessége; a mérő vagy pulzus a rendszeresen ismétlődő viszonyítási pont. A ritmus a hangok és szünetek tényleges időbeli elrendezése, amely eltérhet az egyenletes lüktetéstől.',
          'Mälzel-metronóm: ♩ = 60 azt jelenti, hogy egy perc alatt 60 negyedütés hangzik el, azaz egy negyed egy másodpercig tart. A 6/8 ütemben fontos a nyolcad- és a pontozottnegyed-lüktetés megkülönböztetése.',
          'A metrum a hangsúlyos és hangsúlytalan egységek szabályos rendje. A fősúly rendszerint az ütem első egységére esik; a mellékhangsúly ennél gyengébb, de a súlytalan ütésekhez képest kiemelt.',
          'Az ütemmutató felső száma az ütemen belül lejegyzett egységek számát, az alsó száma a jelzett hangértéket nevezi meg. Az összetett ütemben az érzékelt mérőegység több lejegyzett hangértékből is állhat.',
          '2/4-es ütem: Két negyed; az első fősúlyos, a második súlytalan. Gyakori ütemfajta a magyar gyermekdalokban. Hallásfeladat: erős–gyenge | erős–gyenge.',
          '3/4-es ütem: Három negyed; az első fősúlyos, a második és harmadik súlytalan. Hallásfeladat: erős–gyenge–gyenge | erős–gyenge–gyenge.',
          '4/4-es ütem: Négy negyed; az első fősúlyos, a harmadik melléksúlyos, a második és negyedik súlytalan. Hallásfeladat: erős–gyenge–közepes–gyenge, majd ismétlés.',
          '6/8-os ütem: Hat nyolcadnyi érték, amely tipikusan két hármas csoportra tagolódik: 1–2–3 | 4–5–6. Az első nyolcad fősúlyos, a negyedik mellékhangsúlyos; a többi hangsúlytalan. A két nagyobb lüktetési egység rendszerint pontozott negyed.',
          'Egyszerű ütemekben a mérőegység általában ketté, összetett ütemekben hármas részekre oszlik. A 6/8 ezért nem egyszerűen gyorsabb 3/4: a hangsúlyrend 3+3 nyolcad, nem három egyenrangú negyed.',
          'Összehasonlító gyakorlat: hallgasd meg a két egymást követő ütemet mind a négy ütemmutatóban! Tapssal jelöld a fősúlyt, a 4/4 harmadik és a 6/8 negyedik egységében a mellékhangsúlyt.',
          'Önellenőrzés: a 2/4 két negyedből, a 3/4 háromból, a 4/4 négyből, a 6/8 pedig hat nyolcadból áll. Számold meg a kiemelt hangokat, és hasonlítsd össze a 3/4 és a 6/8 hangzását!'
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
            description: 'C′, D′, E′, F′, G′, A′, H′, C″ — mindegyik hang negyed értékben, 60 BPM tempóban.',
            audioNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'H4', 'C5']
          }
        ]
      },
      {
        id: 'modositok',
        title: '2.2 Módosító jelek, előjegyzések és feloldójel',
        summary: 'Kereszt, bé, feloldójel; az előjegyzés és az ütemen belüli módosítás eltérő érvénye, magyar hangnevekkel.',
        content: [
          'A kereszt (♯) a hangot félhanggal emeli: Cisz, Disz, Eisz, Fisz, Gisz, Aisz, Hisz. A bé (♭) félhanggal leszállítja: Cesz, Desz, Esz, Fesz, Gesz, Asz, B (leszállított H). A magyar hangrendszerben a H és a B nem azonos.',
          'A feloldójel (♮) megszünteti az adott hangra vonatkozó korábbi kereszt vagy bé hatását, és a törzshang természetes magasságát állítja vissza. Például Fisz után F♮ = F.',
          'Az előjegyzés a kulcs után, az ütemmutató előtt áll. Általában a darab egészében, minden oktávban érvényes az azonos nevű hangokra, amíg más előjegyzés nem következik.',
          'Az ütemen belüli módosítójel ezzel szemben rendszerint az adott hangnév ugyanazon oktávjára vonatkozik az ütem végéig. Átkötés esetén a módosított hangmagasság a következő ütemben is fennmaradhat az átkötött hangon.',
          'A keresztek szokásos sorrendje: Fisz–Cisz–Gisz–Disz–Aisz–Eisz–Hisz. A bék sorrendje: B–Esz–Asz–Desz–Gesz–Cesz–Fesz.',
          'Példák: C-dúrban nincs előjegyzés; G-dúrban Fisz, D-dúrban Fisz és Cisz, F-dúrban B szerepel. Ha D-dúrban egy Fisz elé feloldójelet teszünk, ugyanabban az ütemben az adott oktáv F hangja természetes lesz.',
          'Önellenőrzés: nevezd meg a D-dúr és F-dúr előjegyzését! Magyarázd meg, mi a különbség a kulcs melletti B előjegyzés és az ütemen belüli B módosítójel között!'
        ]
      }
    ]
  },
  {
    id: 'szolmizacio-hangkozok',
    number: 3,
    title: 'Relatív szolmizáció és hangközök',
    description: 'Dó–dó′ szolmizációs skála, transzponálás és a hangközök száma, minősége, felismerése és megszólaltatása.',
    iconName: 'Layers',
    subchapters: [
      {
        id: 'szolmizacio-elonyai',
        title: '3.1 Relatív szolmizáció, dó–dó′ hangsor és transzponálás',
        summary: 'Dó–ré–mi–fá–szó–lá–ti–dó′, a hangnemhez viszonyított fokok és áthelyezésük más alaphangra.',
        content: [
          'A relatív szolmizáció a hangok egymáshoz való viszonyát jelöli: dó, ré, mi, fá, szó, lá, ti, dó′. A dó nem egyetlen rögzített abszolút hangmagasság, hanem a választott dúr hangsor alaphangja.',
          'C-dúrban dó = C′, ré = D′, mi = E′, fá = F′, szó = G′, lá = A′, ti = H′, felső dó = C″. A megszólaló C-dúr hangsor nyolc negyedből áll, 60 BPM mellett nyolc másodpercig tart.',
          'A dúr szolmizációs hangsorban a mi–fá és ti–dó′ között félhang, a többi szomszédos fok között egészhanglépés található. Énekeld és figyeld meg a két félhanglépést!',
          'Ugyanez a dó–ré–mi dallam más hangnemben is megszólaltatható: G-dúrban dó = G, ré = A, mi = H; F-dúrban dó = F, ré = G, mi = A. A hangközviszonyok megmaradnak, az abszolút hangmagasság változik.',
          'A transzponálás során a dallam minden hangját azonos hangközzel helyezzük át. A relatív szolmizáció segít a dallam szerepeinek és hangközeinek megtartásában különböző hangnemekben.',
          'A lá-alapú természetes moll a dúrral azonos alaphangkészletből is levezethető. A lá–ti–dó–ré–mi hangsor különböző tonalitásérzetét hallás után is érdemes összehasonlítani.',
          'Gyakorlat: énekeld a dó–ré–mi–fá–szó–lá–ti–dó′ sort, majd a G–A–H–C–D hangokat G-dúrban szolmizáld szótagokkal. Transzponáld a motívumot C-dúrba!'
        ]
      },
      {
        id: 'hangkoz-fajtak',
        title: '3.2 Hangközök: fajták, számítás, fordítás és hangzó példák',
        summary: 'A prím–oktáv közötti tiszta, kis és nagy hangközök, a tritónusz, az oktávon túli hangközök és a fordítás.',
        content: [
          'A hangköz két hang magasságának különbsége. A hangköz számát a betűnevek befoglaló számolása adja: C–D szekund (2), C–E terc (3), C–F kvart (4), C–G kvint (5), C–C″ oktáv (8).',
          'A prím azonos hangmagasságú két hang (t1, 0 félhang). A kis szekund 1, a nagy szekund 2, a kis terc 3, a nagy terc 4 félhangos.',
          'A tiszta kvart 5 félhang (például C–F), a tritónusz 6 félhang (például C–Fisz, bővített kvart), a tiszta kvint 7 félhang (C–G). A tiszta kvart két egész és egy félhanglépésből áll C-dúrban.',
          'A kis és nagy szext 8, illetve 9; a kis és nagy szeptim 10, illetve 11; a tiszta oktáv 12 félhang. A nona (9) és a decima (10) az oktávon túli hangközök közé tartozik.',
          'A hangköz számát a hangnevek, a minőséget a hangköz pontos félhangtávolsága határozza meg. Az azonos félhangtávolságnak enharmonikus írásmóddal más hangközneve is lehet.',
          'Hangközfordításkor az egyik hangot oktávval áthelyezzük. A fordítás számértékei kilencre egészítik ki egymást: prím–oktáv, szekund–szeptim, terc–szext, kvart–kvint. A kis nagyra, a nagy kisre, a tiszta tisztára fordul.',
          'Példák: C–Esz kis terc (3 félhang), C–E nagy terc (4), C–F tiszta kvart (5), C–G tiszta kvint (7). A nagy terc fordítása kis szext.',
          'Hangzó gyakorlat: válaszd ki a kívánt hangközt, és figyeld meg a C′ alaphang és a második hang egymás utáni megszólalását. Hasonlítsd össze a szomszédos kis és nagy hangközöket!',
          'Önellenőrzés: számold meg a hangköz betűnév szerinti fokait, a félhangokat, majd határozd meg a minőséget és a fordítást!'
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
        title: '4.1 Hiányos és pentaton hangkészletek',
        summary: 'Biton, triton, tetraton és pentaton. A különböző hangok száma és hangközviszonyai alapján értelmezzük őket.',
        content: [
          '• Biton: Két különböző hang, például szó–mi. Kapcsolódó dal: Csigabiga bácsi.',
          '• Triton: Három különböző hang, például lá–szó–mi. Kapcsolódó dal: Borsót főztem.',
          '• Tetraton: Négy különböző hang, például szó–mi–ré–dó; a ré és dó egymás mellett állnak.',
          '• Pentaton: Öt különböző hang, például dó–ré–mi–szó–lá. A félhang nélküli pentatónia fontos a magyar népzenében.',
          'A hangkészletek elnevezése elsősorban a különböző hangok számára utal. Az a kijelentés, hogy a tetraton és a pentaton minden hangja nem szomszédos, általánosságban nem igaz; ez a hangsor jellegétől függ.',
          'Hallgasd meg a négy külön gyakorlómotívumot, majd nézd meg a helyes kottaképet. A példák nem a megnevezett gyermekdalok pontos dallamai.'
        ]
      },
      {
        id: 'chord-hangkeszlet',
        title: '4.2 Egymás melletti diatonikus hangok: bichord–hexachord',
        summary: 'Egymás melletti szomszédos hangokból álló láncok.',
        content: [
          '• Bichord: Két szomszédos hang nagy szekund távolságban (s-l).',
          '• Trichord: Három egymás melletti hang (d-r-m, Túrót ettem).',
          '• Pentachord: Öt egymás melletti diatonikus hang (dó–ré–mi–fá–szó).',
          '• Hexachord: Hat egymás melletti diatonikus hang (dó–ré–mi–fá–szó–lá).',
          'A hexachord a hat egymást követő hangból álló hangsorszakasz. A Guido-féle középkori szolmizációban ut–re–mi–fa–sol–la (egész–egész–fél–egész–egész hangközrend). Természetes: C–D–E–F–G–A; kemény: G–A–H–C–D–E; lágy: F–G–A–B–C–D. A magyar H és B hangneveket külön kell kezelni.',
          'Kapcsolódó magyar szakirodalom: Kelemen Judit, Zempléni Múzsa – Mátyás-korabeli zenei nevelés Sárospatakon a Szalkai-kódex tükrében (hexachord és Guido-kéz).'
        ]
      }
    ]
  },
  {
    id: 'hetfoku-hangsorok',
    number: 5,
    title: 'Dúr és moll hangsorok, hármashangzatok és kvintkör',
    description: 'Öt dúr hangsor, háromféle moll, a négy hármashangzat és fordításaik, részletes magyar kvintkör.',
    iconName: 'Compass',
    subchapters: [
      {
        id: 'dúr-es-modalis',
        title: '5.1 Dúr hangsorok, előjegyzések és a kvintkör alapjai',
        summary: 'C-dúr, G-dúr, D-dúr, F-dúr, B-dúr: öt hangzó hangsor magyar hangnevekkel és a kvintkör kapcsolataival.',
        content: [
          'A dúr hangsor hét különböző hangot és az oktávzáró alaphangot tartalmaz. Egész- és félhanglépései: egész–egész–fél–egész–egész–egész–fél.',
          'C-dúr: C–D–E–F–G–A–H–C; nincs előjegyzése.',
          'G-dúr: G–A–H–C–D–E–Fisz–G; egy keresztje Fisz.',
          'D-dúr: D–E–Fisz–G–A–H–Cisz–D; két keresztje Fisz és Cisz.',
          'F-dúr: F–G–A–B–C–D–E–F; egy béje B, vagyis leszállított H.',
          'B-dúr: B–C–D–Esz–F–G–A–B; két béje B és Esz. A magyar B nem a természetes H hang!',
          'A kvintkör a dúr hangnemeket felfelé haladó tiszta kvintlépések szerint rendezi: C–G–D–A–E–H–Fisz, a másik irányban C–F–B–Esz–Asz–Desz–Gesz.',
          'A keresztek sorrendje Fisz–Cisz–Gisz–Disz–Aisz–Eisz–Hisz; a béké B–Esz–Asz–Desz–Gesz–Cesz–Fesz.',
          'A kvintkör segítségével megállapítható az előjegyzés, a rokon hangnemek közelsége és a párhuzamos moll: C-dúr–a-moll, G-dúr–e-moll, D-dúr–h-moll, F-dúr–d-moll, B-dúr–g-moll.',
          'Gyakorlat: hallgasd meg az öt dúr hangsor hangjait 60 BPM mellett, figyeld meg a módosított fokokat, majd keresd meg mind az öt hangnemet a kvintkörben!'
        ]
      },
      {
        id: 'moll-hangsorok',
        title: '5.2 Természetes, harmonikus és melodikus moll',
        summary: 'A természetes, harmonikus és melodikus a-moll hangzó mintái magyar ABC-s hangnevekkel.',
        content: [
          'A moll hangsor jellegzetessége az alaphang és a harmadik fok közötti kis terc. A relatív dúr és a természetes moll azonos előjegyzésű lehet, de más alaphangra épül.',
          'Természetes a-moll: A–H–C–D–E–F–G–A; nincs előjegyzése. A hetedik fok G.',
          'Harmonikus a-moll: A–H–C–D–E–F–Gisz–A; az emelt hetedik fok vezetőhangot képez. F és Gisz között bővített szekund van.',
          'Melodikus a-moll felfelé: A–H–C–D–E–Fisz–Gisz–A. A hatodik és hetedik fok emelkedik.',
          'A klasszikus melodikus moll lefelé rendszerint a természetes moll hangjaira tér vissza: A–G–F–E–D–C–H–A.',
          'Gyakorlat: hallgasd meg mindhárom alakot és nevezd meg az emelt hangokat! Hasonlítsd össze a G–Gisz és F–Fisz különbségét.',
          'A harmonikus és a melodikus moll változatai nem külön előjegyzést jelentenek: a módosításokat az adott hang előtt jelöljük.'
        ]
      },
      {
        id: 'harmashangzatok',
        title: '5.3 Hármashangzatok, akkordfajták és fordításaik',
        summary: 'Dúr, moll, szűkített, bővített hármashangzat; alapállás, szextakkord és kvartszextakkord.',
        content: [
          'A hármashangzat tercenként építkező három különböző hangból áll. A hangzat minőségét az egymásra helyezett tercek szabják meg.',
          'Dúr hármashangzat: C–E–G, alul nagy, felül kis terc. Hangolása és karaktere különbözik a mollétól.',
          'moll hármashangzat: C–Esz–G, alul kis, felül nagy terc.',
          'Szűkített hármashangzat: C–Esz–Gesz, két kis terc; a külső hangköz szűkített kvint.',
          'Bővített hármashangzat: C–E–Gisz, két nagy terc; a külső hangköz bővített kvint.',
          'Alapállás: a hangzat alaphangja a basszusban van, például C–E–G.',
          'Első fordítás (szextakkord): a terc a basszusban, például E–G–C. Második fordítás (kvartszextakkord): a kvint a basszusban, például G–C–E.',
          'A fordítás megváltoztatja a basszushangot és a hangköz-elrendezést, de nem a hármashangzat dúr vagy moll minőségét.',
          'A G-dúr hármashangzat G–H–D, első fordítása H–D–G, második fordítása D–G–H.',
          'Hangzó gyakorlat: válaszd ki a négy hangzatfajtát és a C-dúr három állását; hallgasd meg a hangokat egyszerre, majd egymás után!',
          'Önellenőrzés: milyen tercpárokból áll a négy hangzat? Melyik hang szerepel a basszusban a szextakkordban és a kvartszextakkordban?'
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

// Kiegészítő leckék és feladatok: az eredeti azonosítók megtartásával.
for (const chapter of MUSIC_CHAPTERS) {
  chapter.subchapters.push(...(ADDITIONAL_LESSONS[chapter.id] ?? []));
}
FLASHCARDS_DATA.push(...ADDITIONAL_FLASHCARDS);
QUIZ_QUESTIONS.push(...ADDITIONAL_QUESTIONS);
MATCHING_PAIRS.push(...ADDITIONAL_MATCHING);
// Additive banks: keep all previous IDs and recorded student results intact.
FLASHCARDS_DATA.push(...NEW_FLASHCARDS);
QUIZ_QUESTIONS.push(...NEW_QUIZZES);
MATCHING_PAIRS.push(...NEW_MATCHING);
FLASHCARDS_DATA.push(...PORTRAIT_FLASHCARDS);
MATCHING_PAIRS.push(...PORTRAIT_MATCHING);
QUIZ_QUESTIONS.push(...PORTRAIT_QUIZZES);
FLASHCARDS_DATA.push(...PEDAGOGY_FLASHCARDS);
MATCHING_PAIRS.push(...PEDAGOGY_MATCHING);
QUIZ_QUESTIONS.push(...PEDAGOGY_QUIZZES);
FLASHCARDS_DATA.push(...FOUNDATIONS_FLASHCARDS);
MATCHING_PAIRS.push(...FOUNDATIONS_MATCHING);
QUIZ_QUESTIONS.push(...FOUNDATIONS_QUIZZES);
FLASHCARDS_DATA.push(...HUNGARIAN_FLASHCARDS);
MATCHING_PAIRS.push(...HUNGARIAN_MATCHING);
QUIZ_QUESTIONS.push(...HUNGARIAN_QUIZZES);
