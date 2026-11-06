import assert from 'node:assert/strict';
import test from 'node:test';
import { MUSIC_HISTORY } from '../src/data/musicHistory';

test('music history chapter contains unique sourced eras', () => {
  assert.equal(MUSIC_HISTORY.length, 7);
  assert.equal(new Set(MUSIC_HISTORY.map(item=>item.id)).size, MUSIC_HISTORY.length);
  assert.equal(MUSIC_HISTORY[0].id, 'kezdetek');
  assert.equal(MUSIC_HISTORY[MUSIC_HISTORY.length-1].id, 'huszadik');
  for (const item of MUSIC_HISTORY) {
    assert.ok(item.lead.length > 60, 'each era has a meaningful explanation');
    assert.ok(item.sourceLinks.length >= 1);
    assert.ok(item.sourceLinks.every(link => link.url.startsWith('https://hu.wikipedia.org/wiki/')));
    assert.ok(item.features.length >= 3);
    assert.ok(item.figures.length >= 3);
    assert.ok(item.question && item.example);
  }
});
