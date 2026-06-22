# =============================================================================
#  Sapphire Backend — Production Dockerfile
# =============================================================================

FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production --ignore-scripts
RUN npx prisma generate

# ---- Builder ----
FROM base AS builder
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# ---- Runner (production) ----
FROM base AS runner
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sapphire

# Copy built assets
COPY --from=builder --chown=sapphire:nodejs /app/dist ./dist
COPY --from=builder --chown=sapphire:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=sapphire:nodejs /app/prisma ./prisma
COPY --from=builder --chown=sapphire:nodejs /app/package.json ./package.json

USER sapphire

EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "dist/server.js"]
