#!/usr/bin/env bash
set -euo pipefail

APP_URL="https://$PROJECT_NAME.$DOMAIN"

echo "✅ [9/9] Deployment complete!"
echo "--------------------------------------------"
echo "Project Name: $PROJECT_NAME"
echo "Type: $PROJECT_TYPE"
echo "Port: $PORT"
echo "URL: $APP_URL"
echo "--------------------------------------------"

jq -n --arg status "success" \
      --arg url "$APP_URL" \
      --arg type "$PROJECT_TYPE" \
      --arg port "$PORT" \
      '{status:$status, url:$url, type:$type, port:$port}'
