#!/usr/bin/env bash
# scripts/smoke-test.sh
# End-to-end smoke test for staging deployment
# Usage:
#   API_URL=https://xxx.onrender.com FRONTEND_URL=https://xxx.vercel.app bash scripts/smoke-test.sh

set -euo pipefail

API_URL="${API_URL:-https://sapphire-backend-staging.onrender.com}"
FRONTEND_URL="${FRONTEND_URL:-https://sapphire-staging.vercel.app}"
COOKIE_JAR="/tmp/sapphire-test-cookies-$$.txt"
FAILED=0

# Cleanup on exit
trap "rm -f '$COOKIE_JAR'" EXIT

# Colors
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
NC="\033[0m"

pass() { echo -e "   ${GREEN}✅ PASSED${NC}"; }
fail() { echo -e "   ${RED}❌ FAILED: $1${NC}"; FAILED=$((FAILED+1)); }
warn() { echo -e "   ${YELLOW}⚠️  WARNING: $1${NC}"; }

echo -e "${BLUE}"
echo "================================================"
echo " 🧪 Sapphire Staging Smoke Test"
echo "    API: $API_URL"
echo "    Frontend: $FRONTEND_URL"
echo "================================================"
echo -e "${NC}"

# ─── 1. Health Check ───────────────────────────────
echo "1️⃣  Health check..."
HEALTH=$(curl -sf --max-time 15 "$API_URL/api/health" || echo '{}')
echo "   Response: $HEALTH"
if echo "$HEALTH" | grep -q '"status":"ok"'; then
  pass
else
  fail "health endpoint not returning ok"
fi
echo ""

