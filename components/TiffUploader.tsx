'use client'

import { useState, useCallback } from 'react'

export default function TiffUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState('')
  const [tiffInfo, setTiffInfo] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_TIFF_API_URL || 'http://localhost:8001'

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = async (selectedFile: File) => {
    setError('')
    setTiffInfo(null)

    // Validar tipo de arquivo
    const validExtensions = ['.tiff', '.tif']
    const fileExtension = selectedFile.name.toLowerCase().match(/\.[^.]+$/)?.[0]
    
    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      setError('Por favor, selecione um arquivo TIFF (.tiff ou .tif)')
      return
    }

    // Validar tamanho (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('Arquivo muito grande. Tamanho máximo: 50MB')
      return
    }

    setFile(selectedFile)

    // Obter informações do arquivo
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`${API_URL}/convert/info`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const info = await response.json()
        setTiffInfo(info)
      }
    } catch (err) {
      console.error('Erro ao obter informações:', err)
    }
  }

  const handleConvert = async () => {
    if (!file) return

    setConverting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_URL}/convert?optimize=true`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name.replace(/\.(tiff?|TIF)$/i, '.pdf')
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)

        // Reset
        setFile(null)
        setTiffInfo(null)
      } else {
        const errorText = await response.text()
        setError(`Erro na conversão: ${errorText}`)
      }
    } catch (err: any) {
      setError(`Erro ao converter: ${err.message}`)
      console.error('Erro:', err)
    } finally {
      setConverting(false)
    }
  }

  return (
    <div className="w-full">
      {/* Área de Upload */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          id="tiff-input"
          accept=".tiff,.tif"
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          className="hidden"
        />

        <svg
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-primary-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
          {file ? file.name : 'Selecione ou arraste seu arquivo TIFF'}
        </h3>

        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Suporta arquivos TIFF single e multi-página
        </p>

        <label
          htmlFor="tiff-input"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-primary-700 transition-colors"
        >
          Escolher Arquivo
        </label>

        <p className="text-xs text-gray-500 mt-4">
          Formatos aceitos: .tiff, .tif • Tamanho máximo: 50MB
        </p>
      </div>

      {/* Informações do arquivo */}
      {tiffInfo && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">📋 Informações do arquivo:</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-blue-700">Páginas:</span>
              <span className="ml-2 font-medium text-blue-900">{tiffInfo.pages}</span>
            </div>
            <div>
              <span className="text-blue-700">Tamanho:</span>
              <span className="ml-2 font-medium text-blue-900">{tiffInfo.size_mb} MB</span>
            </div>
            <div>
              <span className="text-blue-700">Dimensões:</span>
              <span className="ml-2 font-medium text-blue-900">
                {tiffInfo.width} × {tiffInfo.height}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Modo:</span>
              <span className="ml-2 font-medium text-blue-900">{tiffInfo.mode}</span>
            </div>
          </div>
        </div>
      )}

      {/* Botão Converter */}
      {file && (
        <button
          onClick={handleConvert}
          disabled={converting}
          className={`w-full mt-6 py-4 rounded-lg font-semibold text-lg transition-all ${
            converting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {converting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Convertendo...
            </span>
          ) : (
            '🚀 Converter para PDF'
          )}
        </button>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}

