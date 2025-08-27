# Guía de Deployment - Aplicación Auth

## 🚀 Configuración de Producción

**Servidor:** 31.220.98.150  
**Puertos:**
- Frontend: 8080
- Backend: 8000  
- Base de datos MySQL: 3308

## 📋 Prerrequisitos

1. **Docker y Docker Compose** instalados en el servidor
2. **Puertos abiertos** en el firewall:
   - 8080 (Frontend)
   - 8000 (Backend)
   - 3308 (MySQL)

## 🛠️ Instrucciones de Deployment

### 1. Transferir archivos al servidor

```bash
# Copiar todos los archivos del proyecto al servidor
scp -r . usuario@31.220.98.150:/var/www/docker/auth/
```

### 2. Ejecutar deployment

**En Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**En Windows (PowerShell):**
```powershell
.\deploy.ps1
```

### 3. Verificar deployment

Después del deployment exitoso, la aplicación estará disponible en:

- **Frontend:** http://31.220.98.150:8080
- **API Backend:** http://31.220.98.150:8000
- **Health Check Backend:** http://31.220.98.150:8000/health
- **Health Check Frontend:** http://31.220.98.150:8080/health

## 🔧 Comandos Útiles

### Ver logs en tiempo real
```bash
docker compose logs -f
```

### Ver logs de un servicio específico
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Reiniciar servicios
```bash
docker compose restart
```

### Detener aplicación
```bash
docker compose down
```

### Reconstruir imágenes
```bash
docker compose build --no-cache
docker compose up -d
```

## 🗄️ Base de Datos

**Configuración MySQL:**
- Host: localhost (desde el servidor)
- Puerto: 3308
- Base de datos: auth_db
- Usuario: root
- Contraseña: rootpassword

**Conexión desde aplicaciones externas:**
```
Host: 31.220.98.150
Puerto: 3308
Base de datos: auth_db
Usuario: auth_user
Contraseña: auth_password
```

## 🔒 Seguridad

### Variables de entorno importantes a cambiar en producción:

1. **JWT Secret Key** en `.env`:
   ```
   SECRET_KEY=your-super-secret-jwt-key-change-in-production
   ```

2. **Contraseñas de MySQL** en `.env`:
   ```
   MYSQL_ROOT_PASSWORD=rootpassword
   MYSQL_PASSWORD=auth_password
   ```

### Recomendaciones de seguridad:

- Cambiar todas las contraseñas por defecto
- Usar certificados SSL/TLS (HTTPS)
- Configurar firewall para limitar acceso
- Realizar backups regulares de la base de datos

## 🚨 Troubleshooting

### Si el deployment falla:

1. **Verificar que Docker esté ejecutándose:**
   ```bash
   docker info
   ```

2. **Verificar puertos disponibles:**
   ```bash
   netstat -tulpn | grep :8080
   netstat -tulpn | grep :8000
   ```

3. **Ver logs detallados:**
   ```bash
   docker compose logs --tail=100
   ```

4. **Reiniciar Docker (si es necesario):**
   ```bash
   sudo systemctl restart docker
   ```

### Errores comunes:

- **Puerto en uso:** Cambiar puertos en `docker-compose.yml`
- **Permisos:** Ejecutar con `sudo` si es necesario
- **Memoria insuficiente:** Verificar recursos del servidor
- **Red:** Verificar conectividad y DNS

## 📊 Monitoreo

### Health Checks automáticos:

- Los servicios incluyen health checks automáticos
- Docker reiniciará automáticamente servicios que fallen
- Logs disponibles para diagnóstico

### Comandos de monitoreo:

```bash
# Estado de contenedores
docker compose ps

# Uso de recursos
docker stats

# Información del sistema
docker system df
```

---

**¡Deployment completado! 🎉**

La aplicación está lista para usar en producción con todas las configuraciones optimizadas para el servidor 31.220.98.150.