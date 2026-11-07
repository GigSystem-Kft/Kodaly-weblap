import React,{useState} from 'react';
import { RhythmResearchBookView } from './RhythmResearchBookView';
import {RHYTHM_PROGRAM_ORIGINAL_URL,RHYTHM_RESEARCH_SOURCE} from '../data/rhythmResearchPages';
import {RESEARCH_RHYTHM_GAMES} from '../data/rhythmResearchGames';

/** 13 oldalas, helyben szövegesen kereshető elsődleges forrás és tíz óravázlat. */
export const RhythmResearchPanel:React.FC=()=>{
 const [expandedGame,setExpandedGame]=useState<string|null>(null);
 return <section className="mt-10 mb-12 rounded-3xl border border-indigo-200 bg-indigo-50/30 p-5 md:p-8" aria-label="MTA-SZTE ritmikai fejlesztőprogram – kutatási forrás és játékok">
  <p className="text-xs font-bold uppercase tracking-widest text-indigo-700 mb-2">Új magyar nyelvű forrás · MTA-SZTE</p>
  <h3 className="font-serif-cormorant text-3xl md:text-4xl font-bold text-slate-900 mb-3">Ritmikai fejlesztőprogram – Játékgyűjtemény</h3>
  <p className="text-sm text-slate-700 leading-relaxed mb-3">Az első osztályosoknak készült három hónapos program tíz módszertani játéka és mind a 13 eredeti PDF-oldal szövegrétege külön-külön kereshető. A 10–12. oldalon az eredeti kották képek: a ritmusazonosítók és a táblák címei kereshetők, de a jegyek teljes gépi lejegyzése még nem ellenőrzött.</p>
  <p className="text-xs text-slate-600 mb-4">Forrás: {RHYTHM_RESEARCH_SOURCE}. Az oldalanként megjelenő szöveg a feltöltött PDF szövegrétegéből származik; nem AI által kitalált idézet. A fejlesztési célok nem tekinthetők automatikusan bizonyított kutatási eredménynek.</p>
  <a href={RHYTHM_PROGRAM_ORIGINAL_URL} target="_blank" rel="noopener noreferrer" className="inline-block text-indigo-700 underline text-sm mb-5">Eredeti egyetemi PDF megnyitása (külső forrás) ↗</a>
  <h4 className="text-xl font-bold text-slate-900 mb-3">Játékok, differenciálással és megfigyelési szempontokkal</h4>
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
  <RhythmResearchBookView/>

 </section>;
};
