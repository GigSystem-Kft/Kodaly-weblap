/**
 * Az 5. fejezet hangzó példái a magyar ABC-s hangnévhasználattal.
 * A hangszintézis azonosítói a Web Audio motor számára kellenek,
 * a felületen viszont B = nemzetközi B♭, H = nemzetközi B.
 */
export interface NamedSound {name:string;notes:readonly string[];labels:readonly string[];description:string}
export const MAJOR_SCALES:readonly NamedSound[]=[
 {name:'C-dúr',notes:['C4','D4','E4','F4','G4','A4','H4','C5'],labels:['C′','D′','E′','F′','G′','A′','H′','C″'],description:'Nincs előjegyzése.'},
 {name:'G-dúr',notes:['G4','A4','H4','C5','D5','E5','F#5','G5'],labels:['G′','A′','H′','C″','D″','E″','Fisz″','G″'],description:'Egy kereszt: Fisz.'},
 {name:'D-dúr',notes:['D4','E4','F#4','G4','A4','H4','C#5','D5'],labels:['D′','E′','Fisz′','G′','A′','H′','Cisz″','D″'],description:'Két kereszt: Fisz és Cisz.'},
 {name:'F-dúr',notes:['F4','G4','A4','A#4','C5','D5','E5','F5'],labels:['F′','G′','A′','B′','C″','D″','E″','F″'],description:'Egy bé: B (leszállított H).'},
 {name:'B-dúr',notes:['A#3','C4','D4','D#4','F4','G4','A4','A#4'],labels:['B','C′','D′','Esz′','F′','G′','A′','B′'],description:'Két bé: B és Esz.'}
];
export const MINOR_SCALES:readonly NamedSound[]=[
 {name:'Természetes a-moll',notes:['A3','H3','C4','D4','E4','F4','G4','A4'],labels:['A','H','C′','D′','E′','F′','G′','A′'],description:'A természetes moll módosítatlan: A–H–C–D–E–F–G–A.'},
 {name:'Harmonikus a-moll',notes:['A3','H3','C4','D4','E4','F4','G#4','A4'],labels:['A','H','C′','D′','E′','F′','Gisz′','A′'],description:'A hetedik fok Giszre emelkedik; F–Gisz bővített szekund.'},
 {name:'Melodikus a-moll',notes:['A3','H3','C4','D4','E4','F#4','G#4','A4','G4','F4','E4','D4','C4','H3','A3'],labels:['A','H','C′','D′','E′','Fisz′','Gisz′','A′','G′','F′','E′','D′','C′','H','A'],description:'Felfelé a 6. és 7. fok emelt, lefelé a természetes moll hangjai szólnak.'}
];
export const TRIADS:readonly NamedSound[]=[
 {name:'C-dúr hármashangzat',notes:['C4','E4','G4'],labels:['C′','E′','G′'],description:'Nagy terc + kis terc. Alapállás.'},
 {name:'c-moll hármashangzat',notes:['C4','D#4','G4'],labels:['C′','Esz′','G′'],description:'Kis terc + nagy terc. Alapállás.'},
 {name:'C-szűkített hármashangzat',notes:['C4','D#4','F#4'],labels:['C′','Esz′','Gesz′'],description:'Kis terc + kis terc.'},
 {name:'C-bővített hármashangzat',notes:['C4','E4','G#4'],labels:['C′','E′','Gisz′'],description:'Nagy terc + nagy terc.'}
];
export const C_MAJOR_INVERSIONS:readonly NamedSound[]=[
 {name:'Alapállás',notes:['C4','E4','G4'],labels:['C′','E′','G′'],description:'C–E–G. Az alaphang a basszusban.'},
 {name:'Szextakkord',notes:['E4','G4','C5'],labels:['E′','G′','C″'],description:'E–G–C. A terc a basszusban.'},
 {name:'Kvartszextakkord',notes:['G4','C5','E5'],labels:['G′','C″','E″'],description:'G–C–E. A kvint a basszusban.'}
];
export const FIFTHS_CIRCLE=[
 {major:'C',minor:'a',accidentals:0},{major:'G',minor:'e',accidentals:1},
 {major:'D',minor:'h',accidentals:2},{major:'A',minor:'fisz',accidentals:3},
 {major:'E',minor:'cisz',accidentals:4},{major:'H',minor:'gisz',accidentals:5},
 {major:'Fisz / Gesz',minor:'disz / esz',accidentals:6},
 {major:'Desz',minor:'b',accidentals:-5},{major:'Asz',minor:'f',accidentals:-4},
 {major:'Esz',minor:'c',accidentals:-3},{major:'B',minor:'g',accidentals:-2},
 {major:'F',minor:'d',accidentals:-1}
] as const;
