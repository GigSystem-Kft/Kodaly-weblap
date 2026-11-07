/**
 * Saját, rövid gyakorlómotívumok a 4.1–4.3 leckékhez.
 * Nem a megnevezett gyermekdalok hangfelvételei vagy kottahű átiratai.
 * A 4.3-as dallamok mind az öt C-pentaton hangot tartalmazzák.
 */
export type CollectionLesson='ton-hangkeszlet'|'chord-hangkeszlet'|'pentaton-gyakorlat';
export interface CollectionExample {
  id:string;
  title:string;
  solfege:string;
  description:string;
  notes:readonly string[];
  pitchCount:number;
}
export const COLLECTION_EXAMPLES:Record<CollectionLesson,readonly CollectionExample[]>={
 'ton-hangkeszlet':[
  {id:'biton',title:'Biton – két hang',solfege:'szó–mi',
   description:'Két különböző, nem szomszédos fok: szó–mi. A „Csigabiga bácsi” csak dalutalás, a megszólaló motívum saját gyakorlat.',
   notes:['G4','E4','G4','E4'],pitchCount:2},
  {id:'triton',title:'Triton – három hang',solfege:'lá–szó–mi',
   description:'Három különböző hang: lá, szó és mi. „Borsót főztem” – kapcsolódó dalutalás, nem dallamidézet.',
   notes:['A4','G4','E4','G4','A4'],pitchCount:3},
  {id:'tetraton',title:'Tetraton – négy hang',solfege:'szó–mi–ré–dó',
   description:'Négyhangú hangkészlet, itt szó–mi–ré–dó. Nem minden szomszédos fok hiányzik: ré és dó szomszédos.',
   notes:['G4','E4','D4','C4','D4','G4'],pitchCount:4},
  {id:'pentaton',title:'Pentaton – öt hang',solfege:'dó–ré–mi–szó–lá',
   description:'A félhanglépés nélküli, ötfokú C-pentaton készlet hangjai. Jelentős szerepe van a magyar népzenében.',
   notes:['C4','D4','E4','G4','A4','G4','E4','D4','C4'],pitchCount:5}
 ],
 'chord-hangkeszlet':[
  {id:'bichord',title:'Bichord – két szomszédos hang',solfege:'szó–lá',
   description:'Két szomszédos fok nagy szekund távolságban.',
   notes:['G4','A4','G4','A4'],pitchCount:2},
  {id:'trichord',title:'Trichord – három szomszédos hang',solfege:'dó–ré–mi',
   description:'Három egymás utáni diatonikus hang. A „Túrót ettem” dalhoz kapcsolható, de ez nem annak pontos dallamidézete.',
   notes:['C4','D4','E4','D4','C4'],pitchCount:3},
  {id:'pentachord',title:'Pentachord – öt szomszédos hang',solfege:'dó–ré–mi–fá–szó',
   description:'Öt egymás melletti diatonikus hang; mi–fá között félhanglépéssel.',
   notes:['C4','D4','E4','F4','G4','F4','E4'],pitchCount:5},
  {id:'hexachord',title:'Hexachord – hat szomszédos hang',solfege:'dó–ré–mi–fá–szó–lá',
   description:'Hat egymás melletti diatonikus hang, a Guido-féle ut–re–mi–fa–sol–la rokona.',
   notes:['C4','D4','E4','F4','G4','A4','G4','E4','C4'],pitchCount:6}
 ],
 'pentaton-gyakorlat':[
  {id:'penta-felfele',title:'Emelkedő pentaton',solfege:'dó–ré–mi–szó–lá',
   description:'A félhang nélküli C-pentaton öt hangja emelkedő sorrendben.',
   notes:['C4','D4','E4','G4','A4'],pitchCount:5},
  {id:'penta-lefele',title:'Ereszkedő pentaton',solfege:'lá–szó–mi–ré–dó',
   description:'Az ötfokú hangkészlet ereszkedő bejárása.',
   notes:['A4','G4','E4','D4','C4'],pitchCount:5},
  {id:'penta-ugras',title:'Ugrásos pentaton dallam',solfege:'dó–mi–szó–lá–ré–dó',
   description:'Ugrásokkal és visszatéréssel, mind az öt pentaton hang használatával.',
   notes:['C4','E4','G4','A4','D4','C4'],pitchCount:5},
  {id:'penta-hullam',title:'Hullámzó pentaton dallam',solfege:'szó–lá–szó–mi–ré–dó–mi',
   description:'Hullámzó dallam, csak dó, ré, mi, szó és lá hangokkal.',
   notes:['G4','A4','G4','E4','D4','C4','E4'],pitchCount:5},
  {id:'penta-felelet',title:'Pentaton kérdés és felelet',solfege:'dó–ré–szó–mi–lá–szó–ré–dó',
   description:'Saját rövid pentaton kérdés–felelet motívum.',
   notes:['C4','D4','G4','E4','A4','G4','D4','C4'],pitchCount:5}
 ]
};
export const collectionPitchCount=(notes:readonly string[])=>new Set(notes).size;
