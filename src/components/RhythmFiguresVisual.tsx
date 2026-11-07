import React, { useEffect, useRef, useState } from 'react';
import { playRhythmFigure, stopRhythmPlayback } from '../utils/audio';
import { RHYTHM_FIGURES, rhythmFigurePattern, type RhythmFigureId } from '../utils/rhythmFigures';

/** Az 1.2 Ritmusképletek és szünetek alfejezet saját hangzó szemléltetője. */
export const RhythmFiguresVisual: React.FC=()=>{
  const [figureId,setFigureId]=useState<RhythmFigureId>('nyujtott');
  const [metronome,setMetronome]=useState(true);
  const [playing,setPlaying]=useState(false);
  const [activeEvent,setActiveEvent]=useState(-1);
  const [activeBeat,setActiveBeat]=useState(-1);
  const timer=useRef<ReturnType<typeof setInterval>|null>(null);
  const stop=()=>{
    stopRhythmPlayback();
    if(timer.current!==null){clearInterval(timer.current);timer.current=null;}
    setPlaying(false);setActiveEvent(-1);setActiveBeat(-1);
  };
  useEffect(()=>()=>{stopRhythmPlayback();if(timer.current!==null)clearInterval(timer.current);},[]);
  const pattern=rhythmFigurePattern(figureId,60);
  const choose=(id:RhythmFigureId)=>{stop();setFigureId(id);};
  const start=()=>{
    stop();
    try {
      const playback=playRhythmFigure(figureId,60,metronome);
      const begun=performance.now();
      setPlaying(true);setActiveEvent(0);setActiveBeat(0);
      timer.current=setInterval(()=>{
        const elapsed=(performance.now()-begun)/1000;
        if(elapsed>=pattern.totalSeconds){stop();return;}
        const beatPosition=elapsed/pattern.beatSeconds;
        const eventIndex=pattern.events.findIndex(item=>beatPosition>=item.startBeats &&
          beatPosition<item.startBeats+item.durationBeats);
        setActiveEvent(eventIndex);
        setActiveBeat(Math.min(pattern.figure.lengthBeats-1,Math.floor(beatPosition)));
      },35);
      void playback;
    }catch(error){console.error('Ritmusképlet lejátszási hiba:',error);stop();}
  };
  return <section className="mt-7 rounded-2xl border border-indigo-200 bg-white p-5 md:p-7" aria-label="Ritmusképletek hangzó gyakorlása">
    <h4 className="font-serif-cormorant text-2xl font-semibold mb-2">Próbáld ki és hallgasd meg!</h4>
    <p className="text-slate-700 text-sm mb-4">
      Válassz ritmusképletet! A nyújtott, éles és szinkópa <strong>2 negyedig</strong>, a triola <strong>1 negyedig</strong> szól.
      A tempó <strong>60 BPM</strong>, a metronóm csak a képlet hosszáig kattan.
    </p>
    <div className="flex flex-wrap gap-2 mb-4">
      {RHYTHM_FIGURES.map(item=><button key={item.id} type="button" onClick={()=>choose(item.id)}
        aria-pressed={figureId===item.id}
        className={`rounded-lg border px-3 py-2 text-sm font-semibold ${figureId===item.id?'bg-indigo-600 text-white border-indigo-700':'bg-white text-slate-800 border-slate-300 hover:bg-indigo-50'}`}>
        {item.title}
      </button>)}
    </div>
    <p className="text-indigo-800 font-bold mb-2">{pattern.figure.mnemonic}</p>
    <p className="text-sm text-slate-700 mb-1">{pattern.figure.explanation}</p>
    <p className="text-sm font-semibold text-slate-800 mb-4">Időtartam: {pattern.figure.lengthBeats} negyed = {pattern.totalSeconds.toLocaleString('hu-HU')} másodperc (60 BPM)</p>
    <div className="flex gap-1 mb-4" role="group" aria-label="A ritmusképlet hangjainak időarányos ábrája">
      {pattern.events.map((note,i)=><div key={i}
        aria-label={`${i+1}. hang: ${note.label}, ${note.durationBeats} negyed`}
        style={{flexGrow:note.durationBeats, flexBasis:0}}
        className={`min-w-0 h-20 rounded-md border flex flex-col justify-center items-center text-xs font-semibold transition-colors ${activeEvent===i?'bg-indigo-600 border-indigo-700 text-white':'bg-indigo-100 border-indigo-400 text-indigo-900'}`}>
        <span>{note.label}</span><span className="text-[10px] mt-1">{Math.round(note.durationBeats*100)/100} ♩</span>
      </div>)}
    </div>
    <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
      <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
        <input type="checkbox" checked={metronome} onChange={event=>{stop();setMetronome(event.target.checked);}}
          className="h-4 w-4 accent-indigo-600"/>
        Mérőütés hallható (60 BPM)
      </label>
      <span className="text-xs text-slate-600">Az első ütés hangsúlyosabb.</span>
    </div>
    <div className="flex gap-2 mb-4" role="group" aria-label="Mérőütésjelző">
      {pattern.beats.map((beat,i)=><div key={beat.index} aria-label={(beat.index+1)+'. mérőütés'}
        className={`flex-1 text-center py-2 rounded-lg border font-bold text-xs ${activeBeat===i?'bg-amber-300 text-amber-950 border-amber-500':'bg-slate-50 text-slate-500 border-slate-200'}`}>{beat.index+1}</div>)}
    </div>
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={start} className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm">
        {playing?'Újraindítás':'Ritmusképlet lejátszása'}
      </button>
      {playing&&<button type="button" onClick={stop} className="rounded-lg border border-slate-400 text-slate-900 px-4 py-2 text-sm">Leállítás</button>}
    </div>
    <p role="status" className="mt-3 text-xs text-slate-600">{playing?'A kiemelt mező az éppen megszólaló hangot mutatja.':`A kiválasztott ritmusképlet ${pattern.totalSeconds.toLocaleString('hu-HU')} másodpercig szól, ismétlés nélkül.`}</p>
  </section>;
};
