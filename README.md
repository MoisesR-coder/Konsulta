# Konsulta - Sistema de Procesamiento de Archivos Excel

## Descripción

Konsulta es un sistema web completo para el procesamiento automatizado de archivos Excel de dispersión de pagos. Permite a los usuarios cargar archivos Excel, procesarlos automáticamente y descargar los resultados con formato específico para pagos de pensiones.

## Características Principales

- 🔐 **Autenticación de usuarios** con JWT
- 📊 **Procesamiento automático** de archivos Excel
- 📁 **Gestión de archivos** con historial de procesamiento
- 🔄 **API RESTful** completa
- 🐳 **Containerización** con Docker
- 🚀 **Despliegue en producción** configurado
- 📱 **Interfaz web moderna** con React

## Tecnologías Utilizadas

### Backend
- **FastAPI** - Framework web moderno y rápido
- **SQLite/MySQL** - Base de datos
- **Pandas** - Procesamiento de datos
- **OpenPyXL** - Manipulación de archivos Excel
- **JWT** - Autenticación
- **Uvicorn** - Servidor ASGI

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP

### DevOps
- **Docker & Docker Compose** - Containerización
- **Nginx** - Servidor web (producción)
- **GitHub Actions** - CI/CD (configuración disponible)

## Estructura del Proyecto

```
Konsulta/
├── backend/                 # API Backend (FastAPI)
│   ├── main.py             # Aplicación principal
│   ├── database.py         # Configuración de base de datos
│   ├── requirements.txt    # Dependencias Python
│   └── Dockerfile          # Imagen Docker del backend
├── frontend/               # Aplicación Frontend (React)
│   ├── src/               # Código fuente
│   ├── package.json       # Dependencias Node.js
│   ├── vite.config.js     # Configuración de Vite
│   └── Dockerfile         # Imagen Docker del frontend
├── docker-compose.yml      # Desarrollo local
├── docker-compose.prod.yml # Producción
├── deploy.sh              # Script de despliegue (Linux)
├── deploy.ps1             # Script de despliegue (Windows)
└── README.md              # Este archivo
```

## Instalación y Configuración

### Prerrequisitos

- **Docker** y **Docker Compose**
- **Node.js** 18+ (para desarrollo local)
- **Python** 3.8+ (para desarrollo local)

### Opción 1: Usando Docker (Recomendado)

1. **Clonar el repositorio**:
```bash
git clone https://github.com/MoisesR-coder/Konsulta.git
cd Konsulta
```

2. **Ejecutar con Docker Compose**:
```bash
# Desarrollo
docker-compose up -d

# Producción
docker-compose -f docker-compose.prod.yml up -d
```

3. **Acceder a la aplicación**:
   - Frontend: http://localhost:3000 (desarrollo) / http://localhost:8080 (producción)
   - Backend API: http://localhost:8000
   - Documentación API: http://localhost:8000/docs

### Opción 2: Desarrollo Local

1. **Backend**:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

2. **Frontend**:
```bash
cd frontend
npm install
npm run dev
```

## Uso del Sistema

### 1. Registro e Inicio de Sesión
- Crear una cuenta nueva o iniciar sesión
- El sistema utiliza autenticación JWT

### 2. Procesamiento de Archivos
- Subir archivo Excel con el formato requerido
- El sistema procesará automáticamente el archivo
- Descargar el archivo procesado

### 3. Historial
- Ver todos los archivos procesados
- Descargar archivos anteriores
- Filtrar por fechas

## API Endpoints

### Autenticación
- `POST /register` - Registro de usuario
- `POST /login` - Inicio de sesión
- `GET /verify-token` - Verificar token

### Procesamiento
- `POST /upload` - Subir y procesar archivo
- `GET /download/{processing_id}` - Descargar archivo procesado
- `GET /history` - Obtener historial de procesamiento
- `GET /health` - Estado del servicio

### Documentación Completa
Visita `/docs` en tu instancia para ver la documentación interactiva de Swagger.

## Formato de Archivo Excel

El archivo Excel debe contener las siguientes columnas:
- **Nombre** - Nombre del beneficiario
- **Clabe** - CLABE bancaria (18 dígitos)
- **Monto** - Cantidad a dispersar
- **Concepto** - Concepto del pago (opcional)

## Despliegue en Producción

### Usando el Script de Despliegue

**Linux/macOS**:
```bash
./deploy.sh
```

**Windows**:
```powershell
.\deploy.ps1
```

### Configuración Manual

1. **Variables de entorno** (crear `.env.production`):
```env
DATABASE_URL=mysql://user:password@localhost:3306/konsulta
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
ENVIRONMENT=production
```

2. **Ejecutar en producción**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Testing

### Pruebas de API
Se incluyen colecciones de Postman y ejemplos de cURL:
- `API_Collection.postman_collection.json`
- `API_Testing_Examples.md`

### Ejecutar Pruebas
```bash
# Backend
cd backend
python -m pytest

# Frontend
cd frontend
npm test
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

## Changelog

### v1.0.0
- ✅ Sistema de autenticación completo
- ✅ Procesamiento de archivos Excel
- ✅ API RESTful
- ✅ Interfaz web moderna
- ✅ Containerización con Docker
- ✅ Scripts de despliegue
- ✅ Documentación completa

---

**Desarrollado con ❤️ para automatizar el procesamiento de dispersiones de pago**