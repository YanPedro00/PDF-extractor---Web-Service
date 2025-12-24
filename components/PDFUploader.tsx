'use client'

import { useState, useRef } from 'react'
import { convertPDFToExcel, convertPDFWithOCR } from '@/utils/pdfConverter'

interface PDFUploaderProps {
  mode: 'text' | 'ocr'
}

export default function PDFUploader({ mode }: PDFUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError(null)
    } else {
      setError('Por favor, selecione um arquivo PDF válido.')
    }
  }

  const handleConvert = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo PDF primeiro.')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      if (mode === 'text') {
        setProgress(30)
        await convertPDFToExcel(file, (progressValue) => {
          setProgress(30 + progressValue * 0.7)
        })
      } else {
        setProgress(10)
        await convertPDFWithOCR(file, (progressValue) => {
          setProgress(10 + progressValue * 0.9)
        })
      }
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar o PDF')
      console.error('Erro na conversão:', err)
    } finally {
      setIsProcessing(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setError(null)
    } else {
      setError('Por favor, solte um arquivo PDF válido.')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
        {mode === 'text' ? 'PDF com Texto Selecionável' : 'PDF Escaneado (OCR)'}
      </h2>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-primary-300 rounded-lg p-6 sm:p-8 md:p-12 text-center hover:border-primary-500 transition-colors cursor-pointer bg-primary-50"
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
              📄 {file.name}
            </p>
            <p className="text-primary-700 text-xs mt-1">
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Progress Bar */}
      {isProcessing && (
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Processando...</span>
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

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        disabled={!file || isProcessing}
        className={`mt-4 sm:mt-6 w-full py-3 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base text-white transition-all ${
          !file || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isProcessing ? 'Processando...' : 'Converter para Excel'}
      </button>
    </div>
  )
}

