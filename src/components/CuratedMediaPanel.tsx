import React, { useMemo, useState } from 'react';
import { CURATED_MEDIA } from '../data/curatedMusicMedia';
import { ImageIcon, ExternalLink, Play, X } from 'lucide-react';

export const CuratedMediaPanel:React.FC<{chapterNumber:number;compact?:boolean}>=({chapterNumber,compact=false})=>{
 const [zoom,setZoom]=useState<{src:string;title:string}|null>(null);
 const [hidden,setHidden]=useState<string[]>([]);
 const items=useMemo(()=>CURATED_MEDIA.filter(item=>item.chapters.includes(chapterNumber)),[chapterNumber]);
 if(!items.length)return null;
 const images=items.filter(item=>item.kind==='kep');
 const videos=items.filter(item=>item.kind==='video');
 return <section aria-label="Szemléltető képek és oktatóvideók" className="mt-8 border border-slate-200 rounded-2xl p-5 md:p-7 bg-white">
  <h3 className="font-serif-cormorant text-2xl font-semibold text-slate-900 mb-2">Szemléltető képek és videóforrások</h3>
  <p className="text-sm text-slate-600 mb-5">
   Az ábrák és a videógyűjtemények pontos forrásmegjelöléssel érhetők el.
   A képre kattintva nagyíthatod; a videókat jogszerűen a forrásoldalon nyithatod meg.
   A képek egy része eredeti, angol vagy latin feliratozású történeti forrás, magyar magyarázattal.
  </p>
  {images.length>0&&<div className={`grid grid-cols-1 sm:grid-cols-2 ${compact?'lg:grid-cols-3':'lg:grid-cols-3'} gap-4 mb-6`}>
   {images.map(item=><figure key={item.id} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
    {item.imageUrl && !hidden.includes(item.id)
     ? <button type="button" onClick={()=>setZoom({src:item.imageUrl!,title:item.title})}
        title="Kép nagyítása" className="block w-full bg-white p-2">
        <img loading="lazy" src={item.imageUrl} alt={item.title}
         onError={()=>setHidden(current=>[...current,item.id])}
         className="w-full h-44 object-contain cursor-zoom-in"/>
       </button>
     : <div className="h-28 flex items-center justify-center text-slate-400"><ImageIcon className="w-8 h-8"/></div>}
    <figcaption className="p-3">
     <p className="font-semibold text-sm text-slate-900 mb-1">{item.title}</p>
     <p className="text-xs leading-relaxed text-slate-600 mb-2">{item.note}</p>
     <a href={item.url} target="_blank" rel="noreferrer noopener" className="inline-flex gap-1 items-center text-xs font-semibold text-indigo-600 hover:underline">
      Forrás és felhasználási feltételek <ExternalLink className="w-3 h-3"/>
     </a>
     {item.license&&<p className="text-[11px] text-slate-500 mt-1">{item.license}</p>}
    </figcaption>
   </figure>)}
  </div>}
  {videos.length>0&&<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
   {videos.map(item=><a href={item.url} key={item.id} target="_blank" rel="noreferrer noopener"
      className="flex items-start gap-3 border border-indigo-100 bg-indigo-50/30 rounded-xl p-4 hover:border-indigo-400">
     <span className="rounded-lg bg-indigo-100 p-2 text-indigo-700"><Play className="w-5 h-5"/></span>
     <span className="flex-1">
      <strong className="block text-sm text-slate-900 mb-1">{item.title} ↗</strong>
      <span className="block text-xs text-slate-600 leading-relaxed">{item.note}</span>
      {item.access&&<span className="block text-xs text-amber-800 mt-2">{item.access}</span>}
     </span>
    </a>)}
  </div>}
  {zoom&&<div role="dialog" aria-modal="true" aria-label={zoom.title} onClick={()=>setZoom(null)}
   className="fixed inset-0 z-[110] bg-black/85 flex flex-col items-center justify-center p-4">
   <button type="button" className="self-end rounded-lg bg-white text-slate-900 px-3 py-2 mb-3 flex items-center gap-2"
    onClick={()=>setZoom(null)}><X className="w-4 h-4"/>Bezárás</button>
   <img src={zoom.src} alt={zoom.title} className="max-w-full max-h-[82vh] object-contain bg-white rounded-lg"
    onClick={event=>event.stopPropagation()}/>
   <p className="text-white text-xs mt-3">{zoom.title}</p>
  </div>}
 </section>;
};
