export interface SubChapter {
  id: string;
  title: string;
  summary: string;
  content: string[];
  examples?: {
    title: string;
    description: string;
    notes?: string[];
    audioNotes?: string[];
  }[];
  quotes?: {
    text: string;
    source: string;
  }[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  iconName: string;
  subchapters: SubChapter[];
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  category: string;
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  chapterId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MatchingPair {
  id: string;
  term: string;
  match: string;
  category: string;
}

export interface UserProgress {
  completedChapters: string[];
  completedSubchapters: string[];
  quizScores: Record<string, number>; // chapterId -> percentage
  flashcardsMastered: string[];
  matchingCompleted: string[];
  xp: number;
  streak: number;
  lastActiveDate: string;
}
