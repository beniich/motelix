# 🏨 Sapphire PMS

**Property Management System moderne pour hôtels 4-5★**

[![CI](https://github.com/your-org/sapphire/workflows/CI/badge.svg)](https://github.com/your-org/sapphire/actions)
[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)]()

---

## ✨ Features

- 🏨 **Multi-tenancy** : Plusieurs hôtels sur une seule instance
- 📅 **Réservations** : Anti-overbooking, check-in/out automatisé
- 🧹 **Housekeeping** : PWA mobile-first pour les équipes
- 👥 **CRM complet** : VIP, loyalty, RGPD-compliant
- 💳 **Billing** : Stripe intégré, factures PDF, refunds
- 🔒 **Sécurité** : AES-256-GCM, JWT, audit chain SHA-256
- 📱 **PWA installable** : Fonctionne offline
- 🌐 **i18n ready** : Français + Anglais

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│           Next.js 14 Frontend                │
│     (Mantine v7 + PWA + TypeScript)          │
└──────────────────┬───────────────────────────┘
                   │ HTTP/JSON
┌──────────────────▼───────────────────────────┐
│         Express Backend (TypeScript)         │
│   8 domains DDD · Prisma ORM · Stripe       │
└──────────────────┬───────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼─────┐      ┌────────▼────────┐
│ PostgreSQL  │      │   Stripe API    │
└─────────────┘      └─────────────────┘
```

---

## 🚀 Quick Start (Local Dev)

```bash
# 1. Clone
git clone https://github.com/your-org/sapphire.git
cd sapphire

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev  # → http://localhost:5000

# 3. Frontend (new terminal)
cd ../frontend
cp .env.example .env.local
npm install
npm run dev  # → http://localhost:3000

# 4. Login
# admin@sapphire.luxury / Password123!
```

---

## 🐳 Docker (Production)

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with real secrets

# 2. Start everything
docker-compose up -d

# 3. Run migrations
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx tsx prisma/seed.ts

# 4. Access
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# Nginx:    http://localhost:80
```

---

## 🧪 Tests

```bash
# Backend unit tests
cd backend
npm test

# E2E tests (Playwright)
cd e2e
npm install
npm run install-browsers
npm test
```

---

## 📦 Modules

### Backend (Sprint 1-7)
- **Auth** : Login, JWT, cookies HttpOnly, rate-limit
- **Users** : RBAC, invitations, audit
- **Hotel** : Multi-tenant, settings
- **Rooms** : CRUD, types, statuts
- **Guests** : CRM, PII encryption, RGPD
- **Reservations** : Anti-overbooking Serializable
- **Housekeeping** : Workflow, checklists, photos
- **Billing** : Stripe, refunds, invoices
- **Channel Manager** : OTA sync (mock + ready)
- **Audit** : SHA-256 chained forensic ledger

### Frontend (Sprint 11-16)
- **Dashboard** : KPIs temps réel
- **Rooms** : Vue table + grille, bulk actions
- **Reservations** : Wizard 4 étapes, calendrier mensuel
- **Guests** : CRM avec export RGPD
- **Housekeeping PWA** : Mobile-first offline
- **Billing** : Stripe Elements, PDFs
- **Settings** : Hotel + Users + Audit

---

## 🔒 Sécurité

- ✅ **JWT** 12h sessions, refresh tokens ready
- ✅ **AES-256-GCM** pour PII (tel, passport, allergies)
- ✅ **bcrypt** cost 12 pour passwords
- ✅ **Rate limiting** : 5 tentatives login / 15min
- ✅ **Audit chain** : SHA-256 hash chaîné (RGPD Art. 30)
- ✅ **Helmet** : Headers de sécurité
- ✅ **CORS** : Whitelist origins
- ✅ **SQL Injection** : Prisma parameterized queries
- ✅ **CSRF** : SameSite cookies

---

## 📜 Licence

Proprietary © 2025 Sapphire PMS

---

## 📞 Support

- 📧 support@sapphire.luxury
- 📚 [Documentation](./docs/)
- 🐛 [Issues](https://github.com/your-org/sapphire/issues)
