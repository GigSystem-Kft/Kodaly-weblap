import test from 'node:test';
import assert from 'node:assert/strict';
import { PEDAGOGY_UNITS, PEDAGOGY_SOURCE } from '../src/data/musicPedagogy';

test('pedagogy course covers 16 sourced teaching-methodology units', () => {
 assert.equal(PEDAGOGY_UNITS.length,16);
 assert.equal(new Set(PEDAGOGY_UNITS.map(x=>x.id)).size,16);
 assert.equal(PEDAGOGY_SOURCE.isbn,'978-615-5621-66-6');
 assert.ok(PEDAGOGY_SOURCE.originalUrl.startsWith('https://publikacio.uni-eszterhazy.hu/'));
 for(const unit of PEDAGOGY_UNITS){
  assert.ok(unit.page && unit.goal && unit.title);
  assert.ok(unit.sections.length >=2);
  assert.ok(unit.sections.every(section=>section.text.length>=130));
  assert.ok(unit.seminar.length>=2);
  assert.ok(unit.reflection.length>=1);
 }
 assert.ok(PEDAGOGY_UNITS.some(x=>x.title.includes('Kodály')));
 assert.ok(PEDAGOGY_UNITS.some(x=>x.title.includes('Daltanítás')));
 assert.ok(PEDAGOGY_UNITS.some(x=>x.title.includes('Ritmikai')));
 assert.ok(PEDAGOGY_UNITS.some(x=>x.title.includes('zenehallgatás')));
});
