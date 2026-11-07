import React,{useEffect,useRef,useState} from 'react';
import {MAJOR_SCALES,MINOR_SCALES,TRIADS,C_MAJOR_INVERSIONS,type NamedSound} from '../data/tonalExamples';
import {playChromaticSequence,playWarmTriad,stopEarTrainingInterval} from '../utils/audio';

type Mode='major'|'minor'|'triads';
const DATA:Record<Mode,readonly NamedSound[]>={major:MAJOR_SCALES,minor:MINOR_SCALES,triads:[...TRIADS,...C_MAJOR_INVERSIONS]};
export const TonalExamplesVisual:React.FC<{mode:Mode}>=({mode})=>{
 const [selected,setSelected]=useState(0);
 const [active,setActive]=useState(-1);
 const [playing,setPlaying]=useState(false);
 const [chordMode,setChordMode]=useState<'egyutt'|'egymasutan'>('egyutt');
 const ticker=useRef<ReturnType<typeof setInterval>|null>(null);
 const notes=DATA[mode];
 const item=notes[Math.min(selected,notes.length-1)];
 const stop=()=>{if(ticker.current!==null){clearInterval(ticker.current);ticker.current=null;}
   stopEarTrainingInterval();setActive(-1);setPlaying(false);};
 useEffect(()=>()=>{if(ticker.current!==null)clearInterval(ticker.current);stopEarTrainingInterval();},[]);
 useEffect(()=>{setSelected(0);setActive(-1);setPlaying(false);},[mode]);
 const play=(index?:number)=>{
   stop();
   try {
    const single=index!==undefined;
    const simultaneous=mode==='triads'&&chordMode==='egyutt'&&!single;
    const chosen=single?[item.notes[index]]:item.notes;
    const audio=simultaneous?playWarmTriad(chosen):playChromaticSequence(chosen,60);
    const beginning=performance.now();
    setActive(single?index:0);setPlaying(true);
    ticker.current=setInterval(()=>{
      const elapsed=performance.now()-beginning;
      if(elapsed>=audio.durationMs){stop();return;}
      if(simultaneous)setActive(-2);
      else if(!single)setActive(Math.min(item.notes.length-1,Math.floor(elapsed/1000)));
    },35);
   }catch(error){console.error('Hangsor vagy akkord lejátszás:',error);stop();}
 };
 return <section className="mt-7 rounded-2xl border border-indigo-200 bg-white p-5 md:p-7" aria-label="Hangsorok és akkordok magyar hangnevekkel">
   <h4 className="font-serif-cormorant text-2xl font-semibold mb-2">{mode==='major'?'Öt dúr hangsor meghallgatása':mode==='minor'?'A moll három alakja':'Négy hármashangzat és fordítások'}</h4>
   <p className="text-sm text-slate-700 mb-4">{mode==='triads'?'Válassz akkordfajtát vagy fordítást. A hangokat együtt vagy egymás után is megszólaltathatod.':'Válassz hangsornemet! A hangok 60 BPM tempóban egyenletes negyedként szólnak, a megszólaló hangnév kiemelkedik.'}</p>
   <div className="flex flex-wrap gap-2 mb-4">
    {notes.map((example,i)=><button type="button" key={example.name} onClick={()=>{stop();setSelected(i);}}
      aria-pressed={selected===i}
      className={`px-4 py-3 rounded-xl border text-sm font-semibold ${selected===i?'bg-indigo-700 border-indigo-700 text-white':'bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100'}`}>{example.name}</button>)}
   </div>
   <p className="font-semibold text-indigo-800 mb-1">{item.name}</p>
   <p className="text-sm text-slate-700 mb-4">{item.description}</p>
   {mode==='triads'&&<div className="flex flex-wrap gap-4 mb-4">
    {(['egyutt','egymasutan'] as const).map(m=><label key={m} className="text-sm text-slate-800 flex items-center gap-2">
      <input type="radio" checked={chordMode===m} onChange={()=>{stop();setChordMode(m);}}/>
      {m==='egyutt'?'Együtt szóló akkord':'Hangok egymás után'}
    </label>)}
   </div>}
   <div className="flex flex-wrap gap-2 mb-4" aria-label="Magyar ABC-s hangnevek">
    {item.labels.map((label,i)=><button key={i} type="button" onClick={()=>play(i)}
     aria-pressed={active===i||active===-2}
     className={`rounded-lg border px-3 py-3 text-sm font-semibold min-w-12 ${active===i||active===-2?'bg-amber-300 text-amber-950 border-amber-500':'bg-slate-50 text-indigo-900 border-slate-200 hover:bg-indigo-50'}`}>{label}</button>)}
   </div>
   <div className="flex flex-wrap gap-2">
    <button type="button" onClick={()=>play()} className="rounded-lg bg-indigo-700 text-white px-5 py-3 text-sm font-semibold">{playing?'Újraindítás':'Hangzó példa lejátszása'}</button>
    {playing&&<button type="button" onClick={stop} className="rounded-lg border border-slate-400 text-slate-800 px-5 py-3 text-sm font-semibold">Leállítás</button>}
   </div>
   <p role="status" className="text-xs text-slate-600 mt-3">{active===-2?'Mindhárom akkordhang együtt szól.':active>=0?`Most szól: ${item.labels[active]}`:'Bármely hang külön is meghallgatható.'}</p>
 </section>;
};

export const CircleOfFifthsVisual:React.FC=()=> <section className="mt-7 rounded-2xl border border-indigo-200 bg-white p-5 md:p-7">
 <h4 className="font-serif-cormorant text-2xl font-semibold mb-2">A magyar kvintkör részletes ábrája</h4>
 <p className="text-sm text-slate-700 mb-3">A körön kívül a dúr hangnemek, belül a párhuzamos mollok, alattuk az előjegyzések száma szerepel. Jobbra kvintenként újabb kereszt, balra újabb bé jelenik meg.</p>
 <a href="/assets/kvintkor-magyar-reszletes.svg" target="_blank" rel="noopener noreferrer" aria-label="Részletes magyar kvintkör megnyitása nagy méretben">
  <img src="/assets/kvintkor-magyar-reszletes.svg" className="w-full max-w-3xl mx-auto rounded-xl border border-indigo-100" alt="Részletes kvintkör tizenkét dúr hangnemmel, párhuzamos mollokkal és előjegyzésekkel, magyar hangnevekkel"/>
 </a>
 <p className="text-xs text-slate-600 mt-2">Kattints a képre a teljes méretű, nagyítható SVG-ábrához. A kvintkör saját, vektoros szemléltető ábra.</p>
 </section>;
