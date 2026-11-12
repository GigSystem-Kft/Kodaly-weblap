import { Flashcard, MatchingPair, QuizQuestion, SubChapter } from '../types';

/** Az eredeti fejezetekhez kapcsolódó, önállóan feldolgozható kiegészítő leckék. */
export const ADDITIONAL_LESSONS: Record<string, SubChapter[]> = {
  'hangok-kulcsok': [
    {
      id: 'kottaolvasas',
      title: '2.3 Kottaolvasás a G- és F-kulcsban',
      summary: 'Vonalak, vonalközök, segédvonalak és hangok elhelyezkedése.',
      content: [
        'A violinkulcs (G-kulcs) vonalai alulról fölfelé: E′, G′, H′, D″ és F″. A vonalközök: F′, A′, C″, E″.',
        'Az egyvonalas C′ a violinkulcs alatti első pótvonalon helyezkedik el. Az ABC-s hangnevek a hang magasságát és oktávját is jelölik.',
        'A basszuskulcs (F-kulcs) negyedik vonala a kis f hang helyét jelöli. Vonalai alulról: nagy G, nagy H, kis d, kis f, kis a; vonalközei: nagy A, kis c, kis e, kis g.',
        'Az egyvonalas C′ az F-kulcs feletti első pótvonalon helyezkedik el.',
        'Gyakorlat: írd le a G-kulcs első öt vonalának hangjait magyar oktávjelöléssel; majd nevezd meg az F-kulcs harmadik vonalát (kis d).',
        'Az egyvonalas C′ és a kétvonalas C″ között egy oktáv távolság van. Ne a nemzetközi MIDI-számjelölést (C4, C5) használd a tanulói felületen.'
      ]
    },
  ],
  hangkeszletek: [
    {
      id: 'pentaton-gyakorlat',
      title: '4.3 Ötfokúság és dallamalkotás',
      summary: 'Öt eredeti hangzó pentaton motívum: emelkedő, ereszkedő, ugrásos, hullámzó és kérdés–felelet.',
      content: [
        'A hangkészlet az adott dallamban előforduló különböző hangok összessége; a hangsor e hangok rendezett sorozata.',
        'Az anhemiton pentaton hangsort öt hang alkotja, félhanglépés nélkül. Dó-pentaton példája: dó–ré–mi–szó–lá.',
        'C-alapú példa: C–D–E–G–A. A hangokból rövid motívumok, kérdés–felelet dallampárok építhetők.',
        'Nem minden öt különböző hangból álló dallam anhemiton pentaton: ellenőrizni kell a hangközöket is.',
        'Gyakorlat: hallgasd meg és kövesd a kottán az öt saját pentaton mintát: emelkedő, ereszkedő, ugrásos, hullámzó, valamint kérdés–felelet. Mindegyik az összes dó, ré, mi, szó, lá hangot használja.',
        'Alkoss kétütemes dallamot csak az öt megadott hangból, majd válaszolj rá egy második kétütemes pentaton motívummal.'
      ],

    }
  ],
  'hetfoku-hangsorok': [
    {
      id: 'kvintkor',
      title: '5.4 Kvintkör és párhuzamos hangnemek',
      summary: 'Előjegyzések rendszere és a rokon hangnemek felismerése.',
      content: [
        'A kvintkör a hangnemeket kvintlépések szerinti rendbe szervezi. Felfelé haladva egyre több kereszt, lefelé haladva egyre több bé kerül az előjegyzésbe.',
        'Keresztes dúr hangnemek eleje: C-dúr (0), G-dúr (1), D-dúr (2), A-dúr (3), E-dúr (4).',
        'Bés dúr hangnemek eleje: C-dúr (0), F-dúr (1), B-dúr (2), Esz-dúr (3), Asz-dúr (4).',
        'A párhuzamos dúr és moll ugyanazt az előjegyzést használja: C-dúr és a-moll; G-dúr és e-moll; F-dúr és d-moll.',
        'A moll párhuzam a dúr hangsor hatodik fokán kezdődik. A két hangnemnek más az alaphangja, hiába közös a hangkészlet.',
        'Gyakorlat: határozd meg D-dúr, B-dúr és e-moll előjegyzését.'
      ]
    }
  ]
};

