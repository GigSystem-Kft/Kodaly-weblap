import { apiFetch } from '../api';
import React,{useEffect,useState} from 'react';
type Item={source:string;chunks:number;characters:number;kind:string};
type LiveCoverage={generatedIndexPresent:boolean;licensedBookIndexPresent:boolean;chapters:Record<string,number>;mediaMetadataChunks:number;verifiedGlossaryChunks:number};
type LiveStatus={mode:string;knowledge:{indexedChunks:number;indexedSources:number;lessonChunks:number;coverage:LiveCoverage}};
type Report={indexChunks:number;indexedCharacters:number;sources:Item[];omitted:{file:string;reason:string}[];missing:string[];limitations:string[]};
export const KnowledgeCoveragePanel:React.FC=()=>{
 const [open,setOpen]=useState(false);
 const [report,setReport]=useState<Report|null>(null);
 const [live,setLive]=useState<LiveStatus|null>(null);
 const [liveError,setLiveError]=useState('');
 const [error,setError]=useState('');
 useEffect(()=>{
  if(!open)return;
  if(!live && !liveError) apiFetch('/api/chat/status').then(async r=>{if(!r.ok)throw new Error('Az élő PHP-index nem érhető el.');return r.json();})
    .then((data:LiveStatus)=>setLive(data)).catch((e:unknown)=>setLiveError(e instanceof Error?e.message:'Élő indexhiba'));
  if(report || error)return;
  fetch('/source-inventory.json',{cache:'no-store'}).then(async r=>{if(!r.ok)throw new Error('A forráslista nem érhető el.');return r.json();})
   .then((data:Report)=>setReport(data)).catch((e:unknown)=>setError(e instanceof Error?e.message:'Forráslista lekérési hiba'));
 },[open,report,error,live,liveError]);
 return <section className="border-b border-slate-700/50 bg-slate-900 text-slate-200">
  <button type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open}
   className="w-full text-left text-xs text-indigo-200 hover:text-white px-4 py-2 underline">
   {open?'Forráslefedettség bezárása':'Forráslefedettség ellenőrzése – indexelt dokumentumok, hiányok'}
  </button>
  {open&&<div className="max-h-60 overflow-auto p-4 border-t border-slate-700 text-xs space-y-3">
   {error&&<p role="alert" className="text-amber-300">{error}</p>}
   {!report&&!error&&<p>Indexállapot lekérése…</p>}
   {live&&<div className="rounded-lg border border-emerald-700/50 p-3 space-y-2">
     <p className="font-bold text-emerald-300">Élő, telepített PHP tudásbázis</p>
     <p>{live.knowledge.indexedChunks} részlet · {live.knowledge.indexedSources} forrás · működési mód: {live.mode}</p>
     <p>Fejezetenkénti találatok: {Object.entries(live.knowledge.coverage.chapters).map(([chapter,count])=>`${chapter}: ${count}`).join(' · ')}</p>
     <p>{live.knowledge.coverage.generatedIndexPresent?'Generált PHP-index elérhető':'Generált PHP-index hiányzik'} · {live.knowledge.coverage.licensedBookIndexPresent?'Külön pedagógiai index elérhető':'Külön pedagógiai index nem érhető el'}</p>
    </div>}
   {liveError&&<p role="alert" className="text-amber-300">{liveError} Az alábbi buildleltár ettől független.</p>}
   {report&&<>
    <p className="font-bold text-indigo-200">Fordításkor készült statikus forrásleltár – nem azonos a telepített indexszel.</p>
    <p><strong>{report.indexChunks} indexelt részlet · {report.indexedCharacters.toLocaleString('hu-HU')} karakter</strong></p>
    <p>A statikus leltár a fordításkor előkészített forrásokat méri, nem bizonyítja, hogy minden állomány a szerveren is elérhető.</p>
    <div className="space-y-2">
     {report.sources.map(item=><div key={item.source} className="border-b border-slate-700 pb-1">
      <strong className="block break-all">{item.source}</strong>
      <span className="text-slate-400">{item.chunks} részlet · {item.characters.toLocaleString('hu-HU')} karakter · {item.kind}</span>
     </div>)}
    </div>
    <p className={report.missing.length?'text-amber-300':'text-emerald-300'}>{report.missing.length?'Hiányzó várt fájlok: '+report.missing.join(', '):'Az előírt alapdokumentumok megvannak.'}</p>
    <h5 className="font-bold">Szándékosan kizárt források</h5>
    {report.omitted.map(x=><p key={x.file}>{x.file}: {x.reason}</p>)}
    <h5 className="font-bold">Korlátok</h5>
    <ul className="list-disc pl-4 space-y-1">{report.limitations.map(x=><li key={x}>{x}</li>)}</ul>
   </>}
  </div>}
 </section>;
};
