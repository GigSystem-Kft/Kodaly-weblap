import React,{useState} from 'react';
import { RhythmResearchBookView } from './RhythmResearchBookView';
import {RESEARCH_RHYTHM_GAMES} from '../data/rhythmResearchGames';

/** 13 oldalas, helyben szövegesen kereshető elsődleges forrás és tíz óravázlat. */
export const RhythmResearchPanel:React.FC=()=>{
 const [expandedGame,setExpandedGame]=useState<string|null>(null);
 return <section className="mt-10 mb-12 rounded-3xl border border-indigo-200 bg-indigo-50/30 p-5 md:p-8" aria-label="MTA-SZTE ritmikai fejlesztőprogram – kutatási forrás és játékok">
  <RhythmResearchBookView/>
  <h4 className="text-xl font-bold text-slate-900 mb-3 mt-8">Az eredeti dokumentum tíz játéka – differenciálással és megfigyelési szempontokkal</h4>
  <div className="grid md:grid-cols-2 gap-3 mb-8">
   {RESEARCH_RHYTHM_GAMES.map((g,i)=><article key={g.id} className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
    <button type="button" aria-expanded={expandedGame===g.id} onClick={()=>setExpandedGame(expandedGame===g.id?null:g.id)}
      className="text-left block w-full p-4 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-indigo-500">
      <span className="text-xs text-indigo-700 font-semibold">Játék {i+1} · PDF {g.pages.join('–')}. oldal</span>
      <span className="block font-bold text-slate-900 mt-1">{g.name}</span>
      <span className="block text-xs text-slate-600 mt-1">{g.goal}</span>
    </button>
    {expandedGame===g.id&&<div className="border-t border-slate-200 p-4 space-y-3 text-sm text-slate-700">
      <p><strong>Munkaforma:</strong> {g.grouping} · <strong>Eszközök:</strong> {g.equipment}</p>
      <ol className="list-decimal pl-5 space-y-1">{g.steps.map(x=><li key={x}>{x}</li>)}</ol>
      <p><strong>Variációk:</strong> {g.variations.join(' · ')}</p>
      <p><strong>Megfigyelés:</strong> {g.observation}</p>
      <p><strong>Ritmustáblázat:</strong> {g.relatedPatterns.join(', ')}</p>
      <a href="#rhythm-research-book" className="underline font-semibold text-indigo-700">Eredeti oldalképek megtekintése ({g.pages[0]}. oldal)</a>
    </div>}
   </article>)}
  </div>


 </section>;
};
