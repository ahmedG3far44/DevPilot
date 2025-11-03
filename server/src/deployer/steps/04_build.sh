#!/usr/bin/env bash
set -euo pipefail

echo "⚙️ [4/9] Installing dependencies and building project..."

cd "$CURRENT_DIR"

case $PKG_MANAGER in
  npm) npm install --legacy-peer-deps ;;
  yarn) yarn install --frozen-lockfile ;;
  pnpm) pnpm install ;;
esac

if [[ "$PROJECT_TYPE" == "React" || "$PROJECT_TYPE" == "Next" ]]; then
  echo "Running build..."
  case $PKG_MANAGER in
    npm) npm run build ;;
    yarn) yarn build ;;
    pnpm) pnpm run build ;;
  esac

  mkdir -p "$WWW_DIR/$PROJECT_NAME"
  if [[ -d "./dist" ]]; then
    cp -r ./dist/* "$WWW_DIR/$PROJECT_NAME/"
  elif [[ -d "./build" ]]; then
    cp -r ./build/* "$WWW_DIR/$PROJECT_NAME/"
  elif [[ -d ".next" ]]; then
    cp -r .next/* "$WWW_DIR/$PROJECT_NAME/"
  else
    echo "❌ No build output directory found (dist/build/.next)"
    exit 1
  fi
fi
