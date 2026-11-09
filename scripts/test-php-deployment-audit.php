<?php
declare(strict_types=1);

require __DIR__ . '/../php/api/deployment-audit.php';

function checkDeployment(bool $value, string $message): void {
    if (!$value) { fwrite(STDERR, "FAILED deployment scan: {$message}\n"); exit(1); }
}

$base = sys_get_temp_dir() . '/zeneelmelet-public-audit-' . bin2hex(random_bytes(8));
$root = $base . '/htdocs';
mkdir($root . '/assets/archives/old', 0700, true);
mkdir($root . '/api', 0700, true);
mkdir($root . '/.well-known', 0700, true);
file_put_contents($root . '/index.html', '<html lang="hu">Zeneelméleti Műhely</html>');
file_put_contents($root . '/assets/site-abcdef.js', 'console.log("ok")');
file_put_contents($root . '/.well-known/test.txt', 'safe');
try {
    $clean = deploymentPublicRiskScan($root);
    checkDeployment($clean['scanComplete'] && $clean['publicArchives'] === [], 'ordinary web content should pass');
    checkDeployment($clean['scannedItems'] >= 4, 'nested assets must actually be visited');

    file_put_contents($root . '/assets/archives/old/MEGMENTES.SQL.GZ', 'private SQL backup');
    file_put_contents($root . '/api/.env.production', 'secret SMTP password');
    file_put_contents($root . '/assets/backup.zip', 'private application archive');
    file_put_contents($root . '/assets/archives/old/database.sqlite3', 'private learner data');
    mkdir($root . '/assets/.git');
    $scan = deploymentPublicRiskScan($root);
    checkDeployment($scan['scanComplete'], 'normal nested scan completes');
    foreach ([
        'assets/archives/old/MEGMENTES.SQL.GZ',
        'api/.env.production',
        'assets/backup.zip',
        'assets/archives/old/database.sqlite3',
        'assets/.git/ (verziókezelési adatok)'
    ] as $expected) {
        checkDeployment(in_array($expected, $scan['publicArchives'], true), 'missing public exposure finding: ' . $expected);
    }
    foreach ($scan['publicArchives'] as $finding) {
        checkDeployment(!str_contains($finding, $base), 'absolute server path must not be returned');
    }

    $limited = deploymentPublicRiskScan($root, 2);
    checkDeployment(!$limited['scanComplete'], 'bounded traversal cannot pass without visiting every file');
    $capped = deploymentPublicRiskScan($root, 50000, 2);
    checkDeployment(!$capped['scanComplete'], 'truncated findings cannot pass as a complete scan');

    if (function_exists('symlink')) {
        file_put_contents($base . '/private-config.txt', 'Do not expose');
        if (@symlink($base . '/private-config.txt', $root . '/assets/outside-link.txt')) {
            $external = deploymentPublicRiskScan($root);
            checkDeployment(
                in_array('assets/outside-link.txt (külső szimbolikus hivatkozás)', $external['publicArchives'], true),
                'external symlink to private data must be flagged');
        }
    }

    // A release must agree on the Git SHA AND on actual frontend/PHP bytes.
    // The historical three labels alone could not detect a stale JS/CSS file.
    $releaseSha = str_repeat('a', 40);
    $otherSha = str_repeat('b', 40);
    $meta = '<meta name="zeneelmelet-build-sha" content="' . $releaseSha . '">';
    $jsPath = $root . '/assets/index-ci.js';
    file_put_contents($jsPath, 'console.log("correct release")');
    $coreFiles = [
        'api/index.php', 'api/admin.php', 'api/deployment-audit.php',
        'api/tutor-search.php', 'api/tutor-sources.php', 'api/knowledge.php'
    ];
    foreach ($coreFiles as $relative) {
        file_put_contents($root . '/' . $relative, "<?php // CI fixture {$relative}\n");
    }
    $markup = '<html><head>' . $meta .
        '<script src="/assets/index-ci.js"></script></head><body>Test</body></html>';
    file_put_contents($root . '/index.html', $markup);
    $fileHashes = [];
    foreach ([...$coreFiles, 'assets/index-ci.js'] as $relative) {
        $fileHashes[$relative] = hash_file('sha256', $root . '/' . $relative);
    }
    $writeManifest = static function (string $sha, array $hashes) use ($root): void {
        file_put_contents($root . '/release-build.json', json_encode([
            'schema'=>2,'sha'=>$sha,'files'=>$hashes
        ], JSON_THROW_ON_ERROR));
    };
    $writeManifest($releaseSha, $fileHashes);
    $expectedPhp = "<?php\n// Public, non-secret checked-out release revision.\nreturn '" . $releaseSha . "';\n";
    file_put_contents($root . '/api/release-build.php', $expectedPhp);
    $fingerprint = deploymentBuildFingerprint($root);
    checkDeployment($fingerprint['buildConsistent'] === true &&
        $fingerprint['releaseRevision'] === $releaseSha,
        'matching Git and actual JS/PHP release checksums pass');

    file_put_contents($jsPath, 'console.log("stale JS asset")');
    checkDeployment(deploymentBuildFingerprint($root)['buildConsistent'] === false,
        'stale JavaScript must be caught even when all three revision labels agree');
    file_put_contents($jsPath, 'console.log("correct release")');

    $phpPath = $root . '/api/tutor-search.php';
    file_put_contents($phpPath, '<?php // a different backend build');
    checkDeployment(deploymentBuildFingerprint($root)['buildConsistent'] === false,
        'mixed PHP source must be caught even when three revision labels agree');
    file_put_contents($phpPath, "<?php // CI fixture api/tutor-search.php\n");

    $writeManifest($otherSha, $fileHashes);
    checkDeployment(deploymentBuildFingerprint($root)['buildConsistent'] === false,
        'mixing static and PHP revisions must be blocked');
    $writeManifest($releaseSha, $fileHashes);

    file_put_contents($root . '/index.html',
        '<html><head>' . $meta . $meta . '<script src="/assets/index-ci.js"></script></head></html>');
    checkDeployment(deploymentBuildFingerprint($root)['buildConsistent'] === false,
        'duplicate injected HTML stamps are invalid');
    file_put_contents($root . '/index.html', $markup);

    $incomplete = $fileHashes;
    unset($incomplete['assets/index-ci.js']);
    $writeManifest($releaseSha, $incomplete);
    checkDeployment(deploymentBuildFingerprint($root)['buildConsistent'] === false,
        'manifests omitting required JS must not pass');
    $writeManifest($releaseSha, $fileHashes);

    unlink($root . '/api/release-build.php');
    checkDeployment(deploymentBuildFingerprint($root)['buildConsistent'] === false,
        'missing backend revision stamp fails closed');

    $unavailable = deploymentPublicRiskScan($base . '/does-not-exist');
    checkDeployment(!$unavailable['scanComplete'], 'missing webroot must fail closed');
    fwrite(STDOUT, "Recursive public deployment safety audit tests passed\n");
} finally {
    $cleanup = static function (string $directory) use (&$cleanup): void {
        foreach (new FilesystemIterator($directory, FilesystemIterator::SKIP_DOTS) as $entry) {
            if ($entry->isDir() && !$entry->isLink()) $cleanup($entry->getPathname());
            else unlink($entry->getPathname());
        }
        rmdir($directory);
    };
    $cleanup($base);
}
