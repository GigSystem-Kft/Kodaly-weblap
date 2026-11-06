import test from 'node:test';
import assert from 'node:assert/strict';
import { knowledgeContext, knowledgeStatus, localKnowledgeReply, searchKnowledge } from './server-knowledge';

test('indexes the course and the existing written sources', () => {
  const status = knowledgeStatus();
  assert.ok(status.indexedSources >= 5, 'the university note and four schoolbooks must be present');
  assert.ok(!knowledgeContext('Zenei alapismeretek').includes('kesztler-zenei-alapismeretek.txt'), 'unreliable OCR source must not enter the index');
  assert.ok(status.lessonChunks >= 20, 'course lessons must be indexed');
  assert.ok(status.indexedChunks > status.lessonChunks);
});

test('finds biton in the existing course materials', () => {
  const hits = searchKnowledge('Mi az a biton hangkészlet?');
  assert.ok(hits.length > 0);
  assert.ok(hits.some(hit => /biton/i.test(hit.text)));
});

test('retrieves bichord as a separate relevant concept', () => {
  const hits = searchKnowledge('Mi a bichord?');
  assert.ok(hits.some(hit => /bichord/i.test(hit.text)));
});

test('finds the correct theory of G major key signatures', () => {
  const answer = localKnowledgeReply('Mi a G-dúr előjegyzése?');
  assert.match(answer, /G.dúr/i);
  assert.match(answer, /fisz/i);
  assert.match(answer, /Tananyag|oldal/i);
});

test('can find source and lesson citations for an interval', () => {
  const context = knowledgeContext('Mi a tiszta kvint?');
  assert.ok(context.length > 0);
  assert.match(context, /kvint/i);
});

test('does not invent an answer when a nonsensical phrase has no sources', () => {
  const answer = localKnowledgeReply('zzxxqqpp unusablekeyword 999xyz');
  assert.match(answer, /nem találtam/i);
});
