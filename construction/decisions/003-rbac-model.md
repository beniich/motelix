# ADR 003 — RBAC Model

**Status**: Accepted
**Date**: 2025-01

## Context

The product has multiple user types with different access levels:
- **STAFF**: housekeepers, receptionists
- **MANAGER**: hotel managers
- **ADMIN**: hotel owners
- **SUPER_ADMIN**: group admins (multi-property)

A naive boolean check (`isAdmin`) doesn't scale. We need a fine-grained permission model.

## Decision

Implement a **Role-Based Access Control (RBAC)** with:
- 4 roles (STAFF, MANAGER, ADMIN, SUPER_ADMIN)
- ~25 permissions grouped by domain
- Permission-based middleware (not role-based)
- Frontend mirroring (same permissions, hide what user can't do)
- Audit log on permission denials

## Roles

| Role | Description | Inheritance |
|------|-------------|-------------|
| **STAFF** | Housekeeping, front desk | — |
| **MANAGER** | Hotel manager (single property) | STAFF + |
| **ADMIN** | Hotel owner (single property) | MANAGER + |
| **SUPER_ADMIN** | Group owner (multi-property) | ADMIN + |

## Permission matrix

```typescript
const PERMISSIONS_BY_ROLE = {
  STAFF: [
    'rooms:read',
    'reservations:read', 'reservations:create', 'reservations:edit',
    'reservations:checkIn', 'reservations:checkOut',
    'housekeeping:read', 'housekeeping:edit',
    'guests:read', 'guests:create', 'guests:edit',
  ],
  MANAGER: [
    // + STAFF
    'rooms:create', 'rooms:edit', 'rooms:delete',
    'reservations:delete', 'reservations:cancel',
    'invoices:read', 'invoices:create', 'invoices:edit', 'invoices:refund',
    'users:read', 'users:create', 'users:edit',
    'channels:read', 'channels:manage',
    'export:data',
  ],
  ADMIN: [
    // + MANAGER
    'users:delete',
    'billing:read', 'billing:manage',
    'audit:read',
    'settings:read', 'settings:manage',
    'hotel:delete',
  ],
  SUPER_ADMIN: [
    // + ADMIN
    'super:all',
  ],
};
```

## Middleware

```typescript
// Backend
import { requirePermission } from './rbac.middleware.js';

router.post('/api/rooms', 
  requireAuth, 
  requirePermission('rooms:create'), 
  ctrl.createRoom
);
```

```typescript
// Frontend
import { RestrictedAction } from '@/shared/ui/RestrictedAction';

<RestrictedAction action="rooms:delete" fallback="lock-overlay">
  <Button variant="danger">Delete Room</Button>
</RestrictedAction>
```

## Audit on denial

Every `requirePermission` failure logs an audit event:

```typescript
// In requirePermission middleware
if (!hasPermission(user.role, permission)) {
  await logAudit({
    actor: user.id,
    action: 'rbac.access_denied',
    resource: req.path,
    metadata: { permission, required: permission, actual: user.role },
  }, req);
  throw new ApiError(403, `Forbidden: requires '${permission}'`);
}
```

## Frontend mirroring

| Backend | Frontend |
|---------|----------|
| `requirePermission` middleware | `<RestrictedAction>` component |
| Returns 403 | Shows lock overlay |
| Logs audit | Hides element (if `fallback="hide"`) |

## Consequences

**Positive**:
- Granular control (25+ permissions)
- Easy to add new permissions
- Audit trail for compliance
- Frontend auto-hides (better UX than error messages)

**Negative**:
- More boilerplate (permission checks everywhere)
- Need to keep backend and frontend in sync
- Permission changes need code deploy (no runtime config)
