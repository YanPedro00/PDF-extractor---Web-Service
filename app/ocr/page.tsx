'use client'

import PDFUploader from '@/components/PDFUploader'
import AdsterraAd from '@/components/AdsterraAd'
import { useState, useEffect } from 'react'

export default function OCRPage() {
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
            className="mb-4 sm:mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 text-sm sm:text-base inline-flex"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </a>

          {/* Descrição da ferramenta */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Converter PDF Escaneado para Excel com OCR
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
              Ferramenta avançada com tecnologia OCR (Reconhecimento Óptico de Caracteres) que converte documentos escaneados 
              e imagens em PDFs para planilhas Excel editáveis. Perfeita para digitalizar documentos físicos.
            </p>

            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Quando usar esta ferramenta:
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Documentos Escaneados</strong> - PDFs criados a partir de scanner ou fotos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Faturas e Notas Fiscais</strong> fotografadas ou escaneadas com tabelas de produtos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Recibos e Comprovantes</strong> que precisam ser digitalizados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Documentos Antigos</strong> que não possuem versão digital</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Imagens com Tabelas</strong> que você precisa converter em dados editáveis</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Como funciona:
              </h2>
              <ol className="space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                  <div>
                    <strong>Upload do PDF escaneado:</strong> Envie seu documento escaneado ou PDF que contenha imagens.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                  <div>
                    <strong>Processamento OCR avançado:</strong> Nossa tecnologia de ponta analisa as imagens, detecta tabelas e reconhece o texto com alta precisão.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                  <div>
                    <strong>Extração inteligente:</strong> O sistema identifica automaticamente a estrutura de tabelas, linhas e colunas.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</span>
                  <div>
                    <strong>Download do Excel:</strong> Receba um arquivo Excel organizado com cada página do PDF em uma aba separada.
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Dicas para melhores resultados:
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Qualidade da imagem:</strong> Use documentos escaneados em alta resolução (mínimo 300 DPI) para melhor precisão.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Iluminação:</strong> Garanta que o documento esteja bem iluminado e sem sombras ao escanear.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Alinhamento:</strong> Documentos alinhados (não tortos) produzem resultados mais precisos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Tempo de processamento:</strong> OCR pode levar alguns minutos, especialmente para arquivos grandes. Por favor, aguarde pacientemente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Idioma:</strong> Nossa ferramenta está otimizada para reconhecer texto em português, mas também funciona com outros idiomas.</span>
                </li>
              </ul>
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
          
          <PDFUploader mode="ocr" />

          {/* Seção de perguntas frequentes */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mt-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">O que é OCR?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  OCR (Optical Character Recognition) é uma tecnologia que converte imagens de texto em texto editável. 
                  É como &quot;ensinar&quot; o computador a &quot;ler&quot; documentos escaneados ou fotografados.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Qual a taxa de precisão do OCR?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Nossa ferramenta utiliza tecnologia de ponta com precisão superior a 95% para documentos de boa qualidade. 
                  A precisão pode variar dependendo da qualidade do documento original.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Por que o processamento demora mais?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  OCR é um processo computacionalmente intensivo que analisa pixel por pixel para reconhecer caracteres. 
                  Isso leva mais tempo que a extração simples de texto, mas garante resultados precisos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Posso converter documentos manuscritos?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  A ferramenta funciona melhor com texto impresso. Texto manuscrito pode ter resultados variados dependendo da legibilidade da caligrafia.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">O que fazer se os resultados não estiverem corretos?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Tente escanear o documento novamente com melhor qualidade, garantindo boa iluminação e resolução. 
                  Se o PDF tem texto selecionável, use nossa <a href="/converter" className="text-primary-600 hover:underline">ferramenta de conversão direta</a>.
                </p>
              </div>
            </div>
          </div>

          {/* AD2 - Banner no rodapé */}
          {contentReady && (
            <div className="mt-12 mb-8 flex justify-center">
              <AdsterraAd
                key={`ad2-${adKey}`}
                zoneId={process.env.NEXT_PUBLIC_ADSTERRA_ZONE_2 || ''}
                format="banner"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
