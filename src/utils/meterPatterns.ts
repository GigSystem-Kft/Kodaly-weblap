/**
 * Kétütemes, hangsúlyozott ütemmutató-minták.
 * Tempo: a negyed 60/perc, a 6/8-ban a nyolcad ennek a fele,
 * így a 6/8 két darab három-nyolcados lüktetéscsoportra tagolódik.
 */
export type MeterId = '2/4'|'3/4'|'4/4'|'6/8';
export type Accent = 'fo'|'mellek'|'sulytalan';
export interface MeterPulse {
 index:number;
 bar:number;
 withinBar:number;
 startSeconds:number;
 durationSeconds:number;
 accent:Accent;
}
export interface MeterPattern {
 id:MeterId;
 bpm:number;
 pulsesPerBar:number;
 barDurationSeconds:number;
 totalDurationSeconds:number;
 pulses:MeterPulse[];
}
export const METER_OPTIONS:readonly MeterId[]=['2/4','3/4','4/4','6/8'];
export function meterPattern(id:MeterId,bpm=60):MeterPattern {
 if(!METER_OPTIONS.includes(id))throw new Error('Ismeretlen ütemmutató');
 if(!Number.isFinite(bpm)||bpm<=0||bpm>240)throw new Error('Érvénytelen tempó');
 const [numerator,denominator]=id.split('/').map(Number);
 const pulseSeconds=60/bpm*4/denominator;
 const pulses:MeterPulse[]=[];
 for(let bar=0;bar<2;bar++) {
  for(let withinBar=0;withinBar<numerator;withinBar++) {
   const accent:Accent=withinBar===0?'fo':
    (id==='4/4'&&withinBar===2)||(id==='6/8'&&withinBar===3)?'mellek':'sulytalan';
   const index=bar*numerator+withinBar;
   pulses.push({index,bar,withinBar,startSeconds:index*pulseSeconds,
     durationSeconds:pulseSeconds,accent});
  }
 }
 return {id,bpm,pulsesPerBar:numerator,barDurationSeconds:numerator*pulseSeconds,
   totalDurationSeconds:2*numerator*pulseSeconds,pulses};
}
