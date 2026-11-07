/** Hangnevek magyar oktávjelöléssel a felület számára; a szintetizátor belső hangazonosítóit nem módosítja. */
export const C_MAJOR_SCALE_NOTES = ['C4','D4','E4','F4','G4','A4','H4','C5'] as const;
export function hungarianOctaveName(note: string): string {
  const match=/^([A-GH])(#?)([2-6])$/.exec(note);
  if(!match)return note;
  const [,letter,sharp,octave]=match;
  const decoration=octave==='4'?'′':octave==='5'?'″':octave==='3'?'':octave==='2'?',':'‴';
  return letter+(sharp?'isz':'')+decoration;
}
export function quarterScaleSchedule(notes: readonly string[]=C_MAJOR_SCALE_NOTES, bpm=60) {
  if(!Number.isFinite(bpm)||bpm<=0||bpm>240)throw new Error('Érvénytelen tempó.');
  const quarterSeconds=60/bpm;
  return {quarterSeconds,totalSeconds:notes.length*quarterSeconds,
    notes:notes.map((note,index)=>({note,label:hungarianOctaveName(note),startSeconds:index*quarterSeconds,durationSeconds:quarterSeconds}))};
}
