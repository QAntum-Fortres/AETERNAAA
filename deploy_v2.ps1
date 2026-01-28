Write-Host "🚀 INITIALIZING AETERNA v2.0 LAUNCH SEQUENCE..." -ForegroundColor Cyan

# Check for Docker
if (!(Get-Command "docker" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ CRITICAL ERROR: Docker is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# Stop existing containers
Write-Host "🛑 Stopping legacy containers..." -ForegroundColor Yellow
docker-compose down --remove-orphans

# Build services
Write-Host "🏗️  Building AETERNAAA Stack (Titan + Singularity)..." -ForegroundColor Cyan
docker-compose build

# Start services
Write-Host "🔥 IGNITING ENGINES..." -ForegroundColor Magenta
docker-compose up -d

# Health Checks
Write-Host "💓 verifying Pulse..."
Start-Sleep -Seconds 5
if (docker ps | Select-String "aeterna-frontend") {
    Write-Host "✅ FRONTEND: ONLINE (Port 80)" -ForegroundColor Green
} else {
    Write-Host "⚠️  FRONTEND: FALIED" -ForegroundColor Red
}

Write-Host "---------------------------------------------------"
Write-Host "🎉 AETERNA v2.0 SYSTEM ONLINE" -ForegroundColor Green
Write-Host "🌍 UI: http://localhost"
Write-Host "🧠 BRAIN: http://localhost/api/v1/status"
Write-Host "⚔️ TITAN: http://localhost/api/titan/telemetry"
Write-Host "---------------------------------------------------"
