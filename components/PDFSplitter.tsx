'use client'

import { useState, useRef, useEffect } from 'react'
import { splitPDFAllPages, splitPDFSelectedPages, getPDFPageCount } from '@/utils/pdfManipulator'

type SplitMode = 'all' | 'selected'

export default function PDFSplitter() {
  const [file, setFile] = useState<File | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [splitMode, setSplitMode] = useState<SplitMode>('all')
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loadingPages, setLoadingPages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (file) {
      loadPageCount()
    }
  }, [file])

  const loadPageCount = async () => {
    if (!file) return
    
    setLoadingPages(true)
    try {
      const count = await getPDFPageCount(file)
      setNumPages(count)
    } catch (err) {
      setError('Erro ao ler o PDF. Verifique se o arquivo está correto.')
      console.error('Erro ao contar páginas:', err)
    } finally {
      setLoadingPages(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError(null)
      setSelectedPages([])
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
      setSelectedPages([])
    } else {
      setError('Por favor, solte um arquivo PDF válido.')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const togglePage = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum)
        ? prev.filter((p) => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b)
    )
  }

  const handleSelectAll = () => {
    if (selectedPages.length === numPages) {
      setSelectedPages([])
    } else {
      setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1))
    }
  }

  const handleSplit = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo PDF primeiro.')
      return
    }

    if (splitMode === 'selected' && selectedPages.length === 0) {
      setError('Selecione pelo menos uma página para extrair.')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      if (splitMode === 'all') {
        await splitPDFAllPages(file, (progressValue) => {
          setProgress(progressValue)
        })
      } else {
        await splitPDFSelectedPages(file, selectedPages, (progressValue) => {
          setProgress(progressValue)
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao dividir o PDF')
      console.error('Erro na divisão:', err)
    } finally {
      setIsProcessing(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
        Dividir PDF
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
              📄 {file.name}
            </p>
            <p className="text-primary-700 text-xs mt-1">
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            {loadingPages ? (
              <p className="text-xs sm:text-sm text-primary-600 mt-1">Carregando páginas...</p>
            ) : numPages > 0 ? (
              <p className="text-xs sm:text-sm text-primary-600 mt-1">{numPages} página{numPages > 1 ? 's' : ''}</p>
            ) : null}
          </div>
        )}
      </div>

      {/* Modo de divisão */}
      {file && numPages > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Modo de divisão:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => setSplitMode('all')}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                splitMode === 'all'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Extrair todas as páginas</div>
              <div className="text-xs sm:text-sm text-gray-600">
                Cada página será salva como um arquivo PDF separado
              </div>
            </button>
            <button
              onClick={() => setSplitMode('selected')}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                splitMode === 'selected'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="font-semibold text-sm sm:text-base text-gray-800 mb-1">Selecionar páginas</div>
              <div className="text-xs sm:text-sm text-gray-600">
                Escolha quais páginas você quer extrair
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Seleção de páginas */}
      {file && numPages > 0 && splitMode === 'selected' && (
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-2 sm:mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700">
              Selecionar páginas ({selectedPages.length} selecionada{selectedPages.length !== 1 ? 's' : ''}):
            </h3>
            <button
              onClick={handleSelectAll}
              className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium self-start sm:self-auto"
            >
              {selectedPages.length === numPages ? 'Desmarcar todas' : 'Selecionar todas'}
            </button>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 sm:gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => togglePage(pageNum)}
                className={`p-1.5 sm:p-2 rounded text-xs sm:text-sm font-medium transition-all ${
                  selectedPages.includes(pageNum)
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-primary-100'
                }`}
              >
                {pageNum}
              </button>
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

      {/* Split Button */}
      <button
        onClick={handleSplit}
        disabled={!file || isProcessing || (splitMode === 'selected' && selectedPages.length === 0)}
        className={`w-full py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base text-white transition-all ${
          !file || isProcessing || (splitMode === 'selected' && selectedPages.length === 0)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isProcessing
          ? 'Processando...'
          : splitMode === 'all'
          ? `Extrair todas as ${numPages} páginas`
          : `Extrair ${selectedPages.length} página${selectedPages.length > 1 ? 's' : ''}`}
      </button>
    </div>
  )
}

