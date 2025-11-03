#!/usr/bin/env bash
set -euo pipefail

# === Global Config ===
BASE_PORT=3000
ROOT_DIR="/opt/apps"
WWW_DIR="/var/www"
DOMAIN="mydomain.com"
EMAIL="admin@$DOMAIN"
ZONE_ID="ZXXXXXXXXXXXXXX"
EC2_IP="$(curl -s http://checkip.amazonaws.com)"
NGINX_SITES="/etc/nginx/sites-available"
ENV_DIR="/opt/envs"

# === Inputs ===
REPO_URL="$1"
BRANCH_NAME="${2:-main}"
INNER_DIR="${3:-.}"
PROJECT_NAME="${4:-project_$(date +%s)}"
ENV_CONTENT="${5:-}"

export BASE_PORT ROOT_DIR WWW_DIR DOMAIN EMAIL ZONE_ID EC2_IP NGINX_SITES ENV_DIR
export REPO_URL BRANCH_NAME INNER_DIR PROJECT_NAME ENV_CONTENT

# === Execution ===
for step in /opt/deploy/steps/*.sh; do
  echo "➡️ Running $(basename "$step") ..."
  source "$step"
  echo "✅ Completed $(basename "$step")"
  echo "----------------------------------------"
done
