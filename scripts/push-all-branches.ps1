# PowerShell script to push all changes in current branch to all configured remotes
# Usage: .\scripts\push-all-branches.ps1

Write-Host "🚀 AETERNAAA - Push All in Current Branch" -ForegroundColor Cyan
Write-Host ""

# Get current branch
try {
    $currentBranch = git rev-parse --abbrev-ref HEAD
    Write-Host "📍 Current branch: $currentBranch" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Failed to get current branch. Are you in a git repository?" -ForegroundColor Red
    exit 1
}

# Check if there are uncommitted changes
$hasChanges = git diff-index --quiet HEAD --
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  You have uncommitted changes!" -ForegroundColor Yellow
    $response = Read-Host "Do you want to commit them first? (y/n)"
    if ($response -match '^[yY]') {
        $commitMessage = Read-Host "Enter commit message"
        git add .
        git commit -m $commitMessage
        Write-Host "✅ Changes committed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Proceeding without committing..." -ForegroundColor Yellow
    }
}

# Get all remotes
$remotes = git remote

if (-not $remotes) {
    Write-Host "❌ No remotes configured!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📡 Configured remotes:" -ForegroundColor Cyan
foreach ($remote in $remotes) {
    $remoteUrl = git remote get-url $remote
    Write-Host "  ✓ ${remote}: $remoteUrl" -ForegroundColor Green
}
Write-Host ""

# Push to each remote
$successCount = 0
$failCount = 0
$failedRemotes = @()

foreach ($remote in $remotes) {
    Write-Host "⬆️  Pushing to $remote..." -ForegroundColor Yellow
    
    try {
        git push $remote $currentBranch --verbose 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully pushed to $remote" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "❌ Failed to push to $remote" -ForegroundColor Red
            $failCount++
            $failedRemotes += $remote
        }
    } catch {
        Write-Host "❌ Error pushing to ${remote}: $_" -ForegroundColor Red
        $failCount++
        $failedRemotes += $remote
    }
    Write-Host ""
}

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Push Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  Branch: $currentBranch" -ForegroundColor Yellow
Write-Host "  Success: $successCount" -ForegroundColor Green
Write-Host "  Failed: $failCount" -ForegroundColor Red

if ($failedRemotes.Count -gt 0) {
    Write-Host "  Failed remotes: $($failedRemotes -join ', ')" -ForegroundColor Red
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if ($failCount -eq 0) {
    Write-Host "🎉 All pushes completed successfully!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Some pushes failed. Please check the errors above." -ForegroundColor Yellow
    exit 1
}
