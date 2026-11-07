import React, { useEffect, useRef, useState } from 'react';
import { playNote, playRhythmPlayback, stopRhythmPlayback } from '../utils/audio';
import { RHYTHM_SUBDIVISIONS, rhythmPattern, type RhythmSubdivision } from '../utils/rhythmPattern';

const keys = [
  {note:'C4', name:'C',semi:0},{note:'D4',name:'D',semi:2},
  {note:'E4',name:'E',semi:4},{note:'F4',name:'F',semi:5},
  {note:'G4',name:'G',semi:7},{note:'A4',name:'A',semi:9},
  {note:'H4',name:'H',semi:11},{note:'C5',name:'C′',semi:12}
];
const pentatonic = [0,2,4,7,9];
const hexachord = [0,2,4,5,7,9];
const major = [0,2,4,5,7,9,11,12];
const presets = [
  {label:'Pentaton (5 hang)',steps:pentatonic},
  {label:'Hexachord (6 hang)',steps:hexachord},
  {label:'Dúr hangsor',steps:major}
];
export const InteractiveMusicVisual:React.FC<{chapterId:string}>=({chapterId})=>{
  const [selected,setSelected]=useState(1);
  const [active,setActive]=useState('C4');
  const [division,setDivision]=useState<RhythmSubdivision>(1);
  const [activeRhythmCell,setActiveRhythmCell]=useState(-1);
  const [isRhythmPlaying,setIsRhythmPlaying]=useState(false);
  const animation=useRef<ReturnType<typeof setInterval>|null>(null);
  const stopRhythm=()=>{
    stopRhythmPlayback();
    if(animation.current!==null){clearInterval(animation.current);animation.current=null;}
    setIsRhythmPlaying(false);
    setActiveRhythmCell(-1);
  };
  useEffect(()=>()=>{stopRhythmPlayback();if(animation.current!==null)clearInterval(animation.current);},[]);
  const selectDivision=(value:RhythmSubdivision)=>{
    stopRhythm();
    setDivision(value);
  };
  const startRhythm=()=>{
    stopRhythm();
    try {
      const playback=playRhythmPlayback(division,60);
      const begin=performance.now();
      const noteMs=playback.durationMs/division;
      setIsRhythmPlaying(true);
      setActiveRhythmCell(0);
      animation.current=setInterval(()=>{
        const elapsed=performance.now()-begin;
        if(elapsed>=playback.durationMs)stopRhythm();
        else setActiveRhythmCell(Math.min(division-1,Math.floor(elapsed/noteMs)));
      },35);
    }catch(error){console.error('Ritmuslejátszás hiba:',error);stopRhythm();}
  };
  const notes=presets[selected].steps;
  if(!['ritmus','hangkeszletek','hetfoku-hangsorok','szolmizacio-hangkozok'].includes(chapterId))return null;
  return <section className="mt-7 rounded-2xl border border-indigo-200 bg-white p-5 md:p-7" aria-label="Interaktív zenei szemléltetés">
    <h4 className="font-serif-cormorant text-2xl font-semibold mb-2">Próbáld ki és hallgasd meg!</h4>
    {chapterId==='ritmus' && <>
      <p className="text-slate-600 text-sm mb-3">Egy teljes <strong>4/4-es ütemet</strong> hallhatsz <strong>60 BPM</strong> tempóban (négy negyed = 4 másodperc). A hangmagasság azonos, csak a hangok időtartama és száma változik.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {RHYTHM_SUBDIVISIONS.map(n=><button key={n} type="button" onClick={()=>selectDivision(n)}
          aria-pressed={division===n}
          className={`border rounded-lg px-3 py-2 text-sm ${division===n?'bg-indigo-600 text-white':'bg-white text-slate-800'}`}>{n===1?'Egész':n===2?'Fél':n===4?'Negyed':n===8?'Nyolcad':'Tizenhatod'}</button>)}
      </div>
      <p className="font-semibold text-slate-800 text-sm mb-3">{division} × {division===1?'egész':division===2?'fél':division===4?'negyed':division===8?'nyolcad':'tizenhatod'} hang = 4 negyed. Egy hang időtartama: {(rhythmPattern(division).noteSeconds).toLocaleString('hu-HU')} másodperc.</p>
      <div className="flex gap-1 h-20 mb-3" role="group" aria-label="Négy negyedből álló ütem hangértékekre bontva">
        {Array.from({length:division},(_,i)=><div key={i} aria-label={`${i+1}. hang`}
          className={`flex-1 min-w-0 border rounded-md flex flex-col items-center justify-center transition-colors duration-75 ${activeRhythmCell===i?'bg-indigo-600 border-indigo-700 text-white':'bg-indigo-100 border-indigo-400 text-indigo-900'}`}>
          <span className="text-xl leading-none" aria-hidden="true">{division===1?'𝅝':division===2?'𝅗𝅥':division===4?'♩':division===8?'♪':'♬'}</span>
          {division<=8&&<span className="text-xs mt-1">{i+1}</span>}
        </div>)}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm" onClick={startRhythm}>
          {isRhythmPlaying?'Újraindítás':'Négynegyedes ütem lejátszása'}
        </button>
        {isRhythmPlaying&&<button type="button" className="border border-slate-400 text-slate-900 rounded-lg px-4 py-2 text-sm" onClick={stopRhythm}>Leállítás</button>}
      </div>
      <p className="text-xs text-slate-600 mt-3" role="status">{isRhythmPlaying?'Lejátszás folyamatban: a kiemelt mező mutatja az aktuális hangot.':'Válassz hangértéket, majd indítsd el az ütemet. Minden beállítás pontosan 4 másodpercig tart.'}</p>
    </>}
    {chapterId!=='ritmus' && <>
      <p className="text-slate-600 text-sm mb-3">Válassz hangkészletet, majd kattints a billentyűkre: az ábrán egyszerre látod a hangnevet, a hangsor lépéseit és a megszólaló hangot.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((preset,i)=><button type="button" key={preset.label} onClick={()=>setSelected(i)}
          aria-pressed={selected===i}
          className={`rounded-lg border px-3 py-2 text-sm ${selected===i?'bg-indigo-600 text-white':'bg-white text-slate-800'}`}>{preset.label}</button>)}
      </div>
      <div className="grid grid-cols-8 gap-1 h-28 sm:h-40 mb-3">
        {keys.map(({note,name,semi})=><button key={note} type="button" disabled={!notes.includes(semi)}
          aria-label={note+' megszólaltatása'} onClick={()=>{setActive(note);playNote(note,650)}}
          className={`rounded-b-lg border flex items-end justify-center pb-3 font-bold ${!notes.includes(semi)?'bg-slate-100 text-slate-400':active===note?'bg-indigo-500 text-white':'bg-white text-indigo-800 border-indigo-300 hover:bg-indigo-50'}`}>{name}</button>)}
      </div>
      <svg viewBox="0 0 440 135" role="img" aria-label="A kiválasztott hangsor kottavonalon szemléltetve" className="w-full max-w-xl rounded-lg bg-indigo-50">
        {[35,51,67,83,99].map(y=><line key={y} x1="18" y1={y} x2="422" y2={y} stroke="#64748b" strokeWidth="1.2"/>)}
        {notes.map((semi,i)=>{
          const x=38+i*48;
          const step=[0,2,4,5,7,9,11,12].indexOf(semi);
          const y=107-step*8;
          return <g key={semi}><ellipse cx={x} cy={y} rx="8" ry="5.5" transform={`rotate(-18 ${x} ${y})`} fill="#4338ca"/>
            <line x1={x+7} y1={y} x2={x+7} y2={y-31} stroke="#4338ca" strokeWidth="1.6"/>
            <text x={x} y="124" textAnchor="middle" fontSize="12" fill="#312e81">{keys.find(k=>k.semi===semi)?.name}</text>
          </g>;
        })}
      </svg>
      <p className="text-xs text-slate-600 mt-3">A hangok hangmagassága a kiegyenlített hangolást követi; az egyszerű kottaábra tanulási célú, C-dúr alapú szemléltetés.</p>
    </>}
  </section>;
};
