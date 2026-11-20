import type { UserProgress } from '../types';
import { MUSIC_CHAPTERS, FLASHCARDS_DATA } from './musicData';

export const EXTRA_LEARNING_MODULES = [
  { id: 'creative', number: 6, title: 'Kreatív zenei nevelés', tab: 'creative', quizId: 'kreativ', description: 'Ritmikai és énekes-játékos foglalkozások, módszertani ötletek' },
  { id: 'musicHistory', number: 7, title: 'Zenetörténet', tab: 'musicHistory', quizId: 'zenetortenet', description: 'Hét korszak, zeneszerzők, képek, hangzó példák és tankönyvi kapcsolódások' },
  { id: 'musicPedagogy', number: 8, title: 'Ének-zene tantárgy-pedagógia', tab: 'musicPedagogy', quizId: 'pedagogia', description: 'Módszertan, tanítási gyakorlat és szakmai feladatok' },
  { id: 'musicExpressions', number: 9, title: 'Zenei kifejezések', tab: 'musicExpressions', quizId: 'zenei-kifejezesek', description: 'Kereshető fogalomtár, tematikus szókártyák és párosítások' },
] as const;

export function learningProgressSummary(progress: UserProgress) {
  const knownChapters = MUSIC_CHAPTERS.filter(chapter => progress.completedChapters.includes(chapter.id));
  const knownSubchapters = MUSIC_CHAPTERS.flatMap(chapter => chapter.subchapters);
  const completedSubchapters = knownSubchapters.filter(sub => progress.completedSubchapters.includes(sub.id)).length;
  const knownCardIds = new Set(FLASHCARDS_DATA.map(card => card.id));
  const masteredCards = new Set(progress.flashcardsMastered.filter(id => knownCardIds.has(id))).size;
  const scores = Object.values(progress.quizScores).filter(score => typeof score === 'number' && Number.isFinite(score));
  const averageBestQuizScore = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;
  const studyDays = new Set((progress.activityDays ?? []).filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))).size;
  const lastStudy = [...(progress.activityDays ?? [])].filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date)).sort().at(-1) || progress.lastActiveDate || null;
  return {
    curriculumModules: MUSIC_CHAPTERS.length + EXTRA_LEARNING_MODULES.length,
    coreChapters: MUSIC_CHAPTERS.length,
    completedCoreChapters: knownChapters.length,
    completedExtendedModules: EXTRA_LEARNING_MODULES.filter(module=>progress.completedChapters.includes(module.id)).length,
    completedModules: knownChapters.length + EXTRA_LEARNING_MODULES.filter(module=>progress.completedChapters.includes(module.id)).length,
    completedSubchapters,
    totalSubchapters: knownSubchapters.length,
    corePercentage: MUSIC_CHAPTERS.length ? Math.round(100 * knownChapters.length / MUSIC_CHAPTERS.length) : 0,
    masteredCards,
    totalCards: FLASHCARDS_DATA.length,
    attemptedQuizCategories: scores.length,
    averageBestQuizScore,
    studyDays,
    lastStudy
  };
}
