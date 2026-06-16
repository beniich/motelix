# ADR 002 — Audit Chain (SHA-256 Hash)

**Status**: Accepted
**Date**: 2025-01

## Context

Regulatory compliance (GDPR, SOC2, financial audits, internal trust) requires:
- Every critical mutation logged
- Tamper-proof (detect if logs were modified)
- Chain integrity (each entry references the previous)

A simple append-only log is not enough: an attacker (or bug) could modify or delete past entries without detection.

## Decision

Implement a **chained hash audit log**:
- Each `AuditEvent` includes `hash` = SHA-256 of (previous_hash + canonicalized_payload)
- Genesis hash = "0" × 64
- `previousHash` references the previous event's `hash`
- Detection of tampering via chain validation endpoint
- Genesis is created on first event (auto)

## Schema

```prisma
model AuditEvent {
  id           String   @id @default(cuid())
  timestamp    DateTime @default(now())
  
  actor        String   // userId or "system"
  action       String   // "reservation.created", "invoice.voided", etc.
  resource     String   // "reservation", "invoice", etc.
  resourceId   String?
  
  before       Json?    // snapshot before mutation
  after        Json?    // snapshot after mutation
  metadata     Json?    // requestId, ip, userAgent, etc.
  
  previousHash String   // 64 chars (SHA-256 hex)
  hash         String   // 64 chars (SHA-256 hex)
  
  @@index([actor, timestamp])
  @@index([resource, resourceId])
  @@index([timestamp])
  @@index([action])
}
```

## Hash computation

```typescript
import { createHash } from 'node:crypto';

function canonicalize(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + canonicalize(obj[k])).join(',') + '}';
}

function computeHash(previousHash: string, payload: object): string {
  return createHash('sha256')
    .update(previousHash + canonicalize(payload))
    .digest('hex');
}
```

**Why canonical JSON?**
- `JSON.stringify({a:1,b:2})` and `JSON.stringify({b:2,a:1})` produce different strings
- We sort keys to ensure deterministic output
- Otherwise two equivalent payloads would produce different hashes

## Verification endpoint

```http
GET /api/audit/verify
Authorization: Bearer <admin_token>

200 OK
{
  "valid": true,
  "eventsChecked": 1234,
  "brokenAt": null
}

200 OK (chain broken)
{
  "valid": false,
  "eventsChecked": 456,
  "brokenAt": "clxyz..."
}
```

The verification:
1. Iterates events in chronological order
2. Recomputes each hash from `(previousHash + payload)`
3. Compares to stored `hash`
4. If any mismatch → returns the ID of the broken event

## Recovery strategy

If the chain is broken:
1. **Detect the break**: `/api/audit/verify` shows the first broken event
2. **Assess scope**: how many events are corrupted?
3. **Investigate**: was it a bug, an attack, or a migration error?
4. **Reseed**: if needed, recompute the chain from a known-good backup
5. **Document**: add an `AuditChainResumed` event explaining the break

## Integration pattern

In every mutation controller:

```typescript
export const createReservation = asyncHandler(async (req, res) => {
  const reservation = await prisma.reservation.create({ data: req.body });
  
  await logAudit({
    actor: req.user!.userId,
    action: 'reservation.created',
    resource: 'reservation',
    resourceId: reservation.id,
    after: reservation,
  }, req);
  
  res.status(201).json({ reservation });
});
```

## Consequences

**Positive**:
- Tamper-evident (regulatory requirement)
- Cryptographic proof of integrity
- Easy verification (one endpoint)
- Compliance-ready (SOC2, GDPR Article 30)

**Negative**:
- Performance: SHA-256 on every write (~0.1ms, negligible)
- Storage: ~64 bytes more per event
- Single chain: if migration fails, chain is broken (recovery needed)
- Requires careful refactoring of existing mutations

## Performance

At 1000 events/second (extreme), SHA-256 hashing adds ~100ms of CPU per second (0.1ms × 1000). Negligible.

## Acceptance criteria

- [ ] Every critical mutation logs an audit event
- [ ] Chain integrity is verified on every verification call
- [ ] Frontend shows "Chain integrity: VALID" badge
- [ ] Export endpoint returns CSV for compliance audits
- [ ] Broken chain is detected and surfaced in < 1 second
