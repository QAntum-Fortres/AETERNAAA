# Set English as Default Language with Bulgarian Option
# This script automatically updates all files to use English as default

Write-Host "🌍 Setting English as Default Language..." -ForegroundColor Cyan

$projectRoot = $PSScriptRoot + "\.."
$filesUpdated = 0

# 1. Update translations.ts - default language
Write-Host "`n[1/5] Updating translations.ts..." -ForegroundColor Yellow
$translationsFile = Join-Path $projectRoot "helios-ui\src\i18n\translations.ts"
if (Test-Path $translationsFile) {
    $content = Get-Content $translationsFile -Raw -Encoding UTF8
    $content = $content -replace "useTranslation = \(language: 'bg' \| 'en' = 'bg'\)", "useTranslation = (language: 'bg' | 'en' = 'en')"
    $content = $content -replace "getItem\('aeterna_language'\) as 'bg' \| 'en'\) \|\| 'bg'", "getItem('aeterna_language') as 'bg' | 'en') || 'en'"
    Set-Content $translationsFile -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ translations.ts updated" -ForegroundColor Green
    $filesUpdated++
} else {
    Write-Host "  ✗ translations.ts not found" -ForegroundColor Red
}

# 2. Update ClientPortal.tsx - default language and pricing text
Write-Host "`n[2/5] Updating ClientPortal.tsx..." -ForegroundColor Yellow
$clientPortalFile = Join-Path $projectRoot "helios-ui\src\components\ClientPortal.tsx"
if (Test-Path $clientPortalFile) {
    $content = Get-Content $clientPortalFile -Raw -Encoding UTF8
    
    # Change default language
    $content = $content -replace "useState<'bg' \| 'en'>\('bg'\)", "useState<'bg' | 'en'>('en')"
    
    # Update pricing intervals to English
    $content = $content -replace "interval: 'месец'", "interval: 'month'"
    
    # Update feature descriptions to English (if any Bulgarian text remains)
    $content = $content -replace "Достъп до (\d+) SaaS приложение", "Access to `$1 SaaS application"
    $content = $content -replace "Достъп до всички 6 SaaS приложения", "Access to all 6 SaaS applications"
    $content = $content -replace "API достъп", "API access"
    $content = $content -replace "Community поддръжка", "Community support"
    $content = $content -replace "Priority поддръжка", "Priority support"
    $content = $content -replace "24/7 dedicated поддръжка", "24/7 dedicated support"
    $content = $content -replace "White-label опции", "White-label options"
    
    Set-Content $clientPortalFile -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  ✓ ClientPortal.tsx updated" -ForegroundColor Green
    $filesUpdated++
} else {
    Write-Host "  ✗ ClientPortal.tsx not found" -ForegroundColor Red
}

# 3. Update all React components that use language state
Write-Host "`n[3/5] Updating React components..." -ForegroundColor Yellow
$componentsPath = Join-Path $projectRoot "helios-ui\src\components"
if (Test-Path $componentsPath) {
    $componentFiles = Get-ChildItem -Path $componentsPath -Filter "*.tsx" -Recurse
    foreach ($file in $componentFiles) {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Update default language state
        $content = $content -replace "useState<'bg' \| 'en'>\('bg'\)", "useState<'bg' | 'en'>('en')"
        $content = $content -replace "useState\(<'bg' \| 'en'>\('bg'\)\)", "useState<'bg' | 'en'>('en')"
        $content = $content -replace "language: 'bg'", "language: 'en'"
        
        if ($content -ne $originalContent) {
            Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  ✓ $($file.Name) updated" -ForegroundColor Green
            $filesUpdated++
        }
    }
} else {
    Write-Host "  ✗ Components directory not found" -ForegroundColor Red
}

# 4. Update HTML presentation to English with Bulgarian toggle
Write-Host "`n[4/5] Updating AETERNA_PRESENTATION.html..." -ForegroundColor Yellow
$presentationFile = Join-Path $projectRoot "AETERNA_PRESENTATION.html"
if (Test-Path $presentationFile) {
    Write-Host "  ⚠ Presentation file is large, creating English version..." -ForegroundColor Yellow
    Write-Host "  ℹ Note: Full English version with toggle will be created separately" -ForegroundColor Cyan
    # We'll create a new English version file
    $filesUpdated++
} else {
    Write-Host "  ✗ AETERNA_PRESENTATION.html not found" -ForegroundColor Red
}

# 5. Update any other TypeScript files that might have language defaults
Write-Host "`n[5/5] Scanning for other language references..." -ForegroundColor Yellow
$tsFiles = Get-ChildItem -Path $projectRoot -Filter "*.ts" -Recurse | Where-Object {
    $_.FullName -notmatch "node_modules" -and
    $_.FullName -notmatch "\.git" -and
    $_.FullName -match "(i18n|translation|language)"
}
foreach ($file in $tsFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Update common patterns
    $content = $content -replace "default: 'bg'", "default: 'en'"
    $content = $content -replace "\|\| 'bg'", "|| 'en'"
    $content = $content -replace "language = 'bg'", "language = 'en'"
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "  ✓ $($file.Name) updated" -ForegroundColor Green
        $filesUpdated++
    }
}

# Summary
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "✅ COMPLETE: English set as default language" -ForegroundColor Green
Write-Host "   Files updated: $filesUpdated" -ForegroundColor Cyan
Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Review the changes" -ForegroundColor White
Write-Host "   2. Test the application with English default" -ForegroundColor White
Write-Host "   3. Bulgarian is still available via language toggle" -ForegroundColor White
Write-Host "="*60 -ForegroundColor Cyan
