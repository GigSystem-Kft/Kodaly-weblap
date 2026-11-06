import type { Flashcard, QuizQuestion, MatchingPair } from '../types';
import { COMPOSER_BIOGRAPHIES, GUIDED_LISTENING } from './musicHistoryProfiles';

// Automatically derived cards and pairs maintain stable IDs if the content wording changes.
export const PORTRAIT_FLASHCARDS: Flashcard[] = COMPOSER_BIOGRAPHIES.map(person => ({
  id: 'histportrait-f-' + person.id,
  term: person.name,
  definition: person.dates + ' · ' + person.keywords.join(', ') + '. Műve: ' + person.works[0] + '.',
  category: 'Zenetörténet – alkotók'
}));
export const PORTRAIT_MATCHING: MatchingPair[] = COMPOSER_BIOGRAPHIES.map(person => ({
  id:'histportrait-m-' + person.id,
  term:person.name,
  match:person.keywords.slice(0,2).join(' és '),
  category:'Zenetörténet – alkotók'
}));
const questions: [string,string,string,string,string,string][] = [
  ['Mit érdemes megkülönböztetni a Szeikilosz-dallam mai előadásában?','A fennmaradt lejegyzést és a modern rekonstrukciót','A klasszikus szonátaformát és a fúgát','A dúr és moll skálát','A romantikus zongorakíséretet','A lejegyzett forrás nem rögzíti a mai hangszerelés minden részletét.'],
  ['Melyik forrásból ismerünk rövid ókori lejegyzett dallamot?','Szeikilosz-sírfelirat','Máté-passió','Les Préludes','Román népi táncok','A Szeikilosz-sírfelirat énekszöveget és hangjelölést őrzött meg.'],
  ['Melyik korszak zeneszerzőjeként tartjuk számon Hildegard von Bingent?','Középkor','Barokk','Romantika','Bécsi klasszika','Hildegard középkori énekeket komponáló apátnő volt.'],
  ['Mi különbözteti meg a középkori organumot a gregorián egyszólamúságtól?','További szólamok kapcsolódnak a dallamhoz','Mindig zongora kíséri','Nem tartalmaz dallamot','Csak modern elektronikus hangzásban létezik','Az organum a többszólamúság korai formái közé tartozik.'],
  ['Melyik művét hallgathatjuk Palestrina reneszánsz polifóniájának példájaként?','Sicut cervus','A négy évszak','Les Préludes','Egy kis éji zene','Palestrina Sicut cervus című motettája a reneszánsz vokális polifónia ismert példája.'],
  ['Mi az imitációs belépések lényege?','Rokon motívum jelenik meg másik szólamban','Minden énekes ugyanazt a hangot tartja','A darab csak egyetlen hangból áll','A motívum teljesen eltűnik','A reneszánsz imitációban a zenei gondolat különböző szólamokban követhető.'],
  ['Melyik szerző művei között találhatók a Brandenburgi versenyek?','Johann Sebastian Bach','Franz Schubert','Bartók Béla','Josquin des Prez','A Brandenburgi versenyek Bach hangszeres művei.'],
  ['Vivaldi Tavasz című hegedűversenyében mi a ritornelló szerepe?','Visszatérő zenekari anyagként tagol','Az összes szünetet megszünteti','A szöveg fordítását jelenti','Csak a csellót halljuk','A ritornelló visszatérései elkülönítik a szólóepizódokat.'],
  ['Melyik zeneszerző műve az Egy kis éji zene?','Wolfgang Amadeus Mozart','Liszt Ferenc','Pérotin','Claude Debussy','Az Egy kis éji zene Mozart K. 525 jelzésű műve.'],
  ['Mit figyelhetünk meg Beethoven 5. szimfóniájának elején?','Rövid motívum változatos továbbfejlesztését','Egy ókori hangszer rekonstrukcióját','Gregorián neumaírást','Egy reneszánsz madrigál szövegét','Az ismert rövid kezdőmotívum a tétel során sokféleképpen alakul át.'],
  ['Melyik szerző kapcsolódik a Les Préludes című szimfonikus költeményhez?','Liszt Ferenc','Johann Sebastian Bach','Hildegard von Bingen','Antonio Vivaldi','A Les Préludes Liszt Ferenc szimfonikus költeménye.'],
  ['Mit jelent a tematikus átalakítás?','Egy felismerhető téma új karakterben tér vissza','Minden szólam azonos hangon marad','A dallamot végleg elhagyjuk','Csak a hangjegyek színét cseréljük','A téma karaktere, ritmusa vagy hangszerelése megváltozhat, de az azonosság felismerhető.'],
  ['Ki komponálta a Román népi táncokat?','Bartók Béla','Joseph Haydn','Giovanni Pierluigi da Palestrina','Claudio Monteverdi','Bartók műve népzenei dallamok zeneszerzői feldolgozása.'],
  ['Mit érdemes megkülönböztetni Bartók munkásságában?','Népzenei gyűjtés és zeneszerzői feldolgozás','Gregorián szöveg és klasszikus versenymű','Római színmű és ókori geometria','Kizárólag hangszerjáték és szolmizáció','A népzenei gyűjtés dokumentál, a kompozíció pedig alkotói módon használhat fel zenei anyagot.']
];
export const PORTRAIT_QUIZZES: QuizQuestion[] = questions.map(([question,correct,a,b,c,explanation],index)=>{
  const answers=[correct,a,b,c];
  const shift=(index+1)%4;
  const rotated=answers.map((_,i)=>answers[(i+4-shift)%4]);
  return {
    id:'histportrait-q'+String(index+1).padStart(2,'0'),
    chapterId:'zenetortenet',question,options:rotated,correctIndex:shift,explanation
  };
});
