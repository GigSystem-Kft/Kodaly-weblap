/** Önálló, ismétlés nélküli ritmusképletek: kettő vagy egy negyed hosszúságban. */
export type RhythmFigureId = 'nyujtott' | 'eles' | 'szinkopa' | 'triola';
export type RhythmEvent = { startBeats: number; durationBeats: number; label: string };
export type RhythmFigure = { id: RhythmFigureId; title: string; mnemonic: string; explanation: string; base: readonly RhythmEvent[]; lengthBeats: number };

export const RHYTHM_FIGURES: readonly RhythmFigure[] = [
  { id:'nyujtott', title:'Nyújtott ritmus', mnemonic:'TÁM–TI', explanation:'Pontozott negyed (1½ ütés) + nyolcad (½ ütés). Két negyednyi ritmusképlet, egyszer megszólaltatva.',
    lengthBeats:2, base:[{startBeats:0,durationBeats:1.5,label:'TÁM'},{startBeats:1.5,durationBeats:0.5,label:'TI'}] },
  { id:'eles', title:'Éles ritmus', mnemonic:'TI–TÁM', explanation:'Nyolcad (½ ütés) + pontozott negyed (1½ ütés). Két negyednyi ritmusképlet, egyszer megszólaltatva.',
    lengthBeats:2, base:[{startBeats:0,durationBeats:0.5,label:'TI'},{startBeats:0.5,durationBeats:1.5,label:'TÁM'}] },
  { id:'szinkopa', title:'Szinkópa', mnemonic:'TI–TÁ–TI', explanation:'Nyolcad (½ ütés) + negyed (1 ütés) + nyolcad (½ ütés). A középső hang átnyúlik a mérőütésen.',
    lengthBeats:2, base:[{startBeats:0,durationBeats:0.5,label:'TI'},{startBeats:0.5,durationBeats:1,label:'TÁ'},{startBeats:1.5,durationBeats:0.5,label:'TI'}] },
  { id:'triola', title:'Triola', mnemonic:'TRI–O–LA', explanation:'Három teljesen egyenlő hang egyetlen negyed mérőütés alatt, egyszer megszólaltatva.',
    lengthBeats:1, base:[{startBeats:0,durationBeats:1/3,label:'TRI'},{startBeats:1/3,durationBeats:1/3,label:'O'},{startBeats:2/3,durationBeats:1/3,label:'LA'}] }
];

export function rhythmFigurePattern(id: RhythmFigureId, bpm=60) {
  if(!Number.isFinite(bpm) || bpm<=0 || bpm>240) throw new Error('Érvénytelen tempó.');
  const figure=RHYTHM_FIGURES.find(f=>f.id===id);
  if(!figure)throw new Error('Ismeretlen ritmusképlet.');
  const beatSeconds=60/bpm;
  const events: RhythmEvent[]=figure.base.map(event=>({...event}));
  return {figure,events,beatSeconds,totalSeconds:figure.lengthBeats*beatSeconds,
    beats:Array.from({length:figure.lengthBeats},(_,index)=>({index,startSeconds:index*beatSeconds,accent:index===0}))};
}
