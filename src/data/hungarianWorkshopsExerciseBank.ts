import type { Flashcard, MatchingPair, QuizQuestion } from '../types';

/** Magyar nyelvű tananyagra épülő, eredeti gyakorlókérdések a 6. és 8. fejezethez. */
const data:[string,string,string,string,string,string,string,string][]=[
 ['kreativ','Mi a mérőjárásban a fejlesztés elsődleges célja?','Az egyenletes belső lüktetés megtartása','Minden énekelt szótagra külön lépés','A lehető leggyorsabb járás','A dallam minden hangjának név szerinti felismerése','A mérő az alaplüktetés, nem azonos a teljes énekelt ritmussal.','Mérőérzék'],
 ['kreativ','Mikor érdemes a labdát bevonni a szinkópajátékba?','A képlet hallási és tapsos felismerése után','Már az első, ismeretlen dal meghallgatása előtt','Csak akkor, ha az éneklés megszűnt','A lehető leggyorsabb tempónál','A motoros feladat az előkészített hallási ismeretet erősítheti.','Ritmusképlet'],
 ['kreativ','Melyik feladat segít a fokozatos többszólamúságban?','Biztos dal mellé egyszerű osztinátó társítása','Két nehéz, ismeretlen dallam azonnali összeéneklése','Csak a szólamok külön lejegyzése','Folyamatos maximális hangerő','Az önálló szólamtartáshoz fokozatos nehezítés szükséges.','Osztinátó'],
 ['kreativ','Mit figyeltessünk meg kezdő zenehallgatókkal?','Egy könnyen felismerhető visszatérő zenei jelenséget','Egyszerre tíz eltérő formai fogalmat','Csak a zeneszerző személyes adatait','A mű minden hangját betűnévvel','A célzott megfigyelési szempont világossá és ellenőrizhetővé teszi a feladatot.','Irányított zenehallgatás'],
 ['pedagogia','Mi alapján válasszunk daltanítási módszert?','A dal nehézsége és a tanulók előzetes tudása alapján','Mindig csak a tanár kedvenc módszerével','Minden dalnál kizárólag kottából','Csak a dal szövegének hossza alapján','A hallás utáni és jelrendszerről történő daltanítás indokoltságát a zenei anyag határozza meg.','Daltanítás'],
 ['pedagogia','Mikor hasznos a ritmushunyó?','Amikor a hangzó és leírt ritmusképlet már ismert','Ha még senki nem hallotta a ritmust','Kizárólag egyéni zongoravizsgán','Csak ismeretlen, hosszú ritmusokkal','A kitakart rész pótlása belső hallást és ritmikai emlékezetet kíván.','Ritmushunyó'],
 ['pedagogia','Melyik a fejlesztő zenehallgatási értékelés?','A konkrét hallott eseményhez kötött megfigyelés','A zeneszerző évszámainak kizárólagos felidézése','Csak általános hangulatjelzők gyűjtése','Az összes hibátlan fogalom bemagoltatása','A zenei észlelésre vonatkozó, igazolható megfigyelés segíti a fejlődést.','Zenehallgatás'],
 ['pedagogia','Mitől megfelelő az óravázlat?','Célt, tanulói tevékenységet és ellenőrzést kapcsol össze','Minél több feladat címét sorolja fel','Csak a felhasznált dalok hangnemét sorolja','Mellőzi a differenciálást','Az óraterv a tanulás folyamatát és a módszertani döntések indokát tartalmazza.','Óravázlat']
];
export const HUNGARIAN_FLASHCARDS:Flashcard[]=data.map(([,,correct,,,,,term],i)=>({
 id:'hu-workshop-f'+(i+1),term,definition:correct,category:i<4?'Kreatív zenei nevelés':'Ének-zene tantárgy-pedagógia'
}));
export const HUNGARIAN_MATCHING:MatchingPair[]=data.map(([,,correct,,,,,term],i)=>({
 id:'hu-workshop-m'+(i+1),term,match:correct,category:i<4?'Kreatív zenei nevelés':'Ének-zene tantárgy-pedagógia'
}));
export const HUNGARIAN_QUIZZES:QuizQuestion[]=data.map(([chapterId,question,correct,a,b,c,explanation],i)=>{
 const options=[correct,a,b,c],offset=i%4;
 return {id:'hu-workshop-q'+(i+1),chapterId,question,
  options:options.map((_,j)=>options[(j+4-offset)%4]),correctIndex:offset,explanation};
});
