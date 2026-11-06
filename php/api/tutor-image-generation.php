<?php
declare(strict_types=1);

/**
 * Optional, paid Gemini image generation, disabled unless explicitly enabled.
 * Returns an ephemeral data URL (not persisted and not exposed to other users).
 * Never disclose the API key to the browser or logs.
 */
function tutorImageGenerationEnabled(array $config): bool {
    $ai = $config['tutor_image_generation'] ?? [];
    return is_array($ai) &&
        ($ai['enabled'] ?? false) === true &&
        is_string($ai['api_key'] ?? null) &&
        trim($ai['api_key']) !== '' &&
        in_array($ai['model'] ?? '', [
            'gemini-2.5-flash-image',
            'gemini-3.1-flash-image'
        ], true);
}
function tutorImagePrompt(string $question, string $previousTopic): string {
    $context = trim($previousTopic);
    $topic = trim($question);
    // User text is treated as subject/context, not permission to alter system settings.
    return "Create one accurate, clear educational music-theory illustration for a Hungarian learner. " .
        "Use a clean white background, readable note names and only correct musical relationships. " .
        "When relevant, show actual keyboard keys or a five-line musical stave. " .
        "Do not add made-up sources, logos, dates, or claims of verified correctness. " .
        "If the learner requests a chord, depict its precise notes and intervals. " .
        "If a complex diagram would be unreliable, use a simple small example. " .
        "Topic discussed previously: " . substr($context, 0, 500) . "\n" .
        "Learner's current request: " . substr($topic, 0, 500) . "\n" .
        "Generate the image, not a text-only explanation.";
}
function generateTutorImage(array $config, string $question, string $previousTopic): array {
    if (!tutorImageGenerationEnabled($config)) {
        return [
            'mode' => 'image-unavailable',
            'reply' => 'Önálló képgenerálás még nincs bekapcsolva. Ehhez külön, szerveren tárolt Gemini API-kulcs és a képgenerálás engedélyezése szükséges.',
        ];
    }
    if (!function_exists('curl_init')) {
        throw new RuntimeException('PHP cURL extension required for image generation');
    }
    $ai = $config['tutor_image_generation'];
    $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/' .
        rawurlencode($ai['model']) . ':generateContent';
    $request = [
        'contents' => [[
            'role' => 'user',
            'parts' => [['text' => tutorImagePrompt($question, $previousTopic)]],
        ]],
        'generationConfig' => ['responseModalities' => ['IMAGE']],
    ];
    $handle = curl_init($endpoint);
    if ($handle === false) throw new RuntimeException('Image API connection initialization failed');
    curl_setopt_array($handle, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'x-goog-api-key: ' . $ai['api_key'],
        ],
        CURLOPT_POSTFIELDS => json_encode($request, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => 65,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_MAXREDIRS => 0,
    ]);
    try {
        $body = curl_exec($handle);
        $http = (int)curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        if (!is_string($body) || strlen($body) > 12_000_000 || $http < 200 || $http >= 300) {
            // Intentionally do not expose upstream error bodies (may contain sensitive details).
            return ['mode' => 'image-error',
                'reply' => 'A képgeneráló szolgáltatás most nem tudott képet készíteni. Próbáld később, vagy ellenőrizd az API-keretet.'];
        }
    } finally {
        curl_close($handle);
    }
    try {
        $result = json_decode($body, true, 24, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        return ['mode'=>'image-error','reply'=>'Nem értelmezhető válasz érkezett a képgeneráló szolgáltatástól.'];
    }
    $parts = $result['candidates'][0]['content']['parts'] ?? [];
    if (!is_array($parts)) $parts = [];
    foreach ($parts as $part) {
        $inline = $part['inlineData'] ?? null;
        if (!is_array($inline)) continue;
        $mime = $inline['mimeType'] ?? '';
        $b64 = $inline['data'] ?? null;
        if (!in_array($mime, ['image/png','image/jpeg','image/webp'], true) ||
            !is_string($b64) || strlen($b64) > 10_000_000) continue;
        $decoded = base64_decode($b64, true);
        if ($decoded === false || strlen($decoded) > 6_000_000 || strlen($decoded) < 128) continue;
        if (@getimagesizefromstring($decoded) === false) continue;
        return [
            'mode' => 'generated-image',
            'reply' => 'Elkészítettem egy új szemléltető képet a témáról. Az AI által készített kottákat és hangközöket érdemes szakmailag ellenőrizni.',
            'generatedImage' => 'data:' . $mime . ';base64,' . $b64,
        ];
    }
    return ['mode'=>'image-error','reply'=>'A modell nem küldött használható képet ehhez a kéréshez.'];
}
