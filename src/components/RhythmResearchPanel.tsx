import React,{useMemo,useState} from 'react';
import {RHYTHM_RESEARCH_PAGES,RHYTHM_PROGRAM_ORIGINAL_URL,RHYTHM_RESEARCH_SOURCE} from '../data/rhythmResearchPages';
import {RESEARCH_RHYTHM_GAMES} from '../data/rhythmResearchGames';

/** 13 oldalas, helyben szövegesen kereshető elsődleges forrás és tíz óravázlat. */
export const RhythmResearchPanel:React.FC=()=>{
 const [query,setQuery]=useState('');
 const [current,setCurrent]=useState(5);
 const [expandedGame,setExpandedGame]=useState<string|null>(null);
 const results=useMemo(()=>{
  const q=query.trim().toLocaleLowerCase('hu-HU');
  if(!q)return RHYTHM_RESEARCH_PAGES;
  return RHYTHM_RESEARCH_PAGES.filter(p=>
    [p.page.toString(),p.title,p.text,p.figureDescription??''].join(' ').toLocaleLowerCase('hu-HU').includes(q));
 },[query]);
 const page=RHYTHM_RESEARCH_PAGES.find(p=>p.page===current)??RHYTHM_RESEARCH_PAGES[0];
 return <section className="mt-10 mb-12 rounded-3xl border border-indigo-200 bg-indigo-50/30 p-5 md:p-8" aria-label="MTA-SZTE ritmikai fejlesztőprogram – kutatási forrás és játékok">
  <p className="text-xs font-bold uppercase tracking-widest text-indigo-700 mb-2">Új magyar nyelvű forrás · MTA-SZTE</p>
  <h3 className="font-serif-cormorant text-3xl md:text-4xl font-bold text-slate-900 mb-3">Ritmikai fejlesztőprogram – Játékgyűjtemény</h3>
  <p className="text-sm text-slate-700 leading-relaxed mb-3">Az első osztályosoknak készült három hónapos program tíz módszertani játéka és mind a 13 eredeti PDF-oldal szövegrétege külön-külön kereshető. A 10–12. oldalon az eredeti kották képek: a ritmusazonosítók és a táblák címei kereshetők, de a jegyek teljes gépi lejegyzése még nem ellenőrzött.</p>
  <p className="text-xs text-slate-600 mb-4">Forrás: {RHYTHM_RESEARCH_SOURCE}. Az oldalanként megjelenő szöveg a feltöltött PDF szövegrétegéből származik; nem AI által kitalált idézet. A fejlesztési célok nem tekinthetők automatikusan bizonyított kutatási eredménynek.</p>
  <a href={RHYTHM_RESEARCH_ORIGINAL_URL} target="_blank" rel="noopener noreferrer" className="inline-block text-indigo-700 underline text-sm mb-5">Eredeti egyetemi PDF megnyitása (külső forrás) ↗</a>
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
      <button type="button" onClick={()=>setCurrent(g.pages[0])} className="underline font-semibold text-indigo-700">Forrásoldal megjelenítése ({g.pages[0]}. oldal)</button>
    </div>}
   </article>)}
  </div>
  <div className="rounded-2xl border border-indigo-200 bg-white p-4 md:p-6" aria-label="Tizenhárom oldal teljes szöveges keresője">
   <h4 className="font-semibold text-xl mb-2">A dokumentum mind a 13 oldala – szöveges kereső</h4>
   <label htmlFor="research-rhythm-search" className="text-xs text-slate-700 block mb-2">Keress játékra, fogalomra, azonosítóra vagy oldalszámra</label>
   <input id="research-rhythm-search" type="search" value={query} onChange={e=>setQuery(e.target.value)}
      placeholder="pl. Ritmustelefon, 2.18, nyolcadfordulós, osztinátó"
      className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 mb-3 focus:ring-indigo-500"/>
   <p className="text-xs text-slate-500 mb-2">{results.length} / {RHYTHM_RESEARCH_PAGES.length} oldal találat</p>
   <div className="flex flex-wrap gap-1 mb-5" aria-label="Találati oldalak">
    {results.map(p=><button type="button" key={p.page} onClick={()=>setCurrent(p.page)}
      aria-pressed={current===p.page} className={`rounded-md border px-3 py-2 text-xs font-semibold ${current===p.page?'bg-indigo-700 text-white border-indigo-700':'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50'}`}>{p.page}. o.</button>)}
    {results.length===0&&<p className="text-sm text-slate-600">Nincs találat a dokumentum kinyert szövegében.</p>}
   </div>
   <h5 className="text-lg font-bold text-slate-900">{page.page}. oldal · {page.title}</h5>
   <div className="mt-3 whitespace-pre-wrap break-words max-h-[33rem] overflow-y-auto p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-800 leading-relaxed">{page.text}</div>
   {page.figureDescription&&<div className="mt-4 p-3 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-950">
      <strong>Kottaképi tárgymutató:</strong> {page.figureDescription}
      <p className="mt-2">Az eredeti ritmusjegyek a PDF kottaképein láthatók; ez a szöveges katalógus nem állítja, hogy az egyes jegyeket automatikusan és hibátlanul átírta.</p>
   </div>}
   <p className="text-xs text-slate-600 mt-3">Az AI is ugyanazt az oldalszámozott szöveganyagot keresheti a Tanársegédben. Oldalmegjelölést kérhetsz a válaszban.</p>
  </div>
 </section>;
};
