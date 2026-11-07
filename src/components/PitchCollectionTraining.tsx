import React, { useEffect, useState } from 'react';
import { Play, Shuffle, Volume2 } from 'lucide-react';
import { createPitchCollectionRound, PITCH_COLLECTIONS, pitchNotes } from '../data/pitchCollections';
import { playEarTrainingMelody, stopEarTrainingInterval } from '../utils/audio';

interface Props { onAddXp: (xp: number) => void; }
type TrainingMode='felismeres'|'parositas';
const getSet=(id:number)=>PITCH_COLLECTIONS.find(item=>item.id===id)!;

export const PitchCollectionTraining: React.FC<Props>=({onAddXp})=>{
  const [mode,setMode]=useState<TrainingMode>('felismeres');
  const [round,setRound]=useState(()=>createPitchCollectionRound());
  const [index,setIndex]=useState(0);
  const [answer,setAnswer]=useState<number|null>(null);
  const [streak,setStreak]=useState(0);
  const [matches,setMatches]=useState<number[]>([]);
  const [selected,setSelected]=useState<number|null>(null);
  const [wrong,setWrong]=useState(false);
  const entry=round[index], challenge=getSet(entry.id);
  const matchEntries=round.slice(0,4);
  const matchOptions=[...matchEntries].sort((a,b)=>((a.id*7)%11)-((b.id*7)%11));
  const reset=(newMode:TrainingMode=mode)=>{
    stopEarTrainingInterval();
    setRound(createPitchCollectionRound(round[round.length-1].id));
    setIndex(0);setAnswer(null);setMatches([]);setSelected(null);setWrong(false);
    setMode(newMode);
  };
  useEffect(()=>()=>stopEarTrainingInterval(),[]);
  const play=(id:number,variantIndex:number)=>{
    const item=getSet(id);
    playEarTrainingMelody(pitchNotes(item,variantIndex));
  };
  const guess=(id:number)=>{
    if(answer!==null)return;
    setAnswer(id);
    if(id===entry.id){setStreak(n=>n+1);onAddXp(25);}
    else setStreak(0);
  };
  const next=()=>{
    stopEarTrainingInterval();
    setAnswer(null);
    if(index===round.length-1){setRound(createPitchCollectionRound(entry.id));setIndex(0);}
    else setIndex(n=>n+1);
  };
  const match=(id:number)=>{
    if(selected===null || matches.includes(selected))return;
    if(id===selected){setMatches(prev=>[...prev,id]);setSelected(null);setWrong(false);onAddXp(15);}
    else setWrong(true);
  };
  return <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900" aria-label="Hangkészletek hallásfeladatai">
    <div className="text-center mb-6">
      <p className="text-xs uppercase font-bold tracking-widest text-indigo-700 mb-2">Hallásfejlesztés · új gyakorlóterület</p>
      <h2 className="text-3xl font-bold mb-3">Hangkészletek felismerése</h2>
      <p className="text-sm text-slate-600">Biton, triton, tetraton, pentaton, bichord, trichord, pentachord és hexachord: nyolcféle hangkészlet, különböző dallammotívumokban.</p>
    </div>
    <div className="flex justify-center flex-wrap gap-2 mb-6">
      <button type="button" aria-pressed={mode==='felismeres'} onClick={()=>reset('felismeres')}
        className={`rounded-xl px-5 py-3 text-sm font-semibold ${mode==='felismeres'?'bg-indigo-700 text-white':'bg-white text-slate-800 border border-slate-300'}`}>Felismerés hallás után</button>
      <button type="button" aria-pressed={mode==='parositas'} onClick={()=>reset('parositas')}
        className={`rounded-xl px-5 py-3 text-sm font-semibold ${mode==='parositas'?'bg-indigo-700 text-white':'bg-white text-slate-800 border border-slate-300'}`}>Hangzó párosítás</button>
    </div>
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-5 sm:p-8">
      {mode==='felismeres'?<>
        <div className="flex justify-between items-center gap-3 mb-6 text-xs font-semibold text-indigo-700">
          <span>Feladat {index+1} / {round.length} · kevert sorrend</span><span>Sorozat: {streak} helyes</span>
        </div>
        <button type="button" onClick={()=>play(entry.id,entry.variantIndex)}
          className="mx-auto rounded-full bg-violet-600 hover:bg-violet-500 w-20 h-20 flex items-center justify-center text-white mb-4"
          aria-label="Dallampélda lejátszása"><Play className="w-9 h-9 fill-white"/></button>
        <p className="text-center text-sm text-slate-600 mb-6">Hallgasd meg, hány különböző hangot használt a dallam, és hogyan viszonyulnak egymáshoz! Újra meghallgathatod.</p>
        <div className="grid grid-cols-2 gap-3">
          {PITCH_COLLECTIONS.map(item=>{
            const correct=answer!==null && item.id===entry.id;
            const incorrect=answer===item.id && item.id!==entry.id;
            return <button type="button" key={item.id} disabled={answer!==null} onClick={()=>guess(item.id)}
              className={`rounded-xl py-3 px-2 text-sm font-semibold border ${correct?'bg-emerald-100 border-emerald-600 text-emerald-900':incorrect?'bg-rose-100 border-rose-500 text-rose-800':'bg-slate-50 hover:bg-indigo-50 border-slate-200'}`}>{item.title}</button>;
          })}
        </div>
        {answer!==null&&<div role="status" className="border-t mt-6 pt-5">
          <p className={`font-bold ${answer===entry.id?'text-emerald-700':'text-rose-700'}`}>{answer===entry.id?'Helyes válasz! +25 XP':`A helyes válasz: ${challenge.title}`}</p>
          <p className="text-sm mt-2"><strong>Szolmizáció:</strong> {challenge.solfege}</p>
          <p className="text-sm text-slate-600 mt-1">{challenge.explanation}</p>
          <button type="button" onClick={next} className="bg-indigo-700 text-white rounded-lg px-5 py-3 mt-4 font-semibold">
            {index===round.length-1?'Új kevert kör':'Következő dallam'}
          </button>
        </div>}
      </>:<>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="font-bold">Párosítsd a dallamot a hangkészletével!</h3>
          <span className="text-indigo-700 text-sm font-semibold">{matches.length} / {matchEntries.length} pár</span>
        </div>
        <p className="text-sm text-slate-600 mb-5">Válassz egy hangzó példát, hallgasd meg, majd kattints a megfelelő fogalomra. Négy pár után új keverést kérhetsz.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Hangzó példák</h4>
            {matchEntries.map((item,i)=><button type="button" key={item.id}
              disabled={matches.includes(item.id)}
              onClick={()=>{setSelected(item.id);setWrong(false);play(item.id,item.variantIndex)}}
              className={`w-full rounded-xl border p-4 flex justify-between items-center text-sm font-semibold ${matches.includes(item.id)?'bg-emerald-50 text-emerald-700 border-emerald-300':selected===item.id?'bg-indigo-100 border-indigo-600':'bg-slate-50 border-slate-200'}`}>
              <span>Dallam {String.fromCharCode(65+i)}</span>
              {matches.includes(item.id)?'✓':<Volume2 className="w-5 h-5"/>}
            </button>)}
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Hangkészletek</h4>
            {matchOptions.map(item=><button type="button" key={item.id}
              disabled={matches.includes(item.id)}
              onClick={()=>match(item.id)}
              className={`w-full rounded-xl border p-4 text-left text-sm font-semibold ${matches.includes(item.id)?'bg-emerald-50 text-emerald-700 border-emerald-300':'bg-slate-50 hover:bg-indigo-50 border-slate-200'}`}>{item.id===selected?'':null}{getSet(item.id).title}{matches.includes(item.id)?' ✓':''}</button>)}
          </div>
        </div>
        {wrong&&<p role="status" className="text-rose-700 mt-3 text-sm">Nem ez a hangkészlet. Hallgasd meg újra, majd próbálj másikat!</p>}
        {matches.length===matchEntries.length&&<p role="status" className="text-emerald-700 font-semibold mt-4">Mind a négy párt megtaláltad!</p>}
        <button type="button" onClick={()=>reset('parositas')} className="mt-5 border border-indigo-400 text-indigo-700 rounded-lg px-4 py-3 text-sm font-semibold flex gap-2 items-center"><Shuffle className="w-4 h-4"/>Új kevert párosítás</button>
      </>}
    </div>
    <p className="text-xs text-slate-500 mt-5">A példák saját, egyszerű gyakorlódallamok; nem a népdalok eredeti dallamai. A tetraton és a pentaton nem feltétlenül kizárólag nem szomszédos hangokból áll; a hangkészletet a különböző hangok száma és hangközviszonyai alapján azonosítjuk.</p>
  </section>;
};
