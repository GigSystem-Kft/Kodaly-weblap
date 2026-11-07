import React,{useEffect,useRef,useState} from 'react';
import {playChromaticSequence,stopEarTrainingInterval} from '../utils/audio';
import {C_MAJOR_SCALE_NOTES} from '../utils/noteNotation';
import {TREBLE_STAFF_LINES,FIRST_LEDGER_LINE_Y,trebleStaffY} from '../utils/trebleStaff';

const SOLFEGE=['dó','ré','mi','fá','szó','lá','ti','dó′'] as const;
const NOTE_LABELS=['C′','D′','E′','F′','G′','A′','H′','C″'] as const;

export const SolfegeScaleVisual:React.FC=()=>{
 const [active,setActive]=useState(-1);
 const [playing,setPlaying]=useState(false);
 const timer=useRef<ReturnType<typeof setInterval>|null>(null);
 const clear=()=>{if(timer.current!==null){clearInterval(timer.current);timer.current=null;}};
 const stop=()=>{clear();stopEarTrainingInterval();setPlaying(false);setActive(-1);};
 useEffect(()=>()=>{clear();stopEarTrainingInterval();},[]);
 const play=(index?:number)=>{
  stop();
  try{
   const one=index!==undefined;
   const audio=playChromaticSequence(one?[C_MAJOR_SCALE_NOTES[index]]:C_MAJOR_SCALE_NOTES,60);
   const started=performance.now();
   setPlaying(true);
   setActive(one?index:0);
   timer.current=setInterval(()=>{
    const elapsed=performance.now()-started;
    if(elapsed>=audio.durationMs){stop();return;}
    if(!one)setActive(Math.min(7,Math.floor(elapsed/1000)));
   },35);
  }catch(error){console.error('Szolmizációs hangsor lejátszása:',error);stop();}
 };
 return <section className="mt-7 rounded-2xl border border-indigo-200 bg-white p-5 md:p-7" aria-label="Relatív szolmizáció, dó–dó hangzó skála">
  <h4 className="font-serif-cormorant text-2xl font-semibold mb-2">Dó–dó′: hallgasd és énekeld!</h4>
  <p className="text-sm text-slate-700 mb-4">A C-dúr példán <strong>dó–ré–mi–fá–szó–lá–ti–dó′</strong> szólal meg, minden hang negyedértékben, <strong>60 BPM</strong> mellett. A megszólaló hang kiemelkedik, külön is meghallgatható.</p>
  <div className="flex gap-2 flex-wrap mb-4">
   <button type="button" onClick={()=>play()} className="bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg px-4 py-3 font-semibold text-sm">{playing?'Újraindítás':'Dó–dó′ hangsor lejátszása'}</button>
   {playing&&<button type="button" onClick={stop} className="border border-slate-400 rounded-lg px-4 py-3 text-sm">Leállítás</button>}
  </div>
  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 mb-4" role="group" aria-label="Szolmizációs hangok">
   {C_MAJOR_SCALE_NOTES.map((note,i)=><button type="button" key={note} onClick={()=>play(i)}
    aria-pressed={active===i} aria-label={SOLFEGE[i]+' hang meghallgatása'}
    className={`border rounded-lg px-1 py-3 flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-semibold transition-colors ${active===i?'bg-indigo-600 text-white border-indigo-700':'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'}`}>
    <span>{SOLFEGE[i]}</span><span className="text-xs opacity-80">{NOTE_LABELS[i]}</span>
   </button>)}
  </div>
  <svg viewBox="0 0 440 154" role="img" aria-label="C′ az első alsó pótvonalon; dó–dó′ hangok helyesen a violinkulcsos vonalrendszerben" className="w-full max-w-xl rounded-lg bg-indigo-50">
   {TREBLE_STAFF_LINES.map(y=><line key={y} x1="18" y1={y} x2="422" y2={y} stroke="#64748b" strokeWidth="1.2"/>)}
   {C_MAJOR_SCALE_NOTES.map((note,i)=>{
    const x=38+i*49,y=trebleStaffY(note),on=active===i;
    return <g key={note}>
     {i===0&&<line x1={x-16} y1={FIRST_LEDGER_LINE_Y} x2={x+16} y2={FIRST_LEDGER_LINE_Y} stroke="#64748b" strokeWidth="1.2"/>}
     <ellipse cx={x} cy={y} rx="8" ry="5.5" transform={`rotate(-18 ${x} ${y})`} fill={on?'#f59e0b':'#4338ca'}/>
     <line x1={x+7} y1={y} x2={x+7} y2={y-30} stroke={on?'#d97706':'#4338ca'} strokeWidth="1.6"/>
     <text x={x} y="139" fontSize="12" textAnchor="middle" fill="#312e81">{SOLFEGE[i]}</text>
    </g>;
   })}
  </svg>
  <p role="status" className="text-sm text-indigo-800 mt-3 font-semibold">{active>=0?`Most szól: ${SOLFEGE[active]} (${NOTE_LABELS[active]})`:'Indítsd a hangsor lejátszását, vagy kattints egy hangra!'}</p>
  <p className="text-xs text-slate-600 mt-2">A C′ az első alsó pótvonalon áll; a dó a relatív szolmizációban más hangmagasságra is áthelyezhető.</p>
 </section>;
};
