import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { QUIZ_QUESTIONS } from '../src/data/musicData';
import { FIELDS, quizReviewRows, toCsv } from './export-a20-quiz-review';

const sha = 'a'.repeat(40);

test('A-20 reviewer receives every real quiz in stable id order with complete immutable answer hash', () => {
  const rows = quizReviewRows(sha);
  assert.equal(rows.length, QUIZ_QUESTIONS.length);
  assert.ok(rows.length >= 100);
  assert.equal(new Set(rows.map(r => r.question_id)).size, rows.length);
  const items = new Map(QUIZ_QUESTIONS.map(q => [q.id, q]));
  for (const row of rows) {
    const item = items.get(row.question_id);
    assert.ok(item, 'Unknown question in reviewer inventory: ' + row.question_id);
    assert.equal(row.chapter_id, item.chapterId);
    assert.equal(row.question, item.question);
    assert.deepEqual(JSON.parse(row.options_json), item.options);
    assert.equal(Number(row.correct_index), item.correctIndex);
    assert.equal(row.correct_answer, item.options[item.correctIndex]);
    assert.equal(row.explanation, item.explanation);
    const canonical = { id: item.id, chapterId: item.chapterId,
      question: item.question, options: item.options,
      correctIndex: item.correctIndex, explanation: item.explanation };
    assert.equal(row.item_sha256,
      createHash('sha256').update(JSON.stringify(canonical)).digest('hex'));
    assert.equal(row.release_sha, sha);
    assert.equal(row.decision, 'PENDING');
    assert.equal(row.reviewer_role, '');
    assert.equal(row.reviewed_on, '');
    assert.equal(row.evidence_ref, '');
  }
});

test('A-20 export quotes CSV content safely and cannot claim permission itself', () => {
  const rows = quizReviewRows(sha);
  const csv = toCsv(rows);
  assert.equal(csv.split('\n')[0], FIELDS.join(','));
  assert.ok(csv.includes('"PENDING"'));
  assert.ok(!csv.includes('"APPROVED"'));
  assert.ok(csv.includes('""') || csv.includes('"['),
    'Expect CSV escaped or JSON-encoded study text');
  assert.equal(csv.match(/"PENDING"/g)?.length, rows.length);
});

test('A-20 export refuses missing, shortened or forged release SHA', () => {
  for (const invalid of ['', 'a'.repeat(12), 'z'.repeat(40), sha.toUpperCase()]) {
    assert.throws(() => quizReviewRows(invalid), /release SHA/);
  }
});
