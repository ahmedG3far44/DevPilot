#!/usr/bin/env bash
set -euo pipefail

echo "🔒 [6/9] Creating SSL certificate..."
certbot --nginx -d "$PROJECT_NAME.$DOMAIN" --non-interactive --agree-tos -m "$EMAIL"
systemctl reload nginx
