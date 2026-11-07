import type {Flashcard,MatchingPair,QuizQuestion} from '../types';
import MUSIC_EXPRESSIONS from './musicExpressions.json';

const categories=[
 'Díszítések és ornamentika','Előadásmód és artikuláció',
 'Tempó és időkezelés','Dinamika és karakter','Ritmus és hangértékek',
 'Hangsorok és harmóniák','Hangszer és játéktechnika','Éneklés és kórus',
 'Zenei műfajok és formák','Kottaírás és jelölések','Zenetörténet és stílus',
 'Egyéb szakkifejezések'
];
const preferred=new Set([
 'a cappella','a tempo','accelerando','adagio','ad libitum','agitato','allegro','allegretto','allargando',
 'andante','andantino','animato','appassionato','arpeggio','ars nova','artikuláció','attacca',
 'augmentáció','bel canto','bővített hármas','brevis','cadenza','cantata','con brio',
 'concerto grosso','coda','col legno','corona','crescendo','csárdás','da capo','dal segno',
 'decrescendo','dolce','espressivo','fermata','forte','fortissimo','fúga','glissando','grave',
 'legato','largo','lento','maestoso','marcato','moderato','molto','pianissimo','piano',
 'pizzicato','presto','prestissimo','rubato','scherzo','sempre','senza','smorzando',
 'sostenuto','sotto voce','stringendo','subito','tenuto','unisono','vivace','voce','hármashangzat'
]);
type Expression=typeof MUSIC_EXPRESSIONS[number];
const clean=(item:Expression)=>!item.term.includes(',') && !item.term.includes('…') &&
 item.term.length<=42 && item.definition.length>=9&&item.definition.length<=120 &&
 !/^\d+\./.test(item.definition)&&!/\b(mHz|nemzetközileg megállapított|őse)\b/i.test(item.definition);
const unique=(list:Expression[])=>{
 const seen=new Set<string>();return list.filter(item=>{
  const key=item.definition.toLocaleLowerCase('hu-HU').trim();
  if(seen.has(key))return false;
  seen.add(key);return true;
 });
};
const chosen=unique([
 ...MUSIC_EXPRESSIONS.filter(item=>preferred.has(item.term.toLocaleLowerCase('hu-HU'))&&clean(item)),
 ...categories.flatMap(category=>MUSIC_EXPRESSIONS.filter(item=>item.category===category&&clean(item)).slice(0,20))
]);
const quizTerms=chosen.slice(0,160);
const maxCards=chosen.slice(0,220);
const labels=(s:string)=>s.replace(/\s+/g,' ').trim();
const cardCategory=(category:string)=>'Zenei kifejezések – '+category;
export const EXPRESSION_FLASHCARDS:Flashcard[]=maxCards.map(item=>({
 id:'expr-fl-'+item.id,term:item.term,definition:labels(item.definition),
 category:cardCategory(item.category),hint:'Forrás: Zenei kifejezések, '+item.letter+' betű'
}));
export const EXPRESSION_MATCHING:MatchingPair[]=chosen.slice(0,150).map(item=>({
 id:'expr-m-'+item.id,term:item.term,match:labels(item.definition),
 category:cardCategory(item.category)
}));
export const EXPRESSION_QUIZZES:QuizQuestion[]=quizTerms.map((item,i)=>{
 const alternatives=chosen.filter(x=>x.id!==item.id &&
  x.definition.toLocaleLowerCase('hu-HU')!==item.definition.toLocaleLowerCase('hu-HU') &&
  x.category===item.category && x.definition.length<125).slice(0,3);
 const pool=alternatives.length===3?alternatives:chosen.filter(x=>x.id!==item.id&&
  x.definition!==item.definition).slice(i%12,i%12+3);
 const answerIndex=i%4;
 const options=pool.map(item=>labels(item.definition));options.splice(answerIndex,0,labels(item.definition));
 return {
  id:'expr-q-'+item.id,chapterId:'zenei-kifejezesek',
  question:'Mit jelent a kottában vagy a zenében: „'+item.term+'”?',
  options,correctIndex:answerIndex,
  explanation:'A mellékelt szótár szerint: '+item.term+' – '+item.definition+'. Forrás: Zenei kifejezések, '+item.letter+' betű.'
 };
});

