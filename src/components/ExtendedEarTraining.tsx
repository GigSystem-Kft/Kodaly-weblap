import React,{useEffect,useRef,useState} from 'react';
import {Play, RotateCcw, Volume2} from 'lucide-react';

type Mode='hangsor'|'ritmus'|'hangérték'|'ütemmutató';
type Challenge={id:string;title:string;explanation:string;pitches?:number[];lengths?:number[];meter?:number[];accent?:number[]};
type Segment={pitch:number;time:number;duration:number;accent:number};
const list:Record<Mode,Challenge[]>={
 hangsor:[
  {id:'c-major',title:'C-dúr',pitches:[60,62,64,65,67,69,71,72],explanation:'C–D–E–F–G–A–H–C: 2–2–1–2–2–2–1 félhang.'},
  {id:'g-major',title:'G-dúr',pitches:[67,69,71,72,74,76,78,79],explanation:'G–A–H–C–D–E–Fisz–G: egy kereszt.'},
  {id:'f-major',title:'F-dúr',pitches:[65,67,69,70,72,74,76,77],explanation:'F–G–A–B–C–D–E–F: egy bé.'},
  {id:'a-minor',title:'Természetes a-moll',pitches:[69,71,72,74,76,77,79,81],explanation:'A–H–C–D–E–F–G–A.'},
  {id:'a-harm',title:'Harmonikus a-moll',pitches:[69,71,72,74,76,77,80,81],explanation:'A–H–C–D–E–F–Gisz–A: emelt VII. fok.'},
  {id:'a-melod',title:'Melodikus a-moll (felfelé)',pitches:[69,71,72,74,76,78,80,81],explanation:'A–H–C–D–E–Fisz–Gisz–A: felfelé emelt VI. és VII. fok.'},
  {id:'pent',title:'Félhang nélküli pentaton',pitches:[60,62,64,67,69,72],explanation:'C–D–E–G–A–C, nincs félhang.'},
  {id:'hex',title:'Hexachord',pitches:[60,62,64,65,67,69],explanation:'Hat egymás melletti diatonikus hang: C–D–E–F–G–A.'},
  {id:'pentach',title:'Pentachord',pitches:[60,62,64,65,67],explanation:'Öt szomszédos diatonikus hang: C–D–E–F–G.'}
 ],
 ritmus:[
  {id:'sync',title:'Szinkópa',lengths:[.5,1,.5],explanation:'Nyolcad–negyed–nyolcad, összesen 2 negyed.'},
  {id:'pointed',title:'Nyújtott ritmus',lengths:[1.5,.5],explanation:'Pontozott negyed és nyolcad, összesen 2 negyed.'},
  {id:'reverse',title:'Éles ritmus',lengths:[.5,1.5],explanation:'Nyolcad és pontozott negyed, összesen 2 negyed.'},
  {id:'triplet',title:'Nyolcadtriola',lengths:[1/3,1/3,1/3],explanation:'Három egyenlő triolanyolcad egy negyed időtartama alatt.'},
  {id:'two-eighth',title:'Két nyolcad',lengths:[.5,.5],explanation:'Két nyolcad egy negyednyi idő.'},
  {id:'quarter-eighths',title:'Negyed és két nyolcad',lengths:[1,.5,.5],explanation:'Negyed–nyolcad–nyolcad összesen 2 negyed.'}
 ],
 'hangérték':[
  {id:'whole',title:'Egész hangérték',lengths:[4],explanation:'Egy 4 negyedes, 4 másodperces hang 60 BPM-en.'},
  {id:'half',title:'Fél hangérték',lengths:[2,2],explanation:'Két fél hang, mindkettő 2 negyed.'},
  {id:'quarter',title:'Negyed hangérték',lengths:[1,1,1,1],explanation:'Négy negyedérték egy 4/4-es ütemben.'},
  {id:'eighth',title:'Nyolcad hangérték',lengths:Array(8).fill(.5),explanation:'Nyolc nyolcad egy 4/4-es ütemben.'},
  {id:'sixteenth',title:'Tizenhatod hangérték',lengths:Array(16).fill(.25),explanation:'Tizenhat tizenhatod egy 4/4-es ütemben.'}
 ],
 'ütemmutató':[
  {id:'2/4',title:'2/4',meter:[1,0,1,0],explanation:'Két kétszólamú ütem: súlyos–súlytalan / súlyos–súlytalan.'},
  {id:'3/4',title:'3/4',meter:[1,0,0,1,0,0],explanation:'Két hármas ütem: első negyed hangsúlyos.'},
  {id:'4/4',title:'4/4',meter:[1,0,.55,0,1,0,.55,0],explanation:'Két négyes ütem: 1. negyed főhangsúly, 3. mellékhangsúly.'},
  {id:'6/8',title:'6/8',meter:[1,0,0,.65,0,0,1,0,0,.65,0,0],explanation:'Két 6/8-os ütem: hat nyolcad, két hármas csoport, hangsúly az első és negyedik nyolcadon.'}
 ]
};
export const EAR_DRILL_CATEGORIES:Mode[]=['hangsor','ritmus','hangérték','ütemmutató'];
const shuffle=<T,>(source:readonly T[]):T[]=>{
 const a=[...source];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;
};
export function earDrillSchedule(challenge:Challenge,bpm=60):Segment[]{
 const quarter=60/bpm;const notes:Segment[]=[];let time=0;
 if(challenge.pitches)return challenge.pitches.map((pitch,i)=>({pitch,time:i*.76*quarter,duration:.68*quarter,accent:i===0?1:.55}));
 if(challenge.meter)return challenge.meter.map((accent,i)=>({
  pitch:accent===1?67:accent>.5?64:60,time:i*(challenge.id==='6/8'?quarter/2:quarter),
  duration:(challenge.id==='6/8'?quarter/2:quarter)*.65,accent:accent===1?1:accent>.5?.72:.44
 }));
 for(const length of challenge.lengths??[]){
  notes.push({pitch:60,time:time*quarter,duration:length*quarter*.91,accent:notes.length===0?1:.65});time+=length;
 }
 return notes;
}
let active:AudioContext|null=null;
export function stopExerciseAudio(){const prev=active;active=null;if(prev)void prev.close().catch(()=>{});}
export function playExercise(challenge:Challenge,bpm=60){
 stopExerciseAudio();const ctx=new AudioContext();active=ctx;const at=ctx.currentTime+.05;
 for(const note of earDrillSchedule(challenge,bpm)){
  const start=at+note.time;const stop=start+note.duration;
  const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=2400;
  const gain=ctx.createGain();gain.gain.setValueAtTime(.0001,start);
  gain.gain.linearRampToValueAtTime(.18*note.accent,start+.012);
  gain.gain.setValueAtTime(.14*note.accent,Math.max(start+.013,stop-.08));
  gain.gain.linearRampToValueAtTime(.0001,stop);
  for(const [harmonic,weight] of [[1,1],[2,.19],[3,.065]]){
   const osc=ctx.createOscillator();const mix=ctx.createGain();osc.type='sine';
   osc.frequency.setValueAtTime(440*Math.pow(2,(note.pitch-69)/12)*harmonic,start);
   mix.gain.value=weight;osc.connect(mix);mix.connect(filter);osc.start(start);osc.stop(stop+.015);
  }
  filter.connect(gain);gain.connect(ctx.destination);
 }
}
export const ExtendedEarTraining:React.FC<{onAddXp:(xp:number)=>void}>=({onAddXp})=>{
 const [mode,setMode]=useState<Mode>('hangsor');
 const [round,setRound]=useState(()=>shuffle(list.hangsor));
 const [index,setIndex]=useState(0);
 const [guess,setGuess]=useState<string|null>(null);
 const [streak,setStreak]=useState(0);
 const [bpm,setBpm]=useState(60);
 const current=round[index];
 const ref=useRef(0);
 useEffect(()=>()=>stopExerciseAudio(),[]);
 const changeMode=(next:Mode)=>{stopExerciseAudio();setMode(next);setRound(shuffle(list[next]));setIndex(0);setGuess(null);setStreak(0);};
 const choose=(id:string)=>{if(guess!==null)return;setGuess(id);if(id===current.id){onAddXp(25);setStreak(n=>n+1);}else setStreak(0);};
 const advance=()=>{stopExerciseAudio();setGuess(null);if(index+1>=round.length){setRound(shuffle(list[mode]));setIndex(0);}else setIndex(i=>i+1);};
 return <section className="max-w-3xl mx-auto p-5 sm:p-7 mt-6 text-slate-900">
  <header className="text-center mb-6">
    <p className="font-semibold text-xs uppercase tracking-widest text-indigo-700 mb-2">Hallásfejlesztés · új feladattípusok</p>
    <h2 className="font-bold text-3xl">Hangzó felismerés és gyakorlás</h2>
    <p className="text-sm text-slate-600 mt-2">Válassz témakört, hallgasd meg a szebb, hosszabb hangokat, majd azonosítsd a mintát. A kérdések kevert sorrendben jönnek.</p>
  </header>
  <div className="flex flex-wrap justify-center gap-2 mb-5">
    {EAR_DRILL_CATEGORIES.map(m=><button key={m} type="button" onClick={()=>changeMode(m)}
     aria-pressed={m===mode} className={`rounded-xl px-4 py-3 text-sm font-semibold border ${m===mode?'bg-indigo-700 text-white border-indigo-700':'bg-white text-slate-800 border-slate-200'}`}>{m==='hangérték'?'Hangértékek':m==='ütemmutató'?'Ütemmutatók':m==='hangsor'?'Hangsorok':'Ritmusképletek'}</button>)}
  </div>
  <article className="rounded-3xl p-5 md:p-8 border border-slate-200 shadow-sm bg-white">
    <div className="flex justify-between gap-3 items-center text-xs font-semibold text-indigo-700"><span>Feladat {index+1} / {round.length} · kevert sorrend</span><span>Sorozat: {streak} helyes</span></div>
    <div className="flex justify-center my-6">
      <button type="button" aria-label="Hangminta lejátszása" onClick={()=>playExercise(current,bpm)}
       className="w-20 h-20 bg-violet-600 text-white rounded-full flex items-center justify-center hover:bg-violet-500"><Play size={35} fill="white"/></button>
    </div>
    <p className="text-center text-sm text-slate-600 mb-4">Hallgasd meg a hangmintát! Újra meghallgathatod, amíg ki nem választod a választ.</p>
    <div className="flex justify-center items-center gap-3 mb-5 text-xs"><label htmlFor="ear-bpm">Tempó:</label>
     <select id="ear-bpm" value={bpm} onChange={e=>setBpm(Number(e.target.value))} className="border border-slate-300 rounded-lg px-3 py-2">
      {[50,60,72,90].map(n=><option key={n} value={n}>{n} BPM</option>)}
     </select><span className="text-slate-500">Alap: 60 BPM</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
     {list[mode].map(item=><button key={item.id} type="button" disabled={guess!==null} onClick={()=>choose(item.id)}
      className={`p-3 rounded-xl border text-sm font-semibold disabled:cursor-default ${guess!==null&&item.id===current.id?'border-emerald-600 bg-emerald-100 text-emerald-950':guess===item.id?'border-rose-600 bg-rose-100 text-rose-950':'border-slate-200 bg-slate-50 hover:bg-indigo-50'}`}>{item.title}</button>)}
    </div>
    {guess!==null&&<div role="status" className="mt-5 pt-5 border-t border-slate-200">
      <p className={`font-bold text-sm ${guess===current.id?'text-emerald-700':'text-rose-700'}`}>{guess===current.id?'Helyes! +25 XP':'A helyes válasz: '+current.title}</p>
      <p className="text-sm mt-2 text-slate-700">{current.explanation}</p>
      <button type="button" onClick={advance} className="mt-4 px-5 py-3 rounded-lg bg-indigo-700 text-white font-semibold text-sm">Következő feladat</button>
    </div>}
  </article>
 </section>;
};
