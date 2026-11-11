#!/usr/bin/env python3
"""Offline regressions for the read-only PHP release preflight."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).with_name("check-live-php-release.py")
spec = importlib.util.spec_from_file_location("live_preflight", SCRIPT)
check = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check)
SHA = "a" * 40
ORIGIN = "https://zeneelmelet.digitaliskottatar.hu"
FINGERPRINTS = {
    "api/index.php": "0" * 64,
    "api/admin.php": "1" * 64,
    "api/deployment-audit.php": "2" * 64,
    "api/vendor/autoload.php": "3" * 64,
    "assets/index-abcd.js": "4" * 64,
}



class Response:
    status = 200

    def __init__(self, data, content_type="application/json"):
        if isinstance(data, bytes):
            self.data = data
        elif content_type == "text/html" and isinstance(data, str):
            self.data = data.encode("utf-8")
        else:
            self.data = json.dumps(data).encode("utf-8")
        self.headers = {"Content-Type": content_type}

    def read(self, limit):
        return self.data[:limit]

    def __enter__(self):
        return self

    def __exit__(self, *_):
        return False


class FakeOpener:
    def __init__(self, replies):
        self.replies = replies
        self.paths = []

    def open(self, req, timeout):
        self.paths.append(req.full_url)
        return self.replies[req.full_url]


def fixture(auth=None, sha=SHA, manifest=None):
    if manifest is None:
        manifest = {"schema": 2, "sha": sha, "files": FINGERPRINTS}
    return FakeOpener({
        ORIGIN + "/api/index.php?route=health":
            Response({"status": "ok", "service": "zeneelmeleti-muhely-php"}),
        ORIGIN + "/api/index.php?route=auth/status":
            Response(auth if auth is not None else {
                "available": True, "invitationRequired": True, "registrationEnabled": False}),
        ORIGIN + "/release-build.json": Response(manifest),
        ORIGIN + "/": Response(
            '<!doctype html><html><head><meta name="zeneelmelet-build-sha" content="' +
            sha + '"></head><body></body></html>', "text/html"),
    })


def invoke(opener, expected=SHA):
    out = io.StringIO()
    with patch.object(sys, "argv", [str(SCRIPT), "--json", "--expected-sha", expected]), \
         patch.object(check, "build_opener", return_value=opener), \
         contextlib.redirect_stdout(out):
        code = check.main()
    return code, json.loads(out.getvalue())


class LivePreflightTests(unittest.TestCase):
    def test_expected_php_and_mysql_and_sha(self):
        opener = fixture()
        code, result = invoke(opener)
        self.assertEqual(code, 0)
        self.assertTrue(result["public_preflight_passed"])
        self.assertEqual(result["deployed_sha"], SHA)
        self.assertEqual(len(opener.paths), 4)
        self.assertIn("24-point sign-off", result["not_checked"])

    def test_mysql_unavailable_fails_closed(self):
        code, result = invoke(fixture(auth={
            "available": False, "invitationRequired": True, "registrationEnabled": False}))
        self.assertEqual(code, 1)
        self.assertTrue(any("database unavailable" in e for e in result["errors"]))

    def test_different_deployed_sha_fails_closed(self):
        code, result = invoke(fixture(sha="b" * 40))
        self.assertEqual(code, 1)
        self.assertTrue(any("does not match" in e for e in result["errors"]))

    def test_missing_invitation_guard_fails_closed(self):
        code, result = invoke(fixture(auth={
            "available": True, "invitationRequired": False, "registrationEnabled": False}))
        self.assertEqual(code, 1)
        self.assertTrue(any("invitations not enforced" in e for e in result["errors"]))

    def test_html_error_response_not_accepted(self):
        opener = fixture()
        opener.replies[ORIGIN + "/release-build.json"] = Response(b"<html>error</html>", "text/html")
        code, result = invoke(opener)
        self.assertEqual(code, 1)
        self.assertTrue(any("application/json" in e for e in result["errors"]))

    def test_oversized_manifest_fails_closed(self):
        opener = fixture()
        opener.replies[ORIGIN + "/release-build.json"] = Response(b" " * (1024 * 1024 + 1))
        code, result = invoke(opener)
        self.assertEqual(code, 1)
        self.assertTrue(any("exceeds 1 MiB" in e for e in result["errors"]))

    def test_manifest_schema_mismatch_fails_closed(self):
        bad = {"schema": 1, "sha": SHA, "files": FINGERPRINTS}
        code, result = invoke(fixture(manifest=bad))
        self.assertEqual(code, 1)
        self.assertTrue(any("schema 2 required" in e for e in result["errors"]))

    def test_manifest_missing_php_fingerprint_fails_closed(self):
        missing = {k: v for k, v in FINGERPRINTS.items() if k != "api/admin.php"}
        code, result = invoke(fixture(manifest={"schema": 2, "sha": SHA, "files": missing}))
        self.assertEqual(code, 1)
        self.assertTrue(any("api/admin.php" in e for e in result["errors"]))

    def test_manifest_invalid_digest_fails_closed(self):
        invalid = dict(FINGERPRINTS, **{"assets/index-abcd.js": "invalid"})
        code, result = invoke(fixture(manifest={"schema": 2, "sha": SHA, "files": invalid}))
        self.assertEqual(code, 1)
        self.assertTrue(any("invalid file fingerprint" in e for e in result["errors"]))

    def test_manifest_path_traversal_fails_closed(self):
        unsafe = dict(FINGERPRINTS, **{"assets/../bad.js": "a" * 64})
        code, result = invoke(fixture(manifest={"schema": 2, "sha": SHA, "files": unsafe}))
        self.assertEqual(code, 1)
        self.assertTrue(any("invalid file fingerprint" in e for e in result["errors"]))

    def test_duplicate_manifest_sha_rejected(self):
        opener = fixture()
        raw = ('{"schema":2,"sha":"' + SHA + '","sha":"' + SHA +
               '","files":{}}').encode()
        opener.replies[ORIGIN + "/release-build.json"] = Response(raw)
        code, result = invoke(opener)
        self.assertEqual(code, 1)
        self.assertTrue(any("request failed" in e for e in result["errors"]))

    def test_duplicate_nested_fingerprint_rejected(self):
        opener = fixture()
        raw = ('{"schema":2,"sha":"' + SHA +
               '","files":{"api/index.php":"' + "0" * 64 +
               '","api/index.php":"' + "1" * 64 + '"}}').encode()
        opener.replies[ORIGIN + "/release-build.json"] = Response(raw)
        code, result = invoke(opener)
        self.assertEqual(code, 1)
        self.assertTrue(any("request failed" in e for e in result["errors"]))

    def test_nan_in_status_rejected(self):
        opener = fixture()
        opener.replies[ORIGIN + "/api/index.php?route=auth/status"] = Response(
            b'{"available":true,"invitationRequired":true,"registrationEnabled":false,"test":NaN}')
        code, result = invoke(opener)
        self.assertEqual(code, 1)
        self.assertTrue(any("request failed" in e for e in result["errors"]))

    def test_frontend_html_wrong_sha_fails_closed(self):
        opener = fixture()
        opener.replies[ORIGIN + "/"] = Response(
            '<meta name="zeneelmelet-build-sha" content="' + "b" * 40 + '">',
            "text/html")
        code, result = invoke(opener)
        self.assertEqual(code, 1)
        self.assertTrue(any("Frontend HTML: build SHA differs" in e for e in result["errors"]))

    def test_frontend_html_missing_stamp_fails_closed(self):
        opener = fixture()
        opener.replies[ORIGIN + "/"] = Response("<html>Old version</html>", "text/html")
        code, result = invoke(opener)
        self.assertEqual(code, 1)
        self.assertTrue(any("exactly one valid" in e for e in result["errors"]))

    def test_frontend_html_repeated_stamp_fails_closed(self):
        opener = fixture()
        tag = '<meta name="zeneelmelet-build-sha" content="' + SHA + '">'
        opener.replies[ORIGIN + "/"] = Response(tag + tag, "text/html")
        code, result = invoke(opener)
        self.assertEqual(code, 1)
        self.assertTrue(any("exactly one valid" in e for e in result["errors"]))

    def test_frontend_html_must_be_html(self):
        opener = fixture()
        opener.replies[ORIGIN + "/"] = Response({"sha": SHA}, "application/json")
        code, result = invoke(opener)
        self.assertEqual(code, 1)
        self.assertTrue(any("expected HTTP 200 text/html" in e for e in result["errors"]))

    def test_redirect_is_not_followed(self):
        handler = check.NoRedirect()
        req = check.Request(ORIGIN)
        self.assertIsNone(handler.redirect_request(req, None, 302, "Moved", {}, "https://other.example/"))

    def test_missing_expected_commit_rejected_before_network(self):
        with patch.object(sys, "argv", [str(SCRIPT), "--json"]):
            with contextlib.redirect_stderr(io.StringIO()):
                with self.assertRaises(SystemExit) as error:
                    check.main()
        self.assertEqual(error.exception.code, 2)

    def test_incorrect_php_health_fails_closed(self):
        opener = fixture()
        opener.replies[ORIGIN + "/api/index.php?route=health"] = Response({
            "status": "ok", "service": "different-service"})
        code, result = invoke(opener)
        self.assertEqual(code, 1)
        self.assertTrue(any("application identifier" in e for e in result["errors"]))

    def test_password_bearing_origin_rejected_before_network(self):
        with patch.object(sys, "argv", [str(SCRIPT), "--origin", "https://user:pass@example.org"]):
            with contextlib.redirect_stderr(io.StringIO()):
                with self.assertRaises(SystemExit) as error:
                    check.main()
        self.assertEqual(error.exception.code, 2)


if __name__ == "__main__":
    unittest.main()
