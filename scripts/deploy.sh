#!/bin/bash
# Deploy to Cloudflare Pages (direct deploy, no GitHub needed)
#
# Prerequisites:
#   npm install -g wrangler
#   wrangler login
#
# Usage: bash scripts/deploy.sh [production|preview]
#
# Environment: CLOUDFLARE_PROJECT_NAME (default: derived from site.config.yaml domain)

set -e

ENVIRONMENT="${1:-production}"
PROJECT_NAME="${CLOUDFLARE_PROJECT_NAME:-$(grep 'domain:' site.config.yaml | head -1 | awk '{print $2}' | tr -d '"' | sed 's/\./-/g')}"

echo "=== Website Factory Deploy ==="
echo "Project: $PROJECT_NAME"
echo "Environment: $ENVIRONMENT"
echo ""

# Build
echo "Building site..."
npm run build

# Verify _headers made it to dist (Astro copies public/ to dist/)
if [ ! -f dist/_headers ]; then
  echo "Warning: _headers not found in dist/, copying from public/"
  cp public/_headers dist/_headers
fi

# Deploy
echo "Deploying to Cloudflare Pages..."
if [ "$ENVIRONMENT" = "production" ]; then
  npx wrangler pages deploy dist --project-name="$PROJECT_NAME" --branch=main
else
  npx wrangler pages deploy dist --project-name="$PROJECT_NAME" --branch=preview
fi

echo ""
echo "Deploy complete: https://$PROJECT_NAME.pages.dev"
