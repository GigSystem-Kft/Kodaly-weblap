import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/musicData';
import { QuizQuestion } from '../types';
import { HelpCircle, CheckCircle, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { playNote } from '../utils/audio';

interface QuizViewProps {
  onAddXp: (amount: number) => void;
  onSaveQuizScore: (chapterId: string, score: number) => void;
  initialChapterId?: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ onAddXp, onSaveQuizScore, initialChapterId }) => {
  const [selectedChapter, setSelectedChapter] = useState<string>(initialChapterId || 'all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const questions = selectedChapter === 'all'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter((q) => q.chapterId === selectedChapter);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      playNote('C5', 300);
      setCorrectCount((prev) => prev + 1);
      onAddXp(20);
    } else {
      playNote('C3', 300);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      const finalScore = Math.round((correctCount / questions.length) * 100);
      if (selectedChapter !== 'all') {
        onSaveQuizScore(selectedChapter, finalScore);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold mb-3 border border-violet-500/30">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Tudáspróba & Kvíz</span>
        </span>
        <h2 className="text-3xl font-extrabold text-white mb-2">Interaktív Ellenőrző Teszt</h2>
        <p className="text-slate-400 text-sm">
          Ellenőrizd zeneelméleti tudásodat fejezetenként vagy az összes kérdés áttekintésével!
        </p>
      </div>

      {/* Chapter Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => {
            setSelectedChapter('all');
            restartQuiz();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            selectedChapter === 'all'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          Összes kérdés
        </button>
        <button
          onClick={() => {
            setSelectedChapter('ritmus');
            restartQuiz();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            selectedChapter === 'ritmus'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          Ritmus & Tempó
        </button>
        <button
          onClick={() => {
            setSelectedChapter('hangok-kulcsok');
            restartQuiz();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            selectedChapter === 'hangok-kulcsok'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          Hangok & Kulcsok
        </button>
        <button
          onClick={() => {
            setSelectedChapter('szolmizacio-hangkozok');
            restartQuiz();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            selectedChapter === 'szolmizacio-hangkozok'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          Szolmizáció & Hangközök
        </button>
        <button
          onClick={() => {
            setSelectedChapter('solfege');
            restartQuiz();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            selectedChapter === 'solfege'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          Szolmizációs hangok
        </button>
        <button
          onClick={() => {
            setSelectedChapter('abc-hangok');
            restartQuiz();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            selectedChapter === 'abc-hangok'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          ABC-s hangok
        </button>
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
                  btnStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-50';
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
