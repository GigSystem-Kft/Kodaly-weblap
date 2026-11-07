import test from 'node:test';
import assert from 'node:assert/strict';
import { CURATED_MEDIA } from '../src/data/curatedMusicMedia';
import { VERIFIED_GLOSSARY } from '../src/data/verifiedMusicGlossary';

test('each chapter offers sourced, clearly identified visual or video material',()=>{
 assert.ok(CURATED_MEDIA.length>=15);
 assert.equal(new Set(CURATED_MEDIA.map(item=>item.id)).size,CURATED_MEDIA.length);
 for(let n=1;n<=8;n++) assert.ok(CURATED_MEDIA.some(item=>item.chapters.includes(n)),'chapter '+n+' missing');
 for(const item of CURATED_MEDIA){
   assert.ok(item.title.length>8 && item.note.length>30);
   assert.ok(item.url.startsWith('https://'));
   assert.ok(item.chapters.every(n=>n>=1&&n<=8));
   if(item.imageUrl) {
     assert.ok(item.imageUrl.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'));
     assert.ok(item.license);
   }
 }
});
test('historical terms have Hungarian explanations and attributed specialist sources',()=>{
 assert.ok(VERIFIED_GLOSSARY.some(x=>x.id==='hexachord'));
 const hex=VERIFIED_GLOSSARY.find(x=>x.id==='hexachord')!;
 assert.ok(hex.definition.includes('ut–re–mi–fa–sol–la'));
 assert.ok(hex.details.some(t=>t.includes('G–A–H–C–D–E')));
 assert.ok(hex.details.some(t=>t.includes('F–G–A–B–C–D')));
 assert.ok(hex.sourceUrl.includes('zemplenimuzsa.hu'));
});
