# Multi-stage build para React + Nginx
# Etapa 1: Builder - Compilar la aplicación React
FROM node:18-alpine as builder

# Instalar dependencias necesarias
RUN apk add --no-cache git

# Crear directorio de trabajo
WORKDIR /app

# Configurar variable de entorno para build
ARG VITE_API_BASE_URL=http://31.220.98.150:81/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copiar package.json y package-lock.json
COPY package*.json ./n
# Instalar dependencias
RUN npm ci --silent

# Copiar código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Runtime - Nginx para servir archivos estáticos
FROM nginx:1.25-alpine

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar archivos compilados desde la etapa builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crear directorios necesarios y establecer permisos
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp && \
    chmod -R 755 /var/cache/nginx && \
    chmod -R 755 /usr/share/nginx/html && \
    touch /var/log/nginx/access.log && \
    touch /var/log/nginx/error.log && \
    chmod 666 /var/log/nginx/access.log && \
    chmod 666 /var/log/nginx/error.log

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://127.0.0.1:80/ || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]