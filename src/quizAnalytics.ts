import type { UserProgress } from './types';

export interface QuizPracticeTrend {
  chapterId: string;
  attempts: number;
  latestScore: number;
  recentAverage: number;
  priorAverage: number | null;
  change: number | null;
  latestAt: string;
}

const average = (values:number[]):number =>
  Math.round(values.reduce((sum,score)=>sum+score,0)/values.length);

/**
 * Descriptive practice feedback, not a standardized or comparable examination.
 * Compare only rounds within the same topic and only when 6 attempts exist.
 */
export function quizPracticeTrends(progress:UserProgress):QuizPracticeTrend[] {
  const byTopic=new Map<string,NonNullable<UserProgress['quizAttempts']>>();
  for(const item of progress.quizAttempts ?? []) {
    if(!Number.isFinite(item.score) || item.score<0 || item.score>100) continue;
    const topic=byTopic.get(item.chapterId) ?? [];
    topic.push(item);
    byTopic.set(item.chapterId,topic);
  }
  return [...byTopic.entries()].map(([chapterId,rows])=>{
    const attempts=[...rows].sort((a,b)=>a.at.localeCompare(b.at));
    const recent=attempts.slice(-3);
    const prior=attempts.slice(-6,-3);
    const recentAverage=average(recent.map(item=>item.score));
    const priorAverage=prior.length===3 ? average(prior.map(item=>item.score)) : null;
    return {
      chapterId,attempts:attempts.length,
      latestScore:attempts.at(-1)!.score,
      recentAverage,priorAverage,
      change:priorAverage===null?null:recentAverage-priorAverage,
      latestAt:attempts.at(-1)!.at
    };
  }).sort((a,b)=>b.latestAt.localeCompare(a.latestAt));
}
