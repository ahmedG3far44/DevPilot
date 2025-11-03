#!/usr/bin/env bash
set -euo pipefail

echo "🧩 [5/9] Configuring Nginx..."

CONFIG_PATH="$NGINX_SITES/$PROJECT_NAME"
PORT=$BASE_PORT

if [[ "$PROJECT_TYPE" == "Express" || "$PROJECT_TYPE" == "Nest" ]]; then
  while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; do
    PORT=$((PORT+1))
  done
fi

cat > "$CONFIG_PATH" <<EOF
server {
    server_name $PROJECT_NAME.$DOMAIN;
EOF

if [[ "$PROJECT_TYPE" == "React" || "$PROJECT_TYPE" == "Next" ]]; then
cat >> "$CONFIG_PATH" <<EOF
    root $WWW_DIR/$PROJECT_NAME;
    index index.html;
    location / {
        try_files \$uri /index.html;
    }
}
EOF
else
cat >> "$CONFIG_PATH" <<EOF
    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
fi

ln -sf "$CONFIG_PATH" "/etc/nginx/sites-enabled/$PROJECT_NAME"
nginx -t && systemctl reload nginx

export PORT
