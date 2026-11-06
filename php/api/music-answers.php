<?php
declare(strict_types=1);

/**
 * Carefully reviewed, intentionally small glossary for the offline teacher assistant.
 * No claims that retrieved documents or generative AI produced these answers.
 */
function musicNormalize(string $text): string {
    $text = strtolower(strtr($text, [
        'á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ö'=>'o','ő'=>'o',
        'ú'=>'u','ü'=>'u','ű'=>'u',
        'Á'=>'a','É'=>'e','Í'=>'i','Ó'=>'o','Ö'=>'o','Ő'=>'o',
        'Ú'=>'u','Ü'=>'u','Ű'=>'u'
    ]));
    return $text;
}

function musicBriefRequested(string $question): bool {
    return preg_match('/\b(roviden|tomoren|lenyegretoro|par mondat|egy mondat|rovid valasz|egyszeruen)\b/u',
        musicNormalize($question)) === 1;
}

function musicKnownAnswer(string $question): ?string {
    $q = musicNormalize($question);
    $short = musicBriefRequested($question);
    $answers = [
        '/\bkvintkor[a-z]*\b/' => [
            'A **kvintkör** a hangnemeket kvinttávolság szerint rendezi körbe. Az óramutató járásával megegyező irányban haladva mindig eggyel több kereszt, az ellenkező irányban eggyel több bé kerül az előjegyzésbe. Segít eligazodni a hangnemek és rokonságuk között.',
            'A **kvintkör** a hangnemeket kvintlépések szerint rendezi el. C-dúrból az egyik irányban G-, D-, A-, E-, H-dúr következik (egyre több kereszttel), a másikban F-, B-, Esz-, Asz-dúr (egyre több bével). Az egymás melletti hangnemek közeli rokonok; a párhuzamos moll hangnemek is megjeleníthetők a körön.'
        ],
        '/\bel[o]?jegyz[eé]s[a-z]*\b/' => [
            'Az **előjegyzés** a kotta elején, a kulcs után álló keresztek vagy bék összessége. Megmutatja, mely hangokat kell alapértelmezés szerint módosítani, és általában a hangnemre is utal.',
            'Az **előjegyzés** a kulcs után, az ütemmutató előtt elhelyezett módosítójelek együttese. Az adott hangokat az egész darabban vagy egy új előjegyzésig érinti, hacsak helyi módosítójel másként nem rendelkezik.'
        ],
        '/\btiszta\s+kvint\b|\bkvint[a-z]*\b/' => [
            'A **kvint** öt diatonikus hangfok távolsága. A tiszta kvint hét félhangból áll; például C–G.',
            'A **kvint** öt egymást követő hangnév távolságát fogja át. A tiszta kvint hét félhang, például C–G; létezik szűkített és bővített kvint is.'
        ],
        '/\bkvart[a-z]*\b/' => [
            'A **kvart** négy diatonikus hangfok távolsága. A tiszta kvart öt félhang; például C–F.',
            'A **kvart** négy hangnév távolságát fogja át. A tiszta kvart öt félhangból áll, például C–F.'
        ],
        '/\bhangkoz[a-z]*\b/' => [
            'A **hangköz** két hang magasságának távolsága. Neve a hangfokok számát, minősége pedig a félhangok szerinti nagyságát is kifejezi.',
            'A **hangköz** két hang közötti hangmagasság-különbség. Megnevezése például szekund, terc, kvart vagy kvint; a minősége lehet többek között tiszta, nagy, kis, bővített vagy szűkített.'
        ],
        '/\bszolmiz[a-z]*\b/' => [
            'A **szolmizáció** a hangok éneklését és felismerését segítő szótagrendszer: dó–ré–mi–fá–szó–lá–ti.',
            'A **szolmizáció** a zenei hangviszonyok hallás utáni megértését segíti. A relatív szolmizációban a dó helye a hangnemhez igazodik, így azonos dallamviszonyok más hangmagasságról is énekelhetők.'
        ],
        '/\bharmashangzat[a-z]*\b/' => [
            'A **hármashangzat** három különböző hangból, egymásra épített tercekből álló akkord. Például C–E–G: C-dúr hármashangzat.',
            'A **hármashangzat** két egymásra épített tercből áll. Lehet dúr, moll, szűkített vagy bővített; például C–E–G egy dúr hármashangzat.'
        ],
        '/\bakkord[a-z]*\b/' => [
            'Az **akkord** egyszerre megszólaló vagy összetartozó, több különböző hangból álló hangzat. Gyakori típusa a hármashangzat.',
            'Az **akkord** több különböző hang harmonikus egysége. Az alaphelyzetű dúr hármashangzat például egy nagy és fölötte egy kis tercből épül fel.'
        ],
        '/\butemmutato[a-z]*\b/' => [
            'Az **ütemmutató** megadja az ütem ritmikai beosztását. Például a 3/4-es ütemben három negyedértéknyi idő fér el.',
            'Az **ütemmutató** a kotta elején jelzi az ütem hosszát és alapvető beosztását. A 3/4 három negyedértéket, a 6/8 hat nyolcadértéket jelöl egy ütemben.'
        ],
    ];
    foreach ($answers as $pattern => $forms) {
        if (preg_match($pattern, $q)) return $forms[$short ? 0 : 1];
    }
    return null;
}
