import React,{useEffect,useRef,useState} from 'react';
import { BookOpen, Headphones, ExternalLink, Play, StopCircle, Music2 } from 'lucide-react';
import {HISTORY_NOTE_INSIGHTS,HISTORY_TEXTBOOK_LINKS,HISTORY_VISUALS,HISTORY_RESOURCES,HISTORY_NOTE_SOURCE} from '../data/musicHistorySupplement';

const patterns:Record<string,{caption:string; notes:number[];duration:number;instrument:OscillatorType;description:string}>={
 kezdetek:{caption:'Ötfokú, saját dallamvázlat',notes:[60,62,64,67,69,67,64,62,60],duration:.55,instrument:'sine',description:'Pentaton hangkészlet; nem ókori eredeti zenemű vagy fennmaradt dallam.'},
 kozepkor:{caption:'Egyszólamú modális mozgás – saját modell',notes:[62,64,65,67,69,67,65,64,62],duration:.65,instrument:'triangle',description:'A monódia szemléltetése, nem gregorián énekrekonstrukció.'},
 reneszansz:{caption:'Imitációs belépések – saját modell',notes:[60,62,64,67,60,62,64,67],duration:.42,instrument:'sine',description:'Két szólamhoz kapcsolható motívum; oktatási szemléltetés, nem történeti mű.'},
 barokk:{caption:'Szekvenciális mozgás – saját modell',notes:[60,64,67,64,62,65,69,65,64,67,71,67],duration:.31,instrument:'triangle',description:'Ismételt motívum új magassági szinten; nem Vivaldi- vagy Bach-idézet.'},
 klasszika:{caption:'Kérdés–felelet tagolás – saját modell',notes:[60,62,64,65,67,65,64,62,60],duration:.43,instrument:'sine',description:'Arányos, lezáruló dallamfordulat; nem Haydn-, Mozart- vagy Beethoven-mű.'},
 romantika:{caption:'Lírai dallamív – saját modell',notes:[60,64,67,71,72,69,67,64,60],duration:.56,instrument:'triangle',description:'Dallamív és kontraszt: saját szemléltető motívum.'},
 huszadik:{caption:'Szokatlan hangsúlyú dallam – saját modell',notes:[60,63,67,66,62,68,65,60],duration:.32,instrument:'sawtooth',description:'Kromatikus hangzás és ritmikus eltolódás; nem Bartók- vagy Kodály-mű.'}
};
let globalPlayer:AudioContext|null=null;
function stopPlaying(){if(globalPlayer){void globalPlayer.close().catch(()=>{});globalPlayer=null;}}
function beginPattern(periodId:string){
 stopPlaying();
 const pattern=patterns[periodId];if(!pattern)return;
 const context=new AudioContext();globalPlayer=context;
 const start=context.currentTime+.07;const halfLife=periodId==='romantika'?.9:.72;
 pattern.notes.forEach((pitch,i)=>{
  const osc=context.createOscillator();const gain=context.createGain();
  osc.type=pattern.instrument;osc.frequency.value=440*Math.pow(2,(pitch-69)/12);
  const when=start+i*pattern.duration;const dur=pattern.duration*halfLife;
  gain.gain.setValueAtTime(.0001,when);
  gain.gain.exponentialRampToValueAtTime(pattern.instrument==='sawtooth'?.065:.14,when+.025);
  gain.gain.exponentialRampToValueAtTime(.0001,when+dur);
  osc.connect(gain);gain.connect(context.destination);osc.start(when);osc.stop(when+dur+.02);
 });
 const stopAfter=start+pattern.notes.length*pattern.duration+.15;
 const last=context.createOscillator();last.type='sine';last.frequency.value=1;
 const zero=context.createGain();zero.gain.value=0;last.connect(zero);zero.connect(context.destination);
 last.start(stopAfter);last.stop(stopAfter+.01);last.onended=()=>{if(globalPlayer===context)stopPlaying();};
}
export const HistorySupplementSection:React.FC<{periodId:string;search?:string}>=({periodId,search=''})=>{
 const [active,setActive]=useState(false);const [answers,setAnswers]=useState<string[]>([]);
 const [hiddenImages,setHiddenImages]=useState<string[]>([]);
 const pattern=patterns[periodId];const insights=HISTORY_NOTE_INSIGHTS.filter(p=>p.periodId===periodId);
 const books=HISTORY_TEXTBOOK_LINKS.filter(p=>p.periodId===periodId);
 const visuals=HISTORY_VISUALS.filter(p=>p.periodId===periodId);
 const resources=HISTORY_RESOURCES.filter(p=>p.periodId===periodId);
 const activeRef=useRef(false);
 useEffect(()=>()=>{activeRef.current=false;stopPlaying();},[]);
 useEffect(()=>{setActive(false);activeRef.current=false;stopPlaying();setAnswers([]);},[periodId]);
 const selected=search.trim().toLocaleLowerCase('hu-HU');
 const show=(value:string)=>!selected||value.toLocaleLowerCase('hu-HU').includes(selected)||insights.some(i=>i.explanation.toLocaleLowerCase('hu-HU').includes(selected));
 return <div className="mt-9 border-t border-indigo-100 pt-7" aria-label="Jegyzet, általános iskolai tankönyvek és történeti hangzó anyagok">
  <div className="mb-6">
   <p className="text-xs font-semibold tracking-wide text-indigo-700 uppercase mb-2">Új · Saját jegyzet + Ének-zene 1–4.</p>
   <h4 className="font-serif-cormorant text-2xl md:text-3xl font-semibold">Történeti felfedezőműhely</h4>
   <p className="text-sm text-slate-700 mt-2">További magyarázatok, évfolyamhoz kötött művek, múzeumi képek és források. A történeti állításoknál jelezzük, ha a jegyzetet mai ismeretekkel pontosítani kell.</p>
  </div>
  {pattern&&<section className="mb-7 rounded-2xl bg-indigo-50 border border-indigo-200 p-4 md:p-5">
   <div className="flex flex-wrap items-center gap-3">
    <Headphones className="text-indigo-700" size={25}/>
    <div className="flex-1"><h5 className="font-semibold text-slate-900">{pattern.caption}</h5>
      <p className="text-xs text-slate-600 mt-1">{pattern.description}</p></div>
    <button type="button" className="flex gap-2 items-center bg-indigo-700 rounded-lg px-4 py-3 text-white text-sm font-bold hover:bg-indigo-800"
      onClick={()=>{if(active){stopPlaying();setActive(false);}else{beginPattern(periodId);setActive(true);}}}>
      {active?<StopCircle size={17}/>:<Play size={17}/>} {active?'Leállítás':'Hangzó szemléltetés'}
    </button>
   </div>
   <p className="text-[11px] text-slate-600 mt-3">Saját készítésű, egyszerű hanggenerált zenei modell, nem történeti hangfelvétel és nem egy zeneszerző konkrét műve.</p>
  </section>}
  <div className="space-y-4 mb-8">
   {insights.map(item=><article key={item.title} className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
    <span className="text-xs font-semibold text-indigo-700">{HISTORY_NOTE_SOURCE} · PDF {item.pages.join('–')}. oldal</span>
    <h5 className="text-lg font-bold text-slate-900 mt-1 mb-2">{item.title}</h5>
    <p className="text-sm leading-relaxed text-slate-700">{item.explanation}</p>
    {item.caution&&<p className="mt-3 border-l-4 border-amber-400 bg-amber-50 p-3 text-xs text-amber-950"><strong>Forráskritikai megjegyzés:</strong> {item.caution}</p>}
    <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
      <p className="font-bold text-indigo-900 mb-2">Hallgatási szempontok</p>
      <ul className="list-disc pl-5 space-y-1 text-slate-700">{item.listenFor.map(t=><li key={t}>{t}</li>)}</ul>
      <p className="mt-3 font-semibold text-slate-900"><Music2 className="inline-block mr-1" size={16}/> {item.task}</p>
      <button type="button" aria-expanded={answers.includes(item.title)} onClick={()=>setAnswers(x=>x.includes(item.title)?x.filter(a=>a!==item.title):[...x,item.title])}
       className="mt-3 text-indigo-700 font-semibold text-xs underline">Mintaválasz {answers.includes(item.title)?'elrejtése':'megnyitása'}</button>
      {answers.includes(item.title)&&<p className="mt-2 text-sm text-slate-700">{item.sampleAnswer}</p>}
    </div>
   </article>)}
  </div>
  {books.length>0&&<section className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
   <h5 className="text-xl font-bold flex gap-2 items-center mb-3"><BookOpen size={20} className="text-indigo-700"/>Kapcsolódó Ének-zene tankönyvi oldalak</h5>
   <p className="text-xs text-slate-600 mb-4">A PDF feldolgozott szövegében ellenőrzött műcímek és oldalszámok. A kotta és az eredeti tankönyvoldal a 07. Tankönyvek menüben tekinthető meg.</p>
   <div className="grid md:grid-cols-2 gap-3">
    {books.filter(b=>show(b.work+' '+b.focus)).map(b=><article key={b.grade+'-'+b.page+'-'+b.work} className="rounded-lg bg-indigo-50/40 border border-indigo-100 p-3">
     <p className="text-xs text-indigo-700 font-semibold mb-1">{b.grade}. osztály · {b.page}. PDF-oldal</p>
     <h6 className="font-bold text-sm mb-1">{b.work}</h6>
     <p className="text-sm text-slate-700"><strong>Figyeld:</strong> {b.focus}</p>
     <p className="text-xs text-slate-600 mt-2"><strong>Feladat:</strong> {b.activity}</p>
    </article>)}
   </div>
  </section>}
  {visuals.length>0&&<section className="mb-7">
   <h5 className="text-xl font-bold mb-3">Eredeti történeti képek, hangszerek és kották</h5>
   <div className="grid md:grid-cols-2 gap-4">
    {visuals.map(v=><figure key={v.title} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
      {!hiddenImages.includes(v.title)&&<a href={v.sourceUrl} target="_blank" rel="noopener noreferrer">
       <img src={v.imageUrl} alt={v.title} loading="lazy" className="w-full h-48 object-contain bg-white"
        onError={()=>setHiddenImages(x=>[...x,v.title])}/>
      </a>}
      <figcaption className="p-3">
        <strong className="block text-sm">{v.title}</strong><p className="text-xs mt-1 text-slate-700">{v.caption}</p>
        <p className="text-[11px] text-slate-600 mt-2">{v.licenseNote}</p>
        <a href={v.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-indigo-700 underline inline-flex items-center gap-1 mt-2">Eredeti kép és licenc <ExternalLink size={12}/></a>
      </figcaption>
     </figure>)}
   </div>
  </section>}
  {resources.length>0&&<section className="mb-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 p-4 md:p-5">
   <h5 className="text-xl font-bold mb-3">Megnyitható hangfelvételek, videók és források</h5>
   <div className="grid md:grid-cols-2 gap-3">
    {resources.map(v=><article key={v.title} className="bg-white rounded-lg border border-indigo-100 p-3">
      {v.kind==='video'&&v.url.includes('youtube.com/watch?v=5a9aUN7JPSM')&&<div className="mb-3 aspect-video bg-slate-950 rounded-md overflow-hidden">
       <iframe title={v.title} loading="lazy" src="https://www.youtube-nocookie.com/embed/5a9aUN7JPSM"
        className="w-full h-full border-0" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
      </div>}
      <a href={v.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm text-indigo-700 underline inline-flex items-center gap-1">{v.title}<ExternalLink size={12}/></a>
      <p className="text-xs text-slate-700 mt-2">{v.focus}</p>
      {v.availabilityNote&&<p className="text-[11px] text-amber-800 mt-2">{v.availabilityNote}</p>}
     </article>)}
   </div>
  </section>}
 </div>;
};