interface Drill {id:string;term:string;meaning:string;category:string;why:string;}
export const THEORY_DRILLS:Drill[]=[
 {id:'met-24',term:'2/4',meaning:'Két negyednyi ütem, egy súlyos és egy súlytalan negyed',category:'Ütemfajták',why:'A kettes metrum hangsúlyrendje: súlyos–súlytalan.'},
 {id:'met-34',term:'3/4',meaning:'Három negyednyi ütem; első negyed súlyos, két további súlytalan',category:'Ütemfajták',why:'Hármas lüktetés.'},
 {id:'met-44',term:'4/4',meaning:'Négy negyed, főhangsúly az elsőn és mellékhangsúly a harmadikon',category:'Ütemfajták',why:'Négyes metrum.'},
 {id:'met-68',term:'6/8',meaning:'Hat nyolcad, általában két háromnyolcados lüktetési csoport',category:'Ütemfajták',why:'Összetett kettes metrum; az 1. és a 4. nyolcad csoportkezdő.'},
 {id:'val-whole',term:'Egész hangérték',meaning:'Négy negyedértéknyi időtartam',category:'Hangértékek',why:'60 BPM mellett négy másodperc.'},
 {id:'val-half',term:'Fél hangérték',meaning:'Két negyedértéknyi időtartam',category:'Hangértékek',why:'60 BPM mellett két másodperc.'},
 {id:'val-quarter',term:'Negyed hangérték',meaning:'Egy negyedértéknyi időtartam',category:'Hangértékek',why:'60 BPM mellett egy másodperc.'},
 {id:'val-eight',term:'Nyolcad hangérték',meaning:'Fél negyedértéknyi időtartam',category:'Hangértékek',why:'60 BPM mellett fél másodperc.'},
 {id:'val-sixteen',term:'Tizenhatod hangérték',meaning:'Negyed negyedértéknyi időtartam',category:'Hangértékek',why:'60 BPM mellett negyed másodperc.'},
 {id:'rhythm-sync',term:'Szinkópa',meaning:'Nyolcad–negyed–nyolcad a kétnegyedes alapmintában',category:'Ritmusképletek',why:'A hangsúly a középső negyedre kerül.'},
 {id:'rhythm-pointed',term:'Nyújtott ritmus',meaning:'Pontozott negyed és nyolcad két negyed időtartamban',category:'Ritmusképletek',why:'Hosszú–rövid arány: 3:1.'},
 {id:'rhythm-reverse',term:'Éles ritmus',meaning:'Nyolcad és pontozott negyed két negyed időtartamban',category:'Ritmusképletek',why:'Rövid–hosszú arány: 1:3.'},
 {id:'rhythm-trip',term:'Nyolcadtriola',meaning:'Három egyenlő részre osztott negyedérték',category:'Ritmusképletek',why:'Három triolanyolcad egy negyed alatt.'},
 {id:'scale-major',term:'Dúr hangsor',meaning:'Egész–egész–fél–egész–egész–egész–fél lépéssor',category:'Hangsorok',why:'C-dúr: C–D–E–F–G–A–H–C.'},
 {id:'scale-minor',term:'Természetes moll',meaning:'Egész–fél–egész–egész–fél–egész–egész lépéssor',category:'Hangsorok',why:'a-moll: A–H–C–D–E–F–G–A.'},
 {id:'scale-harm',term:'Harmonikus moll',meaning:'A természetes moll VII. fokát felemeljük',category:'Hangsorok',why:'a-moll: A–H–C–D–E–F–Gisz–A.'},
 {id:'scale-melod',term:'Melodikus moll (klasszikus)',meaning:'Felfelé emelt VI. és VII. fok; lefelé rendszerint természetes moll',category:'Hangsorok',why:'a-moll fölfelé: A–H–C–D–E–Fisz–Gisz–A.'},
 {id:'scale-pent',term:'Félhang nélküli pentaton',meaning:'Öthangú hangsor félhanglépés nélkül',category:'Hangsorok',why:'C–D–E–G–A.'},
 {id:'scale-hexa',term:'Hexachord',meaning:'Hat egymás melletti diatonikus hang',category:'Hangsorok',why:'C–D–E–F–G–A; középkori ut–re–mi–fa–sol–la.'},
 {id:'col-bit',term:'Biton hangkészlet',meaning:'Két különböző, nem szomszédos hang',category:'Hangkészletek',why:'Például szó–mi.'},
 {id:'col-trit',term:'Triton hangkészlet',meaning:'Három nem szomszédos, elkülönülő hang',category:'Hangkészletek',why:'Például lá–szó–mi. Nem tévesztendő össze a tritónusz hangközzel!'},
 {id:'col-tetr',term:'Tetraton hangkészlet',meaning:'Négy nem szomszédos hangból álló készlet',category:'Hangkészletek',why:'Például szó–mi–ré–dó.'},
 {id:'col-penta',term:'Pentaton hangkészlet',meaning:'Öt különböző hangból épülő hangkészlet',category:'Hangkészletek',why:'A magyar népzenében gyakori az anhemiton pentatónia.'},
 {id:'col-bi',term:'Bichord',meaning:'Két szomszédos diatonikus hangból álló hangkészlet',category:'Hangkészletek',why:'Például szó–lá.'},
 {id:'col-tri',term:'Trichord',meaning:'Három szomszédos diatonikus hangból álló hangkészlet',category:'Hangkészletek',why:'Például dó–ré–mi.'},
 {id:'col-pentach',term:'Pentachord',meaning:'Öt szomszédos diatonikus hang',category:'Hangkészletek',why:'Például C–D–E–F–G.'},
 {id:'key-c',term:'C-dúr',meaning:'Nincs előjegyzése',category:'Előjegyzések',why:'C–D–E–F–G–A–H–C.'},
 {id:'key-g',term:'G-dúr',meaning:'Egy kereszt: Fisz',category:'Előjegyzések',why:'G–A–H–C–D–E–Fisz–G.'},
 {id:'key-d',term:'D-dúr',meaning:'Két kereszt: Fisz és Cisz',category:'Előjegyzések',why:'D–E–Fisz–G–A–H–Cisz–D.'},
 {id:'key-f',term:'F-dúr',meaning:'Egy bé: B',category:'Előjegyzések',why:'F–G–A–B–C–D–E–F.'},
 {id:'key-bb',term:'B-dúr',meaning:'Két bé: B és Esz',category:'Előjegyzések',why:'B–C–D–Esz–F–G–A–B.'},
 {id:'triad-major',term:'Dúr hármashangzat',meaning:'Nagy terc és ráépített kis terc',category:'Akkordok',why:'C–E–G.'},
 {id:'triad-minor',term:'Moll hármashangzat',meaning:'Kis terc és ráépített nagy terc',category:'Akkordok',why:'A–C–E.'},
 {id:'triad-dim',term:'Szűkített hármashangzat',meaning:'Két egymásra épített kis terc',category:'Akkordok',why:'H–D–F.'},
 {id:'triad-aug',term:'Bővített hármashangzat',meaning:'Két egymásra épített nagy terc',category:'Akkordok',why:'C–E–Gisz.'}
];
export const THEORY_FLASHCARDS:Flashcard[]=THEORY_DRILLS.map(item=>({id:'drill-f-'+item.id,term:item.term,definition:item.meaning,category:'Elméleti gyakorlás – '+item.category,hint:item.why}));
export const THEORY_MATCHING:MatchingPair[]=THEORY_DRILLS.map(item=>({id:'drill-m-'+item.id,term:item.term,match:item.meaning,category:'Elméleti gyakorlás – '+item.category}));
export const THEORY_QUIZZES:QuizQuestion[]=THEORY_DRILLS.map((item,i)=>{
 const candidates=THEORY_DRILLS.filter(x=>x.category===item.category && x.id!==item.id).slice(0,3);
 const alternatives=candidates.length===3?candidates:THEORY_DRILLS.filter(x=>x.id!==item.id&&x.meaning!==item.meaning).slice(i%5,i%5+3);
 const at=i%4;
 const options=alternatives.map(x=>x.meaning);options.splice(at,0,item.meaning);
 return {id:'drill-q-'+item.id,chapterId:item.category==='Hangértékek'||item.category==='Ritmusképletek'||item.category==='Ütemfajták'?'ritmus':'zenei-kifejezesek',
 question:'Válaszd ki a helyes magyarázatot: '+item.term,
 options,correctIndex:at,explanation:'Magyarázat: '+item.why};
});
