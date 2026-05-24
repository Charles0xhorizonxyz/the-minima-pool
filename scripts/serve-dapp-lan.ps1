param(
    [int]$Port = 8096
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$DappPath = Join-Path $Root "dapp"

if (-not (Test-Path -LiteralPath $DappPath)) {
    throw "DAPP folder not found: $DappPath"
}

$Ip = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.IPAddress -notlike "127.*" -and
        $_.IPAddress -notlike "169.254.*" -and
        $_.PrefixOrigin -ne "WellKnown"
    } |
    Sort-Object InterfaceAlias |
    Select-Object -First 1 -ExpandProperty IPAddress

if (-not $Ip) {
    throw "No active LAN IPv4 address found. Connect to Wi-Fi or Ethernet and try again."
}

Write-Host "Serving The Pool dapp from:"
Write-Host "  $DappPath"
Write-Host ""
Write-Host "Computer URL:"
Write-Host "  http://127.0.0.1:$Port/"
Write-Host ""
Write-Host "Phone URL, same Wi-Fi network:"
Write-Host "  http://$Ip`:$Port/"
Write-Host ""

$ExistingListeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($ExistingListeners) {
    $LanListener = $ExistingListeners | Where-Object {
        $_.LocalAddress -eq "0.0.0.0" -or $_.LocalAddress -eq $Ip
    } | Select-Object -First 1

    if ($LanListener) {
        Write-Host "A LAN-accessible server is already running on port $Port."
        Write-Host "Open this on your phone:"
        Write-Host "  http://$Ip`:$Port/"
        exit 0
    }

    Write-Host "Port $Port is already in use, but only on localhost."
    Write-Host "Stop the existing localhost server, then run this script again for phone access."
    exit 1
}

Write-Host "Leave this window open while testing. Press Ctrl+C to stop."
Write-Host "If the phone cannot connect, allow Python through Windows Firewall for private networks."

Set-Location -LiteralPath $DappPath
python -m http.server $Port --bind 0.0.0.0
