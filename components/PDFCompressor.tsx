'use client'

import { useState, useRef } from 'react'
import { compressPDF } from '@/utils/pdfManipulator'

type CompressionLevel = 'low' | 'medium' | 'high'

export default function PDFCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [compressionResult, setCompressionResult] = useState<{
    originalSize: number
    compressedSize: number
    savedPercentage: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError(null)
      setCompressionResult(null)
    } else {
      setError('Por favor, selecione um arquivo PDF válido.')
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setError(null)
      setCompressionResult(null)
    } else {
      setError('Por favor, solte um arquivo PDF válido.')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleCompress = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo PDF primeiro.')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setCompressionResult(null)

    try {
      const originalSize = file.size
      
      // Chamar API de compressão
      const formData = new FormData()
      formData.append('file', file)
      formData.append('compression_level', compressionLevel)

      setProgress(20)

      const API_URL = process.env.NEXT_PUBLIC_OCR_API_URL || 'http://localhost:5003'
      const response = await fetch(`${API_URL}/compress-pdf`, {
        method: 'POST',
        body: formData,
      })

      setProgress(60)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao comprimir PDF')
      }

      const data = await response.json()

      setProgress(80)

      // Converter base64 para blob e fazer download
      const pdfData = atob(data.pdf)
      const pdfArray = new Uint8Array(pdfData.length)
      for (let i = 0; i < pdfData.length; i++) {
        pdfArray[i] = pdfData.charCodeAt(i)
      }

      const blob = new Blob([pdfArray], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = data.filename
      link.click()
      URL.revokeObjectURL(link.href)

      setProgress(100)
      
      // Mostrar estatísticas reais da API
      setCompressionResult({
        originalSize: data.original_size,
        compressedSize: data.compressed_size,
        savedPercentage: data.reduction_percentage
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao comprimir o PDF')
      console.error('Erro na compressão:', err)
    } finally {
      setIsProcessing(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
        Comprimir PDF
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
          <span className="text-primary-600 font-semibold">Clique para fazer upload</span>
          <span className="hidden sm:inline"> ou arraste o arquivo aqui</span>
        </p>
        <p className="text-xs sm:text-sm text-gray-500">Apenas arquivos PDF</p>
        {file && (
          <div className="mt-4 p-2 sm:p-3 bg-primary-100 rounded-lg inline-block max-w-full">
            <p className="text-primary-800 font-medium text-xs sm:text-sm break-words">
              {file.name}
            </p>
            <p className="text-primary-700 text-xs mt-1">
              {formatFileSize(file.size)}
            </p>
          </div>
        )}
      </div>

      {/* Compression Level */}
      {file && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
            Escolha o nível de compressão:
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <button
              onClick={() => setCompressionLevel('low')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                compressionLevel === 'low'
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-base sm:text-lg text-gray-800">
                        Baixa Compressão
                      </div>
                      <div className="text-xs text-primary-600 font-medium">
                        Alta Qualidade • Menor Compressão
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Mantém a qualidade máxima do documento original. Ideal para apresentações, 
                    documentos profissionais e arquivos onde a qualidade visual é prioridade.
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg sm:text-xl font-bold text-primary-600">~15%</div>
                  <div className="text-xs text-gray-500">redução</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setCompressionLevel('medium')}
              className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                compressionLevel === 'medium'
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                RECOMENDADO
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-base sm:text-lg text-gray-800">
                        Compressão Recomendada
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Boa Qualidade • Boa Compressão
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Equilíbrio perfeito entre qualidade e tamanho. Excelente para uso geral, 
                    envio por email e armazenamento. A qualidade permanece muito boa.
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg sm:text-xl font-bold text-green-600">~40%</div>
                  <div className="text-xs text-gray-500">redução</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setCompressionLevel('high')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                compressionLevel === 'high'
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-base sm:text-lg text-gray-800">
                        Extrema Compressão
                      </div>
                      <div className="text-xs text-orange-600 font-medium">
                        Menos Qualidade • Alta Compressão
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Máxima redução de tamanho. Use quando o tamanho do arquivo for mais importante 
                    que a qualidade. Pode haver perda visível de qualidade em imagens.
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg sm:text-xl font-bold text-orange-600">~60%</div>
                  <div className="text-xs text-gray-500">redução</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Compression Result */}
      {compressionResult && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            PDF Comprimido com Sucesso!
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Tamanho Original:</p>
              <p className="font-semibold text-gray-800">{formatFileSize(compressionResult.originalSize)}</p>
            </div>
            <div>
              <p className="text-gray-600">Tamanho Comprimido:</p>
              <p className="font-semibold text-green-700">{formatFileSize(compressionResult.compressedSize)}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-center">
              <span className="text-lg font-bold text-green-700">{compressionResult.savedPercentage}%</span>
              <span className="text-gray-600 ml-2">de redução no tamanho do arquivo</span>
            </p>
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
            <span className="text-sm font-medium text-gray-700">Comprimindo PDF...</span>
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

      {/* Compress Button */}
      <button
        onClick={handleCompress}
        disabled={!file || isProcessing}
        className={`w-full py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base text-white transition-all ${
          !file || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isProcessing ? 'Comprimindo...' : 'Comprimir PDF'}
      </button>
    </div>
  )
}

