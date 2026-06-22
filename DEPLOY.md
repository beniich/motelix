# 🚀 Guide de Déploiement Production

## Architecture cible

```
Internet
   │
   ▼
┌─────────────┐
│   Nginx     │ ← SSL/TLS (Let's Encrypt)
│   :443      │
└──────┬──────┘
       │
   ┌───┴────┐
   │        │
┌──▼──┐  ┌──▼──┐
│ FE  │  │ API │  ← Containers Docker
│:3000│  │:5000│
└──┬──┘  └──┬──┘
   │        │
   └───┬────┘
       │
   ┌───▼────┐
   │Postgres│  ← Managed (Railway/Supabase)
   └────────┘
```

---

## Option A : Railway (Recommandé pour MVP)

### Backend

1. **Créer un projet Railway** : https://railway.app
2. **Ajouter PostgreSQL** : "New → Database → PostgreSQL"
3. **Deployer le backend** :
   - "New → GitHub Repo" → Sélectionner `sapphire/backend`
   - Railway détecte le Dockerfile automatiquement
4. **Variables d'environnement** :
   ```
   DATABASE_URL = ${{Postgres.DATABASE_URL}}
   JWT_SECRET = <openssl rand -hex 32>
   PII_ENCRYPTION_KEY = <openssl rand -hex 32>
   FRONTEND_URL = https://sapphire.vercel.app
   APP_URL = ${{RAILWAY_PUBLIC_DOMAIN}}
   CORS_ORIGIN = https://sapphire.vercel.app
   STRIPE_SECRET_KEY = sk_live_...
   STRIPE_WEBHOOK_SECRET = whsec_...
   ```
5. **Migrations** :
   ```bash
   railway run npx prisma migrate deploy
   railway run npx tsx prisma/seed.ts
   ```

### Frontend (Vercel)

1. **Créer projet Vercel** : https://vercel.com
2. **Importer** : `sapphire/frontend`
3. **Variables** :
   ```
   NEXT_PUBLIC_API_URL = https://backend-production-xxxx.up.railway.app
   ```
4. **Deploy** : Automatique sur push main

### Domaine custom

1. **Vercel** : Settings → Domains → Ajouter `sapphire.example.com`
2. **Cloudflare** : DNS → CNAME → cname.vercel-dns.com
3. **Railway** : Settings → Domains → `api.sapphire.example.com`

---

## Option B : Self-hosted (VPS)

### Prérequis

- VPS Ubuntu 22.04+ (4GB RAM minimum)
- Docker + Docker Compose
- Nom de domaine configuré

### Étapes

```bash
# 1. Installer Docker
curl -fsSL https://get.docker.com | sh

# 2. Cloner le repo
git clone https://github.com/your-org/sapphire.git
cd sapphire

# 3. Configurer
cp .env.example .env
nano .env  # Remplir toutes les valeurs

# 4. SSL avec Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d sapphire.example.com -d api.sapphire.example.com
# Copier les certs vers nginx/ssl/

# 5. Démarrer
docker-compose up -d

# 6. Migrations
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx tsx prisma/seed.ts

# 7. Vérifier
curl https://api.sapphire.example.com/api/health
```

### Monitoring

```bash
# Logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stats
docker stats
```

---

## Post-déploiement

### Checklist

- [ ] SSL actif (HTTPS partout)
- [ ] Backups Postgres configurés (quotidiens)
- [ ] Sentry actif (erreurs trackées)
- [ ] Stripe webhook configuré
- [ ] Email Resend configuré
- [ ] Domaine custom configuré
- [ ] Monitoring (UptimeRobot, etc.)
- [ ] CI/CD fonctionne (GitHub Actions vert)

### Commandes utiles

```bash
# Logs temps réel
docker-compose logs -f --tail=100

# Backup DB
docker-compose exec postgres pg_dump -U sapphire sapphire > backup.sql

# Restore
cat backup.sql | docker-compose exec -T postgres psql -U sapphire sapphire

# Restart un service
docker-compose restart backend

# Mise à jour
git pull
docker-compose build
docker-compose up -d
```

---

## Coûts estimés (mensuels)

| Service | Coût |
|---------|------|
| Railway (Backend + Postgres) | $20-50 |
| Vercel (Frontend) | $0 (hobby) ou $20 (pro) |
| Domaine | $1-2 |
| **Total MVP** | **~$25-75/mois** |
