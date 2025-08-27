#!/bin/bash

# Script de despliegue para el servidor de producción
# Servidor: facturacion.konsulta.ivitec.mx (31.220.98.150)

set -e

echo "🚀 Iniciando despliegue en servidor de producción..."

# Variables del servidor
SERVER_HOST="facturacion.konsulta.ivitec.mx"
SERVER_USER="root"
APP_DIR="/opt/pension-app"
REMOTE_DIR="$APP_DIR"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Preparando archivos para despliegue...${NC}"

# Crear directorio temporal para el despliegue
DEPLOY_DIR="./deploy-temp"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copiar archivos necesarios
cp -r backend $DEPLOY_DIR/
cp -r frontend $DEPLOY_DIR/
cp docker-compose.prod.yml $DEPLOY_DIR/docker-compose.yml
cp .env.prod $DEPLOY_DIR/.env

# Crear directorio para archivos procesados
mkdir -p $DEPLOY_DIR/data/processed_files

echo -e "${YELLOW}🔧 Configurando servidor remoto...${NC}"

# Conectar al servidor y preparar el entorno
ssh $SERVER_USER@$SERVER_HOST << 'ENDSSH'
    # Actualizar sistema
    apt-get update
    
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
        curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    # Crear directorio de la aplicación
    mkdir -p /opt/pension-app
    
    # Detener contenedores existentes si los hay
    cd /opt/pension-app
    if [ -f docker-compose.yml ]; then
        docker-compose down || true
    fi
ENDSSH

echo -e "${YELLOW}📤 Transfiriendo archivos al servidor...${NC}"

# Transferir archivos al servidor
rsync -avz --delete $DEPLOY_DIR/ $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

echo -e "${YELLOW}🐳 Iniciando contenedores en el servidor...${NC}"

# Ejecutar en el servidor remoto
ssh $SERVER_USER@$SERVER_HOST << ENDSSH
    cd $REMOTE_DIR
    
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
    curl -f http://localhost:8000/health || echo "Backend no responde"
    
    echo "Verificando frontend..."
    curl -f http://localhost:80 || echo "Frontend no responde"
ENDSSH

echo -e "${GREEN}✅ Despliegue completado!${NC}"
echo -e "${GREEN}🌐 Aplicación disponible en: http://facturacion.konsulta.ivitec.mx${NC}"
echo -e "${GREEN}🔧 API disponible en: http://facturacion.konsulta.ivitec.mx:8000${NC}"

# Limpiar archivos temporales
rm -rf $DEPLOY_DIR

echo -e "${YELLOW}📋 Comandos útiles para el servidor:${NC}"
echo "  - Ver logs: ssh $SERVER_USER@$SERVER_HOST 'cd $REMOTE_DIR && docker-compose logs -f'"
echo "  - Reiniciar: ssh $SERVER_USER@$SERVER_HOST 'cd $REMOTE_DIR && docker-compose restart'"
echo "  - Detener: ssh $SERVER_USER@$SERVER_HOST 'cd $REMOTE_DIR && docker-compose down'"