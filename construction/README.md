# Construction — AuditAX Industrialization

This directory contains the full technical and strategic archive of the project.

## Structure

```
construction/
├── sprints/              # Sprint reports (one per sprint)
├── architecture/         # Design documents (domain model, API, etc.)
├── guides/                # User & developer guides
└── decisions/             # Architecture Decision Records (ADRs)
```

## Index

### Sprints
- [Sprint 00 — Kickoff](./sprints/sprint-00-kickoff/README.md)
- [Sprint 01 — Foundation PMS](./sprints/sprint-01-foundation-pms/README.md)
- [Sprint 02 — Reservations](./sprints/sprint-02-reservations/README.md)
- [Sprint 03 — Housekeeping](./sprints/sprint-03-housekeeping/README.md)
- [Sprint 04 — Billing](./sprints/sprint-04-billing/README.md)
- [Sprint 05 — Multi-hotel](./sprints/sprint-05-multi-hotel/README.md)
- [Sprint 06 — Channel Manager](./sprints/sprint-06-channel-manager/README.md)
- [Sprint 07 — Mobile Native](./sprints/sprint-07-mobile-native/README.md)
- [Sprint 08 — Commercial Stack](./sprints/sprint-08-commercial-stack/README.md)
- [Sprint 09 — RBAC & Polish](./sprints/sprint-09-rbac-polish/README.md)
- [Sprint 10 — Industrialization](./sprints/sprint-10-industrialization/README.md)

### Architecture Decision Records
- [000 — Index](./decisions/000-index.md)
- [001 — DDD Architecture](./decisions/001-ddd-architecture.md)
- [002 — Audit Chain (Forensic)](./decisions/002-audit-chain.md)
- [003 — RBAC Model](./decisions/003-rbac-model.md)

### Architecture
- [Backend Overview](./architecture/backend/overview.md)
- [Frontend Overview](./architecture/frontend/overview.md)
- [Domain Model](./architecture/backend/domain-model.md)

### Guides
- [Onboarding](./guides/onboarding.md)
- [Deployment](./guides/deployment.md)
- [Troubleshooting](./guides/troubleshooting.md)

## Conventions

- **Sprint files**: `sprints/sprint-XX-name/README.md`
- **ADRs**: `decisions/XXX-title.md` with format: Context → Decision → Consequences
- **Architecture docs**: living documents, update as code evolves
