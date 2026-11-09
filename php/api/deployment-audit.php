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
        return ['publicArchives'=>[], 'scanComplete'=>false, 'scannedItems'=>0];
    }
    $folders = [$root];
    $findings = [];
    $examined = 0;
    $complete = true;
    while ($folders !== [] && $complete) {
        $folder = array_pop($folders);
        try {
            $files = new FilesystemIterator($folder, FilesystemIterator::SKIP_DOTS);
            foreach ($files as $file) {
                if (++$examined > $maxItems) {
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
                    if (in_array(strtolower($name), ['.git', '.svn', '.hg'], true)) {
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
                    $complete = false;
                    break;
                }
            }
        } catch (Throwable) {
            // Permission errors or unreadable directories fail closed: an
            // incomplete scan must never generate a green "ready" badge.
            $complete = false;
        }
    }
    sort($findings, SORT_STRING);
    return [
        'publicArchives'=>array_values(array_unique($findings)),
        'scanComplete'=>$complete,
        'scannedItems'=>min($examined, $maxItems),
    ];
}
