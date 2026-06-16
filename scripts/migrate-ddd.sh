#!/usr/bin/env bash
# scripts/migrate-ddd.sh
# Migrate existing structure to DDD layout
# ⚠️  Run this in a feature branch and test thoroughly

set -e

BACKEND=1
FRONTEND=1
DRY_RUN=0

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --backend-only) FRONTEND=0 ;;
    --frontend-only) BACKEND=0 ;;
    --dry-run) DRY_RUN=1 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
  shift
done

# ============ BACKEND MIGRATION ============
if [ $BACKEND -eq 1 ]; then
  echo "📁 Creating backend DDD structure..."
  
  cd backend/src
  
  # Audit
  mkdir -p domains/audit
  [ -f controllers/audit.controller.ts ] && [ $DRY_RUN -eq 0 ] && mv controllers/audit.controller.ts domains/audit/
  [ -f services/auditLog.service.ts ] && [ $DRY_RUN -eq 0 ] && mv services/auditLog.service.ts domains/audit/audit.service.ts
  [ -f routes/audit.routes.ts ] && [ $DRY_RUN -eq 0 ] && mv routes/audit.routes.ts domains/audit/
  
  # Identity (auth + user + rbac)
  mkdir -p domains/identity/auth domains/identity/user domains/identity/rbac
  [ -f controllers/auth.controller.ts ] && [ $DRY_RUN -eq 0 ] && mv controllers/auth.controller.ts domains/identity/auth/auth.controller.ts
  [ -f controllers/leads.controller.ts ] && [ $DRY_RUN -eq 0 ] && mv controllers/leads.controller.ts domains/identity/user/
  [ -f middleware/auth.ts ] && [ $DRY_RUN -eq 0 ] && mv middleware/auth.ts domains/identity/auth/auth.middleware.ts
  [ -f middleware/api-key-auth.ts ] && [ $DRY_RUN -eq 0 ] && mv middleware/api-key-auth.ts domains/identity/auth/api-key.middleware.ts
  [ -f middleware/rbac.ts ] && [ $DRY_RUN -eq 0 ] && mv middleware/rbac.ts domains/identity/rbac/rbac.middleware.ts
  
  # Hotel
  mkdir -p domains/hotel/room domains/hotel/reservation domains/hotel/guest domains/hotel/housekeeping
  [ -f controllers/rooms.controller.ts ] && [ $DRY_RUN -eq 0 ] && mv controllers/rooms.controller.ts domains/hotel/room/room.controller.ts
  [ -f services/availability.service.ts ] && [ $DRY_RUN -eq 0 ] && mv services/availability.service.ts domains/hotel/reservation/availability.service.ts
  [ -f controllers/reservations.controller.ts ] && [ $DRY_RUN -eq 0 ] && mv controllers/reservations.controller.ts domains/hotel/reservation/reservation.controller.ts
  [ -f controllers/housekeeping.controller.ts ] && [ $DRY_RUN -eq 0 ] && mv controllers/housekeeping.controller.ts domains/hotel/housekeeping/
  
  # Billing
  mkdir -p domains/billing/invoice domains/billing/subscription domains/billing/payment
  [ -f controllers/invoices.controller.ts ] && [ $DRY_RUN -eq 0 ] && mv controllers/invoices.controller.ts domains/billing/invoice/
  [ -f controllers/billing.controller.ts ] && [ $DRY_RUN -eq 0 ] && mv controllers/billing.controller.ts domains/billing/subscription/billing.controller.ts
  [ -f controllers/billing-webhook.controller.ts ] && [ $DRY_RUN -eq 0 ] && mv controllers/billing-webhook.controller.ts domains/billing/subscription/stripe-webhook.controller.ts
  [ -f services/payments.service.ts ] && [ $DRY_RUN -eq 0 ] && mv services/payments.service.ts domains/billing/payment/
  [ -f services/invoice.service.ts ] && [ $DRY_RUN -eq 0 ] && mv services/invoice.service.ts domains/billing/invoice/
  
  # Channel
  mkdir -p domains/channel/connectors
  [ -f services/channel.service.ts ] && [ $DRY_RUN -eq 0 ] && mv services/channel.service.ts domains/channel/
  [ -f services/channels/*.ts ] && [ $DRY_RUN -eq 0 ] && mv services/channels/*.ts domains/channel/connectors/
  
  # Analytics
  mkdir -p domains/analytics
  [ -f services/metrics.service.ts ] && [ $DRY_RUN -eq 0 ] && mv services/metrics.service.ts domains/analytics/
  [ -f controllers/admin-metrics.controller.ts ] && [ $DRY_RUN -eq 0 ] && mv controllers/admin-metrics.controller.ts domains/analytics/
  
  # Compliance
  mkdir -p domains/compliance
  
  # Shared
  mkdir -p shared/errors shared/middleware shared/utils shared/types
  [ -f middleware/errorHandler.ts ] && [ $DRY_RUN -eq 0 ] && mv middleware/errorHandler.ts shared/errors/
  [ -f utils/asyncHandler.ts ] && [ $DRY_RUN -eq 0 ] && mv utils/asyncHandler.ts shared/errors/
  [ -f utils/pagination.ts ] && [ $DRY_RUN -eq 0 ] && mv utils/pagination.ts shared/utils/
  [ -f utils/tenant.ts ] && [ $DRY_RUN -eq 0 ] && mv utils/tenant.ts shared/utils/
  [ -f utils/jwt.ts ] && [ $DRY_RUN -eq 0 ] && mv utils/jwt.ts domains/identity/auth/
  
  # Infrastructure
  mkdir -p infrastructure/database infrastructure/email infrastructure/payment infrastructure/webhooks
  [ -f lib/prisma.ts ] && [ $DRY_RUN -eq 0 ] && mv lib/prisma.ts infrastructure/database/prisma.client.ts
  [ -f lib/stripe.ts ] && [ $DRY_RUN -eq 0 ] && mv lib/stripe.ts infrastructure/payment/stripe.client.ts
  [ -f services/email.service.ts ] && [ $DRY_RUN -eq 0 ] && mv services/email.service.ts infrastructure/email/email.service.ts
  [ -f services/webhook-dispatcher.service.ts ] && [ $DRY_RUN -eq 0 ] && mv services/webhook-dispatcher.service.ts infrastructure/webhooks/
  
  cd ../..
fi

echo "✅ DDD migration complete"
echo "⚠️  Run 'npm run typecheck' to find broken imports"
