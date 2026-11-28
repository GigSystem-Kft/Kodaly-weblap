<?php
declare(strict_types=1);

/**
 * Read-only production deployment scan, intended for authenticated admins.
 * All paths returned are relative to the public webroot; private file content,
 * absolute server paths and file contents are never disclosed.
 *
 * Unlike a root-level glob, walk nested public folders as well. Bound traversal
 * so a misconfigured recursive tree cannot stall an admin request. Symlinked
 * directories are not followed; external symlinks are reported for review.
 */
function deploymentPublicRiskScan(string $webroot, int $maxItems = 50000, int $maxFindings = 100): array {
    $root = realpath($webroot);
    if ($root === false || !is_dir($root)) {
        return ['publicArchives'=>[], 'scanComplete'=>false, 'scannedItems'=>0, 'scanIssue'=>'A webgyökér nem olvasható.'];
    }
    $folders = [$root];
    $findings = [];
    $excludedDirs = [];
    $examined = 0;
    $complete = true;
    $scanIssue = null;
    while ($folders !== [] && $complete) {
        $folder = array_pop($folders);
        try {
            $files = new FilesystemIterator($folder, FilesystemIterator::SKIP_DOTS);
            foreach ($files as $file) {
                if (++$examined > $maxItems) {
                    $scanIssue = 'Az átvizsgálás elérte a bejegyzéskorlátot.';
                    $complete = false;
                    break;
                }
                $path = $file->getPathname();
                $relative = str_replace(DIRECTORY_SEPARATOR, '/', substr($path, strlen($root) + 1));
                $name = $file->getFilename();
                if ($file->isLink()) {
                    // External symlinks can accidentally publish private account data.
                    $target = realpath($path);
                    if ($target === false || ($target !== $root &&
                        !str_starts_with($target, $root . DIRECTORY_SEPARATOR))) {
                        $findings[] = $relative . ' (külső szimbolikus hivatkozás)';
                    }
                    // Never follow symlinked directories while scanning.
                } elseif ($file->isDir()) {
                    // Only the root-level, externally managed .cache is
                    // excluded from traversal. Do not skip arbitrary hidden
                    // directories: .git, .env and nested caches can expose data.
                    // Report the exclusion explicitly to the administrator.
                    if ($relative === '.cache') {
                        $excludedDirs[] = $relative;
                    } elseif (in_array(strtolower($name), ['.git', '.svn', '.hg'], true)) {
                        $findings[] = $relative . '/ (verziókezelési adatok)';
                    } else {
                        $folders[] = $path;
                    }
                } elseif ($file->isFile()) {
                    // Case-insensitive: back-ups can be .SQL, .ZIP, etc. Also
                    // block private credentials and compressed SQL dumps.
                    if (preg_match('/(?:^\.env(?:\..+)?$|^\.htpasswd(?:\..+)?$|\.(?:zip|sql|bak|backup|tar|tgz|7z|dump|sqlite|sqlite3|db|pem|key)$|\.sql\.(?:gz|bz2|xz)$|\.tar\.(?:gz|bz2|xz)$)/iD', $name)) {
                        $findings[] = $relative;
                    }
                }
                if (count($findings) >= $maxFindings) {
                    $scanIssue = 'Az átvizsgálás elérte a biztonsági találatok korlátját.';
                    $complete = false;
                    break;
                }
            }
        } catch (Throwable $error) {
            // A sanitized, root-relative directory label (never an absolute
            // path or an exception message) helps the admin locate permissions
            // problems without exposing private infrastructure details.
            $relativeFolder = substr($folder, strlen($root));
            $relativeFolder = ltrim(str_replace(DIRECTORY_SEPARATOR, '/', $relativeFolder), '/');
            $scanIssue = 'A mappa nem vizsgálható: ' . ($relativeFolder === '' ? '(webgyökér)' : $relativeFolder);
            error_log('Zeneelméleti Műhely deployment scan incomplete: ' . get_class($error));
            $complete = false;
        }
    }
    sort($findings, SORT_STRING);
    return [
        'publicArchives'=>array_values(array_unique($findings)),
        'scanComplete'=>$complete,
        'scannedItems'=>min($examined, $maxItems),
        'scanIssue'=>$scanIssue,
        'excludedDirs'=>$excludedDirs,
    ];
}


/**
 * Detect a mixed frontend/backend deployment before claiming the release is
 * consistent. All three stamps are made by stamp-php-release.py from one
 * checked-out Git commit. Never execute a file from the public directory:
 * the PHP stamp is compared as plain text, without include/eval.
 */
