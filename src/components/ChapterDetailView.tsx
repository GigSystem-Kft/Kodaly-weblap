import React, { useState } from 'react';
import { Chapter } from '../types';
import { LESSON_ILLUSTRATIONS } from '../data/lessonIllustrations';
import { getFoundationsSubchapterGuide } from '../data/musicFoundationsSubchapters';
import { ImageLightbox } from './ImageLightbox';
import { ArrowLeft, Play, CheckCircle, HelpCircle, BookOpen, Volume2, Quote } from 'lucide-react';
import { playNote, playChord } from '../utils/audio';

interface ChapterDetailViewProps {
  chapter: Chapter;
  onBack: () => void;
  onOpenQuiz: (chapterId: string) => void;
  onCompleteChapter: (chapterId: string) => void;
  isCompleted: boolean;
}

export const ChapterDetailView: React.FC<ChapterDetailViewProps> = ({
  chapter,
  onBack,
  onOpenQuiz,
  onCompleteChapter,
  isCompleted
}) => {
  const [activeSubId, setActiveSubId] = useState<string>(chapter.subchapters[0]?.id || '');
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<string[]>([]);

  const currentSub = chapter.subchapters.find((s) => s.id === activeSubId) || chapter.subchapters[0];
  const illustrations = LESSON_ILLUSTRATIONS[currentSub.id] ?? [];
  const guide = getFoundationsSubchapterGuide(chapter.id, currentSub.id);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-10 text-[#1c1c1c]">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium transition-all border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Vissza a fejezetekhez</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onOpenQuiz(chapter.id)}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/30"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Fejezet Kvíz Indítása</span>
          </button>
          {!isCompleted ? (
            <button
              onClick={() => onCompleteChapter(chapter.id)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all shadow-lg shadow-emerald-600/30"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Fejezet Teljesítése</span>
            </button>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-500/30 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Teljesítve</span>
            </span>
          )}
        </div>
      </div>

      {/* Chapter Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <span className="text-xs font-bold text-[#4a54e1]">0{chapter.number}. FEJEZET</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-3">{chapter.title}</h2>
        <p className="text-slate-700 text-base leading-relaxed">{chapter.description}</p>
      </div>

      {/* Main layout: Subchapter tabs + content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar subchapters */}
        <div className="lg:col-span-1 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 px-3 mb-3">
            Alfejezetek
          </h4>
          {chapter.subchapters.map((sub, idx) => {
            const isActive = sub.id === activeSubId;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubId(sub.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-start space-x-3 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-50 text-[#4a54e1]'
                }`}>
                  {idx + 1}
                </span>
                <span className="flex-1 leading-snug">{sub.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{currentSub.title}</h3>
            <p className="text-[#4a54e1] font-medium text-sm mb-6 pb-4 border-b border-slate-200">
              {currentSub.summary}
            </p>

            {/* Content paragraphs / bullets */}
            <div className="space-y-4 mb-8">
              {currentSub.content.map((paragraph, i) => (
                <div key={i} className="flex items-start space-x-3 text-slate-700 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
                  <p>{paragraph}</p>
                </div>
              ))}
            </div>

            {guide && <section className="pt-6 mb-8 border-t border-slate-200" aria-label="Egységes tanulási felépítés">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4a54e1] mb-3">Tanulási célok</p>
                <ul className="space-y-2">
                  {guide.objectives.map(goal => <li key={goal} className="flex gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"/>{goal}
                  </li>)}
                </ul>
              </div>
              <div className="mb-7 space-y-6">
                <h4 className="font-serif-cormorant text-2xl font-semibold">Részletes magyarázat – az alfejezethez</h4>
                {guide.sections.map(section => <article key={section.title}>
                  <h5 className="text-lg font-semibold mb-2">{section.title}</h5>
                  {section.paragraphs.map(paragraph=><p key={paragraph.slice(0,40)} className="text-slate-700 leading-relaxed mb-3 text-sm md:text-base">{paragraph}</p>)}
                </article>)}
              </div>
              <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-5 mb-5">
                <h4 className="font-semibold mb-3">Próbáld ki – irányított gyakorlatok</h4>
                <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed text-slate-700">
                  {guide.guidedPractice.map(item => <li key={item}>{item}</li>)}
                </ol>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 mb-5">
                <h4 className="font-semibold mb-3">Gyakori félreértések és hibák</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                  {guide.commonMistakes.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-indigo-200 p-5 mb-5">
                <h4 className="font-semibold mb-3">Önellenőrzés</h4>
                {guide.selfCheck.map((item,index) => {
                  const key = chapter.id + ':' + index;
                  const visible = revealedAnswers.includes(key);
                  return <div key={item.question} className="py-3 border-b border-slate-100 last:border-0">
                    <p className="text-sm font-medium mb-2">{index + 1}. {item.question}</p>
                    <button type="button" onClick={()=>setRevealedAnswers(prev => visible ? prev.filter(id=>id!==key) : [...prev,key])}
                      aria-expanded={visible} className="text-sm text-[#4a54e1] font-semibold hover:underline">
                      {visible ? 'Válasz elrejtése' : 'Mintaválasz megmutatása'}
                    </button>
                    {visible && <p className="text-sm text-slate-700 mt-2">{item.answer}</p>}
                  </div>;
                })}
              </div>
              <div className="border-t border-slate-200 pt-5">
                <h4 className="font-semibold mb-2">Szakmai források és további olvasás</h4>
                <p className="text-xs text-slate-500 mb-3">Forrásalapú, saját magyar összefoglaló; az angol nyelvű oktatási források szövegét nem másoljuk át.</p>
                <ul className="space-y-3">{guide.sources.map(source=><li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#4a54e1] hover:underline">{source.title} ↗</a>
                  <p className="text-xs text-slate-600">{source.note}</p>
                </li>)}</ul>
              </div>
            </section>}

            {/* Az eredeti Hangértékek galéria releváns ábrái itt, a leckében. */}
            {illustrations.length > 0 && (
              <section className="mt-8 mb-8 pt-6 border-t border-slate-200" aria-label="A lecke szemléltető képei">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Szemléltető kottaképek</h4>
                <p className="text-slate-600 text-xs mb-5">Kattints a képre a nagyításhoz.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {illustrations.map((item) => (
                    <figure key={item.title} className="overflow-hidden rounded-2xl bg-white border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setZoom({ src: item.image, alt: item.title })}
                        className="w-full bg-white p-3 cursor-zoom-in focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-500"
                        aria-label={`${item.title} nagyítása`}
                      >
                        <img src={item.image} alt={item.title} loading="lazy" className="w-full h-auto max-h-72 object-contain" />
                      </button>
                      <figcaption className="px-4 py-3 border-t border-slate-200">
                        <strong className="block text-sm text-slate-900">{item.title}</strong>
                        <span className="block text-xs leading-relaxed text-slate-600 mt-1">{item.description}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* Quotes */}
            {currentSub.quotes && currentSub.quotes.map((q, qIdx) => (
              <div key={qIdx} className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 my-6 flex items-start space-x-4">
                <Quote className="w-8 h-8 text-[#4a54e1] shrink-0 opacity-70" />
                <div>
                  <p className="text-slate-200 italic font-medium mb-2">„{q.text}”</p>
                  <span className="text-xs font-bold text-[#4a54e1]">— {q.source}</span>
                </div>
              </div>
            ))}

            {/* Examples & Audio Player */}
            {currentSub.examples && currentSub.examples.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-[#4a54e1]" />
                  <span>Szemléltető Példák & Hangzó Anyag</span>
                </h4>
                <div className="space-y-4">
                  {currentSub.examples.map((ex, eIdx) => (
                    <div key={eIdx} className="bg-slate-50/60 border border-slate-200/60 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm mb-1">{ex.title}</h5>
                        <p className="text-slate-700 text-xs">{ex.description}</p>
                      </div>
                      {ex.audioNotes && (
                        <button
                          onClick={() => playChord(ex.audioNotes || ['C4', 'E4', 'G4'], 600)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/30 flex items-center space-x-2 shrink-0"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Példa Hangzása</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {zoom && <ImageLightbox src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />}
    </div>
  );
};
