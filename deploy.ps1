# Script de despliegue para Windows PowerShell
# Servidor: facturacion.konsulta.ivitec.mx (31.220.98.150)

param(
    [string]$ServerHost = "facturacion.konsulta.ivitec.mx",
    [string]$ServerUser = "root",
    [string]$AppDir = "/opt/pension-app"
)

Write-Host "🚀 Iniciando despliegue en servidor de producción..." -ForegroundColor Green

# Variables
$DeployDir = "./deploy-temp"
$RemoteDir = $AppDir

try {
    Write-Host "📦 Preparando archivos para despliegue..." -ForegroundColor Yellow
    
    # Limpiar y crear directorio temporal
    if (Test-Path $DeployDir) {
        Remove-Item -Recurse -Force $DeployDir
    }
    New-Item -ItemType Directory -Path $DeployDir -Force | Out-Null
    
    # Copiar archivos necesarios
    Copy-Item -Recurse "backend" "$DeployDir/"
    Copy-Item -Recurse "frontend" "$DeployDir/"
    Copy-Item "docker-compose.prod.yml" "$DeployDir/docker-compose.yml"
    Copy-Item ".env.prod" "$DeployDir/.env"
    
    # Crear directorio para archivos procesados
    New-Item -ItemType Directory -Path "$DeployDir/data/processed_files" -Force | Out-Null
    
    Write-Host "🔧 Configurando servidor remoto..." -ForegroundColor Yellow
    
    # Comandos para ejecutar en el servidor remoto
    $RemoteCommands = @"
# Actualizar sistema
apt-get update -y

# Instalar Docker si no está instalado
if ! command -v docker &> /dev/null; then
    echo "Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
fi

# Instalar Docker Compose si no está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "Instalando Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-`$(uname -s)-`$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Crear directorio de la aplicación
mkdir -p $RemoteDir

# Detener contenedores existentes si los hay
cd $RemoteDir
if [ -f docker-compose.yml ]; then
    docker-compose down || true
fi
"@
    
    # Ejecutar comandos de configuración en el servidor
    Write-Host "Configurando Docker en el servidor..." -ForegroundColor Cyan
    $RemoteCommands | ssh "${ServerUser}@${ServerHost}" bash -s
    
    Write-Host "📤 Transfiriendo archivos al servidor..." -ForegroundColor Yellow
    
    # Usar scp para transferir archivos (requiere que tengas scp instalado)
    # Alternativa: usar rsync si está disponible en Windows
    scp -r "$DeployDir/*" "$ServerUser@$ServerHost`:$RemoteDir/"
    
    Write-Host "🐳 Iniciando contenedores en el servidor..." -ForegroundColor Yellow
    
    # Comandos para construir y ejecutar en el servidor
    $DeployCommands = @"
cd $RemoteDir

# Construir y ejecutar contenedores
docker-compose build --no-cache
docker-compose up -d

# Esperar a que los servicios estén listos
echo "Esperando a que los servicios estén listos..."
sleep 30

# Verificar estado de los contenedores
docker-compose ps

# Verificar salud de los servicios
    echo "Verificando salud del backend..."
    curl -f http://31.220.98.150:8000/health || echo "Backend no responde"
    
    echo "Verificando frontend..."
    curl -f http://31.220.98.150:81 || echo "Frontend no responde"
"@
    
    # Ejecutar comandos de despliegue
    $DeployCommands | ssh "${ServerUser}@${ServerHost}" bash -s
    
    Write-Host "✅ Despliegue completado!" -ForegroundColor Green
    Write-Host "🌐 Aplicación disponible en: http://facturacion.konsulta.ivitec.mx" -ForegroundColor Green
    Write-Host "🔧 API disponible en: http://facturacion.konsulta.ivitec.mx:8000" -ForegroundColor Green
    
}
catch {
    Write-Host "❌ Error durante el despliegue: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    # Limpiar archivos temporales
    if (Test-Path $DeployDir) {
        Remove-Item -Recurse -Force $DeployDir
    }
}

Write-Host "📋 Comandos útiles para el servidor:" -ForegroundColor Yellow
Write-Host "  - Ver logs: ssh ${ServerUser}@${ServerHost} 'cd ${RemoteDir} && docker-compose logs -f'" -ForegroundColor Cyan
Write-Host "  - Reiniciar: ssh ${ServerUser}@${ServerHost} 'cd ${RemoteDir} && docker-compose restart'" -ForegroundColor Cyan
Write-Host "  - Detener: ssh ${ServerUser}@${ServerHost} 'cd ${RemoteDir} && docker-compose down'" -ForegroundColor Cyan