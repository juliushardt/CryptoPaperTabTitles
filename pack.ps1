#!/usr/bin/env pwsh

$version = (Get-Content -Path ./manifest.json | ConvertFrom-Json).version
Compress-Archive -Path ./dist/CryptoResearchPaperTabTitles/* -DestinationPath ./dist/CryptoResearchPaperTabTitles-$version.zip