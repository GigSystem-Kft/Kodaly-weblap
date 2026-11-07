import test from 'node:test';
import assert from 'node:assert/strict';
import { localKnowledgeReply, searchKnowledge, sourceCoverageReport } from '../server-knowledge';

/**
 * 80 Hungarian question variants test the local retrieval + source attribution.
 * This does NOT pretend to grade remote generative Gemini answers.
 */
const topics = [
 ['hexachord','Hexachord'],['szolmizáció','Szolmizáció'],
 ['ritmus','Ritmus'],['szinkópa','Szinkópa'],
 ['hangköz','Hangköz'],['pentaton','Pentaton'],
 ['dúr','Dúr'],['moll','Moll'],
 ['kvintkör','Kvintkör'],['gregorián','Gregorián'],
 ['Beethoven','Beethoven'],['Liszt','Liszt'],
 ['Kodály','Kodály'],['kotta','Kotta'],
 ['furulya','Furulya'],['zenetörténet','Zenetörténet']
] as const;
const forms = [
 (word:string)=>`Mit jelent a(z) ${word}?`,
 (word:string)=>`Magyarázd el a ${word} fogalmát!`,
 (word:string)=>`Milyen példák vannak a ${word} témájára?`,
 (word:string)=>`Miért fontos a ${word} a zenében?`,
 (word:string)=>`Hol találok forrást a ${word} tananyaghoz?`
];
let index=0;
for (const [term,label] of topics) {
 for(const template of forms) {
  const question=template(term); const n=++index;
  test(`AI-forrás regresszió ${n}/80: ${label}`,()=>{
   const hits=searchKnowledge(question,8);
   assert.ok(hits.length>0,`Nincs forrástalálat: ${question}`);
   assert.ok(hits.every(hit=>hit.source.trim().length>5 && hit.label.trim().length>3),
     'Forrás- vagy leckecím hiányzik');
   const reply=localKnowledgeReply(question);
   assert.ok(reply.length>50,'Üres vagy túl rövid helyi válasz');
   assert.ok(!reply.includes('nem találtam biztosan kapcsolódó részletet'),
     'A tanársegéd alaptalanul közölte, hogy nincs forrás');
   assert.ok(hits.some(hit=>reply.includes(hit.source)),
     'A helyi válasz nem nevezi meg a visszakeresett forrását');
  });
 }
}
test('indexállapot és nem kereshető dokumentumok explicit jelzése',()=>{
 const report=sourceCoverageReport();
 assert.ok(report.indexChunks>=80);
 assert.ok(report.indexedCharacters>20000);
 assert.ok(report.sources.length>=10);
 assert.equal(report.missing.length,0,'Hiányzik egy alapvető tankönyv vagy jegyzet');
 assert.ok(report.omitted.some(x=>x.file.toLowerCase().includes('kesztler')),
  'Az ellenőrizetlen Kesztler OCR kizárását jelezni kell');
 assert.ok(report.sources.every(x=>x.chunks>0 && x.characters>0));
});
test('hexachord válaszhoz tényleges forrás és magyar fogalmi magyarázat kapcsolódik',()=>{
 const hits=searchKnowledge('mit jelent az hogy hexachord',8);
 assert.ok(hits.some(hit=>(hit.label+' '+hit.text).toLowerCase().includes('hexachord')));
 const reply=localKnowledgeReply('mit jelent az hogy hexachord');
 assert.ok(/hat|hathang|diatonikus/i.test(reply));
 assert.ok(/forrás|Zeneelméleti|Kelemen|Zempléni/i.test(reply));
});
