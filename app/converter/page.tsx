'use client'

import PDFUploader from '@/components/PDFUploader'
import AdsterraAd from '@/components/AdsterraAd'
import { useState, useEffect } from 'react'

export default function ConverterPage() {
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
              Converter PDF para Excel - Texto Selecionável
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
              Esta ferramenta permite converter PDFs que contêm texto selecionável diretamente para planilhas Excel. 
              Perfeito para documentos digitais, relatórios, faturas e listas que já possuem texto copiável.
            </p>

            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Quando usar esta ferramenta
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Faturas e Notas Fiscais</strong> geradas digitalmente que possuem tabelas de produtos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Relatórios e Planilhas</strong> exportados para PDF que você precisa editar novamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Listas e Tabelas</strong> em formato PDF que você quer organizar no Excel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                  <span><strong>Documentos Financeiros</strong> com dados tabulares que precisam de análise</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Como funciona
              </h2>
              <ol className="space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                  <div>
                    <strong>Faça upload do seu PDF:</strong> Clique na área de upload ou arraste seu arquivo PDF para a ferramenta.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                  <div>
                    <strong>Processamento automático:</strong> Nossa ferramenta identifica automaticamente as tabelas no PDF e extrai os dados.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                  <div>
                    <strong>Baixe o Excel:</strong> Cada página do PDF vira uma aba no Excel, mantendo a estrutura das tabelas.
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Dicas importantes
              </h2>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">•</span>
                  <span>Esta ferramenta é <strong>rápida e precisa</strong> para PDFs com texto selecionável.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">•</span>
                  <span>Se o seu PDF é uma <strong>imagem escaneada</strong>, use nossa ferramenta de <a href="/ocr" className="text-primary-600 hover:underline font-semibold">PDF Escaneado (OCR)</a>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">•</span>
                  <span>PDFs com <strong>múltiplas páginas</strong> são suportados - cada página vira uma aba no Excel.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1 flex-shrink-0">•</span>
                  <span>A ferramenta <strong>preserva a estrutura</strong> das tabelas, mantendo linhas e colunas organizadas.</span>
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
          
          <PDFUploader mode="text" />

          {/* Seção de perguntas frequentes */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mt-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Como saber se meu PDF tem texto selecionável?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Abra o PDF e tente selecionar o texto com o cursor do mouse. Se conseguir copiar o texto, use esta ferramenta. 
                  Se não conseguir (PDF é uma imagem), use nossa ferramenta de <a href="/ocr" className="text-primary-600 hover:underline">OCR</a>.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Qual o tamanho máximo do arquivo?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Recomendamos arquivos de até 10MB para melhor performance. Arquivos maiores podem levar mais tempo para processar.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Meus dados estão seguros?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Sim! Processamos tudo de forma temporária e não armazenamos seus arquivos. Após o processamento, os arquivos são deletados automaticamente.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">A conversão preserva formatação?</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Sim! Nossa ferramenta mantém a estrutura de tabelas, linhas e colunas. No entanto, formatações visuais como cores e fontes não são preservadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
