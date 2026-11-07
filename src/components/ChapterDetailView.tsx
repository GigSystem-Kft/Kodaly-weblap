import React, { useState } from 'react';
import { Chapter } from '../types';
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

  const currentSub = chapter.subchapters.find((s) => s.id === activeSubId) || chapter.subchapters[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-all border border-slate-700"
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
            <span className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Teljesítve</span>
            </span>
          )}
        </div>
      </div>

      {/* Chapter Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
        <span className="text-xs font-bold text-indigo-400">0{chapter.number}. FEJEZET</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-3">{chapter.title}</h2>
        <p className="text-slate-300 text-base leading-relaxed">{chapter.description}</p>
      </div>

      {/* Main layout: Subchapter tabs + content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar subchapters */}
        <div className="lg:col-span-1 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-3">
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
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-400'
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
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">{currentSub.title}</h3>
            <p className="text-indigo-300 font-medium text-sm mb-6 pb-4 border-b border-slate-800">
              {currentSub.summary}
            </p>

            {/* Content paragraphs / bullets */}
            <div className="space-y-4 mb-8">
              {currentSub.content.map((paragraph, i) => (
                <div key={i} className="flex items-start space-x-3 text-slate-300 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0" />
                  <p>{paragraph}</p>
                </div>
              ))}
            </div>

            {/* Interactive topic illustration and Hungarian video discovery */}
            <section className="my-7 space-y-4" aria-label="Vizuális és videós szemléltetés">
              {(chapter.id === "hangkeszletek" || chapter.id === "szolmizacio-hangkozok" || chapter.id === "solfege") && <div className="rounded-2xl bg-white p-5 text-slate-900 border border-slate-200">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                  <h4 className="font-semibold text-base">Hangok és hangközök – vizuális szemléltetés</h4>
                  <span className="text-xs text-slate-500">Interaktív hangkészlet-ábra</span>
                </div>
                <div className="grid grid-cols-6 gap-1 sm:gap-2" role="img" aria-label="Hexachord: C D E F G A, szolmizálva ut re mi fa sol la">
                  {(['C','D','E','F','G','A'] as const).map((note, index) => (
                    <div key={note} className="min-w-0 rounded-xl border border-indigo-200 bg-gradient-to-b from-indigo-50 to-white p-2 sm:p-4 text-center">
                      <div className="text-xl sm:text-3xl font-bold text-indigo-700">{note}</div>
                      <div className="text-xs sm:text-sm text-slate-600 mt-1">{['ut', 're', 'mi', 'fa', 'sol', 'la'][index]}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 mt-3">Hat egymás után következő diatonikus hang: a történeti hexachord egyik alapvető példája. Az ábra a hangsorok és szolmizáció tanulásához kapcsolódik.</p>
              </div>}
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-5">
                <h4 className="font-semibold text-indigo-200 mb-2">Magyar nyelvű oktatóvideók keresése</h4>
                <p className="text-sm text-slate-300 mb-3">Az alfejezet címére szabott YouTube-keresés; a találatokat a tanárnak érdemes ellenőriznie felhasználás előtt.</p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentSub.title + ' zeneelmélet magyar oktatóvideó')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  <Play className="w-4 h-4" /> Videók az aktuális alfejezethez
                </a>
              </div>
            </section>

            {/* Quotes */}
            {currentSub.quotes && currentSub.quotes.map((q, qIdx) => (
              <div key={qIdx} className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-5 my-6 flex items-start space-x-4">
                <Quote className="w-8 h-8 text-indigo-400 shrink-0 opacity-70" />
                <div>
                  <p className="text-slate-200 italic font-medium mb-2">„{q.text}”</p>
                  <span className="text-xs font-bold text-indigo-300">— {q.source}</span>
                </div>
              </div>
            ))}

            {/* Examples & Audio Player */}
            {currentSub.examples && currentSub.examples.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-800">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                  <span>Szemléltető Példák & Hangzó Anyag</span>
                </h4>
                <div className="space-y-4">
                  {currentSub.examples.map((ex, eIdx) => (
                    <div key={eIdx} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h5 className="font-bold text-white text-sm mb-1">{ex.title}</h5>
                        <p className="text-slate-300 text-xs">{ex.description}</p>
                      </div>
                      {ex.audioNotes && (
                        <button
                          onClick={() => playChord(ex.audioNotes || ['C4', 'E4', 'G4'], 600)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/30 flex items-center space-x-2 shrink-0"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
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
    </div>
  );
};
