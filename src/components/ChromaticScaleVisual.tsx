import React,{useEffect,useRef,useState} from 'react';
import {CHROMATIC_STEPS,chromaticTimeline} from '../data/chromaticNotes';
import {playChromaticSequence,stopEarTrainingInterval} from '../utils/audio';

/** 2.2 Módosító jelek: hallható kromatikus hangsor és magyar enharmonikus hangnevek. */
export const ChromaticScaleVisual:React.FC=()=>{
 const [active,setActive]=useState(-1);
 const [playing,setPlaying]=useState(false);
 const timer=useRef<ReturnType<typeof setInterval>|null>(null);
 const startTime=useRef(0);
 const clearTimer=()=>{
   if(timer.current!==null){clearInterval(timer.current);timer.current=null;}
 };
 const stop=()=>{
   clearTimer();stopEarTrainingInterval();setPlaying(false);setActive(-1);
 };
 useEffect(()=>()=>{clearTimer();stopEarTrainingInterval();},[]);
 const start=(index?:number)=>{
   stop();
   try{
     const isSingle=index!==undefined;
     const notes=isSingle?[CHROMATIC_STEPS[index].note]:CHROMATIC_STEPS.map(step=>step.note);
     const audio=playChromaticSequence(notes,60);
     const timeline=chromaticTimeline(60);
     startTime.current=performance.now();
     setPlaying(true);
     setActive(isSingle?index:0);
     timer.current=setInterval(()=>{
       const elapsed=performance.now()-startTime.current;
       if(elapsed>=audio.durationMs){stop();return;}
       if(!isSingle)setActive(Math.min(CHROMATIC_STEPS.length-1,Math.floor(elapsed/(timeline.stepSeconds*1000))));
     },35);
   }catch(error){
     console.error('Kromatikus hangsor lejátszása:',error);
     stop();
   }
 };
 return <section className="mt-7 rounded-2xl border border-indigo-200 bg-white p-5 md:p-7" aria-label="Kromatikus hangsor – hallás és hangnevek">
   <h4 className="font-serif-cormorant text-2xl font-semibold mb-2">Kromatikus hangsor – próbáld ki és hallgasd meg!</h4>
   <p className="text-sm text-slate-700 mb-4">C′-től C″-ig a <strong>12 félhanglépést</strong> hallhatod egymás után, <strong>60 BPM</strong> tempóban, egyenletes negyedértékekkel. A hangszín lágy; minden hang <strong>1 másodpercnyi időt</strong> kap. A megszólaló hang neve kiemelkedik.</p>
   <div className="flex flex-wrap gap-2 items-center mb-4">
     <button type="button" onClick={()=>start()} className="rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-semibold text-sm px-5 py-3 focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-300">{playing?'Hangsor újraindítása':'Teljes kromatikus hangsor lejátszása'}</button>
     {playing&&<button type="button" onClick={stop} className="rounded-lg border border-slate-400 text-slate-800 text-sm px-5 py-3 font-semibold">Leállítás</button>}
   </div>
   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4" role="group" aria-label="Kromatikus hanggombok">
     {CHROMATIC_STEPS.map((step,index)=><button type="button" key={step.id}
       aria-label={step.label.replace(' / ',' vagy ')+' külön meghallgatása'}
       aria-pressed={active===index}
       onClick={()=>start(index)}
       className={`min-h-16 px-3 py-3 rounded-xl border text-sm font-semibold text-center transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-300 ${active===index?'bg-indigo-600 text-white border-indigo-700 shadow-md':step.isAltered?'bg-violet-50 text-violet-900 border-violet-200 hover:bg-violet-100':'bg-slate-50 text-slate-900 border-slate-200 hover:bg-indigo-50'}`}>
       {step.label}
     </button>)}
   </div>
   <p role="status" className="text-sm font-semibold text-indigo-800 mb-3">
     {active>=0?`Most szól: ${CHROMATIC_STEPS[active].label}`:'Válaszd a teljes hangsor lejátszását, vagy kattints egy hangnévre!'}
   </p>
   <p className="text-xs text-slate-600">A „Cisz / Desz” típusú kettős feliratok <strong>enharmonikus</strong> hangnevek: azonos temperált hangmagasság, eltérő lejegyzés. A magyar hangneveknél <strong>H</strong> a természetes hetedik fok, <strong>B</strong> a leszállított H hang. Ez a C′–C″ sor összesen 13 megszólaló hangból és 12 félhanglépésből áll.</p>
 </section>;
};
