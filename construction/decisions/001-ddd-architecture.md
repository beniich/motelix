# ADR 001 — DDD Architecture

**Status**: Accepted
**Date**: 2025-01

## Context

The codebase has grown organically across 10 sprints. Modules are mixed:
business logic, infrastructure, UI. This creates:
- High coupling (hard to test)
- Low cohesion (hard to find things)
- Unclear boundaries (hard to refactor)

## Decision

Adopt a **Domain-Driven Design (DDD)** layout, both backend and frontend.

## Structure (Backend)

```text
backend/src/
├── domains/                    # Business logic (one folder per domain)
│   ├── audit/                  # Forensic audit log
│   ├── identity/               # Auth + Users + RBAC
│   │   ├── auth/
│   │   ├── user/
│   │   └── rbac/
│   ├── hotel/                  # Core PMS
│   │   ├── room/
│   │   ├── reservation/
│   │   ├── guest/
│   │   └── housekeeping/
│   ├── billing/                # Invoices + Subscriptions + Payments
│   │   ├── invoice/
│   │   ├── subscription/
│   │   └── payment/
│   ├── channel/                # OTA integrations
│   │   ├── connectors/
│   │   │   ├── booking-com.connector.ts
│   │   │   ├── expedia.connector.ts
│   │   │   └── airbnb.connector.ts
│   │   └── channel.registry.ts
│   ├── analytics/              # BI + Forecast + Pricing
│   ├── compliance/             # GDPR + data export
│   └── shared/                 # Cross-domain utilities
│       ├── errors/
│       ├── middleware/
│       ├── utils/
│       └── types/
├── infrastructure/             # External concerns
│   ├── database/               # Prisma client
│   ├── email/                  # Email service + templates
│   ├── storage/                # S3/R2 client
│   ├── payment/                # Stripe client
│   ├── search/                 # Elasticsearch client
│   ├── queue/                  # BullMQ client
│   └── webhooks/               # Outgoing webhooks
├── app.ts                      # Express app composition
└── server.ts                   # HTTP server bootstrap
```

## Structure (Frontend)

```text
frontend/src/
├── domains/                    # Feature areas
│   ├── auth/                   # Login + auth flow
│   ├── arrivals/               # VIP arrivals dashboard
│   ├── reservations/           # Reservations management
│   ├── billing/                # Invoices
│   ├── guests/                 # Guests + segments
│   ├── channels/               # Channel manager
│   ├── housekeeping/           # Housekeeping
│   ├── analytics/              # Strategic intelligence
│   └── audit/                  # Audit log viewer
├── shared/                     # Reusable building blocks
│   ├── ui/                     # Card, Button, Modal, Toast, etc.
│   ├── hooks/                  # useToast, useClearance, etc.
│   ├── api/                    # apiClient
│   ├── design/                 # tokens, themes
│   ├── layouts/                # MainLayout, AuthLayout
│   └── types/                  # Shared TypeScript types
├── infrastructure/
│   ├── routing/                # Routes config
│   ├── providers/              # ThemeProvider, QueryProvider
│   └── config/                 # env validation
├── App.tsx
└── main.tsx
```

## Rules

1. **Domains don't import each other directly**. If domain A needs domain B, use:
   - Events (publish/subscribe)
   - Shared types in `shared/types/`
   - Composition root (app.ts)

2. **Infrastructure depends on domains, never the reverse**.

3. **Frontend domains mirror backend domains** (1:1 mapping).

4. **Each domain exports a `index.ts`** that re-exports its public API.

## Migration Strategy

We migrate **one domain at a time**, in this order:
1. `audit` (foundational)
2. `identity` (auth + RBAC)
3. `hotel` (rooms, reservations, guests, housekeeping)
4. `billing` (invoices, subscriptions)
5. `channel` (OTA)
6. `analytics`
7. `compliance`
8. Frontend domains (parallel with backend)

**Rule**: at each step, the product must continue to work (incremental migration).

## Consequences

**Positive**:
- Clear domain boundaries
- Easier to test in isolation
- Easier to add new features (follow the pattern)
- New team members find things faster
- Easier to extract microservices later if needed

**Negative**:
- Initial refactor cost (~1 week)
- More boilerplate (interfaces, types)
- May feel "over-engineered" for small features
- Team needs to learn the convention
