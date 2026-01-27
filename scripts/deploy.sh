#!/bin/bash
# AETERNAAA Production Deployment Script

set -e

echo "🌌 AETERNAAA Production Deployment Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  .env.production not found. Creating from template...${NC}"
    cp .env.production.example .env.production
    echo -e "${RED}❌ Please edit .env.production with your actual values before deploying!${NC}"
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Validate required variables
echo -e "${YELLOW}🔍 Validating environment variables...${NC}"

REQUIRED_VARS=("STRIPE_SECRET_KEY" "EXCHANGE_API_KEY" "EXCHANGE_SECRET_KEY")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ] || [[ "${!var}" == *"YOUR_"* ]] || [[ "${!var}" == *"your_"* ]]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing or placeholder values for: ${MISSING_VARS[*]}${NC}"
    echo -e "${YELLOW}Please update .env.production with actual values.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables validated${NC}"

# Build Docker images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose -f docker-compose.yml build --no-cache

# Run health checks
echo -e "${YELLOW}🏥 Running health checks...${NC}"
docker-compose -f docker-compose.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 30

# Check backend health
if curl -f http://localhost:8890/telemetry > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    docker-compose logs backend
    exit 1
fi

# Check middleware health
if curl -f http://localhost:8890/api/status > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Middleware is healthy${NC}"
else
    echo -e "${RED}❌ Middleware health check failed${NC}"
    docker-compose logs middleware
    exit 1
fi

# Check frontend
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
    docker-compose logs frontend
    exit 1
fi

echo -e "${GREEN}🚀 Deployment successful!${NC}"
echo ""
echo "Services are running on:"
echo "  - Frontend: http://localhost:80"
echo "  - Backend API: http://localhost:8890"
echo "  - WebSocket: ws://localhost:8765"
echo ""
echo "View logs with: docker-compose logs -f"
echo "Stop services with: docker-compose down"
