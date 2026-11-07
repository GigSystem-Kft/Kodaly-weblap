import React from 'react';
import { UserProgress } from '../types';
import { MUSIC_CHAPTERS } from '../data/musicData';
import { EXTRA_LEARNING_MODULES, learningProgressSummary } from '../data/learningProgressSummary';
import { consecutiveDays } from '../progress';
import { Award, Sparkles, CheckCircle2, BookOpen, Trophy, ArrowRight, Layers, CalendarDays, ListChecks } from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
  signedIn?: boolean;
  onOpenModule?: (tab: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress, signedIn = false, onOpenModule }) => {
  const stats = learningProgressSummary(progress);
  const trueStreak = consecutiveDays(progress.activityDays ?? []);

  const metrics = [
    { title:'Tanulmányozottnak jelölt egységek', value:`${stats.completedModules} / ${stats.curriculumModules}`, foot:'5 alapfejezet + 4 bővített témakör · saját jelölés', Icon:BookOpen,  },
    { title:'Teljesített alapfejezetek', value:`${stats.completedCoreChapters} / ${stats.coreChapters}`, foot:`${stats.corePercentage}% · csak a követett alapfejezetek`, Icon:CheckCircle2,  },
    { title:'Kvízek átlagos legjobb eredménye', value:stats.averageBestQuizScore===null?'—':`${stats.averageBestQuizScore}%`, foot:stats.attemptedQuizCategories ? `${stats.attemptedQuizCategories} témakörben van mentett eredmény`:'Még nincs megoldott kvíz', Icon:Trophy,  },
    { title:'Összesített XP', value:`${progress.xp} XP`, foot:`${trueStreak} napos tanulási sorozat`, Icon:Sparkles,  },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold mb-3 border border-indigo-200">
          <Award className="w-3.5 h-3.5" /> Tanulmányi előrehaladás
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Tanulási profil és eredmények</h2>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
          Az aktuális, kilenc tananyagegységes Zeneelméleti Műhelyhez igazított eredmények.
          A korábbi teljesítéseid és XP-pontjaid változatlanul megmaradnak.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map(({title,value,foot,Icon})=>(
          <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg text-white">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500/20 border border-slate-600`}>
                <Icon className="w-5 h-5 text-indigo-300"/>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-300 font-medium leading-snug">{title}</p>
                <p className="text-2xl font-bold text-white mt-2 tabular-nums">{value}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-3 leading-snug">{foot}</p>
          </div>
        ))}
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-7">
        <h3 className="font-bold text-lg flex items-center gap-2"><CalendarDays className="w-5 h-5 text-indigo-600"/> Személyes tanulási napló</h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          {signedIn
            ? 'Bejelentkezve: a fiókban mentett eredményeket látod. A korábbi vendégeredményeket a fentebb található „Korábbi helyi eredmények átvitele” gombbal tudod egyesíteni.'
            : 'Vendégként az eredményeidet ez a böngésző tárolja. Bejelentkezve a fiókod eredményei jelennek meg; a helyi adatok átvitele külön művelet.'}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <div className="bg-slate-50 rounded-xl p-3"><span className="block text-xs text-slate-600">Tanulási napok</span><strong className="block mt-1">{stats.studyDays}</strong></div>
          <div className="bg-slate-50 rounded-xl p-3"><span className="block text-xs text-slate-600">Megtanult szókártyák</span><strong className="block mt-1">{stats.masteredCards} / {stats.totalCards}</strong></div>
          <div className="bg-slate-50 rounded-xl p-3"><span className="block text-xs text-slate-600">Alfejezetek</span><strong className="block mt-1">{stats.completedSubchapters} / {stats.totalSubchapters}</strong></div>
          <div className="bg-slate-50 rounded-xl p-3"><span className="block text-xs text-slate-600">Utolsó rögzített tanulás</span><strong className="block mt-1 text-sm">{stats.lastStudy || 'Még nincs adat'}</strong></div>
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg mb-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold text-white">Az öt alapfejezet teljesítése</h3>
          <span className="text-sm font-bold text-indigo-200">{stats.corePercentage}%</span>
        </div>
        <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden mb-3" role="progressbar" aria-valuenow={stats.corePercentage} aria-valuemin={0} aria-valuemax={100} aria-label="Alapfejezetek teljesítése">
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500" style={{ width: `${stats.corePercentage}%` }}/>
        </div>
        <p className="text-xs text-slate-300 mb-6">Az alapfejezet akkor számít teljesítettnek, amikor a tananyagban a „Fejezet teljesítése” gombot használod. A kvízpontszám önmagában nem jelenti a fejezet teljesítését.</p>
        <div className="space-y-3">
          {MUSIC_CHAPTERS.map((chapter) => {
            const done=progress.completedChapters.includes(chapter.id);
            const score=progress.quizScores[chapter.id];
            const studied=chapter.subchapters.filter(sub=>progress.completedSubchapters.includes(sub.id)).length;
            return <div key={chapter.id} className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${done?'bg-emerald-500/20 text-emerald-300':'bg-slate-700 text-slate-300'}`}>{done?<CheckCircle2 size={17}/>:<BookOpen size={16}/>}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{String(chapter.number).padStart(2,'0')}. {chapter.title}</h4>
                    <p className="text-xs text-slate-300">{chapter.subchapters.length} alfejezet · {studied} külön megjelölve</p>
                  </div>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${done?'border-emerald-600/40 bg-emerald-900/40 text-emerald-200':'border-slate-600 text-slate-200'}`}>{done?'Teljesítve':score!==undefined?`Kvíz legjobb: ${score}%`:'Még nincs teljesítve'}</span>
              </div>
            </div>;
          })}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6">
        <h3 className="text-lg font-bold flex gap-2 items-center"><Layers size={20} className="text-indigo-700"/> Bővített tananyagegységek · 06–09.</h3>
        <p className="text-sm text-slate-600 mt-2 mb-4">A négy bővített modult külön is tanulmányozottnak jelölheted. Ez saját tanulási jelölés, nem vizsgajegy; az itt elért kvízeredmények külön jelennek meg.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {EXTRA_LEARNING_MODULES.map(module=>{
            const score=progress.quizScores[module.quizId];
            const completed=progress.completedChapters.includes(module.id);
            return <div key={module.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="flex flex-wrap gap-2 items-start justify-between">
                <div className="flex-1"><span className="block text-xs font-bold text-indigo-700 mb-1">0{module.number}. TANANYAG</span><h4 className="font-semibold text-slate-900">{module.title}</h4></div>
                <div className="flex flex-col gap-1 items-end">
                {completed&&<span className="text-xs border border-emerald-200 bg-emerald-50 text-emerald-800 px-2 py-1 rounded-full">Tanulmányozottnak jelölve</span>}
                {score!==undefined&&<span className="text-xs border border-emerald-200 bg-emerald-50 text-emerald-800 px-2 py-1 rounded-full">Kvíz: {score}%</span>}
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2 mb-3">{module.description}</p>
              {onOpenModule&&<button type="button" onClick={()=>onOpenModule(module.tab)} className="text-sm font-semibold text-indigo-700 inline-flex gap-1 items-center hover:underline">Tananyag megnyitása <ArrowRight size={15}/></button>}
            </div>;
          })}
        </div>
      </section>
      <p className="text-xs text-slate-500 flex items-center gap-2"><ListChecks size={14}/> Az adatok a fiókban vagy a helyi böngészőtárban rögzített teljesítéseket tükrözik, nem a tananyag puszta megnyitását.</p>
    </div>
  );
};
