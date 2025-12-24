'use client'

import { useState, useRef } from 'react'
import { mergePDFs } from '@/utils/pdfManipulator'

export default function PDFMerger() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const pdfFiles = selectedFiles.filter((file) => file.type === 'application/pdf')
    
    if (pdfFiles.length !== selectedFiles.length) {
      setError('Alguns arquivos não são PDFs e foram ignorados.')
    } else {
      setError(null)
    }

    setFiles((prev) => [...prev, ...pdfFiles])
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFiles = droppedFiles.filter((file) => file.type === 'application/pdf')
    
    if (pdfFiles.length !== droppedFiles.length) {
      setError('Alguns arquivos não são PDFs e foram ignorados.')
    } else {
      setError(null)
    }

    setFiles((prev) => [...prev, ...pdfFiles])
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Selecione pelo menos 2 arquivos PDF para mesclar.')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      await mergePDFs(files, (progressValue) => {
        setProgress(progressValue)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao mesclar PDFs')
      console.error('Erro na mesclagem:', err)
    } finally {
      setIsProcessing(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === files.length - 1)
    ) {
      return
    }

    const newFiles = [...files]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]]
    setFiles(newFiles)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
        Juntar PDFs
      </h2>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-primary-300 rounded-lg p-6 sm:p-8 md:p-12 text-center hover:border-primary-500 transition-colors cursor-pointer bg-primary-50 mb-4 sm:mb-6"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <svg
          className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary-400 mb-3 sm:mb-4"
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
        <p className="text-sm sm:text-base text-gray-600 mb-2">
          <span className="text-primary-600 font-semibold">Clique para adicionar PDFs</span>
          <span className="hidden sm:inline"> ou arraste os arquivos aqui</span>
        </p>
        <p className="text-xs sm:text-sm text-gray-500">Selecione múltiplos arquivos PDF</p>
      </div>

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
            Arquivos selecionados ({files.length}):
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-2"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <span className="text-primary-600 font-semibold text-sm sm:text-base flex-shrink-0">{index + 1}.</span>
                  <span className="text-gray-700 flex-1 truncate text-xs sm:text-sm">{file.name}</span>
                  <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  {index > 0 && (
                    <button
                      onClick={() => handleReorder(index, 'up')}
                      className="p-1 sm:p-1.5 text-primary-600 hover:text-primary-700 text-sm sm:text-base"
                      title="Mover para cima"
                    >
                      ↑
                    </button>
                  )}
                  {index < files.length - 1 && (
                    <button
                      onClick={() => handleReorder(index, 'down')}
                      className="p-1 sm:p-1.5 text-primary-600 hover:text-primary-700 text-sm sm:text-base"
                      title="Mover para baixo"
                    >
                      ↓
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 sm:p-1.5 text-red-600 hover:text-red-700 text-base sm:text-lg"
                    title="Remover"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Progress Bar */}
      {isProcessing && (
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Mesclando PDFs...</span>
            <span className="text-sm font-medium text-primary-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Merge Button */}
      <button
        onClick={handleMerge}
        disabled={files.length < 2 || isProcessing}
        className={`w-full py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base text-white transition-all ${
          files.length < 2 || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isProcessing ? 'Mesclando...' : `Juntar ${files.length} PDF${files.length > 1 ? 's' : ''}`}
      </button>
    </div>
  )
}

