/** Kétnegyedes alapritmusképletek és a 4/4-es gyakorlóütemek. */
export type RhythmFigureId = 'nyujtott' | 'eles' | 'szinkopa' | 'triola';
export type RhythmEvent = { startBeats: number; durationBeats: number; label: string };
export type RhythmFigure = { id: RhythmFigureId; title: string; mnemonic: string; explanation: string; base: readonly RhythmEvent[]; repeatBeats: number };

export const RHYTHM_FIGURES: readonly RhythmFigure[] = [
  { id:'nyujtott', title:'Nyújtott ritmus', mnemonic:'TÁM–TI', explanation:'Pontozott negyed (1½ ütés) + nyolcad (½ ütés). Két negyednyi képlet, az ütemben kétszer megszólaltatva.',
    repeatBeats:2, base:[{startBeats:0,durationBeats:1.5,label:'TÁM'},{startBeats:1.5,durationBeats:0.5,label:'TI'}] },
  { id:'eles', title:'Éles ritmus', mnemonic:'TI–TÁM', explanation:'Nyolcad (½ ütés) + pontozott negyed (1½ ütés). Két negyednyi képlet, az ütemben kétszer megszólaltatva.',
    repeatBeats:2, base:[{startBeats:0,durationBeats:0.5,label:'TI'},{startBeats:0.5,durationBeats:1.5,label:'TÁM'}] },
  { id:'szinkopa', title:'Szinkópa', mnemonic:'TI–TÁ–TI', explanation:'Nyolcad (½ ütés) + negyed (1 ütés) + nyolcad (½ ütés). A középső hang átnyúlik a mérőütésen.',
    repeatBeats:2, base:[{startBeats:0,durationBeats:0.5,label:'TI'},{startBeats:0.5,durationBeats:1,label:'TÁ'},{startBeats:1.5,durationBeats:0.5,label:'TI'}] },
  { id:'triola', title:'Triola', mnemonic:'TRI–O–LA', explanation:'Három teljesen egyenlő hang egyetlen negyed mérőütés alatt, minden negyeden megismételve.',
    repeatBeats:1, base:[{startBeats:0,durationBeats:1/3,label:'TRI'},{startBeats:1/3,durationBeats:1/3,label:'O'},{startBeats:2/3,durationBeats:1/3,label:'LA'}] }
];

export function rhythmFigurePattern(id: RhythmFigureId, bpm=60) {
  if(!Number.isFinite(bpm) || bpm<=0 || bpm>240) throw new Error('Érvénytelen tempó.');
  const figure=RHYTHM_FIGURES.find(f=>f.id===id);
  if(!figure)throw new Error('Ismeretlen ritmusképlet.');
  const beatSeconds=60/bpm;
  const events: RhythmEvent[]=[];
  for(let offset=0;offset<4;offset+=figure.repeatBeats) {
    for(const event of figure.base)events.push({...event,startBeats:offset+event.startBeats});
  }
  return {figure,events,beatSeconds,totalSeconds:4*beatSeconds,
    beats:[0,1,2,3].map(index=>({index,startSeconds:index*beatSeconds,accent:index===0}))};
}
