#!/usr/bin/env bash
set -euo pipefail

echo "🧠 [2/9] Detecting project type..."

cd "$CURRENT_DIR"

PKG_MANAGER="npm"
PROJECT_TYPE=""
IS_TS="false"

# Detect package manager
if [[ -f "yarn.lock" ]]; then PKG_MANAGER="yarn";
elif [[ -f "pnpm-lock.yaml" ]]; then PKG_MANAGER="pnpm";
elif [[ -f "package-lock.json" ]]; then PKG_MANAGER="npm";
fi

# Detect project type
if [[ -f "next.config.js" ]]; then PROJECT_TYPE="Next";
elif grep -q '"react"' package.json; then PROJECT_TYPE="React";
elif grep -q '"@nestjs/core"' package.json; then PROJECT_TYPE="Nest";
elif grep -q '"express"' package.json; then PROJECT_TYPE="Express";
else
  echo "❌ Unsupported project type."
  exit 1
fi

[[ -f "tsconfig.json" ]] && IS_TS="true"

echo "Detected → Type: $PROJECT_TYPE, Manager: $PKG_MANAGER, TS: $IS_TS"

export PROJECT_TYPE PKG_MANAGER IS_TS
