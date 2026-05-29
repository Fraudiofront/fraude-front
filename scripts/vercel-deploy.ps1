param(
    [string]$EnvFile = ".env.despligue",
    [switch]$Preview
)

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

$env:Path = "C:\nvm4w\nodejs;C:\Users\luigg\AppData\Roaming\npm;" + $env:Path

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    throw "Vercel CLI no instalado. Ejecuta: npm install -g vercel"
}

if (-not (Test-Path $EnvFile)) {
    throw "No se encontro $EnvFile"
}

Write-Host "Comprobando sesion Vercel..."
vercel whoami
if ($LASTEXITCODE -ne 0) {
    throw "Ejecuta primero: vercel login"
}

if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..."
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        pnpm install
    } else {
        npm install
    }
}

Write-Host "Subiendo variables desde $EnvFile a Vercel (production)..."
Get-Content $EnvFile -Encoding UTF8 | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) { return }
    if ($line -match "TU-FRONT") { return }

    $eq = $line.IndexOf("=")
    if ($eq -lt 1) { return }

    $key = $line.Substring(0, $eq).Trim()
    $value = $line.Substring($eq + 1).Trim()
    if (-not $key) { return }

    Write-Host "  $key"
    $value | vercel env add $key production --force 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Fallo al definir $key en Vercel"
    }
}

Write-Host ""
Write-Host "Desplegando en Vercel..."
if (-not (Test-Path ".vercel/project.json")) {
    Write-Host "Vinculando proyecto fraude-front..."
    vercel link --yes --project fraude-front 2>&1 | Out-Null
}

if ($Preview) {
    vercel deploy --yes
} else {
    vercel deploy --prod --yes
}
if ($LASTEXITCODE -ne 0) {
    throw "Fallo el deploy en Vercel"
}

Write-Host ""
Write-Host "Listo. Actualiza Railway con la URL del front:"
Write-Host "  FRONTEND_URL=https://tu-proyecto.vercel.app"
Write-Host "  ALLOWED_ORIGINS=https://tu-proyecto.vercel.app"
