#!/usr/bin/env bash
###############################################################################
#  ZAFIR — Full Production Server Setup
#  Tested on: AlmaLinux 9, Rocky Linux 9, RHEL 9, CentOS Stream 9
#  Usage:    sudo bash install-server.sh
###############################################################################

set -euo pipefail
IFS=$'\n\t'

# ========================== CONFIG ==========================
readonly DOMAIN="zafir.luxury"
readonly APP_USER="zafir"
readonly APP_DIR="/opt/zafir"
readonly REPO_URL="https://github.com/your-org/zafir.git"  # <-- MODIFIER
readonly REPO_BRANCH="main"
readonly NODE_VERSION="20"
readonly DB_NAME="zafir_prod"
readonly DB_USER="zafir_app"
readonly DB_PASSWORD="$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)"
readonly JWT_SECRET="$(openssl rand -base64 64 | tr -dc 'a-zA-Z0-9' | head -c 64)"
readonly SESSION_SECRET="$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)"
readonly ADMIN_EMAIL="admin@zafir.luxury"
readonly ADMIN_PASSWORD="$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

log()   { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
err()   { echo -e "${RED}[ERROR]${NC} $*"; }
title() { echo -e "\n${BLUE}═══ $* ═══${NC}\n"; }

# ========================== PRECHECK ==========================
title "Pre-flight checks"

if [[ $EUID -ne 0 ]]; then
  err "This script must be run as root (use sudo)"
  exit 1
fi

if ! command -v dnf &>/dev/null; then
  err "dnf not found. This script requires RHEL-family Linux (AlmaLinux/Rocky/CentOS/RHEL)"
  exit 1
fi

log "OS: $(cat /etc/redhat-release 2>/dev/null || grep PRETTY_NAME /etc/os-release | cut -d= -f2)"
log "Kernel: $(uname -r)"
log "Hostname: $(hostname)"

# ========================== SYSTEM UPDATE ==========================
title "System update + EPEL"
dnf update -y
dnf install -y epel-release
dnf config-manager --set-enabled crb 2>/dev/null || true
log "System updated"

# ========================== PACKAGES ==========================
title "Installing system packages"
dnf install -y \
  git curl wget vim nano htop \
  openssl-devel gcc-c++ make \
  firewalld chrony logrotate \
  nginx \
  postgresql postgresql-server postgresql-contrib \
  redis \
  certbot python3-certbot-nginx \
  fail2ban

systemctl enable --now firewalld
systemctl enable --now chronyd
systemctl enable --now postgresql
systemctl enable --now redis
systemctl enable --now nginx
systemctl enable --now fail2ban

log "Base packages installed"

# ========================== NODE.JS ==========================
title "Installing Node.js ${NODE_VERSION}"
if ! command -v node &>/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt "${NODE_VERSION}" ]]; then
  curl -fsSL "https://rpm.nodesource.com/setup_${NODE_VERSION}.x" | bash -
  dnf install -y nodejs
fi
log "Node.js $(node -v) installed"

# ========================== FIREWALL ==========================
title "Configuring firewall"
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=3001/tcp
firewall-cmd --permanent --add-port=3002/tcp
firewall-cmd --reload
log "Firewall configured"

# ========================== FAIL2BAN ==========================
title "Configuring fail2ban"
cat > /etc/fail2ban/jail.d/sshd.conf <<'EOF'
[sshd]
enabled  = true
port     = ssh
filter   = sshd
logpath  = /var/log/secure
maxretry = 3
bantime  = 3600
findtime = 600
EOF
systemctl restart fail2ban
log "fail2ban active"

# ========================== APP USER ==========================
title "Creating app user"
if ! id "${APP_USER}" &>/dev/null; then
  useradd -m -d "${APP_DIR}" -s /bin/bash "${APP_USER}"
  log "User ${APP_USER} created"
fi

# ========================== POSTGRESQL ==========================
title "Initializing PostgreSQL"
/usr/bin/postgresql-setup --initdb 2>/dev/null || true
systemctl restart postgresql

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  sudo -u postgres psql <<SQL
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER} ENCODING 'UTF8';
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
ALTER USER ${DB_USER} CREATEDB;
SQL
  log "Database ${DB_NAME} created"
fi

# ========================== CLONE REPO ==========================
title "Cloning application"
mkdir -p "${APP_DIR}"
chown "${APP_USER}:${APP_USER}" "${APP_DIR}"

if [[ ! -d "${APP_DIR}/repo/.git" ]]; then
  sudo -u "${APP_USER}" git clone --branch "${REPO_BRANCH}" --depth 1 "${REPO_URL}" "${APP_DIR}/repo"
else
  cd "${APP_DIR}/repo"
  sudo -u "${APP_USER}" git pull origin "${REPO_BRANCH}"
fi
log "Repo ready"

# ========================== BACKEND ==========================
title "Installing backend"
cd "${APP_DIR}/repo/backend"
sudo -u "${APP_USER}" npm ci --omit=dev
sudo -u "${APP_USER}" npx prisma generate

cat > .env <<EOF
NODE_ENV=production
PORT=3000
APP_URL=https://${DOMAIN}
CORS_ORIGIN=https://${DOMAIN},https://app.${DOMAIN}

DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public

JWT_SECRET=${JWT_SECRET}
SESSION_SECRET=${SESSION_SECRET}

STRIPE_SECRET_KEY=\${STRIPE_SECRET_KEY}
STRIPE_PUBLISHABLE_KEY=\${STRIPE_PUBLISHABLE_KEY}
STRIPE_WEBHOOK_SECRET=\${STRIPE_WEBHOOK_SECRET}

