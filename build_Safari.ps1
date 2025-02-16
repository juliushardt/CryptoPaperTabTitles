#!/usr/bin/env pwsh

if (!(Test-Path -Path "dist/Safari")) {
    New-Item -ItemType Directory -Path "dist/Safari" > $null
}

$outputDirectory = "dist/Safari/CryptoResearchPaperTabTitles"
if (Test-Path -Path $outputDirectory) {
    Remove-Item -Recurse -Path $outputDirectory
}

New-Item -ItemType Directory -Path $outputDirectory > $null
Copy-Item -Path "icon/icon16.png" -Destination $outputDirectory
Copy-Item -Path "icon/icon32.png" -Destination $outputDirectory
Copy-Item -Path "icon/icon48.png" -Destination $outputDirectory
Copy-Item -Path "icon/icon128.png" -Destination $outputDirectory

# content.js
$contentJS = Get-Content -Path "src/content.js" -Raw 
$contentJS = $contentJS.Replace("___BROWSER___", "Safari")
$contentJS | Out-File -FilePath "dist/Safari/CryptoResearchPaperTabTitles/content.js"

# manifest.json
$json = Get-Content -Path "manifest.json" -Raw | ConvertFrom-Json

# We only need Service workers to work around a bug in Chrome and Edge.
# In Safari, they are not needed.
$json = $json | Select-Object -Property * -ExcludeProperty "background"

# include_globs are currently not supported in Safari
$json.content_scripts[0] = $json.content_scripts[0] | Select-Object -Property * -ExcludeProperty "include_globs"

$json | ConvertTo-Json -Depth 20 | Out-File -FilePath "dist/Safari/CryptoResearchPaperTabTitles/manifest.json"