import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline'

const FileUpload = ({ onFileProcess, processing }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setDragActive(false)
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors.some(error => error.code === 'file-too-large')) {
        toast.error('El archivo es demasiado grande. Máximo 10MB.')
      } else if (rejection.errors.some(error => error.code === 'file-invalid-type')) {
        toast.error('Tipo de archivo no válido. Solo se permiten archivos Excel (.xlsx, .xls).')
      } else {
        toast.error('Error al cargar el archivo.')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
      toast.success(`Archivo "${file.name}" seleccionado correctamente`)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: processing,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  const handleProcess = () => {
    if (!selectedFile) {
      toast.error('Por favor, selecciona un archivo primero')
      return
    }
    onFileProcess(selectedFile)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    toast.success('Archivo removido')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`dropzone ${
          isDragActive || dragActive ? 'active' : ''
        } ${
          processing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-8">
          <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg text-blue-600 font-medium">
              Suelta el archivo aquí...
            </p>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-2">
                Arrastra y suelta tu archivo Excel aquí
              </p>
              <p className="text-sm text-gray-500 mb-4">
                o haz clic para seleccionar un archivo
              </p>
              <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Seleccionar Archivo
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected File */}
      {selectedFile && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DocumentIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Excel'}
                </p>
              </div>
            </div>
            {!processing && (
              <button
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Process Button */}
      {selectedFile && (
        <div className="flex justify-center slide-up">
          <button
            onClick={handleProcess}
            disabled={processing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {processing ? (
              <>
                <div className="spinner"></div>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="h-5 w-5" />
                <span>Procesar Archivo</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* File Requirements */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Tamaño máximo: 10MB</p>
        <p>• Formatos soportados: .xlsx, .xls</p>
        <p>• El archivo debe contener las columnas requeridas</p>
      </div>
    </div>
  )
}

export default FileUpload