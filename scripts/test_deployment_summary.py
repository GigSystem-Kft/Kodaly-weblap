"""Offline safety tests for the A-24 authenticated deployment report summarizer."""
import importlib.util
import io
import json
from pathlib import Path
from unittest import TestCase
from unittest.mock import patch
import contextlib
import sys

SCRIPT = Path(__file__).with_name("summarize-deployment-check.py")
spec = importlib.util.spec_from_file_location("deployment_summary", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
SHA = "a" * 40


def sample(**updates):
    data = {
        "ready": True, "scanComplete": True, "buildConsistent": True,
        "mailConfigured": True, "releaseRevision": SHA,
        "missing": [], "publicArchives": [], "excludedDirs": [".cache"],
        "scanIssue": None,
        "ignoredSensitiveField": "secret-should-never-print",
    }
    data.update(updates)
    return data


def invoke(data, sha=SHA):
    output, errors = io.StringIO(), io.StringIO()
    with patch.object(sys, "argv", [str(SCRIPT), "--expected-sha", sha]), \
         patch.object(sys, "stdin", io.StringIO(data)), \
         contextlib.redirect_stdout(output), contextlib.redirect_stderr(errors):
        status = mod.main()
    return status, output.getvalue(), errors.getvalue()


class SummarizerTests(TestCase):
    def test_good_file_gate_is_not_full_acceptance(self):
        status, out, _ = invoke(json.dumps(sample()))
        self.assertEqual(status, 0)
        result = json.loads(out)
        self.assertTrue(result["file_gate_passed"])
        self.assertEqual(result["excluded_dirs_count"], 1)
        self.assertIn("24-point sign-off", result["manual_checks_still_required"])
        self.assertNotIn("secret-should-never-print", out)

    def test_wrong_sha_blocks(self):
        status, out, _ = invoke(json.dumps(sample(releaseRevision="b" * 40)))
        self.assertEqual(status, 1)
        self.assertFalse(json.loads(out)["expected_sha_match"])

    def test_missing_assets_blocks_without_leaking_paths(self):
        status, out, _ = invoke(json.dumps(sample(missing=["private-leak-path"])))
        self.assertEqual(status, 1)
        self.assertEqual(json.loads(out)["missing_count"], 1)
        self.assertNotIn("private-leak-path", out)

    def test_scan_incomplete_blocks_without_leaking_issue(self):
        status, out, _ = invoke(json.dumps(sample(
            ready=False, scanComplete=False, scanIssue="secret-server-path")))
        self.assertEqual(status, 1)
        self.assertTrue(json.loads(out)["scan_issue_present"])
        self.assertNotIn("secret-server-path", out)

    def test_malformed_or_duplicate_json_rejected(self):
        for source in ("not-json", '{"ready":true,"ready":false}', '{"ready":NaN}'):
            status, out, errors = invoke(source)
            self.assertEqual(status, 2)
            self.assertEqual(out, "")
            self.assertIn("INVALID", errors)
            self.assertNotIn(source, errors)

    def test_missing_boolean_rejected(self):
        status, out, errors = invoke(json.dumps(sample(ready="true")))
        self.assertEqual(status, 2)
        self.assertEqual(out, "")
        self.assertIn("INVALID", errors)


if __name__ == "__main__":
    import unittest
    unittest.main()
