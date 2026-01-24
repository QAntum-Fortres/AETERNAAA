#!/bin/bash

# Ensure API Key is provided
if [ -z "$RENDER_API_KEY" ]; then
    echo "Error: RENDER_API_KEY environment variable is not set."
    echo "Usage: RENDER_API_KEY=<key> ./render_deploy.sh"
    exit 1
fi

API_KEY="$RENDER_API_KEY"
REPO="https://github.com/QAntum-Fortres/AETERNAAA"
SERVICE_NAME="aeterna-logos-production"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Installing..."
    # Check if we can use apt-get
    if [ -w /var/lib/dpkg/lock-frontend ] || [ -w /var/lib/dpkg/lock ]; then
         apt-get update && apt-get install -y jq
    else
         echo "Cannot install jq (no permission). Please install jq manually."
         exit 1
    fi
fi

echo "Checking for existing service..."
SERVICES=$(curl -s -H "Authorization: Bearer $API_KEY" "https://api.render.com/v1/services?limit=20")

EXISTING_ID=$(echo "$SERVICES" | jq -r ".[] | select(.service.name == \"$SERVICE_NAME\") | .service.id")

if [ -n "$EXISTING_ID" ] && [ "$EXISTING_ID" != "null" ]; then
    echo "Service $SERVICE_NAME already exists (ID: $EXISTING_ID). Triggering deploy..."
    curl -s -X POST -H "Authorization: Bearer $API_KEY" "https://api.render.com/v1/services/$EXISTING_ID/deploys" \
    -d "{}" | jq .
else
    echo "Creating new service $SERVICE_NAME..."
    # Note: ownerId is required. I need to fetch ownerId first.
    OWNER_ID=$(curl -s -H "Authorization: Bearer $API_KEY" "https://api.render.com/v1/owners?limit=1" | jq -r ".[0].id")

    if [ -z "$OWNER_ID" ] || [ "$OWNER_ID" == "null" ]; then
        echo "Could not fetch Owner ID."
        exit 1
    fi

    echo "Owner ID: $OWNER_ID"

    curl -s -X POST -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
    "https://api.render.com/v1/services" \
    -d "{
      \"type\": \"web_service\",
      \"name\": \"$SERVICE_NAME\",
      \"ownerId\": \"$OWNER_ID\",
      \"repo\": \"$REPO\",
      \"branch\": \"main\",
      \"autoDeploy\": \"yes\",
      \"serviceDetails\": {
        \"env\": \"docker\",
        \"region\": \"frankfurt\",
        \"plan\": \"free\",
        \"envVars\": [
          { \"key\": \"STRIPE_SECRET_KEY\", \"value\": \"PLACEHOLDER_PLEASE_UPDATE\" },
          { \"key\": \"RUST_LOG\", \"value\": \"info\" }
        ]
      }
    }" | jq .
fi
