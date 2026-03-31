param(
  [int]$ThresholdMB = 80
)

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[WARN] $msg" -ForegroundColor Yellow }

$root = Join-Path (Get-Location) 'public'
if (-not (Test-Path $root)) { Write-Warn "public folder not found at $root"; exit 1 }

$files = Get-ChildItem -Path $root -Recurse -File -Include *.mp4 | Sort-Object FullName
if (-not $files) { Write-Info "No MP4 files found."; exit 0 }

Write-Info ("Found {0} MP4 file(s)." -f $files.Count)
$over = @()
foreach ($f in $files) {
  $mb = [math]::Round($f.Length/1MB, 2)
  $rel = $f.FullName.Replace((Get-Location).Path + [System.IO.Path]::DirectorySeparatorChar, '')
  Write-Host ("{0}`t{1} MB" -f $rel, $mb)
  if ($f.Length -gt ($ThresholdMB * 1MB)) { $over += $f }
}

if ($over.Count -gt 0) {
  Write-Warn ("{0} file(s) exceed {1} MB:" -f $over.Count, $ThresholdMB)
  foreach ($o in $over) {
    $mb = [math]::Round($o.Length/1MB, 2)
    Write-Host ("  - {0} ({1} MB)" -f $o.FullName, $mb)
  }
  exit 2
}

Write-Info ("All files are <= {0} MB." -f $ThresholdMB)
exit 0