function deploymentBuildFingerprint(string $webroot): array {
    $root = rtrim($webroot, DIRECTORY_SEPARATOR);
    $rawJson = @file_get_contents($root . '/release-build.json');
    $html = @file_get_contents($root . '/index.html');
    $php = @file_get_contents($root . '/api/release-build.php');
    if (!is_string($rawJson) || !is_string($html) || !is_string($php)) {
        return ['buildConsistent'=>false, 'releaseRevision'=>null];
    }
    try { $manifest = json_decode($rawJson, true, 8, JSON_THROW_ON_ERROR); }
    catch (Throwable) { return ['buildConsistent'=>false, 'releaseRevision'=>null]; }
    $revision = is_array($manifest) ? ($manifest['sha'] ?? null) : null;
    $digests = is_array($manifest) ? ($manifest['files'] ?? null) : null;
    $mediaDigests = is_array($manifest) ? ($manifest['media'] ?? null) : null;
    if (($manifest['schema'] ?? null) !== 2 || !is_string($revision) ||
        !preg_match('/^[0-9a-f]{40}$/D', $revision) || !is_array($digests) ||
        !is_array($mediaDigests) || count($mediaDigests) < 379) {
        return ['buildConsistent'=>false, 'releaseRevision'=>null];
    }
    $expectedPhp = "<?php\n// Public, non-secret checked-out release revision.\nreturn '" . $revision . "';\n";
    preg_match_all(
        '/<meta\s+name="zeneelmelet-build-sha"\s+content="([0-9a-f]{40})"\s*\/?>/',
        $html, $htmlStamps
    );
    if ($php !== $expectedPhp || count($htmlStamps[1] ?? []) !== 1 ||
        !hash_equals($revision, $htmlStamps[1][0])) {
        return ['buildConsistent'=>false, 'releaseRevision'=>null];
    }

    // The manifest may never select arbitrary server paths. Require exactly
    // the files prescribed by this application plus the JS/CSS assets that
    // index.html actually loads, to reject both omitted and injected entries.
    $corePhp = [
        'api/index.php', 'api/admin.php', 'api/site-editor.php', 'api/deployment-audit.php',
        'api/tutor-text-generation.php', 'api/tutor-image-generation.php',
        'api/tutor-visuals.php', 'api/creative-answers.php',
        'api/music-answers.php', 'api/vendor/autoload.php',
        'api/tutor-search.php', 'api/tutor-sources.php', 'api/knowledge.php'
    ];
    preg_match_all(
        '~(?:src|href)=["\x27]/(assets/[A-Za-z0-9._-]+\.(?:js|css))["\x27]~',
        $html, $assetMatches
    );
    $entrypoints = array_values(array_unique($assetMatches[1] ?? []));
    if (!array_filter($entrypoints, static fn($asset)=>str_ends_with($asset,'.js'))) {
        return ['buildConsistent'=>false, 'releaseRevision'=>null];
    }
    // index.html does not list dynamically imported Vite chunks. Compare
    // the complete deployed JS/CSS inventory with the stamped manifest.
    $assetRoot = $root . '/assets';
    if (!is_dir($assetRoot) || is_link($assetRoot)) {
        return ['buildConsistent'=>false, 'releaseRevision'=>null];
    }
    $assets = [];
    try {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($assetRoot, FilesystemIterator::SKIP_DOTS)
        );
        foreach ($files as $file) {
            if (!preg_match('/\\.(?:js|css)$/iD', $file->getFilename())) continue;
            if (!$file->isFile() && !$file->isLink()) continue;
            $assets[] = 'assets/' . str_replace(
                DIRECTORY_SEPARATOR, '/',
                substr($file->getPathname(), strlen($assetRoot) + 1)
            );
        }
    } catch (Throwable) {
        return ['buildConsistent'=>false, 'releaseRevision'=>null];
    }
    if (array_diff($entrypoints, $assets) !== []) {
        return ['buildConsistent'=>false, 'releaseRevision'=>null];
    }
    $expectedFiles = array_values(array_unique(array_merge($corePhp, $assets)));
    sort($expectedFiles, SORT_STRING);
    $actualFiles = array_keys($digests);
    sort($actualFiles, SORT_STRING);
    if ($expectedFiles !== $actualFiles) {
        return ['buildConsistent'=>false, 'releaseRevision'=>null];
    }
    foreach ($expectedFiles as $relative) {
        $expected = $digests[$relative];
        $file = $root . '/' . $relative;
        if (!is_string($expected) || !preg_match('/^[0-9a-f]{64}$/D', $expected) ||
            !is_file($file) || is_link($file) || !is_readable($file)) {
            return ['buildConsistent'=>false, 'releaseRevision'=>null];
        }
        $actual = @hash_file('sha256', $file);
        if (!is_string($actual) || !hash_equals($expected, $actual)) {
            return ['buildConsistent'=>false, 'releaseRevision'=>null];
        }
    }
    // A-24: PHP/JS version consistency alone does not prove that the 302
    // textbook pages, 13 rhythm samples or 64 note images survived upload.
    // Hash ALL media files stamped in the same release (including other
    // images/audio/PDF/font files), not just HTML entrypoints.
    for ($grade = 1; $grade <= 4; ++$grade) {
        $count = [1=>72, 2=>69, 3=>80, 4=>81][$grade];
        for ($page = 1; $page <= $count; ++$page) {
            $name = sprintf('tankonyvek/%d/p%03d.jpg', $grade, $page);
            if (!array_key_exists($name, $mediaDigests)) {
                return ['buildConsistent'=>false, 'releaseRevision'=>null];
            }
        }
    }
    for ($page = 1; $page <= 13; ++$page) {
        if (!array_key_exists(sprintf('ritmikai/p%03d.jpg', $page), $mediaDigests)) {
            return ['buildConsistent'=>false, 'releaseRevision'=>null];
        }
    }
    $noteCount = 0;
    foreach ($mediaDigests as $relative => $expected) {
        if (!is_string($relative) || !is_string($expected) ||
            !preg_match('/^[0-9a-f]{64}$/D', $expected) ||
            !preg_match('~^(?:[A-Za-z0-9._-]+/)*[A-Za-z0-9._-]+\\.(?:jpg|jpeg|png|webp|avif|gif|svg|ico|pdf|mp3|wav|ogg|opus|flac|m4a|mp4|webm|mid|midi|mxl|musicxml|woff|woff2|ttf|otf|eot)$~iD', $relative) ||
            in_array('..', explode('/', $relative), true) ||
            str_starts_with($relative, '.') || str_contains($relative, '/.')) {
            return ['buildConsistent'=>false, 'releaseRevision'=>null];
        }
        if (preg_match('~^assets/jegyzet/[^/]+\\.jpg$~iD', $relative)) ++$noteCount;
        $file = $root . '/' . $relative;
        if (!is_file($file) || is_link($file) || !is_readable($file) ||
            !hash_equals($expected, (string) @hash_file('sha256', $file))) {
            return ['buildConsistent'=>false, 'releaseRevision'=>null];
        }
    }
    if ($noteCount < 64) {
        return ['buildConsistent'=>false, 'releaseRevision'=>null];
    }
    // A-24: a server left with unlisted images from an older CloudPanel
    // upload must not report a fully consistent release. Verify the entire
    // deployed MEDIA path set, not just files mentioned by the manifest.
    // The managed root .cache is explicitly excluded, as in the risk scan;
    // all other folders (including hidden ones) remain in scope.
    $actualMedia = [];
    try {
        $filter = new RecursiveCallbackFilterIterator(
            new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS),
            static function (SplFileInfo $item) use ($root): bool {
                $relative = str_replace(
                    DIRECTORY_SEPARATOR, '/',
                    substr($item->getPathname(), strlen($root) + 1)
                );
                if ($relative === '.cache' && $item->isDir()) return false;
                // Do not traverse or silently ignore symlinked directories.
                if ($item->isLink() && $item->isDir()) {
                    throw new RuntimeException('Unexpected linked directory');
                }
                return true;
            }
        );
        $examined = 0;
        foreach (new RecursiveIteratorIterator($filter) as $item) {
            if (++$examined > 50000) {
                return ['buildConsistent'=>false, 'releaseRevision'=>null];
            }
            if (!preg_match('/\\.(?:jpg|jpeg|png|webp|avif|gif|svg|ico|pdf|mp3|wav|ogg|opus|flac|m4a|mp4|webm|mid|midi|mxl|musicxml|woff|woff2|ttf|otf|eot)$/iD',
                            $item->getFilename())) continue;
            if (!$item->isFile() || $item->isLink()) {
                return ['buildConsistent'=>false, 'releaseRevision'=>null];
            }
            $actualMedia[] = str_replace(
                DIRECTORY_SEPARATOR, '/',
                substr($item->getPathname(), strlen($root) + 1)
            );
        }
    } catch (Throwable) {
        return ['buildConsistent'=>false, 'releaseRevision'=>null];
    }
    sort($actualMedia, SORT_STRING);
    $expectedMedia = array_keys($mediaDigests);
    // 1.1 header artwork is deployed by the owner separately from the
    // generated PHP ZIP. Approve only that single, exact original PNG.
    // Do not whitelist arbitrary files or weaken the full media inventory.
    $externalLogo = 'images/zeneelmeleti_muhely_logo_atlatszo.png';
    $externalLogoSha = 'b48c9286aa19fcf522661af71c55888e6b71cfeb6d8a29d857e293227d395934';
    $logoFile = $root . '/' . $externalLogo;
    if (file_exists($logoFile) || is_link($logoFile)) {
        if (!is_file($logoFile) || is_link($logoFile) || !is_readable($logoFile) ||
            !hash_equals($externalLogoSha, (string) @hash_file('sha256', $logoFile))) {
            return ['buildConsistent'=>false, 'releaseRevision'=>null];
        }
        $expectedMedia[] = $externalLogo;
    }
    sort($expectedMedia, SORT_STRING);
    if ($actualMedia !== $expectedMedia) {
        return ['buildConsistent'=>false, 'releaseRevision'=>null];
    }
    return ['buildConsistent'=>true, 'releaseRevision'=>$revision];
}
