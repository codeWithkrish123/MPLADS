$docsPath = "E:\MPLADS\MPLADS-UI\docs"
$rootPath = "E:\MPLADS\MPLADS-UI"

# Get all .md and .txt files in root directory only (not subdirectories)
$files = Get-ChildItem -Path $rootPath -File | Where-Object {
    $_.Directory.FullName -eq $rootPath -and
    ($_.Extension -eq ".md" -or $_.Extension -eq ".txt") -and 
    $_.Name -notlike "README*" -and
    $_.Name -notlike "package*" -and
    $_.Name -notlike ".env*" -and
    $_.Name -notlike "index*" -and
    $_.Name -notlike "vite*" -and
    $_.Name -notlike "tsconfig*" -and
    $_.Name -notlike "metadata*" -and
    $_.Name -notlike "move-docs*"
}

Write-Host "Moving $($files.Count) files to docs folder..."
Write-Host ""

foreach ($file in $files) {
    Write-Host "Moving: $($file.Name)"
    Move-Item -Path $file.FullName -Destination "$docsPath\" -Force
}

Write-Host ""
Write-Host "✅ All documentation files moved to docs folder!"
Write-Host ""
Write-Host "Remaining .md/.txt files in root (should only be README.md):"
Get-ChildItem -Path $rootPath -File | Where-Object {
    $_.Directory.FullName -eq $rootPath -and ($_.Extension -eq ".md" -or $_.Extension -eq ".txt")
} | ForEach-Object { Write-Host "  - $($_.Name)" }
