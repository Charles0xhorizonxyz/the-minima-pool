param(
    [string]$Version = "0.0.1-beta"
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$DappPath = Join-Path $Root "dapp"
$ReleasePath = Join-Path $Root "releases\latest"
$PackageName = "the-pool-$Version.mds.zip"
$PackagePath = Join-Path $ReleasePath $PackageName
$ChecksumPath = "$PackagePath.sha256"
$StagePath = Join-Path $ReleasePath "_staging"

if (-not (Test-Path -LiteralPath $DappPath)) {
    throw "DAPP folder not found: $DappPath"
}

if (-not (Test-Path -LiteralPath $ReleasePath)) {
    New-Item -ItemType Directory -Path $ReleasePath | Out-Null
}

$requiredFiles = @(
    "dapp.conf",
    "index.html",
    "app.js",
    "app_icon.png",
    "icon.png",
    "pool_icon.png",
    "mds-2.1.0.js",
    "styles.css",
    "favicon.ico",
    "favicon.svg"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $DappPath $file
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing required MiniDAPP file: $file"
    }
}

$confPath = Join-Path $DappPath "dapp.conf"
$conf = Get-Content -Raw -LiteralPath $confPath | ConvertFrom-Json
foreach ($field in @("name", "version", "description", "permission", "icon", "web")) {
    if (-not $conf.$field) {
        throw "dapp.conf missing required field: $field"
    }
}

if ($conf.permission -ne "read") {
    throw "dapp.conf permission must remain read for this prototype release."
}

$assetsPath = Join-Path $DappPath "assets"
if (-not (Test-Path -LiteralPath $assetsPath)) {
    throw "Missing assets folder."
}

$iconSource = Join-Path $assetsPath "the-minima-pool-telegram.png"
if (-not (Test-Path -LiteralPath $iconSource)) {
    throw "Missing icon source asset: assets/the-minima-pool-telegram.png"
}

$declaredIcon = Join-Path $DappPath $conf.icon
if (-not (Test-Path -LiteralPath $declaredIcon)) {
    throw "dapp.conf icon not found: $($conf.icon)"
}

$declaredWeb = Join-Path $DappPath $conf.web
if (-not (Test-Path -LiteralPath $declaredWeb)) {
    throw "dapp.conf web entry not found: $($conf.web)"
}

$resolvedRelease = (Resolve-Path -LiteralPath $ReleasePath).Path
if (Test-Path -LiteralPath $StagePath) {
    $resolvedStage = (Resolve-Path -LiteralPath $StagePath).Path
    if (-not $resolvedStage.StartsWith($resolvedRelease, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to remove staging path outside release folder: $resolvedStage"
    }
    Remove-Item -LiteralPath $StagePath -Recurse -Force
}

New-Item -ItemType Directory -Path $StagePath | Out-Null

foreach ($file in $requiredFiles) {
    Copy-Item -LiteralPath (Join-Path $DappPath $file) -Destination $StagePath
}

Copy-Item -LiteralPath $assetsPath -Destination (Join-Path $StagePath "assets") -Recurse

if (Test-Path -LiteralPath $PackagePath) {
    Remove-Item -LiteralPath $PackagePath -Force
}

if (Test-Path -LiteralPath $ChecksumPath) {
    Remove-Item -LiteralPath $ChecksumPath -Force
}

Compress-Archive -Path (Join-Path $StagePath "*") -DestinationPath $PackagePath -Force
$hash = Get-FileHash -Algorithm SHA256 -LiteralPath $PackagePath
Set-Content -LiteralPath $ChecksumPath -Value "$($hash.Hash)  $PackageName"

Remove-Item -LiteralPath $StagePath -Recurse -Force

Write-Host "Packaged MiniDAPP:"
Write-Host "  $PackagePath"
Write-Host "SHA256:"
Write-Host "  $($hash.Hash)"
