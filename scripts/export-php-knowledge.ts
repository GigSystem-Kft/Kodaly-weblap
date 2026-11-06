import { mkdirSync, readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { MUSIC_CHAPTERS } from '../src/data/musicData';
import { CREATIVE_SOURCE, CREATIVE_PRACTICES } from '../src/data/creativeEducation';

type Entry = { source: string; label: string; text: string; creativePractice?: {
  id: string; title: string; theme: string; goal: string; materials: string;
  steps: string[]; observation: string; extension: string; page: string;
} };
const entries: Entry[] = [];
for (const chapter of MUSIC_CHAPTERS) {
  for (const sub of chapter.subchapters) {
    const text = [sub.summary, ...sub.content].filter(Boolean).join('\n\n');
    if (text.length > 12) entries.push({
      source: 'Zeneelméleti Műhely – Tananyag',
      label: `${chapter.title} / ${sub.title}`,
      text: text.slice(0, 5000)
    });
  }
}
for (const practice of CREATIVE_PRACTICES) {
  entries.push({
    source: `${CREATIVE_SOURCE.author} (${CREATIVE_SOURCE.year}) – ${CREATIVE_SOURCE.title} (módszertani feldolgozás)`,
    label: `Kreatív zenei nevelés / ${practice.theme} / ${practice.title}, ${practice.page} oldal`,
    text: [
      'Fejlesztési cél: ' + practice.goal,
      'Csoport: ' + practice.grouping,
      'Előkészítés: ' + practice.materials,
      ...practice.steps,
      'Megfigyelés: ' + practice.observation,
      'Továbbfejlesztés: ' + practice.extension
    ].join('\n'),
    creativePractice: {
      id: practice.id, title: practice.title, theme: practice.theme,
      goal: practice.goal, materials: practice.materials, steps: practice.steps,
      observation: practice.observation, extension: practice.extension, page: practice.page
    }
  });
}
const root = resolve('server-data');
const files = [
  { file: 'jegyzet.txt', label: 'Bartáné Góhér Edit – egyetemi jegyzet' }
];
const sub = join(root, 'forrasok');
if (existsSync(sub)) for (const f of readdirSync(sub).filter(x=>/\.(txt|md)$/i.test(x) && !x.startsWith('_') && !/kesztler[-_ ]zenei[-_ ]alapismeretek/i.test(x))) {
  files.push({ file: 'forrasok/' + f, label: f });
}
for (const item of files) {
  const file = join(root, item.file);
  if (!existsSync(file)) continue;
  const raw = readFileSync(file, 'utf8');
  const re = /(?:^===\s*\[OLDAL\s+(\d+)\][^\n]*===\s*$)|(?:^---\s*(\d+)\.\s*oldal\s*---\s*$)/gim;
  const boundaries = [...raw.matchAll(re)];
  const parts = boundaries.length ? boundaries.map((m,i)=>({
    label: `${m[1] ?? m[2]}. oldal`,
    text: raw.slice(m.index!+m[0].length, boundaries[i+1]?.index ?? raw.length)
  })) : [{label:'forrásrészlet',text:raw}];
  for (const part of parts) {
    for (let offset=0;offset<part.text.length;offset+=1200) {
      const text=part.text.slice(offset,offset+1200).trim();
      if (text.length > 30) entries.push({source:item.label,label:part.label,text});
    }
  }
}
const output=process.argv[2] ?? 'release/api/knowledge.php';
mkdirSync(resolve(output,'..'),{recursive:true});
const base64=Buffer.from(JSON.stringify(entries),'utf8').toString('base64');
writeFileSync(output,'<?php\n// Built knowledge index. PHP executes it; text is not directly downloadable.\nreturn json_decode(base64_decode(\''+base64+'\'), true, 512, JSON_THROW_ON_ERROR);\n');
console.log(`Exported ${entries.length} knowledge passages to ${output}`);
