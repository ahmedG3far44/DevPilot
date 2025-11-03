#!/usr/bin/env bash
set -euo pipefail

if [[ "$PROJECT_TYPE" == "Express" || "$PROJECT_TYPE" == "Nest" ]]; then
  echo "🧩 [8/9] Running backend with PM2..."
  cd "$CURRENT_DIR"
  pm2 start dist/main.js --name "$PROJECT_NAME" -- --port=$PORT
  pm2 save
  pm2 startup systemd -u ubuntu --hp /home/ubuntu
  systemctl reload nginx
fi
