/**
 * Kromatikus hangsor a magyar hangnévrendszer szerint.
 * A lejátszó belső azonosítói angol jellegűek, a felületen kizárólag
 * magyar hangneveket és az egy-/kétvonalas oktávjelölést mutatjuk.
 */
export interface ChromaticStep {
  id: string;
  note: string;
  label: string;
  isAltered: boolean;
}
export const CHROMATIC_STEPS: readonly ChromaticStep[] = [
  {id:'c1',   note:'C4',  label:'C′',              isAltered:false},
  {id:'cis',  note:'C#4', label:'Cisz′ / Desz′',   isAltered:true},
  {id:'d1',   note:'D4',  label:'D′',              isAltered:false},
  {id:'dis',  note:'D#4', label:'Disz′ / Esz′',    isAltered:true},
  {id:'e1',   note:'E4',  label:'E′',              isAltered:false},
  {id:'f1',   note:'F4',  label:'F′',              isAltered:false},
  {id:'fis',  note:'F#4', label:'Fisz′ / Gesz′',   isAltered:true},
  {id:'g1',   note:'G4',  label:'G′',              isAltered:false},
  {id:'gis',  note:'G#4', label:'Gisz′ / Asz′',    isAltered:true},
  {id:'a1',   note:'A4',  label:'A′',              isAltered:false},
  {id:'ais',  note:'A#4', label:'Aisz′ / B′',      isAltered:true},
  {id:'h1',   note:'H4',  label:'H′',              isAltered:false},
  {id:'c2',   note:'C5',  label:'C″',              isAltered:false}
] as const;

export function chromaticTimeline(bpm=60) {
  if(!Number.isFinite(bpm)||bpm<=0||bpm>240) throw new Error('Érvénytelen tempó');
  const stepSeconds=60/bpm;
  return {stepSeconds,totalSeconds:CHROMATIC_STEPS.length*stepSeconds,
    steps:CHROMATIC_STEPS.map((step,index)=>({...step,index,startSeconds:index*stepSeconds,durationSeconds:stepSeconds}))};
}
