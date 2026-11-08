import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPRESSION_QUIZZES } from '../src/data/musicExpressionsPractice';

test('every glossary question has four unambiguous distinct choices', () => {
  assert.ok(EXPRESSION_QUIZZES.length>=200,'Glossary quiz bank unexpectedly small');
  for(const q of EXPRESSION_QUIZZES){
    assert.equal(q.options.length,4,'Question has fewer than four choices: '+q.id);
    assert.ok(q.correctIndex>=0&&q.correctIndex<4,'Invalid answer index: '+q.id);
    const normalized=q.options.map(x=>x.replace(/\s+/g,' ').trim().toLocaleLowerCase('hu-HU'));
    assert.equal(new Set(normalized).size,4,'Repeated meaning makes answer ambiguous: '+q.id);
    assert.ok(normalized.every(x=>x.length>0),'Blank choice: '+q.id);
    assert.ok(q.explanation.includes(q.options[q.correctIndex]),'Answer not backed by original glossary definition: '+q.id);
  }
});
