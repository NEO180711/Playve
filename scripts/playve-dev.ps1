# Playve: PATH 재로드 + npm.cmd 절대 경로로 실행 (Node는 있는데 PowerShell에서 npm만 안 잡히는 경우)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Test-NpmInDir([string] $Dir) {
  if (-not $Dir) { return $false }
  return (Test-Path -LiteralPath (Join-Path $Dir "npm.cmd"))
}

function Find-NpmFromRegistry {
  $patterns = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*"
  )
  foreach ($pattern in $patterns) {
    $props = Get-ItemProperty -Path $pattern -ErrorAction SilentlyContinue |
      Where-Object { $_.DisplayName -match "^Node\.js" -and $_.InstallLocation }
    foreach ($p in $props) {
      $loc = ($p.InstallLocation -replace '[\\/]+$', "")
      foreach ($base in @($loc, (Join-Path $loc "nodejs"))) {
        $npm = Join-Path $base "npm.cmd"
        if (Test-Path -LiteralPath $npm) { return $npm }
      }
    }
  }
  return $null
}

$nodeDirCandidates = @(
  (Join-Path $env:ProgramFiles "nodejs"),
  (Join-Path ${env:ProgramFiles(x86)} "nodejs"),
  "C:\Program Files\nodejs",
  "C:\Program Files (x86)\nodejs",
  (Join-Path $env:LOCALAPPDATA "Programs\node"),
  (Join-Path $env:LOCALAPPDATA "Programs\nodejs"),
  (Join-Path $env:USERPROFILE ".volta\bin")
)

$npmCmd = $null
foreach ($dir in $nodeDirCandidates) {
  if (Test-NpmInDir $dir) {
    $npmCmd = Join-Path $dir "npm.cmd"
    $env:Path = "$dir;$env:Path"
    Write-Host "[Playve] npm.cmd 발견: $npmCmd" -ForegroundColor Cyan
    break
  }
}

if (-not $npmCmd) {
  $npmCmd = Find-NpmFromRegistry
  if ($npmCmd) {
    $dir = Split-Path -Parent $npmCmd
    $env:Path = "$dir;$env:Path"
    Write-Host "[Playve] 레지스트리에서 npm.cmd 발견: $npmCmd" -ForegroundColor Cyan
  }
}

if (-not $npmCmd) {
  $which = (& where.exe npm.cmd 2>$null | Select-Object -First 1)
  if ($which -and (Test-Path -LiteralPath $which)) {
    $npmCmd = $which
    $dir = Split-Path -Parent $npmCmd
    $env:Path = "$dir;$env:Path"
    Write-Host "[Playve] where.exe로 npm.cmd 발견: $npmCmd" -ForegroundColor Cyan
  }
}

if (-not $npmCmd) {
  Write-Host ""
  Write-Host "[Playve] npm.cmd을 찾지 못했습니다." -ForegroundColor Red
  Write-Host "  winget에 Node가 있다고 나와도, PATH에 없으면 이렇게 보일 수 있습니다." -ForegroundColor Yellow
  Write-Host "  - 탐색기에서 ""C:\Program Files\nodejs\npm.cmd"" 파일이 있는지 확인하세요." -ForegroundColor Yellow
  Write-Host "  - 없으면 Node.js를 https://nodejs.org LTS로 다시 설치(Repair)하세요." -ForegroundColor Yellow
  Write-Host ""
  exit 1
}

Write-Host "[Playve] npm install 실행" -ForegroundColor Green
& $npmCmd install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "[Playve] npm run dev 실행" -ForegroundColor Green
& $npmCmd run dev
