#!/usr/bin/env bash
set -euo pipefail

echo "🌐 [7/9] Adding DNS record..."

aws route53 change-resource-record-sets \
  --hosted-zone-id "$ZONE_ID" \
  --change-batch "{
    \"Changes\": [{
      \"Action\": \"UPSERT\",
      \"ResourceRecordSet\": {
        \"Name\": \"$PROJECT_NAME.$DOMAIN\",
        \"Type\": \"A\",
        \"TTL\": 300,
        \"ResourceRecords\": [{\"Value\": \"$EC2_IP\"}]
      }
    }]
  }"
