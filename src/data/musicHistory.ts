/**
 * Zenetörténeti áttekintés, önálló fogalmazásban.
 * A Wikipédia-szócikkek ellenőrzési és továbbolvasási források, nem átvett szövegek.
 * Időhatárok hozzávetőlegesek; az egyes stílusok átfedésben is éltek.
 */
export interface HistoryPeriod {
  id: string;
  name: string;
  period: string;
  lead: string;
  features: string[];
  genres: string[];
  figures: string[];
  example: string;
  question: string;
  sourceLinks: { name: string; url: string }[];
}
const w = (name: string, slug: string) => ({
  name, url: 'https://hu.wikipedia.org/wiki/' + encodeURIComponent(slug).replace(/%2F/g,'/')
});
export const MUSIC_HISTORY: HistoryPeriod[] = [
  {
    id: 'kezdetek', name: 'Ókor és az európai zene kezdetei', period: 'Ókor – Kr. u. 5. század',
    lead: 'A zenélés ősi emberi tevékenység. Az ókori kultúrákban a vallás, a szertartások és a közösségi élet része volt. A fennmaradt írásos és tárgyi emlékekből elsősorban a zene szerepéről és eszközeiről tudhatunk meg többet.',
    features: ['Görög zeneelméleti gondolkodás és hangsorok.', 'Ének, hangszeres játék és költészet szoros kapcsolata.', 'Korlátozott számú fennmaradt kotta és zenei emlék.'],
    genres: ['Szertartási ének', 'Ünnepi ének', 'Hangszerkíséretes előadás'],
    figures: ['Püthagorasz (hagyományosan hozzá kötött hangközelmélet)', 'Platón', 'Arisztotelész'],
    example: 'Vizsgáld meg, miért nehéz rekonstruálni egy olyan korszak zenéjét, amelyből kevés hangzó vagy lejegyzett adat maradt fenn.',
    question: 'Milyen forrásokból ismerhető meg az ókor zenei élete?',
    sourceLinks: [w('Zenetörténet – ókori zene','Zenetörténet')]
  },
  {
    id: 'kozepkor', name: 'Középkor', period: 'Kb. 500–1450',
    lead: 'Az európai írott zenetörténet egyik fő forrása az egyházi zene. A gregorián ének és a korai többszólamúság fejlesztése hozzájárult a kottaírás alakulásához.',
    features: ['Latin nyelvű liturgikus énekek.', 'Modális dallamvilág.', 'A neumaírástól a vonalrendszeres jelölés felé haladó lejegyzés.', 'Az organum és a korai többszólamúság.'],
    genres: ['Gregorián ének', 'Organum', 'Motetta', 'Trubadúrének'],
    figures: ['Guido d’Arezzo', 'Hildegard von Bingen', 'Léonin', 'Pérotin'],
    example: 'Hasonlíts össze egy egyszólamú gregorián részletet és egy korai organumot: hány önálló dallamvonalat hallasz?',
    question: 'Miért volt jelentős a kottaírás fejlődése a középkorban?',
    sourceLinks: [w('Középkori zene','Középkori_zene'),w('Zenetörténet – középkor','Zenetörténet')]
  },
  {
    id: 'reneszansz', name: 'Reneszánsz', period: 'Kb. 1450–1600',
    lead: 'A reneszánsz zenében különösen fontos a szólamok kiegyensúlyozott összjátéka, az utánzás és az énekelt szöveg árnyalt megszólaltatása. A nyomtatás elősegítette a művek terjedését.',
    features: ['Utánzásos polifónia és egységes hangzás.', 'A cappella kóruskultúra.', 'A világi vokális műfajok erősödése.', 'A hangjegynyomtatás elterjedése.'],
    genres: ['Mise', 'Motetta', 'Madrigál', 'Chanson'],
    figures: ['Josquin des Prez', 'Giovanni Pierluigi da Palestrina', 'Orlando di Lasso'],
    example: 'Egy rövid motetta hallgatásakor keresd meg, mikor veszi át ugyanazt a dallamkezdetet egy másik szólam.',
    question: 'Mi különbözteti meg az utánzásos polifóniát az egyszólamú énektől?',
    sourceLinks: [w('Reneszánsz zene','Reneszánsz_zene')]
  },
  {
    id: 'barokk', name: 'Barokk', period: 'Kb. 1600–1750',
    lead: 'A barokk korban a basso continuo, a hangnemiség megszilárdulása és az erős kifejező ellentétek jelentős szerepet kaptak. Ekkor bontakozott ki az opera, a versenymű és számos hangszeres forma.',
    features: ['Continuo-kíséret és szólóhangszeres virtuozitás.', 'Szekvenciák, díszítések és kontrasztok.', 'Fúga és összetett polifón szerkesztés.', 'A dúr–moll tonalitás megerősödése.'],
    genres: ['Opera', 'Oratórium', 'Kantáta', 'Concerto', 'Szvit', 'Fúga'],
    figures: ['Claudio Monteverdi', 'Antonio Vivaldi', 'Johann Sebastian Bach', 'Georg Friedrich Händel'],
    example: 'Figyeld meg egy barokk versenyműben, mikor válaszol a zenekar a szólóhangszernek.',
    question: 'Mi a basso continuo szerepe a barokk zenében?',
    sourceLinks: [w('Barokk zene','Barokk_zene')]
  },
  {
    id: 'klasszika', name: 'Bécsi klasszika', period: 'Kb. 1750–1820',
    lead: 'A klasszikus stílusban a világos formai szerkezet, a kiegyensúlyozott frázisok és a témák tudatos fejlesztése kerültek előtérbe. A szimfónia, a vonósnégyes és a zongoraszonáta fontos műfajok.',
    features: ['Világosabb, tagoltabb zenei mondatok.', 'Motívumokból építkező kidolgozás.', 'Szonátaforma és klasszikus ciklusok.', 'A zenekari apparátus fejlődése.'],
    genres: ['Szimfónia', 'Vonósnégyes', 'Szonáta', 'Versenymű'],
    figures: ['Joseph Haydn', 'Wolfgang Amadeus Mozart', 'Ludwig van Beethoven'],
    example: 'Egy klasszikus szimfónia első tételében próbálj két eltérő karakterű témát megkülönböztetni.',
    question: 'Milyen szerepet tölt be a témák ellentéte a szonátaformában?',
    sourceLinks: [w('Zenetörténet – klasszicista zene','Zenetörténet'),w('Joseph Haydn','Joseph_Haydn')]
  },
  {
    id: 'romantika', name: 'Romantika', period: '19. század',
    lead: 'A romantika zenéjében az egyéni kifejezés, a gazdag hangszínek és a személyes, gyakran irodalmi vagy természeti ihletés erősödött. A virtuóz hangszerjáték és a nemzeti zenei törekvések is nagy szerepet kaptak.',
    features: ['Gazdagabb harmóniai és kromatikus nyelv.', 'Széles dinamikai és hangszínskála.', 'Programzene, karakterdarab és műdal.', 'Nemzeti stílusok és népzenei inspirációk.'],
    genres: ['Műdal', 'Szimfonikus költemény', 'Zongorakarakterdarab', 'Opera'],
    figures: ['Franz Schubert', 'Frédéric Chopin', 'Liszt Ferenc', 'Johannes Brahms', 'Richard Wagner'],
    example: 'Hallgass meg két rövid zongoradarabot: milyen eszközökkel keltenek eltérő hangulatot?',
    question: 'Mi az a programzene, és miben különbözhet az abszolút zenétől?',
    sourceLinks: [w('Romantikus zene','Romantikus_zene'),w('Liszt Ferenc','Liszt_Ferenc')]
  },
  {
    id: 'huszadik', name: '20. század és napjaink', period: '1900-tól',
    lead: 'A modern és kortárs zene nem egységes stílus: egymással párhuzamosan számos irányzat jelent meg. A hangzáskísérletek, új ritmusok, elektronikus eszközök és népzenei kutatások új lehetőségeket nyitottak.',
    features: ['Impresszionisztikus és expresszionista törekvések.', 'Új ritmikai, hangszerelési és kompozíciós technikák.', 'Elektronikus és számítógépes zene megjelenése.', 'A népzenei anyag új műzenei feldolgozásai.'],
    genres: ['Balettzene', 'Elektronikus zene', 'Minimalizmus', 'Kortárs kamarazene'],
    figures: ['Claude Debussy', 'Igor Stravinsky', 'Bartók Béla', 'Kodály Zoltán', 'Steve Reich'],
    example: 'Hallgasd meg Bartók vagy Stravinsky egy ritmikus részletét, és keresd meg a szokatlan hangsúlyokat.',
    question: 'Miért nem jellemezhető egyetlen stílusjeggyel a 20. század zenéje?',
    sourceLinks: [w('Zenetörténet – 20. század','Zenetörténet'),w('Bartók Béla','Bartók_Béla'),w('Kodály Zoltán','Kodály_Zoltán')]
  }
];
