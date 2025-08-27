import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios de procesamiento de archivos
export const fileService = {
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

  downloadFile: async (processingId) => {
    const response = await api.get(`/download/${processingId}`, {
      responseType: 'blob',
    });
    return response;
  },

  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },

  getPaginatedHistory: async (page = 1, size = 10, search = '', sortBy = 'created_at', sortOrder = 'desc') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort_by: sortBy,
      sort_order: sortOrder
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`/history/paginated?${params}`);
    return response.data;
  },
};

// Servicio de salud
export const healthService = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;