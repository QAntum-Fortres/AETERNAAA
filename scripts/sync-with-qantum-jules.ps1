# PowerShell script to sync AETERNAAA with QANTUM-JULES
# Synchronizes payment methods, paths, and configurations

$QANTUM_JULES_PATH = if ($env:QANTUM_JULES_PATH) { $env:QANTUM_JULES_PATH } else { "C:\Users\papic\Downloads\RUST-AEGIS\QANTUM-JULES" }
$AETERNAAA_PATH = Get-Location

Write-Host "🔄 Syncing AETERNAAA with QANTUM-JULES..." -ForegroundColor Cyan
Write-Host "Source: $QANTUM_JULES_PATH" -ForegroundColor Gray
Write-Host "Target: $AETERNAAA_PATH" -ForegroundColor Gray

# Sync OmniCore payment gateway improvements
if (Test-Path "$QANTUM_JULES_PATH\OmniCore\src\economy\PaymentGateway.ts") {
    Write-Host "📦 Syncing PaymentGateway improvements..." -ForegroundColor Yellow
    Copy-Item "$QANTUM_JULES_PATH\OmniCore\src\economy\PaymentGateway.ts" -Destination "$AETERNAAA_PATH\OmniCore\economy\PaymentGateway.ts" -Force -ErrorAction SilentlyContinue
}

# Sync important soul files
if (Test-Path "$QANTUM_JULES_PATH\LwaS") {
    Write-Host "🧬 Syncing LwaS soul files..." -ForegroundColor Yellow
    if (-not (Test-Path "$AETERNAAA_PATH\LwaS")) {
        New-Item -ItemType Directory -Path "$AETERNAAA_PATH\LwaS" -Force | Out-Null
    }
    Copy-Item "$QANTUM_JULES_PATH\LwaS\*" -Destination "$AETERNAAA_PATH\LwaS\" -Recurse -Force -ErrorAction SilentlyContinue
}

# Sync OmniCore modules
if (Test-Path "$QANTUM_JULES_PATH\OmniCore\src") {
    Write-Host "🔧 Syncing OmniCore modules..." -ForegroundColor Yellow
    if (-not (Test-Path "$AETERNAAA_PATH\OmniCore\src")) {
        New-Item -ItemType Directory -Path "$AETERNAAA_PATH\OmniCore\src" -Force | Out-Null
    }
    Copy-Item "$QANTUM_JULES_PATH\OmniCore\src\*" -Destination "$AETERNAAA_PATH\OmniCore\src\" -Recurse -Force -ErrorAction SilentlyContinue
}

# Sync nerve-center if exists
if (Test-Path "$QANTUM_JULES_PATH\nerve-center") {
    Write-Host "🧠 Syncing nerve-center..." -ForegroundColor Yellow
    Copy-Item "$QANTUM_JULES_PATH\nerve-center" -Destination "$AETERNAAA_PATH\" -Recurse -Force -ErrorAction SilentlyContinue
}

# Sync important configuration files
if (Test-Path "$QANTUM_JULES_PATH\SOVEREIGN.ledger") {
    Write-Host "📊 Syncing ledger..." -ForegroundColor Yellow
    Copy-Item "$QANTUM_JULES_PATH\SOVEREIGN.ledger" -Destination "$AETERNAAA_PATH\" -Force -ErrorAction SilentlyContinue
}

Write-Host "✅ Sync complete!" -ForegroundColor Green
