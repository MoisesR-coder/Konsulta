import React, { useState } from 'react'
import { ArrowDownTrayIcon, ClockIcon, DocumentCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ProcessingHistory = ({ history, onDownload, onRefresh }) => {
  const [downloading, setDownloading] = useState({})

  const handleDownload = async (filename, id) => {
    setDownloading(prev => ({ ...prev, [id]: true }))
    try {
      await onDownload(filename)
    } catch (error) {
      console.error('Error en descarga:', error)
    } finally {
      setDownloading(prev => ({ ...prev, [id]: false }))
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatProcessingTime = (seconds) => {
    if (seconds < 1) {
      return `${Math.round(seconds * 1000)}ms`
    }
    return `${seconds.toFixed(2)}s`
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <DocumentCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay archivos procesados
        </h3>
        <p className="text-gray-500">
          Los archivos que proceses aparecerán aquí con su historial completo.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          Historial de Procesamiento
        </h2>
        <button
          onClick={onRefresh}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Actualizar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="text-left">Archivo Original</th>
              <th className="text-left">Archivo Procesado</th>
              <th className="text-left">Registros</th>
              <th className="text-left">Tiempo</th>
              <th className="text-left">Fecha</th>
              <th className="text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td>
                  <div className="flex items-center space-x-2">
                    <DocumentCheckIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.original_filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.file_size ? `${(item.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {item.processed_filename}
                    </p>
                    <p className="text-xs text-green-600">
                      ✓ Procesado exitosamente
                    </p>
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {item.records_processed || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      registros
                    </p>
                  </div>
                </td>
                <td>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4" />
                    <span>
                      {item.processing_time ? formatProcessingTime(item.processing_time) : 'N/A'}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-600">
                    {formatDate(item.created_at)}
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => handleDownload(item.processed_filename, item.id)}
                    disabled={downloading[item.id]}
                    className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {downloading[item.id] ? (
                      <>
                        <div className="spinner"></div>
                        <span>Descargando...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <span>Descargar</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Total de archivos procesados: <strong>{history.length}</strong>
          </span>
          <span>
            Último procesamiento: {history.length > 0 ? formatDate(history[0].created_at) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProcessingHistory