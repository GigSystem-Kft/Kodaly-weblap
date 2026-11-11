#!/usr/bin/env python3
"""Read-only public PHP/MySQL/manifest preflight; NOT an A-01–A-24 release approval."""
import argparse
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
            obj = json.loads(raw)
            if not isinstance(obj, dict):
                failures.append(f"{label}: expected JSON object")
                return None
            return obj
    except (HTTPError, URLError, TimeoutError, ValueError, OSError) as error:
        failures.append(f"{label}: request failed ({type(error).__name__})")
        return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", default="https://zeneelmelet.digitaliskottatar.hu")
    parser.add_argument("--expected-sha", help="Exact Git commit SHA expected on the deployed site")
    parser.add_argument("--json", action="store_true", help="Output non-sensitive JSON result")
    args = parser.parse_args()
    origin = args.origin.rstrip("/")
    parsed = urlsplit(origin)
    if (parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password
            or parsed.path or parsed.query or parsed.fragment or parsed.port not in (None, 443)):
        parser.error("--origin must be a bare HTTPS origin without credentials or a custom port")
    if args.expected_sha and not re.fullmatch(r"[0-9a-f]{40}", args.expected_sha):
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
        elif args.expected_sha and sha != args.expected_sha:
            failures.append("Release manifest: deployed SHA does not match expected SHA")
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
