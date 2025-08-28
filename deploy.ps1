# Script de deployment para producción
# Servidor: 31.220.98.150
# Puertos: Frontend 8080, Backend 8000, MySQL 3307

$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando deployment de la aplicación Auth..." -ForegroundColor Green
Write-Host "📍 Servidor: 31.220.98.150" -ForegroundColor Cyan
Write-Host "🌐 Frontend: Puerto 8080" -ForegroundColor Green
Write-Host "⚙️  Backend: Puerto 8000" -ForegroundColor Green
Write-Host "🗄️  Base de datos: Puerto 3307" -ForegroundColor Green
Write-Host ""

# Verificar que Docker esté ejecutándose
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Error: Docker no está ejecutándose" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Deteniendo servicios existentes..." -ForegroundColor Yellow
try {
    docker compose down --remove-orphans
} catch {
    Write-Host "⚠️  No hay servicios previos para detener" -ForegroundColor Yellow
}

Write-Host "🧹 Limpiando imágenes antiguas..." -ForegroundColor Yellow
docker system prune -f

Write-Host "🏗️  Construyendo imágenes..." -ForegroundColor Blue
docker compose build --no-cache --parallel

Write-Host "🚀 Iniciando servicios..." -ForegroundColor Green
docker compose up -d

Write-Host "⏳ Esperando que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar estado de los contenedores
Write-Host "📊 Estado de los contenedores:" -ForegroundColor Cyan
docker compose ps

# Health checks
Write-Host "🏥 Verificando salud de los servicios..." -ForegroundColor Blue

# Verificar backend
Write-Host "🔍 Verificando backend (31.220.98.150:8000)..." -ForegroundColor Blue
$backendReady = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://31.220.98.150:8000/health" -Method GET -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend está funcionando correctamente" -ForegroundColor Green
            $backendReady = $true
            break
        }
    } catch {
        Write-Host "⏳ Intento $i/10: Backend no está listo, esperando..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
}

if (-not $backendReady) {
    Write-Host "❌ Backend no responde después de 10 intentos" -ForegroundColor Red
    Write-Host "📋 Logs del backend:" -ForegroundColor Yellow
    docker compose logs backend --tail=50
    exit 1
}

# Verificar frontend
Write-Host "🔍 Verificando frontend (31.220.98.150:8080)..." -ForegroundColor Blue
$frontendReady = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://31.220.98.150:8080/" -Method GET -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Frontend está funcionando correctamente" -ForegroundColor Green
            $frontendReady = $true
            break
        }
    } catch {
        Write-Host "⏳ Intento $i/10: Frontend no está listo, esperando..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
}

if (-not $frontendReady) {
    Write-Host "❌ Frontend no responde después de 10 intentos" -ForegroundColor Red
    Write-Host "📋 Logs del frontend:" -ForegroundColor Yellow
    docker compose logs frontend --tail=50
    exit 1
}

# Verificar base de datos
Write-Host "🔍 Verificando base de datos..." -ForegroundColor Blue
$dbReady = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $result = docker compose exec -T db mysqladmin ping -h localhost --silent
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Base de datos está funcionando correctamente" -ForegroundColor Green
            $dbReady = $true
            break
        }
    } catch {
        Write-Host "⏳ Intento $i/10: Base de datos no está lista, esperando..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
}

if (-not $dbReady) {
    Write-Host "❌ Base de datos no responde después de 10 intentos" -ForegroundColor Red
    Write-Host "📋 Logs de la base de datos:" -ForegroundColor Yellow
    docker compose logs db --tail=50
    exit 1
}

Write-Host ""
Write-Host "🎉 ¡Deployment completado exitosamente!" -ForegroundColor Green
Write-Host "📱 Aplicación disponible en: http://31.220.98.150:8080" -ForegroundColor Green
Write-Host "🔧 API disponible en: http://31.220.98.150:8000" -ForegroundColor Green
Write-Host "🗄️  Base de datos disponible en: 31.220.98.150:3307" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Para ver logs en tiempo real:" -ForegroundColor Yellow
Write-Host "   docker compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Para detener la aplicación:" -ForegroundColor Yellow
Write-Host "   docker compose down" -ForegroundColor White
Write-Host ""