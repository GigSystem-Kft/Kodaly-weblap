/** Hangnevek magyar oktávjelöléssel a felület számára; a szintetizátor belső hangazonosítóit nem módosítja. */
export const C_MAJOR_SCALE_NOTES = ['C4','D4','E4','F4','G4','A4','H4','C5'] as const;
export function hungarianOctaveName(note: string): string {
  const match=/^([A-H])([#♯b♭]?)([0-8])$/.exec(note);
  if(!match)return note;
  const [,rawLetter,alteration,octave]=match;
  // Internal B = English B-natural = Hungarian H; B-flat (A#) = Hungarian B.
  const letter=rawLetter==='B'?'H':rawLetter;
  const flatNames:Record<string,string>={C:'Cesz',D:'Desz',E:'Esz',F:'Fesz',G:'Gesz',A:'Asz',H:'B'};
  const base=alteration==='#'||alteration==='♯'?letter+'isz'
    :alteration==='b'||alteration==='♭'?flatNames[letter]
    :letter;
  const decoration:Record<string,string>={
    '0':',,,','1':',,','2':',','3':'','4':'′','5':'″','6':'‴','7':'⁗','8':'⁗′'
  };
  return base+decoration[octave];
}
export function quarterScaleSchedule(notes: readonly string[]=C_MAJOR_SCALE_NOTES, bpm=60) {
  if(!Number.isFinite(bpm)||bpm<=0||bpm>240)throw new Error('Érvénytelen tempó.');
  const quarterSeconds=60/bpm;
  return {quarterSeconds,totalSeconds:notes.length*quarterSeconds,
    notes:notes.map((note,index)=>({note,label:hungarianOctaveName(note),startSeconds:index*quarterSeconds,durationSeconds:quarterSeconds}))};
}


/**
 * Convert octave-numbered pitch tokens in learner-facing prose, questions and
 * answer choices. Keep the underlying quiz keys, synth note IDs and JSON data
 * unchanged. Only standalone pitch names are replaced, not arbitrary numbers.
 *
 * Examples: "G4" → "G′", "F3" → "F", "F#4" → "Fisz′".
 */
export function formatHungarianPitchText(text:string):string {
  return text.replace(/(^|[^\p{L}\p{N}_])([A-H][#♯b♭]?[0-8])(?=$|[^\p{L}\p{N}_])/gu,
    (_match,prefix:string,pitch:string)=>prefix+hungarianOctaveName(pitch));
}
