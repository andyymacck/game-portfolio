<#!
.SYNOPSIS
  Batch compress MP4 gameplay videos for the portfolio to stay under GitHub's 100MB per-file push limit.

.DESCRIPTION
  Scans target folders (public/unreal, public/unity, public) for .mp4 files larger than the threshold (default 40MB).
  For each oversized file, produces a _web.mp4 version using ffmpeg (H.264) and—if the result is smaller—replaces the original.
  Skips files already under threshold.

.REQUIREMENTS
  - Windows PowerShell
  - ffmpeg available in PATH (verify with: ffmpeg -version)

.PARAMETER ThresholdMB
  Only compress files larger than this many megabytes (default: 40).

.PARAMETER MaxWidth
  Maximum output horizontal resolution (default: 1280). If the source is narrower, it keeps original.

.PARAMETER CRF
  H.264 quality factor (lower = higher quality/larger size). Default 27 (balanced). Try 24 (higher quality) or 30 (smaller).

.PARAMETER Preset
  x264 preset (slower = better compression). Default: slow. Accepts: veryslow, slow, medium, fast.

.PARAMETER DryRun
  If set, shows which files WOULD be compressed without modifying anything.

.PARAMETER Force
  Force recompress even if a _web.mp4 already exists.

.EXAMPLES
  # Standard run
  ./compress-videos.ps1

  # More aggressive compression
  ./compress-videos.ps1 -CRF 30 -Preset veryslow

  # Preview only
  ./compress-videos.ps1 -DryRun

.NOTES
  After compression, commit & redeploy:
    git add .
    git commit -m "Compress videos"
    git push
    npm run deploy
#>

param(
  [int]$ThresholdMB = 40,
  [int]$MaxWidth = 1280,
  [int]$CRF = 27,
  [ValidateSet('veryslow','slow','medium','fast')]
  [string]$Preset = 'slow',
  [switch]$DryRun,
  [switch]$Force,
  [string]$Ffmpeg
)

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[ERR ] $msg" -ForegroundColor Red }

# Helper to test if an encoder is supported by a given ffmpeg binary
function Test-EncoderSupport {
  param(
    [string]$Exe,
    [string]$Encoder
  )
  try {
    # Use regex search; lines look like: " V..... libx264 ..."
    $out = & $Exe -hide_banner -encoders 2>$null | Select-String -Pattern "(^|\s)$([regex]::Escape($Encoder))(\s|$)"
    return [bool]$out
  } catch { return $false }
}

### Resolve ffmpeg path (deterministic, project-scoped)
# 1) Explicit argument
if ($Ffmpeg) {
  if (Test-Path $Ffmpeg) { $ffmpegExe = (Resolve-Path $Ffmpeg).Path } else { Write-Err "Provided ffmpeg path not found: $Ffmpeg"; exit 1 }
}
# 2) Environment variable (e.g., setx FFMPEG_PATH "C:\\path\\to\\ffmpeg.exe")
if (-not $ffmpegExe -and $env:FFMPEG_PATH) {
  if (Test-Path $env:FFMPEG_PATH) { $ffmpegExe = (Resolve-Path $env:FFMPEG_PATH).Path }
}
# 3) Project-local tools folder
if (-not $ffmpegExe) {
  $localTool = Join-Path (Get-Location) 'tools\\ffmpeg\\bin\\ffmpeg.exe'
  if (Test-Path $localTool) { $ffmpegExe = (Resolve-Path $localTool).Path }
}
# 4) Last resort: PATH (current shell)
if (-not $ffmpegExe) {
  $cmd = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($cmd) { $ffmpegExe = $cmd.Source }
}

# Validate ffmpeg resolution
if (-not $ffmpegExe) {
  Write-Err "ffmpeg not found. Options: 1) run scripts\\setup-ffmpeg.ps1 to install a local copy; 2) pass -Ffmpeg 'C:\\path\\to\\ffmpeg.exe'; 3) set env var FFMPEG_PATH to a valid ffmpeg.exe."
  exit 1
}
Write-Info "Using ffmpeg: $ffmpegExe"

