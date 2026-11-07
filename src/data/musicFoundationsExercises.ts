import type { Flashcard, QuizQuestion, MatchingPair } from '../types';
/** Saját megfogalmazású, a kibővített 1–5. fejezetekhez készített feladatok.
 * Forrásalap: Open Music Theory (CC BY-SA 4.0); Hutchinson (University of Puget Sound).
 */
const cards:[string,string,string,string][]=[
['A mérő és a ritmus','Az egyenletes lüktetés és a tényleges hangidőtartamok rendje eltérhet.','Ritmus','ritmus'],
['Pontozott negyed','Három nyolcadnyi, azaz másfél negyednyi időérték.','Ritmus','ritmus'],
['Átkötőív','Azonos magasságú hangok időértékét kapcsolja össze.','Ritmus','ritmus'],
['Összetett metrum','A főlüktetés rendszerint hármas osztású.','Ritmus','ritmus'],
['Szinkópa','Hangsúlyeltolódás a gyengébb metrikai helyre.','Ritmus','ritmus'],
['G-kulcs','A második vonalon G4 hangot jelöl.','Kottaolvasás','hangok-kulcsok'],
['F-kulcs','A negyedik vonalon F3 hangot jelöl.','Kottaolvasás','hangok-kulcsok'],
['Magyar H hang','Az angolszász rendszer B természetes hangjának felel meg.','Kottaolvasás','hangok-kulcsok'],
['Magyar B hang','H-bé: az angolszász B-flat.','Kottaolvasás','hangok-kulcsok'],
['Enharmónia','Különböző hangnevek, melyek egyenletes temperálásban azonos billentyűn szólnak.','Kottaolvasás','hangok-kulcsok'],
['Relatív szolmizáció','Az egymáshoz viszonyított hangnemi fokokat nevezi meg.','Hangközök','szolmizacio-hangkozok'],
['Hangközszám','A két hang betűnevének befoglaló diatonikus számolásából adódik.','Hangközök','szolmizacio-hangkozok'],
['Tiszta kvart','Öt félhangos hangköz.','Hangközök','szolmizacio-hangkozok'],
['Tritónusz','Hat félhangnyi hangmagasság-távolság.','Hangközök','szolmizacio-hangkozok'],
['Hangközfordítás','A hangköz egyik hangjának oktáváthelyezése.','Hangközök','szolmizacio-hangkozok'],
['Hangkészlet','Az adott dallamban előforduló különböző hangok összessége.','Hangkészletek','hangkeszletek'],
['Hangterjedelem','A dallam legmélyebb és legmagasabb hangja közötti távolság.','Hangkészletek','hangkeszletek'],
['Anhemiton pentatónia','Félhanglépés nélküli ötfokú hangsor.','Hangkészletek','hangkeszletek'],
['Dó-pentaton','Dó–ré–mi–szó–lá hangkészlet.','Hangkészletek','hangkeszletek'],
['Hangkészlet-felmérés','Csak a különböző megszólaló hangmagasságokat számoljuk.','Hangkészletek','hangkeszletek'],
['Dúr hangsor','Egész–egész–fél–egész–egész–egész–fél lépésekből áll.','Hangsorok','hetfoku-hangsorok'],
['Harmonikus moll','A természetes moll hetedik fokát felemeli.','Hangsorok','hetfoku-hangsorok'],
['Melodikus moll','Klasszikus felmenő alakban a hatodik és hetedik fok módosul.','Hangsorok','hetfoku-hangsorok'],
['Kvintkör','Kvintlépésekben kapcsolódó hangnemek és előjegyzések rendszere.','Hangsorok','hetfoku-hangsorok'],
['Dúr hármashangzat','Alul nagy, fölötte kis terc; az alaphangtól tiszta kvintig.','Hangsorok','hetfoku-hangsorok']
];
export const FOUNDATIONS_FLASHCARDS:Flashcard[]=cards.map(([term,definition,category],i)=>({
 id:'foundations-f'+String(i+1).padStart(2,'0'),term,definition,category
}));
export const FOUNDATIONS_MATCHING:MatchingPair[]=cards.map(([term,match,category],i)=>({
 id:'foundations-m'+String(i+1).padStart(2,'0'),term,match,category
}));
const q:[string,string,string,string,string,string,string][]=[
 ['ritmus','Mennyi a pontozott negyed időértéke?','Három nyolcad','Egy nyolcad','Két egész','Négy negyed','A pont az eredeti érték felével növeli a hangot.'],
 ['ritmus','Mi jellemzi a tipikus 6/8-os lüktetést?','Két hármas osztású egység','Hat fő negyed','Három kétrészes főlüktetés','Egyetlen ütem nélküli hang','Hat nyolcad két háromrészes pulzuscsoportot alkothat.'],
 ['ritmus','Mi az átkötőív hatása?','Azonos hangok időtartamát összekapcsolja','Félhanggal emel','Elválasztja az ütemeket','Kottafejeket töröl','Az átkötőív hangértékeket ad össze, nem új hangot indít.'],
 ['ritmus','Mit jelent a szinkópa?','Hangsúlyeltolódást gyengébb metrikai helyre','Mindig gyorsuló tempót','Kizárólag triolát','Csak szünetből álló ütemet','A szinkópa a metrikai várakozást eltoló ritmikai jelenség.'],
 ['ritmus','Miért segít a mérőtartás a ritmusképletek felismerésében?','Állandó időbeli viszonyítási pontot ad','Helyettesíti a hangmagasságot','Megváltoztatja az előjegyzést','Eltünteti a szüneteket','A stabil mérőhöz lehet viszonyítani a ritmikai eltéréseket.'],
 ['hangok-kulcsok','Mi a G-kulcs második vonalának hangja?','G4','C4','F3','A3','A G-kulcs a második vonalat jelöli ki G hangnak.'],
 ['hangok-kulcsok','Melyik vonalon van F3 az F-kulcsban?','A negyediken','Az elsőn','A másodikon','A harmadikon','Az F-kulcs két pontja közötti negyedik vonal az F3.'],
 ['hangok-kulcsok','Hogyan jelöljük magyar hangnévvel a H leszállított alakját?','B','Hisz','Cesz','Fisz','Magyar rendszerben B = H-bé, angolul B-flat.'],
 ['hangok-kulcsok','Mi az enharmónia példája egyenletes temperálásban?','Fisz és Gesz','C és D','E és G','A és H','Fisz és Gesz ugyanazon billentyűnek felelhet meg, de írásmódjuk eltér.'],
 ['hangok-kulcsok','Mi a D-dúr előjegyzése?','Két kereszt: Fisz és Cisz','Egy bé: B','Három bé','Nincs előjegyzése','D-dúr a kvintkörben két keresztes hangnem.'],
 ['szolmizacio-hangkozok','Milyen hangköz a C–Esz?','Kis terc','Nagy terc','Tiszta kvart','Nagy szekund','Három félhang és tercnyi diatonikus távolság: kis terc.'],
 ['szolmizacio-hangkozok','Hány félhang a tiszta kvint?','Hét','Négy','Öt','Hat','A tiszta kvint 7 félhangnyi távolság.'],
 ['szolmizacio-hangkozok','Mi a nagy terc fordítása?','Kis szext','Nagy kvint','Tiszta kvart','Kis szekund','A terc és szext fordításpár, a nagy minőség kicsire vált.'],
 ['szolmizacio-hangkozok','Mit ad a C–E hangköz betűnév szerinti számolása?','Tercet','Kis szekundot','Tiszta kvintet','Oktávot','C-D-E befoglaló számolással három fok, azaz terc.'],
 ['szolmizacio-hangkozok','Mit jelent a relatív dó G-dúrban?','G hangot','Mindig C hangot','D hangot','A hangot','Relatív szolmizációban a dó az adott dúr alaphangjához igazodik.'],
 ['hangkeszletek','Hány különböző hang a C–G–E–C–G sor?','Három','Öt','Kettő','Négy','A különböző hangok C, G és E.'],
 ['hangkeszletek','Mi az anhemiton pentaton hangsor sajátossága?','Öt hang és nincs félhanglépés','Hét hang, két félhang','Csak három hang','Kötelezően kromatikus','Az anhemiton pentaton félhang nélküli ötfokúság.'],
 ['hangkeszletek','Melyik a C-alapú dó-pentaton?','C–D–E–G–A','C–D–E–F–G','C–D–F–G–H','C–Cisz–D–Disz–E','A dó–ré–mi–szó–lá készlet C alapon C–D–E–G–A.'],
 ['hangkeszletek','Mi különbözteti meg a hangterjedelmet a hangkészlettől?','A szélső hangok távolsága, illetve a használt hangok halmaza','A hangszerek gyártási éve','A ritmusnevek sorrendje','A kottaoldalak száma','A hangterjedelem a szélső hangok közét, a hangkészlet a hangokat írja le.'],
 ['hangkeszletek','Melyik állítás igaz a hangkészlet elemszámára?','Az ismétlődő hang csak egyszer számít','Minden C hang különböző új hang','Csak a ritmusértékek számítanak','Az ütemek száma határozza meg','A hangkészletet a különböző hangmagasságok alkotják.'],
 ['hetfoku-hangsorok','Mi a dúr hangsor két félhanglépése?','3–4. és 7–8. fok között','1–2. és 5–6. között','2–3. és 4–5. között','Minden fok között','A dúr hangsor félhangjai a mi–fá és ti–dó kapcsolatok.'],
 ['hetfoku-hangsorok','Mit módosít a harmonikus moll?','Felemeli a hetedik fokot','Leszállítja a második fokot','Minden fokot félhanggal emel','Eltörli a hatodik fokot','A harmonikus moll jellegzetes vezetőhangja az emelt hetedik fok.'],
 ['hetfoku-hangsorok','Mi C-dúr párhuzamos mollja?','a-moll','c-moll','d-moll','f-moll','A párhuzamos moll ugyanannyi előjegyzést használ, C-dúrnál a-mollt.'],
 ['hetfoku-hangsorok','Hová jutunk C-dúrból egy kvinttel felfelé?','G-dúrba','F-dúrba','Esz-dúrba','Asz-dúrba','C–G tiszta kvint; G-dúr egy keresztes hangnem.'],
 ['hetfoku-hangsorok','Milyen tercsorrendű a moll hármashangzat?','Kis terc majd nagy terc','Nagy terc majd kis terc','Két nagy terc','Két tiszta kvart','Az alaphelyzetű moll hármashangzat alul kis, felül nagy tercből áll.']
];
export const FOUNDATIONS_QUIZZES:QuizQuestion[]=q.map(([chapterId,question,correct,a,b,c,explanation],i)=>{
 const options=[correct,a,b,c],shift=(i+2)%4;
 return {id:'foundations-q'+String(i+1).padStart(2,'0'),chapterId,question,
 options:options.map((_,j)=>options[(j+4-shift)%4]),correctIndex:shift,explanation};
});
