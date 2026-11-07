import { FOUNDATIONS_GUIDES } from './musicFoundationsGuide';

/** The chapters predate the new learning layout. Each original subchapter keeps its
 * stable ID and receives its own matching university-level explanation instead of
 * showing all four chapter-wide essays on the first page only. */
const SECTION_MAP: Record<string, number[]> = {
 'ritmus-alapok':[0,1], 'ritmuskepsz':[1,3], 'tempo-utem':[0,1,2,3],
 'abszolutm-hangok':[0,1], 'modositok':[2,3],
 'kottaolvasas':[0,1],
 'szolmizacio-elonyai':[0,3], 'hangkoz-fajtak':[1,2,3],
 'ton-hangkeszlet':[0,1,3], 'chord-hangkeszlet':[0,1,3],
 'pentaton-gyakorlat':[1,2,3],
 'dúr-es-modalis':[0,2], 'moll-hangsorok':[1,2],
 'harmashangzatok':[3], 'kvintkor':[2], 'hangzat-forditas':[3]
};
export function getFoundationsSubchapterGuide(chapterId:string, subchapterId:string) {
 const guide=FOUNDATIONS_GUIDES.find(item=>item.chapterId===chapterId);
 if (!guide) return undefined;
 const sections=SECTION_MAP[subchapterId];
 // Unknown future lessons fall back to a relevant, complete chapter guide.
 const picked=sections?.map(index=>guide.sections[index]).filter((section): section is typeof guide.sections[number]=>Boolean(section)) ?? guide.sections;
 return {...guide,sections:picked};
}
export const FOUNDATIONS_SUBCHAPTER_IDS=Object.keys(SECTION_MAP);
