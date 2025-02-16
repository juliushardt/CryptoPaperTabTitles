#!/usr/bin/env pwsh

$version = (Get-Content -Path ./manifest.json -Raw | ConvertFrom-Json).version
if (Test-Path -Path "./dist/Chrome") {
    Compress-Archive -Path "./dist/Chrome/CryptoResearchPaperTabTitles/*" -DestinationPath "./dist/Chrome/CryptoResearchPaperTabTitles-$version.zip"
} else {
    Write-Error -Message "You need to build the extension first using build_Chrome.ps1."
}