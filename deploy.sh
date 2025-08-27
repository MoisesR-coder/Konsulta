#!/bin/bash

# Script de deployment para producción
# Servidor: 31.220.98.150
# Puertos: Frontend 8080, Backend 8000, MySQL 3306

set -e

echo "🚀 Iniciando deployment de la aplicación Auth..."
echo "📍 Servidor: 31.220.98.150"
echo "🌐 Frontend: Puerto 8080"
echo "⚙️  Backend: Puerto 8000"
echo "🗄️  Base de datos: Puerto 3306"
echo ""

# Verificar que Docker esté ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está ejecutándose"
    exit 1
fi

echo "🔧 Deteniendo servicios existentes..."
docker compose down --remove-orphans || true

echo "🧹 Limpiando imágenes antiguas..."
docker system prune -f

echo "🏗️  Construyendo imágenes..."
docker compose build --no-cache --parallel

echo "🚀 Iniciando servicios..."
docker compose up -d

echo "⏳ Esperando que los servicios estén listos..."
sleep 30

# Verificar estado de los contenedores
echo "📊 Estado de los contenedores:"
docker compose ps

# Health checks
echo "🏥 Verificando salud de los servicios..."

# Verificar backend
echo "🔍 Verificando backend (31.220.98.150:8000)..."
for i in {1..10}; do
    if curl -f -s http://31.220.98.150:8000/health > /dev/null; then
        echo "✅ Backend está funcionando correctamente"
        break
    else
        echo "⏳ Intento $i/10: Backend no está listo, esperando..."
        sleep 10
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Backend no responde después de 10 intentos"
        echo "📋 Logs del backend:"
        docker compose logs backend --tail=50
        exit 1
    fi
done

# Verificar frontend
echo "🔍 Verificando frontend (31.220.98.150:8080)..."
for i in {1..10}; do
    if curl -f -s http://31.220.98.150:8080/ > /dev/null; then
        echo "✅ Frontend está funcionando correctamente"
        break
    else
        echo "⏳ Intento $i/10: Frontend no está listo, esperando..."
        sleep 10
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Frontend no responde después de 10 intentos"
        echo "📋 Logs del frontend:"
        docker compose logs frontend --tail=50
        exit 1
    fi
done

# Verificar base de datos
echo "🔍 Verificando base de datos..."
for i in {1..10}; do
    if docker compose exec -T db mysqladmin ping -h localhost --silent; then
        echo "✅ Base de datos está funcionando correctamente"
        break
    else
        echo "⏳ Intento $i/10: Base de datos no está lista, esperando..."
        sleep 10
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Base de datos no responde después de 10 intentos"
        echo "📋 Logs de la base de datos:"
        docker compose logs db --tail=50
        exit 1
    fi
done

echo ""
echo "🎉 ¡Deployment completado exitosamente!"
echo "📱 Aplicación disponible en: http://31.220.98.150:8080"
echo "🔧 API disponible en: http://31.220.98.150:8000"
echo "🗄️  Base de datos disponible en: 31.220.98.150:3306"
echo ""
echo "📋 Para ver logs en tiempo real:"
echo "   docker compose logs -f"
echo ""
echo "🛑 Para detener la aplicación:"
echo "   docker compose down"
echo ""