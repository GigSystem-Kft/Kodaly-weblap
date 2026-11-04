import React from 'react';
import { UserProgress } from '../types';
import { MUSIC_CHAPTERS } from '../data/musicData';
import { Award, Flame, Sparkles, CheckCircle2, BookOpen, Trophy } from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress }) => {
  const totalChapters = MUSIC_CHAPTERS.length;
  const completedCount = progress.completedChapters.length;
  const completionPercentage = Math.round((completedCount / totalChapters) * 100);

  const avgQuizScore = Object.values(progress.quizScores).length > 0
    ? Math.round(Object.values(progress.quizScores).reduce((a, b) => a + b, 0) / Object.values(progress.quizScores).length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
          <Award className="w-3.5 h-3.5" />
          <span>Tanulmányi Előrehaladás</span>
        </span>
        <h2 className="text-3xl font-extrabold text-white mb-2">Hallgatói Teljesítmény Statisztika</h2>
        <p className="text-slate-400 text-sm">
          Kövesd nyomon fejezetenkénti haladásodat, kvízeredményeidet és megszerzett XP-det.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Teljesített Fejezetek</p>
            <h4 className="text-2xl font-bold text-white mt-1">{completedCount} / {totalChapters}</h4>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Átlagos Kvíz Pontszám</p>
            <h4 className="text-2xl font-bold text-white mt-1">{avgQuizScore}%</h4>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Tanulási Sorozat</p>
            <h4 className="text-2xl font-bold text-white mt-1">{progress.streak} nap</h4>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Összesített XP</p>
            <h4 className="text-2xl font-bold text-white mt-1">{progress.xp} XP</h4>
          </div>
        </div>
      </div>

      {/* Progress Bar & Chapter breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Tanfolyam Haladása</h3>
          <span className="text-sm font-bold text-indigo-400">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-6">
          <div
            className="bg-gradient-to-r from-indigo-600 to-violet-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="space-y-4">
          {MUSIC_CHAPTERS.map((ch) => {
            const isDone = progress.completedChapters.includes(ch.id);
            const score = progress.quizScores[ch.id];
            return (
              <div key={ch.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <BookOpen className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{ch.title}</h4>
                    <p className="text-xs text-slate-400">{ch.subchapters.length} alfejezet</p>
                  </div>
                </div>
                <div>
                  {score !== undefined ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                      Kvíz: {score}%
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      Még nincs kvíz
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
