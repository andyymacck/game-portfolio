# Requires: GitHub CLI (gh) and git
# Purpose: Create or update a GitHub Release for the Touchy game and upload a build asset.
# Outputs the asset download URL you can set as REACT_APP_TOUCHY_RELEASE_URL for the site build.

[CmdletBinding()]
param(
  [Parameter(Mandatory=$true, HelpMessage="Path to the Touchy build archive to upload (e.g., .zip or .7z)")]
  [string]$AssetPath,

  [Parameter(Mandatory=$false, HelpMessage="Release tag (default: touchy-v0.1.0)")]
  [string]$Tag = "touchy-v0.1.0",

  [Parameter(Mandatory=$false, HelpMessage="Release title (default: Touchy RPG v0.1.0)")]
  [string]$Title = "Touchy RPG v0.1.0",

  [Parameter(Mandatory=$false, HelpMessage="Markdown notes for the release")]
  [string]$Notes = "Playable build of the Touchy RPG demo.",

  [Parameter(Mandatory=$false, HelpMessage="GitHub repo in 'owner/name' format; auto-detected from 'origin' if omitted")]
  [string]$Repo
)

function Fail($msg) { Write-Error $msg; exit 1 }

# Checks
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Fail "git is required. Install Git for Windows from https://git-scm.com/download/win" }
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { Fail "GitHub CLI (gh) is required. Install via winget: winget install --id GitHub.cli -e" }

if (-not (Test-Path -LiteralPath $AssetPath)) { Fail "Asset not found: $AssetPath" }

# Determine repo if not provided
if (-not $Repo) {
  $remoteUrl = git remote get-url origin 2>$null
  if (-not $remoteUrl) { Fail "Could not determine git remote 'origin'. Provide -Repo 'owner/name' explicitly." }
  # Handle SSH and HTTPS forms
  # SSH: git@github.com:owner/repo.git
  # HTTPS: https://github.com/owner/repo.git
  if ($remoteUrl -match ":([^/]+)/([^/]+?)(\.git)?$") {
    $Repo = "$($Matches[1])/$($Matches[2])"
  } elseif ($remoteUrl -match "github\.com/([^/]+)/([^/]+?)(\.git)?$") {
    $Repo = "$($Matches[1])/$($Matches[2])"
  }
  if (-not $Repo) { Fail "Failed to parse repo from remote URL: $remoteUrl. Provide -Repo 'owner/name'." }
}

# Verify gh auth
gh auth status --show-token --hostname github.com 1>$null 2>$null
if ($LASTEXITCODE -ne 0) { Fail "You are not authenticated with GitHub CLI. Run: gh auth login" }

$assetName = Split-Path -Path $AssetPath -Leaf
$downloadUrl = "https://github.com/$Repo/releases/download/$Tag/$assetName"

Write-Host "Repo:        $Repo" -ForegroundColor Cyan
Write-Host "Tag:         $Tag" -ForegroundColor Cyan
Write-Host "Title:       $Title" -ForegroundColor Cyan
Write-Host "Asset:       $AssetPath" -ForegroundColor Cyan
Write-Host "Will publish: $downloadUrl" -ForegroundColor DarkCyan

# Create or update release
Write-Host "Checking if release '$Tag' exists..." -ForegroundColor Yellow
gh release view "$Tag" --repo "$Repo" 1>$null 2>$null
$exists = ($LASTEXITCODE -eq 0)

if (-not $exists) {
  Write-Host "Creating release '$Tag'..." -ForegroundColor Yellow
  gh release create "$Tag" "$AssetPath" --title "$Title" --notes "$Notes" --repo "$Repo" | Out-Null
  if ($LASTEXITCODE -ne 0) { Fail "Failed to create release." }
} else {
  Write-Host "Release exists. Uploading asset..." -ForegroundColor Yellow
  gh release upload "$Tag" "$AssetPath" --clobber --repo "$Repo" | Out-Null
  if ($LASTEXITCODE -ne 0) { Fail "Failed to upload asset." }
}

Write-Host "Success! Release asset available at:" -ForegroundColor Green
Write-Host $downloadUrl -ForegroundColor Green

Write-Host "\nNext steps:" -ForegroundColor Magenta
Write-Host "1) Build the site with this env var so the Download button points to the release asset:" -ForegroundColor Gray
Write-Host "   $env:REACT_APP_TOUCHY_RELEASE_URL = '$downloadUrl'; npm run build" -ForegroundColor White
Write-Host "2) Deploy:" -ForegroundColor Gray
Write-Host "   npx gh-pages -d build --dotfiles --message 'Deploy Touchy release link'" -ForegroundColor White
