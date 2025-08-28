# Sistema de Autenticación

## Descripción
Este proyecto es un sistema de autenticación con un frontend en React y un backend en FastAPI. Incluye procesamiento de archivos Excel para plantillas de pensiones, integración con MySQL y despliegue mediante Docker.

## Estructura del Proyecto
- **backend/**: Contiene el servidor FastAPI para la lógica de negocio y API.
- **frontend/**: Aplicación React para la interfaz de usuario.
- **data/**: Datos y scripts relacionados con la base de datos.
- **docker-compose.yml**: Configuración para contenedores Docker.
- **deploy.sh** y **deploy.ps1**: Scripts de despliegue.

## Requisitos
- Python 3.8+
- Node.js 18+
- Docker (para despliegue en contenedores)
- MySQL

## Instalación

### Backend
1. Navega a `backend/`.
2. Instala dependencias: `pip install -r requirements.txt`.
3. Configura `.env` con variables de base de datos y CORS.
4. Ejecuta: `uvicorn main:app --reload --host 0.0.0.0 --port 8000`.

### Frontend
1. Navega a `frontend/`.
2. Instala dependencias: `npm install`.
3. Configura `.env` con `VITE_API_BASE_URL`.
4. Ejecuta: `npm run dev`.

## Despliegue con Docker
- Ejecuta `docker-compose up -d` para iniciar los servicios.

## Uso
- Accede al frontend en `http://localhost:5173` (desarrollo).
- La API está disponible en `http://localhost:8000`.

## Proceso de Despliegue

### Requisitos para Despliegue
- Servidor con Docker instalado.
- Acceso SSH al servidor de producción (ej. IP 31.220.98.150).
- Configuración de variables de entorno para producción.

### Pasos para Configuración
1. **Actualizar Variables de Entorno:**
   - En `.env` del frontend, configura `VITE_API_BASE_URL` a la URL de producción (ej. `http://31.220.98.150:8000/api`).
   - En `.env` del backend, actualiza `DATABASE_URL`, `DB_HOST`, `DB_PORT`, etc., para conectar a la base de datos de producción.
   - Configura `CORS_ORIGINS` en el backend para incluir orígenes de producción (ej. `http://31.220.98.150:80`).

2. **Modificaciones en APIs y Endpoints:**
   - **Endpoint `/upload-process` (en `backend/main.py`):** Actualiza la lógica de procesamiento si es necesario para entornos de producción, como paths de archivos temporales. Cambia el manejo de CORS en `app.add_middleware` para orígenes de producción.
   - **Endpoint `/` (root):** No requiere cambios, pero verifica que retorne mensajes adecuados en producción.
   - Si hay endpoints de autenticación (removidos actualmente), actualiza para usar JWT en producción.
   - En `nginx.conf` del frontend, actualiza el proxy para `/api/` a `http://backend:8000/` y ajusta `Content-Security-Policy` para URLs de producción.

3. **Construcción y Despliegue:**
   - Construye imágenes Docker: `docker-compose build`.
   - Usa scripts de despliegue: Ejecuta `deploy.sh` (Linux) o `deploy.ps1` (Windows) para subir cambios al servidor.
   - En el servidor, ejecuta `docker-compose up -d` para iniciar contenedores.
   - Verifica logs con `docker logs <container>` y corrige errores (ej. puertos, volúmenes).

### Otros Requisitos
- Asegura que los puertos 80, 8000 estén abiertos en el firewall.
- Configura volúmenes persistentes para la base de datos.
- Monitorea con herramientas como Docker Stats o logs.

