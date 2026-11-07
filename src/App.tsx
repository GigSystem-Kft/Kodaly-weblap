import { apiFetch } from './api';
import React, { useState, useEffect } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { Navbar } from './components/Navbar';
import { ChapterListView } from './components/ChapterListView';
import { CreativeEducationView } from './components/CreativeEducationView';
import { MusicHistoryView } from './components/MusicHistoryView';
import { MusicExpressionsView } from './components/MusicExpressionsView';
import { MusicPedagogyView } from './components/MusicPedagogyView';
import { ChapterDetailView } from './components/ChapterDetailView';
import { FlashcardsView } from './components/FlashcardsView';
import { MatchingGame } from './components/MatchingGame';
import { QuizView } from './components/QuizView';
import { EarTrainingView } from './components/EarTrainingView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AccountPanel, type AccountUser } from './components/AccountPanel';
import { ChatAssistant } from './components/ChatAssistant';
import { NoteGallery } from './components/NoteGallery';
import { NotationTable } from './components/NotationTable';
import { TextbookView } from './components/TextbookView';
import { RhythmResearchBookView } from './components/RhythmResearchBookView';
import { PitchNamesView } from './components/PitchNamesView';
import { MUSIC_CHAPTERS } from './data/musicData';
import { Chapter, UserProgress } from './types';
import { readProgress, recordActivity, PROGRESS_KEY, consecutiveDays, migrateProgress, mergeProgress } from './progress';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chapters');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [quizChapterId, setQuizChapterId] = useState<string>();
  const [flashcardCategory, setFlashcardCategory] = useState<string>();
  const [matchingCategory, setMatchingCategory] = useState<string>();

  const [progress, setProgress] = useState<UserProgress>(readProgress);
  const [account, setAccount] = useState<AccountUser | null>(null);
  const [accountReady, setAccountReady] = useState(false);
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      try {
        const response = await apiFetch('/api/auth/me');
        if (!response.ok) throw new Error('Nem elérhető a fiókszolgáltatás.');
        const data = await response.json();
        if (data.user) {
          const progressResponse = await apiFetch('/api/progress');
          if (!progressResponse.ok) throw new Error('Nem sikerült betölteni a mentett eredményeket.');
          const saved = await progressResponse.json();
          if (active) {
            setProgress(migrateProgress(saved.progress));
            setAccount(data.user as AccountUser);
          }
        }
      } catch (error) {
        if (active) setSyncError(error instanceof Error ? error.message : 'Fiókbetöltési hiba.');
      } finally {
        if (active) setAccountReady(true);
      }
    };
    void initialize();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!accountReady) return;
    if (!account) {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      return;
    }
    const handle = window.setTimeout(async () => {
      try {
        const response = await apiFetch('/api/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress })
        });
        if (!response.ok) throw new Error('A szerveroldali eredménymentés nem sikerült.');
        setSyncError('');
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Mentési hiba.');
      }
    }, 600);
    return () => window.clearTimeout(handle);
  }, [progress, account, accountReady]);

  const signIn = async (user: AccountUser) => {
    const response = await apiFetch('/api/progress');
    if (!response.ok) throw new Error('A fiók létrejött, de a tanulási adatok betöltése nem sikerült.');
    const saved = await response.json();
    setProgress(migrateProgress(saved.progress));
    setSyncError('');
    setAccount(user);
    setAccountReady(true);
  };

  const signOut = () => {
    setAccount(null);
    setProgress(readProgress());
    setSyncError('');
  };

  const importLocal = () => {
    setProgress(previous => mergeProgress(previous, readProgress()));
  };

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
        isAdmin={account?.role === 'admin'}
        xp={progress.xp}
        streak={consecutiveDays(progress.activityDays ?? [])}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'chapters' && (
          <ChapterListView
            onSelectChapter={handleSelectChapter}
            progress={progress}
            onOpenCreative={() => { setActiveTab('creative'); window.scrollTo({top:0,behavior:'smooth'}); }}
            onOpenHistory={() => { setActiveTab('musicHistory'); window.scrollTo({top:0,behavior:'smooth'}); }}
            onOpenPedagogy={() => { setActiveTab('musicPedagogy'); window.scrollTo({top:0,behavior:'smooth'}); }}
            onOpenExpressions={() => { setActiveTab('musicExpressions'); window.scrollTo({top:0,behavior:'smooth'}); }}
          />
        )}

        {activeTab === 'musicExpressions' && (
          <MusicExpressionsView
            onBack={() => { setActiveTab('chapters'); window.scrollTo({top:0,behavior:'smooth'}); }}
            onQuiz={() => openQuiz('zenei-kifejezesek')}
            onFlashcards={openFlashcards}
            onMatching={openMatchingGame}
          />
        )}

        {activeTab === 'musicPedagogy' && (
          <MusicPedagogyView
            onBack={() => { setActiveTab('chapters'); window.scrollTo({top:0,behavior:'smooth'}); }}
            onQuiz={() => openQuiz('pedagogia')}
            onFlashcards={() => openFlashcards('Ének-zene tantárgy-pedagógia')}
            onMatching={() => openMatchingGame('Ének-zene tantárgy-pedagógia')}
          />
        )}

        {activeTab === 'musicHistory' && (
          <MusicHistoryView
            onBack={() => { setActiveTab('chapters'); window.scrollTo({top:0,behavior:'smooth'}); }}
            onQuiz={() => openQuiz('zenetortenet')}
            onFlashcards={() => openFlashcards('Zenetörténet')}
            onMatching={() => openMatchingGame('Zenetörténet')}
          />
        )}

        {activeTab === 'creative' && (
          <CreativeEducationView onBack={() => { setActiveTab('chapters'); window.scrollTo({top:0,behavior:'smooth'}); }} />
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
          <FlashcardsView onMasterCard={markFlashcard} masteredCards={progress.flashcardsMastered} initialCategory={flashcardCategory} />
        )}

        {activeTab === 'matching' && (
          <MatchingGame onAddXp={addXp} initialCategory={matchingCategory} />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            onSaveQuizScore={saveQuizScore}
            initialChapterId={quizChapterId}
          />
        )}

        {activeTab === 'eartraining' && (
          <EarTrainingView onAddXp={addXp} />
        )}

        {activeTab === 'admin' && account?.role === 'admin' && <AdminDashboard />}

        {activeTab === 'dashboard' && (
          <>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <AccountPanel
                user={account}
                onSignedIn={signIn}
                onSignedOut={signOut}
                onImportLocal={importLocal}
                syncError={syncError}
              />
            </div>
            <ProgressDashboard progress={progress} signedIn={!!account} />
          </>
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

        {activeTab.startsWith('textbook-') && [1, 2, 3, 4].includes(Number(activeTab.split('-')[1])) && (
          <TextbookView book={Number(activeTab.split('-')[1])} />
        )}
        {activeTab === 'textbook-5' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <RhythmResearchBookView />
          </div>
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
