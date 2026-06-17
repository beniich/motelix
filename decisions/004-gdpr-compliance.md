# ADR 004 — RGPD / SOC 2 / ISO 27001 Compliance

**Status**: Implemented  
**Date**: 2026-06  
**Sprint**: Phase 6 - Security Hardening

---

## Context

Following a security audit, we identified 3 critical gaps:

1. **PII stored in cleartext** in the `Guest` table (`phone`, `documentNumber`) — RGPD Article 32 violation
2. **No right to be forgotten** mechanism — RGPD Article 17 violation
3. **Incomplete audit trail** for sensitive operations — SOC 2 Trust Services Criteria gap

---

## Decisions

### A1. PII Encryption (RGPD Article 32)

We encrypt the following fields at the application level using AES-256-GCM:
- `Guest.phone` → encrypted in DB, decrypted in memory at read time
- `Guest.documentNumber` → encrypted in DB
- `Guest.documentNumberHash` → SHA-256 hash for indexed exact-match lookups

**Key derivation**: `SHA-256(JWT_SECRET + PII_ENCRYPTION_SALT)` — override `PII_ENCRYPTION_SALT` per environment in production.

**Trade-off**: SQL `LIKE` searches on `documentNumber` are no longer possible. We use `documentNumberHash` for exact-match lookups, and `firstName/lastName/email` (plaintext) for fuzzy search.

**PII access control**: 
- `STAFF` → masked phone (`+212****`)
- `MANAGER/ADMIN` → full plaintext + audit log of every access (`guest.pii_accessed`)

### A2. Right to be Forgotten (RGPD Article 17)

Endpoint: `POST /api/guests/:id/anonymize` (ADMIN only).

Process:
1. Requires `{ reason: "...", confirm: true }` in request body
2. Logs the full snapshot to the Forensic Ledger **before** modification (legal proof)
3. Replaces all PII with `GUEST_XXXX` / `anonymized-XXX@removed.invalid`
4. **Preserves** financial records (reservations, invoices) for 10-year accounting compliance
5. Zeroes out: `phone`, `nationality`, `documentType`, `documentNumber`, `documentNumberHash`, `preferences`

### B1. Generalized Audit Trail (SOC 2 CC6.1, CC7.2)

Two mechanisms:
1. **Explicit `logAudit()` calls** in critical controllers (auth, guest, super)
2. **`auditMiddleware(action)`** — wraps `res.json()` to log after every successful mutation

Events now covered:
| Event | Trigger |
|-------|---------|
| `user.login` | Successful password auth |
| `user.login_failed` | Bad password, unknown user, inactive user |
| `user.logout` | Explicit logout |
| `user.login_mobile` | Mobile app login |
| `guest.created` | New guest record |
| `guest.updated` | PII change (fields redacted in log) |
| `guest.pii_accessed` | ADMIN/MANAGER views full profile |
| `guest.searched_by_document` | Document number lookup |
| `guest.anonymized` | RGPD Article 17 execution |
| `hotel.created` | Super admin creates hotel |
| `hotel.updated` | Super admin modifies hotel |
| `hotel.archived` | Super admin archives hotel |
| `room.created/updated/deleted` | via `auditMiddleware` |

All events are stored in the **Forensic Ledger** (SHA-256 chained hash), making tampering detectable.

### C1. Session Duration (ISO 27001 A.9.4)

Reduced JWT + cookie `maxAge` from **7 days → 12 hours**:
- Forces daily re-authentication for staff (relevant for hotel shift changes)
- Aligns with ISO 27001 A.9.4 "System and application access control"

### C2. Strict Cache Headers (ISO 27001 A.13)

All `/api/*` responses now include:
```
Cache-Control: no-store, no-cache, must-revalidate, private
Pragma: no-cache
Expires: 0
Surrogate-Control: no-store
```

---

## Compliance Matrix

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| RGPD Art. 17 (Right to erasure) | ✅ Implemented | `POST /api/guests/:id/anonymize` |
| RGPD Art. 32 (Security of processing) | ✅ Implemented | AES-256-GCM for PII fields |
| SOC 2 CC6.1 (Logical access) | ✅ Implemented | RBAC + comprehensive audit trail |
| SOC 2 CC7.2 (System monitoring) | ✅ Implemented | Forensic ledger + Sentry |
| ISO 27001 A.9.4 (System access) | ✅ Implemented | 12h session max |
| ISO 27001 A.10.1 (Cryptographic controls) | ✅ Implemented | AES-256-GCM, bcrypt, SHA-256 chain |
| ISO 27001 A.13 (Communications security) | ✅ Implemented | Strict cache headers |

---

## Out of Scope (Future)

- **Encryption at rest (DB level)**: Requires PostgreSQL + pgcrypto extension (SQLite limitation)
- **HSM/KMS key management**: Requires cloud infra (AWS KMS, GCP Cloud KMS, etc.)
- **GDPR data portability (Art. 20)**: Out of scope for B2B SaaS
- **Cookie consent banner**: Required for EU end-user-facing deployments
- **Refresh token rotation**: Can be added as "remember me" for staff convenience
