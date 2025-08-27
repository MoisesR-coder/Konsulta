# Configuración de Git y Subida al Repositorio

## Pasos para subir el proyecto a GitHub

### 1. Inicializar el repositorio Git local
```bash
git init
```

### 2. Agregar todos los archivos
```bash
git add .
```

### 3. Crear el primer commit
```bash
git commit -m "Initial commit: Sistema de procesamiento de archivos Excel"
```

### 4. Agregar el repositorio remoto
```bash
git remote add origin https://github.com/MoisesR-coder/Konsulta.git
```

### 5. Subir al repositorio
```bash
git push -u origin main
```

## Notas importantes:

1. **Crear el repositorio en GitHub primero**: Ve a https://github.com/new y crea un repositorio llamado "Konsulta"

2. **Configurar Git (si no lo has hecho antes)**:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

3. **Archivos que se subirán**:
   - Backend (FastAPI)
   - Frontend (React + Vite)
   - Archivos de configuración Docker
   - Scripts de despliegue
   - Documentación de APIs

4. **Archivos que NO se subirán** (ya están en .gitignore):
   - node_modules/
   - __pycache__/
   - .env (archivos de entorno)
   - Archivos procesados

## Estructura del proyecto que se subirá:
```
Konsulta/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── deploy.sh
├── deploy.ps1
└── README.md
```