# Prepare a prioritized list of candidate codecs and filter by availability when possible
$codecCandidates = @('libx264','libopenh264','h264_nvenc','h264_qsv','h264_amf')
$availableCodecs = @()
foreach ($c in $codecCandidates) { if (Test-EncoderSupport -Exe $ffmpegExe -Encoder $c) { $availableCodecs += $c } }
if ($availableCodecs.Count -eq 0) {
  Write-Warn "Neither libx264 nor common H.264 encoders were detected; will try candidates anyway."
  $availableCodecs = $codecCandidates
}

$thresholdBytes = $ThresholdMB * 1MB
# Scan only the root public folder recursively to avoid duplicates
$targets = @( Join-Path -Path (Get-Location) -ChildPath 'public' )

$videos = @()
foreach ($t in $targets) {
  if (Test-Path $t) {
    $videos += Get-ChildItem -Path $t -Recurse -File -Include *.mp4 | Where-Object { $_.Length -ge $thresholdBytes }
  }
}

if (-not $videos.Count) {
  Write-Info "No MP4 files >= $ThresholdMB MB found. Nothing to do."; exit 0
}

Write-Info "Found $($videos.Count) video(s) >= $ThresholdMB MB."

foreach ($v in $videos | Sort-Object FullName -Unique) {
  $sizeMB = [math]::Round($v.Length / 1MB,2)
  $outPath = Join-Path $v.DirectoryName ($v.BaseName + '_web.mp4')
  Write-Info "Processing: $($v.FullName) ($sizeMB MB)"

  # Skip already web-optimized files unless forcing
  if ($v.BaseName -like '*_web') {
    if (-not $Force) { Write-Warn "Already optimized variant detected. Skipping ($($v.Name))."; continue }
  }

  if ((Test-Path $outPath) -and -not $Force) {
    # If an existing _web.mp4 is smaller than the original, promote it to replace the original
    $existingSize = (Get-Item $outPath).Length
    if ($existingSize -lt $v.Length) {
      $existingMB = [math]::Round($existingSize / 1MB,2)
      Write-Info "Existing web version is smaller ($existingMB MB). Replacing original."
      Remove-Item $v.FullName -Force
      Rename-Item $outPath $v.Name
    } else {
      Write-Warn "Output already exists ($outPath) but not smaller. Use -Force to regenerate. Skipping."
    }
    continue
  }

  if ($DryRun) { continue }

  # Quote paths that may contain spaces
  $quotedIn  = '"' + $v.FullName + '"'
  $quotedOut = '"' + $outPath + '"'

  $success = $false
  foreach ($codec in $availableCodecs) {
    $ffArgs = @(
      '-y',
      '-i', $quotedIn,
      '-vf', "scale=min($MaxWidth\,iw):-2,fps=30",
      '-c:v', $codec,
      '-preset', $Preset,
      '-crf', $CRF,
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-c:a', 'aac', '-b:a', '96k',
      $quotedOut
    )
    Write-Info "Running ffmpeg with $codec..."
    $proc = Start-Process -FilePath $ffmpegExe -ArgumentList $ffArgs -NoNewWindow -Wait -PassThru
    if ($proc.ExitCode -eq 0 -and (Test-Path $outPath)) { $success = $true; break }
    else {
      Write-Warn "ffmpeg failed with $codec (ExitCode: $($proc.ExitCode)). Trying next codec if available."
      if (Test-Path $outPath) { Remove-Item $outPath -Force }
    }
  }

  if (-not $success) {
    Write-Err "All codec attempts failed for $($v.Name). Skipping."
    continue
  }

  if (-not (Test-Path $outPath)) {
    Write-Err "Output file missing after ffmpeg. Skipping replace."
    continue
  }

  $newSize = (Get-Item $outPath).Length
  $newMB = [math]::Round($newSize / 1MB,2)
  if ($newSize -ge $v.Length) {
    Write-Warn "Compressed file ($newMB MB) is not smaller than original ($sizeMB MB). Keeping original."
    Remove-Item $outPath -Force
    continue
  }

  Write-Info "Compressed: $sizeMB MB -> $newMB MB"
  # Replace original
  Remove-Item $v.FullName -Force
  Rename-Item $outPath $v.Name
}

Write-Info "Done. Review changes, test locally, then commit & deploy."
