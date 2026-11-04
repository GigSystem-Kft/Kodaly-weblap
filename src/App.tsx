import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChapterListView } from './components/ChapterListView';
import { ChapterDetailView } from './components/ChapterDetailView';
import { FlashcardsView } from './components/FlashcardsView';
import { MatchingGame } from './components/MatchingGame';
import { QuizView } from './components/QuizView';
import { EarTrainingView } from './components/EarTrainingView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { NoteGallery } from './components/NoteGallery';
import { NotationTable } from './components/NotationTable';
import { TextbookView } from './components/TextbookView';
import { PitchNamesView } from './components/PitchNamesView';
import { MUSIC_CHAPTERS } from './data/musicData';
import { Chapter, UserProgress } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chapters');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [quizChapterId, setQuizChapterId] = useState<string>();
  const [flashcardCategory, setFlashcardCategory] = useState<string>();
  const [matchingCategory, setMatchingCategory] = useState<string>();

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('kodaly_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      completedChapters: [],
      completedSubchapters: [],
      quizScores: {},
      flashcardsMastered: [],
      matchingCompleted: [],
      xp: 100,
      streak: 3,
      lastActiveDate: new Date().toISOString()
    };
  });

  useEffect(() => {
    localStorage.setItem('kodaly_progress', JSON.stringify(progress));
  }, [progress]);

  const addXp = (amount: number) => {
    setProgress((prev) => ({
      ...prev,
      xp: prev.xp + amount
    }));
  };

  const completeChapter = (chapterId: string) => {
    if (!progress.completedChapters.includes(chapterId)) {
      setProgress((prev) => ({
        ...prev,
        completedChapters: [...prev.completedChapters, chapterId],
        xp: prev.xp + 50
      }));
    }
  };

  const saveQuizScore = (chapterId: string, score: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [chapterId]: Math.max(prev.quizScores[chapterId] || 0, score)
      },
      xp: prev.xp + 30
    }));
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setActiveTab('chapterDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openQuiz = (chapterId?: string) => {
    setQuizChapterId(chapterId);
    setActiveTab('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openFlashcards = (category: string) => {
    setFlashcardCategory(category);
    setActiveTab('flashcards');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openMatchingGame = (category: string) => {
    setMatchingCategory(category);
    setActiveTab('matching');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1c1c1c] flex flex-col font-sans selection:bg-[#4a54e1] selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'chapterDetail') setSelectedChapter(null);
          setQuizChapterId(undefined);
          setFlashcardCategory(undefined);
          setMatchingCategory(undefined);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        xp={progress.xp}
        streak={progress.streak}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'chapters' && (
          <ChapterListView
            onSelectChapter={handleSelectChapter}
            progress={progress}
          />
        )}

        {activeTab === 'chapterDetail' && selectedChapter && (
          <ChapterDetailView
            chapter={selectedChapter}
            onBack={() => {
              setActiveTab('chapters');
              setSelectedChapter(null);
            }}
            onOpenQuiz={openQuiz}
            onCompleteChapter={completeChapter}
            isCompleted={progress.completedChapters.includes(selectedChapter.id)}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView onAddXp={addXp} initialCategory={flashcardCategory} />
        )}

        {activeTab === 'matching' && (
          <MatchingGame onAddXp={addXp} initialCategory={matchingCategory} />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            onAddXp={addXp}
            onSaveQuizScore={saveQuizScore}
            initialChapterId={quizChapterId}
          />
        )}

        {activeTab === 'eartraining' && (
          <EarTrainingView onAddXp={addXp} />
        )}

        {activeTab === 'dashboard' && (
          <ProgressDashboard progress={progress} />
        )}

        {activeTab === 'gallery' && (
          <NoteGallery />
        )}

        {activeTab === 'notationTable' && (
          <NotationTable />
        )}

        {(activeTab === 'solfege' || activeTab === 'abcNotes') && (
          <PitchNamesView
            topic={activeTab}
            onOpenQuiz={openQuiz}
            onOpenFlashcards={openFlashcards}
            onOpenMatching={openMatchingGame}
          />
        )}

        {activeTab.startsWith('textbook-') && (
          <TextbookView book={Number(activeTab.split('-')[1])} />
        )}
      </main>

      <ChatAssistant />

      <footer className="px-6 md:px-12 py-6 flex flex-col sm:flex-row justify-between items-center text-[0.65rem] font-mono-jetbrains text-[#1c1c1c]/60 border-t border-[#1c1c1c]/15 bg-[#fdfcf8]">
        <span>COPYRIGHT © 2026. ALL RIGHTS RESERVED.</span>
        <span>CREATED BY DR. SZABÓ NORBERT — MATE</span>
      </footer>
    </div>
  );
}
