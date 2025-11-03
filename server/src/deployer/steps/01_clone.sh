#!/usr/bin/env bash
set -euo pipefail

echo "📦 [1/9] Cloning repository..."

mkdir -p "$ROOT_DIR"
cd "$ROOT_DIR"

rm -rf "$PROJECT_NAME" || true
git clone -b "$BRANCH_NAME" "$REPO_URL" "$PROJECT_NAME"

cd "$PROJECT_NAME"
if [[ "$INNER_DIR" != "." && "$INNER_DIR" != "./" ]]; then
  cd "$INNER_DIR"
fi

export CURRENT_DIR=$(pwd)
