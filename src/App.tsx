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
import { readProgress, recordActivity, PROGRESS_KEY, consecutiveDays } from './progress';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chapters');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [quizChapterId, setQuizChapterId] = useState<string>();
  const [flashcardCategory, setFlashcardCategory] = useState<string>();
  const [matchingCategory, setMatchingCategory] = useState<string>();

  const [progress, setProgress] = useState<UserProgress>(readProgress);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const addXp = (amount: number) => {
    setProgress(prev => recordActivity(prev, amount));
  };

  const completeChapter = (chapterId: string) => {
    setProgress(prev => prev.completedChapters.includes(chapterId)
      ? prev
      : recordActivity({ ...prev, completedChapters: [...prev.completedChapters, chapterId] }, 50));
  };

  const markFlashcard = (id: string) => {
    setProgress(prev => prev.flashcardsMastered.includes(id)
      ? prev
      : recordActivity({ ...prev, flashcardsMastered: [...prev.flashcardsMastered, id] }, 15));
  };

  const saveQuizScore = (chapterId: string, score: number) => {
    setProgress(prev => {
      const previousBest = prev.quizScores[chapterId] ?? 0;
      const improved = score > previousBest;
      return recordActivity({
        ...prev,
        quizScores: { ...prev.quizScores, [chapterId]: Math.max(previousBest, score) }
      }, improved ? 30 : 0);
    });
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
        streak={consecutiveDays(progress.activityDays ?? [])}
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
          <FlashcardsView onAddXp={addXp} onMasterCard={markFlashcard} masteredCards={progress.flashcardsMastered} initialCategory={flashcardCategory} />
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
