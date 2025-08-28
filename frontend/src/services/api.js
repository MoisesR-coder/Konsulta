import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Servicio de archivos
export const fileService = {
  // Subir y procesar archivo
  uploadAndProcess: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload-process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Descargar archivo procesado
  downloadFile: async (processingId) => {
    const response = await api.get(`/download/${processingId}`, {
      responseType: 'blob',
    });
    
    return response;
  },

  // Obtener historial de procesamiento
  getHistory: async () => {
    const response = await api.get('/history');
    return response;
  },

  // Obtener historial paginado
  getPaginatedHistory: async (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`/history?${params.toString()}`);
    return response;
  },

  // Procesar archivo (alias para uploadAndProcess)
  processFile: async (file) => {
    return fileService.uploadAndProcess(file);
  },
};

// Función para manejar errores de API
export const handleApiError = (error) => {
  if (error.response) {
    // Error de respuesta del servidor
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 400) {
      return data.detail || 'Solicitud inválida';
    } else if (status === 404) {
      return 'Recurso no encontrado';
    } else if (status === 500) {
      return 'Error interno del servidor';
    } else {
      return data.detail || `Error del servidor (${status})`;
    }
  } else if (error.request) {
    // Error de red
    return 'Error de conexión. Verifica tu conexión a internet.';
  } else {
    // Error de configuración
    return error.message || 'Error desconocido';
  }
};

export default api;