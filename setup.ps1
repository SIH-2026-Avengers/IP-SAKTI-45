$ErrorActionPreference = 'Stop'

$repoRoot = $PSScriptRoot
$backendPath = Join-Path $repoRoot 'backend'
$envTemplate = Join-Path $repoRoot '.env.example'
$envFile = Join-Path $repoRoot '.env'
$classifierModel = Join-Path $backendPath 'models\IPShaktiRiverClassifier.pkl'

foreach ($commandName in @('uv', 'node', 'npm')) {
    if (-not (Get-Command $commandName -ErrorAction SilentlyContinue)) {
        throw "Required command '$commandName' was not found. Install uv and Node.js (22.12 or newer), then rerun setup.ps1."
    }
}

$nodeVersionText = (node --version).TrimStart('v')
$nodeVersion = [version]$nodeVersionText
if ($nodeVersion -lt [version]'22.12.0') {
    throw "Node.js 22.12 or newer is required by Vite. Found $nodeVersionText."
}

if (-not (Test-Path -LiteralPath $envTemplate -PathType Leaf)) {
    throw "Environment template not found: $envTemplate"
}

Write-Host 'Installing the locked Python 3.12 backend environment...'
uv python install 3.12
if ($LASTEXITCODE -ne 0) {
    throw 'Could not install Python 3.12 with uv.'
}

uv sync --project $backendPath --locked --extra notebook
if ($LASTEXITCODE -ne 0) {
    throw 'Python dependency installation failed.'
}

Write-Host 'Installing the locked frontend dependencies...'
Push-Location $repoRoot
try {
    npm ci
    if ($LASTEXITCODE -ne 0) {
        throw 'Frontend dependency installation failed.'
    }

    if (-not (Test-Path -LiteralPath $envFile -PathType Leaf)) {
        Copy-Item -LiteralPath $envTemplate -Destination $envFile
        Write-Host 'Created .env from .env.example. Add your optional LLM API keys there.'
    }

    if (-not (Test-Path -LiteralPath $classifierModel -PathType Leaf)) {
        uv run --project $backendPath --locked python backend/scripts/train_incremental_classifier.py
        if ($LASTEXITCODE -ne 0) {
            throw 'Initial River classifier training failed.'
        }
    }

    Write-Host 'Building the frontend to verify the deployment bundle...'
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw 'Frontend production build failed.'
    }
}
finally {
    Pop-Location
}

Write-Host ''
Write-Host 'Setup completed.'
Write-Host 'Backend:  cd backend; uv run --locked uvicorn main:app --host 127.0.0.1 --port 8000 --reload'
Write-Host 'Frontend: npm run dev'
Write-Host 'Deploy:   push this repository to GitHub and connect it to Render using render.yaml.'
