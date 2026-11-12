#!/usr/bin/env python3
"""Read-only public PHP/MySQL/manifest preflight; NOT an A-01–A-24 release approval."""
import argparse
import hashlib
import json
import re
import ssl
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, build_opener, HTTPSHandler, HTTPRedirectHandler


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def reject_duplicate_keys(pairs):
    """Reject ambiguous response objects instead of silently trusting the last value."""
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate JSON object key")
        result[key] = value
    return result


def reject_nonfinite_json(value):
    raise ValueError("non-finite JSON number")


def read_json(opener, url, label, failures):
    request = Request(url, headers={"Accept": "application/json", "Cache-Control": "no-cache"})
    try:
        with opener.open(request, timeout=12) as response:
            if response.status != 200 or "application/json" not in response.headers.get("Content-Type", "").lower():
                failures.append(f"{label}: expected HTTP 200 application/json")
                return None
            raw = response.read(1024 * 1024 + 1)
            if len(raw) > 1024 * 1024:
                failures.append(f"{label}: response exceeds 1 MiB")
                return None
            obj = json.loads(raw, object_pairs_hook=reject_duplicate_keys,
                             parse_constant=reject_nonfinite_json)
            if not isinstance(obj, dict):
                failures.append(f"{label}: expected JSON object")
                return None
            return obj
    except (HTTPError, URLError, TimeoutError, ValueError, OSError) as error:
        failures.append(f"{label}: request failed ({type(error).__name__})")
        return None



def read_frontend_sha(opener, origin, fingerprints, failures):
    """Inspect the HTML actually served at the origin, not a local ZIP."""
    request = Request(origin + "/", headers={"Accept": "text/html", "Cache-Control": "no-cache"})
    try:
        with opener.open(request, timeout=12) as response:
            if response.status != 200 or "text/html" not in response.headers.get("Content-Type", "").lower():
                failures.append("Frontend HTML: expected HTTP 200 text/html")
                return None
            raw = response.read(1024 * 1024 + 1)
            if len(raw) > 1024 * 1024:
                failures.append("Frontend HTML: response exceeds 1 MiB")
                return None
            html = raw.decode("utf-8")
    except (HTTPError, URLError, TimeoutError, ValueError, UnicodeError, OSError) as error:
        failures.append(f"Frontend HTML: request failed ({type(error).__name__})")
        return None
    stamps = re.findall(
        r'<meta\s+name="zeneelmelet-build-sha"\s+content="([0-9a-f]{40})"\s*/?>', html)
    if len(stamps) != 1:
        failures.append("Frontend HTML: exactly one valid build SHA meta tag required")
        return None
    verify_html_assets(opener, origin, html, fingerprints, failures)
    return stamps[0]