RESEND_API_KEY=\${RESEND_API_KEY}
SALES_EMAIL=sales@zafir.luxury
SUPPORT_EMAIL=support@zafir.luxury

SENTRY_DSN=\${SENTRY_DSN}
EOF

chown "${APP_USER}:${APP_USER}" .env
chmod 600 .env

sudo -u "${APP_USER}" npx prisma db push --skip-generate
sudo -u "${APP_USER}" npm run db:seed 2>/dev/null || warn "Seed skipped (run manually)"
sudo -u "${APP_USER}" npm run build
log "Backend ready"

# ========================== FRONTEND ==========================
title "Installing frontend"
cd "${APP_DIR}/repo"
# The frontend is the root Vite app
sudo -u "${APP_USER}" npm ci
sudo -u "${APP_USER}" npm run build
log "Frontend ready"

# ========================== SYSTEMD SERVICES ==========================
title "Creating systemd services"

cat > /etc/systemd/system/zafir-backend.service <<EOF
[Unit]
Description=Zafir Backend API
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${APP_DIR}/repo/backend
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=5
EnvironmentFile=${APP_DIR}/repo/backend/.env
StandardOutput=journal
StandardError=journal
SyslogIdentifier=zafir-backend

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable zafir-backend
systemctl start zafir-backend
log "Backend service started"

# ========================== NGINX ==========================
title "Configuring Nginx"
cat > /etc/nginx/conf.d/zafir.conf <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    root ${APP_DIR}/repo/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}

server {
    listen 80;
    server_name api.${DOMAIN};

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_read_timeout 300s;
    }
}
EOF

nginx -t && systemctl reload nginx
log "Nginx configured"

# ========================== SSL ==========================
title "Installing SSL certificates"
warn "Ensure DNS A records point to $(curl -s ifconfig.me) before SSL setup."
sleep 10
certbot --nginx \
  -d "${DOMAIN}" -d "www.${DOMAIN}" -d "api.${DOMAIN}" \
  --non-interactive --agree-tos --email "${ADMIN_EMAIL}" \
  || warn "Certbot failed — configure SSL manually"

# ========================== BACKUP ==========================
title "Creating backup script"
mkdir -p /var/log/zafir /var/backups/zafir
chown "${APP_USER}:${APP_USER}" /var/log/zafir

cat > "${APP_DIR}/backup.sh" <<'BACKUP'
#!/bin/bash
set -euo pipefail
BACKUP_DIR="/var/backups/zafir"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
mkdir -p "${BACKUP_DIR}"
sudo -u postgres pg_dump zafir_prod | gzip > "${BACKUP_DIR}/db_${DATE}.sql.gz"
tar -czf "${BACKUP_DIR}/envs_${DATE}.tar.gz" /opt/zafir/repo/backend/.env
find "${BACKUP_DIR}" -type f -mtime +${RETENTION_DAYS} -delete
echo "Backup OK: ${DATE}"
BACKUP

chmod +x "${APP_DIR}/backup.sh"
chown "${APP_USER}:${APP_USER}" "${APP_DIR}/backup.sh"

cat > /etc/cron.d/zafir-backup <<EOF
0 3 * * * ${APP_USER} ${APP_DIR}/backup.sh >> /var/log/zafir/backup.log 2>&1
EOF
log "Daily backup at 3am scheduled"

# ========================== LOGROTATE ==========================
cat > /etc/logrotate.d/zafir <<'EOF'
/var/log/zafir/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 zafir zafir
}
EOF

# ========================== SECURITY ==========================
title "Security hardening"
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/'       /etc/ssh/sshd_config
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl reload sshd

dnf install -y dnf-automatic
sed -i 's/apply_updates = no/apply_updates = yes/' /etc/dnf/automatic.conf
systemctl enable --now dnf-automatic.timer
log "Security hardening done"

# ========================== SUMMARY ==========================
title "INSTALLATION COMPLETE"

SERVER_IP=$(curl -s ifconfig.me)

cat <<SUMMARY

${GREEN}╔══════════════════════════════════════════════════════════╗
║          ZAFIR INSTALLATION SUCCESS 🎉                    ║
╚══════════════════════════════════════════════════════════╝${NC}

${BLUE}URLs:${NC}
  • Frontend  → https://${DOMAIN}
  • API       → https://api.${DOMAIN}
  • Server IP → ${SERVER_IP}

${BLUE}Database:${NC}
  • Name     : ${DB_NAME}
  • User     : ${DB_USER}
  • Password : ${DB_PASSWORD}   ⚠️  SAVE NOW

${BLUE}Admin credentials:${NC}
  • Email    : ${ADMIN_EMAIL}
  • Password : ${ADMIN_PASSWORD}   ⚠️  CHANGE AFTER FIRST LOGIN

${BLUE}Secrets:${NC}
  JWT_SECRET=${JWT_SECRET}
  SESSION_SECRET=${SESSION_SECRET}

${BLUE}Useful commands:${NC}
  Status   → systemctl status zafir-backend
  Logs     → journalctl -u zafir-backend -f
  Restart  → systemctl restart zafir-backend
  Update   → cd /opt/zafir/repo && sudo -u ${APP_USER} bash deploy.sh

${BLUE}DNS records needed (A → ${SERVER_IP}):${NC}
  ${DOMAIN}       ${SERVER_IP}
  www.${DOMAIN}   ${SERVER_IP}
  api.${DOMAIN}   ${SERVER_IP}

SUMMARY
