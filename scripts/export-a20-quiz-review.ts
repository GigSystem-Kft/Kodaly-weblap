#!/usr/bin/env node
/**
 * A-20: expert-review inventory for the EXACT student quiz bank in this build.
 * The file is a pending review aid, never evidence of expert acceptance.
 * Keep the CSV outside the deployable PHP webroot.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { QUIZ_QUESTIONS } from '../src/data/musicData';

export const FIELDS = [
  'release_sha', 'question_id', 'chapter_id', 'question', 'options_json',
  'correct_index', 'correct_answer', 'explanation', 'item_sha256',
  'decision', 'reviewer_role', 'reviewed_on', 'evidence_ref',
] as const;

export const quizReviewRows = (releaseSha: string) => {
  if (!/^[a-f0-9]{40}$/.test(releaseSha)) {
    throw new Error('Review inventory requires exact 40-character release SHA');
  }
  if (QUIZ_QUESTIONS.length < 100) throw new Error('Unexpectedly small quiz bank');
  const ids = new Set<string>();
  const rows = QUIZ_QUESTIONS.map(q => {
    if (!q.id.trim() || ids.has(q.id)) throw new Error('Missing/duplicate quiz ID');
    ids.add(q.id);
    if (!q.chapterId.trim() || !q.question.trim() || !q.explanation.trim() ||
        q.options.length < 2 || !Number.isInteger(q.correctIndex) ||
        q.correctIndex < 0 || q.correctIndex >= q.options.length ||
        q.options.some(opt => !opt.trim())) {
      throw new Error('Invalid quiz data at ID ' + q.id);
    }
    const canonical = {
      id: q.id, chapterId: q.chapterId, question: q.question,
      options: q.options, correctIndex: q.correctIndex, explanation: q.explanation,
    };
    return {
      release_sha: releaseSha, question_id: q.id, chapter_id: q.chapterId,
      question: q.question, options_json: JSON.stringify(q.options),
      correct_index: String(q.correctIndex), correct_answer: q.options[q.correctIndex],
      explanation: q.explanation,
      item_sha256: createHash('sha256').update(JSON.stringify(canonical), 'utf8').digest('hex'),
      decision: 'PENDING', reviewer_role: '', reviewed_on: '', evidence_ref: '',
    };
  });
  return rows.sort((a, b) => a.question_id.localeCompare(b.question_id, 'hu-HU'));
};

const csvCell = (value: string) => '"' + value.replaceAll('"', '""') + '"';
export const toCsv = (rows: ReturnType<typeof quizReviewRows>) =>
  [FIELDS.join(','), ...rows.map(row => FIELDS.map(key => csvCell(row[key])).join(','))].join('\n') + '\n';

if (process.argv[1] && /(?:^|[/\\])export-a20-quiz-review\.ts$/.test(process.argv[1])) {
  const sha = process.argv[2] ?? '';
  const destination = resolve(process.argv[3] ?? 'a20-quiz-review.csv');
  for (const rootName of ['release', 'dist', 'public']) {
    const directory = resolve(rootName);
    if (destination === directory || destination.startsWith(directory + sep)) {
      throw new Error('Review CSV must not be stored in public PHP/frontend files');
    }
  }
  const rows = quizReviewRows(sha);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, toCsv(rows), 'utf8');
  console.log('A-20 quiz review inventory:', rows.length,
    'stable question IDs; all decisions PENDING; release SHA', sha);
}
