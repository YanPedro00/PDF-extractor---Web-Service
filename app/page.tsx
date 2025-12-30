'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdsterraAd from '@/components/AdsterraAd'

export default function Home() {
  const [contentReady, setContentReady] = useState(false)
  const [adKey, setAdKey] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentReady(true)
      // Force ad reload on mount
      setAdKey(Date.now())
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const tools = [
    {
      href: '/converter',
      icon: (
        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'PDF para Excel',
      description: 'Converta PDFs com texto selecionável para Excel de forma rápida.'
    },
    {
      href: '/ocr',
      icon: (
        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: 'PDF para Excel (OCR)',
      description: 'Converta PDFs escaneados para Excel usando OCR avançado.'
    },
    {
      href: '/juntar',
      icon: (
        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: 'Juntar PDFs',
      description: 'Una múltiplos arquivos PDF em um único documento.'
    },
    {
      href: '/dividir',
      icon: (
        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: 'Dividir PDF',
      description: 'Extraia páginas específicas ou todas as páginas separadamente.'
    },
    {
      href: '/comprimir',
      icon: (
        <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: 'Comprimir PDF',
      description: 'Reduza o tamanho do PDF mantendo a qualidade.'
    }
  ]

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
          
          {/* Descrição adicional */}
          <div className="max-w-3xl mx-auto px-2 mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Transforme seus documentos PDF de forma rápida e eficiente. Nossa plataforma oferece 
              ferramentas profissionais para converter PDFs para Excel, juntar múltiplos arquivos 
              ou dividir documentos. Suportamos PDFs com texto selecionável e documentos escaneados 
              através de tecnologia OCR avançada.
            </p>
          </div>
          
          {/* AD1 - Native Banner (Header) */}
          {contentReady && (
            <div className="mt-6 sm:mt-8 mb-6 sm:mb-8 flex justify-center px-2">
              <AdsterraAd 
                key={`ad1-${adKey}`}
                zoneId={process.env.NEXT_PUBLIC_ADSTERRA_ZONE_1 || ''}
                format="native"
                className="min-h-[100px] w-full max-w-[728px]"
                shouldRender={contentReady}
              />
            </div>
          )}
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Instruções */}
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

          {/* Grid de Ferramentas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border-2 border-transparent hover:border-primary-500"
              >
                <div className="text-center">
                  <div className="mb-3 sm:mb-4">
                    {tool.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Informações adicionais */}
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
        </div>

        {/* AD2 - iframe Banner (Footer) */}
        {contentReady && (
          <div className="mt-12 sm:mt-16 mb-6 sm:mb-8 flex justify-center px-2">
            <AdsterraAd 
              key={`ad2-${adKey}`}
              zoneId={process.env.NEXT_PUBLIC_ADSTERRA_ZONE_2 || ''}
              format="iframe"
              className="min-h-[90px] w-full max-w-[728px]"
              shouldRender={contentReady}
            />
          </div>
        )}
      </div>
    </main>
  )
}
