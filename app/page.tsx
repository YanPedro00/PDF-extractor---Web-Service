'use client'

import { useState, useEffect } from 'react'
import PDFUploader from '@/components/PDFUploader'
import PDFMerger from '@/components/PDFMerger'
import PDFSplitter from '@/components/PDFSplitter'
import GoogleAd from '@/components/GoogleAd'

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<'text' | 'ocr' | 'merge' | 'split' | null>(null)
  const [contentReady, setContentReady] = useState(false)
  const [hasSubstantialContent, setHasSubstantialContent] = useState(false)

  // Listener para mudanças vindas da navbar
  useEffect(() => {
    const handleToolChange = (event: CustomEvent) => {
      const toolId = event.detail
      if (toolId === null) {
        setSelectedMode(null)
      } else if (['text', 'ocr', 'merge', 'split'].includes(toolId)) {
        setSelectedMode(toolId as 'text' | 'ocr' | 'merge' | 'split')
      }
    }

    window.addEventListener('changeTool', handleToolChange as EventListener)
    return () => {
      window.removeEventListener('changeTool', handleToolChange as EventListener)
    }
  }, [])

  // Verificar se há conteúdo suficiente para exibir anúncios
  useEffect(() => {
    // Aguardar um pouco para garantir que o conteúdo foi renderizado
    const timer = setTimeout(() => {
      setContentReady(true)
      
      // Verificar se há conteúdo substancial na página
      // Anúncios só devem aparecer quando há conteúdo suficiente
      if (selectedMode === null) {
        // Na página inicial, temos 4 cards de ferramentas + descrições
        setHasSubstantialContent(true)
      } else {
        // Quando uma ferramenta está selecionada, há conteúdo interativo
        setHasSubstantialContent(true)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [selectedMode])

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 mt-4 sm:mt-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600 mb-3 sm:mb-4 px-2">
            PDFUtilities
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2 mb-4">
            Ferramentas completas para trabalhar com seus PDFs
          </p>
          
          {/* Descrição adicional para aumentar o valor do conteúdo */}
          <div className="max-w-3xl mx-auto px-2 mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Transforme seus documentos PDF de forma rápida e eficiente. Nossa plataforma oferece 
              ferramentas profissionais para converter PDFs para Excel, juntar múltiplos arquivos 
              ou dividir documentos. Suportamos PDFs com texto selecionável e documentos escaneados 
              através de tecnologia OCR avançada.
            </p>
          </div>
          
          {/* Google Ad - Localização 1: Abaixo do texto do header - Só renderiza se houver conteúdo suficiente */}
          {contentReady && hasSubstantialContent && (
            <div className="mt-6 sm:mt-8 mb-6 sm:mb-8 flex justify-center px-2">
              <GoogleAd 
                adSlot={process.env.NEXT_PUBLIC_GOOGLE_ADS_SLOT_1 || '6280286471'} 
                adFormat="auto"
                className="min-h-[100px] w-full max-w-[728px]"
                shouldRender={contentReady && hasSubstantialContent}
              />
            </div>
          )}
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!selectedMode ? (
            <>
              {/* Seção de instruções para adicionar mais conteúdo de valor */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Como usar nossas ferramentas
                </h2>
                <div className="space-y-3 text-sm sm:text-base text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="text-primary-600 font-bold flex-shrink-0">1.</span>
                    <p>Escolha a ferramenta que melhor atende às suas necessidades abaixo.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary-600 font-bold flex-shrink-0">2.</span>
                    <p>Faça upload do seu arquivo PDF ou arraste-o para a área indicada.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary-600 font-bold flex-shrink-0">3.</span>
                    <p>Aguarde o processamento e baixe o resultado final.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Opção 1: PDF com texto selecionável */}
              <button
                onClick={() => setSelectedMode('text')}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border-2 border-transparent hover:border-primary-500"
              >
                <div className="text-center">
                  <div className="mb-3 sm:mb-4">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary-600 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    PDF para Excel
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Converta PDFs com texto selecionável para Excel de forma rápida.
                  </p>
                </div>
              </button>

              {/* Opção 2: PDF escaneado (OCR) */}
              <button
                onClick={() => setSelectedMode('ocr')}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border-2 border-transparent hover:border-primary-500"
              >
                <div className="text-center">
                  <div className="mb-3 sm:mb-4">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary-600 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    PDF para Excel (OCR)
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Converta PDFs escaneados para Excel usando OCR avançado.
                  </p>
                </div>
              </button>

              {/* Opção 3: Juntar PDFs */}
              <button
                onClick={() => setSelectedMode('merge')}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border-2 border-transparent hover:border-primary-500"
              >
                <div className="text-center">
                  <div className="mb-3 sm:mb-4">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary-600 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    Juntar PDFs
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Una múltiplos arquivos PDF em um único documento.
                  </p>
                </div>
              </button>

              {/* Opção 4: Dividir PDF */}
              <button
                onClick={() => setSelectedMode('split')}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border-2 border-transparent hover:border-primary-500"
              >
                <div className="text-center">
                  <div className="mb-3 sm:mb-4">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary-600 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    Dividir PDF
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Extraia páginas específicas ou todas as páginas separadamente.
                  </p>
                </div>
              </button>
              </div>

              {/* Informações adicionais sobre as ferramentas */}
              <div className="bg-primary-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                  Por que escolher o PDFUtilities?
                </h3>
                <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">✓</span>
                    <span>Processamento rápido e seguro - seus arquivos nunca saem do seu navegador</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">✓</span>
                    <span>Suporte para PDFs escaneados com tecnologia OCR de última geração</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">✓</span>
                    <span>Interface intuitiva e fácil de usar, sem necessidade de instalação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">✓</span>
                    <span>100% gratuito e sem limites de uso</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div>
              <button
                onClick={() => setSelectedMode(null)}
                className="mb-4 sm:mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Voltar
              </button>
              {selectedMode === 'text' || selectedMode === 'ocr' ? (
                <PDFUploader mode={selectedMode} />
              ) : selectedMode === 'merge' ? (
                <PDFMerger />
              ) : selectedMode === 'split' ? (
                <PDFSplitter />
              ) : null}
            </div>
          )}
        </div>

        {/* Google Ad - Localização 2: Acima do footer - Só renderiza se houver conteúdo suficiente */}
        {contentReady && hasSubstantialContent && (
          <div className="mt-12 sm:mt-16 mb-6 sm:mb-8 flex justify-center px-2">
            <GoogleAd 
              adSlot={process.env.NEXT_PUBLIC_GOOGLE_ADS_SLOT_2 || '4093106837'} 
              adFormat="auto"
              className="min-h-[100px] w-full max-w-[728px]"
              shouldRender={contentReady && hasSubstantialContent}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-6 sm:mt-8 text-center text-gray-500 text-xs sm:text-sm px-2">
          <p>PDFUtilities © 2025 - Ferramentas completas para trabalhar com PDFs</p>
        </footer>
      </div>
    </main>
  )
}

