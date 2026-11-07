import React, {useMemo, useState} from 'react';
import {ArrowLeft, BookOpen, Search, Layers, HelpCircle, Gamepad2, ExternalLink, ChevronLeft, ChevronRight} from 'lucide-react';
import entries from '../data/musicExpressions.json';

export const MUSIC_EXPRESSION_CATEGORIES=[...new Set(entries.map(x=>x.category))].sort((a,b)=>a.localeCompare(b,'hu'));
export const MUSIC_EXPRESSIONS=entries;
const normalize=(text:string)=>text.toLocaleLowerCase('hu-HU').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const PAGE_SIZE=24;

interface Props {
 onBack:()=>void;
 onFlashcards:(category:string)=>void;
 onMatching:(category:string)=>void;
 onQuiz:()=>void;
}
export const MusicExpressionsView:React.FC<Props>=({onBack,onFlashcards,onMatching,onQuiz})=>{
 const [search,setSearch]=useState('');
 const [category,setCategory]=useState('mind');
 const [letter,setLetter]=useState('mind');
 const [page,setPage]=useState(0);
 const [expanded,setExpanded]=useState<string[]>([]);
 const [onlyFavorites,setOnlyFavorites]=useState(false);
 const [favoriteIds,setFavoriteIds]=useState<string[]>([]);
 const letters=[...new Set(entries.map(item=>item.letter))].sort((a,b)=>a.localeCompare(b,'hu'));
 const filtered=useMemo(()=>{
  const terms=normalize(search.trim()).split(/\s+/).filter(Boolean);
  return entries.filter(item=>
   (category==='mind'||item.category===category) &&
   (letter==='mind'||item.letter===letter) &&
   (!onlyFavorites||favoriteIds.includes(item.id)) &&
   terms.every(term=>normalize(item.term+' '+item.definition+' '+item.category).includes(term))
  );
 },[search,category,letter,onlyFavorites,favoriteIds]);
 const maxPage=Math.max(0,Math.ceil(filtered.length/PAGE_SIZE)-1);
 const currentPage=Math.min(page,maxPage);
 const shown=filtered.slice(currentPage*PAGE_SIZE,(currentPage+1)*PAGE_SIZE);
 const filter=(kind:'category'|'letter'|'search',value:string)=>{
  if(kind==='category')setCategory(value);
  if(kind==='letter')setLetter(value);
  if(kind==='search')setSearch(value);
  setPage(0);
 };
 return <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 text-slate-900">
  <button type="button" onClick={onBack} className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:border-indigo-400"><ArrowLeft size={16}/> Vissza a tananyaghoz</button>
  <header className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-9 mb-7">
   <p className="text-xs font-bold uppercase tracking-widest text-indigo-700 mb-2">09. fejezet · kereshető fogalomtár</p>
   <h2 className="font-serif-cormorant text-4xl md:text-6xl font-semibold mb-3">Zenei kifejezések</h2>
   <p className="text-sm md:text-base text-slate-700 max-w-3xl leading-relaxed">
    A mellékelt magyar nyelvű zenei szakkifejezés-gyűjtemény teljes, betűrendben rendezett feldolgozása. Az idegen nyelvű előadási utasítások mellett hangszeres, ritmikai, formai és zenetörténeti fogalmakat is kereshetsz.
   </p>
   <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-4">
     Forrás: a szerző által mellékelt szótár, eredeti meghatározásokkal. Régi vagy pontatlan szóhasználat is előfordulhat; a Tanársegéd a szakmailag ellenőrzött tananyagokkal összevetve értelmezi. A kategóriák kulcsszavas, tanulást segítő csoportosítások.
   </p>
   <div className="grid sm:grid-cols-3 gap-3 mt-6">
     <button type="button" onClick={()=>onFlashcards('Zenei kifejezések – '+(category==='mind'?'Tempó és időkezelés':category))}
       className="rounded-xl bg-indigo-700 text-white font-semibold p-4 flex items-center justify-center gap-2 hover:bg-indigo-800"><Layers size={18}/> {category==='mind'?'Szókártyák':'Szókártyák · '+category}</button>
     <button type="button" onClick={()=>onMatching('Zenei kifejezések – '+(category==='mind'?'Tempó és időkezelés':category))}
       className="rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-800 font-semibold p-4 flex items-center justify-center gap-2 hover:bg-indigo-100"><Gamepad2 size={18}/> {category==='mind'?'Párosító játék':'Párosító · '+category}</button>
     <button type="button" onClick={onQuiz} className="rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold p-4 flex items-center justify-center gap-2 hover:bg-slate-50"><HelpCircle size={18}/> Tudáspróba</button>
   </div>
  </header>
  <section aria-label="Zenei kifejezések keresése" className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6">
   <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
     <h3 className="font-bold flex items-center gap-2"><BookOpen size={18} className="text-indigo-700"/> Kifejezésjegyzék</h3>
     <p className="text-xs font-semibold text-indigo-700">{filtered.length} találat / {entries.length} kifejezés · {MUSIC_EXPRESSION_CATEGORIES.length} kategória</p>
   </div>
   <div className="grid md:grid-cols-[2fr_1fr] gap-3">
     <label className="block"><span className="sr-only">Keresés kifejezésre vagy meghatározásra</span>
       <div className="flex items-center gap-2 border border-slate-300 rounded-xl px-3 bg-white"><Search size={18} className="text-slate-500"/>
       <input className="w-full py-3 text-sm bg-transparent focus:outline-none" placeholder="Pl. adagio, szinkópa, vonó, harmónia…" value={search} onChange={e=>filter('search',e.target.value)} /></div>
     </label>
     <label className="block"><span className="sr-only">Kategória</span>
      <select className="w-full rounded-xl border border-slate-300 p-3 text-sm bg-white" value={category} onChange={e=>filter('category',e.target.value)}>
       <option value="mind">Minden kategória</option>{MUSIC_EXPRESSION_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
      </select>
     </label>
   </div>
   <div className="flex flex-wrap gap-1.5 mt-4" aria-label="Betűrendes szűrő">
     <button type="button" className={`px-3 py-2 rounded-lg text-xs font-semibold ${letter==='mind'?'bg-indigo-700 text-white':'bg-slate-100 hover:bg-slate-200'}`} onClick={()=>filter('letter','mind')}>Mind</button>
     {letters.map(l=><button type="button" key={l} aria-pressed={letter===l} className={`px-3 py-2 rounded-lg text-xs font-semibold ${letter===l?'bg-indigo-700 text-white':'bg-slate-100 hover:bg-slate-200'}`} onClick={()=>filter('letter',l)}>{l}</button>)}
   </div>
   <label className="flex items-center gap-2 mt-4 text-sm text-slate-700"><input type="checkbox" checked={onlyFavorites} onChange={e=>{setOnlyFavorites(e.target.checked);setPage(0);}}/> Csak a megjelölt kedvencek ({favoriteIds.length})</label>
   {filtered.length===0?<p className="p-8 text-center text-slate-500">Nincs találat. Próbálj másik kifejezést vagy kategóriát.</p>:<>
   <div className="grid md:grid-cols-2 gap-3 mt-5">
    {shown.map(item=>{
      const open=expanded.includes(item.id);const favorite=favoriteIds.includes(item.id);
      return <article key={item.id} className="rounded-xl bg-slate-50 border border-slate-200 p-4">
       <div className="flex items-start gap-2 justify-between">
        <button type="button" aria-expanded={open} onClick={()=>setExpanded(list=>open?list.filter(id=>id!==item.id):[...list,item.id])}
          className="text-left flex-1"><strong className="text-base text-slate-900">{item.term}</strong>
          <span className="block mt-1 text-xs text-indigo-700">{item.category}</span></button>
        <button type="button" aria-label={favorite?'Kedvenc eltávolítása':'Kedvencekhez adás'} aria-pressed={favorite} onClick={()=>setFavoriteIds(prev=>favorite?prev.filter(id=>id!==item.id):[...prev,item.id])}
          className={`rounded-lg px-3 py-2 text-lg ${favorite?'text-amber-600 bg-amber-50':'text-slate-400 bg-white'}`}>★</button>
       </div>
       <p className={`text-sm mt-3 leading-relaxed text-slate-700 ${open?'':'line-clamp-3'}`}>{item.definition}</p>
       {item.definition.length>140&&<button type="button" onClick={()=>setExpanded(list=>open?list.filter(id=>id!==item.id):[...list,item.id])} className="text-indigo-700 text-xs font-semibold underline mt-2">{open?'Rövidebb nézet':'Teljes magyarázat'}</button>}
       <p className="text-[11px] text-slate-500 mt-3">Forrás: Zenei kifejezések, {item.letter} betű · eredeti {item.line}. sor</p>
      </article>;
    })}
   </div>
   <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t">
    <button type="button" disabled={currentPage===0} onClick={()=>setPage(x=>Math.max(0,x-1))} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-30 inline-flex items-center gap-1"><ChevronLeft size={15}/> Előző</button>
    <span className="text-xs text-slate-600">{currentPage+1} / {maxPage+1}. oldal</span>
    <button type="button" disabled={currentPage===maxPage} onClick={()=>setPage(x=>Math.min(maxPage,x+1))} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-30 inline-flex items-center gap-1">Következő <ChevronRight size={15}/></button>
   </div></>}
  </section>
 </div>;
};
