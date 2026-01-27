#!/bin/bash
# Health check script for AETERNAAA services

BACKEND_URL=${BACKEND_URL:-http://localhost:8890}
MIDDLEWARE_URL=${MIDDLEWARE_URL:-http://localhost:8890}
FRONTEND_URL=${FRONTEND_URL:-http://localhost:80}

check_service() {
    local name=$1
    local url=$2
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        echo "✅ $name is healthy"
        return 0
    else
        echo "❌ $name is unhealthy"
        return 1
    fi
}

echo "🏥 AETERNAAA Health Check"
echo "========================"

EXIT_CODE=0

check_service "Backend" "$BACKEND_URL/telemetry" || EXIT_CODE=1
check_service "Middleware" "$MIDDLEWARE_URL/api/status" || EXIT_CODE=1
check_service "Frontend" "$FRONTEND_URL" || EXIT_CODE=1

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ All services are healthy"
else
    echo ""
    echo "❌ Some services are unhealthy"
fi

exit $EXIT_CODE
