# Security Audit Findings

Audit run: 2026-05-20
Tool: `npm audit`
Branch: `feature/modernize`

## Summary

| Severity | Before | After |
|---|---|---|
| Critical | 3 | 0 ✅ |
| High | 20 | 2 ⚠️ |
| Moderate | 8 | 0 ✅ |
| Low | 12 | 10 |
| **Total** | **43** | **12** |

---

## Remaining High Severity Findings

### 1. `@tootallnate/once` — GHSA-vpq2-c234-7xj6

**Where it comes from:**
```
firebase-admin → @google-cloud/storage → teeny-request → http-proxy-agent → @tootallnate/once
```

**Why we cannot fix it:**
The only fix npm suggests is downgrading `firebase-admin` v13 → v10.3.0. This would break Gen 2 Cloud Functions and Node 24 support — worse than the vulnerability itself.

**Real risk:** Very low. This is an internal HTTP proxy used by Google Cloud Storage SDK, not user-facing code.

**Action:** Monitor for a fix in a future `firebase-admin` release.

---

### 2. `serialize-javascript` — GHSA-5c6j-r48x-rmvq

**Where it comes from:**
```
mocha (devDependency only) → serialize-javascript@6.0.2
```

**Why we cannot fix it:**
`mocha` is a devDependency — it only runs locally during `npm test`, never on GCP or in production. The npm suggested fix (downgrade mocha to v11.3.0) is also a regression since we already have v11.7.5.

**Real risk:** Zero in production. Only present on developer machines during local test runs.

**Action:** Monitor for `serialize-javascript` update in a future mocha release.

---

## Low Severity Findings (10)

All 10 low severity findings are transitive dependencies inside Google-owned packages (`firebase-admin`, `firebase-functions`). No fixes are available without breaking changes to core dependencies. These do not affect production security.

---

## What Was Fixed in This Modernization

| Vulnerability | Severity | Fix |
|---|---|---|
| `tough-cookie` Prototype Pollution | CRITICAL | Removed `request` package |
| `jsonwebtoken` multiple CVEs | HIGH | Upgraded `firebase-admin` v11 → v13 |
| `@google-cloud/firestore` key logging | HIGH | Upgraded `firebase-admin` v11 → v13 |
| `express`, `body-parser`, `qs` CVEs | HIGH | Upgraded `firebase-functions` v3 → v7 |
| `ajv`, `brace-expansion`, `semver` | MODERATE | Upgraded dependencies |
