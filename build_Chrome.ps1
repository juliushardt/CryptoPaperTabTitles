#!/usr/bin/env pwsh

if (!(Test-Path -Path "dist/Chrome")) {
    New-Item -ItemType Directory -Path "dist/Chrome" > $null
}

$outputDirectory = "dist/Chrome/CryptoResearchPaperTabTitles"
if (Test-Path -Path $outputDirectory) {
    Remove-Item -Recurse -Path $outputDirectory
}

New-Item -ItemType Directory -Path $outputDirectory > $null
Copy-Item -Path "src/service-worker.js" -Destination $outputDirectory
Copy-Item -Path "icon/icon16.png" -Destination $outputDirectory
Copy-Item -Path "icon/icon32.png" -Destination $outputDirectory
Copy-Item -Path "icon/icon48.png" -Destination $outputDirectory
Copy-Item -Path "icon/icon128.png" -Destination $outputDirectory

# content.js
$contentJS = Get-Content -Path "src/content.js" -Raw 
$contentJS = $contentJS.Replace("___BROWSER___", "Chrome")
$contentJS | Out-File -FilePath "dist/Chrome/CryptoResearchPaperTabTitles/content.js"

# manifest.json
# Parse and emit via PowerShell to keep the formatting consistent with the Safari version
$json = Get-Content -Path "manifest.json" -Raw | ConvertFrom-Json
$json | ConvertTo-Json -Depth 20 | Out-File -FilePath "dist/Chrome/CryptoResearchPaperTabTitles/manifest.json"