<?php
declare(strict_types=1);
// Unit-level validation tests; the live admin route additionally enforces
// authenticated role, same-origin POST and optimistic MySQL revision locking.
function fail(int $status, string $message): never {
    throw new DomainException($status . ':' . $message);
}
require __DIR__ . '/../php/api/site-editor.php';
function checkEditor(bool $ok, string $label): void {
    if (!$ok) throw new RuntimeException($label);
}
function rejectEditor(mixed $value, string $label): void {
    try { siteEditorValidateEntries($value); }
    catch (DomainException) { return; }
    throw new RuntimeException('Unexpected acceptance: ' . $label);
}
checkEditor(siteEditorValidateEntries([]) === [], 'empty draft must clear overrides');
$entry = [
    'home.title'=>[
        'text'=>'A zene **közös** nyelve',
        'style'=>['color'=>'indigo','size'=>'large','spacing'=>'compact']
    ],
    'sub.ritmus-alapok.paragraph.0'=>[
        'text'=>'A ritmus a hangok időbeli rendje.'
    ]
];
$validated = siteEditorValidateEntries($entry);
checkEditor(count($validated) === 2, 'two valid field overrides');
checkEditor($validated['sub.ritmus-alapok.paragraph.0']['style']['size'] === 'default',
    'default size is explicit and stable');
$unicode = siteEditorJson((object)$validated);
checkEditor(str_contains($unicode, 'közös'), 'UTF-8 preserved');

rejectEditor(['user.123.role'=>['text'=>'admin']], 'role escalation key');
rejectEditor(['sub.ritmus-alapok.paragraph.0'=>['text'=>'']], 'blank paragraph');
rejectEditor(['home.title'=>['text'=>str_repeat('x', 6100)]], 'too long');
rejectEditor(['home.title'=>['text'=>'a','style'=>['color'=>'#fff']]], 'free CSS');
rejectEditor(['home.title'=>['text'=>'a','style'=>['color'=>'default','javascript'=>'x']]], 'unexpected style');
rejectEditor([['text'=>'a']], 'numeric array');
rejectEditor(['home.title'=>['text'=>'a','code'=>'<script>']], 'HTML property');
checkEditor(siteEditorValidateEntries(['home.title'=>['text'=>'<script>alert(1)</script>']])
    ['home.title']['text'] === '<script>alert(1)</script>',
    'plain text must stay text, never HTML');
fwrite(STDOUT, "Editor input checks passed\n");
