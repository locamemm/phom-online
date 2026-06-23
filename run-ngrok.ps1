<#
run-ngrok.ps1

Helper script to configure ngrok authtoken (from env NGROK_AUTHTOKEN or prompt),
optionally start the local server, and run ngrok http <port>.

USAGE:
  # Prompt for token and run ngrok on port 3000
  .\run-ngrok.ps1

  # Use existing env var and start server in a new window, then ngrok
  $env:NGROK_AUTHTOKEN = "<your-token-here>"; .\run-ngrok.ps1 -StartServer

Security note: Do NOT commit or paste your authtoken into public places. If
you shared a token, revoke it in your ngrok dashboard and generate a new one.
#>

param(
    [int]$Port = 3000,
    [switch]$StartServer,
    [string]$ServerCmd = 'npm start'
)

function Get-PlainTextFromSecureString($s) {
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
    try { [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
    finally { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

Write-Host "== ngrok helper ==" -ForegroundColor Cyan

# Determine ngrok executable
$ngrokExe = Join-Path $PSScriptRoot 'ngrok.exe'
if (-not (Test-Path $ngrokExe)) {
    # fallback to PATH
    $ngrokExe = 'ngrok'
}

# Get authtoken from env or prompt
$token = $null
if ($env:NGROK_AUTHTOKEN) {
    $token = $env:NGROK_AUTHTOKEN
    Write-Host "Using NGROK_AUTHTOKEN from environment." -ForegroundColor Yellow
} else {
    Write-Host "No NGROK_AUTHTOKEN env var found. You can paste it now (input hidden)." -ForegroundColor Yellow
    $secure = Read-Host -AsSecureString "Enter ngrok authtoken (will not echo) or press Enter to skip"
    if ($secure.Length -gt 0) { $token = Get-PlainTextFromSecureString $secure }
}

if ($token) {
    Write-Host "Configuring ngrok authtoken..." -ForegroundColor Green
    try {
        & $ngrokExe config add-authtoken $token 2>&1 | Write-Host
    } catch {
        # try legacy command
        try { & $ngrokExe authtoken $token 2>&1 | Write-Host } catch { Write-Warning "Failed to set authtoken: $_" }
    }
} else {
    Write-Host "No token provided — skipping authtoken configuration." -ForegroundColor Yellow
}

if ($StartServer) {
    Write-Host "Starting server in a new PowerShell window: $ServerCmd" -ForegroundColor Green
    # Build a safe command string and pass it as a separate argument to avoid quoting/parsing issues
    $serverCommand = "Set-Location -Path '$PSScriptRoot'; $ServerCmd"
    Start-Process -FilePath powershell -ArgumentList "-NoExit", "-Command", $serverCommand -WorkingDirectory $PSScriptRoot
    Start-Sleep -Seconds 1
}

Write-Host "Starting ngrok http $Port (press Ctrl+C to stop)..." -ForegroundColor Cyan
& $ngrokExe http $Port
