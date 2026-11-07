import React,{useEffect,useRef,useState} from 'react';
import {playChromaticSequence,stopEarTrainingInterval} from '../utils/audio';

/** C′-ről fölfelé megszólaló, kis/nagy/tiszta és tritónusz hangközök. */
export const INTERVAL_EXAMPLES=[
 {name:'Tiszta prím (t1)',note:'C4',upperName:'C′',semitones:0},
 {name:'Kis szekund (k2)',note:'C#4',upperName:'Desz′',semitones:1},
 {name:'Nagy szekund (n2)',note:'D4',upperName:'D′',semitones:2},
 {name:'Kis terc (k3)',note:'D#4',upperName:'Esz′',semitones:3},
 {name:'Nagy terc (n3)',note:'E4',upperName:'E′',semitones:4},
 {name:'Tiszta kvart (t4)',note:'F4',upperName:'F′',semitones:5},
 {name:'Tritónusz (b4/sz5)',note:'F#4',upperName:'Fisz′',semitones:6},
 {name:'Tiszta kvint (t5)',note:'G4',upperName:'G′',semitones:7},
 {name:'Kis szext (k6)',note:'G#4',upperName:'Asz′',semitones:8},
 {name:'Nagy szext (n6)',note:'A4',upperName:'A′',semitones:9},
 {name:'Kis szeptim (k7)',note:'A#4',upperName:'B′',semitones:10},
 {name:'Nagy szeptim (n7)',note:'H4',upperName:'H′',semitones:11},
 {name:'Tiszta oktáv (t8)',note:'C5',upperName:'C″',semitones:12}
] as const;

export const IntervalExamplesVisual:React.FC=()=>{
 const [selected,setSelected]=useState(7);
 const [playing,setPlaying]=useState(false);
 const [highlight,setHighlight]=useState(-1);
 const timer=useRef<ReturnType<typeof setInterval>|null>(null);
 const stop=()=>{
  if(timer.current!==null){clearInterval(timer.current);timer.current=null;}
  stopEarTrainingInterval();setPlaying(false);setHighlight(-1);
 };
 useEffect(()=>()=>{if(timer.current!==null)clearInterval(timer.current);stopEarTrainingInterval();},[]);
 const play=()=>{
  stop();
  try{
   const audio=playChromaticSequence(['C4',INTERVAL_EXAMPLES[selected].note],60);
   const started=performance.now();
   setPlaying(true);setHighlight(0);
   timer.current=setInterval(()=>{
    const elapsed=performance.now()-started;
    if(elapsed>=audio.durationMs){stop();return;}
    setHighlight(elapsed<1000?0:1);
   },35);
  }catch(error){console.error('Hangközlejátszás:',error);stop();}
 };
 return <section className="mt-7 rounded-2xl border border-indigo-200 bg-white p-5 md:p-7" aria-label="Hangközök hangzó szemléltetése">
  <h4 className="font-serif-cormorant text-2xl font-semibold mb-2">Hallgasd meg a hangközöket!</h4>
  <p className="text-sm text-slate-700 mb-4">Válassz hangközt, majd hallgasd meg a <strong>két egymás után megszólaló hangot</strong>. Az alsó hang mindig C′, a felső hang magassága változik. A példa <strong>60 BPM</strong> mellett, két negyedértékben szól.</p>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
   {INTERVAL_EXAMPLES.map((interval,index)=><button key={interval.name} type="button"
    aria-pressed={selected===index} onClick={()=>{stop();setSelected(index);}}
    className={`text-sm border rounded-xl px-3 py-3 font-semibold transition-colors ${selected===index?'bg-indigo-700 text-white border-indigo-700':'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'}`}>{interval.name}</button>)}
  </div>
  <div className="flex gap-3 flex-wrap items-center mb-3">
   <button type="button" onClick={play} className="bg-slate-900 text-white rounded-lg px-5 py-3 text-sm font-semibold">{playing?'Újraindítás':'Kiválasztott hangköz lejátszása'}</button>
   {playing&&<button type="button" onClick={stop} className="border border-slate-400 rounded-lg px-5 py-3 text-sm">Leállítás</button>}
  </div>
  <div className="flex gap-2 mb-3" role="group" aria-label="Hangköz két hangjának sorrendje">
   {['C′ (alaphang)',INTERVAL_EXAMPLES[selected].upperName].map((label,i)=><div key={label}
    className={`flex-1 text-center rounded-lg border px-3 py-3 text-sm font-semibold ${highlight===i?'bg-amber-200 border-amber-500 text-amber-950':'bg-slate-50 border-slate-200 text-slate-700'}`}>{label}</div>)}
  </div>
  <p className="text-sm text-indigo-800 font-semibold" role="status">{INTERVAL_EXAMPLES[selected].name}: {INTERVAL_EXAMPLES[selected].semitones} félhang.
  {playing?' A két hang felváltva kiemelve látható.':''}</p>
  <p className="text-xs text-slate-600 mt-3">A hangköz száma a diatonikus hangnevek számolásából adódik, minősége a félhangtávolságból. A hat félhangos tritónusz az adott írásmódtól függően bővített kvart vagy szűkített kvint.</p>
 </section>;
};
