param(
    [int]$Port = 3000
)

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

. "$PSScriptRoot\ensure-node.ps1"

if (-not (Test-Path ".\node_modules")) {
    Write-Host "Instalando dependencias..."
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        pnpm install
    } else {
        npm install
    }
    if ($LASTEXITCODE -ne 0) { throw "Fallo la instalacion de dependencias" }
}

Write-Host ""
Write-Host "Iniciando frontend en http://localhost:$Port ..."
Write-Host ""

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm exec next dev -p $Port
} else {
    npm run dev -- -p $Port
}
