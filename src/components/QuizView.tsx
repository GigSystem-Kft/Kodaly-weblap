import React, { useEffect, useMemo, useRef, useState } from 'react';
import { QUIZ_QUESTIONS, MUSIC_CHAPTERS } from '../data/musicData';
import { EXTRA_LEARNING_MODULES } from '../data/learningProgressSummary';
import { QuizQuestion } from '../types';
import { HelpCircle, CheckCircle, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { playNote } from '../utils/audio';

interface QuizViewProps {
  onSaveQuizScore: (chapterId: string, score: number, correct: number, total: number, wrongQuestionIds: string[], durationSeconds: number) => void;
  initialChapterId?: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ onSaveQuizScore, initialChapterId }) => {
  const [selectedChapter, setSelectedChapter] = useState<string>(initialChapterId || 'all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  // Guard discrete controls against two clicks in the same React render.
  // Without a synchronous latch, double-clicking Next can skip a question;
  // double-clicking Finish can record the same quiz twice.
  const answeringRef = useRef(false);
  const advancingRef = useRef(false);
  useEffect(() => {
    answeringRef.current = false;
    advancingRef.current = false;
  }, [currentIndex, selectedChapter, round]);

  // A practice round is deliberately short; the full bank remains available over
  // repeated rounds, while a single all-topics session no longer needs hundreds of clicks.
  const questions = useMemo(() => {
    const bank = selectedChapter === 'all'
      ? QUIZ_QUESTIONS
      : QUIZ_QUESTIONS.filter(question => question.chapterId === selectedChapter);
    const shuffled = [...bank];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled.slice(0, 15);
  }, [selectedChapter, round]);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (index: number) => {
    if (isAnswered || answeringRef.current || advancingRef.current) return;
    answeringRef.current = true;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      playNote('C5', 300);
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongQuestionIds(previous => [...previous, currentQ.id].slice(0, 15));
      playNote('C3', 300);
    }
  };

  const handleNext = () => {
    if (!isAnswered || advancingRef.current || isFinished) return;
    advancingRef.current = true;
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      const finalScore = Math.round((correctCount / questions.length) * 100);
      onSaveQuizScore(selectedChapter === 'all' ? 'vegyes-gyakorlas' : selectedChapter,
        finalScore, correctCount, questions.length, wrongQuestionIds,
        Math.min(36_000, Math.max(0, Math.round((Date.now() - startedAt) / 1000))));
    }
  };

  const restartQuiz = () => {
    answeringRef.current = false;
    advancingRef.current = false;
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsFinished(false);
    setWrongQuestionIds([]);
    setRound(value => value + 1);
    setStartedAt(Date.now());
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900">
        <h2 className="text-2xl font-bold mb-3">Ehhez a témakörhöz még nincs kérdés</h2>
        <p className="mb-4">Válassz egy másik témakört, vagy próbáld ki az összes kérdést.</p>
        <button type="button" onClick={() => { setSelectedChapter('all'); restartQuiz(); }}
          className="rounded-lg bg-violet-700 text-white px-4 py-2">Vegyes gyakorlás</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-semibold mb-3 border border-violet-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Tudáspróba & Kvíz</span>
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Interaktív Ellenőrző Teszt</h2>
        <p className="text-slate-600 text-sm">
          Ellenőrizd zeneelméleti tudásodat fejezetenként vagy az összes kérdés áttekintésével!
        </p>
      </div>

      {/* One accessible dropdown replaces the growing button cloud. */}
      <div className="max-w-xl mx-auto mb-8">
        <label htmlFor="quiz-chapter" className="block mb-2 text-sm font-semibold text-slate-800">Teszt témaköre</label>
        <select id="quiz-chapter" value={selectedChapter}
          onChange={(event) => { setSelectedChapter(event.target.value); restartQuiz(); }}
          className="w-full rounded-xl border border-violet-400/50 bg-slate-900 text-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
          {[
            {id:'all', label:'Vegyes gyakorlás (15 kérdés)'},
            ...MUSIC_CHAPTERS.map(chapter => ({
              id: chapter.id,
              label: `${String(chapter.number).padStart(2, '0')}. ${chapter.title}`
            })),
            ...EXTRA_LEARNING_MODULES.map(module => ({
              id: module.quizId,
              label: `${String(module.number).padStart(2, '0')}. ${module.title}`
            })),
            {id:'solfege', label:'Szolmizációs hangok'},
            {id:'abc-hangok', label:'ABC-s hangok'},
          ].filter(item => item.id === 'all' || QUIZ_QUESTIONS.some(q => q.chapterId === item.id))
            .map(item=><option value={item.id} key={item.id}>{item.label}</option>)}
        </select>
        <p className="text-xs text-slate-600 mt-2">{questions.length} kérdés a kiválasztott témakörben</p>
      </div>

      {isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-violet-500/20 border border-violet-500/40 text-violet-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Kvíz Teljesítve!</h3>
          <p className="text-slate-300 mb-4">
            Eredményed: <strong className="text-violet-400">{correctCount}</strong> / {questions.length} helyes válasz ({Math.round((correctCount / questions.length) * 100)}%)
          </p>
          <button
            onClick={restartQuiz}
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all shadow-lg shadow-violet-600/30 flex items-center space-x-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Újra próbálom</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <span className="text-xs font-bold text-violet-400">
              Kérdés {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-xs text-slate-400">
              Helyes válaszok: <strong className="text-emerald-400">{correctCount}</strong>
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-6 leading-snug">
            {currentQ.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, idx) => {
              let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800';
              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-800/60 border-slate-700 text-slate-300';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl font-medium text-sm transition-all border flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-5 mb-6">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Magyarázat</h5>
              <p className="text-slate-300 text-sm leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all shadow-lg shadow-violet-600/30 flex items-center space-x-2"
              >
                <span>{currentIndex + 1 < questions.length ? 'Következő kérdés' : 'Kvíz befejezése'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
