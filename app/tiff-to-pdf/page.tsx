'use client'

import TiffUploader from '@/components/TiffUploader'
import AdsterraAd from '@/components/AdsterraAd'
import { useState, useEffect } from 'react'

export default function TiffToPdfPage() {
  const [contentReady, setContentReady] = useState(false)
  const [adKey, setAdKey] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => { setContentReady(true); setAdKey(Date.now()) }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4 sm:mb-6 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </a>

          {/* Descrição da ferramenta */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Converter TIFF para PDF
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
              Converta seus arquivos TIFF (single ou multi-página) em documentos PDF de alta qualidade. 
              Ideal para digitalizar documentos escaneados, preservar imagens técnicas e criar arquivos portáteis.
            </p>

            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Quando usar esta ferramenta:
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Arquivos escaneados:</strong> TIFF é o formato padrão para scanners profissionais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Documentos multi-página:</strong> Converta todas as páginas do TIFF em um único PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Compatibilidade:</strong> PDF é mais amplamente suportado que TIFF</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Compartilhamento:</strong> PDF mantém formatação e é mais fácil de compartilhar</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">💡 Dica:</h3>
              <p className="text-sm text-yellow-800">
                Nossa ferramenta mantém a qualidade original da imagem e suporta TIFF colorido, 
                escala de cinza e preto e branco. O PDF gerado é otimizado automaticamente.
              </p>
            </div>
          </div>

          {/* AD1 - Native Banner */}
          {contentReady && (
            <div className="mb-6 flex justify-center">
              <AdsterraAd
                key={`ad-${adKey}`} 
                zoneId={process.env.NEXT_PUBLIC_ADSTERRA_ZONE_1 || ''}
                format="native"
                className="min-h-[100px] w-full max-w-[728px]"
                shouldRender={contentReady}
              />
            </div>
          )}
          
          {/* Componente de Upload */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <TiffUploader />
          </div>

          {/* Seção de perguntas frequentes */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mt-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">O que é TIFF?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  TIFF (Tagged Image File Format) é um formato de arquivo de imagem de alta qualidade, 
                  muito usado em scanners profissionais e edição de imagens. Pode conter múltiplas páginas 
                  em um único arquivo.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">A conversão preserva a qualidade?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Sim! Nossa ferramenta mantém 100% da qualidade original da imagem TIFF no PDF gerado. 
                  Não há perda de resolução ou detalhes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Suporta TIFF com múltiplas páginas?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Sim! Se seu TIFF contém várias páginas, todas serão convertidas e incluídas no PDF final 
                  como páginas separadas, mantendo a ordem original.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Qual o tamanho máximo do arquivo?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Você pode converter arquivos TIFF de até 50MB. Para arquivos maiores, recomendamos 
                  dividi-los em partes menores primeiro.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Meus arquivos estão seguros?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Sim! O processamento é feito em nosso servidor seguro e os arquivos são automaticamente 
                  excluídos após a conversão. Não armazenamos nenhum dado.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Funciona com TIFF colorido e P&B?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Sim! Nossa ferramenta suporta TIFF em RGB (colorido), escala de cinza (grayscale) e 
                  preto e branco. Todos os modos de cor são preservados no PDF.
                </p>
              </div>
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
      </div>
    </main>
  )
}