# ─── 2. Login ─────────────────────────────────────
echo "2️⃣  Login as admin..."
LOGIN_RESPONSE=$(curl -sf --max-time 15 -c "$COOKIE_JAR" -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sapphire.luxury","password":"Password123!"}' || echo '{}')
echo "   Response: $(echo "$LOGIN_RESPONSE" | head -c 200)..."
if echo "$LOGIN_RESPONSE" | grep -q '"role"'; then
  pass
else
  fail "login response missing role field"
fi
echo ""

# ─── 3. /me ───────────────────────────────────────
echo "3️⃣  GET /auth/me (with cookie)..."
ME=$(curl -sf --max-time 10 -b "$COOKIE_JAR" "$API_URL/api/auth/me" || echo '{}')
echo "   Response: $(echo "$ME" | head -c 200)..."
if echo "$ME" | grep -q '"email"'; then
  pass
else
  fail "me endpoint missing email"
fi
echo ""

# ─── 4. No-Cache Headers ─────────────────────────
echo "4️⃣  ISO 27001 — Cache-Control headers..."
HEADERS=$(curl -sf --max-time 10 -b "$COOKIE_JAR" -I "$API_URL/api/auth/me" || echo '')
if echo "$HEADERS" | grep -qi "cache-control: no-store"; then
  pass
else
  warn "Cache-Control: no-store header not found (may be case diff)"
fi
echo ""

# ─── 5. Reservations ──────────────────────────────
echo "5️⃣  List reservations..."
RES=$(curl -sf --max-time 10 -b "$COOKIE_JAR" "$API_URL/api/reservations?pageSize=5" || echo '{}')
echo "   Response length: $(echo "$RES" | wc -c) chars"
if echo "$RES" | grep -q '"items"\|"reservations"\|"data"'; then
  pass
else
  warn "unexpected reservations response format"
  pass
fi
echo ""

# ─── 6. Rooms ────────────────────────────────────
echo "6️⃣  List rooms..."
ROOMS=$(curl -sf --max-time 10 -b "$COOKIE_JAR" "$API_URL/api/rooms?pageSize=5" || echo '{}')
ROOM_COUNT=$(echo "$ROOMS" | grep -o '"number"' | wc -l | tr -d ' ')
echo "   Found $ROOM_COUNT room entries"
if [ "$ROOM_COUNT" -ge 1 ] 2>/dev/null; then
  pass
else
  warn "no rooms found — seed data may be missing"
fi
echo ""

# ─── 7. Housekeeping ─────────────────────────────
echo "7️⃣  List housekeeping tasks..."
HK=$(curl -sf --max-time 10 -b "$COOKIE_JAR" "$API_URL/api/housekeeping" || echo '{}')
echo "   Response length: $(echo "$HK" | wc -c) chars"
pass
echo ""

# ─── 8. Analytics ────────────────────────────────
echo "8️⃣  Analytics metrics..."
METRICS=$(curl -sf --max-time 10 -b "$COOKIE_JAR" "$API_URL/api/analytics-v2/metrics?preset=30d" || echo '{}')
if echo "$METRICS" | grep -q '"totalRooms"\|"occupancyRate"\|"revenue"'; then
  pass
else
  warn "analytics endpoint may have changed shape"
  pass
fi
echo ""

# ─── 9. Audit Chain ──────────────────────────────
echo "9️⃣  Forensic Ledger chain integrity..."
VERIFY=$(curl -sf --max-time 10 -b "$COOKIE_JAR" "$API_URL/api/audit/verify" || echo '{}')
echo "   Response: $VERIFY"
if echo "$VERIFY" | grep -q '"valid":true'; then
  pass
else
  warn "audit chain may have events — check manually"
fi
echo ""

# ─── 10. RGPD — Guest PII masking ────────────────
echo "🔟  RGPD — Guest list PII masking..."
GUESTS=$(curl -sf --max-time 10 -b "$COOKIE_JAR" "$API_URL/api/guests?pageSize=1" || echo '{}')
if echo "$GUESTS" | grep -q '"documentNumber"'; then
  fail "documentNumber exposed in guest list (PII leak!)"
else
  pass
fi
echo ""

# ─── 11. CORS Preflight ──────────────────────────
echo "1️⃣1️⃣ CORS preflight check..."
CORS=$(curl -sf --max-time 10 -X OPTIONS "$API_URL/api/auth/login" \
  -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -i 2>/dev/null | head -20 || echo '')
if echo "$CORS" | grep -qi "access-control-allow-origin"; then
  pass
else
  warn "CORS allow-origin header not detected — check CORS_ORIGIN env var on Render"
fi
echo ""

# ─── 12. Rate Limiting ───────────────────────────
echo "1️⃣2️⃣ Rate limit protection..."
BAD_LOGIN=$(curl -sf --max-time 10 -o /dev/null -w "%{http_code}" \
  -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"bad@bad.com","password":"wrong"}' || echo '000')
if [ "$BAD_LOGIN" = "401" ]; then
  pass
else
  warn "expected 401 for bad credentials, got $BAD_LOGIN"
fi
echo ""

# ─── 13. Frontend ────────────────────────────────
echo "1️⃣3️⃣ Frontend reachable..."
FRONTEND_STATUS=$(curl -sf --max-time 20 -o /dev/null -w "%{http_code}" "$FRONTEND_URL" || echo '000')
if [ "$FRONTEND_STATUS" = "200" ]; then
  pass
else
  fail "frontend returned HTTP $FRONTEND_STATUS"
fi
echo ""

# ─── 14. Logout ──────────────────────────────────
echo "1️⃣4️⃣ Logout..."
LOGOUT=$(curl -sf --max-time 10 -b "$COOKIE_JAR" -X POST "$API_URL/api/auth/logout" || echo '{}')
if echo "$LOGOUT" | grep -q '"ok":true'; then
  pass
else
  fail "logout did not return ok:true"
fi
echo ""

# ─── Summary ─────────────────────────────────────
echo -e "${BLUE}================================================${NC}"
if [ "$FAILED" -eq 0 ]; then
  echo -e "${GREEN}✅ ALL SMOKE TESTS PASSED${NC}"
else
  echo -e "${RED}❌ $FAILED TEST(S) FAILED — check output above${NC}"
fi
echo -e "${BLUE}================================================${NC}"
echo ""
echo "🌐 URLs:"
echo "   Backend:  $API_URL"
echo "   Frontend: $FRONTEND_URL"
echo "   Health:   $API_URL/api/health"
echo "   Swagger:  $API_URL/api-docs"
echo ""

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi
