param(
  [string]$Version = "8.0"
)

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Err($msg){ Write-Host "[ERR ] $msg" -ForegroundColor Red }

$base = (Get-Location).Path
$toolsDir = Join-Path $base 'tools'
$ffDir = Join-Path $toolsDir 'ffmpeg'
$binDir = Join-Path $ffDir 'bin'
$exePath = Join-Path $binDir 'ffmpeg.exe'

if (Test-Path $exePath) {
  Write-Info "ffmpeg already present at $exePath"
  exit 0
}

New-Item -ItemType Directory -Force -Path $binDir | Out-Null

# Download a static full build zip from Gyan
$zipUrl = "https://github.com/GyanD/codexffmpeg/releases/download/$Version/ffmpeg-$Version-full_build.zip"
$zipPath = Join-Path $ffDir "ffmpeg-$Version-full_build.zip"

Write-Info "Downloading ffmpeg $Version ..."
Invoke-WebRequest -UseBasicParsing -Uri $zipUrl -OutFile $zipPath

Write-Info "Extracting ..."
$extractDir = Join-Path $ffDir "ffmpeg-$Version-full_build"
Expand-Archive -Path $zipPath -DestinationPath $ffDir -Force

# Move the bin content to tools/ffmpeg/bin
$srcBin = Join-Path $extractDir 'bin'
if (-not (Test-Path $srcBin)) { Write-Err "Unexpected archive layout. Check $extractDir"; exit 1 }
Get-ChildItem -Path $srcBin -File | ForEach-Object { Copy-Item $_.FullName -Destination $binDir -Force }

Write-Info "ffmpeg installed at $exePath"
Write-Info "You can now run: powershell -ExecutionPolicy Bypass -File scripts\\compress-videos.ps1 -Ffmpeg `"$exePath`""