const rawQuestions: Array<[string,string,string,string,string,string]> = [
  ['ritmus','Hány nyolcad ér egy negyedet?','Kettő','Három','Négy','Egy'],
  ['ritmus','Hány negyed értékű egy pontozott fél?','Három','Kettő','Négy','Másfél'],
  ['ritmus','Mi tölti ki pontosan a 3/4-es ütemet?','Fél + negyed','Fél + fél','Negyed + nyolcad','Egyetlen fél'],
  ['ritmus','Hogyan csoportosul általában a 6/8 lüktetése?','Két, egyenként három nyolcados egységre','Hat hangsúlyos negyedre','Három félre','Négy negyedre'],
  ['ritmus','Mennyi egy pontozott negyed és egy nyolcad összege?','Két negyed','Egy negyed','Három negyed','Négy nyolcadnál több'],
  ['ritmus','Hány tizenhatod ér egy fél hangértéket?','Nyolc','Négy','Kettő','Tizenhat'],
  ['hangok-kulcsok','Melyik hang van a G-kulcs első vonalán?','E′','G′','F′','C′'],
  ['hangok-kulcsok','Melyik hang van a G-kulcs második vonalán?','G′','H′','E′','A′'],
  ['hangok-kulcsok','Hol található a C′ G-kulcsban?','Az alsó első segédvonalon','A harmadik vonalon','A felső vonalközben','A második vonalon'],
  ['hangok-kulcsok','Hány kereszt a D-dúr előjegyzése?','Kettő','Egy','Három','Nincs'],
  ['hangok-kulcsok','Melyik hangot módosítja az F-dúr előjegyzése?','H → B','F → Fisz','C → Cisz','E → Esz'],
  ['hangok-kulcsok','Mire szolgál a feloldójel?','A természetes hangmagasság visszaállítására','Egy oktáv emelésére','A tempó lassítására','Az ütem kihagyására'],
  ['szolmizacio-hangkozok','Hány félhang a nagy terc?','Négy','Három','Öt','Hét'],
  ['szolmizacio-hangkozok','Hány félhang a tiszta kvint?','Hét','Öt','Hat','Nyolc'],
  ['szolmizacio-hangkozok','Milyen hangköz a C–Esz?','Kis terc','Nagy terc','Kis szekund','Tiszta kvart'],
  ['szolmizacio-hangkozok','Mi a nagy terc fordítása?','Kis szext','Nagy szext','Kis terc','Tiszta kvint'],
  ['szolmizacio-hangkozok','G-dúrban melyik hang a dó?','G','C','D','A'],
  ['szolmizacio-hangkozok','Hol vannak a félhanglépések a dúr szolmizációs sorban?','Mi–fá és ti–dó','Dó–ré és szó–lá','Ré–mi és fá–szó','Szó–lá és lá–ti'],
  ['hangkeszletek','Melyik a C-alapú anhemiton pentaton hangsor?','C–D–E–G–A','C–D–E–F–G','C–Desz–E–G–A','C–D–F–G–H'],
  ['hangkeszletek','Mit jelent a hangkészlet?','A dallamban előforduló különböző hangok összességét','A hangok időtartamát','Az ütemek számát','A hangerőt'],
  ['hangkeszletek','Hány különböző hang alkotja a tetraton hangkészletet?','Négy','Három','Öt','Hét'],
  ['hangkeszletek','Mi jellemzi az anhemiton pentaton hangsort?','Nincs benne félhanglépés','Hét hangból áll','Csak félhanglépésekből áll','Mindig moll'],
  ['hetfoku-hangsorok','Melyik a C-dúr párhuzamos mollja?','a-moll','c-moll','e-moll','d-moll'],
  ['hetfoku-hangsorok','Melyik a G-dúr párhuzamos mollja?','e-moll','g-moll','a-moll','h-moll'],
  ['hetfoku-hangsorok','Mennyi bé van a B-dúr előjegyzésében?','Kettő','Egy','Három','Négy'],
  ['hetfoku-hangsorok','Milyen hangokból áll a C-dúr hármashangzat alapállásban?','C–E–G','C–Esz–G','C–E–Gisz','C–F–G'],
  ['hetfoku-hangsorok','Melyik a C-dúr hármashangzat első fordítása?','E–G–C','G–C–E','C–E–G','E–C–F'],
  ['hetfoku-hangsorok','Mit emelünk az összhangzatos mollban?','A 7. fokot','A 3. fokot','A 2. fokot','Az összes fokot'],
  ['solfege','Mi a G-dúr hangsor harmadik szolmizációs foka?','Mi (H)','Fá (C)','Ré (A)','Szó (D)'],
  ['abc-hangok','Melyik a magyar név a nemzetközi B♭ hangra?','B','H','Aisz','Cesz']
];
export const ADDITIONAL_QUESTIONS: QuizQuestion[] = rawQuestions.map(([chapterId, question, correct, wrong1, wrong2, wrong3], index) => {
  // Keep question IDs stable for saved achievements, but do not reveal the
  // correct answer by always placing it in the first slot.
  const correctIndex = index % 4;
  const options = [wrong1, wrong2, wrong3];
  options.splice(correctIndex, 0, correct);
  return {
    id: `extra-q-${index + 1}`, chapterId, question,
    options, correctIndex,
    explanation: `Helyes válasz: ${correct}. A részletes magyarázatot a kapcsolódó fejezet tananyagában találod.`
  };
});
const definitions: Array<[string,string,string]> = [
  ['Pontozott negyed','Másfél negyednyi hangérték: három nyolcad.','Ritmus'],
  ['Pontozott fél','Három negyednyi hangérték.','Ritmus'],
  ['Ritmusképlet','A hangértékek és szünetek jellegzetes sorrendje.','Ritmus'],
  ['Ütemvonal','A szomszédos ütemeket elválasztó függőleges vonal.','Ritmus'],
  ['Metrum','A hangsúlyok és lüktetések szabályos rendje.','Ritmus'],
  ['6/8','Hat nyolcadnyi ütem, gyakran két hármas lüktetési csoporttal.','Ritmus'],
  ['Feloldójel (♮)','A hangot természetes magasságára visszaállító módosítójel.','Hangok'],
  ['Segédvonal','Az ötvonalas rendszeren kívüli hangok lejegyzését segítő rövid vonal.','Hangok'],
  ['F-kulcs','A negyedik vonalon az F3 hang helyét kijelölő kulcs.','Hangok'],
  ['G-dúr előjegyzése','Egy kereszt: Fisz.','Hangok'],
  ['D-dúr előjegyzése','Két kereszt: Fisz és Cisz.','Hangok'],
  ['F-dúr előjegyzése','Egy bé: B.','Hangok'],
  ['Kis szekund','Egy félhang távolságú szekund.','Hangközök'],
  ['Nagy terc','Négy félhangból álló terc.','Hangközök'],
  ['Kis terc','Három félhangból álló terc.','Hangközök'],
  ['Tiszta kvart','Öt félhangból álló kvart.','Hangközök'],
  ['Tiszta oktáv','Tizenkét félhangból álló oktáv.','Hangközök'],
  ['Hangközfordítás','Az egyik hang oktáváthelyezésével létrejövő fordított hangköz.','Hangközök'],
  ['Transzponálás','A zene áthelyezése más magasságra a hangközviszonyok megőrzésével.','Szolmizáció'],
  ['Anhemiton pentatónia','Félhanglépés nélküli ötfokúság.','Hangkészletek'],
  ['Dó-pentaton','Dó, ré, mi, szó, lá hangokból álló pentaton hangsor.','Hangkészletek'],
  ['Kottaolvasás','A kottaképen jelölt hangmagasságok és ritmusok felismerése.','Hangok'],
  ['Kvintkör','Hangnemek rendszere kvintlépések szerint, előjegyzéseikkel együtt.','Hangsorok'],
  ['Párhuzamos hangnem','Azonos előjegyzésű dúr és moll hangnemek párja.','Hangsorok'],
  ['Szextakkord','Hármashangzat első fordítása, a terc a basszusban.','Hármashangzatok'],
  ['Kvartszextakkord','Hármashangzat második fordítása, a kvint a basszusban.','Hármashangzatok'],
  ['Szűkített hármashangzat','Két kis tercből álló háromhangú akkord.','Hármashangzatok'],
  ['Bővített hármashangzat','Két nagy tercből álló háromhangú akkord.','Hármashangzatok'],
  ['Összhangzatos moll','moll hangsor felemelt hetedik fokkal.','Hangsorok'],
  ['Dallamos moll','Felfelé a 6. és 7. fok emelt; klasszikus alakjában lefelé természetes moll.','Hangsorok']
];
export const ADDITIONAL_FLASHCARDS: Flashcard[] = definitions.map(([term, definition, category], i) => ({id: `extra-f-${i+1}`, term, definition, category}));
export const ADDITIONAL_MATCHING: MatchingPair[] = definitions.map(([term, definition, category], i) => ({id: `extra-m-${i+1}`, term, match: definition, category}));
