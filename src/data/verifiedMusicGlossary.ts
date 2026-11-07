/** Ellenőrzött magyar zeneelméleti fogalomtár.
 * A szakmai magyarázatok önálló megfogalmazások, a forrás nem szó szerinti átvétel.
 */
export interface VerifiedGlossaryEntry {
 id:string; keywords:string[]; term:string; definition:string; details:string[];
 sourceTitle:string; sourceUrl:string; imagePage?:string;
}
export const VERIFIED_GLOSSARY:VerifiedGlossaryEntry[]=[
 {
  id:'hexachord',keywords:['hexachord','hexakord','hexachordum','hathangu hangsorszakasz','guidofele szolmizacio'],
  term:'Hexachord (hexakord)',definition:'Hat egymást követő diatonikus hangból álló hangsorszakasz. A Guido-féle középkori szolmizációban az ut–re–mi–fa–sol–la hangsort és egységes egész–egész–fél–egész–egész lépésrendet jelenti.',
  details:[
   'A középkori természetes hexachord: C–D–E–F–G–A (hexachordum naturale).',
   'A kemény hexachord: G–A–H–C–D–E (hexachordum durum).',
   'A lágy hexachord: F–G–A–B–C–D (hexachordum molle); a magyar B itt a H leszállított alakját jelenti.',
   'A középkori rendszerben a szótagok másik hexachordba történő átvezetését mutációnak hívjuk. A mai gyermekdal-elemzésben a hexachord elnevezés gyakran egyszerűen hat egymás melletti hang hangkészletére utal.',
   'Ellenőrzéshez: hasonlítsd össze a C–D–E–F–G–A és a G–A–H–C–D–E lépéssorát. Mindkettőben a harmadik és negyedik hang között van a félhang.'
  ],
  sourceTitle:'Kelemen Judit: Mátyás-korabeli zenei nevelés Sárospatakon a Szalkai-kódex tükrében – Zempléni Múzsa',
  sourceUrl:'https://zemplenimuzsa.hu/latoter/kelemen-judit-matyas-korabeli-zenei-neveles-sarospatakon-a-szalkai-kodex-tukreben/',
  imagePage:'https://commons.wikimedia.org/wiki/File:Guidonian_hand.jpg'
 },
 {
  id:'guido_kez',keywords:['guidokez','guido kez','guidofele kez','arezzoi guido','manus guidonis'],
  term:'Guido-kéz',definition:'Középkori, kézre épített tanítási és hangmagassági szemléltető rendszer; a kéz részeihez hangokat és szolmizációs szótagokat rendeltek.',
  details:['A Guido-kéz a középkori hexachordok, a hangfokok és az egyik hexachordból a másikba történő váltás szemléltetését segítette.','A megjelenített hangok neve és szolmizációs szótagja a hexachordok átfedése miatt többféle lehetett.'],
  sourceTitle:'Kelemen Judit – A Guido-kéz és a hexachord-rendszer történeti magyarázata (Zempléni Múzsa)',
  sourceUrl:'https://zemplenimuzsa.hu/latoter/kelemen-judit-matyas-korabeli-zenei-neveles-sarospatakon-a-szalkai-kodex-tukreben/',
  imagePage:'https://commons.wikimedia.org/wiki/File:Guidonian_hand.jpg'
 }
];
