#!/usr/bin/env bash
set -euo pipefail

echo "🌱 [3/9] Setting up environment file..."

cd "$CURRENT_DIR"

if [[ -n "$ENV_CONTENT" ]]; then
  echo "Creating .env from provided content..."
  echo "$ENV_CONTENT" > .env
elif [[ ! -f ".env" ]]; then
  echo "⚠️ No .env found."
fi

if [[ -f ".env" ]]; then
  export $(grep -v '^#' .env | xargs)
  mkdir -p "$ENV_DIR"
  cp .env "$ENV_DIR/$PROJECT_NAME.env"
fi
