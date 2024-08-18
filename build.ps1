if (!(Test-Path -Path "dist")) {
    New-Item -ItemType Directory -Name "dist"
}

$outputDirectory = "dist/CryptoResearchPaperTabTitles"
if (Test-Path -Path $outputDirectory) {
    Remove-Item -Recurse -Path $outputDirectory
}

New-Item -ItemType Directory -Path $outputDirectory
Copy-Item -Path "manifest.json" -Destination $outputDirectory
Copy-Item -Path "src/content.js" -Destination $outputDirectory
Copy-Item -Path "src/service-worker.js" -Destination $outputDirectory
Copy-Item -Path "icon/icon16.png" -Destination $outputDirectory
Copy-Item -Path "icon/icon32.png" -Destination $outputDirectory
Copy-Item -Path "icon/icon48.png" -Destination $outputDirectory
Copy-Item -Path "icon/icon128.png" -Destination $outputDirectory
