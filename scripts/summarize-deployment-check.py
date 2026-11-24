#!/usr/bin/env python3
"""Summarize authenticated deployment-check JSON without echoing raw server data.

This is a local, offline evidence helper. It never authenticates to a server.
Do not use its output as a substitute for operator review or the 24-point gate.
"""
import argparse
import json
import re
import sys


def unique_keys(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate JSON key")
        result[key] = value
    return result


def summarize(payload, expected_sha):
    if not isinstance(payload, dict):
        raise ValueError("expected JSON object")
    for name in ("ready", "scanComplete", "buildConsistent", "mailConfigured"):
        if type(payload.get(name)) is not bool:
            raise ValueError("required status field missing or invalid: " + name)
    sha = payload.get("releaseRevision")
    if not isinstance(sha, str) or not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ValueError("invalid or missing deployed releaseRevision")
    for name in ("missing", "publicArchives", "excludedDirs"):
        if not isinstance(payload.get(name), list):
            raise ValueError("required list missing: " + name)
    issue = payload.get("scanIssue")
    if issue is not None and not isinstance(issue, str):
        raise ValueError("invalid scanIssue")
    # Only the documented root .cache exception may be skipped by the server scan.
    # Other excluded paths must block release, even when the server claims ready.
    unexpected_exclusions = any(item != ".cache" for item in payload["excludedDirs"])
    # Do not copy names, paths, user-supplied descriptions or response bodies.
    return {
        "evidence_type": "authenticated_deployment_check_summary",
        "deployed_sha": sha,
        "expected_sha_match": sha == expected_sha,
        "ready": payload["ready"],
        "scanComplete": payload["scanComplete"],
        "buildConsistent": payload["buildConsistent"],
        "mailConfigured": payload["mailConfigured"],
        "missing_count": len(payload["missing"]),
        "public_archives_count": len(payload["publicArchives"]),
        "excluded_dirs_count": len(payload["excludedDirs"]),
        "unexpected_exclusions_present": unexpected_exclusions,
        "scan_issue_present": bool(issue),
        "file_gate_passed": (
            sha == expected_sha and payload["ready"] and
            payload["scanComplete"] and payload["buildConsistent"] and
            not payload["missing"] and not payload["publicArchives"] and
            not issue and not unexpected_exclusions
        ),
        "manual_checks_still_required": [
            "SMTP actual delivery", "role authorization", "data retention and restore",
            "asset rights", "independent music review", "24-point sign-off"
        ],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--expected-sha", required=True)
    args = parser.parse_args()
    if not re.fullmatch(r"[0-9a-f]{40}", args.expected_sha):
        parser.error("--expected-sha must be a 40-character Git SHA")
    try:
        payload = json.load(sys.stdin, object_pairs_hook=unique_keys,
                            parse_constant=lambda _: (_ for _ in ()).throw(ValueError("non-finite JSON")))
        result = summarize(payload, args.expected_sha)
    except (ValueError, TypeError, json.JSONDecodeError):
        print("INVALID DEPLOYMENT CHECK DATA (raw server content not printed)", file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if result["file_gate_passed"] else 1


if __name__ == "__main__":
    sys.exit(main())
