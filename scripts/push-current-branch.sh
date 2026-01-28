#!/bin/bash
# Simple wrapper to push current branch - no prompts for CI/automation use
# Usage: ./scripts/push-current-branch.sh [remote]

REMOTE=${1:-origin}
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🚀 Pushing $CURRENT_BRANCH to $REMOTE..."

if git push "$REMOTE" "$CURRENT_BRANCH" --verbose; then
    echo "✅ Successfully pushed to $REMOTE"
    exit 0
else
    echo "❌ Failed to push to $REMOTE"
    exit 1
fi