def verify_html_assets(opener, origin, html, fingerprints, failures):
    """Hash the JS/CSS entrypoints served to browsers (never arbitrary URLs)."""
    entries = set(re.findall(
        r"""(?:src|href)=["']/(assets/[A-Za-z0-9._/-]+\.(?:js|css))["']""", html))
    if not entries or not any(path.endswith(".js") for path in entries):
        failures.append("Frontend assets: missing JS entrypoint in HTML")
        return
    if len(entries) > 32:
        failures.append("Frontend assets: too many entrypoints")
        return
    if not isinstance(fingerprints, dict):
        failures.append("Frontend assets: missing fingerprint dictionary")
        return
    for path in sorted(entries):
        if ".." in path.split("/") or path not in fingerprints:
            failures.append("Frontend assets: unsafe or unlisted entrypoint " + path)
            continue
        request = Request(origin + "/" + path, headers={
            "Accept": "*/*", "Cache-Control": "no-cache"})
        try:
            with opener.open(request, timeout=12) as response:
                if response.status != 200:
                    failures.append("Frontend assets: HTTP status mismatch for " + path)
                    continue
                # A cap avoids unbounded downloads even for a compromised origin.
                content = response.read(12 * 1024 * 1024 + 1)
                if len(content) > 12 * 1024 * 1024:
                    failures.append("Frontend assets: oversized entrypoint " + path)
                    continue
                actual = hashlib.sha256(content).hexdigest()
                if actual != fingerprints[path]:
                    failures.append("Frontend assets: SHA-256 mismatch for " + path)
        except (HTTPError, URLError, TimeoutError, ValueError, OSError) as error:
            failures.append(f"Frontend assets: request failed for {path} ({type(error).__name__})")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", default="https://zeneelmelet.digitaliskottatar.hu")
    parser.add_argument("--expected-sha", required=True, help="Required exact Git commit SHA expected on the deployed site")
    parser.add_argument("--json", action="store_true", help="Output non-sensitive JSON result")
    args = parser.parse_args()
    origin = args.origin.rstrip("/")
    parsed = urlsplit(origin)
    if (parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password
            or parsed.path or parsed.query or parsed.fragment or parsed.port not in (None, 443)):
        parser.error("--origin must be a bare HTTPS origin without credentials or a custom port")
    if not re.fullmatch(r"[0-9a-f]{40}", args.expected_sha):
        parser.error("--expected-sha must be a lowercase 40-character Git SHA")
    opener = build_opener(HTTPSHandler(context=ssl.create_default_context()), NoRedirect())
    failures = []
    health = read_json(opener, origin + "/api/index.php?route=health", "PHP health", failures)
    if health is not None and (health.get("status") != "ok"
                               or health.get("service") != "zeneelmeleti-muhely-php"):
        failures.append("PHP health: unexpected application identifier or status")
    auth = read_json(opener, origin + "/api/index.php?route=auth/status", "MySQL/auth status", failures)
    if auth is not None:
        if auth.get("available") is not True:
            failures.append("MySQL/auth status: database unavailable")
        if auth.get("invitationRequired") is not True:
            failures.append("MySQL/auth status: invitations not enforced")
        if not isinstance(auth.get("registrationEnabled"), bool):
            failures.append("MySQL/auth status: registrationEnabled missing")
    manifest = read_json(opener, origin + "/release-build.json", "Release manifest", failures)
    sha = manifest.get("sha") if manifest is not None else None
    if manifest is not None:
        if not isinstance(sha, str) or not re.fullmatch(r"[0-9a-f]{40}", sha):
            failures.append("Release manifest: invalid or missing Git SHA")
        elif sha != args.expected_sha:
            failures.append("Release manifest: deployed SHA does not match expected SHA")
        # A valid stamp alone does not prove the presence of a complete
        # manifest. Only the authenticated admin scan verifies live file bytes.
        if manifest.get("schema") != 2:
            failures.append("Release manifest: schema 2 required")
        files = manifest.get("files")
        if not isinstance(files, dict) or not files:
            failures.append("Release manifest: missing file fingerprints")
        else:
            required = ("api/index.php", "api/deployment-audit.php",
                        "api/admin.php", "api/vendor/autoload.php")
            for item in required:
                if item not in files:
                    failures.append(f"Release manifest: missing fingerprint for {item}")
            if not any(name.startswith("assets/") and name.endswith(".js")
                       for name in files if isinstance(name, str)):
                failures.append("Release manifest: missing JavaScript asset fingerprint")
            if not all(isinstance(name, str) and
                       re.fullmatch(r"(?:api/[A-Za-z0-9._/-]+\.php|assets/[A-Za-z0-9._/-]+\.(?:js|css))", name)
                       and ".." not in name.split("/")
                       and isinstance(digest, str)
                       and re.fullmatch(r"[0-9a-f]{64}", digest)
                       for name, digest in files.items()):
                failures.append("Release manifest: invalid file fingerprint entry")
    frontend_sha = read_frontend_sha(opener, origin,
                                     manifest.get("files") if isinstance(manifest, dict) else None,
                                     failures)
    if frontend_sha is not None:
        if frontend_sha != args.expected_sha:
            failures.append("Frontend HTML: build SHA differs from expected SHA")
        if isinstance(sha, str) and frontend_sha != sha:
            failures.append("Frontend HTML: build SHA differs from release manifest")
    result = {"public_preflight_passed": not failures, "origin": origin, "deployed_sha": sha,
              "errors": failures, "not_checked": [
                  "authenticated admin deployment-check", "backup restore", "SMTP",
                  "user roles and two real devices", "license/permission", "music review",
                  "accessibility", "24-point sign-off"]}
    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print("PUBLIC PREFLIGHT " + ("PASSED" if not failures else "FAILED"))
        if sha:
            print("Deployed SHA:", sha)
        for problem in failures:
            print("-", problem)
        print("This is not final release approval; all manual gates remain mandatory.")
    return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(main())
