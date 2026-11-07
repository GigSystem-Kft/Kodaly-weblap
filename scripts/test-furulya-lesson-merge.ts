import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MUSIC_CHAPTERS } from '../src/data/musicData';
import { CURATED_MEDIA } from '../src/data/curatedMusicMedia';
import { FOUNDATIONS_SUBCHAPTER_IDS } from '../src/data/musicFoundationsSubchapters';

test('the 2.4 material is consolidated into 2.2, with no redundant sidebar entry',()=>{
 const chapter=MUSIC_CHAPTERS.find(c=>c.id==='hangok-kulcsok');
 assert.ok(chapter);
 const ids=chapter.subchapters.map(s=>s.id);
 assert.deepEqual(ids,['abszolutm-hangok','modositok','kottaolvasas']);
 assert.ok(!FOUNDATIONS_SUBCHAPTER_IDS.includes('elojegyzes-feloldas'));
 const lesson=chapter.subchapters.find(s=>s.id==='modositok');
 assert.ok(lesson);
 assert.match(lesson.title,/2\.2.*feloldójel/i);
 const text=lesson.content.join(' ');
 for(const term of ['előjegyzés','feloldójel','Fisz','Cisz','B','Esz','ütem']) assert.ok(text.includes(term),term);
 const illustrationIndex=readFileSync('src/data/lessonIllustrations.ts','utf8');
 assert.ok(illustrationIndex.includes("'modositok': ["));
 assert.ok(!illustrationIndex.includes("'elojegyzes-feloldas': ["));
});

test('the recorder website has an explicit card and a local original illustration',()=>{
 const item=CURATED_MEDIA.find(x=>x.id==='furulya-magus-magyar');
 assert.ok(item);
 assert.equal(item.url,'https://furulya.digitaliskottatar.hu/');
 assert.equal(item.kind,'kep');
 assert.ok(item.chapters.includes(2));
 assert.match(item.linkLabel||'',/Furulya Mágus/);
 assert.match(item.license||'',/Saját/);
 assert.equal(item.imageUrl,'/assets/furulya-tanulasi-attekintes.svg');
 const illustration=readFileSync('public/assets/furulya-tanulasi-attekintes.svg','utf8');
 assert.ok(illustration.includes('<svg'));
 assert.ok(illustration.includes('Saját szemléltető illusztráció'));
});
