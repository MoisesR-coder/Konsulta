import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { fileService, handleApiError } from '../services/api'
import toast from 'react-hot-toast'
import FileUpload from '../components/FileUpload'
import ProcessingHistory from '../components/ProcessingHistory'
import { ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [processing, setProcessing] = useState(false)
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('upload')
  const [refreshHistory, setRefreshHistory] = useState(0)

  useEffect(() => {
    loadHistory()
  }, [refreshHistory])

  const loadHistory = async () => {
    try {
      const response = await fileService.getHistory()
      setHistory(response.data)
    } catch (error) {
      console.error('Error cargando historial:', error)
      toast.error('Error al cargar el historial')
    }
  }

  const handleFileProcess = async (file) => {
    setProcessing(true)
    const toastId = toast.loading('Procesando archivo...')
    
    try {
      const response = await fileService.processFile(file)
      const { filename, message, processing_time, records_processed } = response.data
      
      toast.success(
        `Archivo procesado exitosamente\n${records_processed} registros procesados en ${processing_time}s`,
        { id: toastId, duration: 5000 }
      )
      
      // Descargar archivo automáticamente
      await handleDownload(filename)
      
      // Actualizar historial
      setRefreshHistory(prev => prev + 1)
      
    } catch (error) {
      console.error('Error procesando archivo:', error)
      const errorMessage = handleApiError(error)
      toast.error(errorMessage, { id: toastId })
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = async (filename) => {
    try {
      const response = await fileService.downloadFile(filename)
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success('Archivo descargado exitosamente')
    } catch (error) {
      console.error('Error descargando archivo:', error)
      const errorMessage = handleApiError(error)
      toast.error(errorMessage)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada exitosamente')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Procesador de Plantillas Excel
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <UserIcon className="h-4 w-4 mr-1" />
                {user?.username}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('upload')}
              className={`${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Procesar Archivo
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Historial ({history.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="fade-in">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Subir y Procesar Archivo Excel
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Sube tu archivo Excel (ANEXO A4) para procesarlo automáticamente. 
                  El sistema normalizará las columnas, limpiará los datos y generará un archivo formateado.
                </p>
                
                <FileUpload 
                  onFileProcess={handleFileProcess}
                  processing={processing}
                />
              </div>
              
              {/* Instrucciones */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Instrucciones:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• El archivo debe contener las columnas: Nombre, Clabe, Monto, Concepto</li>
                  <li>• Se procesarán automáticamente los datos y se limpiarán valores inválidos</li>
                  <li>• El archivo procesado se descargará automáticamente</li>
                  <li>• Formatos soportados: .xlsx, .xls</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <ProcessingHistory 
              history={history}
              onDownload={handleDownload}
              onRefresh={() => setRefreshHistory(prev => prev + 1)}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard