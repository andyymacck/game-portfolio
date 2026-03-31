param(
  [Parameter(Mandatory=$true)][string]$SourcePath,
  [ValidateSet('Project','Build')][string]$Mode = 'Build',
  [ValidateSet('zip','7z')][string]$Format = 'zip',
  [string]$OutPath
)

$ErrorActionPreference = 'Stop'

# Resolve paths
$root = Split-Path -Parent $PSScriptRoot
if (-not $OutPath) {
  $defaultName = if ($Format -eq '7z') { 'featured-unity.7z' } else { 'featured-unity.zip' }
  $OutPath = Join-Path $root (Join-Path 'public/downloads' $defaultName)
}
$absSource = Resolve-Path $SourcePath
$absOut = $OutPath

# Create staging directory in temp
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$stage = Join-Path $env:TEMP "featured-archive-$stamp"
New-Item -ItemType Directory -Force -Path $stage | Out-Null

Write-Host "Preparing staged copy from: $absSource" -ForegroundColor Cyan

function Copy-Core($from, $to) {
  New-Item -ItemType Directory -Force -Path $to | Out-Null
  if ($PSVersionTable.PSVersion.Major -ge 7) {
    Copy-Item -Path (Join-Path $from '*') -Destination $to -Recurse -Force -ErrorAction Stop
  } else {
    robocopy $from $to /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
  }
}

switch ($Mode) {
  'Project' {
    # For a Unity project, include only size-efficient folders (Assets, Packages, ProjectSettings)
    $include = @('Assets','Packages','ProjectSettings')
    foreach ($dir in $include) {
      $src = Join-Path $absSource $dir
      if (Test-Path $src) {
        $dst = Join-Path $stage $dir
        Write-Host "Copying $dir ..."
        Copy-Core $src $dst
      }
    }
    # Optional: include README or docs if present
    foreach ($doc in @('README.md','LICENSE','README.txt')) {
      $p = Join-Path $absSource $doc
      if (Test-Path $p) { Copy-Item $p -Destination $stage -Force }
    }
  }
  'Build' {
    # For a built game folder, copy everything but exclude obvious debug and backup folders
    # Common Unity build leftovers to exclude
    $excludes = @(
      '*_BackUpThisFolder_ButDontShipItWithYourGame*',
      '*.pdb', '*.mdb', '*.log',
      'Logs', 'CrashReports'
    )
    Write-Host "Copying build folder ..."
    Copy-Core $absSource $stage
    foreach ($pattern in $excludes) {
      Get-ChildItem -Path $stage -Recurse -Force -ErrorAction SilentlyContinue -Include $pattern | ForEach-Object {
        try {
          if ($_.PSIsContainer) { Remove-Item $_.FullName -Recurse -Force }
          else { Remove-Item $_.FullName -Force }
        } catch {}
      }
    }
  }
}

# Ensure output directory exists
$outDir = Split-Path -Parent $absOut
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

if (Test-Path $absOut) { Remove-Item $absOut -Force }

Write-Host "Creating ZIP: $absOut" -ForegroundColor Cyan
if ($Format -eq '7z') {
  # Try to use 7-Zip if available
  $sevenZip = $null
  try {
    $sevenZip = (Get-Command 7z -ErrorAction Stop).Source
  } catch {}

  if ($sevenZip) {
    Write-Host "Using 7-Zip: $sevenZip" -ForegroundColor Cyan
    # -mx=9 maximum, -m0=lzma2 for best compression, -ms=on solid archive, -slp to store symlinks as links if any
    & $sevenZip a -t7z `
      -mx=9 -m0=lzma2 -ms=on `
      -- $absOut (Join-Path $stage '*') | Out-Null
  } else {
    Write-Warning '7-Zip not found in PATH. Falling back to ZIP (Compress-Archive). Install 7-Zip for smaller archives.'
    Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $absOut -CompressionLevel Optimal
  }
} else {
  Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $absOut -CompressionLevel Optimal
}

# Cleanup stage
Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue

# Report size
if (Test-Path $absOut) {
  $fi = Get-Item $absOut
  $mb = [Math]::Round($fi.Length / 1MB, 2)
  Write-Host ("Archive created: {0} ({1} MB)" -f $fi.FullName, $mb) -ForegroundColor Green
} else {
  Write-Warning 'Archive output not found.'
}

Write-Host 'Tip:' -ForegroundColor Yellow
Write-Host "- For Project mode, Unity caches (Library/Temp/Obj/.vs) are excluded automatically by only copying core folders."
Write-Host "- For Build mode, debug symbols and backup folders are excluded." 
Write-Host "- For even smaller media-heavy builds, recompress videos with scripts/compress-videos.ps1 before zipping."
Write-Host "- Use -Format 7z and install 7-Zip (winget install 7zip.7zip) for higher compression than ZIP."
