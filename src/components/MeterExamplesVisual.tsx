import React, {useEffect,useRef,useState} from 'react';
import { playMeterExample,stopRhythmPlayback } from '../utils/audio';
import { METER_OPTIONS,meterPattern,type MeterId } from '../utils/meterPatterns';

const descriptions:Record<MeterId,string>={
 '2/4':'Egy hangsúlyos és egy hangsúlytalan negyed ütemenként – gyakori magyar gyermekdalokban.',
 '3/4':'Egy hangsúlyos, majd két hangsúlytalan negyed ütemenként.',
 '4/4':'Főhangsúly az első, mellékhangsúly a harmadik negyeden.',
 '6/8':'Hat nyolcad két hármas csoportban: hangsúly az első, enyhébb hangsúly a negyedik nyolcadon.'
};

/** A két ütem minden ütését külön kiemeli, az eltérő hangsúlyok dinamikájával. */
export const MeterExamplesVisual:React.FC=()=>{
 const [selected,setSelected]=useState<MeterId>('2/4');
 const [playing,setPlaying]=useState(false);
 const [current,setCurrent]=useState(-1);
 const interval=useRef<ReturnType<typeof setInterval>|null>(null);
 const selectedPattern=meterPattern(selected,60);
 const clearTimer=()=>{
   if(interval.current!==null){clearInterval(interval.current);interval.current=null;}
 };
 const stop=()=>{stopRhythmPlayback();clearTimer();setPlaying(false);setCurrent(-1);};
 useEffect(()=>()=>{stopRhythmPlayback();clearTimer();},[]);
 const choose=(meter:MeterId)=>{stop();setSelected(meter);};
 const play=()=>{
  stop();
  try{
    const pattern=meterPattern(selected,60);
    playMeterExample(selected,60);
    const started=performance.now();
    setPlaying(true);
    setCurrent(0);
    interval.current=setInterval(()=>{
      const elapsed=(performance.now()-started)/1000;
      if(elapsed>=pattern.totalDurationSeconds){stop();return;}
      const unit=pattern.pulses[0].durationSeconds;
      setCurrent(Math.min(pattern.pulses.length-1,Math.floor(elapsed/unit)));
    },35);
  }catch(error){console.error('Ütemmutató-lejátszás:',error);stop();}
 };
 const styles={fo:'border-indigo-500 bg-indigo-100 text-indigo-900',
   mellek:'border-violet-400 bg-violet-50 text-violet-800',
   sulytalan:'border-slate-200 bg-slate-50 text-slate-600'} as const;
 return <section className="mt-7 rounded-2xl border border-indigo-200 bg-white p-5 md:p-7" aria-label="Ütemmutatók hangzó gyakorlása">
  <h4 className="font-serif-cormorant text-2xl font-semibold mb-2">Próbáld ki és hallgasd meg!</h4>
  <p className="text-sm text-slate-700 mb-4">Minden ütemmutatóból <strong>két teljes ütemet</strong> hallasz.
   A főhangsúly erősebben, a mellékhangsúly közepesen, a súlytalan ütések halkan szólnak.
   A negyed tempója 60 BPM; 6/8-ban a hat nyolcad 3+3-as csoportot alkot.</p>
  <div className="flex gap-2 flex-wrap mb-4">
   {METER_OPTIONS.map(id=><button type="button" key={id} aria-pressed={selected===id}
     onClick={()=>choose(id)}
     className={`border rounded-xl px-5 py-3 font-bold text-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-300 ${selected===id?'bg-indigo-600 text-white border-indigo-700':'bg-white text-slate-800 border-slate-300 hover:bg-indigo-50'}`}>{id}</button>)}
  </div>
  <p className="text-sm text-slate-700 mb-3">{descriptions[selected]}</p>
  <div className="flex gap-3 flex-wrap text-xs mb-4">
    <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-500"/>Főhangsúly</span>
    <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-violet-300"/>Mellékhangsúly</span>
    <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-200"/>Súlytalan</span>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
   {[0,1].map(bar=><div key={bar} className="rounded-xl border border-slate-200 p-3">
    <p className="text-xs font-bold text-slate-600 mb-2">{bar+1}. ütem</p>
    <div className="flex gap-1">
     {selectedPattern.pulses.filter(p=>p.bar===bar).map(p=><div key={p.index}
       aria-label={`${p.withinBar+1}. ütés: ${p.accent==='fo'?'főhangsúly':p.accent==='mellek'?'mellékhangsúly':'súlytalan'}`}
       className={`min-w-0 flex-1 border rounded-lg h-14 flex justify-center items-center text-sm font-semibold transition-colors ${current===p.index?'bg-amber-300 border-amber-500 text-amber-950':styles[p.accent]}`}>{p.withinBar+1}</div>)}
    </div>
   </div>)}
  </div>
  <p className="text-xs text-slate-600 mb-4">Időtartam: {selectedPattern.totalDurationSeconds.toLocaleString('hu-HU')} másodperc. Minden hang önállóan megszólal; két egymást követő ütem azonos hangsúlyrenddel.</p>
  <div className="flex gap-2 flex-wrap">
    <button type="button" onClick={play} className="bg-slate-900 text-white rounded-lg px-4 py-3 text-sm font-semibold">{playing?'Lejátszás újraindítása':'Két ütem lejátszása'}</button>
    {playing&&<button type="button" onClick={stop} className="border border-slate-400 rounded-lg px-4 py-3 text-sm font-semibold">Leállítás</button>}
  </div>
  <p className="text-xs text-slate-600 mt-3" role="status">{playing?'A kiemelt mező az aktuális ütést mutatja.':'Válassz ütemmutatót, majd indítsd el a kétütemes példát.'}</p>
 </section>;
};
