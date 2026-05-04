#!/usr/bin/env bash
# One-time bootstrap for a fresh Ubuntu 22.04 DigitalOcean droplet.
# Run as root: bash setup.sh

set -e

REPO_URL="https://github.com/agile-students-spring2026/final-studyspot.git"
APP_DIR="/var/www/studyspot"

echo "==> Updating system packages"
apt-get update -y && apt-get upgrade -y

echo "==> Installing Node.js 20 LTS"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "==> Installing PM2"
npm install -g pm2

echo "==> Installing nginx"
apt-get install -y nginx

echo "==> Cloning repository"
mkdir -p /var/www
git clone "$REPO_URL" "$APP_DIR"

echo "==> Installing backend dependencies"
cd "$APP_DIR/back-end"
npm ci --omit=dev

echo ""
echo "--------------------------------------------------------------"
echo "  ACTION REQUIRED: copy your .env file before continuing"
echo "  scp back-end/.env root@<droplet-ip>:$APP_DIR/back-end/.env"
echo "--------------------------------------------------------------"
echo ""
read -p "Press Enter once .env is in place..."

echo "==> Building React frontend"
cd "$APP_DIR/front-end"
npm ci
npm run build

echo "==> Starting Express with PM2"
cd "$APP_DIR/back-end"
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash   # enable on reboot

echo "==> Configuring nginx"
cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/studyspot
ln -sf /etc/nginx/sites-available/studyspot /etc/nginx/sites-enabled/studyspot
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "==> Done! App is live on http://$(curl -s ifconfig.me)"
echo "    Edit /etc/nginx/sites-available/studyspot to set your domain,"
echo "    then run: certbot --nginx -d yourdomain.com   (for HTTPS)"
