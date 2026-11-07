/** Four quarter-note beats subdivided into notes at the chosen rhythmic value. */
export const RHYTHM_SUBDIVISIONS = [1,2,4,8,16] as const;
export type RhythmSubdivision = (typeof RHYTHM_SUBDIVISIONS)[number];

export function rhythmPattern(divisions: RhythmSubdivision, bpm=60) {
  if (!Number.isFinite(bpm) || bpm <= 0 || bpm > 240) throw new Error('Invalid tempo');
  const beatSeconds=60/bpm;
  const totalSeconds=beatSeconds*4;
  const noteSeconds=totalSeconds/divisions;
  return {
    bpm, divisions, beatSeconds, noteSeconds, totalSeconds,
    beats:Array.from({length:4},(_,index)=>({index,startSeconds:index*beatSeconds,accent:index===0})),
    notes:Array.from({length:divisions},(_,index)=>({
      index,startSeconds:index*noteSeconds,durationSeconds:noteSeconds
    }))
  };
}
