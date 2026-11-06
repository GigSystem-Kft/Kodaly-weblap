<?php
declare(strict_types=1);

/** A zárt, szakmailag ellenőrzött ábrakatalógushoz tartozó témák. */
function tutorVisualTopic(string $question): ?string {
    require_once __DIR__ . '/music-answers.php';
    $q = musicNormalize($question);
    $rules = [
        'kvintkor' => '/kvintkor/',
        'hangkoz' => '/hangkoz|\b(kvint|kvart|terc|szekund|oktav|szext|szeptim)\b/',
        'szolmizacio' => '/szolmiz|\b(do|re|mi|fa|szo|la|ti)\b/',
        'elojegyzes' => '/elojegyz/',
        'modositok' => '/modosito|kereszt|\bbe\b|feloldo/',
        'kulcsok' => '/violinkulcs|basszuskulcs|\bkulcsok\b|\bg.kulcs\b|\bf.kulcs\b/',
        'szunetek' => '/szunetjel|szunetert/',
        'utemmutato' => '/utemmutato|utemfajta/',
        'ritmus' => '/ritmus|szinkopa|triola/',
        'hangsor' => '/hangsor|skala/',
    ];
    foreach ($rules as $id=>$pattern) {
        if (preg_match($pattern, $q)) return $id;
    }
    return null;
}
function tutorImageRequested(string $question): bool {
    require_once __DIR__ . '/music-answers.php';
    return preg_match('/kep(et|eket|en|et)?|kepet|abra|illusztr|mutass|megmutat|vizual|rajz|lathat/i',
        musicNormalize($question)) === 1;
}
function tutorImageReply(string $question, string $previousTopic): ?array {
    if (!tutorImageRequested($question)) return null;
    $topic=tutorVisualTopic($question) ?? tutorVisualTopic($previousTopic);
    if ($topic===null) {
        return ['mode'=>'visual','reply'=>'Ehhez a témához még nincs ellenőrzött szemléltető kép a tananyagaink között.','visuals'=>[]];
    }
    return [
        'mode'=>'visual',
        'reply'=>'Mutatok egy kapcsolódó ábrát a Zeneelméleti Műhely tananyagából. A képre kattintva nagyíthatod.',
        'visuals'=>[$topic]
    ];
}
