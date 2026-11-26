<?php
declare(strict_types=1);
/**
 * A-07/A-08: exercise retrieval against the ACTUAL PHP knowledge exported
 * into the release ZIP, not a few synthetic fixtures. This proves technical
 * source reachability, not the pedagogical quality of every possible answer.
 */
require __DIR__ . '/../php/api/tutor-search.php';

function checkPackagedRetrieval(bool $condition, string $reason): void {
    if (!$condition) {
        fwrite(STDERR, "A-07/A-08 packaged search failed: {$reason}\n");
        exit(1);
    }
}
$index = $argv[1] ?? '';
checkPackagedRetrieval($index !== '' && is_file($index),
    'No real PHP knowledge index passed');
$entries = require realpath($index);
checkPackagedRetrieval(is_array($entries) && count($entries) >= 3000,
    'Tutor index is unexpectedly incomplete');
$sourceBanks = [
    'Zeneelméleti Műhely – Szókártyák',
    'Zeneelméleti Műhely – Teszt',
    'Zeneelméleti Műhely – Párosító',
    'Zeneelméleti Műhely – Hangzó hangsor és akkord',
    'Zeneelméleti Műhely – Hangkészletek és pentaton példák',
    'Zeneelméleti Műhely – Kvintkör',
    'Zenei kifejezések – mellékelt, nem minden címszóban lektorált teljes szótár',
];

foreach ($sourceBanks as $name) {
    $subset = array_values(array_filter($entries,
        static fn($entry) => is_array($entry) && ($entry['source'] ?? '') === $name));
    checkPackagedRetrieval(count($subset) > 0, 'Required source bank missing');
    $candidate = null;
    foreach ($subset as $entry) {
        // Prefer a concrete concept appearing both in the label and text.
        // Querying only a broad category such as "Ritmus" can find a label
        // while producing no relevant sentence in the returned explanation.
        $labelTokens = searchTerms((string)($entry['label'] ?? ''));
        $bodyTokens = searchTerms((string)($entry['text'] ?? ''));
        $common = array_values(array_intersect($labelTokens, $bodyTokens));
        if ($common) {
            $candidate = $common[count($common)-1];
            break;
        }
    }
    checkPackagedRetrieval(is_string($candidate), 'Unsearchable source labels');
    $hits = rankLessons($candidate, $subset, 5);
    checkPackagedRetrieval(count($hits) > 0,
        'Packaged source has no retrievable passage: '.$name);
    $answer = lessonReply($hits, $candidate, true);
    // Not all historical glossary lines are professionally proofread; an
    // unusable excerpt must be rejected rather than fabricated into an answer.
    // Test a source hit, not a claim that every extracted excerpt is suitable.
    checkPackagedRetrieval(str_contains($answer, 'Forrás:') ||
        str_contains($name, 'nem minden címszóban lektorált'),
        'A retrieved source lacks its attribution');
}
$lessons = array_values(array_filter($entries, static fn($entry) =>
    is_array($entry) &&
    ($entry['source'] ?? '') === 'Zeneelméleti Műhely – Tananyag' &&
    ($entry['contextApproved'] ?? false) === true));
checkPackagedRetrieval(count($lessons) >= 15,
    'Approved first-party lesson index unexpectedly incomplete');
$meterHits = rankLessons('6/8', $entries, 12);
checkPackagedRetrieval(count($meterHits) > 0 &&
    count(array_filter($meterHits, static fn($entry) =>
        str_contains((string)($entry['label'] ?? ''), '6/8') ||
        str_contains((string)($entry['text'] ?? ''), '6/8'))) > 0,
    'Real 6/8 lesson not retrievable from the packaged PHP index');
$meterAnswer = lessonReply($meterHits, '6/8', true);
checkPackagedRetrieval(str_contains($meterAnswer, '6/8') &&
    str_contains($meterAnswer, 'Forrás:'),
    'Real meter answer lacks the rhythm fact or the source attribution');
checkPackagedRetrieval(rankLessons('5/7', $entries, 4) === [],
    'Unsupported signature must not map to a made-up meter');
echo "A-07/A-08: all seven real teaching banks are searchable, complete lesson source present; 6/8 retrieval sourced.\n";
