import { mkdirSync, writeFileSync } from 'node:fs';
import { sourceCoverageReport } from '../server-knowledge';
mkdirSync('public', {recursive:true});
const report = sourceCoverageReport();
writeFileSync('public/source-inventory.json', JSON.stringify(report,null,2) + '\n', 'utf8');
console.log('Forráslefedettség:',report.indexChunks,'indexelt részlet,', report.sources.length,'forráscsoport,',report.missing.length,'hiányzó szükséges fájl');
