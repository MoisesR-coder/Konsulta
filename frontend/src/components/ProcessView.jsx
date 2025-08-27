import { useState } from 'react';
import { fileService } from '../services/api';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Loader
} from 'lucide-react';

const ProcessView = ({ onProcessComplete, message, setMessage }) => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Por favor selecciona un archivo Excel (.xlsx o .xls)' 
        });
        e.target.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Por favor selecciona un archivo' });
      return;
    }

    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await fileService.uploadAndProcess(file);
      
      // Descargar automáticamente el archivo procesado
      try {
        const downloadResponse = await fileService.downloadFile(result.id);
        
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', result.filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        setMessage({ 
          type: 'success', 
          text: `Archivo procesado exitosamente. ${result.rows_processed} filas procesadas. Descarga iniciada automáticamente.` 
        });
      } catch (downloadError) {
        console.error('Error descargando archivo:', downloadError);
        setMessage({ 
          type: 'success', 
          text: `Archivo procesado exitosamente. ${result.rows_processed} filas procesadas. Error en descarga automática - puedes descargarlo desde la tabla de datos.` 
        });
      }
      
      setFile(null);
      document.getElementById('file-input').value = '';
      
      // Notificar al componente padre que se completó el procesamiento
      if (onProcessComplete) {
        onProcessComplete();
      }
    } catch (error) {
      console.error('Error procesando archivo:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Error al procesar el archivo' 
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Upload className="h-6 w-6 mr-3 text-blue-600" />
          Procesar Archivo Excel
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Seleccionar archivo Excel
            </label>
            <input
              id="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
            />
          </div>
          
          {file && (
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-700 font-medium">
                <strong>Archivo seleccionado:</strong> {file.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
          
          <button
            onClick={handleUpload}
            disabled={!file || processing}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center text-lg"
          >
            {processing ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Procesando archivo...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Procesar Archivo
              </>
            )}
          </button>
        </div>
        
        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium text-blue-900 mb-3">📋 Instrucciones de uso:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              El archivo debe contener columnas de <strong>nombre</strong>, <strong>CLABE</strong> y <strong>concepto</strong>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              Solo se procesan archivos Excel (.xlsx, .xls)
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              Las CLABE deben tener exactamente <strong>18 dígitos</strong>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              Los conceptos deben ser <strong>números válidos</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProcessView;