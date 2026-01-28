#!/bin/bash
# Push all changes in current branch to all configured remotes
# Usage: ./scripts/push-all-branches.sh
# Note: AETERNAAA is intentional branding (triple A for emphasis)

# Don't exit on error - we want to try all remotes
set +e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AETERNAAA - Push All in Current Branch${NC}"
echo ""

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "${YELLOW}📍 Current branch: ${CURRENT_BRANCH}${NC}"

# Check if there are uncommitted changes (tracked files only)
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes in tracked files!${NC}"
    echo -e "${YELLOW}Do you want to commit them first? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "${YELLOW}Enter commit message:${NC}"
        read -r commit_message
        
        # Validate commit message is not empty
        while [ -z "$(echo "$commit_message" | xargs)" ]; do
            echo -e "${RED}❌ Commit message cannot be empty!${NC}"
            echo -e "${YELLOW}Enter commit message:${NC}"
            read -r commit_message
        done
        
        # Only stage tracked files to avoid accidentally committing unintended files
        if git add -u; then
            if git commit -m "$commit_message"; then
                echo -e "${GREEN}✅ Changes committed${NC}"
            else
                echo -e "${RED}❌ Failed to commit changes!${NC}"
                exit 1
            fi
        else
            echo -e "${RED}❌ Failed to stage changes!${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  Proceeding without committing...${NC}"
    fi
fi

# Get all remotes
REMOTES=$(git remote)

if [ -z "$REMOTES" ]; then
    echo -e "${RED}❌ No remotes configured!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📡 Configured remotes:${NC}"
for remote in $REMOTES; do
    REMOTE_URL=$(git remote get-url "$remote")
    echo -e "  ${GREEN}✓${NC} $remote: $REMOTE_URL"
done
echo ""

# Push to each remote
SUCCESS_COUNT=0
FAIL_COUNT=0
FAILED_REMOTES=()

for remote in $REMOTES; do
    echo -e "${YELLOW}⬆️  Pushing to $remote...${NC}"
    
    # Push and capture exit code
    git push "$remote" "$CURRENT_BRANCH" --verbose
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}✅ Successfully pushed to $remote${NC}"
        ((SUCCESS_COUNT++))
    else
        echo -e "${RED}❌ Failed to push to $remote (exit code: $EXIT_CODE)${NC}"
        ((FAIL_COUNT++))
        FAILED_REMOTES+=("$remote")
    fi
    echo ""
done

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Push Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Branch: ${YELLOW}$CURRENT_BRANCH${NC}"
echo -e "  ${GREEN}Success: $SUCCESS_COUNT${NC}"
echo -e "  ${RED}Failed: $FAIL_COUNT${NC}"

if [ ${#FAILED_REMOTES[@]} -ne 0 ]; then
    echo -e "  ${RED}Failed remotes: ${FAILED_REMOTES[*]}${NC}"
    echo -e "${YELLOW}  Note: If authentication fails, ensure your git credentials are properly configured.${NC}"
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}🎉 All pushes completed successfully!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some pushes failed. Please check the errors above.${NC}"
    exit 1
fi
