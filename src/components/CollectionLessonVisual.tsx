import React,{useEffect,useRef,useState} from 'react';
import {COLLECTION_EXAMPLES,type CollectionLesson} from '../data/collectionLessonExamples';
import {playChromaticSequence,stopEarTrainingInterval} from '../utils/audio';
import {TREBLE_STAFF_LINES,FIRST_LEDGER_LINE_Y,trebleStaffY} from '../utils/trebleStaff';
import {hungarianOctaveName} from '../utils/noteNotation';

const HELP:Record<CollectionLesson,string>={
 'ton-hangkeszlet':'A hangkészletet a dallamban előforduló különböző hangok adják. A biton, triton, tetraton és pentaton példák az itt megadott szolmizációs készleteket járják be.',
 'chord-hangkeszlet':'Itt egymás mellett álló diatonikus fokokat hallasz. Figyeld meg a bichord, trichord, pentachord és hexachord hangjainak számát és hangközrendjét.',
 'pentaton-gyakorlat':'Minden motívum ugyanazt az öt különböző hangot használja (dó, ré, mi, szó, lá), mégis eltérő dallam alakul ki.'
};

export const CollectionLessonVisual:React.FC<{lessonId:CollectionLesson}>=({lessonId})=>{
 const examples=COLLECTION_EXAMPLES[lessonId];
 const [selected,setSelected]=useState(0);
 const [active,setActive]=useState(-1);
 const [playing,setPlaying]=useState(false);
 const clock=useRef<ReturnType<typeof setInterval>|null>(null);
 const example=examples[selected];
 const stop=()=>{
  if(clock.current!==null){clearInterval(clock.current);clock.current=null;}
  stopEarTrainingInterval();
  setActive(-1);setPlaying(false);
 };
 useEffect(()=>()=>{if(clock.current!==null)clearInterval(clock.current);stopEarTrainingInterval();},[]);
 useEffect(()=>{stop();setSelected(0);},[lessonId]);
 const play=(noteIndex?:number)=>{
  stop();
  try {
   const single=noteIndex!==undefined;
   const notes=single?[example.notes[noteIndex]]:example.notes;
   const playback=playChromaticSequence(notes,60);
   const begun=performance.now();
   setActive(single?noteIndex:0);
   setPlaying(true);
   clock.current=setInterval(()=>{
    const elapsed=performance.now()-begun;
    if(elapsed>=playback.durationMs){stop();return;}
    if(!single)setActive(Math.min(example.notes.length-1,Math.floor(elapsed/1000)));
   },35);
  }catch(err){console.error('Hangkészlet lejátszási hiba:',err);stop();}
 };
 const width=Math.max(565,125+example.notes.length*57);
 return <section className="mt-7 rounded-2xl border border-indigo-200 bg-white p-5 md:p-7" aria-label="Hangkészlet gyakorlatok kottával és hanggal">
  <h4 className="font-serif-cormorant text-2xl font-semibold mb-2">Próbáld ki, hallgasd meg és kövesd a kottát!</h4>
  <p className="text-sm text-slate-700 mb-4">{HELP[lessonId]} Minden hang <strong>negyedértékben, 60 BPM</strong> mellett szólal meg, a megszólaló kottafej és hanggomb együtt emelkedik ki.</p>
  <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Hangkészlet és dallamminta kiválasztása">
   {examples.map((item,index)=><button type="button" key={item.id} aria-pressed={selected===index}
    onClick={()=>{stop();setSelected(index);}}
    className={`rounded-xl border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-300 ${selected===index?'bg-indigo-700 text-white border-indigo-700':'bg-white text-slate-800 border-slate-300 hover:bg-indigo-50'}`}>{item.title}</button>)}
  </div>
  <p className="font-bold text-indigo-800 text-base mb-1">{example.solfege}</p>
  <p className="text-sm text-slate-700 mb-3">{example.description}</p>
  <p className="text-xs font-semibold text-slate-600 mb-3">{example.pitchCount} különböző hang · {example.notes.length} megszólalás · {example.notes.length} másodperc</p>
  <div className="overflow-x-auto border border-indigo-100 bg-indigo-50 rounded-xl p-2 mb-4">
   <svg viewBox={`0 0 ${width} 175`} style={{minWidth:Math.min(width,530)}} className="w-full h-auto" role="img"
     aria-label={`Violinkulcsos kotta, ${example.title}, helyes vonalak és C′ alsó pótvonal: ${example.notes.map(hungarianOctaveName).join(', ')}`}>
     {TREBLE_STAFF_LINES.map(y=><line key={y} x1="30" y1={y} x2={width-20} y2={y} stroke="#64748b" strokeWidth="1.2"/>)}
     <text x="34" y="107" fontFamily="serif" fontSize="82" fill="#334155" aria-hidden="true">𝄞</text>
     {example.notes.map((note,index)=>{
       const x=105+index*57;
       const y=trebleStaffY(note);
       const on=index===active;
       const ink=on?'#b45309':'#4338ca';
       return <g key={index}>
        {note==='C4'&&<line x1={x-15} y1={FIRST_LEDGER_LINE_Y} x2={x+15} y2={FIRST_LEDGER_LINE_Y} stroke="#64748b" strokeWidth="1.4"/>}
        <ellipse cx={x} cy={y} rx="8" ry="5.5" transform={`rotate(-18 ${x} ${y})`} fill={ink}/>
        <line x1={x+7} y1={y} x2={x+7} y2={y-29} stroke={ink} strokeWidth="1.8"/>
        <text x={x} y="145" textAnchor="middle" fontSize="12" fontWeight={on?'700':'400'} fill={on?'#92400e':'#312e81'}>{hungarianOctaveName(note)}</text>
        {on&&<circle cx={x} cy={y} r="13" fill="none" stroke="#f59e0b" strokeWidth="2.5"/>}
       </g>;
     })}
   </svg>
  </div>
  <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Dallamhangok egyéni meghallgatása">
   {example.notes.map((note,index)=><button type="button" key={index} onClick={()=>play(index)}
    aria-pressed={active===index} aria-label={`${index+1}. hang: ${hungarianOctaveName(note)} meghallgatása`}
    className={`rounded-lg border px-3 py-2 text-sm font-semibold ${active===index?'bg-amber-300 text-amber-950 border-amber-600':'bg-slate-50 text-indigo-900 border-slate-200 hover:bg-indigo-50'}`}>{hungarianOctaveName(note)}</button>)}
  </div>
  <div className="flex flex-wrap gap-2">
   <button type="button" onClick={()=>play()} className="rounded-lg bg-indigo-700 text-white px-5 py-3 text-sm font-semibold">{playing?'Újraindítás':'Dallam meghallgatása'}</button>
   {playing&&<button type="button" onClick={stop} className="rounded-lg border border-slate-400 px-5 py-3 text-sm font-semibold">Leállítás</button>}
  </div>
  <p className="text-xs text-slate-600 mt-3" role="status">{active>=0?`Most szól: ${hungarianOctaveName(example.notes[active])}`:'Válassz mintát, és indítsd el a lejátszást.'}</p>
  <p className="text-xs text-slate-500 mt-2">A hangzó példák saját, oktatási célú motívumok; a népdalcímek nem azonosítják az itt megszólaló dallamokat. A kottaképen a C′ az első alsó pótvonalon áll.</p>
 </section>;
};
